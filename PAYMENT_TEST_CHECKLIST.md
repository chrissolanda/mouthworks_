# COMPLETE PAYMENT SYSTEM TEST CHECKLIST

## ✅ Step 1: Add dentist_id Column (REQUIRED!)
Run this in Supabase SQL Editor:

```sql
ALTER TABLE payments 
ADD COLUMN IF NOT EXISTS dentist_id UUID REFERENCES dentists(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_payments_dentist_id ON payments(dentist_id);
```

## ✅ Step 2: Verify Column Was Added
Run this to check:

```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'payments' 
ORDER BY ordinal_position;
```

You should see `dentist_id` in the list!

## ✅ Step 3: Test Payment Creation

1. **Refresh your app** (localhost:3000)
2. **Sign in as dentist** (e.g., john.doe@example.com / Dentist123!)
3. **Go to Dashboard**
4. **Click "Complete"** on any appointment
5. **Watch browser console** for these logs:
   - `[v0] 💾 Creating payment via server API`
   - `[v0] ✅ Payment saved to database successfully`
6. **Should see alert**: "✅ Appointment completed! 💾 Payment recorded: ₱X"

## ✅ Step 4: Verify Payment in Database

Run in Supabase SQL Editor:

```sql
SELECT 
  id,
  patient_id,
  dentist_id,
  amount,
  status,
  description,
  date
FROM payments
ORDER BY created_at DESC
LIMIT 5;
```

The latest payment should show the `dentist_id`!

## ✅ Step 5: Check Earnings Page

1. **Go to "Earnings"** in dentist menu
2. **Click "🔄 Refresh" button**
3. **Check console logs**:
   - `[v0] Fetching earnings for dentist: <id>`
   - `[v0] Found X payments for dentist`
   - `[v0] Final earnings: { totalEarned: X, ... }`
4. **Cards should show**:
   - Total Earned: ₱X (not ₱0.00!)
   - Net Balance (50%): ₱Y
   - Total Transactions: count

## ✅ Step 6: Check HR Payments View

1. **Sign in as HR** (hr@mouthworks.com / Changeme!123)
2. **Go to HR → Payments**
3. **Click "🔄 Refresh" button**
4. **Should see the payment** with dentist name in the table

## 🚨 If Earnings Still Show ₱0.00:

Check these in browser console:
1. What is the dentist user ID? (Should match dentist_id in payments)
2. Are payments being fetched? (`Found X payments for dentist`)
3. What is the payment status? (Must be "paid" not "unpaid")

Run this query to debug:

```sql
-- Get dentist ID
SELECT id, name, email FROM dentists WHERE email = 'john.doe@example.com';

-- Check payments for this dentist (replace <dentist_id>)
SELECT * FROM payments WHERE dentist_id = '<dentist_id>';
```

## 🎯 Expected Result:

After completing an appointment:
- ✅ Payment created with correct amount (from service price)
- ✅ Payment has dentist_id field populated
- ✅ Payment status = "paid"
- ✅ Earnings page shows the amount
- ✅ HR sees the payment
- ✅ Net Balance = 50% of Total Earned
