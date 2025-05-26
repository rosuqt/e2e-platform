import NextAuth, { type NextAuthOptions } from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import CredentialsProvider from "next-auth/providers/credentials"
import supabase from "@/lib/supabase"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: "common",
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

        const { data: user } = await supabase
          .from("registered_employers")
          .select("id, email, password")
          .eq("email", email)
          .single()

        console.log("CredentialsProvider authorize: user from db:", user)

        if (user && bcrypt.compareSync(password, user.password)) {
          const userWithRole = { id: user.id, email: user.email, role: "employer" }
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
          let firstName = ""
          let lastName = ""
          if (u.name) {
            const nameParts = u.name.trim().split(/\s+/)
            if (nameParts.length === 1) {
              firstName = nameParts[0]
              lastName = ""
            } else {
              firstName = nameParts.slice(0, -1).join(" ")
              lastName = nameParts[nameParts.length - 1]
            }
          }
          const { data: existingStudent } = await supabase
            .from("registered_students")
            .select("id")
            .eq("email", u.email)
            .single()
          if (!existingStudent) {
            await supabase
              .from("registered_students")
              .insert({ email: u.email, first_name: firstName, last_name: lastName })
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
      } else if ((user as UserWithNewStudent)?.role) {
        token.role = (user as UserWithNewStudent).role
        token.employerId = (user as UserWithNewStudent).id
      }
      if ((user as unknown as { studentId?: string })?.studentId) {
        token.studentId = (user as unknown as { studentId: string }).studentId
      }
      // console.log("JWT callback: token after:", token)
      return token
    },

    async session({ session, token }) {
      console.log("Session callback: session before:", session, "token:", token)
      if (!session.user) {
        session.user = {}
      }
      (session.user as { role?: string }).role = token.role as string
      if (token.role === "employer" && token.employerId) {
        (session.user as { employerId?: string }).employerId = token.employerId as string
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
      console.log("Session callback: session after:", session)
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }

type UserWithNewStudent = {
  email?: string;
  name?: string;
  newStudent?: boolean;
  role?: string;
  id?: string;
};
