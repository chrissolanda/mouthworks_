"use client"

import type React from "react"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import MainLayout from "@/components/layout/main-layout"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  LayoutDashboard,
  Users,
  Calendar,
  Bluetooth as Tooth,
  CreditCard,
  Package,
  BarChart3,
  Settings,
  Save,
  Bell,
  Lock,
  Palette,
  Globe,
  X,
} from "lucide-react"
import { authService } from "@/lib/auth-service"

export default function HRSettings() {
  const { user } = useAuth()
  const [settings, setSettings] = useState({
    clinicName: "Mouthworks Dental Clinic",
    clinicEmail: "info@mouthworks.com",
    clinicPhone: "+1 (555) 123-4567",
    clinicAddress: "123 Dental Street, City, State 12345",
    businessHours: "Mon-Fri: 9:00 AM - 5:00 PM",
    appointmentReminder: true,
    paymentReminder: true,
    lowStockAlert: true,
    emailNotifications: true,
    smsNotifications: false,
  })

  const [isSaving, setIsSaving] = useState(false)
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [showDangerZoneModal, setShowDangerZoneModal] = useState(false)
  const [showRolesModal, setShowRolesModal] = useState(false)
  const [showAuditLogsModal, setShowAuditLogsModal] = useState(false)
  const [passwordData, setPasswordData] = useState({
    email: user?.email || "",
    newPassword: "",
    confirmPassword: "",
  })
  const [passwordError, setPasswordError] = useState("")
  const [passwordSuccess, setPasswordSuccess] = useState("")
  const [isUpdatingPassword, setIsUpdatingPassword] = useState(false)

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setSettings((prev) => ({ ...prev, [name]: value }))
  }

  const handleToggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key as keyof typeof prev] }))
  }

  const handleSave = () => {
    setIsSaving(true)
    setTimeout(() => {
      setIsSaving(false)
      alert("Settings saved successfully!")
    }, 1000)
  }

  const handleChangePassword = async () => {
    setPasswordError("")
    setPasswordSuccess("")
    
    if (!passwordData.email) {
      setPasswordError("Email is required")
      return
    }
    
    if (!passwordData.newPassword) {
      setPasswordError("New password is required")
      return
    }
    
    if (passwordData.newPassword.length < 6) {
      setPasswordError("Password must be at least 6 characters")
      return
    }
    
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setPasswordError("Passwords do not match")
      return
    }
    
    setIsUpdatingPassword(true)
    try {
      await authService.updatePassword(passwordData.email, passwordData.newPassword)
      setPasswordSuccess("Password updated successfully!")
      setPasswordData({ email: user?.email || "", newPassword: "", confirmPassword: "" })
      setTimeout(() => {
        setShowPasswordModal(false)
        setPasswordSuccess("")
      }, 2000)
    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Failed to update password")
    } finally {
      setIsUpdatingPassword(false)
    }
  }

  return (
    <MainLayout navItems={navItems} title="System Settings">
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold text-foreground">Clinic Settings</h2>
          <p className="text-muted-foreground">Configure clinic information and system preferences</p>
        </div>

        {/* Clinic Information */}
        <Card>
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="flex items-center gap-2">
              <Globe className="w-5 h-5 text-primary" />
              Clinic Information
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Clinic Name</label>
                <Input
                  name="clinicName"
                  value={settings.clinicName}
                  onChange={handleInputChange}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Email</label>
                <Input
                  name="clinicEmail"
                  type="email"
                  value={settings.clinicEmail}
                  onChange={handleInputChange}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Phone</label>
                <Input
                  name="clinicPhone"
                  value={settings.clinicPhone}
                  onChange={handleInputChange}
                  className="border-border"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">Business Hours</label>
                <Input
                  name="businessHours"
                  value={settings.businessHours}
                  onChange={handleInputChange}
                  className="border-border"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Address</label>
              <Input
                name="clinicAddress"
                value={settings.clinicAddress}
                onChange={handleInputChange}
                className="border-border"
              />
            </div>
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card>
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="flex items-center gap-2">
              <Bell className="w-5 h-5 text-primary" />
              Notification Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            {[
              {
                key: "appointmentReminder",
                label: "Appointment Reminders",
                description: "Send reminders before appointments",
              },
              {
                key: "paymentReminder",
                label: "Payment Reminders",
                description: "Remind patients about outstanding payments",
              },
              { key: "lowStockAlert", label: "Low Stock Alerts", description: "Alert when inventory is running low" },
              { key: "emailNotifications", label: "Email Notifications", description: "Receive email notifications" },
              { key: "smsNotifications", label: "SMS Notifications", description: "Receive SMS notifications" },
            ].map((item) => (
              <div
                key={item.key}
                className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div>
                  <p className="font-medium text-foreground">{item.label}</p>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
                <button
                  onClick={() => handleToggle(item.key)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    settings[item.key as keyof typeof settings] ? "bg-primary" : "bg-muted"
                  }`}
                >
                  <div
                    className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                      settings[item.key as keyof typeof settings] ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Security */}
        <Card>
          <CardHeader className="bg-primary/5 border-b pb-4">
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5 text-primary" />
              Security & Access
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6 space-y-3">
            <Button 
              variant="outline" 
              className="w-full justify-start bg-transparent hover:bg-muted"
              onClick={() => setShowDangerZoneModal(true)}
            >
              <Lock className="w-4 h-4 mr-2" />
              Change Admin Password
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start bg-transparent hover:bg-muted"
              onClick={() => setShowRolesModal(true)}
            >
              <Users className="w-4 h-4 mr-2" />
              Manage User Roles & Permissions
            </Button>
            <Button 
              variant="outline" 
              className="w-full justify-start bg-transparent hover:bg-muted"
              onClick={() => setShowAuditLogsModal(true)}
            >
              <Palette className="w-4 h-4 mr-2" />
              View Audit Logs
            </Button>
          </CardContent>
        </Card>

        {/* Danger Zone Modal */}
        {showDangerZoneModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-md w-full">
              <CardHeader className="flex flex-row items-center justify-between bg-red-50 border-b border-red-200">
                <CardTitle className="text-red-700">⚠️ Danger Zone</CardTitle>
                <button onClick={() => setShowDangerZoneModal(false)} className="p-1 hover:bg-red-100 rounded-lg">
                  <X className="w-5 h-5 text-red-700" />
                </button>
              </CardHeader>
              <CardContent className="pt-6 space-y-4">
                <div className="p-4 bg-red-50 border-2 border-red-200 rounded-lg">
                  <p className="text-center text-red-700 font-semibold text-lg">
                    This feature has been disabled for security reasons.
                  </p>
                </div>
                <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg text-sm text-yellow-800">
                  <p className="font-medium mb-1">Security Notice:</p>
                  <p>Password changes are restricted to prevent unauthorized access. Please contact your system administrator for password reset requests.</p>
                </div>
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={() => setShowDangerZoneModal(false)}
                    className="flex-1 bg-transparent"
                  >
                    Close
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Manage User Roles Modal */}
        {showRolesModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-2xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Manage User Roles & Permissions</CardTitle>
                  <CardDescription>View and manage user access levels</CardDescription>
                </div>
                <button onClick={() => setShowRolesModal(false)} className="p-1 hover:bg-muted rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">HR Staff</p>
                        <p className="text-sm text-muted-foreground">Full access to all clinic operations</p>
                      </div>
                      <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                        HR
                      </span>
                    </div>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">Dentists</p>
                        <p className="text-sm text-muted-foreground">Access to appointments, treatments, and earnings</p>
                      </div>
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
                        Dentist
                      </span>
                    </div>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-semibold text-foreground">Patients</p>
                        <p className="text-sm text-muted-foreground">Access to appointments and payment history</p>
                      </div>
                      <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs font-semibold">
                        Patient
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> User role management is currently handled through the authentication system. 
                    To change a user's role, contact your system administrator or update the user's role in the database.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Audit Logs Modal */}
        {showAuditLogsModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="max-w-3xl w-full max-h-[80vh] overflow-y-auto">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Audit Logs</CardTitle>
                  <CardDescription>System activity and access logs</CardDescription>
                </div>
                <button onClick={() => setShowAuditLogsModal(false)} className="p-1 hover:bg-muted rounded-lg">
                  <X className="w-5 h-5" />
                </button>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">System Login</p>
                      <span className="text-xs text-muted-foreground">{new Date().toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">User: {user?.name || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">Action: User logged in successfully</p>
                  </div>
                  <div className="p-4 border border-border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="font-semibold text-foreground">Settings Updated</p>
                      <span className="text-xs text-muted-foreground">{new Date().toLocaleString()}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">User: {user?.name || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">Action: Clinic settings modified</p>
                  </div>
                </div>
                <div className="mt-4 p-3 bg-muted/50 rounded-lg">
                  <p className="text-sm text-muted-foreground">
                    <strong>Note:</strong> Full audit logging functionality requires database configuration. 
                    This is a preview of the audit log feature. Complete audit logs will track all system activities 
                    including user actions, data changes, and access attempts.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving}
            className="bg-primary hover:bg-primary/90 text-primary-foreground gap-2"
          >
            <Save className="w-4 h-4" />
            {isSaving ? "Saving..." : "Save Settings"}
          </Button>
        </div>
      </div>
    </MainLayout>
  )
}
