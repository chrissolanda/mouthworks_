"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  LayoutDashboard,
  Calendar,
  Bluetooth as Tooth,
  BarChart3,
  DollarSign,
  Search,
  CheckCircle,
  AlertCircle,
  Clock,
} from "lucide-react"
import { paymentService, dentistService } from "@/lib/db-service"
import { formatCurrency } from "@/lib/utils"

interface Payment {
  id: string
  patient_id: string
  dentist_id: string
  amount: number
  method: string
  status: "paid" | "partial" | "unpaid"
  date?: string
  description?: string
  patients?: { name: string; email: string }
  appointments?: { status: string }
}

const computeEarnings = (payments: Payment[]) => {
  let totalEarned = 0
  let totalPending = 0
  let totalCompleted = 0

  payments.forEach((p) => {
    if (p.status === "paid") {
      totalEarned += p.amount
      totalCompleted += 1
    } else if (p.status === "partial") {
      totalEarned += p.amount
      totalCompleted += 1
    } else if (p.status === "unpaid") {
      totalPending += p.amount
    }
  })

  return { totalEarned, totalPending, totalCompleted, count: payments.length }
}

export default function DentistEarnings() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [earnings, setEarnings] = useState({ totalEarned: 0, totalPending: 0, totalCompleted: 0, count: 0 })
  const [dentistTableId, setDentistTableId] = useState<string | null>(null)

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null

    const init = async () => {
      if (!user?.id && !user?.email) return
      // Map auth user -> dentist table row (prefer user_id, fallback email)
      const dentists = await dentistService.getAll()
      const matchByUser = (dentists || []).find((d: any) => d.user_id === user?.id)
      const matchByEmail = (dentists || []).find(
        (d: any) => (d.email || "").toLowerCase() === (user?.email || "").toLowerCase(),
      )
      const match = matchByUser || matchByEmail
      if (match?.id) {
        setDentistTableId(match.id)
        await loadPayments(match.id)
        // Refresh every 3 seconds for faster updates
        interval = setInterval(() => loadPayments(match.id), 3000)
      }
    }

    init()

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [user?.id, user?.email])

  const loadPayments = async (dentistIdOverride?: string | null) => {
    try {
      setLoading(true)
      const idToUseRaw = dentistIdOverride ?? dentistTableId
      const idToUse = typeof idToUseRaw === "string" ? idToUseRaw : null
      if (!idToUse) {
        console.warn("[v0] Dentist table ID not resolved; skipping payments fetch")
        setPayments([])
        setEarnings({ totalEarned: 0, totalPending: 0, totalCompleted: 0, count: 0 })
        return
      }

      // Prevent invalid UUID errors
      const uuidRegex = /^[0-9a-fA-F-]{36}$/
      if (!uuidRegex.test(idToUse)) {
        console.error("[v0] Dentist ID is not a valid UUID, aborting payments fetch:", idToUse)
        setPayments([])
        setEarnings({ totalEarned: 0, totalPending: 0, totalCompleted: 0, count: 0 })
        return
      }

      console.log("[v0] Loading payments for dentist:", idToUse)
      const data = await paymentService.getByDentistId(idToUse)
      const earningsData = computeEarnings((data || []) as any)
      console.log("[v0] Payments loaded:", data?.length || 0)
      console.log("[v0] Earnings data:", earningsData)
      setPayments(data || [])
      setEarnings(earningsData || { totalEarned: 0, totalPending: 0, totalCompleted: 0, count: 0 })
    } catch (error) {
      console.error("[v0] Error loading earnings:", error instanceof Error ? error.message : error)
      console.error("[v0] Dentist ID used:", dentistIdOverride ?? dentistTableId)
      setPayments([])
      setEarnings({ totalEarned: 0, totalPending: 0, totalCompleted: 0, count: 0 })
    } finally {
      setLoading(false)
    }
  }

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dentist/dashboard" },
    { label: "My Schedule", icon: <Calendar className="w-5 h-5" />, href: "/dentist/schedule" },
    { label: "Treatments", icon: <Tooth className="w-5 h-5" />, href: "/dentist/treatments" },
    { label: "Earnings", icon: <DollarSign className="w-5 h-5" />, href: "/dentist/earnings" },
    { label: "Reports", icon: <BarChart3 className="w-5 h-5" />, href: "/dentist/reports" },
  ]

  const filteredPayments = payments.filter((p) => {
    const matchesFilter = filter === "all" || p.status === filter
    const patientName = (p.patients?.name || "").toLowerCase()
    const description = (p.description || "").toLowerCase()
    const matchesSearch = patientName.includes(searchTerm.toLowerCase()) || description.includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  return (
    <MainLayout navItems={navItems} title="My Earnings">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Earnings & Transactions</h2>
            <p className="text-muted-foreground">Track your payments and commission</p>
          </div>
          <Button onClick={loadPayments} variant="outline" size="sm">
            🔄 Refresh
          </Button>
        </div>

        {/* Earnings Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow border-l-4 border-l-green-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-600" />
                Total Earned
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{formatCurrency(earnings.totalEarned)}</div>
              <p className="text-xs text-muted-foreground mt-1">{earnings.totalCompleted} completed</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-l-4 border-l-yellow-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4 text-yellow-600" />
                Pending Payment
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{formatCurrency(earnings.totalPending)}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting confirmation</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-l-4 border-l-primary">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Transactions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{earnings.count}</div>
              <p className="text-xs text-muted-foreground mt-1">All payments</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow border-l-4 border-l-blue-600">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Net Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{formatCurrency(earnings.totalEarned * 0.5)}</div>
              <p className="text-xs text-muted-foreground mt-1">Dentist share (50% of total earned)</p>
            </CardContent>
          </Card>
        </div>

        {/* Search & Filter */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by patient name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border"
              />
            </div>

            <div className="flex gap-2">
              {["all", "paid", "partial", "unpaid"].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${
                    filter === status
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-foreground hover:bg-muted/80"
                  }`}
                >
                  {status.charAt(0).toUpperCase() + status.slice(1)}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Payments Table */}
        <Card>
          <CardHeader>
            <CardTitle>Transaction History</CardTitle>
            <CardDescription>{filteredPayments.length} transaction(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center text-muted-foreground py-8">Loading transactions...</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Patient</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Service</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Method</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Appointment Status</th>
                      <th className="text-left py-3 px-4 font-semibold text-foreground">Payment Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredPayments.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="py-8 text-center text-muted-foreground">
                          No transactions found
                        </td>
                      </tr>
                    ) : (
                      filteredPayments.map((payment) => (
                        <tr key={payment.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {payment.date ? new Date(payment.date).toLocaleDateString() : "-"}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-foreground">
                            {payment.patients?.name || "Unknown"}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{payment.description || "-"}</td>
                          <td className="py-3 px-4 text-sm font-semibold text-foreground">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{payment.method || "-"}</td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                payment.appointments?.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : payment.appointments?.status === "confirmed"
                                    ? "bg-blue-100 text-blue-700"
                                    : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {payment.appointments?.status ? (
                                payment.appointments.status.charAt(0).toUpperCase() + payment.appointments.status.slice(1)
                              ) : (
                                "Pending"
                              )}
                            </span>
                          </td>
                          <td className="py-3 px-4">
                            <span
                              className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold ${
                                payment.status === "paid"
                                  ? "bg-green-100 text-green-700"
                                  : payment.status === "partial"
                                    ? "bg-yellow-100 text-yellow-700"
                                    : "bg-red-100 text-red-700"
                              }`}
                            >
                              {payment.status === "paid" ? (
                                <CheckCircle className="w-3 h-3" />
                              ) : (
                                <AlertCircle className="w-3 h-3" />
                              )}
                              {payment.status.charAt(0).toUpperCase() + payment.status.slice(1)}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
