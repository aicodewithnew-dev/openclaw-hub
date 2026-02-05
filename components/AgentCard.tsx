"use client"

import Link from "next/link"

interface AgentCardProps {
  agent: {
    id: string
    name: string
    description: string | null
    likes_count: number
    created_at: string
    users: {
      username: string
      avatar_url: string | null
    }
  }
  onLike: () => void
}

export default function AgentCard({ agent, onLike }: AgentCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <Link href={`/agent/${agent.id}`}>
            <h3 className="text-xl font-bold text-gray-900 hover:text-blue-600 transition">
              {agent.name}
            </h3>
          </Link>
          <p className="text-sm text-gray-500 mt-1">
            by {agent.users.username}
          </p>
        </div>
        {agent.users.avatar_url && (
          <img
            src={agent.users.avatar_url}
            alt={agent.users.username}
            className="w-10 h-10 rounded-full"
          />
        )}
      </div>

      {agent.description && (
        <p className="text-gray-600 mb-4 line-clamp-3">{agent.description}</p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-gray-200">
        <button
          onClick={onLike}
          className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition"
        >
          <svg
            className="w-5 h-5"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fillRule="evenodd"
              d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
              clipRule="evenodd"
            />
          </svg>
          <span>{agent.likes_count}</span>
        </button>
        <span className="text-sm text-gray-500">
          {new Date(agent.created_at).toLocaleDateString()}
        </span>
      </div>
    </div>
  )
}
