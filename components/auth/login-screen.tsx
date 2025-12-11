"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { authService } from "@/lib/auth-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { AlertCircle, Loader2, Bluetooth as Tooth } from "lucide-react"

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const router = useRouter()
  const [showRegister, setShowRegister] = useState(false)
  const [regName, setRegName] = useState("")
  const [regPhone, setRegPhone] = useState("")
  // Registration is patient-only
  const [quickLogins, setQuickLogins] = useState<Array<{email:string; role:string; name:string; icon?:string}>>([])

  useEffect(() => {
    const loadQuickLogins = async () => {
      try {
        const res = await fetch("/api/auth/quicklogins")
        if (res.ok) {
          const entries = await res.json()
          // Map to display entries; ensure HR + dentists are present
          const mapped = (entries as Array<any>).map((e) => ({
            email: e.email,
            role: e.role === "hr" ? "HR/Admin" : e.role === "dentist" ? e.name : e.name,
            name: e.name,
            icon: e.role === "hr" ? "👨‍💼" : e.role === "dentist" ? "👨‍⚕️" : "👤",
          }))
          setQuickLogins(mapped)
        }
      } catch (err) {
        // Silent fail; keep defaults empty to avoid hardcoding
      }
    }
    loadQuickLogins()
  }, [])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await login(email, password)
      // User context will handle navigation
      const userStr = localStorage.getItem("user")
      if (userStr) {
        const user = JSON.parse(userStr)
        if (user.role === "patient") {
          router.push("/patient/dashboard")
        } else if (user.role === "dentist") {
          router.push("/dentist/dashboard")
        } else if (user.role === "hr") {
          router.push("/hr/dashboard")
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      let res: any
      
      // Patient registration only
      res = await register(email, password, regName, regPhone || undefined)

      if (res && res.status === "exists") {
        setError("User with this email already exists. Please sign in instead.")
        setShowRegister(false)
      } else {
        // After registering, log in the user
        try {
          await login(email, password)
          const userStr = localStorage.getItem("user")
          if (userStr) {
            const user = JSON.parse(userStr)
            if (user.role === "patient") {
              router.push("/patient/dashboard")
            } else if (user.role === "dentist") {
              router.push("/dentist/dashboard")
            } else if (user.role === "hr") {
              router.push("/hr/dashboard")
            }
          }
        } catch (loginErr) {
          setError("Account created, but auto-login failed. Please sign in manually.")
          setShowRegister(false)
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/10 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex gap-8 items-start justify-center">
        {/* Login Card - Left Side */}
        <div className="flex-1 max-w-lg mx-auto">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-primary rounded-xl p-3 shadow-lg">
                <Tooth className="w-8 h-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">Mouthworks</h1>
                <p className="text-sm text-muted-foreground">Dental Clinic Management</p>
              </div>
            </div>
          </div>

          <Card className="border shadow-xl bg-card/95 backdrop-blur">
            <CardHeader className="space-y-1 pb-6">
              <CardTitle className="text-2xl font-bold">
                {showRegister ? "Create Account" : "Welcome Back"}
              </CardTitle>
              <CardDescription>
                {showRegister 
                  ? "Sign up to start managing your appointments" 
                  : "Sign in to access your dashboard"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
            <form onSubmit={showRegister ? handleRegister : handleLogin} className="space-y-4">
              {error && (
                <div className="p-4 bg-destructive/10 border border-destructive/30 rounded-lg flex gap-3">
                  <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-destructive">{error}</p>
                </div>
              )}

              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Email Address</label>
                <Input
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="h-11 border-border focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-3">
                <label className="text-sm font-semibold text-foreground">Password</label>
                <Input
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  className="h-11 border-border focus:ring-2 focus:ring-primary"
                />
              </div>

              {showRegister && (
                <>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground">Full Name</label>
                    <Input
                      type="text"
                      placeholder="John Doe"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      disabled={loading}
                      className="h-11 border-border focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-semibold text-foreground">Phone Number (Optional)</label>
                    <Input
                      type="tel"
                      placeholder="+1 (555) 123-4567"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      disabled={loading}
                      className="h-11 border-border focus:ring-2 focus:ring-primary"
                    />
                  </div>

                </>
              )}

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={loading || !email || !password || (showRegister && !regName)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-11 text-base shadow-lg"
                >
                  {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  {loading ? (showRegister ? "Creating Account..." : "Signing In...") : showRegister ? "Create Account" : "Sign In"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowRegister(!showRegister)
                    setError("")
                  }}
                  className="px-6 h-11"
                >
                  {showRegister ? "Back" : "Register"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
        </div>

        {/* Quick Logins - Right Side */}
        <div className="w-96 hidden lg:block">
          <Card className="border shadow-xl sticky top-4 bg-card/95 backdrop-blur">
            <CardHeader className="space-y-1 pb-4">
              <CardTitle className="text-xl font-bold">Quick Login</CardTitle>
              <CardDescription>Click to auto-fill credentials</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {quickLogins.length === 0 ? (
                <div className="text-sm text-muted-foreground">No quick login users found in database.</div>
              ) : (
                quickLogins.map((u) => (
                  <button
                    key={u.email}
                    type="button"
                    onClick={() => {
                      setEmail(u.email)
                      // Use a known dev password; actual auth must match Supabase
                      setPassword("Changeme!123")
                    }}
                    className="w-full flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{u.icon || "👤"}</span>
                      <div>
                        <div className="text-sm font-semibold text-foreground">{u.role}</div>
                        <div className="text-xs text-muted-foreground">{u.email}</div>
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">From database</span>
                  </button>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
