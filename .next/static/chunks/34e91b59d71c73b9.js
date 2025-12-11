(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,69638,e=>{"use strict";let t=(0,e.i(75254).default)("CircleCheckBig",[["path",{d:"M21.801 10A10 10 0 1 1 17 3.335",key:"yps3ct"}],["path",{d:"m9 11 3 3L22 4",key:"1pflzl"}]]);e.s(["CheckCircle",()=>t],69638)},63209,e=>{"use strict";let t=(0,e.i(75254).default)("CircleAlert",[["circle",{cx:"12",cy:"12",r:"10",key:"1mglay"}],["line",{x1:"12",x2:"12",y1:"8",y2:"12",key:"1pkeuh"}],["line",{x1:"12",x2:"12.01",y1:"16",y2:"16",key:"4dfq90"}]]);e.s(["AlertCircle",()=>t],63209)},40160,e=>{"use strict";let t=(0,e.i(75254).default)("Download",[["path",{d:"M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4",key:"ih7n3h"}],["polyline",{points:"7 10 12 15 17 10",key:"2ggqvy"}],["line",{x1:"12",x2:"12",y1:"15",y2:"3",key:"1vk2je"}]]);e.s(["Download",()=>t],40160)},63835,e=>{"use strict";let t=e=>{let t=(.5*e.amount).toFixed(2),a=(.5*e.amount).toFixed(2);return`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Payment Receipt - ${e.receiptNumber}</title>
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
        <p style="font-weight: 700; font-size: 20px; color: #2563eb;">${e.receiptNumber}</p>
      </div>
      <div class="info-block" style="text-align: right;">
        <h3>Date</h3>
        <p style="font-weight: 600;">${e.date}</p>
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
          <td>${e.patientName}</td>
        </tr>
        ${e.patientEmail?`
        <tr>
          <td><strong>Patient Email</strong></td>
          <td>${e.patientEmail}</td>
        </tr>
        `:""}
        <tr>
          <td><strong>Dentist</strong></td>
          <td>Dr. ${e.dentistName}</td>
        </tr>
        <tr>
          <td><strong>Service / Treatment</strong></td>
          <td>${e.service}</td>
        </tr>
        <tr>
          <td><strong>Payment Method</strong></td>
          <td>${e.method}</td>
        </tr>
        ${e.notes?`
        <tr>
          <td><strong>Notes</strong></td>
          <td>${e.notes}</td>
        </tr>
        `:""}
      </tbody>
    </table>

    <div class="amount-section">
      <div class="amount-row">
        <span>Service Amount:</span>
        <span>₱${e.amount.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
      </div>
      <div class="amount-row">
        <span>Dentist Share (50%):</span>
        <span>₱${Number(t).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
      </div>
      <div class="amount-row">
        <span>Clinic Share (50%):</span>
        <span>₱${Number(a).toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
      </div>
      <div class="amount-row total">
        <span>TOTAL PAID:</span>
        <span>₱${e.amount.toLocaleString("en-US",{minimumFractionDigits:2,maximumFractionDigits:2})}</span>
      </div>
    </div>

    <div class="stamp">
      ✓ PAYMENT RECEIVED - ${e.date}
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
  `};e.s(["downloadReceipt",0,e=>{let a=new Blob([t(e)],{type:"text/html"}),r=URL.createObjectURL(a),s=document.createElement("a");s.href=r,s.download=`Receipt_${e.receiptNumber}_${e.patientName.replace(/\s+/g,"_")}.html`,document.body.appendChild(s),s.click(),document.body.removeChild(s),URL.revokeObjectURL(r)},"printReceipt",0,e=>{let a=t(e),r=window.open("","_blank");r&&(r.document.write(a),r.document.close(),r.onload=()=>{r.print()})}])},71688,e=>{"use strict";var t=e.i(43476),a=e.i(71645),r=e.i(91432),s=e.i(77395),n=e.i(70065),i=e.i(67881),o=e.i(23750),d=e.i(60289),l=e.i(61911),c=e.i(87316),m=e.i(77176),p=e.i(61659),x=e.i(88844),u=e.i(17923),h=e.i(39616),g=e.i(7233),f=e.i(27612),b=e.i(55436),y=e.i(69638),j=e.i(63209),v=e.i(40160),N=e.i(44496),w=e.i(47163),C=e.i(63835),k=e.i(37727);function S({onClose:e,onSubmit:r}){let[s,n]=(0,a.useState)({patient_id:"",dentist_id:"",amount:"",method:"Cash",status:"paid",description:""}),[d,l]=(0,a.useState)([]),[c,m]=(0,a.useState)([]),[p,x]=(0,a.useState)(!0);(0,a.useEffect)(()=>{u()},[]);let u=async()=>{try{x(!0);let[e,t]=await Promise.all([N.patientService.getAll(),N.dentistService.getAll()]);l(e||[]),m(t||[])}catch(e){console.error("Error loading data:",e)}finally{x(!1)}},h=e=>{let{name:t,value:a}=e.target;n(e=>({...e,[t]:a}))};return(0,t.jsx)("div",{className:"fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4",children:(0,t.jsxs)("div",{className:"bg-card rounded-lg shadow-2xl max-w-md w-full max-h-96 overflow-y-auto",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between p-6 border-b border-border sticky top-0 bg-card",children:[(0,t.jsx)("h2",{className:"text-xl font-bold text-foreground",children:"Record Payment"}),(0,t.jsx)("button",{onClick:e,className:"p-1 hover:bg-muted rounded-lg transition-colors",children:(0,t.jsx)(k.X,{className:"w-5 h-5"})})]}),(0,t.jsxs)("form",{onSubmit:e=>{e.preventDefault(),s.patient_id&&s.amount&&s.description&&s.dentist_id&&(r({patient_id:s.patient_id,dentist_id:s.dentist_id,amount:Number.parseFloat(s.amount),method:s.method,status:s.status,description:s.description,date:new Date().toISOString().split("T")[0]}),n({patient_id:"",dentist_id:"",amount:"",method:"Cash",status:"paid",description:""}))},className:"p-6 space-y-4",children:[(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("label",{className:"text-sm font-medium text-foreground",children:"Patient *"}),p?(0,t.jsx)("div",{className:"text-sm text-muted-foreground",children:"Loading..."}):(0,t.jsxs)("select",{name:"patient_id",value:s.patient_id,onChange:h,className:"w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground",required:!0,children:[(0,t.jsx)("option",{value:"",children:"Select patient..."}),d.map(e=>(0,t.jsx)("option",{value:e.id,children:e.name},e.id))]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("label",{className:"text-sm font-medium text-foreground",children:"Dentist *"}),p?(0,t.jsx)("div",{className:"text-sm text-muted-foreground",children:"Loading..."}):(0,t.jsxs)("select",{name:"dentist_id",value:s.dentist_id,onChange:h,className:"w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground",required:!0,children:[(0,t.jsx)("option",{value:"",children:"Select dentist..."}),c.map(e=>(0,t.jsx)("option",{value:e.id,children:e.name},e.id))]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("label",{className:"text-sm font-medium text-foreground",children:"Amount (₱) *"}),(0,t.jsx)(o.Input,{name:"amount",type:"number",step:"0.01",value:s.amount,onChange:h,placeholder:"0.00",className:"border-border",required:!0})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("label",{className:"text-sm font-medium text-foreground",children:"Payment Method"}),(0,t.jsxs)("select",{name:"method",value:s.method,onChange:h,className:"w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground",children:[(0,t.jsx)("option",{children:"Cash"}),(0,t.jsx)("option",{children:"Bank Transfer"}),(0,t.jsx)("option",{children:"Credit Card"}),(0,t.jsx)("option",{children:"Check"}),(0,t.jsx)("option",{children:"Insurance"})]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("label",{className:"text-sm font-medium text-foreground",children:"Status"}),(0,t.jsxs)("select",{name:"status",value:s.status,onChange:h,className:"w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground",children:[(0,t.jsx)("option",{value:"paid",children:"Paid"}),(0,t.jsx)("option",{value:"partial",children:"Partial"}),(0,t.jsx)("option",{value:"unpaid",children:"Unpaid"})]})]}),(0,t.jsxs)("div",{className:"space-y-2",children:[(0,t.jsx)("label",{className:"text-sm font-medium text-foreground",children:"Description *"}),(0,t.jsx)("textarea",{name:"description",value:s.description,onChange:h,placeholder:"e.g., Cleaning - Dec 5, 2024",className:"w-full p-2 border border-border rounded-lg text-sm resize-none bg-background text-foreground",rows:2,required:!0})]}),(0,t.jsxs)("div",{className:"flex gap-2 pt-4",children:[(0,t.jsx)(i.Button,{type:"button",onClick:e,variant:"outline",className:"flex-1 bg-transparent",children:"Cancel"}),(0,t.jsx)(i.Button,{type:"submit",className:"flex-1 bg-primary hover:bg-primary/90 text-primary-foreground",disabled:p,children:"Record Payment"})]})]})]})})}function D(){let{user:e}=(0,r.useAuth)(),[k,D]=(0,a.useState)([]),[P,U]=(0,a.useState)([]),[T,A]=(0,a.useState)(!0),[R,E]=(0,a.useState)(!1),[L,_]=(0,a.useState)("all"),[$,z]=(0,a.useState)(""),[F,B]=(0,a.useState)(null),[I,M]=(0,a.useState)(null),[O,q]=(0,a.useState)("");(0,a.useEffect)(()=>{H();let e=setInterval(()=>{H()},3e3);return()=>clearInterval(e)},[]);let H=async()=>{try{A(!0);let[e,t]=await Promise.all([N.paymentService.getAll(),N.patientService.getAll()]);D(e||[]),U(t||[])}catch(e){console.error("[v0] Error loading data:",e)}finally{A(!1)}},K=[{label:"Dashboard",icon:(0,t.jsx)(d.LayoutDashboard,{className:"w-5 h-5"}),href:"/hr/dashboard"},{label:"Patients",icon:(0,t.jsx)(l.Users,{className:"w-5 h-5"}),href:"/hr/patients"},{label:"Appointments",icon:(0,t.jsx)(c.Calendar,{className:"w-5 h-5"}),href:"/hr/appointments"},{label:"Treatments",icon:(0,t.jsx)(m.Bluetooth,{className:"w-5 h-5"}),href:"/hr/treatments"},{label:"Payments",icon:(0,t.jsx)(p.CreditCard,{className:"w-5 h-5"}),href:"/hr/payments"},{label:"Inventory",icon:(0,t.jsx)(x.Package,{className:"w-5 h-5"}),href:"/hr/inventory"},{label:"Reports",icon:(0,t.jsx)(u.BarChart3,{className:"w-5 h-5"}),href:"/hr/reports"},{label:"Settings",icon:(0,t.jsx)(h.Settings,{className:"w-5 h-5"}),href:"/hr/settings"}],Y=async e=>{try{let t=await N.paymentService.create(e);D([t,...k]),E(!1),await H(),console.log("[v0] ✅ Payment recorded and data reloaded")}catch(e){console.error("[v0] Error recording payment:",e),alert("Error recording payment: "+(e instanceof Error?e.message:"Unknown error"))}},G=async e=>{if(confirm("Are you sure you want to delete this payment record?"))try{await N.paymentService.delete(e),D(k.filter(t=>t.id!==e))}catch(e){console.error("[v0] Error deleting payment:",e),alert("Error deleting payment: "+(e instanceof Error?e.message:"Unknown error"))}},V=async(e,t,a)=>{try{let r=await N.paymentService.update(e,{[t]:a});D(k.map(t=>t.id===e?r:t)),B(null),M(null),q("")}catch(e){console.error("[v0] Error updating payment:",e),alert("Error updating payment: "+(e instanceof Error?e.message:"Unknown error"))}},W=k.filter(e=>{let t="all"===L||e.status===L,a=P.find(t=>t.id===e.patient_id),r=a?.name.toLowerCase().includes($.toLowerCase())||e.description?.toLowerCase().includes($.toLowerCase());return t&&r}),X=k.filter(e=>"paid"===e.status).reduce((e,t)=>e+t.amount,0),J=k.filter(e=>"partial"===e.status).reduce((e,t)=>e+t.amount,0),Q=k.filter(e=>"unpaid"===e.status).reduce((e,t)=>e+t.amount,0),Z={paid:k.filter(e=>"paid"===e.status).length,partial:k.filter(e=>"partial"===e.status).length,unpaid:k.filter(e=>"unpaid"===e.status).length};return(0,t.jsxs)(s.default,{navItems:K,title:"Payment Management",children:[(0,t.jsxs)("div",{className:"space-y-6",children:[(0,t.jsxs)("div",{className:"flex items-center justify-between",children:[(0,t.jsxs)("div",{children:[(0,t.jsx)("h2",{className:"text-2xl font-bold text-foreground",children:"Payment Tracking"}),(0,t.jsx)("p",{className:"text-muted-foreground",children:"Record and manage patient payments"})]}),(0,t.jsxs)("div",{className:"flex gap-2",children:[(0,t.jsx)(i.Button,{onClick:H,variant:"outline",size:"sm",children:"🔄 Refresh"}),(0,t.jsxs)(i.Button,{onClick:()=>E(!0),className:"bg-primary hover:bg-primary/90 text-primary-foreground gap-2",children:[(0,t.jsx)(g.Plus,{className:"w-4 h-4"}),"Record Payment"]})]})]}),(0,t.jsxs)("div",{className:"grid grid-cols-1 md:grid-cols-4 gap-4",children:[(0,t.jsxs)(n.Card,{className:"hover:shadow-md transition-shadow",children:[(0,t.jsx)(n.CardHeader,{className:"pb-3",children:(0,t.jsx)(n.CardTitle,{className:"text-sm font-medium text-muted-foreground",children:"Total Paid"})}),(0,t.jsxs)(n.CardContent,{children:[(0,t.jsx)("div",{className:"text-3xl font-bold text-green-600",children:(0,w.formatCurrency)(X)}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground mt-1",children:[Z.paid," payments"]})]})]}),(0,t.jsxs)(n.Card,{className:"hover:shadow-md transition-shadow",children:[(0,t.jsx)(n.CardHeader,{className:"pb-3",children:(0,t.jsx)(n.CardTitle,{className:"text-sm font-medium text-muted-foreground",children:"Partial Payments"})}),(0,t.jsxs)(n.CardContent,{children:[(0,t.jsx)("div",{className:"text-3xl font-bold text-yellow-600",children:(0,w.formatCurrency)(J)}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground mt-1",children:[Z.partial," payments"]})]})]}),(0,t.jsxs)(n.Card,{className:"hover:shadow-md transition-shadow",children:[(0,t.jsx)(n.CardHeader,{className:"pb-3",children:(0,t.jsx)(n.CardTitle,{className:"text-sm font-medium text-muted-foreground",children:"Unpaid Balance"})}),(0,t.jsxs)(n.CardContent,{children:[(0,t.jsx)("div",{className:"text-3xl font-bold text-destructive",children:(0,w.formatCurrency)(Q)}),(0,t.jsxs)("p",{className:"text-xs text-muted-foreground mt-1",children:[Z.unpaid," unpaid"]})]})]}),(0,t.jsxs)(n.Card,{className:"hover:shadow-md transition-shadow",children:[(0,t.jsx)(n.CardHeader,{className:"pb-3",children:(0,t.jsx)(n.CardTitle,{className:"text-sm font-medium text-muted-foreground",children:"Total Revenue"})}),(0,t.jsxs)(n.CardContent,{children:[(0,t.jsx)("div",{className:"text-3xl font-bold text-primary",children:(0,w.formatCurrency)(X+J)}),(0,t.jsx)("p",{className:"text-xs text-muted-foreground mt-1",children:"Received so far"})]})]})]}),(0,t.jsx)(n.Card,{children:(0,t.jsxs)(n.CardContent,{className:"pt-6 space-y-4",children:[(0,t.jsxs)("div",{className:"relative",children:[(0,t.jsx)(b.Search,{className:"absolute left-3 top-2.5 w-4 h-4 text-muted-foreground"}),(0,t.jsx)(o.Input,{type:"text",placeholder:"Search by patient name or description...",value:$,onChange:e=>z(e.target.value),className:"pl-10 border-border"})]}),(0,t.jsx)("div",{className:"flex gap-2",children:["all","paid","partial","unpaid"].map(e=>(0,t.jsx)("button",{onClick:()=>_(e),className:`px-4 py-2 rounded-lg font-medium transition-colors text-sm ${L===e?"bg-primary text-primary-foreground":"bg-muted text-foreground hover:bg-muted/80"}`,children:e.charAt(0).toUpperCase()+e.slice(1)},e))})]})}),(0,t.jsxs)(n.Card,{children:[(0,t.jsxs)(n.CardHeader,{children:[(0,t.jsx)(n.CardTitle,{children:"Payment Records"}),(0,t.jsxs)(n.CardDescription,{children:[W.length," payment(s) found"]})]}),(0,t.jsx)(n.CardContent,{children:(0,t.jsx)("div",{className:"overflow-x-auto",children:(0,t.jsxs)("table",{className:"w-full",children:[(0,t.jsx)("thead",{children:(0,t.jsxs)("tr",{className:"border-b border-border",children:[(0,t.jsx)("th",{className:"text-left py-3 px-4 font-semibold text-foreground",children:"Date"}),(0,t.jsx)("th",{className:"text-left py-3 px-4 font-semibold text-foreground",children:"Patient"}),(0,t.jsx)("th",{className:"text-left py-3 px-4 font-semibold text-foreground",children:"Dentist"}),(0,t.jsx)("th",{className:"text-left py-3 px-4 font-semibold text-foreground",children:"Description"}),(0,t.jsx)("th",{className:"text-left py-3 px-4 font-semibold text-foreground",children:"Amount"}),(0,t.jsx)("th",{className:"text-left py-3 px-4 font-semibold text-foreground",children:"Method"}),(0,t.jsx)("th",{className:"text-left py-3 px-4 font-semibold text-foreground",children:"Status"}),(0,t.jsx)("th",{className:"text-left py-3 px-4 font-semibold text-foreground",children:"Actions"})]})}),(0,t.jsx)("tbody",{children:0===W.length?(0,t.jsx)("tr",{children:(0,t.jsx)("td",{colSpan:8,className:"py-8 text-center text-muted-foreground",children:"No payments found"})}):W.map(e=>{let a=P.find(t=>t.id===e.patient_id);return(0,t.jsxs)("tr",{className:"border-b border-border hover:bg-muted/50 transition-colors",children:[(0,t.jsx)("td",{className:"py-3 px-4 text-sm text-muted-foreground",children:e.date?new Date(e.date).toLocaleDateString():"-"}),(0,t.jsx)("td",{className:"py-3 px-4 text-sm font-medium text-foreground",children:a?.name||"Unknown"}),(0,t.jsx)("td",{className:"py-3 px-4 text-sm text-muted-foreground",children:e.dentists?.name||"-"}),(0,t.jsx)("td",{className:"py-3 px-4 text-sm text-muted-foreground",children:e.description||"-"}),(0,t.jsx)("td",{className:"py-3 px-4 text-sm font-semibold text-foreground",children:(0,w.formatCurrency)(e.amount)}),(0,t.jsx)("td",{className:"py-3 px-4 text-sm text-muted-foreground",children:e.method||"-"}),(0,t.jsx)("td",{className:"py-3 px-4",children:F===e.id&&"status"===I?(0,t.jsxs)("select",{value:O,onChange:e=>q(e.target.value),onBlur:()=>V(e.id,"status",O),className:"px-2 py-1 border border-border rounded text-xs bg-background text-foreground",autoFocus:!0,children:[(0,t.jsx)("option",{value:"paid",children:"Paid"}),(0,t.jsx)("option",{value:"partial",children:"Partial"}),(0,t.jsx)("option",{value:"unpaid",children:"Unpaid"})]}):(0,t.jsxs)("button",{onClick:()=>{B(e.id),M("status"),q(e.status)},className:`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold cursor-pointer hover:opacity-80 transition-opacity ${"paid"===e.status?"bg-green-100 text-green-700":"partial"===e.status?"bg-yellow-100 text-yellow-700":"bg-red-100 text-red-700"}`,children:["paid"===e.status?(0,t.jsx)(y.CheckCircle,{className:"w-3 h-3"}):(0,t.jsx)(j.AlertCircle,{className:"w-3 h-3"}),e.status.charAt(0).toUpperCase()+e.status.slice(1)]})}),(0,t.jsx)("td",{className:"py-3 px-4",children:(0,t.jsxs)("div",{className:"flex items-center gap-2",children:[(0,t.jsx)("button",{onClick:()=>{let t,a;return t=P.find(t=>t.id===e.patient_id),a={receiptNumber:e.id.slice(0,8).toUpperCase(),date:e.date?new Date(e.date).toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}):new Date().toLocaleDateString("en-US",{year:"numeric",month:"long",day:"numeric"}),patientName:t?.name||e.patients?.name||"Unknown Patient",patientEmail:t?.email||e.patients?.email,dentistName:e.dentists?.name||"Not Assigned",service:e.description||"Dental Service",amount:e.amount,method:e.method||"Cash",notes:e.description},void(0,C.downloadReceipt)(a)},className:"p-1.5 hover:bg-primary/10 rounded-lg transition-colors text-primary",title:"Download receipt",children:(0,t.jsx)(v.Download,{className:"w-4 h-4"})}),(0,t.jsx)("button",{onClick:()=>G(e.id),className:"p-1.5 hover:bg-destructive/10 rounded-lg transition-colors text-destructive",title:"Delete payment",children:(0,t.jsx)(f.Trash2,{className:"w-4 h-4"})})]})})]},e.id)})})]})})})]})]}),T?(0,t.jsx)(n.Card,{children:(0,t.jsx)(n.CardContent,{className:"pt-6",children:(0,t.jsx)("div",{className:"text-center text-muted-foreground",children:"Loading payments..."})})}):(0,t.jsx)(t.Fragment,{children:R&&(0,t.jsx)(S,{onClose:()=>E(!1),onSubmit:Y})})]})}e.s(["default",()=>D],71688)}]);