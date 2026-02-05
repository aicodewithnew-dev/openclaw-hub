import { notFound } from "next/navigation"
import Header from "@/components/Header"
import { supabase } from "@/lib/supabase"

async function getAgent(id: string) {
  const { data: agent, error } = await supabase
    .from("agents")
    .select(`
      *,
      users (
        username,
        avatar_url
      )
    `)
    .eq("id", id)
    .single()

  if (error || !agent) {
    return null
  }

  return agent
}

export default async function AgentPage({
  params,
}: {
  params: { id: string }
}) {
  const agent = await getAgent(params.id)

  if (!agent) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-start justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {agent.name}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                {agent.users.avatar_url && (
                  <img
                    src={agent.users.avatar_url}
                    alt={agent.users.username}
                    className="w-6 h-6 rounded-full"
                  />
                )}
                <span>by {agent.users.username}</span>
                <span>•</span>
                <span>{new Date(agent.created_at).toLocaleDateString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="text-xl font-semibold">{agent.likes_count}</span>
            </div>
          </div>

          {agent.description && (
            <div className="mb-8">
              <p className="text-gray-700 text-lg">{agent.description}</p>
            </div>
          )}

          <div className="space-y-6">
            {agent.soul_md && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  SOUL.md
                </h2>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {agent.soul_md}
                </pre>
              </div>
            )}

            {agent.agents_md && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  AGENTS.md
                </h2>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {agent.agents_md}
                </pre>
              </div>
            )}

            {agent.tools_md && (
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-3">
                  TOOLS.md
                </h2>
                <pre className="bg-gray-50 p-4 rounded-lg overflow-x-auto text-sm">
                  {agent.tools_md}
                </pre>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
