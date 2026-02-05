import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import { supabase } from "@/lib/supabase"

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account, profile }: any) {
      if (account.provider === "github") {
        // Check if user exists in Supabase
        const { data: existingUser } = await supabase
          .from("users")
          .select("*")
          .eq("github_id", profile.id.toString())
          .single()

        if (!existingUser) {
          // Create new user
          await supabase.from("users").insert({
            github_id: profile.id.toString(),
            username: profile.login,
            avatar_url: profile.avatar_url,
          })
        }
      }
      return true
    },
    async session({ session, token }: any) {
      if (session.user) {
        // Get user from Supabase
        const { data: user } = await supabase
          .from("users")
          .select("*")
          .eq("username", session.user.name)
          .single()

        if (user) {
          session.user.id = user.id
        }
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
  },
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
