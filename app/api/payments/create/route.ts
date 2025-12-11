import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const isUuid = (value: any) => typeof value === "string" && /^[0-9a-fA-F-]{36}$/.test(value)

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export async function POST(request: NextRequest) {
  try {
    const paymentData = await request.json()
    
    console.log("[v0] 💾 Server-side payment creation:", paymentData)

    if (!isUuid(paymentData?.dentist_id)) {
      console.error("[v0] ❌ Invalid dentist_id provided:", paymentData?.dentist_id)
      return NextResponse.json({ error: "Invalid dentist_id" }, { status: 400 })
    }

    // Use service role client to bypass RLS
    const supabase = createClient(supabaseUrl, supabaseServiceRole, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })

    const { data, error } = await supabase
      .from("payments")
      .insert([paymentData])
      .select("*, patients(name), dentists(name)")
      .single()

    if (error) {
      console.error("[v0] ❌ Server payment creation failed:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    console.log("[v0] ✅ Payment created successfully:", data)
    return NextResponse.json(data)
  } catch (err) {
    console.error("[v0] ❌ Server error:", err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Unknown error" },
      { status: 500 }
    )
  }
}
