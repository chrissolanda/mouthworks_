"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, CreditCard, LayoutDashboard, User } from "lucide-react"
import Link from "next/link"
import { appointmentService, paymentService } from "@/lib/db-service"
import { formatCurrency } from "@/lib/utils"

export default function PatientDashboard() {
  const { user, /* showPatientRegistration, savePatientProfile, */ patientAutoApproved } = useAuth()
  const [stats, setStats] = useState({
    upcomingCount: 0,
    outstandingBalance: 0,
    lastVisit: "",
  })
  const [recentAppointments, setRecentAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        if (!user?.id) {
          setLoading(false)
          return
        }

        let appointments = []
        let payments = []

        // Load appointments with detailed error handling
        try {
          const appointmentData = await appointmentService.getByPatientId(user.id)
          appointments = appointmentData || []
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : JSON.stringify(err)
          console.error("[v0] Error loading appointments:", errorMsg, err)
          appointments = []
        }

        // Load payments with detailed error handling
        try {
          const paymentData = await paymentService.getByPatientId(user.id)
          payments = paymentData || []
        } catch (err) {
          const errorMsg = err instanceof Error ? err.message : JSON.stringify(err)
          console.error("[v0] Error loading payments:", errorMsg, err)
          payments = []
        }

        // Calculate stats
        const upcoming = appointments?.filter((a: any) => a.status !== "completed")?.length || 0
        const outstandingBalance =
          payments
            ?.filter((p: any) => p.status !== "paid")
            ?.reduce((sum: number, p: any) => sum + (p.amount || 0), 0) || 0

        const completed = appointments?.filter((a: any) => a.status === "completed") || []
        const lastVisit =
          completed.length > 0 ? new Date(completed[0].date).toLocaleDateString() : "No visits yet"

        setStats({ upcomingCount: upcoming, outstandingBalance, lastVisit })
        setRecentAppointments(appointments?.slice(0, 3) || [])
      } catch (error) {
        console.error("[v0] Error loading dashboard:", error instanceof Error ? error.message : error)
        // Set defaults on error
        setStats({
          upcomingCount: 0,
          outstandingBalance: 0,
          lastVisit: "No visits yet",
        })
        setRecentAppointments([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [user?.id])

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/patient/dashboard" },
    { label: "My Appointments", icon: <Calendar className="w-5 h-5" />, href: "/patient/appointments" },
    { label: "My Profile", icon: <User className="w-5 h-5" />, href: "/patient/profile" },
    { label: "Payment History", icon: <CreditCard className="w-5 h-5" />, href: "/patient/payments" },
  ]

  return (
    <MainLayout navItems={navItems} title="Patient Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-8 text-primary-foreground shadow-lg">
          <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.name}!</h1>
          <p className="text-lg opacity-90">Manage your dental appointments and health records</p>
        </div>

        {/* Auto-Approval Notice */}
        {patientAutoApproved && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
              <svg
                className="w-6 h-6 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="font-semibold text-green-900">Your request has been approved!</p>
              <p className="text-sm text-green-700">You're all set. You can now book appointments.</p>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-2 hover:border-primary hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Upcoming Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{stats.upcomingCount}</div>
              <p className="text-sm text-muted-foreground mt-2">Scheduled appointments</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-destructive hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Outstanding Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-destructive">{formatCurrency(stats.outstandingBalance)}</div>
              <p className="text-sm text-muted-foreground mt-2">Pending payments</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Last Visit</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-accent">{stats.lastVisit}</div>
              <p className="text-sm text-muted-foreground mt-2">Most recent visit</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Link href="/patient/appointments" className="block">
            <Card className="border-2 hover:border-primary hover:shadow-xl transition-all cursor-pointer h-full group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Calendar className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold">Book Appointment</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Schedule your next dental visit</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/patient/payments" className="block">
            <Card className="border-2 hover:border-primary hover:shadow-xl transition-all cursor-pointer h-full group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <CreditCard className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold">Payment Info</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">View and manage your payments</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Appointments */}
        <Card className="border-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Recent Appointments</CardTitle>
            <CardDescription className="text-base">Your last 3 appointments</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading...</div>
            ) : recentAppointments.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No appointments yet</div>
            ) : (
              <div className="space-y-4">
                {recentAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-primary" />
                      <div>
                        <p className="font-medium text-foreground">{apt.service}</p>
                        <p className="text-sm text-muted-foreground">
                          {new Date(apt.date).toLocaleDateString()} at {apt.time}
                        </p>
                      </div>
                    </div>
                    <p className="text-sm font-medium text-muted-foreground">{apt.dentists?.name || "TBD"}</p>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
