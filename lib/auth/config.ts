import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { clients } from "./clients"

export const authConfig: NextAuthConfig = {
  pages: {
    signIn: "/portal",
  },
  callbacks: {
    jwt({ token, user }) {
      if (user) token.uid = user.id
      return token
    },
    session({ session, token }) {
      session.user.id = token.uid as string
      return session
    },
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        const { email, password } = credentials as {
          email: string
          password: string
        }
        const client = clients.find((c) => c.email === email)
        if (!client) return null
        const valid = await bcrypt.compare(password, client.hashedPassword)
        if (!valid) return null
        return {
          id: client.uid,
          email: client.email,
          name: client.contactName,
        }
      },
    }),
  ],
}
