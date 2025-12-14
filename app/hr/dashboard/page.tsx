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
    needDentistAssignment: 0,
    confirmedAppointments: 0,
    readyForPayment: 0,
    inProgress: 0,
  })
  const [todayAppointments, setTodayAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const loadData = async () => {
    try {
      console.log("[v0] Dashboard: Loading all data at", new Date().toISOString())
      const [patients, appointments, payments, inventory] = await Promise.all([
        patientService.getAll().catch(() => []),
        appointmentService.getAll().catch(() => []),
        paymentService.getAll().catch(() => []),
        inventoryService.getAll().catch(() => []),
      ])

        // Get today's date in YYYY-MM-DD format - use local timezone to match user's date
        const now = new Date()
        const today = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
        
        // #region agent log
        const sampleDates = (appointments || []).slice(0, 5).map((a: any) => ({id: a.id, date: a.date, dateType: typeof a.date, patient: a.patients?.name}))
        fetch('http://127.0.0.1:7242/ingest/c0a6aa0c-74d6-4100-87e9-5e0b60c6253b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/hr/dashboard/page.tsx:52',message:'Date filtering - sample dates',data:{today,appointmentsCount:appointments?.length || 0,sampleDates},timestamp:Date.now(),sessionId:'debug-session',runId:'dashboard-fix-v2',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        
        // Filter appointments for today - handle various date formats from database
        const todayAppts = (appointments || []).filter((a: any) => {
          if (!a.date) return false
          
          // Normalize appointment date to YYYY-MM-DD format
          let appointmentDate = ""
          if (typeof a.date === 'string') {
            // Handle "YYYY-MM-DD" or "YYYY-MM-DDTHH:mm:ss" or "YYYY-MM-DDTHH:mm:ssZ"
            appointmentDate = a.date.split("T")[0].split(" ")[0]
          } else if (a.date instanceof Date) {
            appointmentDate = `${a.date.getFullYear()}-${String(a.date.getMonth() + 1).padStart(2, '0')}-${String(a.date.getDate()).padStart(2, '0')}`
          } else {
            // Try to parse as date
            try {
              const dateObj = new Date(a.date)
              appointmentDate = `${dateObj.getFullYear()}-${String(dateObj.getMonth() + 1).padStart(2, '0')}-${String(dateObj.getDate()).padStart(2, '0')}`
            } catch {
              return false
            }
          }
          
          const matches = appointmentDate === today
          
          // #region agent log
          if (matches) {
            fetch('http://127.0.0.1:7242/ingest/c0a6aa0c-74d6-4100-87e9-5e0b60c6253b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/hr/dashboard/page.tsx:75',message:'MATCH - Appointment for today',data:{appointmentId:a.id,appointmentDate,today,patientName:a.patients?.name,originalDate:a.date},timestamp:Date.now(),sessionId:'debug-session',runId:'dashboard-fix-v2',hypothesisId:'A'})}).catch(()=>{});
          }
          // #endregion
          
          return matches
        })
        
        // #region agent log
        fetch('http://127.0.0.1:7242/ingest/c0a6aa0c-74d6-4100-87e9-5e0b60c6253b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/hr/dashboard/page.tsx:85',message:'Today appointments result',data:{todayApptsCount:todayAppts.length,today,allAppointmentsCount:appointments?.length || 0},timestamp:Date.now(),sessionId:'debug-session',runId:'dashboard-fix-v2',hypothesisId:'A'})}).catch(()=>{});
        // #endregion
        const pendingPaymentsAmount = (payments || [])
          .filter((p: any) => p.status !== "paid")
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
        const lowStockCount = (inventory || []).filter((i: any) => i.status === "low" || i.status === "critical").length
        
        // Appointment status counts
        // Only count pending appointments that need dentist assignment
        // Explicitly exclude completed, paid, cancelled, and rejected statuses
        const needAssignment = (appointments || []).filter((a: any) => {
          const status = a.status?.toLowerCase() || ""
          return status === "pending" && !a.dentist_id
        }).length
        const confirmed = (appointments || []).filter((a: any) => a.status === "confirmed").length
        const readyForPayment = (appointments || []).filter((a: any) => a.status === "completed").length
        const inProgress = (appointments || []).filter((a: any) => a.status === "in-progress").length

        setStats({
          totalPatients: patients?.length || 0,
          todayAppointments: todayAppts?.length || 0,
          pendingPayments: pendingPaymentsAmount || 0,
          lowStockItems: lowStockCount || 0,
          needDentistAssignment: needAssignment || 0,
          confirmedAppointments: confirmed || 0,
          readyForPayment: readyForPayment || 0,
          inProgress: inProgress || 0,
        })
        setTodayAppointments((todayAppts || []).slice(0, 4))
        console.log("[v0] Dashboard: Data loaded successfully at", new Date().toISOString())
        console.log("[v0] Dashboard: Stats - needAssignment:", needAssignment, "pendingPayments:", pendingPaymentsAmount, "todayAppts:", todayAppts.length, "total appointments:", appointments?.length)
      } catch (error) {
        console.error("[v0] Error loading dashboard:", error instanceof Error ? error.message : error)
        setStats({
          totalPatients: 0,
          todayAppointments: 0,
          pendingPayments: 0,
          lowStockItems: 0,
          needDentistAssignment: 0,
          confirmedAppointments: 0,
          readyForPayment: 0,
          inProgress: 0,
        })
        setTodayAppointments([])
      } finally {
        setLoading(false)
      }
    }

  useEffect(() => {
    loadData()
    // Auto-refresh every 3 seconds to sync all data
    const interval = setInterval(() => {
      loadData()
    }, 3000)
    
    // Listen for all data change events to refresh immediately
    const handleDataChange = (event?: Event) => {
      const eventName = event?.type || 'unknown'
      console.log(`[v0] Dashboard: Data change event received (${eventName}), refreshing immediately...`)
      // Force immediate refresh on any data change - no debounce, instant sync
      loadData().catch(err => {
        console.error("[v0] Dashboard: Error during sync refresh:", err)
      })
    }
    
    // Also listen to storage events (for cross-tab sync)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'dataChanged') {
        console.log("[v0] Dashboard: Storage event detected, refreshing...")
        loadData().catch(err => {
          console.error("[v0] Dashboard: Error during storage sync refresh:", err)
        })
      }
    }
    window.addEventListener('storage', handleStorageChange)
    
    // Register listeners for ALL possible data change events
    const events = [
      'appointmentCreated',
      'appointmentUpdated', 
      'appointmentDeleted',
      'paymentRecorded',
      'paymentDeleted',
      'paymentUpdated',
      'inventoryUpdated',
      'inventoryCreated',
      'inventoryDeleted',
      'patientCreated',
      'patientUpdated',
      'patientDeleted',
      'treatmentCreated',
      'treatmentUpdated',
      'treatmentDeleted',
      'dentistCreated',
      'dentistUpdated',
      'dentistDeleted',
      'staffCreated',
      'staffUpdated',
      'staffDeleted',
      'dataChanged' // Generic catch-all - must be last
    ]
    
    // Add all event listeners
    events.forEach(event => {
      window.addEventListener(event, handleDataChange)
    })
    
    return () => {
      clearInterval(interval)
      // Remove all event listeners
      events.forEach(event => {
        window.removeEventListener(event, handleDataChange)
      })
      window.removeEventListener('storage', handleStorageChange)
    }
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

        {/* Appointment Status Overview */}
        <Card className="border-2 shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <Calendar className="w-6 h-6 text-primary" />
              Appointment Status Overview
            </CardTitle>
            <CardDescription>Quick view of all appointment states</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <Link href="/hr/appointments">
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg hover:border-red-400 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-red-700">Need Dentist</span>
                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                      <Clock className="w-4 h-4 text-red-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-red-600">{stats.needDentistAssignment}</div>
                  <p className="text-xs text-red-600 mt-1">Awaiting assignment</p>
                </div>
              </Link>

              <Link href="/hr/appointments">
                <div className="p-4 bg-purple-50 border-2 border-purple-200 rounded-lg hover:border-purple-400 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-purple-700">Confirmed</span>
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-purple-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-purple-600">{stats.confirmedAppointments}</div>
                  <p className="text-xs text-purple-600 mt-1">Ready for check-in</p>
                </div>
              </Link>

              <Link href="/hr/appointments">
                <div className="p-4 bg-orange-50 border-2 border-orange-200 rounded-lg hover:border-orange-400 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-orange-700">In Progress</span>
                    <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
                      <Tooth className="w-4 h-4 text-orange-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-orange-600">{stats.inProgress}</div>
                  <p className="text-xs text-orange-600 mt-1">Treatment ongoing</p>
                </div>
              </Link>

              <Link href="/hr/appointments">
                <div className="p-4 bg-green-50 border-2 border-green-200 rounded-lg hover:border-green-400 hover:shadow-md transition-all cursor-pointer">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-green-700">Ready for Payment</span>
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <CreditCard className="w-4 h-4 text-green-600" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-green-600">{stats.readyForPayment}</div>
                  <p className="text-xs text-green-600 mt-1">Completed appointments</p>
                </div>
              </Link>
            </div>
          </CardContent>
        </Card>

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
