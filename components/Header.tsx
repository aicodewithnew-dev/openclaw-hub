"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"

export default function Header() {
  const { data: session } = useSession()

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="text-2xl font-bold text-blue-600">
          OpenClaw Hub
        </Link>
        <div className="flex items-center gap-4">
          {session ? (
            <>
              <Link
                href="/upload"
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                Upload Agent
              </Link>
              <div className="flex items-center gap-2">
                {session.user?.image && (
                  <img
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    className="w-8 h-8 rounded-full"
                  />
                )}
                <span className="text-gray-700">{session.user?.name}</span>
              </div>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 transition"
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition"
            >
              Sign in with GitHub
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
