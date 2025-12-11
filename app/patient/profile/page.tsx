"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import MainLayout from "@/components/layout/main-layout"
import { patientService } from "@/lib/db-service"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutDashboard, Calendar, User, CreditCard, Edit, Save, X } from "lucide-react"

export default function PatientProfile() {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [patientId, setPatientId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: "1990-05-15",
    gender: "Male",
    address: "123 Main St, City, State 12345",
  })

  // Load patient data on mount
  useEffect(() => {
    const loadPatientData = async () => {
      if (user?.email) {
        try {
          const patient = await patientService.getByEmail(user.email)
          if (patient) {
            setPatientId(patient.id)
            setFormData({
              name: patient.name || user.name || "",
              email: patient.email || user.email || "",
              phone: patient.phone || user.phone || "",
              dob: patient.dob || "1990-05-15",
              gender: patient.gender || "Male",
              address: patient.address || "123 Main St, City, State 12345",
            })
          }
        } catch (error) {
          console.error("Error loading patient data:", error)
        }
      }
    }
    loadPatientData()
  }, [user?.email])

  const navItems = [
    { label: "Dashboard", icon: <LayoutDashboard className="w-5 h-5" />, href: "/patient/dashboard" },
    { label: "My Appointments", icon: <Calendar className="w-5 h-5" />, href: "/patient/appointments" },
    { label: "My Profile", icon: <User className="w-5 h-5" />, href: "/patient/profile" },
    { label: "Payment History", icon: <CreditCard className="w-5 h-5" />, href: "/patient/payments" },
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSave = async () => {
    try {
      if (!patientId) {
        alert("Patient record not found. Please contact support.")
        return
      }
      
      // Update patient record
      const updated = await patientService.update(patientId, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        dob: formData.dob,
        gender: formData.gender,
        address: formData.address,
      })
      
      // Update local storage user data
      const updatedUser = { ...user, name: formData.name, email: formData.email, phone: formData.phone }
      localStorage.setItem("user", JSON.stringify(updatedUser))
      
      // Update context
      window.location.reload() // Reload to refresh auth context
      
      alert("✅ Profile updated successfully!")
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Failed to update profile: " + (error instanceof Error ? error.message : "Unknown error"))
    }
  }

  return (
    <MainLayout navItems={navItems} title="My Profile">
      <div className="max-w-2xl space-y-6">
        {/* Profile Header */}
        <Card className="border-2">
          <CardHeader className="bg-primary/5 border-b pb-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary">{user?.name?.charAt(0)}</span>
                </div>
                <div>
                  <CardTitle>{user?.name}</CardTitle>
                  <CardDescription>{user?.email}</CardDescription>
                </div>
              </div>
              <Button onClick={() => setIsEditing(!isEditing)} variant={isEditing ? "destructive" : "default"}>
                {isEditing ? (
                  <>
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="w-4 h-4 mr-2" />
                    Edit Profile
                  </>
                )}
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Profile Information */}
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your contact and health details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Full Name</label>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone</label>
                <Input
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Date of Birth</label>
                <Input
                  name="dob"
                  type="date"
                  value={formData.dob}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                  className="w-full px-3 py-2 border border-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Address</label>
              <Input
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                disabled={!isEditing}
                className="border-border"
              />
            </div>

            {isEditing && (
              <div className="flex gap-2 pt-4">
                <Button onClick={handleSave} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Treatment History Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Treatment History</CardTitle>
            <CardDescription>Your recent dental treatments</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                {
                  date: "2024-11-10",
                  treatment: "Cleaning",
                  doctor: "Dr. Sarah",
                  notes: "Regular cleaning and plaque removal",
                },
                { date: "2024-10-20", treatment: "Filling", doctor: "Dr. John", notes: "Cavity filling - Tooth #14" },
                { date: "2024-09-15", treatment: "Check-up", doctor: "Dr. Sarah", notes: "Annual check-up - All good" },
              ].map((record, i) => (
                <div key={i} className="p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                  <div className="flex items-center justify-between mb-1">
                    <p className="font-medium text-foreground">{record.treatment}</p>
                    <span className="text-sm text-muted-foreground">{record.date}</span>
                  </div>
                  <p className="text-sm text-muted-foreground">{record.doctor}</p>
                  <p className="text-xs text-muted-foreground mt-1">{record.notes}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  )
}
