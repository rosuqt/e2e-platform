import type NextAuth from "next-auth"


declare module "next-auth" {
  interface Session {
    user: {
      id?: strtin | null
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string | null
    }
  }

  interface User {
    role?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null
  }
}
