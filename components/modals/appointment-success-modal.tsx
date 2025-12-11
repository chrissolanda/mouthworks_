import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { CheckCircle, X } from "lucide-react"

interface AppointmentSuccessModalProps {
  appointment: {
    patient_name?: string
    dentist_name?: string
    date: string
    time: string
    service?: string
  }
  onClose: () => void
}

export default function AppointmentSuccessModal({ appointment, onClose }: AppointmentSuccessModalProps) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg bg-card">
        <CardHeader className="border-b border-border relative">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Appointment Created Successfully!</CardTitle>
              <p className="text-sm text-muted-foreground mt-1">The appointment has been scheduled</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1 hover:bg-muted rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </CardHeader>
        <CardContent className="pt-6 space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Patient</span>
              <span className="font-medium">{appointment.patient_name || "Unknown"}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Dentist</span>
              <span className="font-medium">{appointment.dentist_name || "Assigned"}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Date</span>
              <span className="font-medium">{appointment.date}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Time</span>
              <span className="font-medium">{appointment.time}</span>
            </div>
            
            <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
              <span className="text-sm text-muted-foreground">Service</span>
              <span className="font-medium">{appointment.service || "Not specified"}</span>
            </div>
          </div>

          <div className="pt-4 flex gap-3">
            <Button onClick={onClose} className="flex-1 bg-primary hover:bg-primary/90">
              Done
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
