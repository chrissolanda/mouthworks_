"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { getSupabaseClient } from "./supabase-client"

export type UserRole = "patient" | "dentist" | "hr"

export interface User {
  id: string
  email: string
  name: string
  role: UserRole
  phone?: string
  specialization?: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  patientAutoApproved?: boolean
  register: (email: string, password: string, name: string, phone?: string) => Promise<any>
  logout: () => void
  isAuthenticated: boolean
  showPatientRegistration: boolean
  savePatientProfile: (name: string, phone?: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [showPatientRegistration, setShowPatientRegistration] = useState(false)
  const [patientAutoApproved, setPatientAutoApproved] = useState(false)

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const supabase = getSupabaseClient()
        const {
          data: { user: authUser },
          error,
        } = await supabase.auth.getUser()

        if (authUser && !error) {
          const emailStr = authUser.email || ""
          const roleFromMeta = authUser.user_metadata?.role || "patient"
          const isGmail = emailStr.toLowerCase().endsWith("@gmail.com")
          setUser({
            id: authUser.id,
            email: emailStr,
            name: authUser.user_metadata?.name || emailStr || "",
            role: roleFromMeta,
            phone: authUser.user_metadata?.phone,
            specialization: authUser.user_metadata?.specialization,
          })
          // For Gmail patients, do not show registration modal; mark as auto-approved
          if (roleFromMeta === "patient" && isGmail) {
            setShowPatientRegistration(false)
            setPatientAutoApproved(true)
            // Ensure a patient row exists for Gmail users so booking and payments work
            try {
              const { patientService } = await import("./db-service")
              const existingPatient = await patientService.getByEmail(emailStr)
              if (!existingPatient) {
                await patientService.create({
                  name: authUser.user_metadata?.name || emailStr,
                  email: emailStr,
                  phone: authUser.user_metadata?.phone || null,
                  dob: null,
                  gender: null,
                  address: null,
                })
              }
            } catch (err) {
              console.warn("[v0] Could not auto-create patient record for Gmail user:", err)
            }
          }
        }
      } catch (error) {
        console.error("[v0] Auth initialization error:", error)
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    // First try to authenticate against the `auth_users` table (registered users)
    try {
      const supabase = getSupabaseClient()
      const { data: authUser, error } = await supabase.from("auth_users").select("*").eq("email", email).maybeSingle()
      if (error) {
        console.warn("[v0] Supabase error checking auth_users:", error)
      }
      if (authUser) {
        // simple password check (password_hash stores the password in this demo app)
        if (authUser.password_hash === password) {
          const userObj: User = {
            id: authUser.id,
            email: authUser.email,
            name: authUser.name || authUser.email,
            role: authUser.role as UserRole,
            phone: authUser.phone || undefined,
            specialization: authUser.specialization || undefined,
          }
          setUser(userObj)
          localStorage.setItem("user", JSON.stringify(userObj))
          // If this is a patient and they don't have a patients row, prompt for profile
          // but if they're signing in with Gmail, auto-approve and do not show modal
          const isGmail = (userObj.email || "").toLowerCase().endsWith("@gmail.com")
          if (userObj.role === "patient") {
            if (isGmail) {
              setShowPatientRegistration(false)
              setPatientAutoApproved(true)
              // Ensure a patient row exists for Gmail logins
              try {
                const { patientService } = await import("./db-service")
                const existingPatient = await patientService.getByEmail(userObj.email)
                if (!existingPatient) {
                  await patientService.create({
                    name: userObj.name || userObj.email,
                    email: userObj.email,
                    phone: userObj.phone || null,
                    dob: null,
                    gender: null,
                    address: null,
                  })
                }
              } catch (err) {
                console.warn("[v0] Could not auto-create patient record after login:", err)
              }
            } else {
              setShowPatientRegistration(true)
              setPatientAutoApproved(false)
            }
          }
          return
        } else {
          throw new Error("Invalid credentials")
        }
      }

    } catch (err) {
      console.warn("[v0] Error authenticating against auth_users:", err)
    }

    // If no auth_users match, try Supabase Auth sign-in (for accounts created via Supabase)
    try {
      const supabase = getSupabaseClient()
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) {
        // Not authenticated via Supabase - proceed to mock users handling below
        console.warn("[v0] Supabase auth signIn error:", error)
      } else if (data && data.user) {
        const authUser = data.user
        const roleFromMeta = (authUser.user_metadata as any)?.role || "patient"
        const userObj: User = {
          id: authUser.id,
          email: authUser.email || email,
          name: (authUser.user_metadata as any)?.name || authUser.email || email,
          role: roleFromMeta as UserRole,
          phone: (authUser.user_metadata as any)?.phone || undefined,
          specialization: (authUser.user_metadata as any)?.specialization || undefined,
        }
        setUser(userObj)
        localStorage.setItem("user", JSON.stringify(userObj))

        // For patient users, handle registration modal and auto-approval
        if (userObj.role === "patient") {
          // Gmail patients auto-approve
          const isGmail = (userObj.email || "").toLowerCase().endsWith("@gmail.com")
          if (isGmail) {
            setShowPatientRegistration(false)
            setPatientAutoApproved(true)
          } else {
            // Non-Gmail patients created via Supabase Auth: don't show registration modal
            // (they already have an auth account), just set auto-approved
            setShowPatientRegistration(false)
            setPatientAutoApproved(true)
          }
          
          // Ensure patient record exists in database
          try {
            const { patientService } = await import("./db-service")
            const existingPatient = await patientService.getByEmail(userObj.email)
            if (!existingPatient) {
              await patientService.create({
                name: userObj.name || userObj.email,
                email: userObj.email,
                phone: userObj.phone || null,
                dob: null,
                gender: null,
                address: null,
              })
            }
          } catch (err) {
            console.warn("[v0] Could not auto-create patient record after supabase login:", err)
          }
        }

        return
      }
    } catch (err) {
      console.warn("[v0] Error authenticating via Supabase auth:", err)
    }

