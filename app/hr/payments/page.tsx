"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
  Trash2,
  Search,
  CheckCircle,
  AlertCircle,
  Download,
} from "lucide-react"
import { paymentService, patientService, appointmentService } from "@/lib/db-service"
import { formatCurrency } from "@/lib/utils"
import { downloadReceipt, type ReceiptData } from "@/lib/receipt-generator"
import RecordPaymentModal from "@/components/modals/record-payment-modal"
import AppointmentPaymentModal from "@/components/modals/appointment-payment-modal"

interface EditingPaymentId {
  id: string | null
  field: string | null
}

interface Payment {
  id: string
  patient_id: string
  dentist_id?: string
  amount: number
  method: string
  status: "paid" | "partial" | "unpaid"
  date?: string
  description?: string
  patients?: { name: string; email: string }
  dentists?: { name: string }
}

export default function HRPayments() {
  const { user } = useAuth()
  const [payments, setPayments] = useState<Payment[]>([])
  const [patients, setPatients] = useState<any[]>([])
  const [completedAppointments, setCompletedAppointments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showRecordModal, setShowRecordModal] = useState(false)
  const [showAppointmentPaymentModal, setShowAppointmentPaymentModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [filter, setFilter] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editField, setEditField] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  useEffect(() => {
    loadData()
    // Auto-refresh every 3 seconds to show new payments faster
    const interval = setInterval(() => {
      loadData()
    }, 3000)
    
    // Listen for all data change events to refresh immediately
    const handleDataChange = () => {
      loadData()
    }
    
    // Register listeners for all data change events
    window.addEventListener('paymentRecorded', handleDataChange)
    window.addEventListener('paymentDeleted', handleDataChange)
    window.addEventListener('appointmentUpdated', handleDataChange)
    window.addEventListener('dataChanged', handleDataChange) // Generic catch-all
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('paymentRecorded', handleDataChange)
      window.removeEventListener('paymentDeleted', handleDataChange)
      window.removeEventListener('appointmentUpdated', handleDataChange)
      window.removeEventListener('dataChanged', handleDataChange)
    }
  }, [])

  const loadData = async () => {
    try {
      console.log("[v0] 🔄 Loading payments, patients, and appointments from database...")
      setLoading(true)
      
      const [paymentsData, patientsData, appointmentsData] = await Promise.all([
        paymentService.getAll(), 
        patientService.getAll(),
        appointmentService.getAll()
      ])
      
      console.log("[v0] ✅ Loaded", paymentsData?.length || 0, "payments")
      console.log("[v0] ✅ Loaded", patientsData?.length || 0, "patients")
      console.log("[v0] ✅ Loaded", appointmentsData?.length || 0, "appointments")
      
      // Filter completed appointments that don't have a payment yet
      const completed = (appointmentsData || []).filter((apt: any) => {
        if (apt.status !== "completed") return false
        // Check if there's already a payment for this appointment
        const hasPayment = (paymentsData || []).some((p: any) => p.appointment_id === apt.id)
        return !hasPayment
      })
      
      setPayments(paymentsData || [])
      setPatients(patientsData || [])
      setCompletedAppointments(completed)
    } catch (error) {
      console.error("[v0] ❌ Error loading data:", error)
      console.error("[v0] Error details:", error instanceof Error ? error.message : error)
      // Set empty arrays on error to prevent UI crashes
      setPayments([])
      setPatients([])
      setCompletedAppointments([])
    } finally {
      setLoading(false)
    }
  }

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

  const handleRecordPayment = async (data: any) => {
    try {
      console.log("[v0] 💾 Recording payment to database:", data)
      
      // Create payment in database
      const newPayment = await paymentService.create(data)
      
      if (!newPayment || !newPayment.id) {
        throw new Error("Payment was not saved to database")
      }
      
      console.log("[v0] ✅ Payment saved to database with ID:", newPayment.id)
      
      // If payment is for an appointment, update appointment status to "paid"
      if (data.appointment_id) {
        try {
          await appointmentService.update(data.appointment_id, { status: "paid" })
          console.log("[v0] ✅ Appointment status updated to paid")
        } catch (err) {
          console.warn("[v0] Warning: Could not update appointment status:", err)
        }
      }
      
      // Reload all data from database to ensure we have fresh data
      console.log("[v0] 🔄 Reloading all payments from database...")
      await loadData()
      
      console.log("[v0] ✅ Data reloaded successfully")
      
      // Dispatch events to notify other pages
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('paymentRecorded'))
        window.dispatchEvent(new CustomEvent('dataChanged'))
      }
      
      // Only close modal after everything is saved and loaded
      setShowRecordModal(false)
      setShowAppointmentPaymentModal(false)
      setSelectedAppointment(null)
      
      alert(`✅ Payment recorded successfully!\n\nAmount: ₱${data.amount}\nStatus: ${data.status}\n\nPayment is now visible in the system.`)
    } catch (error) {
      console.error("[v0] ❌ Error recording payment:", error)
      alert("❌ Error recording payment: " + (error instanceof Error ? error.message : "Unknown error") + "\n\nPlease try again.")
      // Don't close modal on error so user can retry
    }
  }

  const handleRecordPaymentFromAppointment = async (paymentData: { method: string; amount: number; notes: string }): Promise<string> => {
    if (!selectedAppointment) return ""
    
    try {
      // Create payment record
      const payment = await paymentService.create({
        patient_id: selectedAppointment.patient_id,
        dentist_id: selectedAppointment.dentist_id || "",
        appointment_id: selectedAppointment.id,
        amount: paymentData.amount,
        method: paymentData.method,
        status: "paid",
        description: paymentData.notes,
        date: new Date().toISOString().split("T")[0],
      })
      
      // Update appointment status to "paid"
      await appointmentService.update(selectedAppointment.id, {
        status: "paid",
      })
      
      // Reload data to reflect the change
      await loadData()
      
      // Dispatch events to notify other pages
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('paymentRecorded'))
        window.dispatchEvent(new CustomEvent('dataChanged'))
      }
      
      // Return payment ID for receipt generation
      return payment.id
    } catch (error) {
      console.error("[v0] Error recording payment:", error)
      throw new Error("Failed to record payment: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const handleDeletePayment = async (id: string) => {
    if (confirm("Are you sure you want to delete this payment record?")) {
      try {
        await paymentService.delete(id)
        setPayments(payments.filter((p) => p.id !== id))
        
        // Dispatch events to notify other pages
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('paymentDeleted'))
          window.dispatchEvent(new CustomEvent('dataChanged'))
        }
      } catch (error) {
        console.error("[v0] Error deleting payment:", error)
        alert("Error deleting payment: " + (error instanceof Error ? error.message : "Unknown error"))
      }
    }
  }

  const handleGenerateReceipt = (payment: Payment) => {
    const patient = patients.find((p) => p.id === payment.patient_id)
    const receiptData: ReceiptData = {
      receiptNumber: payment.id.slice(0, 8).toUpperCase(),
      date: payment.date ? new Date(payment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      patientName: patient?.name || payment.patients?.name || "Unknown Patient",
      patientEmail: patient?.email || payment.patients?.email,
      dentistName: payment.dentists?.name || "Not Assigned",
      service: payment.description || "Dental Service",
      amount: payment.amount,
      method: payment.method || "Cash",
      notes: payment.description,
    }
    downloadReceipt(receiptData)
  }

  const handleEditPayment = async (id: string, field: string, value: any) => {
    try {
      const updatedPayment = await paymentService.update(id, { [field]: value })
      
      // Dispatch events to notify other pages
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('paymentUpdated'))
        window.dispatchEvent(new CustomEvent('dataChanged'))
      }
      setPayments(payments.map((p) => (p.id === id ? updatedPayment : p)))
      setEditingId(null)
      setEditField(null)
      setEditValue("")
    } catch (error) {
      console.error("[v0] Error updating payment:", error)
      alert("Error updating payment: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const filteredPayments = payments.filter((p) => {
    const matchesFilter = filter === "all" || p.status === filter
    const patient = patients.find((pt) => pt.id === p.patient_id)
    const matchesSearch =
      patient?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesFilter && matchesSearch
  })

  const totalPaid = payments.filter((p) => p.status === "paid").reduce((sum, p) => sum + p.amount, 0)
  const totalPartial = payments.filter((p) => p.status === "partial").reduce((sum, p) => sum + p.amount, 0)
  const totalUnpaid = payments.filter((p) => p.status === "unpaid").reduce((sum, p) => sum + p.amount, 0)

  const paymentStats = {
    paid: payments.filter((p) => p.status === "paid").length,
    partial: payments.filter((p) => p.status === "partial").length,
    unpaid: payments.filter((p) => p.status === "unpaid").length,
  }

  return (
    <MainLayout navItems={navItems} title="Payment Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Payment Tracking</h2>
            <p className="text-muted-foreground">Record and manage patient payments</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={loadData} variant="outline" size="sm">
              🔄 Refresh
            </Button>
          </div>
        </div>

        {/* Completed Appointments Awaiting Payment */}
        {completedAppointments.length > 0 && (
          <Card className="border-green-300 bg-green-50/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Completed Appointments - Ready for Payment ({completedAppointments.length})
              </CardTitle>
              <CardDescription className="text-green-700">
                Click on any appointment to record payment
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedAppointments.map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => {
                      setSelectedAppointment(apt)
                      setShowAppointmentPaymentModal(true)
                    }}
                    className="p-5 border-2 border-green-300 bg-white rounded-lg hover:bg-green-50 hover:border-green-500 transition-all text-left group"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-lg text-foreground group-hover:text-primary">
                          {apt.patients?.name || "Unknown Patient"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          <span className="font-medium">{apt.service || "General Visit"}</span>
                          {apt.dentists?.name && ` • Dr. ${apt.dentists.name}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{apt.date}</p>
                        <p className="text-sm text-muted-foreground">{apt.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between pt-3 border-t border-green-200">
                      <span className="text-xs font-semibold text-green-700 bg-green-100 px-2 py-1 rounded">
                        ✓ COMPLETED
                      </span>
                      {apt.amount && (
                        <span className="text-sm font-bold text-primary">
                          Amount: {formatCurrency(apt.amount)}
                        </span>
                      )}
                      <span className="text-sm font-bold text-primary group-hover:underline">
                        Record Payment →
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Payment Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Paid</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{formatCurrency(totalPaid)}</div>
              <p className="text-xs text-muted-foreground mt-1">{paymentStats.paid} payments</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Partial Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{formatCurrency(totalPartial)}</div>
              <p className="text-xs text-muted-foreground mt-1">{paymentStats.partial} payments</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Unpaid Balance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-destructive">{formatCurrency(totalUnpaid)}</div>
              <p className="text-xs text-muted-foreground mt-1">{paymentStats.unpaid} unpaid</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{formatCurrency(totalPaid + totalPartial)}</div>
              <p className="text-xs text-muted-foreground mt-1">Received so far</p>
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
            <CardTitle>Payment Records</CardTitle>
            <CardDescription>{filteredPayments.length} payment(s) found</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Patient</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Dentist</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Description</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Amount</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Method</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Status</th>
                    <th className="text-left py-3 px-4 font-semibold text-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPayments.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="py-8 text-center text-muted-foreground">
                        No payments found
                      </td>
                    </tr>
                  ) : (
                    filteredPayments.map((payment) => {
                      const patient = patients.find((p) => p.id === payment.patient_id)
                      return (
                        <tr key={payment.id} className="border-b border-border hover:bg-muted/50 transition-colors">
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {payment.date ? new Date(payment.date).toLocaleDateString() : "-"}
                          </td>
                          <td className="py-3 px-4 text-sm font-medium text-foreground">
                            {patient?.name || "Unknown"}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{payment.dentists?.name || "-"}</td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{payment.description || "-"}</td>
                          <td className="py-3 px-4 text-sm font-semibold text-foreground">
                            {formatCurrency(payment.amount)}
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">{payment.method || "-"}</td>
                          <td className="py-3 px-4">
                            {editingId === payment.id && editField === "status" ? (
                              <select
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                onBlur={() => handleEditPayment(payment.id, "status", editValue)}
                                className="px-2 py-1 border border-border rounded text-xs bg-background text-foreground"
                                autoFocus
                              >
                                <option value="paid">Paid</option>
                                <option value="partial">Partial</option>
                                <option value="unpaid">Unpaid</option>
                              </select>
                            ) : (
                              <button
                                onClick={() => {
                                  setEditingId(payment.id)
                                  setEditField("status")
                                  setEditValue(payment.status)
                                }}
                                className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity ${
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
                              </button>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleGenerateReceipt(payment)}
                                className="p-1.5 hover:bg-primary/10 rounded-lg transition-colors text-primary"
                                title="Download receipt"
                              >
                                <Download className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeletePayment(payment.id)}
                                className="p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-destructive"
                                title="Delete payment"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {loading ? (
        <Card>
          <CardContent className="pt-6">
            <div className="text-center text-muted-foreground">Loading payments...</div>
          </CardContent>
        </Card>
      ) : (
        <>
          {showRecordModal && (
            <RecordPaymentModal onClose={() => setShowRecordModal(false)} onSubmit={handleRecordPayment} />
          )}
          {showAppointmentPaymentModal && selectedAppointment && (
            <AppointmentPaymentModal
              appointment={selectedAppointment}
              onClose={() => {
                setShowAppointmentPaymentModal(false)
                setSelectedAppointment(null)
              }}
              onRecordPayment={handleRecordPaymentFromAppointment}
            />
          )}
        </>
      )}
    </MainLayout>
  )
}
