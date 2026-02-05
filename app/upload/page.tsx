"use client"

import { useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import Header from "@/components/Header"

export default function UploadPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    soul_md: "",
    agents_md: "",
    tools_md: "",
  })

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const file = e.target.files?.[0]
    if (file) {
      const text = await file.text()
      setFormData((prev) => ({ ...prev, [field]: text }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!session) {
      alert("Please sign in to upload agents")
      return
    }

    setLoading(true)

    try {
      const response = await fetch("/api/agents", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        alert("Agent uploaded successfully!")
        router.push("/")
      } else {
        const error = await response.json()
        alert(`Error: ${error.error}`)
      }
    } catch (error) {
      console.error("Error uploading agent:", error)
      alert("Failed to upload agent")
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-xl text-gray-600">
            Please sign in to upload agents
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Upload Agent Configuration
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Agent Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="My Awesome Agent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="A brief description of your agent..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              SOUL.md
            </label>
            <input
              type="file"
              accept=".md"
              onChange={(e) => handleFileUpload(e, "soul_md")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.soul_md && (
              <p className="text-sm text-green-600 mt-1">
                ✓ File loaded ({formData.soul_md.length} characters)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              AGENTS.md
            </label>
            <input
              type="file"
              accept=".md"
              onChange={(e) => handleFileUpload(e, "agents_md")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.agents_md && (
              <p className="text-sm text-green-600 mt-1">
                ✓ File loaded ({formData.agents_md.length} characters)
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              TOOLS.md
            </label>
            <input
              type="file"
              accept=".md"
              onChange={(e) => handleFileUpload(e, "tools_md")}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {formData.tools_md && (
              <p className="text-sm text-green-600 mt-1">
                ✓ File loaded ({formData.tools_md.length} characters)
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Uploading..." : "Upload Agent"}
          </button>
        </form>
      </main>
    </div>
  )
}
