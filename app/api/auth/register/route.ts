import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export async function POST(req: Request) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://xpybqjfofdmkeiijvwnx.supabase.co"

    const body = await req.json()
    const { email, password, name, phone } = body

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    // Use service role for server-side registration; fall back to anon key for demos
    const serverKey =
      process.env.SUPABASE_SERVICE_ROLE ||
      process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE ||
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!serverKey) {
      return NextResponse.json(
        { error: "Server configuration error: SUPABASE_SERVICE_ROLE not set" },
        { status: 500 },
      )
    }

    const supabase = createClient(supabaseUrl, serverKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    // Check if user already exists
    const { data: existing, error: getErr } = await supabase
      .from("auth_users")
      .select("*")
      .eq("email", email)
      .maybeSingle()

    if (getErr) {
      console.error("[v0] Error checking existing auth user:", getErr)
      return NextResponse.json({ error: "Registration failed" }, { status: 500 })
    }

    if (existing) {
      return NextResponse.json({ status: "exists", user: existing }, { status: 409 })
    }

    // Create auth_users entry
    const { data: createdAuth, error: insertErr } = await supabase
      .from("auth_users")
      .insert([
        { email, password_hash: password, name, role: "patient", phone: phone || null },
      ])
      .select()
      .single()

    if (insertErr || !createdAuth) {
      console.error("[v0] Error creating auth user:", insertErr)
      return NextResponse.json({ error: "Registration failed" }, { status: 500 })
    }

    // Create patients row
    const { data: patientRow, error: patientErr } = await supabase
      .from("patients")
      .insert([
        { user_id: createdAuth.id, name, email, phone: phone || null },
      ])
      .select()
      .single()

    if (patientErr) {
      console.warn("[v0] Warning creating patient row:", patientErr)
    }

    return NextResponse.json({
      status: "created",
      user: {
        id: createdAuth.id,
        email: createdAuth.email,
        name: createdAuth.name,
        role: "patient",
        phone: createdAuth.phone,
      }
    })
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error("[v0] Registration API error:", msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
