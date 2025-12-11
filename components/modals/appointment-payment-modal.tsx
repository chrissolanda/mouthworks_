"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, User, Calendar, Stethoscope, Package, Receipt, Download, Printer } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { downloadReceipt, printReceipt, type ReceiptData } from "@/lib/receipt-generator"

interface AppointmentPaymentModalProps {
  appointment: {
    id: string
    patient_id: string
    dentist_id?: string
    date: string
    time: string
    service?: string
    treatment?: string
    amount?: number
    patients?: { name: string; email?: string }
    dentists?: { name: string }
  }
  onClose: () => void
  onRecordPayment: (data: { method: string; amount: number; notes: string }) => Promise<string> | void
}

export default function AppointmentPaymentModal({ appointment, onClose, onRecordPayment }: AppointmentPaymentModalProps) {
  const [formData, setFormData] = useState({
    amount: String(appointment.amount || 0),
    method: "Cash",
    notes: `${appointment.service || "Treatment"} - ${appointment.date}`,
  })
  const [receiptData, setReceiptData] = useState<ReceiptData | null>(null)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.amount && formData.notes) {
      try {
        const result = await onRecordPayment({
          method: formData.method,
          amount: Number.parseFloat(formData.amount),
          notes: formData.notes,
        })
        
        // Generate receipt ID (use payment ID if returned, otherwise generate one)
        const receiptNumber = typeof result === 'string' ? result : `RCP-${Date.now()}`
        
        // Prepare receipt data
        const receipt: ReceiptData = {
          receiptNumber,
          date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
          patientName: appointment.patients?.name || "Unknown Patient",
          patientEmail: appointment.patients?.email,
          dentistName: appointment.dentists?.name || "Not Assigned",
          service: appointment.service || appointment.treatment || "Treatment",
          amount: Number.parseFloat(formData.amount),
          method: formData.method,
          notes: formData.notes,
        }
        
        setReceiptData(receipt)
        setIsSubmitted(true)
      } catch (error) {
        console.error("Error recording payment:", error)
      }
    }
  }
  
  if (isSubmitted && receiptData) {
    return (
      <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
        <div className="bg-card rounded-xl shadow-2xl max-w-md w-full">
          <div className="p-6 text-center space-y-6">
            <div className="w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center">
              <Receipt className="w-8 h-8 text-green-600" />
            </div>
            
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">Payment Recorded!</h2>
              <p className="text-muted-foreground">
                Receipt #{receiptData.receiptNumber} has been generated
              </p>
            </div>
            
            <div className="bg-muted/50 rounded-lg p-4 text-left">
              <div className="flex justify-between mb-2">
                <span className="text-sm text-muted-foreground">Amount:</span>
                <span className="font-bold">{formatCurrency(receiptData.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-muted-foreground">Method:</span>
                <span className="font-medium">{receiptData.method}</span>
              </div>
            </div>
            
            <div className="flex flex-col gap-2">
              <Button
                onClick={() => downloadReceipt(receiptData)}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                <Download className="w-4 h-4 mr-2" />
                Download Receipt
              </Button>
              <Button
                onClick={() => printReceipt(receiptData)}
                variant="outline"
                className="w-full"
              >
                <Printer className="w-4 h-4 mr-2" />
                Print Receipt
              </Button>
              <Button
                onClick={onClose}
                variant="outline"
                className="w-full mt-2"
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <h2 className="text-2xl font-bold text-foreground">Complete Appointment & Record Payment</h2>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Appointment Details */}
        <div className="p-6 space-y-6">
          <div className="bg-muted/50 rounded-lg p-6 space-y-4">
            <h3 className="text-lg font-bold text-foreground mb-4">Appointment Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <User className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Patient</p>
                  <p className="text-base font-bold text-foreground">{appointment.patients?.name || "Unknown"}</p>
                  {appointment.patients?.email && (
                    <p className="text-xs text-muted-foreground">{appointment.patients.email}</p>
                  )}
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Stethoscope className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dentist</p>
                  <p className="text-base font-bold text-foreground">{appointment.dentists?.name || "Not Assigned"}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Calendar className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Date & Time</p>
                  <p className="text-base font-bold text-foreground">{appointment.date}</p>
                  <p className="text-sm text-muted-foreground">{appointment.time}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Package className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Service / Treatment</p>
                  <p className="text-base font-bold text-foreground">{appointment.service || appointment.treatment || "Not Specified"}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <h3 className="text-lg font-bold text-foreground">Payment Information</h3>
            
            {/* Expected Amount Display */}
            <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Appointment Amount</p>
                  <p className="text-xs text-blue-600">Expected payment for this service</p>
                </div>
                <p className="text-2xl font-bold text-blue-900">{formatCurrency(appointment.amount || 0)}</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Amount Paid by Patient (₱) *</label>
              <Input
                name="amount"
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={handleInputChange}
                placeholder="0.00"
                className="border-border h-11 text-lg font-bold"
                required
              />
              <p className="text-xs text-muted-foreground">Enter the actual amount the patient paid</p>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Payment Method *</label>
              <select
                name="method"
                value={formData.method}
                onChange={handleInputChange}
                className="w-full px-3 py-2.5 h-11 border border-border rounded-lg bg-background text-foreground"
                required
              >
                <option>Cash</option>
                <option>Bank Transfer</option>
                <option>Credit Card</option>
                <option>Debit Card</option>
                <option>Check</option>
                <option>Insurance</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Notes / Description *</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Payment details, receipt number, etc."
                className="w-full p-3 border border-border rounded-lg text-sm resize-none bg-background text-foreground"
                rows={3}
                required
              />
            </div>

            {/* Summary Box */}
            <div className="bg-primary/10 border-2 border-primary rounded-lg p-4 space-y-3">
              <div className="flex items-center justify-between pb-3 border-b border-primary/20">
                <span className="text-sm font-medium text-muted-foreground">Appointment Amount:</span>
                <span className="text-lg font-bold text-foreground">{formatCurrency(appointment.amount || 0)}</span>
              </div>
              <div className="flex items-center justify-between pb-3 border-b border-primary/20">
                <span className="text-sm font-medium text-foreground">Amount Paid:</span>
                <span className="text-2xl font-bold text-primary">{formatCurrency(Number.parseFloat(formData.amount || "0"))}</span>
              </div>
              {Number.parseFloat(formData.amount || "0") !== (appointment.amount || 0) && (
                <div className="flex items-center justify-between pb-3 border-b border-primary/20">
                  <span className="text-sm font-medium text-muted-foreground">
                    {Number.parseFloat(formData.amount || "0") > (appointment.amount || 0) ? "Overpaid:" : "Balance Due:"}
                  </span>
                  <span className={`text-lg font-bold ${Number.parseFloat(formData.amount || "0") > (appointment.amount || 0) ? "text-green-600" : "text-red-600"}`}>
                    {formatCurrency(Math.abs(Number.parseFloat(formData.amount || "0") - (appointment.amount || 0)))}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-sm pt-2">
                <span className="text-muted-foreground">Dentist Share (50%):</span>
                <span className="font-semibold text-foreground">{formatCurrency(Number.parseFloat(formData.amount || "0") * 0.5)}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Clinic Share (50%):</span>
                <span className="font-semibold text-foreground">{formatCurrency(Number.parseFloat(formData.amount || "0") * 0.5)}</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button type="button" onClick={onClose} variant="outline" className="flex-1 h-11 bg-transparent">
                Cancel
              </Button>
              <Button type="submit" className="flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold">
                <Receipt className="w-4 h-4 mr-2" />
                Record Payment
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
