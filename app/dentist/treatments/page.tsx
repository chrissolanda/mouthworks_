"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutDashboard, Calendar, Bluetooth as Tooth, BarChart3, Search, DollarSign, Package } from "lucide-react"
import { treatmentRecordService, dentistService } from "@/lib/db-service"
import { formatCurrency } from "@/lib/utils"

interface TreatmentRecord {
  id: string
  patient_id: string
  dentist_id: string
  appointment_id?: string
  treatment_id?: string
  date: string
  quantity: number
  notes?: string
  patients?: { name: string; email: string }
  treatments?: { name: string; price: number; category: string }
}

export default function DentistTreatments() {
  const { user } = useAuth()
  const [treatmentRecords, setTreatmentRecords] = useState<TreatmentRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [dentistTableId, setDentistTableId] = useState<string | null>(null)

  useEffect(() => {
    loadData()
    // Auto-refresh every 5 seconds
    const interval = setInterval(() => {
      loadData()
    }, 5000)
    return () => clearInterval(interval)
  }, [user?.email])

  const loadData = async () => {
    if (!user?.email) return
    
    try {
      setLoading(true)
      // Get dentist table ID
      const dentists = await dentistService.getAll()
      const matchByUser = (dentists || []).find((d: any) => d.user_id === user.id)
      const matchByEmail = (dentists || []).find(
        (d: any) => (d.email || "").toLowerCase() === (user.email || "").toLowerCase()
      )
      const match = matchByUser || matchByEmail
      
      if (match?.id) {
        setDentistTableId(match.id)
        // Load treatment records for this dentist
        const records = await treatmentRecordService.getByDentistId(match.id)
        setTreatmentRecords(records || [])
      }
    } catch (error) {
      console.error("[v0] Error loading treatment records:", error)
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

  const filteredRecords = treatmentRecords.filter(
    (t) =>
      t.patients?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.treatments?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <MainLayout navItems={navItems} title="Treatment Records">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Treatment Records</h2>
            <p className="text-muted-foreground">View all treatments you've performed</p>
          </div>
          <Button
            onClick={loadData}
            variant="outline"
            className="gap-2"
          >
            🔄 Refresh
          </Button>
        </div>

        {/* Search */}
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by patient name or treatment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 border-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Treatment Records */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Treatments</CardTitle>
            <CardDescription>{filteredRecords.length} treatment record(s)</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground">Loading treatment records...</p>
              </div>
            ) : filteredRecords.length === 0 ? (
              <div className="text-center py-12">
                <Package className="w-16 h-16 mx-auto mb-4 text-muted-foreground opacity-30" />
                <p className="text-muted-foreground mb-2">No treatment records found</p>
                <p className="text-sm text-muted-foreground">
                  Treatment records will appear here after you complete appointments with treatments
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredRecords.map((record) => (
                  <div
                    key={record.id}
                    className="p-5 border-2 border-border rounded-lg hover:border-primary/50 hover:shadow-md transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Tooth className="w-5 h-5 text-primary" />
                          <h3 className="text-lg font-bold text-foreground">
                            {record.treatments?.name || "Treatment"}
                          </h3>
                          {record.treatments?.category && (
                            <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full">
                              {record.treatments.category}
                            </span>
                          )}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                          <div>
                            <span className="text-muted-foreground">Patient:</span>{" "}
                            <span className="font-medium text-foreground">
                              {record.patients?.name || "Unknown"}
                            </span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Date:</span>{" "}
                            <span className="font-medium text-foreground">{record.date}</span>
                          </div>
                          <div>
                            <span className="text-muted-foreground">Quantity:</span>{" "}
                            <span className="font-medium text-foreground">{record.quantity || 1}</span>
                          </div>
                        </div>
                      </div>
                      {record.treatments?.price && (
                        <div className="text-right ml-4">
                          <p className="text-xs text-muted-foreground">Amount</p>
                          <p className="text-xl font-bold text-primary">
                            {formatCurrency(record.treatments.price * (record.quantity || 1))}
                          </p>
                        </div>
                      )}
                    </div>
                    {record.notes && (
                      <div className="mt-3 pt-3 border-t border-border">
                        <p className="text-sm font-medium text-muted-foreground mb-1">Notes</p>
                        <p className="text-sm text-foreground bg-muted/30 p-2 rounded">
                          {record.notes}
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
