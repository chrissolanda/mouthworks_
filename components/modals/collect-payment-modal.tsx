"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { DollarSign, CreditCard, Banknote, Wallet } from "lucide-react"

interface CollectPaymentModalProps {
  open: boolean
  onClose: () => void
  onCollect: (paymentData: { method: string; amount: number; notes?: string }) => void
  appointmentData: {
    patientName: string
    service: string
    suggestedAmount: number
  }
}

export default function CollectPaymentModal({ open, onClose, onCollect, appointmentData }: CollectPaymentModalProps) {
  const [method, setMethod] = useState("cash")
  const [amount, setAmount] = useState(appointmentData.suggestedAmount)
  const [notes, setNotes] = useState("")
  const [collecting, setCollecting] = useState(false)

  const handleCollect = async () => {
    setCollecting(true)
    try {
      await onCollect({ method, amount, notes })
      // Reset form
      setMethod("cash")
      setAmount(appointmentData.suggestedAmount)
      setNotes("")
    } finally {
      setCollecting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <DollarSign className="w-6 h-6 text-green-600" />
            Collect Payment
          </DialogTitle>
          <DialogDescription>
            Record payment for completed appointment
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Appointment Info */}
          <div className="bg-muted p-4 rounded-lg space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Patient:</span>
              <span className="font-semibold">{appointmentData.patientName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Service:</span>
              <span className="font-semibold">{appointmentData.service}</span>
            </div>
            <div className="flex justify-between border-t pt-2 mt-2">
              <span className="text-sm text-muted-foreground">Amount Due:</span>
              <span className="text-2xl font-bold text-green-600">₱{appointmentData.suggestedAmount.toLocaleString()}</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="space-y-2">
            <Label htmlFor="method">Payment Method</Label>
            <Select value={method} onValueChange={setMethod}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="cash">
                  <div className="flex items-center gap-2">
                    <Banknote className="w-4 h-4" />
                    Cash
                  </div>
                </SelectItem>
                <SelectItem value="credit_card">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Credit Card
                  </div>
                </SelectItem>
                <SelectItem value="debit_card">
                  <div className="flex items-center gap-2">
                    <CreditCard className="w-4 h-4" />
                    Debit Card
                  </div>
                </SelectItem>
                <SelectItem value="bank_transfer">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    Bank Transfer
                  </div>
                </SelectItem>
                <SelectItem value="gcash">
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    GCash
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Amount */}
          <div className="space-y-2">
            <Label htmlFor="amount">Amount Collected (₱)</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              min={0}
              step={0.01}
            />
          </div>

          {/* Notes */}
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="e.g., Paid in full, Change given: ₱50"
            />
          </div>

          {/* Your Share Info */}
          <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-blue-900 dark:text-blue-100">Your Share (50%):</span>
              <span className="text-xl font-bold text-blue-600 dark:text-blue-400">₱{(amount * 0.5).toLocaleString()}</span>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={collecting}>
            Cancel
          </Button>
          <Button onClick={handleCollect} disabled={collecting} className="gap-2">
            {collecting ? (
              "Processing..."
            ) : (
              <>
                <DollarSign className="w-4 h-4" />
                Confirm Collection
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
