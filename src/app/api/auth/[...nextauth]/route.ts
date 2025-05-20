import NextAuth, { type NextAuthOptions } from "next-auth"
import AzureADProvider from "next-auth/providers/azure-ad"
import CredentialsProvider from "next-auth/providers/credentials"
import { supabase } from "@/lib/supabaseClient"
import bcrypt from "bcryptjs"

export const authOptions: NextAuthOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!,
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

        if (user && bcrypt.compareSync(password, user.password)) {
          return { id: user.id, email: user.email, role: "employer" }
        }

        return null
      },
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "azure-ad") {
        const { data: student } = await supabase
          .from("students")
          .select("id")
          .eq("email", user.email)
          .single()

        if (!student) {
          await supabase.from("students").insert({ email: user.email })
        }
        return true
      }

      return true
    },

    async jwt({ token, user, account }) {
      if (account?.provider === "azure-ad") {
        token.role = "student"
      } else if (user?.role) {
        token.role = user.role
      }
      return token
    },

    async session({ session, token }) {
      if (session.user) {
        (session.user as { role?: string }).role = token.role as string
      }
      return session
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)
export { handler as GET, handler as POST }
