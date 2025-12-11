# 🏥 MOUTHWORKS DENTAL CLINIC - Complete System Workflow

## 📋 Full End-to-End Patient Journey

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                   COMPLETE APPOINTMENT & PAYMENT FLOW                       │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Step-by-Step Complete Workflow

### **STEP 1: PATIENT CREATES BOOKING**

**Where:** Patient Portal → Appointments → Book Appointment

**What Happens:**
```
Patient fills form:
├── Select Date & Time
├── Select Treatment/Service (e.g., Root Canal, Cleaning)
├── Add Notes (optional)
└── Submit

System Creates:
├── Appointment Record
├── Status: "pending" (waiting for dentist assignment)
├── Linked to: Patient ID
├── Treatment: Selected service
├── Date: Selected appointment date
└── Stored in: appointments table
```

**Database Entry:**
```sql
INSERT INTO appointments (
  id,
  patient_id,           -- John Doe's ID
  status,               -- "pending"
  date,                 -- 2024-12-15
  time,                 -- 10:00 AM
  service,              -- "Root Canal"
  created_at
) VALUES (...)
```

**User View:**
- Patient sees: "Booking submitted. Waiting for dentist assignment."
- Patient email receives: Confirmation with appointment details

---

### **STEP 2: HR ASSIGNS DENTIST**

**Where:** HR Portal → Appointments → View Pending

**What Happens:**
```
HR Staff sees list of pending appointments
├── Appointment ID
├── Patient Name
├── Service Type
├── Requested Date
└── Action Button: "Assign Dentist"

HR clicks "Assign Dentist":
├── Modal opens with list of available dentists
├── HR selects dentist (e.g., Dr. Sarah Smith)
└── Clicks "Assign"

System Updates:
├── appointment.dentist_id = selected dentist ID
├── appointment.status = "assigned"
└── Dentist notified of new appointment
```

**Database Update:**
```sql
UPDATE appointments 
SET 
  dentist_id = 'abc123',           -- Dr. Sarah Smith's ID
  status = 'assigned'
WHERE id = 'appointment_id'
```

**Notifications:**
- HR sees: ✅ "Appointment assigned to Dr. Sarah Smith"
- Dentist receives: New appointment in their schedule
- Patient receives: "Dentist assigned: Dr. Sarah Smith"

---

### **STEP 3: DENTIST REVIEWS & APPROVES APPOINTMENT**

**Where:** Dentist Portal → My Schedule

**What Happens:**
```
Dentist views their schedule:
├── Sees new appointment from HR
├── Patient Name: John Doe
├── Service: Root Canal
├── Date/Time: 2024-12-15, 10:00 AM
└── Status: "assigned"

Dentist has 3 options:
┌─────────────────────────┬────────────────────────┐
│ 1. APPROVE              │ 2. REJECT              │
├─────────────────────────┼────────────────────────┤
│ ✅ Confirm availability │ ❌ Cannot do this date │
│ Ready for appointment   │ Specify reason         │
│ Status → "confirmed"    │ Status → "rejected"    │
└─────────────────────────┴────────────────────────┘

Dentist clicks "Approve":
├── Modal appears with options:
│   ├── Notes (optional)
│   └── Confirm Button
├── Dentist adds any notes
└── Clicks "Confirm"

System Updates:
├── appointment.status = "confirmed"
├── appointment.dentist_approved_at = now
└── Stored in database
```

**Database Update:**
```sql
UPDATE appointments 
SET 
  status = 'confirmed',
  notes = 'Ready to perform root canal',
  dentist_approved_at = NOW()
WHERE id = 'appointment_id'
```

**Notifications:**
- Dentist sees: ✅ "Appointment confirmed"
- Patient receives: "Dr. Sarah Smith confirmed your appointment"
- HR sees: Updated status in their list

---

### **STEP 4: PATIENT MARKS AS ATTENDED**

**Where:** Patient Portal → Appointments → My Appointments

**What Happens:**
```
On appointment date/time:
Appointment shows status: "confirmed"

After appointment is completed by dentist:
Patient receives appointment reminder

Patient marks attendance:
├── Sees appointment in list
├── Clicks "Mark as Attended" button
└── Confirms action

System Updates:
├── appointment.patient_attended = true
├── appointment.attended_at = now
└── Status remains: "confirmed" (waiting for dentist to complete)
```

