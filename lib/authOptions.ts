import { type NextAuthOptions } from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import CredentialsProvider from "next-auth/providers/credentials"
import supabase from "@/lib/supabase"
import bcrypt from "bcryptjs"

export type UserWithNewStudent = {
  email?: string;
  name?: string;
  newStudent?: boolean;
  role?: string;
  id?: string;
};

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID || "common",
      authorization: {
        params: {
          scope: "openid profile email",
        },
      },
    }),

    CredentialsProvider({
      name: "Employer Login",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { email, password } = credentials ?? {}
        if (!email || !password) return null

        const { data: user, error } = await supabase
          .from("registered_employers")
          .select("id, email, password, first_name, last_name, verify_status, is_archived")
          .eq("email", email)
          .maybeSingle() 

        if (error) {
          console.error("CredentialsProvider authorize: error from db:", error)
        }

        // Archive logic: Block login if account is archived
        if (user && user.is_archived) {
          throw new Error("Account is archived and cannot be logged in")
        }

        if (user && bcrypt.compareSync(password, user.password)) {

          const userWithRole = {
            id: user.id,
            email: user.email,
            role: "employer",
            firstName: user.first_name,
            lastName: user.last_name,
            verifyStatus: user.verify_status
          }
          return userWithRole
        }

        return null
      },
    }),
    CredentialsProvider({
      id: "admin-login",
      name: "Admin Login",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const { username, password } = credentials ?? {}
        if (!username || !password) return null

        const { data: admin, error } = await supabase
          .from("registered_admins")
          .select("id, username, password, first_name, last_name, department, superadmin, is_archived")
          .eq("username", username)
          .maybeSingle()

        if (error) {
          console.error("Admin CredentialsProvider authorize: error from db:", error)
        }
        // Archive logic: Block login if admin is archived
        if (admin && admin.is_archived) {
          throw new Error("Account is archived and cannot be logged in")
        }
        if (admin && bcrypt.compareSync(password, admin.password)) {
          return {
            id: admin.id,
            adminID: admin.id,
            username: admin.username,
            firstName: admin.first_name,
            lastName: admin.last_name,
            department: admin.department,
            role: admin.superadmin ? "superadmin" : "admin"
          }
        }
        return null
      },
    }),
  ],

  pages: {
    signIn: "/", 
  },

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "azure-ad") {
        const u = user as UserWithNewStudent;
        if (u.email) {
          const normalizedEmail = u.email.trim().toLowerCase();
          if (
            !normalizedEmail.endsWith("@alabang.sti.edu.ph") &&
            normalizedEmail !== "alro8612140@gmail.com" && normalizedEmail !== "seekr.assist@gmail.com"
          ) {
            return "/sign-in?error=invalid_domain"
          }
          
          const localPart = normalizedEmail.split("@")[0];
          
          const studentEmailPattern = /^[^.]+\.\d+$/;
          const isStudentEmail = studentEmailPattern.test(localPart);
          
          if (!isStudentEmail && localPart.includes(".")) {
            const parts = localPart.split(".");
            if (parts.length >= 2) {
              const emailFirstName = parts[0].toLowerCase();
              const emailLastName = parts.slice(1).join(".").toLowerCase();
              
              const { data: admin, error: adminError } = await supabase
                .from("registered_admins")
                .select("id, first_name, last_name, status, is_archived")
                .ilike("first_name", emailFirstName)
                .ilike("last_name", emailLastName)
                .eq("status", "active")
                .eq("is_archived", false)
                .maybeSingle();
              
              if (adminError) {
                console.error("Error checking registered_admins:", adminError);
                return "/sign-in?error=admin_check_failed"
              }
              
              if (!admin) {
                return "/sign-in?error=admin_not_registered"
              }
            }
          }
          
          if (isStudentEmail) {
            let firstName = ""
            let lastName = ""
            if (u.name) {
              const nameNoParen = u.name.replace(/\(.*?\)/g, "").trim()
              if (nameNoParen.includes(",")) {
                const [last, ...firstParts] = nameNoParen.split(",")
                firstName = firstParts.join(",").trim()
                lastName = last.trim()
              } else {
                firstName = nameNoParen
                lastName = ""
              }
            }
            
            // Archive logic: Block login if student is archived
            const { data: existingStudent } = await supabase
              .from("registered_students")
              .select("id, is_archived")
              .eq("email", normalizedEmail)
              .single()

            if (existingStudent && existingStudent.is_archived === true) {
              return `/sign-in?error=archived_account`;
            }
            
            if (!existingStudent) {
              await supabase
                .from("registered_students")
                .insert({ email: normalizedEmail, first_name: firstName, last_name: lastName })
              u.newStudent = true
            } else {
              u.newStudent = false
            }
          }
        }
        return true
      }
      return true
    },

    async jwt({ token, user, account }) {
      if (account?.provider === "azure-ad") {
        token.role = "student"
        const u = user as UserWithNewStudent;
        if (u && typeof u === "object" && "newStudent" in u) {
          token.newStudent = u.newStudent
        }
        if (u && typeof u === "object" && "name" in u && u.name) {
          token.name = u.name
        }
 
        if (token.email) {
          const { data: student } = await supabase
            .from("registered_students")
            .select("id")
            .eq("email", token.email)
            .single()
          if (student?.id) {
            token.studentId = student.id
          }
        }
      } else if ((user as UserWithNewStudent)?.role === "employer") {

        type EmployerUser = {
          id: string;
          email: string;
          role: string;
          firstName: string;
          lastName: string;
          verifyStatus?: string;
        };
        const employerUser = user as EmployerUser;
        token.role = "employer"
        token.employerId = employerUser.id;
        token.firstName = employerUser.firstName;
        token.lastName = employerUser.lastName;
        if (employerUser.verifyStatus) {
          token.verifyStatus = employerUser.verifyStatus;
        }
        const { data: employerData } = await supabase
          .from("registered_employers")
          .select("company_admin, company_id")
          .eq("id", employerUser.id)
          .single()
        if (employerData?.company_admin !== undefined) {
          token.company_admin = employerData.company_admin
        }
        if (employerData?.company_id !== undefined) {
          token.company_id = employerData.company_id
        }
      } else if ((user as { role?: string })?.role === "admin" || (user as { role?: string })?.role === "superadmin") {
        const adminUser = user as unknown as {
          adminID: string
          username: string
          firstName: string
          lastName: string
          department: string
          role: string
        }
        token.role = adminUser.role
        token.adminID = adminUser.adminID
        token.firstName = adminUser.firstName
        token.lastName = adminUser.lastName
        token.department = adminUser.department
        token.username = adminUser.username 
      }
      return token
    },

    async session({ session, token, user }) {
      if (!session.user) {
        session.user = {}
      }
      session.user.role = token.role as string
      if (token.role === "employer" && token.employerId) {
        (session.user as { employerId?: string }).employerId = token.employerId as string
        (session.user as { firstName?: string }).firstName = token.firstName as string
        (session.user as { lastName?: string }).lastName = token.lastName as string
        if (token.verifyStatus) {
          (session.user as { verifyStatus?: string }).verifyStatus = token.verifyStatus as string
        }
        (session.user as { company_admin?: boolean }).company_admin = !!token.company_admin
        if (token.company_id) {
          (session.user as { company_id?: string }).company_id = token.company_id as string
        }
      }
      if (token.role === "student" && token.studentId) {
        (session.user as { studentId?: string }).studentId = token.studentId as string
      } else if (token.role === "student" && token.email) {
        const { data: student } = await supabase
          .from("registered_students")
          .select("id")
          .eq("email", token.email)
          .single()
        if (student?.id) {
          (session.user as { studentId?: string }).studentId = student.id
        }
      }
      if (token.role === "admin" || token.role === "superadmin") {
        if (token.adminID) {
          (session.user as { adminID?: string }).adminID = token.adminID as string
        }
        (session.user as { firstName?: string }).firstName = token.firstName as string
        (session.user as { lastName?: string }).lastName = token.lastName as string
        (session.user as { department?: string }).department = token.department as string
        if (token.username) {
          (session.user as { username?: string }).username = token.username as string
        }
      }
      if (token.email) {
        session.user.email = token.email as string
      }
      if (token.name) {
        session.user.name = token.name as string
      } else if (token.firstName && token.lastName) {
        session.user.name = `${token.firstName} ${token.lastName}`
      } else if (user && typeof user === "object" && "name" in user && user.name) {
        session.user.name = user.name as string
      }
      if (token.image) {
        session.user.image = token.image as string
      }
      if (token.role === "student" && "newStudent" in token) {
        (session.user as { newStudent?: boolean }).newStudent = token.newStudent as boolean
      }

      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
  debug: true,

  session: {
    strategy: "jwt", 
  },
}