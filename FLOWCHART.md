# Mouthworks System Flowcharts

Below are Mermaid diagrams outlining the full workflows across Patient, HR, and Dentist roles, including appointments, treatments, payments, and inventory.

## End-to-End Patient Journey
```mermaid
flowchart TD
  A[Patient: Book Appointment] --> B{Select Service & Date}
  B --> C[Create Appointment: status=pending]
  C --> D[HR: Assign Dentist]
  D --> E[Appointment: status=approved]
  E --> F[Patient Attends]
  F --> G[Dentist: Perform Treatment]
  G --> H[Record Treatment Records (with quantity)]
  H --> I[Dentist: Complete Appointment]
  I --> J[System: Fetch Service Price]
  J --> K[Create Payment (patient_id, dentist_id, appointment_id, amount, status)]
  K --> L{HR: Record/Confirm Payment}
  L -->|Paid| M[Update Payment status=paid]
  L -->|Partial/Unpaid| N[Maintain status]
  M --> O[Sync to HR Payments]
  M --> P[Sync to Dentist Earnings]
  M --> Q[Sync to Patient Payment History]
```

## HR Workflows
```mermaid
flowchart LR
  subgraph HR_Dashboard
    A1[View Metrics & Quick Actions]
  end
  subgraph HR_Patients
    B1[Create/Update/Delete Patients]
    B2[View Patient Profile]
  end
  subgraph HR_Appointments
    C1[Book/Assign Dentist]
    C2[Approve/Reject]
    C3[Complete & Link Payments]
  end
  subgraph HR_Treatments
    D1[Manage Treatment Catalog]
    D2[Prices & Categories]
  end
  subgraph HR_Payments
    E1[Record Payment]
    E2[Edit Status]
    E3[Delete Payment]
    E4[Search/Filter]
  end
  subgraph HR_Inventory
    F1[Manage Supplies]
    F2[Review Dentist Supply Requests]
  end

  B1 --> C1 --> C2 --> C3 --> E1
  D1 --> C3
  F2 --> A1
  E1 --> A1
```

## Dentist Workflows
```mermaid
flowchart LR
  subgraph Dentist_Schedule
    A[View Assigned Appointments]
    B[Complete Appointment]
  end
  subgraph Dentist_Treatments
    C[Add/Update Treatments]
    D[Record Treatment Details]
  end
  subgraph Dentist_Earnings
    E[View Transactions]
    F[Net Balance & Filters]
  end
  A --> B --> D --> E --> F
  C --> D
```

## Patient Workflows
```mermaid
flowchart LR
  subgraph Patient_Appointments
    A[Book Appointment]
    B[Manage Upcoming]
  end
  subgraph Patient_Dashboard
    C[Overview & History]
  end
  subgraph Patient_Payments
    D[View Payment History]
  end
  subgraph Patient_Profile
    E[Update Personal Info]
  end

  A --> B --> C --> D --> E
```

## Data & Services Connectivity
```mermaid
flowchart TD
  subgraph Supabase
    DB[(PostgreSQL)]
    AUTH[Auth]
    RLS[Row-Level Security]
    REST[PostgREST]
  end

  subgraph NextJS_App
    API[app/api/*]
    Pages[app/* role pages]
    Services[lib/db-service.ts]
    Client[supabase-client.ts]
    Server[supabase-server.ts]
  end

  Pages --> Services --> Client --> REST --> DB
  API --> Server --> DB
  AUTH --> Client
  RLS --> REST
```

## Payment Lifecycle
```mermaid
sequenceDiagram
  participant Patient
  participant HR
  participant Dentist
  participant App
  participant DB

  Patient->>App: Books appointment (pending)
  HR->>App: Assigns dentist (approved)
  Dentist->>App: Completes treatment
  App->>DB: Insert treatment_records (quantity)
  App->>DB: Fetch service price
  App->>DB: Insert payment (patient_id, dentist_id, appointment_id, amount)
  HR->>App: Confirms/updates payment status
  App->>DB: Update payment status
  DB-->>App: Reflect changes across views
  App-->>Dentist: Earnings updated
  App-->>HR: Payments panel updated
  App-->>Patient: Payment history updated
```

## RLS & Schema Maintenance
```mermaid
flowchart TD
  A[Run schema scripts in scripts/*.sql] --> B[Enable/Configure RLS]
  B --> C[If blocked: run emergency ALL ACCESS or DISABLE RLS]
  C --> D[NOTIFY pgrst 'reload schema']
  D --> E[Restart dev server]
  E --> F[Hard refresh browser]
```

## Inventory & Supply Requests
```mermaid
flowchart LR
  Dentist[Submit Supply Request] --> HR[Review & Approve]
  HR --> Inventory[Update Inventory]
  Inventory --> Reports[Track usage]
```

## Notes
- Payments must include `patient_id`, `dentist_id`, `appointment_id`, `amount`, `status`, `method`, `date`.
- Treatment records include `quantity` to avoid completion errors.
- After DDL changes, use `NOTIFY pgrst, 'reload schema';` and restart dev.