**Database Update:**
```sql
UPDATE appointments 
SET 
  patient_attended = true,
  attended_at = NOW()
WHERE id = 'appointment_id'
```

**Timeline:**
```
10:00 AM → Appointment starts
11:00 AM → Patient marks as attended
         → Dentist now can mark as complete
```

---

### **STEP 5: DENTIST MARKS APPOINTMENT AS COMPLETE**

**Where:** Dentist Portal → My Schedule

**What Happens:**
```
Dentist sees appointment with status: "confirmed"
Patient has marked: "attended"

Dentist clicks: "Complete Appointment"

System Automatically:
├── 1. Fetches Service Price
│   └── Looks up "Root Canal" price = ₱1500
│
├── 2. Creates Payment Record
│   ├── patient_id: John Doe
│   ├── dentist_id: Dr. Sarah Smith
│   ├── amount: ₱1500 (service price)
│   ├── status: "paid"
│   └── description: "Payment for Root Canal"
│
├── 3. Updates Appointment Status
│   └── status: "completed"
│
└── 4. Updates Dentist Earnings
    └── totalEarned += ₱1500
```

**Database Creates Payment:**
```sql
INSERT INTO payments (
  id,
  patient_id,           -- John Doe's ID
  dentist_id,           -- Dr. Sarah Smith's ID
  appointment_id,       -- The appointment ID
  amount,               -- 1500 (from treatments table)
  method,               -- "cash"
  status,               -- "paid"
  description,          -- "Payment for Root Canal"
  date
) VALUES (...)

UPDATE appointments 
SET status = 'completed'
WHERE id = 'appointment_id'
```

**What Dentist Sees:**
- ✅ "Appointment marked as complete"
- ✅ "Payment recorded: ₱1500"
- ✅ Payment appears in Earnings immediately

---

### **STEP 6: DENTIST EARNINGS UPDATED WITH 50% NET BALANCE**

**Where:** Dentist Portal → Earnings

**What Happens:**
```
Dentist views Earnings Dashboard:

┌─────────────────────────────────┐
│     EARNINGS SUMMARY            │
├─────────────────────────────────┤
│ Total Earned: ₱1500             │
│ (Full service price)            │
├─────────────────────────────────┤
│ NET BALANCE: ₱750 (50%)          │ ← Dentist's share
│ (Dentist gets 50%, clinic 50%)  │
├─────────────────────────────────┤
│ Pending: ₱0                      │
│ Transactions: 1                  │
└─────────────────────────────────┘

Transaction History Shows:
┌──────────────────────────────────────────┐
│ Date       │ Patient    │ Service │ Amount
├──────────────────────────────────────────┤
│ 2024-12-15 │ John Doe   │ Root    │ ₱1500
│            │            │ Canal   │
├──────────────────────────────────────────┤
│            │            │ NET     │ ₱750
│            │            │ BALANCE │ (50%)
└──────────────────────────────────────────┘
```

**Calculation:**
```
Service Price: ₱1500
├── 50% → Dentist (Net Balance): ₱750
└── 50% → Clinic: ₱750

Formula: NET_BALANCE = totalEarned × 0.5
         750 = 1500 × 0.5
```

**Real-Time Updates:**
- Earnings card updates immediately
- Transaction appears in history
- No manual input needed

---

### **STEP 7: HR SEES PAYMENT DETAILS**

**Where:** HR Portal → Payments

**What Happens:**
```
HR Payment Records table shows:

┌───────────────────────────────────────────────────────┐
│ Payment Records (All payments in system)             │
├───────────────────────────────────────────────────────┤
│ Date      │ Patient   │ DENTIST         │ Amount    │
├───────────────────────────────────────────────────────┤
│ 2024-12-15│ John Doe  │ Dr. Sarah Smith │ ₱1500     │
│           │           │ (root canal)    │           │
├───────────────────────────────────────────────────────┤
│ Service:  │ Root Canal Treatment                     │
│ Status:   │ ✅ PAID                                  │
│ Method:   │ Cash                                     │
└───────────────────────────────────────────────────────┘

HR Can:
├── View all payments with dentist names
├── See which dentist did which service
├── Edit payment status (Paid/Partial/Unpaid)
├── Search by patient or dentist
├── Filter by payment status
└── Delete payment if needed
```

