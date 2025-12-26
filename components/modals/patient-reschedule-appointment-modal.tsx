"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarIcon, Clock } from "lucide-react"
import { appointmentService } from "@/lib/db-service"

interface PatientRescheduleAppointmentModalProps {
  isOpen: boolean
  onClose: () => void
  onSubmit: (data: any) => void
  appointment: any
}

export default function PatientRescheduleAppointmentModal({
  isOpen,
  onClose,
  onSubmit,
  appointment,
}: PatientRescheduleAppointmentModalProps) {
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    notes: "",
  })
  const [loading, setLoading] = useState(false)
  const [availableTimes, setAvailableTimes] = useState<string[]>([])

  useEffect(() => {
    if (appointment) {
      setFormData({
        date: appointment.date || "",
        time: appointment.time || "",
        notes: appointment.notes || "",
      })
    }
  }, [appointment])

  useEffect(() => {
    // Generate available time slots (9 AM to 5 PM)
    const times = []
    for (let hour = 9; hour <= 17; hour++) {
      const time24 = `${hour.toString().padStart(2, '0')}:00`
      let time12 = hour <= 12 ? `${hour}:00 AM` : `${hour - 12}:00 PM`
      if (hour === 12) time12 = "12:00 PM"
      times.push(time24)
    }
    setAvailableTimes(times)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Update the appointment with new date/time
      const updatedAppointment = await appointmentService.update(appointment.id, {
        date: formData.date,
        time: formData.time,
        notes: formData.notes,
        status: "pending", // Reset to pending for re-approval
      })

      onSubmit(updatedAppointment)
      onClose()
    } catch (error) {
      console.error("Error rescheduling appointment:", error)
      alert("Failed to reschedule appointment. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  // Get minimum date (today)
  const getMinDate = () => {
    const today = new Date()
    return today.toISOString().split('T')[0]
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Reschedule Appointment</DialogTitle>
          <DialogDescription>
            Update your appointment date and time. Your request will need to be approved again.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Current Appointment Info */}
          <div className="p-3 bg-muted rounded-lg">
            <p className="text-sm font-medium text-foreground">{appointment?.service}</p>
            <p className="text-xs text-muted-foreground">
              Current: {appointment?.date ? new Date(appointment.date).toLocaleDateString() : ""} at {appointment?.time}
            </p>
          </div>

          {/* Date Selection */}
          <div className="space-y-2">
            <Label htmlFor="date">New Date</Label>
            <div className="relative">
              <CalendarIcon className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="date"
                type="date"
                min={getMinDate()}
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Time Selection */}
          <div className="space-y-2">
            <Label htmlFor="time">New Time</Label>
            <Select value={formData.time} onValueChange={(value) => handleInputChange("time", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select a time" />
              </SelectTrigger>
              <SelectContent>
                {availableTimes.map((time) => (
                  <SelectItem key={time} value={time}>
                    {time}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Reason for Rescheduling (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Please provide a reason for rescheduling..."
              value={formData.notes}
              onChange={(e) => handleInputChange("notes", e.target.value)}
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Rescheduling..." : "Reschedule Appointment"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
