module.exports=[1199,71931,a=>{"use strict";var b=a.i(70106);let c=(0,b.default)("Receipt",[["path",{d:"M4 2v20l2-1 2 1 2-1 2 1 2-1 2 1 2-1 2 1V2l-2 1-2-1-2 1-2-1-2 1-2-1-2 1Z",key:"q3az6g"}],["path",{d:"M16 8h-6a2 2 0 1 0 0 4h4a2 2 0 1 1 0 4H8",key:"1h4pet"}],["path",{d:"M12 17.5v-11",key:"1jc1ny"}]]);a.s(["Receipt",()=>c],1199);let d=(0,b.default)("Printer",[["path",{d:"M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2",key:"143wyd"}],["path",{d:"M6 9V3a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v6",key:"1itne7"}],["rect",{x:"6",y:"14",width:"12",height:"8",rx:"1",key:"1ue0tg"}]]);a.s(["Printer",()=>d],71931)},40018,a=>{"use strict";let b=a=>{let b=(.5*a.amount).toFixed(2),c=(.5*a.amount).toFixed(2);return`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - ${a.receiptNumber}</title>
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
        <p style="font-weight: 700; font-size: 20px; color: #2563eb;">${a.receiptNumber}</p>
      </div>
      <div class="info-block" style="text-align: right;">
        <h3>Date</h3>
        <p style="font-weight: 600;">${a.date}</p>
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
          <td>${a.patientName}</td>
        </tr>
        ${a.patientEmail?`
        <tr>
          <td><strong>Patient Email</strong></td>
          <td>${a.patientEmail}</td>
        </tr>
        `:""}
        <tr>
          <td><strong>Dentist</strong></td>
          <td>Dr. ${a.dentistName}</td>
        </tr>
        <tr>
          <td><strong>Service / Treatment</strong></td>
          <td>${a.service}</td>
        </tr>
        <tr>
          <td><strong>Payment Method</strong></td>
          <td>${a.method}</td>
        </tr>
        ${a.notes?`
        <tr>
          <td><strong>Notes</strong></td>
          <td>${a.notes}</td>
        </tr>
        `:""}
      </tbody>
    </table>

    <div class="amount-section">
      <div class="amount-row">
        <span>Service Amount:</span>
        <span>₱${a.amount.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
      </div>
      <div class="amount-row">
        <span>Dentist Share (50%):</span>
        <span>₱${Number(b).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
      </div>
      <div class="amount-row">
        <span>Clinic Share (50%):</span>
        <span>₱${Number(c).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
      </div>
      <div class="amount-row total">
        <span>TOTAL PAID:</span>
        <span>₱${a.amount.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
      </div>
    </div>

    <div class="stamp">
      ✓ PAYMENT RECEIVED - ${a.date}
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
  `};a.s(["downloadReceipt",0,a=>{let c=new Blob([b(a)],{type:"text/html"}),d=URL.createObjectURL(c),e=document.createElement("a");e.href=d,e.download=`Receipt_${a.receiptNumber}_${a.patientName.replace(/\s+/g,"_")}.html`,document.body.appendChild(e),e.click(),document.body.removeChild(e),URL.revokeObjectURL(d)},"printReceipt",0,a=>{let c=b(a),d=window.open("","_blank");d&&(d.document.write(c),d.document.close(),d.onload=()=>{d.print()})}])},56459,a=>{"use strict";var b=a.i(87924),c=a.i(72131),d=a.i(40695),e=a.i(5522),f=a.i(33508),g=a.i(46842),h=a.i(41675),i=a.i(35126),j=a.i(83497),k=a.i(1199),l=a.i(84505),m=a.i(71931),n=a.i(97895),o=a.i(40018);function p({appointment:a,onClose:p,onRecordPayment:q}){let[r,s]=(0,c.useState)({amount:String(a.amount||0),method:"Cash",notes:`${a.service||"Treatment"} - ${a.date}`}),[t,u]=(0,c.useState)(null),[v,w]=(0,c.useState)(!1),x=a=>{let{name:b,value:c}=a.target;s(a=>({...a,[b]:c}))},y=async b=>{if(b.preventDefault(),r.amount&&r.notes)try{let b=await q({method:r.method,amount:Number.parseFloat(r.amount),notes:r.notes}),c={receiptNumber:"string"==typeof b?b:`RCP-${Date.now()}`,date:new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),patientName:a.patients?.name||"Unknown Patient",patientEmail:a.patients?.email,dentistName:a.dentists?.name||"Not Assigned",service:a.service||a.treatment||"Treatment",amount:Number.parseFloat(r.amount),method:r.method,notes:r.notes};u(c),w(!0)}catch(a){console.error("Error recording payment:",a)}};return v&&t?(0,b.jsx)("div",{className:"fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4",children:(0,b.jsx)("div",{className:"bg-card rounded-xl shadow-2xl max-w-md w-full",children:(0,b.jsxs)("div",{className:"p-6 text-center space-y-6",children:[(0,b.jsx)("div",{className:"w-16 h-16 bg-green-100 rounded-full mx-auto flex items-center justify-center",children:(0,b.jsx)(k.Receipt,{className:"w-8 h-8 text-green-600"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("h2",{className:"text-2xl font-bold text-foreground mb-2",children:"Payment Recorded!"}),(0,b.jsxs)("p",{className:"text-muted-foreground",children:["Receipt #",t.receiptNumber," has been generated"]})]}),(0,b.jsxs)("div",{className:"bg-muted/50 rounded-lg p-4 text-left",children:[(0,b.jsxs)("div",{className:"flex justify-between mb-2",children:[(0,b.jsx)("span",{className:"text-sm text-muted-foreground",children:"Amount:"}),(0,b.jsx)("span",{className:"font-bold",children:(0,n.formatCurrency)(t.amount)})]}),(0,b.jsxs)("div",{className:"flex justify-between",children:[(0,b.jsx)("span",{className:"text-sm text-muted-foreground",children:"Method:"}),(0,b.jsx)("span",{className:"font-medium",children:t.method})]})]}),(0,b.jsxs)("div",{className:"flex flex-col gap-2",children:[(0,b.jsxs)(d.Button,{onClick:()=>(0,o.downloadReceipt)(t),className:"w-full bg-primary hover:bg-primary/90 text-primary-foreground",children:[(0,b.jsx)(l.Download,{className:"w-4 h-4 mr-2"}),"Download Receipt"]}),(0,b.jsxs)(d.Button,{onClick:()=>(0,o.printReceipt)(t),variant:"outline",className:"w-full",children:[(0,b.jsx)(m.Printer,{className:"w-4 h-4 mr-2"}),"Print Receipt"]}),(0,b.jsx)(d.Button,{onClick:p,variant:"outline",className:"w-full mt-2",children:"Close"})]})]})})}):(0,b.jsx)("div",{className:"fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4",children:(0,b.jsxs)("div",{className:"bg-card rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card z-10",children:[(0,b.jsx)("h2",{className:"text-2xl font-bold text-foreground",children:"Complete Appointment & Record Payment"}),(0,b.jsx)("button",{onClick:p,className:"p-2 hover:bg-muted rounded-lg transition-colors",children:(0,b.jsx)(f.X,{className:"w-5 h-5"})})]}),(0,b.jsxs)("div",{className:"p-6 space-y-6",children:[(0,b.jsxs)("div",{className:"bg-muted/50 rounded-lg p-6 space-y-4",children:[(0,b.jsx)("h3",{className:"text-lg font-bold text-foreground mb-4",children:"Appointment Details"}),(0,b.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-2 gap-4",children:[(0,b.jsxs)("div",{className:"flex items-start gap-3",children:[(0,b.jsx)("div",{className:"p-2 bg-primary/10 rounded-lg",children:(0,b.jsx)(g.User,{className:"w-5 h-5 text-primary"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Patient"}),(0,b.jsx)("p",{className:"text-base font-bold text-foreground",children:a.patients?.name||"Unknown"}),a.patients?.email&&(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:a.patients.email})]})]}),(0,b.jsxs)("div",{className:"flex items-start gap-3",children:[(0,b.jsx)("div",{className:"p-2 bg-primary/10 rounded-lg",children:(0,b.jsx)(i.Stethoscope,{className:"w-5 h-5 text-primary"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Dentist"}),(0,b.jsx)("p",{className:"text-base font-bold text-foreground",children:a.dentists?.name||"Not Assigned"})]})]}),(0,b.jsxs)("div",{className:"flex items-start gap-3",children:[(0,b.jsx)("div",{className:"p-2 bg-primary/10 rounded-lg",children:(0,b.jsx)(h.Calendar,{className:"w-5 h-5 text-primary"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Date & Time"}),(0,b.jsx)("p",{className:"text-base font-bold text-foreground",children:a.date}),(0,b.jsx)("p",{className:"text-sm text-muted-foreground",children:a.time})]})]}),(0,b.jsxs)("div",{className:"flex items-start gap-3",children:[(0,b.jsx)("div",{className:"p-2 bg-primary/10 rounded-lg",children:(0,b.jsx)(j.Package,{className:"w-5 h-5 text-primary"})}),(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm font-medium text-muted-foreground",children:"Service / Treatment"}),(0,b.jsx)("p",{className:"text-base font-bold text-foreground",children:a.service||a.treatment||"Not Specified"})]})]})]})]}),(0,b.jsxs)("form",{onSubmit:y,className:"space-y-4",children:[(0,b.jsx)("h3",{className:"text-lg font-bold text-foreground",children:"Payment Information"}),(0,b.jsx)("div",{className:"bg-blue-50 border-2 border-blue-200 rounded-lg p-4",children:(0,b.jsxs)("div",{className:"flex items-center justify-between",children:[(0,b.jsxs)("div",{children:[(0,b.jsx)("p",{className:"text-sm font-medium text-blue-700",children:"Appointment Amount"}),(0,b.jsx)("p",{className:"text-xs text-blue-600",children:"Expected payment for this service"})]}),(0,b.jsx)("p",{className:"text-2xl font-bold text-blue-900",children:(0,n.formatCurrency)(a.amount||0)})]})}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)("label",{className:"text-sm font-semibold text-foreground",children:"Amount Paid by Patient (₱) *"}),(0,b.jsx)(e.Input,{name:"amount",type:"number",step:"0.01",value:r.amount,onChange:x,placeholder:"0.00",className:"border-border h-11 text-lg font-bold",required:!0}),(0,b.jsx)("p",{className:"text-xs text-muted-foreground",children:"Enter the actual amount the patient paid"})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)("label",{className:"text-sm font-semibold text-foreground",children:"Payment Method *"}),(0,b.jsxs)("select",{name:"method",value:r.method,onChange:x,className:"w-full px-3 py-2.5 h-11 border border-border rounded-lg bg-background text-foreground",required:!0,children:[(0,b.jsx)("option",{children:"Cash"}),(0,b.jsx)("option",{children:"Bank Transfer"}),(0,b.jsx)("option",{children:"Credit Card"}),(0,b.jsx)("option",{children:"Debit Card"}),(0,b.jsx)("option",{children:"Check"}),(0,b.jsx)("option",{children:"Insurance"})]})]}),(0,b.jsxs)("div",{className:"space-y-2",children:[(0,b.jsx)("label",{className:"text-sm font-semibold text-foreground",children:"Notes / Description *"}),(0,b.jsx)("textarea",{name:"notes",value:r.notes,onChange:x,placeholder:"Payment details, receipt number, etc.",className:"w-full p-3 border border-border rounded-lg text-sm resize-none bg-background text-foreground",rows:3,required:!0})]}),(0,b.jsxs)("div",{className:"bg-primary/10 border-2 border-primary rounded-lg p-4 space-y-3",children:[(0,b.jsxs)("div",{className:"flex items-center justify-between pb-3 border-b border-primary/20",children:[(0,b.jsx)("span",{className:"text-sm font-medium text-muted-foreground",children:"Appointment Amount:"}),(0,b.jsx)("span",{className:"text-lg font-bold text-foreground",children:(0,n.formatCurrency)(a.amount||0)})]}),(0,b.jsxs)("div",{className:"flex items-center justify-between pb-3 border-b border-primary/20",children:[(0,b.jsx)("span",{className:"text-sm font-medium text-foreground",children:"Amount Paid:"}),(0,b.jsx)("span",{className:"text-2xl font-bold text-primary",children:(0,n.formatCurrency)(Number.parseFloat(r.amount||"0"))})]}),Number.parseFloat(r.amount||"0")!==(a.amount||0)&&(0,b.jsxs)("div",{className:"flex items-center justify-between pb-3 border-b border-primary/20",children:[(0,b.jsx)("span",{className:"text-sm font-medium text-muted-foreground",children:Number.parseFloat(r.amount||"0")>(a.amount||0)?"Overpaid:":"Balance Due:"}),(0,b.jsx)("span",{className:`text-lg font-bold ${Number.parseFloat(r.amount||"0")>(a.amount||0)?"text-green-600":"text-red-600"}`,children:(0,n.formatCurrency)(Math.abs(Number.parseFloat(r.amount||"0")-(a.amount||0)))})]}),(0,b.jsxs)("div",{className:"flex items-center justify-between text-sm pt-2",children:[(0,b.jsx)("span",{className:"text-muted-foreground",children:"Dentist Share (50%):"}),(0,b.jsx)("span",{className:"font-semibold text-foreground",children:(0,n.formatCurrency)(.5*Number.parseFloat(r.amount||"0"))})]}),(0,b.jsxs)("div",{className:"flex items-center justify-between text-sm",children:[(0,b.jsx)("span",{className:"text-muted-foreground",children:"Clinic Share (50%):"}),(0,b.jsx)("span",{className:"font-semibold text-foreground",children:(0,n.formatCurrency)(.5*Number.parseFloat(r.amount||"0"))})]})]}),(0,b.jsxs)("div",{className:"flex gap-3 pt-4",children:[(0,b.jsx)(d.Button,{type:"button",onClick:p,variant:"outline",className:"flex-1 h-11 bg-transparent",children:"Cancel"}),(0,b.jsxs)(d.Button,{type:"submit",className:"flex-1 h-11 bg-primary hover:bg-primary/90 text-primary-foreground font-bold",children:[(0,b.jsx)(k.Receipt,{className:"w-4 h-4 mr-2"}),"Record Payment"]})]})]})]})]})})}a.s(["default",()=>p])}];

//# sourceMappingURL=_e793d4a5._.js.map