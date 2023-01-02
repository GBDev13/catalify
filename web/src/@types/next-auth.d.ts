import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    id: string
    firstName: string
    lastName?: string
    email: string
    access_token: string
  }

  interface Session {
    user: User
  }
}