**Complete Payment Info:**
```
├── Who paid: John Doe (Patient)
├── Who provided service: Dr. Sarah Smith (Dentist)
├── Service: Root Canal Treatment
├── Full Amount: ₱1500
├── Status: Paid
├── Date: 2024-12-15
└── Dentist's Share: ₱750 (automatically calculated)
```

---

### **STEP 8: PATIENT SEES PAYMENT CONFIRMATION**

**Where:** Patient Portal → Payments

**What Happens:**
```
Patient views their payment history:

┌──────────────────────────────────────┐
│ My Payments                          │
├──────────────────────────────────────┤
│ Date      │ Service    │ Amount      │
├──────────────────────────────────────┤
│ 2024-12-15│ Root Canal │ ₱1500 ✅    │
│           │ Treatment  │ PAID        │
├──────────────────────────────────────┤
│ Dentist:  │ Dr. Sarah Smith          │
│ Method:   │ Cash                     │
│ Status:   │ Payment Completed        │
└──────────────────────────────────────┘

Patient Can:
├── See all their payments
├── View service details
├── See which dentist treated them
├── Check payment status
└── Download receipt (optional)
```

**Payment Status:**
- ✅ PAID: Payment confirmed and recorded
- ⏳ PARTIAL: Some amount paid, balance pending
- ❌ UNPAID: Payment not yet received

---

## 📊 Complete Data Flow Diagram

```
PATIENT SIDE                    SYSTEM                          STAFF SIDE
═════════════════════════════════════════════════════════════════════════════

Step 1: Patient Books
│
├─→ Create Booking          ──→ appointments table
│   - Patient ID            Status: "pending"
│   - Service
│   - Date/Time
│
Step 2: HR Assigns Dentist
│                           HR Dashboard
├──────────────────────────→ Sees pending bookings
│                           │
│                           ├─→ SELECT dentist
│                           │
│                           └─→ UPDATE appointment
│                               dentist_id = selected
│                               status = "assigned"
│
Step 3: Dentist Approves
│                           Dentist Dashboard
├──────────────────────────→ My Schedule
│                           │
│                           ├─→ CLICK "Approve"
│                           │
│                           └─→ UPDATE appointment
│                               status = "confirmed"
│
Step 4: Patient Attends
│
├─→ CLICK "Mark Attended"  ──→ UPDATE appointment
│                               patient_attended = true
│
Step 5: Dentist Completes
│                           Dentist Dashboard
├──────────────────────────→ My Schedule
│                           │
│                           ├─→ CLICK "Complete"
│                           │
│                           ├─→ FETCH service price
│                           │   from treatments table
│                           │
│                           ├─→ CREATE payment record
│                           │   amount = service price
│                           │
│                           └─→ UPDATE appointment
│                               status = "completed"
│
Step 6: Earnings Calculated
│                           SYSTEM CALCULATES:
│                           Total Earned = amount
│                           Net Balance = amount × 0.5
│
│                           Dentist Dashboard
├──────────────────────────→ Earnings page
│                           Shows: ₱750 NET BALANCE
│
Step 7: HR Sees Payment
│                           HR Dashboard
├──────────────────────────→ Payments page
│                           Shows dentist name & amount
│
Step 8: Patient Sees Payment
│
├─→ My Payments page       ──→ Shows: ✅ PAID
    Confirms payment           Dentist: Dr. Sarah Smith
                               Service: Root Canal
                               Amount: ₱1500
```

---

## 💾 Database Tables Involved

### 1. **appointments** (Core workflow)
```sql
appointments:
├── id (primary key)
├── patient_id (who booked)
├── dentist_id (assigned dentist)
├── service (treatment name)
├── date & time
├── status: "pending" → "assigned" → "confirmed" → "completed"
├── patient_attended (true/false)
└── notes
```

