import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { supabase } from "@/lib/supabase"

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions)

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const body = await request.json()
  const { agent_id } = body

  // Get user ID from Supabase
  const { data: user } = await supabase
    .from("users")
    .select("id")
    .eq("username", session.user.name)
    .single()

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 })
  }

  // Check if already liked
  const { data: existingLike } = await supabase
    .from("likes")
    .select("*")
    .eq("user_id", user.id)
    .eq("agent_id", agent_id)
    .single()

  if (existingLike) {
    // Unlike
    const { error } = await supabase
      .from("likes")
      .delete()
      .eq("user_id", user.id)
      .eq("agent_id", agent_id)

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ liked: false })
  } else {
    // Like
    const { error } = await supabase
      .from("likes")
      .insert({
        user_id: user.id,
        agent_id,
      })

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ liked: true })
  }
}
