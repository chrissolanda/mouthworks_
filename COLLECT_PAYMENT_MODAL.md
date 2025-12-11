# COLLECT PAYMENT MODAL - NEW WORKFLOW

## ✅ What Changed

**OLD FLOW:**
1. Dentist clicks "Complete" → Appointment completed → Payment auto-created → Alert shown

**NEW FLOW:**
1. Dentist clicks "Complete" → Appointment completed
2. **"COLLECT PAYMENT" modal appears** with:
   - Patient name
   - Service performed
   - Suggested amount (₱500-₱3000)
   - Payment method selector (Cash, Card, GCash, etc.)
   - Amount field (editable)
   - Notes field (optional)
   - Your share (50%) calculator
3. Dentist selects payment method and confirms amount
4. Clicks "Confirm Collection"
5. **Payment saved to database** with all details
6. **Success alert shows:**
   - Amount collected
   - Payment method
   - Your share (50%)
   - Payment ID
   - Confirmation: "✓ Recorded in database, ✓ Will appear in your Earnings, ✓ Visible to HR"

## 📍 Where It Works

- ✅ **Dentist Dashboard** - "Complete" button on pending appointments
- ✅ **Dentist Schedule** - "Complete" button on confirmed appointments

## 💵 Payment Details

**Payment Methods Available:**
- Cash
- Credit Card
- Debit Card
- Bank Transfer
- GCash

**Default Service Prices:**
- Cleaning: ₱500
- Filling: ₱800
- Root Canal: ₱1500
- Extraction: ₱600
- Whitening: ₱2000
- Checkup: ₱300
- Braces: ₱3000
- Crown: ₱2500

**Dentist can edit the amount if needed!**

## 🎯 Expected Results

After collecting payment:
1. **✅ Payment saved in database** with:
   - Patient ID
   - Dentist ID
   - Appointment ID
   - Amount
   - Method
   - Status = "paid"
   - Description
   - Date

2. **✅ Appears in Dentist Earnings** within 5 seconds (auto-refresh)
   - Total Earned: +₱amount
   - Net Balance (50%): +₱(amount * 0.5)
   - Total Transactions: +1

3. **✅ Appears in HR Payments** within 5 seconds (auto-refresh)
   - Shows dentist name
   - Shows patient name
   - Shows amount
   - Shows payment method
   - Shows status = "paid"

## 🚨 IMPORTANT

**YOU MUST RUN THIS SQL IN SUPABASE FIRST:**

```sql
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS dentist_id UUID REFERENCES dentists(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_payments_dentist_id ON payments(dentist_id);
```

**Without the dentist_id column, payment creation will fail!**

## 🧪 How to Test

1. **Run the SQL query above in Supabase**
2. **Refresh your app** (localhost:3000)
3. **Sign in as dentist** (john.doe@example.com / Dentist123!)
4. **Go to Dashboard**
5. **Click "Complete"** on any appointment
6. **Modal should appear** asking to collect payment
7. **Select payment method** (e.g., Cash)
8. **Confirm amount** (pre-filled from service price)
9. **Click "Confirm Collection"**
10. **See success alert** with all details
11. **Go to Earnings page** → Should show the payment!
12. **Sign in as HR** → Go to Payments → Should see the payment with dentist name!

## 🎉 Benefits

- ✅ More realistic workflow (dentist actually collects payment)
- ✅ Can choose payment method (Cash, Card, GCash, etc.)
- ✅ Can adjust amount if needed
- ✅ Can add notes (e.g., "Paid in full", "Change given: ₱50")
- ✅ See your 50% share immediately
- ✅ Proper database recording
- ✅ Shows in all 3 places (Dentist Earnings, HR Payments, Patient Payments)