### 2. **payments** (Payment tracking)
```sql
payments:
├── id (primary key)
├── patient_id (who paid)
├── dentist_id (who provided service)
├── appointment_id (which appointment)
├── amount (service price from treatments)
├── status: "paid" / "partial" / "unpaid"
├── method: "cash" / "card" / etc
├── description (service name)
└── date
```

### 3. **treatments** (Service catalog)
```sql
treatments:
├── id
├── name (e.g., "Root Canal")
├── category
├── price (e.g., 1500)
└── description
```

### 4. **patients** (Patient records)
```sql
patients:
├── id
├── name
├── email
├── phone
└── other details
```

### 5. **dentists** (Dentist records)
```sql
dentists:
├── id
├── name
├── email
├── specialization
└── phone
```

---

## 🔄 Status Flow Visualization

```
APPOINTMENT STATUSES:
═══════════════════════════════════════════════════════════

Step 1        Step 2          Step 3          Step 5
│             │               │               │
v             v               v               v
pending → assigned → confirmed → completed
          (HR assigns)  (Dentist)  (Dentist)
                        approves   completes

Step 4: Patient marks "attended" (doesn't change status)
        Just flags: patient_attended = true
```

---

## 💰 Payment & Earnings Flow

```
SERVICE PRICING:
══════════════════════════════════════════════════════

Service: Root Canal
Price: ₱1500 (from treatments table)
        │
        ├─→ Recorded in: payments.amount
        │
        └─→ Split:
            ├── 50% = ₱750 → Dentist (Net Balance)
            └── 50% = ₱750 → Clinic

DENTIST EARNINGS CALCULATION:
══════════════════════════════════════════════════════

Total Earned = Sum of all amounts for dentist
            = ₱1500 + ₱1500 + ₱900 = ₱3900

Net Balance = Total Earned × 0.5
            = ₱3900 × 0.5
            = ₱1950 (Dentist's share)

Clinic Share = Total Earned × 0.5
             = ₱3900 × 0.5
             = ₱1950 (Clinic's share)
```

---

## 👥 Role-Based Views

### **PATIENT VIEW**
```
Patient Portal:
├── Dashboard
│   └── My upcoming appointments
├── Book Appointment
│   ├── Select service
│   ├── Choose date/time
│   └── Wait for assignment
├── My Appointments
│   ├── View status
│   ├── Mark as attended
│   └── See dentist assigned
└── Payments
    ├── View payment records
    ├── See amount paid
    ├── Confirm status (Paid/Unpaid)
    └── See which dentist
```

### **DENTIST VIEW**
```
Dentist Portal:
├── Dashboard
│   └── Quick stats
├── My Schedule
│   ├── View appointments assigned to me
│   ├── Approve/Reject
│   ├── Mark as Complete
│   └── Automatic payment creation
├── Treatments
│   └── Record treatment details
└── Earnings
    ├── Total Earned (full amount)
    ├── Net Balance (50%)
    ├── Pending Payments
    └── Transaction History
```

### **HR VIEW**
```
HR Portal:
├── Dashboard
│   └── System statistics
├── Appointments
│   ├── View all appointments
│   ├── See pending ones
│   └── Assign dentists
├── Patients
│   ├── Manage patient records
│   ├── View bookings
│   └── Add/edit patients
├── Payments
│   ├── See all payments
│   ├── View dentist responsible
│   ├── Edit payment status
│   ├── Delete if needed
│   └── Filter/search
└── Inventory
    └── Manage stock
```

---

## ✅ Complete Workflow Checklist

```
PATIENT JOURNEY:
═══════════════════════════════════════════════════════

[✓] Step 1: Patient books appointment
    └─ Creates pending appointment

[✓] Step 2: HR assigns dentist
    └─ Updates: dentist_id, status="assigned"

[✓] Step 3: Dentist approves
    └─ Updates: status="confirmed"

[✓] Step 4: Patient marks attended
    └─ Updates: patient_attended=true

[✓] Step 5: Dentist completes
    └─ Auto-creates payment with service price
    └─ Updates: status="completed"

[✓] Step 6: Earnings calculated
    └─ Dentist sees: Total + 50% Net Balance
    └─ Automatic calculation (no manual entry)

[✓] Step 7: HR sees payment
    └─ Shows: Patient, Dentist, Amount, Status

[✓] Step 8: Patient sees payment
    └─ Shows: Amount paid, Status, Dentist name
```

