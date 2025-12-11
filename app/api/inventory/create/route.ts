import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

// Server-side route to create inventory using the service role key.
// This route verifies the requester's access token and ensures they are a staff/hr user
// before performing the insert with the service role key (bypassing RLS safely).
export async function POST(req: Request) {
  try {
    // Prefer explicit server config. Fall back to NEXT_PUBLIC_SUPABASE_URL default if present.
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "https://xpybqjfofdmkeiijvwnx.supabase.co"

    // Expect the client to forward the user's access token in Authorization header
    // For dev/testing, allow requests without a token; in production require it
    const authHeader = req.headers.get("authorization") || ""
    const token = authHeader.replace(/^Bearer\s+/i, "")
    console.log("[v0] API route received auth header:", authHeader ? "yes" : "no")
    console.log("[v0] Extracted token:", token ? "yes" : "no")
    
    const isProduction = process.env.NODE_ENV === "production"
    if (!token && isProduction) {
      return NextResponse.json({ error: "Missing Authorization token" }, { status: 401 })
    }

    const body = await req.json()

    // Service role must be provided in production. Allow a DEV-only fallback to anon key.
    // WARNING: This is insecure and only intended to unblock local development/testing.
    let serverKey = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE
    if (!serverKey) {
      if (process.env.NODE_ENV === "production") {
        const hint = "Set SUPABASE_SERVICE_ROLE env var (use your Supabase project's service_role key).\nIn PowerShell: $env:SUPABASE_SERVICE_ROLE='your-key'"
        return NextResponse.json({ error: `Missing SUPABASE_SERVICE_ROLE. ${hint}` }, { status: 500 })
      } else {
        serverKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        console.warn(
          "[v0] SUPABASE_SERVICE_ROLE not set — falling back to NEXT_PUBLIC_SUPABASE_ANON_KEY for local development (insecure)."
        )
      }
    }

    if (!serverKey) {
      const hint =
        "Set SUPABASE_SERVICE_ROLE env var (use your Supabase project's service_role key).\nIn PowerShell: $env:SUPABASE_SERVICE_ROLE='your-key'"
      return NextResponse.json({ error: `Missing SUPABASE_SERVICE_ROLE. ${hint}` }, { status: 500 })
    }

    // Only set Authorization header if we have a token
    const clientConfig: any = {}
    if (token) {
      clientConfig.global = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    }
    const supabase = createClient(supabaseUrl, serverKey, clientConfig)

    // Verify token and fetch the user (if token is present)
    let userId: string | null = null
    if (token) {
      const { data: userRes, error: userErr } = await supabase.auth.getUser(token as any)
      if (userErr || !userRes?.user) {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 })
      }
      userId = userRes.user.id
    } else {
      // DEV: allow token-less requests; just proceed without user verification
      console.warn("[v0] No token provided; skipping user verification (dev mode)")
    }

    // Check staff table if we have a user ID (optional in dev)
    if (userId) {
      const { data: staffRow, error: staffErr } = await supabase
        .from("staff")
        .select("id, role, user_id")
        .eq("user_id", userId)
        .limit(1)
        .maybeSingle()

      if (staffErr) {
        return NextResponse.json({ error: staffErr.message || String(staffErr) }, { status: 500 })
      }

      if (!staffRow || (staffRow.role && staffRow.role !== "hr" && staffRow.role !== "staff")) {
        return NextResponse.json({ error: "Forbidden: not a staff member" }, { status: 403 })
      }
    } else {
      console.warn("[v0] No user ID; skipping staff verification (dev mode)")
    }

    // simple snake_case conversion for known fields
    const payload: any = {}
    Object.entries(body || {}).forEach(([k, v]) => {
      const snake = k.replace(/[A-Z]/g, (m) => `_${m.toLowerCase()}`)
      payload[snake] = v
    })

    // Ensure required defaults
    if (typeof payload.quantity === "undefined") payload.quantity = 0
    if (typeof payload.min_quantity === "undefined") payload.min_quantity = 0
    if (!payload.status) payload.status = "ok"

    const { data, error } = await supabase.from("inventory").insert([payload]).select().single()
    if (error) {
      return NextResponse.json({ error: error.message || String(error) }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
