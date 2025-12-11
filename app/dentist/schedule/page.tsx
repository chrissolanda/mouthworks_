"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard,
  Calendar,
  Bluetooth as Tooth,
  BarChart3,
  CheckCircle,
  XCircle,
  Clock,
  Eye,
  ChevronLeft,
  ChevronRight,
  DollarSign,
} from "lucide-react"
import { appointmentService, dentistService } from "@/lib/db-service"
import { paymentService, treatmentService } from "@/lib/db-service"
import AppointmentApprovalModal from "@/components/modals/appointment-approval-modal"
import CollectPaymentModal from "@/components/modals/collect-payment-modal"

export default function DentistSchedule() {
  const { user } = useAuth()
  const router = useRouter()
  const [appointments, setAppointments] = useState<any[]>([])
  const [dentistTableId, setDentistTableId] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [showApprovalModal, setShowApprovalModal] = useState(false)
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [showCollectModal, setShowCollectModal] = useState(false)
  const [completingAppointment, setCompletingAppointment] = useState<any>(null)
  const [calculatedAmount, setCalculatedAmount] = useState(0)

  useEffect(() => {
    resolveDentistAndLoad()
  }, [user?.id, user?.email])

  const resolveDentistAndLoad = async () => {
    try {
      if (!user?.id && !user?.email) return
      const dentists = await dentistService.getAll()
      const matchByUser = (dentists || []).find((d: any) => d.user_id === user?.id)
      const matchByEmail = (dentists || []).find(
        (d: any) => (d.email || "").toLowerCase() === (user?.email || "").toLowerCase(),
      )
      const match = matchByUser || matchByEmail
      if (match?.id) {
        setDentistTableId(match.id)
        await loadAppointments(match.id)
      } else {
        console.warn("[v0] Dentist record not found for user; appointments will be empty")
        setDentistTableId(null)
        setAppointments([])
      }
    } catch (error) {
      console.error("[v0] Error resolving dentist record:", error)
      setDentistTableId(null)
      setAppointments([])
    }
  }

  const loadAppointments = async (dentistId?: string) => {
    try {
      setLoading(true)
      const idToUse = dentistId || dentistTableId
      if (!idToUse) {
        setAppointments([])
        return
      }
      const data = await appointmentService.getByDentistId(idToUse)
      setAppointments(data || [])
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : String(error)
      console.error("[v0] Error loading dentist appointments:", errorMsg)
      setAppointments([])
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

  const handleApproveAppointment = async (id: string) => {
    try {
      // Mark as confirmed first
      await appointmentService.changeStatus(id, "confirmed")
      setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: "confirmed" } : a)))
      console.log("[v0] ✅ Appointment approved successfully")

      // Immediately mark as completed and create payment (per request)
      try {
        await appointmentService.changeStatus(id, "completed")
        setAppointments((prev) => prev.map((a) => (a.id === id ? { ...a, status: "completed" } : a)))

        const apt = appointments.find((a) => a.id === id)
        if (apt) {
          // determine amount: prefer linked treatment price, then match by service name, else fallback
          let amount = 0
          if (apt.treatment_id) {
            try {
              const treatment = await treatmentService.getById(apt.treatment_id)
              amount = treatment?.price || 0
            } catch (e) {
              console.warn("Could not resolve treatment by id for payment:", e)
            }
          }

          if (!amount) {
            try {
              const treatments = await treatmentService.getAll()
              const matched = (treatments || []).find((t: any) => t.name === (apt.service || apt.treatment))
              amount = matched?.price || apt.amount || 0
            } catch (e) {
              console.warn("Could not lookup treatments for amount resolution:", e)
            }
          }

          const paymentPayload: any = {
            patient_id: apt.patient_id,
            appointment_id: apt.id,
            dentist_id: apt.dentist_id || dentistTableId || user?.id,
            amount: amount || 0,
            method: "cash",
            status: "paid",
            description: `Payment for ${apt.service || "treatment"}`,
            date: new Date().toISOString().split("T")[0],
          }

          try {
            // Ensure we never send an object/undefined as dentist_id
            const dentistId = typeof paymentPayload.dentist_id === "string" ? paymentPayload.dentist_id : null
            if (!dentistId) {
              console.error("[v0] Missing dentist_id when creating payment after approve")
            } else {
              paymentPayload.dentist_id = dentistId
            }
            await paymentService.create(paymentPayload)
          } catch (e) {
            console.error("Error creating payment record after approve:", e)
          }
        }
      } catch (e) {
        console.error("Error completing + charging appointment after approve:", e)
      }

      setShowApprovalModal(false)
      // Navigate to dentist's schedule (My Appointments)
      try {
        router.push("/dentist/schedule")
      } catch (e) {
        console.warn("Navigation to schedule failed:", e)
      }
    } catch (error) {
      console.error("Error approving appointment:", error)
    }
  }

  const handleRejectAppointment = async (id: string, reason: string) => {
    try {
      await appointmentService.update(id, { status: "rejected", notes: reason })
      setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: "rejected", notes: reason } : a)))
      setShowApprovalModal(false)
      // Navigate to dentist's schedule (My Appointments)
      try {
        router.push("/dentist/schedule")
      } catch (e) {
        console.warn("Navigation to schedule failed:", e)
      }
    } catch (error) {
      console.error("Error rejecting appointment:", error)
    }
  }

  const handleCompleteAppointment = async (id: string) => {
    try {
      await appointmentService.changeStatus(id, "completed")
      setAppointments(appointments.map((a) => (a.id === id ? { ...a, status: "completed" } : a)))
      
      // Calculate amount and show collect modal
      const apt = appointments.find((a) => a.id === id)
      if (apt) {
        let amount = apt.amount || 0
        
        if (!amount && apt.treatment_id) {
          try {
            const treatment = await treatmentService.getById(apt.treatment_id)
            amount = treatment?.price || 0
          } catch (e) {
            console.warn("Could not resolve treatment by id:", e)
          }
        }

        if (!amount) {
          try {
            const treatments = await treatmentService.getAll()
            const matched = (treatments || []).find((t: any) => t.name === (apt.service || apt.treatment))
            amount = matched?.price || 0
          } catch (e) {
            console.warn("Could not lookup treatments:", e)
          }
        }
        
        if (!amount) {
          const defaultPrices: Record<string, number> = {
            "Cleaning": 500, "Tooth Cleaning": 500, "Dental Cleaning": 500,
            "Filling": 800, "Dental Filling": 800, "Tooth Filling": 800,
            "Root Canal": 1500, "Root Canal Treatment": 1500,
            "Extraction": 600, "Tooth Extraction": 600,
            "Whitening": 2000, "Teeth Whitening": 2000,
            "Checkup": 300, "Dental Checkup": 300, "Consultation": 300,
            "Braces": 3000, "Dental Braces": 3000,
            "Crown": 2500, "Dental Crown": 2500,
          }
          amount = defaultPrices[apt.service] || 500
        }
        
        console.log("[v0] Calculated amount:", amount, "for service:", apt.service)
        
        // Show collect payment modal
        setCompletingAppointment(apt)
        setCalculatedAmount(amount)
        setShowCollectModal(true)
      }
    } catch (error) {
      console.error("Error completing appointment:", error)
      alert("Failed to complete appointment")
    }
  }

  const handleCollectPayment = async (paymentData: { method: string; amount: number; notes?: string }) => {
    if (!completingAppointment) return

    try {
      console.log("[v0] Collecting payment:", paymentData)
      
        const paymentPayload = {
          patient_id: completingAppointment.patient_id,
          dentist_id: completingAppointment.dentist_id || dentistTableId || user?.id,
        appointment_id: completingAppointment.id,
        amount: paymentData.amount,
        method: paymentData.method,
        status: "paid",
        description: `${completingAppointment.service || "treatment"} - ${paymentData.notes || "Payment collected"}`,
        date: new Date().toISOString().split("T")[0],
      }
      
        const dentistId = typeof paymentPayload.dentist_id === "string" ? paymentPayload.dentist_id : null
        if (!dentistId) {
          console.error("[v0] Missing dentist_id when collecting payment")
          alert("Cannot record payment: dentist id is missing. Please re-open after reloading your dashboard.")
          return
        }

        paymentPayload.dentist_id = dentistId

        const createdPayment = await paymentService.create(paymentPayload)
      console.log("[v0] ✅ Payment saved to database:", createdPayment)
      
      // Close modal
      setShowCollectModal(false)
      setCompletingAppointment(null)
      
      alert(
        `✅ PAYMENT COLLECTED SUCCESSFULLY!\n\n` +
        `💵 Amount: ₱${paymentData.amount.toLocaleString()}\n` +
        `💳 Method: ${paymentData.method.replace(/_/g, " ").toUpperCase()}\n` +
        `👨‍⚕️ Your Share (50%): ₱${(paymentData.amount * 0.5).toLocaleString()}\n\n` +
        `📊 Payment ID: ${createdPayment.id}\n\n` +
        `✓ Recorded in database\n` +
        `✓ Will appear in your Earnings\n` +
        `✓ Visible to HR in Payments section`
      )
      
      // Reload appointments to refresh the list
      await loadAppointments()
      console.log("[v0] ✅ Appointments refreshed after payment")
    } catch (error) {
      console.error("[v0] Error recording payment:", error)
      const errorMsg = error instanceof Error ? error.message : String(error)
      alert(`❌ Payment collection failed!\n\nError: ${errorMsg}\n\nPlease try again.`)
    }
  }

  const handleViewDetails = (appointment: any) => {
    setSelectedAppointment(appointment)
    setShowApprovalModal(true)
  }

  // Group appointments by date
  const getDateAppointments = (date: Date) => {
    const dateStr = date.toISOString().split("T")[0]
    return appointments.filter((a) => a.date === dateStr)
  }

  const todayAppointments = getDateAppointments(selectedDate)
  const pendingAppointments = appointments.filter((a) => a.status === "pending")
  const confirmedAppointments = appointments.filter((a) => a.status === "confirmed")

  const previousDay = () => {
    setSelectedDate(new Date(selectedDate.getTime() - 86400000))
  }

  const nextDay = () => {
    setSelectedDate(new Date(selectedDate.getTime() + 86400000))
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" })
  }

  return (
    <MainLayout navItems={navItems} title="My Schedule">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Your Dental Schedule</h2>
            <p className="text-muted-foreground">Review pending appointments and manage your schedule</p>
          </div>
          <Button onClick={() => loadAppointments()} variant="outline" size="sm">
            🔄 Refresh
          </Button>
        </div>

        {/* PENDING APPROVALS - HIGHLIGHTED AT TOP */}
        {pendingAppointments.length > 0 && (
          <Card className="border-yellow-300 bg-yellow-50/50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-yellow-900">
                <Clock className="w-5 h-5 text-yellow-600" />
                Action Required: {pendingAppointments.length} Pending Approval{pendingAppointments.length !== 1 ? "s" : ""}
              </CardTitle>
              <CardDescription className="text-yellow-800">
                HR has scheduled these appointments for you. Please review and approve or reject them.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingAppointments.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 border-2 border-yellow-300 bg-white rounded-lg hover:bg-yellow-50/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-lg text-foreground">{apt.patients?.name || apt.patientName}</p>
                        <p className="text-sm text-muted-foreground">{apt.service || "General Visit"}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{apt.date}</p>
                        <p className="text-sm text-muted-foreground">{apt.time}</p>
                      </div>
                    </div>
                    {apt.notes && (
                      <p className="text-sm text-muted-foreground mb-3 p-2 bg-muted/50 rounded">
                        <span className="font-medium">Notes:</span> {apt.notes}
                      </p>
                    )}
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApproveAppointment(apt.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white font-medium"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleViewDetails(apt)}
                        variant="outline"
                        className="flex-1 text-destructive hover:bg-destructive/10 font-medium"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Date Navigation */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <div>
              <CardTitle>Daily Schedule</CardTitle>
              <CardDescription>{formatDate(selectedDate)}</CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <button onClick={previousDay} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setSelectedDate(new Date())}
                className="px-4 py-2 hover:bg-muted rounded-lg transition-colors text-sm font-medium"
              >
                Today
              </button>
              <button onClick={nextDay} className="p-2 hover:bg-muted rounded-lg transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </CardHeader>
          <CardContent>
            {todayAppointments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">No appointments scheduled for this date</p>
              </div>
            ) : (
              <div className="space-y-3">
                {todayAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{apt.patients?.name || apt.patientName}</p>
                        <p className="text-sm text-muted-foreground">{apt.service}</p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          apt.status === "confirmed"
                            ? "bg-green-100 text-green-700"
                            : apt.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : apt.status === "completed"
                                ? "bg-blue-100 text-blue-700"
                                : "bg-red-100 text-red-700"
                        }`}
                      >
                        {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-muted-foreground flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        {apt.time}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-xs bg-transparent"
                          onClick={() => handleViewDetails(apt)}
                        >
                          <Eye className="w-3 h-3 mr-1" />
                          Details
                        </Button>
                        {apt.status === "pending" && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleApproveAppointment(apt.id)}
                              className="bg-green-600 hover:bg-green-700 text-white text-xs"
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              onClick={() => handleViewDetails(apt)}
                              variant="outline"
                              className="text-xs text-destructive hover:bg-destructive/10"
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                        {apt.status === "confirmed" && (
                          <Button
                            size="sm"
                            onClick={() => handleCompleteAppointment(apt.id)}
                            className="bg-blue-600 hover:bg-blue-700 text-white text-xs"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Approvals */}
        {pendingAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-yellow-600" />
                Pending Approvals ({pendingAppointments.length})
              </CardTitle>
              <CardDescription>Appointments awaiting your decision</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {pendingAppointments.map((apt) => (
                  <div key={apt.id} className="p-4 border border-yellow-200 bg-yellow-50/50 rounded-lg">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-foreground">{apt.patientName}</p>
                        <p className="text-sm text-muted-foreground">{apt.service}</p>
                      </div>
                      <div className="text-sm font-medium text-muted-foreground">
                        {apt.date} at {apt.time}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => handleApproveAppointment(apt.id)}
                        className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        onClick={() => handleViewDetails(apt)}
                        variant="outline"
                        className="flex-1 text-destructive hover:bg-destructive/10"
                      >
                        <XCircle className="w-4 h-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Pending Approvals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{pendingAppointments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Awaiting your action</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">Confirmed Today</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">
                {todayAppointments.filter((a) => a.status === "confirmed").length}
              </div>
              <p className="text-xs text-muted-foreground mt-1">Scheduled for today</p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">This Week</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{appointments.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Total appointments</p>
            </CardContent>
          </Card>
        </div>

        {/* Confirmed Appointments */}
        {confirmedAppointments.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Confirmed Appointments ({confirmedAppointments.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {confirmedAppointments.slice(0, 5).map((apt) => (
                  <div
                    key={apt.id}
                    className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors flex items-center justify-between"
                  >
                    <div>
                      <p className="font-medium text-foreground">{apt.patientName}</p>
                      <p className="text-sm text-muted-foreground">
                        {apt.date} at {apt.time} - {apt.service}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => handleCompleteAppointment(apt.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Complete
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {showApprovalModal && selectedAppointment && (
        <AppointmentApprovalModal
          appointment={selectedAppointment}
          onClose={() => setShowApprovalModal(false)}
          onApprove={() => {
            handleApproveAppointment(selectedAppointment.id)
            setShowApprovalModal(false)
          }}
          onReject={(reason) => {
            handleRejectAppointment(selectedAppointment.id, reason)
            setShowApprovalModal(false)
          }}
        />
      )}

      {/* Collect Payment Modal */}
      {completingAppointment && (
        <CollectPaymentModal
          open={showCollectModal}
          onClose={() => {
            setShowCollectModal(false)
            setCompletingAppointment(null)
          }}
          onCollect={handleCollectPayment}
          appointmentData={{
            patientName: completingAppointment.patientName || "Unknown Patient",
            service: completingAppointment.service || "Treatment",
            suggestedAmount: calculatedAmount,
          }}
        />
      )}
    </MainLayout>
  )
}
