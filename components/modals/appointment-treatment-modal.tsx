"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { X, User, Calendar, Stethoscope, Plus, Trash2, Package } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { treatmentService } from "@/lib/db-service"

interface AppointmentTreatmentModalProps {
  appointment: {
    id: string
    patient_id: string
    dentist_id?: string
    date: string
    time: string
    service?: string
    amount?: number
    patients?: { name: string; email?: string }
    dentists?: { name: string }
  }
  onClose: () => void
  onSaveAndComplete: (treatments: SelectedTreatment[], totalAmount: number) => Promise<void>
}

interface Treatment {
  id: string
  name: string
  category: string
  description?: string
  price: number
  duration?: string
}

interface SelectedTreatment {
  treatment_id: string
  name: string
  price: number
  quantity: number
}

export default function AppointmentTreatmentModal({ appointment, onClose, onSaveAndComplete }: AppointmentTreatmentModalProps) {
  const [allTreatments, setAllTreatments] = useState<Treatment[]>([])
  const [selectedTreatments, setSelectedTreatments] = useState<SelectedTreatment[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadTreatments()
  }, [])

  const loadTreatments = async () => {
    try {
      const data = await treatmentService.getAll()
      setAllTreatments(data || [])
    } catch (error) {
      console.error("Error loading treatments:", error)
    } finally {
      setLoading(false)
    }
  }

  const getSuggestedTreatments = () => {
    if (!appointment.service) return []
    
    const service = appointment.service.toLowerCase()
    const suggestions: string[] = []

    if (service.includes("cleaning")) {
      suggestions.push("Professional Cleaning", "Scaling & Polishing", "Fluoride Treatment")
    } else if (service.includes("checkup") || service.includes("examination")) {
      suggestions.push("Comprehensive Oral Exam", "X-Ray (Full Mouth)", "Periodontal Screening")
    } else if (service.includes("filling")) {
      suggestions.push("Composite Filling", "Amalgam Filling", "Temporary Filling")
    } else if (service.includes("extraction")) {
      suggestions.push("Simple Extraction", "Surgical Extraction", "Wisdom Tooth Extraction")
    } else if (service.includes("root canal")) {
      suggestions.push("Root Canal Treatment", "Endodontic Therapy", "Root Canal Retreatment")
    } else if (service.includes("crown") || service.includes("bridge")) {
      suggestions.push("Porcelain Crown", "Metal Crown", "Bridge Installation")
    } else if (service.includes("whitening") || service.includes("bleaching")) {
      suggestions.push("Teeth Whitening", "In-Office Bleaching", "Take-Home Whitening Kit")
    } else if (service.includes("orthodontic") || service.includes("braces")) {
      suggestions.push("Orthodontic Consultation", "Braces Installation", "Retainer Fitting")
    }

    return allTreatments.filter(t => 
      suggestions.some(s => t.name.toLowerCase().includes(s.toLowerCase()))
    )
  }

  const filteredTreatments = searchTerm 
    ? allTreatments.filter(t => 
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : getSuggestedTreatments().length > 0 
      ? getSuggestedTreatments() 
      : allTreatments

  const addTreatment = (treatment: Treatment) => {
    const existing = selectedTreatments.find(st => st.treatment_id === treatment.id)
    if (existing) {
      setSelectedTreatments(prev => 
        prev.map(st => 
          st.treatment_id === treatment.id 
            ? { ...st, quantity: st.quantity + 1 } 
            : st
        )
      )
    } else {
      setSelectedTreatments(prev => [...prev, {
        treatment_id: treatment.id,
        name: treatment.name,
        price: treatment.price,
        quantity: 1
      }])
    }
  }

  const removeTreatment = (treatment_id: string) => {
    setSelectedTreatments(prev => prev.filter(st => st.treatment_id !== treatment_id))
  }

  const updateQuantity = (treatment_id: string, quantity: number) => {
    if (quantity < 1) return
    setSelectedTreatments(prev => 
      prev.map(st => 
        st.treatment_id === treatment_id ? { ...st, quantity } : st
      )
    )
  }

  const totalAmount = selectedTreatments.reduce((sum, st) => sum + (st.price * st.quantity), 0)

  const handleComplete = async () => {
    if (selectedTreatments.length === 0) {
      alert("Please add at least one treatment before completing.")
      return
    }
    
    try {
      await onSaveAndComplete(selectedTreatments, totalAmount)
    } catch (error) {
      console.error("Error saving treatments:", error)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
      <div className="bg-card rounded-xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Add Treatments - Procedure in Progress</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Select treatments performed for {appointment.patients?.name}
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-muted rounded-lg transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Patient Info */}
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium">Patient</p>
                  <p className="font-bold text-blue-900">{appointment.patients?.name}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium">Appointment</p>
                  <p className="font-bold text-blue-900">{appointment.date} at {appointment.time}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                  <Stethoscope className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-blue-600 font-medium">Service</p>
                  <p className="font-bold text-blue-900">{appointment.service || "General Treatment"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Available Treatments */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-bold mb-2">
                  {getSuggestedTreatments().length > 0 ? "Suggested Treatments" : "All Treatments"}
                </h3>
                <Input
                  placeholder="Search treatments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="mb-3"
                />
              </div>
              
              <div className="border-2 border-border rounded-lg p-4 space-y-2 max-h-[400px] overflow-y-auto">
                {loading ? (
                  <p className="text-center text-muted-foreground py-4">Loading treatments...</p>
                ) : filteredTreatments.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No treatments found</p>
                ) : (
                  filteredTreatments.map((treatment) => (
                    <button
                      key={treatment.id}
                      onClick={() => addTreatment(treatment)}
                      className="w-full p-3 border border-border rounded-lg hover:bg-muted hover:border-primary transition-all text-left group"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-bold text-foreground group-hover:text-primary">{treatment.name}</p>
                          <p className="text-xs text-muted-foreground">{treatment.category}</p>
                          {treatment.description && (
                            <p className="text-xs text-muted-foreground mt-1">{treatment.description}</p>
                          )}
                        </div>
                        <div className="text-right ml-3">
                          <p className="font-bold text-primary">{formatCurrency(treatment.price)}</p>
                          {treatment.duration && (
                            <p className="text-xs text-muted-foreground">{treatment.duration}</p>
                          )}
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Selected Treatments */}
            <div className="space-y-4">
              <h3 className="text-lg font-bold">Selected Treatments ({selectedTreatments.length})</h3>
              
              <div className="border-2 border-primary rounded-lg p-4 space-y-3 min-h-[400px]">
                {selectedTreatments.length === 0 ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Package className="w-12 h-12 mx-auto mb-2 opacity-30" />
                    <p>No treatments selected yet</p>
                    <p className="text-sm">Click on treatments from the left to add them</p>
                  </div>
                ) : (
                  <>
                    {selectedTreatments.map((st) => (
                      <div key={st.treatment_id} className="p-3 bg-muted rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <p className="font-bold text-foreground">{st.name}</p>
                          <button
                            onClick={() => removeTreatment(st.treatment_id)}
                            className="p-1 hover:bg-destructive/10 rounded text-destructive"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => updateQuantity(st.treatment_id, st.quantity - 1)}
                              className="w-7 h-7 border border-border rounded hover:bg-background"
                            >
                              -
                            </button>
                            <Input
                              type="number"
                              value={st.quantity}
                              onChange={(e) => updateQuantity(st.treatment_id, parseInt(e.target.value) || 1)}
                              className="w-16 h-7 text-center"
                              min="1"
                            />
                            <button
                              onClick={() => updateQuantity(st.treatment_id, st.quantity + 1)}
                              className="w-7 h-7 border border-border rounded hover:bg-background"
                            >
                              +
                            </button>
                          </div>
                          <div className="flex-1 text-right">
                            <p className="text-sm text-muted-foreground">
                              {formatCurrency(st.price)} × {st.quantity}
                            </p>
                            <p className="font-bold text-primary">
                              {formatCurrency(st.price * st.quantity)}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}

                    <div className="border-t-2 border-primary pt-3 mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-lg font-bold text-foreground">Total Amount:</span>
                        <span className="text-2xl font-bold text-primary">{formatCurrency(totalAmount)}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        This amount will be charged to the patient
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t">
            <Button 
              onClick={onClose} 
              variant="outline" 
              className="flex-1 h-12"
            >
              Cancel
            </Button>
            <Button 
              onClick={handleComplete}
              className="flex-1 h-12 bg-green-600 hover:bg-green-700 text-white font-bold"
              disabled={selectedTreatments.length === 0}
            >
              Save & Complete Appointment
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
