"use client"

import { Button } from "@/components/ui/button"
import { CheckCircle, User, Calendar, Package, DollarSign, ArrowRight } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { useRouter } from "next/navigation"

interface AppointmentCompleteModalProps {
  appointment: {
    patients?: { name: string }
    service?: string
    date: string
    amount?: number
  }
  treatmentCount?: number
  onClose: () => void
}

export default function AppointmentCompleteModal({ appointment, treatmentCount, onClose }: AppointmentCompleteModalProps) {
  const router = useRouter()

  const handleLoginAsHR = () => {
    // Clear current user and redirect to login
    localStorage.removeItem("user")
    router.push("/login")
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 text-center space-y-6">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full mx-auto flex items-center justify-center">
            <CheckCircle className="w-12 h-12 text-green-600" />
          </div>
          
          {/* Title */}
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">Appointment Completed!</h2>
            <p className="text-muted-foreground">
              Treatment has been successfully completed
            </p>
          </div>

          {/* Appointment Details */}
          <div className="bg-muted/50 rounded-lg p-4 text-left space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Patient</p>
                <p className="font-bold text-foreground">{appointment.patients?.name || "Unknown"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Service</p>
                <p className="font-bold text-foreground">{appointment.service || "Treatment"}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Date</p>
                <p className="font-bold text-foreground">{appointment.date}</p>
              </div>
            </div>

            {treatmentCount && treatmentCount > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Treatments Added</p>
                  <p className="font-bold text-foreground">{treatmentCount} treatment(s)</p>
                </div>
              </div>
            )}

            {appointment.amount && appointment.amount > 0 && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Total Amount</p>
                  <p className="font-bold text-green-600 text-lg">{formatCurrency(appointment.amount)}</p>
                </div>
              </div>
            )}
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 text-left">
            <p className="font-bold text-blue-900 mb-2">📋 Next Step: Payment Recording</p>
            <p className="text-sm text-blue-700">
              Please inform the HR/Admin staff to record the payment for this completed appointment. 
              The payment will be processed and your earnings will be updated automatically.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col gap-3">
            <Button
              onClick={handleLoginAsHR}
              className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-bold text-lg"
            >
              Log in as HR
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              onClick={onClose}
              variant="outline"
              className="w-full h-10"
            >
              Stay on Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