---

## 🎯 Key Features

### Automatic Payment Creation
```
✓ Triggered: When dentist completes appointment
✓ Amount: Fetched from treatments table
✓ Status: Auto-set to "paid"
✓ Dentist: Linked via dentist_id
✓ No manual entry needed
```

### 50% Net Balance Calculation
```
✓ Automatic: No manual calculation
✓ Real-time: Updates immediately
✓ Accurate: Uses actual service price
✓ Visible: Both dentist and HR can see
✓ Tracking: Accessible in earnings page
```

### Real-Time Synchronization
```
✓ All changes sync across system
✓ Patient sees updates in appointments
✓ Dentist sees updates in earnings
✓ HR sees updates in payments
✓ No page refresh needed
```

---

## 🔐 Security & Data Integrity

```
Row Level Security (RLS):
├── Patients can only see their own records
├── Dentists can only see their own appointments
├── HR can see all records (staff role)
├── Service role handles payments securely

Data Validation:
├── Prices verified from treatments table
├── Amounts cannot be negative
├── Status changes follow valid flow
└── Dentist must be assigned before approval
```

---

## 📱 Real-Time Example

```
TIMELINE:
═════════════════════════════════════════════════════════

Monday 10:00 AM:
  Patient John Doe books Root Canal (Service: ₱1500)
  Status: "pending"
  
Monday 2:00 PM:
  HR Staff assigns Dr. Sarah Smith
  Status: "assigned"
  Email: Dr. Sarah gets notification
  
Tuesday 9:00 AM:
  Dr. Sarah approves appointment
  Status: "confirmed"
  Email: John Doe gets confirmation
  
Wednesday 10:00 AM:
  Appointment happens
  John Doe marks "attended"
  Dr. Sarah completes appointment
  
AUTOMATIC:
  ✓ Payment created: ₱1500
  ✓ Dentist earnings: +₱1500
  ✓ Net balance: +₱750 (50%)
  ✓ Status: "completed"
  
Wednesday 10:30 AM:
  Dr. Sarah checks Earnings:
    - Total Earned: ₱1500
    - Net Balance: ₱750 ✅
    - Transaction: "Root Canal - John Doe - ₱1500"
    
  HR checks Payments:
    - Patient: John Doe
    - Dentist: Dr. Sarah Smith
    - Amount: ₱1500
    - Status: PAID
    
  John Doe checks Payments:
    - Service: Root Canal
    - Amount: ₱1500 ✅ PAID
    - Dentist: Dr. Sarah Smith
```

---

## 🚀 System Ready State

```
✅ Patient booking system: WORKING
✅ HR appointment management: WORKING
✅ Dentist scheduling: WORKING
✅ Automatic payment creation: WORKING
✅ 50% net balance calculation: WORKING
✅ Real-time synchronization: WORKING
✅ Multi-role access control: WORKING
✅ Payment tracking: WORKING
✅ Earnings dashboard: WORKING
✅ Data persistence (Supabase): WORKING
```

---

## 📞 Support & Troubleshooting

If payment doesn't appear after completing appointment:
1. Check: Dentist completed appointment (status = "completed")
2. Check: Service has price in treatments table
3. Check: Payment might take 1-2 seconds to appear
4. Check: Refresh the Earnings page

If 50% net balance shows wrong:
1. Formula is: `Total Earned × 0.5`
2. Only counts completed appointments
3. Uses actual payment amounts (not estimated)

---

## 🎓 Summary

**This system is a complete dental clinic management solution where:**

1. ✅ **Patients** book appointments with chosen dentists and treatments
2. ✅ **HR** reviews bookings and assigns available dentists
3. ✅ **Dentists** approve/reject based on availability
4. ✅ **Patients** confirm attendance at scheduled time
5. ✅ **Dentists** complete appointments and get automatic payment
6. ✅ **System** auto-calculates 50% dentist share as Net Balance
7. ✅ **HR** tracks all payments with dentist info clearly shown
8. ✅ **Patients** see confirmation that they've paid

**Everything syncs in real-time across all portals!** 🎉

