import type NextAuth from "next-auth"


declare module "next-auth" {
  interface Session {
    user: {
      name?: string | null
      email?: string | null
      image?: string | null
      role?: string | null
      studentId?: string
    }
  }

  interface User {
    role?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role?: string | null
    studentId?: string
    employerId?: string
    adminID?: string
    firstName?: string
    lastName?: string
    department?: string
    username?: string
    verifyStatus?: string
    company_admin?: boolean
    company_id?: string
    newStudent?: boolean
  }
}
