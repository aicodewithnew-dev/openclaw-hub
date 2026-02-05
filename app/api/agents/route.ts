import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { supabase } from "@/lib/supabase"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const search = searchParams.get("search")

  let query = supabase
    .from("agents")
    .select(`
      *,
      users (
        username,
        avatar_url
      )
    `)
    .order("created_at", { ascending: false })

  if (search) {
    query = query.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
  }

  const { data: agents, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(agents)
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { name, description, soul_md, agents_md, tools_md, other_files } = body

  // Get user ID from Supabase
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("username", session.user.name)
    .single()

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  const { data: agent, error } = await supabase
    .from("agents")
    .insert({
      user_id: user.id,
      name,
      description,
      soul_md,
      agents_md,
      tools_md,
      other_files,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(agent)
}
