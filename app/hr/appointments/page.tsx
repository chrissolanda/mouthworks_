"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
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
  CheckCircle,
  XCircle,
  Clock,
  UserPlus,
} from "lucide-react"
import { appointmentService, treatmentRecordService, paymentService } from "@/lib/db-service"
import { formatCurrency } from "@/lib/utils"
import ScheduleAppointmentModal from "@/components/modals/schedule-appointment-modal"
import AssignDentistModal from "@/components/modals/assign-dentist-modal"
import AppointmentPaymentModal from "@/components/modals/appointment-payment-modal"
import AppointmentSuccessModal from "@/components/modals/appointment-success-modal"

interface Appointment {
  id: string
  patient_id: string
  dentist_id?: string
  date: string
  time: string
  service?: string
  treatment?: string
  amount?: number
  status: "pending" | "confirmed" | "attended" | "in-progress" | "completed" | "paid" | "cancelled" | "rejected"
  notes?: string
  patients?: { name: string }
  dentists?: { name: string }
}

export default function HRAppointments() {
  const { user } = useAuth()
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)
  const [showScheduleModal, setShowScheduleModal] = useState(false)
  const [showAssignModal, setShowAssignModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [successAppointment, setSuccessAppointment] = useState<any>(null)
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [filter, setFilter] = useState("all")

  useEffect(() => {
    loadAppointments()
    // Auto-refresh every 3 seconds to sync appointments
    const interval = setInterval(() => {
      loadAppointments()
    }, 3000)
    
    // Listen for all data change events to refresh immediately
    const handleDataChange = () => {
      loadAppointments()
    }
    
    // Register listeners for all data change events
    window.addEventListener('appointmentCreated', handleDataChange)
    window.addEventListener('appointmentUpdated', handleDataChange)
    window.addEventListener('appointmentDeleted', handleDataChange)
    window.addEventListener('paymentRecorded', handleDataChange)
    window.addEventListener('paymentDeleted', handleDataChange)
    window.addEventListener('patientCreated', handleDataChange)
    window.addEventListener('patientUpdated', handleDataChange)
    window.addEventListener('patientDeleted', handleDataChange)
    window.addEventListener('treatmentCreated', handleDataChange)
    window.addEventListener('treatmentUpdated', handleDataChange)
    window.addEventListener('dataChanged', handleDataChange) // Generic catch-all
    
    return () => {
      clearInterval(interval)
      window.removeEventListener('appointmentCreated', handleDataChange)
      window.removeEventListener('appointmentUpdated', handleDataChange)
      window.removeEventListener('appointmentDeleted', handleDataChange)
      window.removeEventListener('paymentRecorded', handleDataChange)
      window.removeEventListener('paymentDeleted', handleDataChange)
      window.removeEventListener('patientCreated', handleDataChange)
      window.removeEventListener('patientUpdated', handleDataChange)
      window.removeEventListener('patientDeleted', handleDataChange)
      window.removeEventListener('treatmentCreated', handleDataChange)
      window.removeEventListener('treatmentUpdated', handleDataChange)
      window.removeEventListener('dataChanged', handleDataChange)
    }
  }, [])

  const loadAppointments = async () => {
    try {
      setLoading(true)
      const data = await appointmentService.getAll()
      setAppointments(data || [])
    } catch (error) {
      console.error("[v0] Error loading appointments:", error)
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

  const handleScheduleAppointment = async (data: any) => {
    try {
      // #region agent log
      const today = new Date().toISOString().split("T")[0]
      fetch('http://127.0.0.1:7242/ingest/c0a6aa0c-74d6-4100-87e9-5e0b60c6253b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/hr/appointments/page.tsx:87',message:'Creating appointment - before API call',data:{submittedDate:data.date,today,patientName:data.patient_name},timestamp:Date.now(),sessionId:'debug-session',runId:'appointment-date-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.log("[v0] HR creating appointment with data:", data)
      const newAppointment = await appointmentService.create(data)
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/c0a6aa0c-74d6-4100-87e9-5e0b60c6253b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'app/hr/appointments/page.tsx:90',message:'Appointment created - after API call',data:{submittedDate:data.date,savedDate:newAppointment?.date,today,patientName:data.patient_name},timestamp:Date.now(),sessionId:'debug-session',runId:'appointment-date-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.log("[v0] ✅ Appointment created successfully:", newAppointment)
      
      // Reload appointments to get fresh data from database
      await loadAppointments()
      
      // Dispatch events to notify other pages (especially dashboard)
      if (typeof window !== 'undefined') {
        console.log("[v0] Appointments: Dispatching appointmentCreated and dataChanged events")
        // Dispatch immediately and also after a short delay to ensure database write is complete
        window.dispatchEvent(new CustomEvent('appointmentCreated'))
        window.dispatchEvent(new CustomEvent('dataChanged'))
        // Also trigger storage event for cross-tab sync
        localStorage.setItem('dataChanged', Date.now().toString())
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent('appointmentCreated'))
          window.dispatchEvent(new CustomEvent('dataChanged'))
        }, 200)
      }
      
      setShowScheduleModal(false)
      
      // Show success modal instead of alert
      setSuccessAppointment({
        patient_name: data.patient_name,
        dentist_name: data.dentist_name,
        date: data.date,
        time: data.time,
        service: data.service,
      })
      setShowSuccessModal(true)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
      console.error("[v0] Error scheduling appointment:", errorMsg)
      alert(`Error creating appointment: ${errorMsg}`)
    }
  }

  const handleAssignDentist = async (dentistId: string) => {
    if (!selectedAppointment) return
    try {
      // Assign dentist and mark as pending so the dentist sees it for approval
      const updated = await appointmentService.update(selectedAppointment.id, {
        dentist_id: dentistId,
        status: "pending",
      })
      setAppointments(appointments.map((a) => (a.id === selectedAppointment.id ? updated : a)))
      
      // Dispatch events to notify other pages
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('appointmentUpdated'))
        window.dispatchEvent(new CustomEvent('dataChanged'))
      }
      // Record the assignment in treatment_records so the dentist has a persisted assignment entry
      try {
        await treatmentRecordService.create({
          appointment_id: selectedAppointment.id,
          patient_id: selectedAppointment.patient_id,
          dentist_id: dentistId,
          description: "Assigned appointment by HR",
          notes: `Assigned on ${new Date().toISOString()}`,
          date: new Date().toISOString(),
        })
      } catch (recErr) {
        console.warn("[v0] Warning creating treatment record for assignment:", recErr)
      }
      setShowAssignModal(false)
      setSelectedAppointment(null)
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : JSON.stringify(error)
      console.error("[v0] Error assigning dentist:", errorMsg)
      alert(`Error: ${errorMsg}`)
    }
  }

  const handleDeleteAppointment = async (id: string) => {
    if (confirm("Are you sure you want to cancel this appointment?")) {
      try {
        await appointmentService.delete(id)
        setAppointments(appointments.filter((a) => a.id !== id))
        
        // Dispatch events to notify other pages
        if (typeof window !== 'undefined') {
          window.dispatchEvent(new CustomEvent('appointmentDeleted'))
          window.dispatchEvent(new CustomEvent('dataChanged'))
        }
      } catch (error) {
        console.error("[v0] Error deleting appointment:", error)
      }
    }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      const updated = await appointmentService.changeStatus(id, newStatus)
      setAppointments(appointments.map((a) => (a.id === id ? updated : a)))
      
      // Dispatch events to notify other pages
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('appointmentUpdated'))
        window.dispatchEvent(new CustomEvent('dataChanged'))
      }
    } catch (error) {
      console.error("[v0] Error updating appointment status:", error)
    }
  }

  const openAssignModal = (apt: Appointment) => {
    setSelectedAppointment(apt)
    setShowAssignModal(true)
  }

  const handleRecordPayment = async (paymentData: { method: string; amount: number; notes: string }): Promise<string> => {
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
      
      // Reload appointments to reflect the change
      await loadAppointments()
      
      // Dispatch events to notify other pages
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('paymentRecorded'))
        window.dispatchEvent(new CustomEvent('appointmentUpdated'))
        window.dispatchEvent(new CustomEvent('dataChanged'))
      }
      
      // Return payment ID for receipt generation
      return payment.id
    } catch (error) {
      console.error("[v0] Error recording payment:", error)
      throw new Error("Failed to record payment: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  const handleMarkAttended = async (appointmentId: string) => {
    try {
      await appointmentService.update(appointmentId, { status: "attended" })
      await loadAppointments()
      
      // Dispatch events to notify other pages
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('appointmentUpdated'))
        window.dispatchEvent(new CustomEvent('dataChanged'))
      }
      
      console.log("[v0] ✅ Appointment marked as attended")
    } catch (error) {
      console.error("[v0] Error marking as attended:", error)
      alert("Failed to mark appointment as attended")
    }
  }

  const filteredAppointments = filter === "all" ? appointments : appointments.filter((a) => a.status === filter)

  const statusGroups = {
    pending: filteredAppointments.filter((a) => a.status === "pending"),
    confirmed: filteredAppointments.filter((a) => a.status === "confirmed"),
    attended: filteredAppointments.filter((a) => a.status === "attended"),
    inProgress: filteredAppointments.filter((a) => a.status === "in-progress"),
    completed: filteredAppointments.filter((a) => a.status === "completed"),
    paid: filteredAppointments.filter((a) => a.status === "paid"),
  }

  return (
    <MainLayout navItems={navItems} title="Appointment Management">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Schedule Appointments</h2>
            <p className="text-muted-foreground">Manage patient bookings and dentist assignments</p>
          </div>
          <Button
            onClick={() => setShowScheduleModal(true)}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Plus className="w-4 h-4" />
            New Appointment
          </Button>
        </div>

        {/* COMPLETED APPOINTMENTS - AWAITING PAYMENT */}
        {statusGroups.completed.length > 0 && (
          <Card className="border-green-300 bg-green-50/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-900">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Completed Appointments - Ready for Payment ({statusGroups.completed.length})
              </CardTitle>
              <p className="text-sm text-green-700">Click on any appointment to record payment</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {statusGroups.completed.map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => {
                      setSelectedAppointment(apt)
                      setShowPaymentModal(true)
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

        {/* PAID APPOINTMENTS */}
        {statusGroups.paid.length > 0 && (
          <Card className="border-blue-300 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <CreditCard className="w-5 h-5 text-blue-600" />
                Paid Appointments ({statusGroups.paid.length})
              </CardTitle>
              <p className="text-sm text-blue-700">Appointments with recorded payments</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {statusGroups.paid.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-5 border-2 border-blue-200 bg-white rounded-lg"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-bold text-lg text-foreground">
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
                    <div className="flex items-center justify-between pt-3 border-t border-blue-200">
                      <span className="text-xs font-semibold text-blue-700 bg-blue-100 px-2 py-1 rounded">
                        ✓ PAID
                      </span>
                      {apt.amount && (
                        <span className="text-sm font-bold text-blue-900">
                          {formatCurrency(apt.amount)}
                        </span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* CONFIRMED APPOINTMENTS - PATIENT CHECK-IN */}
        {statusGroups.confirmed.length > 0 && (
          <Card className="border-purple-300 bg-purple-50/50 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-900">
                <CheckCircle className="w-5 h-5 text-purple-600" />
                Confirmed Appointments - Patient Check-In ({statusGroups.confirmed.length})
              </CardTitle>
              <p className="text-sm text-purple-700">Mark patients as attended when they arrive. Click to record payment.</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {statusGroups.confirmed.map((apt) => (
                  <button
                    key={apt.id}
                    onClick={() => {
                      setSelectedAppointment(apt)
                      setShowPaymentModal(true)
                    }}
                    className="p-5 border-2 border-purple-300 bg-white rounded-lg hover:bg-purple-50 hover:border-purple-500 transition-all text-left group"
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
                    <div className="flex items-center justify-between pt-3 border-t border-purple-200">
                      <span className="text-xs font-semibold text-purple-700 bg-purple-100 px-2 py-1 rounded">
                        ✓ CONFIRMED
                      </span>
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

        {/* PATIENT BOOKING REQUESTS - HIGHLIGHTED */}
        {statusGroups.pending.length > 0 && (
          <Card className="border-blue-300 bg-blue-50/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-900">
                <Clock className="w-5 h-5 text-blue-600" />
                Patient Booking Requests ({statusGroups.pending.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {statusGroups.pending.map((apt) => (
                  <div
                    key={apt.id}
                    className="p-4 border-2 border-blue-300 bg-white rounded-lg hover:bg-blue-50/30 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <p className="font-semibold text-lg text-foreground">
                          {apt.patients?.name || "Unknown Patient"}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {apt.service || "General Visit"} 
                          {apt.dentist_id ? ` with Dr. ${apt.dentists?.name}` : " - Dentist needed"}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-primary">{apt.date}</p>
                        <p className="text-sm text-muted-foreground">{apt.time}</p>
                      </div>
                    </div>
                    {apt.notes && (
                      <p className="text-sm text-muted-foreground mb-3 p-2 bg-muted/50 rounded">
                        <span className="font-medium">Patient Notes:</span> {apt.notes}
                      </p>
                    )}
                    <div className="flex gap-2">
                      {!apt.dentist_id ? (
                        <>
                          <Button
                            onClick={() => openAssignModal(apt)}
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                          >
                            <UserPlus className="w-4 h-4 mr-2" />
                            Assign Dentist
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAppointment(apt)
                              setShowPaymentModal(true)
                            }}
                            className="text-primary border-primary hover:bg-primary/10"
                          >
                            Record Payment
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleDeleteAppointment(apt.id)}
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </>
                      ) : (
                        <>
                          <p className="flex-1 text-sm text-muted-foreground pt-2">
                            Dentist assigned, awaiting approval
                          </p>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedAppointment(apt)
                              setShowPaymentModal(true)
                            }}
                            className="text-xs text-primary border-primary hover:bg-primary/10"
                          >
                            Record Payment
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openAssignModal(apt)}
                            className="text-xs"
                          >
                            Change
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Status Filters */}
        <div className="flex gap-2">
          {["all", "pending", "confirmed", "completed", "paid"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === status ? "bg-primary text-primary-foreground" : "bg-muted text-foreground hover:bg-muted/80"
              }`}
            >
              {status.charAt(0).toUpperCase() + status.slice(1)}
              {status !== "all" && ` (${statusGroups[status as keyof typeof statusGroups]?.length || 0})`}
            </button>
          ))}
        </div>

        {/* Loading State */}
        {loading ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center text-muted-foreground">Loading appointments...</div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {filter === "all" ? (
              <>
                {statusGroups.pending.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Clock className="w-5 h-5 text-yellow-600" />
                        Pending Approval ({statusGroups.pending.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {statusGroups.pending.map((apt) => (
                          <AppointmentCard
                            key={apt.id}
                            appointment={apt}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDeleteAppointment}
                            onRecordPayment={(apt: any) => {
                              setSelectedAppointment(apt)
                              setShowPaymentModal(true)
                            }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {statusGroups.confirmed.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Confirmed ({statusGroups.confirmed.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {statusGroups.confirmed.map((apt) => (
                          <AppointmentCard
                            key={apt.id}
                            appointment={apt}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDeleteAppointment}
                            onRecordPayment={(apt: any) => {
                              setSelectedAppointment(apt)
                              setShowPaymentModal(true)
                            }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}

                {statusGroups.completed.length > 0 && (
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        Completed ({statusGroups.completed.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {statusGroups.completed.map((apt) => (
                          <AppointmentCard
                            key={apt.id}
                            appointment={apt}
                            onStatusChange={handleStatusChange}
                            onDelete={handleDeleteAppointment}
                            onRecordPayment={(apt: any) => {
                              setSelectedAppointment(apt)
                              setShowPaymentModal(true)
                            }}
                          />
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                )}
              </>
            ) : (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-3">
                    {filteredAppointments.map((apt) => (
                      <AppointmentCard
                        key={apt.id}
                        appointment={apt}
                        onStatusChange={handleStatusChange}
                        onDelete={handleDeleteAppointment}
                        onRecordPayment={(apt: any) => {
                          setSelectedAppointment(apt)
                          setShowPaymentModal(true)
                        }}
                      />
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </div>

      {showScheduleModal && (
        <ScheduleAppointmentModal onClose={() => setShowScheduleModal(false)} onSubmit={handleScheduleAppointment} />
      )}

      {showSuccessModal && successAppointment && (
        <AppointmentSuccessModal
          appointment={successAppointment}
          onClose={() => {
            setShowSuccessModal(false)
            setSuccessAppointment(null)
          }}
        />
      )}

      {showAssignModal && selectedAppointment && (
        <AssignDentistModal
          appointment={selectedAppointment}
          onClose={() => setShowAssignModal(false)}
          onAssign={handleAssignDentist}
        />
      )}

      {showPaymentModal && selectedAppointment && (
        <AppointmentPaymentModal
          appointment={selectedAppointment}
          onClose={() => {
            setShowPaymentModal(false)
            setSelectedAppointment(null)
          }}
          onRecordPayment={handleRecordPayment}
        />
      )}
    </MainLayout>
  )
}

function AppointmentCard({ appointment, onStatusChange, onDelete, onRecordPayment }: any) {
  return (
    <div className="p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1">
          <p className="font-semibold text-foreground">{appointment.patients?.name || "Unknown Patient"}</p>
          <p className="text-sm text-muted-foreground">
            {appointment.service || "General Visit"} with {appointment.dentists?.name || "Unassigned"}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            appointment.status === "confirmed"
              ? "bg-green-100 text-green-700"
              : appointment.status === "pending"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-gray-100 text-gray-700"
          }`}
        >
          {appointment.status.charAt(0).toUpperCase() + appointment.status.slice(1)}
        </span>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-sm text-muted-foreground">
          {appointment.date} at {appointment.time}
        </div>
        <div className="flex gap-2">
          {onRecordPayment && appointment.status !== "paid" && (
            <Button
              size="sm"
              variant="outline"
              onClick={() => onRecordPayment(appointment)}
              className="text-primary border-primary hover:bg-primary/10"
            >
              Record Payment
            </Button>
          )}
          {appointment.status === "pending" && (
            <>
              <Button
                size="sm"
                onClick={() => onStatusChange(appointment.id, "confirmed")}
                className="bg-green-600 hover:bg-green-700 text-white text-xs"
              >
                <CheckCircle className="w-3 h-3 mr-1" />
                Confirm
              </Button>
              <Button
                size="sm"
                onClick={() => onStatusChange(appointment.id, "cancelled")}
                variant="outline"
                className="text-xs"
              >
                <XCircle className="w-3 h-3 mr-1" />
                Reject
              </Button>
            </>
          )}
          <Button
            size="sm"
            variant="outline"
            className="text-xs text-destructive hover:bg-destructive/10 bg-transparent"
            onClick={() => onDelete(appointment.id)}
          >
            <Trash2 className="w-3 h-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
