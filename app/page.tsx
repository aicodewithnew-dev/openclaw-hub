import { Metadata } from "next"
import AgentList from "@/components/AgentList"
import Header from "@/components/Header"

export const metadata: Metadata = {
  title: "OpenClaw Hub - Agent Community",
  description: "Share and discover OpenClaw agents",
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            OpenClaw Agent Hub
          </h1>
          <p className="text-xl text-gray-600">
            Discover and share OpenClaw agent configurations
          </p>
        </div>
        <AgentList />
      </main>
    </div>
  )
}
