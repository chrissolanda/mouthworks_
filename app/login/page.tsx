"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import LoginScreen from "@/components/auth/login-screen"

export default function LoginPage() {
  const router = useRouter()

  useEffect(() => {
    // Check if user is already logged in
    const user = localStorage.getItem("user")
    if (user) {
      const userData = JSON.parse(user)
      // Route to appropriate dashboard based on role
      if (userData.role === "patient") {
        router.push("/patient/dashboard")
      } else if (userData.role === "dentist") {
        router.push("/dentist/dashboard")
      } else if (userData.role === "hr") {
        router.push("/hr/dashboard")
      }
    }
  }, [router])

  return <LoginScreen />
}
