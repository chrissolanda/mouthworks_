import { NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceRole = process.env.SUPABASE_SERVICE_ROLE || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Only return the specific emails requested if they exist in auth
const TARGET_EMAILS = [
  "hr@mouthworks.com",
  "sarah.smith@dental.com",
  "john.doe@dental.com",
  "emily.johnson@dental.com",
  "michael.chen@dental.com",
  "lisa.anderson@dental.com",
]

export async function GET(_req: NextRequest) {
  try {
    const supabase = createClient(supabaseUrl, supabaseServiceRole, {
      auth: { autoRefreshToken: false, persistSession: false },
    })

    // Query profile tables to map emails to roles
    // We can't list auth.users via anon; use service role to query application tables
    const { data: dentists, error: dentistsErr } = await supabase
      .from("dentists")
      .select("name, email")
      .in("email", TARGET_EMAILS)

    const { data: patients, error: patientsErr } = await supabase
      .from("patients")
      .select("name, email")
      .in("email", TARGET_EMAILS)

    // HR/admin may be stored in a staff table; fallback to static email if not found
    const hrEmail = "hr@mouthworks.com"

    if (dentistsErr) console.warn("Error fetching dentists:", dentistsErr.message)
    if (patientsErr) console.warn("Error fetching patients:", patientsErr.message)

    const entries: Array<{ role: string; name: string; email: string }> = []

    // HR entry
    entries.push({ role: "hr", name: "HR/Admin", email: hrEmail })

    // Dentist entries from DB
    ;(dentists || []).forEach((d) => {
      entries.push({ role: "dentist", name: d.name || "Dentist", email: d.email })
    })

    // If specific dentists missing from DB, still include as selectable emails
    TARGET_EMAILS.filter((e) => e.endsWith("@dental.com")).forEach((email) => {
      if (!entries.find((x) => x.email === email)) {
        entries.push({ role: "dentist", name: email.split("@")[0], email })
      }
    })

    // Patient examples (optional)
    ;(patients || []).forEach((p) => {
      entries.push({ role: "patient", name: p.name || "Patient", email: p.email })
    })

    return NextResponse.json(entries)
  } catch (err) {
    console.error("Quicklogins API error:", err)
    return NextResponse.json({ error: "Failed to load quick login users" }, { status: 500 })
  }
}
