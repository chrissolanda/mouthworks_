"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Bluetooth as Tooth, ArrowRight, Calendar, Users, ClipboardList } from "lucide-react"

export default function WelcomeScreen() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-12 pb-16 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Logo */}
          <div className="mb-8 flex justify-center">
            <div className="bg-primary rounded-2xl p-8 shadow-2xl">
              <Tooth className="w-24 h-24 text-primary-foreground" />
            </div>
          </div>

          {/* Title */}
          <h1 className="text-6xl font-bold text-foreground mb-6 tracking-tight">
            MOUTHWORKS
          </h1>

          {/* Subtitle */}
          <p className="text-2xl text-muted-foreground mb-12">
            Dental Clinic Management System
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Button 
              size="lg" 
              onClick={() => router.push("/login")}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg font-semibold"
            >
              Get Started
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => router.push("/login")}
              className="px-8 py-6 text-lg"
            >
              Sign In to Your Account
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto mt-20">
            <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Appointment Management</h3>
              <p className="text-muted-foreground">
                Schedule and manage appointments with ease. Real-time updates for patients and staff.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Patient Records</h3>
              <p className="text-muted-foreground">
                Complete patient history, treatment plans, and medical records in one secure location.
              </p>
            </div>

            <div className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="bg-primary/10 w-12 h-12 rounded-lg flex items-center justify-center mb-4 mx-auto">
                <ClipboardList className="w-6 h-6 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Treatment Tracking</h3>
              <p className="text-muted-foreground">
                Track treatments, payments, and earnings. Complete transparency for all stakeholders.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="container mx-auto px-4 py-8 text-center text-muted-foreground text-sm border-t border-border mt-20">
        <p>&copy; 2025 Mouthworks Dental Clinic. All rights reserved.</p>
      </div>
    </div>
  )
}
