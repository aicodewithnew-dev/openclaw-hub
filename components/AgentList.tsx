"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import AgentCard from "./AgentCard"

interface Agent {
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

export default function AgentList() {
  const [agents, setAgents] = useState<Agent[]>([])
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(true)
  const { data: session } = useSession()

  useEffect(() => {
    fetchAgents()
  }, [search])

  const fetchAgents = async () => {
    setLoading(true)
    try {
      const url = search
        ? `/api/agents?search=${encodeURIComponent(search)}`
        : "/api/agents"
      const response = await fetch(url)
      const data = await response.json()
      setAgents(data)
    } catch (error) {
      console.error("Error fetching agents:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLike = async (agentId: string) => {
    if (!session) {
      alert("Please sign in to like agents")
      return
    }

    try {
      const response = await fetch("/api/likes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ agent_id: agentId }),
      })

      if (response.ok) {
        fetchAgents()
      }
    } catch (error) {
      console.error("Error liking agent:", error)
    }
  }

  return (
    <div>
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search agents by name or description..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : agents.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          No agents found. Be the first to upload one!
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => (
            <AgentCard
              key={agent.id}
              agent={agent}
              onLike={() => handleLike(agent.id)}
            />
          ))}
        </div>
      )}
    </div>
  )
}
