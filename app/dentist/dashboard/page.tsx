"use client"

import { useAuth } from "@/lib/auth-context"
import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { LayoutDashboard, Calendar, Bluetooth as Tooth, BarChart3, CheckCircle, XCircle, DollarSign } from "lucide-react"
import { useState, useEffect } from "react"
import { appointmentService, dentistService, paymentService, treatmentRecordService } from "@/lib/db-service"
import AppointmentTreatmentModal from "@/components/modals/appointment-treatment-modal"
import AppointmentCompleteModal from "@/components/modals/appointment-complete-modal"

interface Appointment {
  id: string
  patient_id: string
  dentist_id: string
  date: string
  time: string
  status: "pending" | "confirmed" | "attended" | "in-progress" | "completed" | "paid" | "cancelled" | "rejected"
  treatment_id?: string
  service?: string
  treatment?: string
  amount?: number
  notes?: string
  patients?: {
    name: string
    email: string
  }
  dentists?: {
    name: string
  }
}

export default function DentistDashboard() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [dentistTableId, setDentistTableId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [processingId, setProcessingId] = useState<string | null>(null)
  const [showCollectModal, setShowCollectModal] = useState(false)
  const [showTreatmentModal, setShowTreatmentModal] = useState(false)
  const [showCompleteModal, setShowCompleteModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [treatmentCount, setTreatmentCount] = useState(0)
  const [stats, setStats] = useState({
    appointments: 0,
    completed: 0,
    pending: 0,
    earnings: 0,
  })

  useEffect(() => {
    loadData()
    // Auto-refresh every 3 seconds to show new payments
    const interval = setInterval(() => {
      loadData()
    }, 3000)
    return () => clearInterval(interval)
  }, [user?.email])

  const loadData = async () => {
    if (!user?.email) return
    try {
      // Map auth user -> dentist table row (prefer user_id, fallback email)
      const dentists = await dentistService.getAll()
      const matchByUser = (dentists || []).find((d: any) => d.user_id === user.id)
      const matchByEmail = (dentists || []).find(
        (d: any) => (d.email || "").toLowerCase() === (user.email || "").toLowerCase(),
      )
      const match = matchByUser || matchByEmail
      if (match?.id) {
        setDentistTableId(match.id)
        await loadAppointments(match.id)
      } else {
        setDentistTableId(null)
        setAppointments([])
      }
    } catch (err) {
      console.error("[v0] Error loading dentist record:", err)
      setAppointments([])
    }
  }

  const loadAppointments = async (dentistId?: string) => {
    const idToUse = dentistId || dentistTableId
    if (!idToUse) return
    try {
      setLoading(true)
      const data = await appointmentService.getByDentistId(idToUse)
      setAppointments(data || [])
      
      // Calculate stats
      const completed = (data || []).filter((a: any) => a.status === "completed").length
      const pending = (data || []).filter((a: any) => a.status === "pending").length
      
      // Load earnings from payments
      try {
        const payments = await paymentService.getByDentistId(idToUse)
        const totalEarnings = (payments || [])
          .filter((p: any) => p.status === "paid" || p.status === "partial")
          .reduce((sum: number, p: any) => sum + (p.amount || 0), 0)
        
        setStats({
          appointments: (data || []).length,
          completed,
          pending,
          earnings: totalEarnings,
        })
      } catch (err) {
        console.log("[v0] Could not load earnings from payments (this is OK):", err)
        setStats({
          appointments: (data || []).length,
          completed,
          pending,
          earnings: 0,
        })
      }
    } catch (error) {
      console.error("[v0] Error loading appointments:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleApproveAppointment = async (appointmentId: string) => {
    setProcessingId(appointmentId)
    try {
      await appointmentService.changeStatus(appointmentId, "confirmed")
      setAppointments((prev) => prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "confirmed" } : apt)))
    } catch (error) {
      console.error("[v0] Error approving appointment:", error)
      alert("Failed to approve appointment")
    } finally {
      setProcessingId(null)
    }
  }

  const handleRejectAppointment = async (appointmentId: string) => {
    setProcessingId(appointmentId)
    try {
      await appointmentService.changeStatus(appointmentId, "rejected")
      setAppointments((prev) => prev.map((apt) => (apt.id === appointmentId ? { ...apt, status: "rejected" } : apt)))
    } catch (error) {
      console.error("[v0] Error rejecting appointment:", error)
      alert("Failed to reject appointment")
    } finally {
      setProcessingId(null)
    }
  }

  const handleStartProcedure = async (appointment: Appointment) => {
    setProcessingId(appointment.id)
    try {
      await appointmentService.changeStatus(appointment.id, "in-progress")
      setAppointments((prev) => prev.map((apt) => (apt.id === appointment.id ? { ...apt, status: "in-progress" } : apt)))
      
      // Open treatment modal
      setSelectedAppointment(appointment)
      setShowTreatmentModal(true)
    } catch (error) {
      console.error("[v0] Error starting procedure:", error)
      alert("Failed to start procedure")
    } finally {
      setProcessingId(null)
    }
  }

  const handleSaveAndComplete = async (treatments: any[], totalAmount: number) => {
    if (!selectedAppointment) {
      console.error("[v0] No appointment selected")
      alert("Error: No appointment selected")
      return
    }
    
    console.log("[v0] 🔄 Starting handleSaveAndComplete...")
    console.log("[v0] Selected appointment:", selectedAppointment)
    console.log("[v0] Treatments to save:", treatments)
    console.log("[v0] Total amount:", totalAmount)
    
    try {
      // Save treatments to treatment_records
      console.log("[v0] 💾 Saving treatments to treatment_records...")
      for (let i = 0; i < treatments.length; i++) {
        const treatment = treatments[i]
        console.log(`[v0] Saving treatment ${i + 1}/${treatments.length}:`, treatment)
        
        const recordData = {
          patient_id: selectedAppointment.patient_id,
          dentist_id: selectedAppointment.dentist_id,
          appointment_id: selectedAppointment.id,
          treatment_id: treatment.treatment_id,
          date: selectedAppointment.date,
          quantity: treatment.quantity,
          notes: `${treatment.name} - ${treatment.quantity}x`,
        }
        console.log("[v0] Record data:", recordData)
        
        try {
          const result = await treatmentRecordService.create(recordData)
          console.log(`[v0] ✅ Treatment ${i + 1} saved successfully:`, result)
        } catch (treatmentError) {
          console.error(`[v0] ❌ Failed to save treatment ${i + 1}:`, treatmentError)
          throw treatmentError
        }
      }
      
      // Update appointment with total amount and mark as completed
      console.log("[v0] 📝 Updating appointment status and amount...")
      try {
        await appointmentService.update(selectedAppointment.id, {
          status: "completed",
          amount: totalAmount,
        })
        console.log("[v0] ✅ Appointment updated successfully")
      } catch (updateError) {
        console.error("[v0] ❌ Failed to update appointment:", updateError)
        throw updateError
      }
      
      // Update local state
      console.log("[v0] 🔄 Updating local state...")
      setAppointments((prev) => 
        prev.map((apt) => 
          apt.id === selectedAppointment.id 
            ? { ...apt, status: "completed", amount: totalAmount } 
            : apt
        )
      )
      
      // Close treatment modal and show completion modal
      console.log("[v0] 🎉 Showing completion modal...")
      setShowTreatmentModal(false)
      setTreatmentCount(treatments.length)
      setShowCompleteModal(true)
      
      // Reload appointments
      console.log("[v0] 🔄 Reloading appointments...")
      await loadData()
      console.log("[v0] ✅ All done!")
    } catch (error) {
      console.error("[v0] ❌ Error completing appointment:", error)
      console.error("[v0] Error details:", {
        message: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined,
        error: error
      })
      alert("Failed to complete appointment: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }



  const pendingAppointments = appointments.filter((apt) => apt.status === "pending")
  const approvedAppointments = appointments.filter((apt) => apt.status === "confirmed" || apt.status === "attended" || apt.status === "in-progress")
  const todayAppointments = approvedAppointments.filter((apt) => {
    const today = new Date().toISOString().split("T")[0]
    return apt.date === today
  })

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/dentist/dashboard" },
    { label: "My Schedule", icon: <Calendar className="w-5 h-5" />, href: "/dentist/schedule" },
    { label: "Treatments", icon: <Tooth className="w-5 h-5" />, href: "/dentist/treatments" },
    { label: "Earnings", icon: <DollarSign className="w-5 h-5" />, href: "/dentist/earnings" },
    { label: "Reports", icon: <BarChart3 className="w-5 h-5" />, href: "/dentist/reports" },
  ]

  return (
    <MainLayout navItems={navItems} title="Dentist Schedule">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-primary to-accent rounded-xl p-8 text-primary-foreground shadow-lg">
          <h1 className="text-4xl font-bold mb-2">Welcome, {user?.name}</h1>
          <p className="text-lg opacity-90">Manage your appointments and patient treatments</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="border-2 hover:border-primary hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Today's Appointments</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{todayAppointments.length}</div>
              <p className="text-sm text-muted-foreground mt-2">All confirmed</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-yellow-500 hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-yellow-600">{pendingAppointments.length}</div>
              <p className="text-sm text-muted-foreground mt-2">Awaiting action</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-primary">{approvedAppointments.length}</div>
              <p className="text-sm text-muted-foreground mt-2">Total appointments</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-green-500 hover:shadow-lg transition-all">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">💵 Total Earnings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-bold text-green-600">₱{(stats.earnings || 0).toLocaleString()}</div>
              <p className="text-sm text-muted-foreground mt-2">From completed appointments</p>
            </CardContent>
          </Card>
        </div>

        {/* Pending Approvals */}
        <Card className="border-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Pending Appointment Approvals</CardTitle>
            <CardDescription className="text-base">Appointments awaiting your decision</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8 text-muted-foreground">Loading appointments...</div>
            ) : pendingAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No pending appointments</div>
            ) : (
              <div className="space-y-3">
                {pendingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {apt.patients?.name ? apt.patients.name.charAt(0) : "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{apt.patients?.name || "Unknown Patient"}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.date} at {apt.time}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white"
                        onClick={() => handleApproveAppointment(apt.id)}
                        disabled={processingId === apt.id}
                      >
                        <CheckCircle className="w-4 h-4 mr-1" />
                        {processingId === apt.id ? "..." : "Accept"}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-destructive text-destructive hover:bg-destructive/10 bg-transparent"
                        onClick={() => handleRejectAppointment(apt.id)}
                        disabled={processingId === apt.id}
                      >
                        <XCircle className="w-4 h-4 mr-1" />
                        {processingId === apt.id ? "..." : "Reject"}
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Approved / Attended */}
        <Card className="border-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Approved / Attended</CardTitle>
            <CardDescription className="text-base">Complete after visit</CardDescription>
          </CardHeader>
          <CardContent>
            {approvedAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No approved/attended appointments</div>
            ) : (
              <div className="space-y-3">
                {approvedAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-sm font-semibold text-primary">
                          {apt.patients?.name ? apt.patients.name.charAt(0) : "?"}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{apt.patients?.name || "Unknown Patient"}</p>
                        <p className="text-sm text-muted-foreground">
                          {apt.date} at {apt.time}
                        </p>
                        {apt.status === "attended" && (
                          <p className="text-xs text-blue-600 font-semibold">✓ Patient marked as attended - Ready to start</p>
                        )}
                        {apt.status === "in-progress" && (
                          <p className="text-xs text-orange-600 font-semibold">⚡ Procedure in progress</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {apt.status === "attended" && (
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                          onClick={() => handleStartProcedure(apt)}
                          disabled={processingId === apt.id}
                        >
                          <Tooth className="w-4 h-4 mr-1" />
                          {processingId === apt.id ? "..." : "Start Procedure"}
                        </Button>
                      )}
                      {apt.status === "in-progress" && (
                        <Button
                          size="sm"
                          className="bg-orange-600 hover:bg-orange-700 text-white"
                          onClick={() => {
                            setSelectedAppointment(apt)
                            setShowTreatmentModal(true)
                          }}
                          disabled={processingId === apt.id}
                        >
                          <Tooth className="w-4 h-4 mr-1" />
                          {processingId === apt.id ? "..." : "Add Treatments"}
                        </Button>
                      )}
                      {apt.status === "confirmed" && (
                        <Button
                          size="sm"
                          className="bg-gray-400 text-white cursor-not-allowed"
                          disabled
                        >
                          Waiting for Patient Check-in
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Today's Schedule */}
        <Card className="border-2 shadow-md">
          <CardHeader>
            <CardTitle className="text-2xl font-bold">Today's Schedule</CardTitle>
            <CardDescription className="text-base">Your confirmed appointments for today</CardDescription>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">No appointments today</div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((apt) => (
                  <div key={apt.id} className="flex items-center justify-between p-3 border border-border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{apt.patients?.name || "Unknown Patient"}</p>
                        <p className="text-sm text-muted-foreground">{apt.time}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Confirmed</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

      </div>

      {/* Modals */}
      {showTreatmentModal && selectedAppointment && (
        <AppointmentTreatmentModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowTreatmentModal(false)
            setSelectedAppointment(null)
          }}
          onSaveAndComplete={handleSaveAndComplete}
        />
      )}

      {showCompleteModal && selectedAppointment && (
        <AppointmentCompleteModal
          appointment={selectedAppointment}
          treatmentCount={treatmentCount}
          onClose={() => {
            setShowCompleteModal(false)
            setSelectedAppointment(null)
          }}
        />
      )}

    </MainLayout>
  )
}
