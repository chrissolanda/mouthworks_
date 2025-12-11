"use client"

import type React from "react"

import { useState } from "react"
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
              {[
                { email: "hr@mouthworks.com", role: "HR/Admin", password: "Changeme!123", icon: "👨‍💼" },
                { email: "sarah.smith@dental.com", role: "Dr. Sarah Smith", password: "Changeme!123", icon: "👩‍⚕️" },
                { email: "john.doe@dental.com", role: "Dr. John Doe", password: "Changeme!123", icon: "👨‍⚕️" },
                { email: "emily.johnson@dental.com", role: "Dr. Emily Johnson", password: "Changeme!123", icon: "👩‍⚕️" },
                { email: "michael.chen@dental.com", role: "Dr. Michael Chen", password: "Changeme!123", icon: "👨‍⚕️" },
                { email: "lisa.anderson@dental.com", role: "Dr. Lisa Anderson", password: "Changeme!123", icon: "👩‍⚕️" },
              ].map((cred) => (
                <button
                  key={cred.email}
                  type="button"
                  onClick={() => {
                    setEmail(cred.email)
                    setPassword(cred.password)
                    setShowRegister(false)
                  }}
                  className="w-full p-4 text-left border border-border rounded-lg hover:bg-muted hover:border-primary hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">{cred.icon}</span>
                    <div className="flex-1">
                      <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{cred.role}</div>
                      <div className="text-xs text-muted-foreground truncate">{cred.email}</div>
                    </div>
                  </div>
                </button>
              ))}
              <div className="pt-2 text-center">
                <p className="text-xs text-muted-foreground">For development & testing purposes</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
