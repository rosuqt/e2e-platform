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
      tenantId: process.env.AZURE_AD_TENANT_ID,
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
          .select("id, email, password, first_name, last_name, verify_status")
          .eq("email", email)
          .maybeSingle() 

        if (error) {
          console.error("CredentialsProvider authorize: error from db:", error)
        }
        console.log("CredentialsProvider authorize: user from db:", user)

        if (user && bcrypt.compareSync(password, user.password)) {

          const userWithRole = {
            id: user.id,
            email: user.email,
            role: "employer",
            firstName: user.first_name,
            lastName: user.last_name,
            verifyStatus: user.verify_status
          }
          console.log("CredentialsProvider authorize: returning userWithRole:", userWithRole)
          return userWithRole
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
          console.log("AzureAD signIn: original email received:", u.email);
          const normalizedEmail = u.email.trim().toLowerCase();
          console.log("AzureAD signIn: normalized email received:", normalizedEmail);
          if (
            !normalizedEmail.endsWith("@alabang.sti.edu.ph") &&
            normalizedEmail !== "alro8612140@gmail.com"
          ) {
            return "/sign-in?error=invalid_domain"
          }
          let firstName = ""
          let lastName = ""
          if (u.name) {
            const nameNoParen = u.name.replace(/\(.*?\)/g, "").trim()
            const parts = nameNoParen.split(",")
            if (parts.length === 2) {
              lastName = parts[0].trim()
              firstName = parts[1].trim()
            } else {
              firstName = nameNoParen.trim()
              lastName = ""
            }
          }
          // Use normalizedEmail for all DB operations
          const { data: existingStudent } = await supabase
            .from("registered_students")
            .select("id")
            .eq("email", normalizedEmail)
            .single()
          if (!existingStudent) {
            await supabase
              .from("registered_students")
              .insert({ email: normalizedEmail, first_name: firstName, last_name: lastName })
            u.newStudent = true
          } else {
            u.newStudent = false
          }
        }
        return true
      }
      return true
    },

    async jwt({ token, user, account }) {
      // console.log("JWT callback: token before:", token, "user:", user, "account:", account)
      if (account?.provider === "azure-ad") {
        token.role = "student"
        const u = user as UserWithNewStudent;
        if (u && typeof u === "object" && "newStudent" in u) {
          token.newStudent = u.newStudent
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
        token.role = employerUser.role;
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
      } 
    
      if (
        !token.role &&
        user &&
        typeof user === "object" &&
        "role" in user
      ) {
        token.role = (user as { role: string }).role;
      }
      if ((user as unknown as { studentId?: string })?.studentId) {
        token.studentId = (user as unknown as { studentId: string }).studentId
      }
      // console.log("JWT callback: token after:", token)
      return token
    },

    async session({ session, token }) {
     //console.log("Session callback: session before:", session, "token:", token)
      if (!session.user) {
        session.user = {}
      }
      (session.user as { role?: string }).role = token.role as string
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
      if (token.email) {
        session.user.email = token.email as string
      }
      if (token.name) {
        session.user.name = token.name as string
      }
      if (token.image) {
        session.user.image = token.image as string
      }
      if (token.role === "student" && "newStudent" in token) {
        (session.user as { newStudent?: boolean }).newStudent = token.newStudent as boolean
      }
 //console.log("Session callback: session after:", session)
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}