    throw new Error("Invalid credentials")
  }

  const register = async (email: string, password: string, name: string, phone?: string) => {
    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, name, phone }),
      })

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 409 && data.status === "exists") {
          return { status: "exists", user: data.user }
        }
        throw new Error(data.error || "Registration failed")
      }

      const userObj: User = {
        id: data.user.id,
        email: data.user.email,
        name: data.user.name,
        role: "patient",
        phone: data.user.phone || phone || undefined,
      }
      setUser(userObj)
      localStorage.setItem("user", JSON.stringify(userObj))
      setShowPatientRegistration(false)
      return { status: "created", user: userObj }
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err)
      console.error("[v0] Registration error:", errorMsg)
      throw err
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    const supabase = getSupabaseClient()
    supabase.auth.signOut()
  }

  const savePatientProfile = async (name: string, phone?: string) => {
    try {
      if (!user || user.role !== "patient") {
        throw new Error("Only patients can register")
      }

      // Import patientService dynamically to avoid circular imports
      const { patientService } = await import("./db-service")

      // Check for duplicate patient name
      const existingPatient = await patientService.getByName(name)
      if (existingPatient) {
        throw new Error(`Patient with name '${name}' already exists. Please use a different name.`)
      }

      // Create patient record in database
      const newPatient = await patientService.create({
        name: name,
        email: user.email,
        phone: phone || null,
        dob: null,
        gender: null,
        address: null,
      })

      // Ensure an auth_users row exists for this email
      try {
        const supabase = getSupabaseClient()
        const { data: existingAuthUser, error: authErr } = await supabase.from("auth_users").select("*").eq("email", user.email).maybeSingle()
        if (authErr) {
          console.warn("[v0] Warning checking auth_users:", authErr)
        }
        if (!existingAuthUser) {
          const { error: insertErr } = await supabase.from("auth_users").insert([
            {
              email: user.email,
              name: name,
              role: "patient",
              phone: phone || null,
            },
          ])
          if (insertErr) {
            console.warn("[v0] Warning inserting auth_users record:", insertErr)
          }
        }
      } catch (err) {
        console.warn("[v0] Warning ensuring auth_users record:", err)
      }

      if (newPatient) {
        // Update user state with the new patient info
        const updatedUser = { ...user, name: name, phone: phone }
        setUser(updatedUser)
        localStorage.setItem("user", JSON.stringify(updatedUser))
        setShowPatientRegistration(false)
      }
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error("[v0] Error saving patient profile:", errorMsg)
      throw error
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        // Disable patient registration modal flow
        showPatientRegistration: false,
        savePatientProfile: async () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider")
  }
  return context
}
