// Utility to generate and download payment receipts

export interface ReceiptData {
  receiptNumber: string
  date: string
  patientName: string
  patientEmail?: string
  dentistName: string
  service: string
  amount: number
  method: string
  notes?: string
}

export const generateReceiptHTML = (data: ReceiptData): string => {
  const dentistShare = (data.amount * 0.5).toFixed(2)
  const clinicShare = (data.amount * 0.5).toFixed(2)

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - ${data.receiptNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { 
      font-family: 'Arial', sans-serif; 
      padding: 40px; 
      background: #f5f5f5;
    }
    .receipt {
      max-width: 800px;
      margin: 0 auto;
      background: white;
      padding: 60px;
      border-radius: 10px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.1);
    }
    .header {
      text-align: center;
      margin-bottom: 40px;
      padding-bottom: 30px;
      border-bottom: 3px solid #2563eb;
    }
    .header h1 {
      color: #2563eb;
      font-size: 36px;
      margin-bottom: 10px;
    }
    .header p {
      color: #666;
      font-size: 16px;
    }
    .receipt-info {
      display: flex;
      justify-content: space-between;
      margin-bottom: 40px;
      padding: 20px;
      background: #f8f9fa;
      border-radius: 8px;
    }
    .info-block {
      flex: 1;
    }
    .info-block h3 {
      color: #2563eb;
      font-size: 14px;
      text-transform: uppercase;
      margin-bottom: 10px;
      letter-spacing: 1px;
    }
    .info-block p {
      color: #333;
      font-size: 16px;
      line-height: 1.6;
    }
    .details-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
    }
    .details-table th {
      background: #2563eb;
      color: white;
      padding: 15px;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      font-size: 14px;
    }
    .details-table td {
      padding: 15px;
      border-bottom: 1px solid #e0e0e0;
      color: #333;
      font-size: 16px;
    }
    .details-table tr:last-child td {
      border-bottom: none;
    }
    .amount-section {
      background: #f8f9fa;
      padding: 30px;
      border-radius: 8px;
      margin-bottom: 30px;
    }
    .amount-row {
      display: flex;
      justify-content: space-between;
      margin-bottom: 15px;
      padding: 10px 0;
    }
    .amount-row.total {
      border-top: 3px solid #2563eb;
      padding-top: 20px;
      margin-top: 20px;
    }
    .amount-row span:first-child {
      font-size: 16px;
      color: #666;
    }
    .amount-row span:last-child {
      font-size: 18px;
      font-weight: 700;
      color: #333;
    }
    .amount-row.total span {
      font-size: 24px;
      font-weight: 900;
      color: #2563eb;
    }
    .footer {
      text-align: center;
      padding-top: 30px;
      border-top: 2px solid #e0e0e0;
      color: #666;
      font-size: 14px;
    }
    .footer p {
      margin-bottom: 5px;
    }
    .stamp {
      margin-top: 30px;
      padding: 15px;
      background: #fff3cd;
      border: 2px dashed #ffc107;
      border-radius: 5px;
      text-align: center;
      color: #856404;
      font-weight: 600;
    }
    @media print {
      body { background: white; padding: 0; }
      .receipt { box-shadow: none; }
    }
  </style>
</head>
<body>
  <div class="receipt">
    <div class="header">
      <h1>🦷 MOUTHWORKS</h1>
      <p>Dental Clinic Management System</p>
      <p style="font-size: 12px; margin-top: 10px;">Payment Receipt</p>
    </div>

    <div class="receipt-info">
      <div class="info-block">
        <h3>Receipt Number</h3>
        <p style="font-weight: 700; font-size: 20px; color: #2563eb;">${data.receiptNumber}</p>
      </div>
      <div class="info-block" style="text-align: right;">
        <h3>Date</h3>
        <p style="font-weight: 600;">${data.date}</p>
      </div>
    </div>

    <table class="details-table">
      <thead>
        <tr>
          <th>Description</th>
          <th>Details</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong>Patient Name</strong></td>
          <td>${data.patientName}</td>
        </tr>
        ${data.patientEmail ? `
        <tr>
          <td><strong>Patient Email</strong></td>
          <td>${data.patientEmail}</td>
        </tr>
        ` : ''}
        <tr>
          <td><strong>Dentist</strong></td>
          <td>Dr. ${data.dentistName}</td>
        </tr>
        <tr>
          <td><strong>Service / Treatment</strong></td>
          <td>${data.service}</td>
        </tr>
        <tr>
          <td><strong>Payment Method</strong></td>
          <td>${data.method}</td>
        </tr>
        ${data.notes ? `
        <tr>
          <td><strong>Notes</strong></td>
          <td>${data.notes}</td>
        </tr>
        ` : ''}
      </tbody>
    </table>

    <div class="amount-section">
      <div class="amount-row">
        <span>Service Amount:</span>
        <span>₱${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="amount-row">
        <span>Dentist Share (50%):</span>
        <span>₱${Number(dentistShare).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="amount-row">
        <span>Clinic Share (50%):</span>
        <span>₱${Number(clinicShare).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
      <div class="amount-row total">
        <span>TOTAL PAID:</span>
        <span>₱${data.amount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
      </div>
    </div>

    <div class="stamp">
      ✓ PAYMENT RECEIVED - ${data.date}
    </div>

    <div class="footer">
      <p><strong>Thank you for your payment!</strong></p>
      <p>This is an official receipt from Mouthworks Dental Clinic</p>
      <p style="margin-top: 15px; font-size: 12px; color: #999;">
        Generated electronically • No signature required
      </p>
    </div>
  </div>
</body>
</html>
  `
}

export const downloadReceipt = (data: ReceiptData) => {
  const html = generateReceiptHTML(data)
  const blob = new Blob([html], { type: 'text/html' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Receipt_${data.receiptNumber}_${data.patientName.replace(/\s+/g, '_')}.html`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

export const printReceipt = (data: ReceiptData) => {
  const html = generateReceiptHTML(data)
  const printWindow = window.open('', '_blank')
  if (printWindow) {
    printWindow.document.write(html)
    printWindow.document.close()
    printWindow.onload = () => {
      printWindow.print()
    }
  }
}
