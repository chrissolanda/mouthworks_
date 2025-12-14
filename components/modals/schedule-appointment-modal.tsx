"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { patientService, dentistService, treatmentService } from "@/lib/db-service"
import { formatCurrency } from "@/lib/utils"

interface ScheduleAppointmentModalProps {
  onClose: () => void
  onSubmit: (data: any) => void
}

interface Patient {
  id: string
  name: string
  email: string
}

interface Dentist {
  id: string
  name: string
  email?: string
}

export default function ScheduleAppointmentModal({ onClose, onSubmit }: ScheduleAppointmentModalProps) {
  // Set default date to today in YYYY-MM-DD format (for date input)
  const getTodayDate = () => {
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  }
  
  const [formData, setFormData] = useState({
    patient_id: "",
    patient_name: "",
    dentist_id: null as string | null,
    dentist_name: "",
    date: getTodayDate(), // Default to today
    time: "",
    service: "",
    amount: 0,
    notes: "",
  })
  const [patients, setPatients] = useState<Patient[]>([])
  const [dentists, setDentists] = useState<Dentist[]>([])
  const [treatments, setTreatments] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      const [patientsData, dentistsData, treatmentsData] = await Promise.all([
        patientService.getAll(),
        dentistService.getAll(),
        treatmentService.getAll(),
      ])
      setPatients(patientsData || [])
      // Deduplicate dentists by normalized email/name to avoid duplicates from previous seeds
      const uniqDentists = (dentistsData || []).filter((d: any, idx: number, arr: any[]) => {
        const keyEmail = (d?.email || "").trim().toLowerCase()
        const keyName = (d?.name || "").trim().toLowerCase()
        const key = keyEmail || keyName || d?.id
        return arr.findIndex((x: any) => {
          const e = (x?.email || "").trim().toLowerCase()
          const n = (x?.name || "").trim().toLowerCase()
          const k = e || n || x?.id
          return k === key
        }) === idx
      })
      setDentists(uniqDentists)
      setTreatments(treatmentsData || [])
    } catch (err) {
      setError("Failed to load patients/dentists/services")
      console.error("Error loading data:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    
    // If selecting a service, also set the price
    if (name === "service") {
      const selectedTreatment = treatments.find((t) => t.name === value)
      const amount = selectedTreatment?.price || getDefaultServicePrice(value)
      setFormData((prev) => ({ ...prev, service: value, amount }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  // Default service prices if not found in database
  const getDefaultServicePrice = (serviceName: string): number => {
    const priceMap: Record<string, number> = {
      "Cleaning": 500,
      "Tooth Cleaning": 500,
      "Dental Cleaning": 500,
      "Filling": 800,
      "Dental Filling": 800,
      "Tooth Filling": 800,
      "Root Canal": 1500,
      "Root Canal Treatment": 1500,
      "Extraction": 600,
      "Tooth Extraction": 600,
      "Whitening": 2000,
      "Teeth Whitening": 2000,
      "Checkup": 300,
      "Dental Checkup": 300,
      "Consultation": 300,
      "Braces": 3000,
      "Dental Braces": 3000,
      "Crown": 2500,
      "Dental Crown": 2500,
    }
    return priceMap[serviceName] || 500 // Default to 500 if not found
  }

  const handlePatientChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const patientId = e.target.value
    const patient = patients.find((p) => p.id === patientId)
    setFormData((prev) => ({
      ...prev,
      patient_id: patientId,
      patient_name: patient?.name || "",
    }))
  }

  const handleDoctorChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dentistId = e.target.value
    const dentist = dentists.find((d) => d.id === dentistId)
    setFormData((prev) => ({
      ...prev,
      dentist_id: dentistId === "" ? null : dentistId, // Convert empty string to null
      dentist_name: dentist?.name || "",
    }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.patient_id && formData.dentist_id && formData.date && formData.time) {
      // Don't include amount in appointment data - it's not a column in appointments table
      // Amount will be calculated when payment is created after completion
      const submitData = {
        patient_id: formData.patient_id,
        dentist_id: formData.dentist_id,
        date: formData.date,
        time: formData.time,
        service: formData.service,
        notes: formData.notes,
        status: "pending",
      }
      // #region agent log
      const today = new Date().toISOString().split("T")[0]
      fetch('http://127.0.0.1:7242/ingest/c0a6aa0c-74d6-4100-87e9-5e0b60c6253b',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'components/modals/schedule-appointment-modal.tsx:155',message:'Submitting appointment - date check',data:{submittedDate:formData.date,today,patientName:formData.patient_name,service:formData.service},timestamp:Date.now(),sessionId:'debug-session',runId:'appointment-date-fix',hypothesisId:'A'})}).catch(()=>{});
      // #endregion
      console.log("[v0] Submitting appointment for service:", formData.service, "(price: ₱" + formData.amount + " will be charged when completed)")
      onSubmit(submitData)
    } else {
      setError("Please fill in all required fields including selecting a dentist")
    }
  }

  // Generate available time slots
  const timeSlots = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"]

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-lg shadow-2xl max-w-md w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card">
          <h2 className="text-xl font-bold text-foreground">Schedule Appointment</h2>
          <button onClick={onClose} className="p-1 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="p-4 bg-destructive/10 text-destructive text-sm">
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Patient *</label>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading patients...</div>
            ) : (
              <select
                name="patient_id"
                value={formData.patient_id}
                onChange={handlePatientChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                required
              >
                <option value="">Select patient...</option>
                {patients.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Dentist <span className="text-destructive">*</span></label>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading dentists...</div>
            ) : dentists.length === 0 ? (
              <div className="text-sm text-muted-foreground">No dentists available. Please add dentists first.</div>
            ) : (
              <select
                name="dentist_id"
                value={formData.dentist_id || ""}
                onChange={handleDoctorChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                required
              >
                <option value="">Select dentist...</option>
                {dentists.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            )}
            <p className="text-xs text-muted-foreground">The selected dentist will be notified to approve this appointment</p>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Service</label>
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading services...</div>
            ) : treatments.length === 0 ? (
              <div className="text-sm text-muted-foreground">No services available</div>
            ) : (
              <select
                name="service"
                value={formData.service}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
                required
              >
                <option value="">Select service...</option>
                {treatments.map((t) => (
                  <option key={t.id} value={t.name}>
                    {t.name} {t.price ? `- ${formatCurrency(t.price)}` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Date *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Time *</label>
            <select
              name="time"
              value={formData.time}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground"
              required
            >
              <option value="">Select time...</option>
              {timeSlots.map((time) => (
                <option key={time} value={time}>
                  {time}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Notes (Optional)</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Any special notes..."
              className="w-full p-2 border border-border rounded-lg text-sm resize-none bg-background text-foreground"
              rows={3}
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
            <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
              Schedule
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
