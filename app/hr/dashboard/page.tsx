"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/lib/auth-context"
import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Bluetooth as Tooth,
  CreditCard,
  Package,
  BarChart3,
  Settings,
  Plus,
  CheckCircle,
  Clock,
} from "lucide-react"
import Link from "next/link"
import { patientService, appointmentService, paymentService, inventoryService } from "@/lib/db-service"
import { formatCurrency } from "@/lib/utils"

export default function HRDashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalPatients: 0,
    todayAppointments: 0,
    pendingPayments: 0,
    lowStockItems: 0,
  })
  const [todayAppointments, setTodayAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        const [patients, appointments, payments, inventory] = await Promise.all([
          patientService.getAll().catch(() => []),
          appointmentService.getAll().catch(() => []),
          paymentService.getAll().catch(() => []),
          inventoryService.getAll().catch(() => []),
        ])

        const today = new Date().toISOString().split("T")[0]
        const todayAppts = (appointments || []).filter((a: any) => a.date === today)
        const pendingPaymentsAmount = (payments || [])
          .filter((p: any) => p.status !== "paid")
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
        const lowStockCount = (inventory || []).filter((i: any) => i.status === "low" || i.status === "critical").length

        setStats({
          totalPatients: patients?.length || 0,
          todayAppointments: todayAppts?.length || 0,
          pendingPayments: pendingPaymentsAmount || 0,
          lowStockItems: lowStockCount || 0,
        })
        setTodayAppointments((todayAppts || []).slice(0, 4))
      } catch (error) {
        console.error("[v0] Error loading dashboard:", error instanceof Error ? error.message : error)
        setStats({
          totalPatients: 0,
          todayAppointments: 0,
          pendingPayments: 0,
          lowStockItems: 0,
        })
        setTodayAppointments([])
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/hr/dashboard" },
    { label: "Patients", icon: <Users className="w-5 h-5" />, href: "/hr/patients" },
    { label: "Appointments", icon: <Calendar className="w-5 h-5" />, href: "/hr/appointments" },
    { label: "Treatments", icon: <Tooth className="w-5 h-5" />, href: "/hr/treatments" },
    { label: "Payments", icon: <CreditCard className="w-5 h-5" />, href: "/hr/payments" },
    { label: "Inventory", icon: <Package className="w-5 h-5" />, href: "/hr/inventory" },
    { label: "Reports", icon: <BarChart3 className="w-5 h-5" />, href: "/hr/reports" },
    { label: "Settings", icon: <Settings className="w-5 h-5" />, href: "/hr/settings" },
  ]

  return (
    <MainLayout navItems={navItems} title="HR/Admin Dashboard">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-8 text-primary-foreground shadow-lg">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-lg opacity-90">Manage clinic operations and schedule appointments</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-primary hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Total Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{stats.totalPatients}</div>
              <p className="text-sm text-muted-foreground mt-2">Active patients</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{stats.todayAppointments}</div>
              <p className="text-sm text-muted-foreground mt-2">Scheduled today</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-destructive hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Pending Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-destructive">{formatCurrency(stats.pendingPayments)}</div>
              <p className="text-sm text-muted-foreground mt-2">Unpaid invoices</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-accent hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Low Stock Items</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-accent">{stats.lowStockItems}</div>
              <p className="text-sm text-muted-foreground mt-2">Need restocking</p>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link href="/hr/appointments" className="block">
            <Card className="border-2 hover:border-primary hover:shadow-xl transition-all cursor-pointer h-full group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold">New Appointment</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Schedule appointment with dentist</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/hr/patients" className="block">
            <Card className="border-2 hover:border-primary hover:shadow-xl transition-all cursor-pointer h-full group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold">New Patient</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Register new patient in system</p>
              </CardContent>
            </Card>
          </Link>

          <Link href="/hr/payments" className="block">
            <Card className="border-2 hover:border-primary hover:shadow-xl transition-all cursor-pointer h-full group">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary/10 rounded-lg group-hover:bg-primary/20 transition-colors">
                    <Plus className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg font-bold">Record Payment</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Log patient payment</p>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Today's Appointments */}
        <Card className="border-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Today's Appointments</CardTitle>
            <CardDescription className="text-base">All appointments scheduled for today</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-4 text-muted-foreground">Loading...</div>
            ) : todayAppointments.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No appointments today</div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="w-2 h-2 rounded-full bg-primary"></div>
                      <div>
                        <p className="font-medium text-foreground">{apt.patients?.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.time} - {apt.service}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">{apt.dentists?.name || "TBD"}</span>
                      {apt.status === "confirmed" ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-yellow-600" />
                      )}
                    </div>
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
