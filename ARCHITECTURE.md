# MIM CRM - System Architecture & Data Flow

## 🏗️ Complete System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                          🌐 FRONTEND (React + TypeScript)                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                     PUBLIC PAGES (No Auth Required)                  │   │
│  │  • Home Page (index.tsx) - Hero section + Services                   │   │
│  │  • Products (products.tsx) - Window products gallery                 │   │
│  │  • Projects (projects.tsx) - Portfolio showcase                      │   │
│  │  • Contact (contact.tsx) - Lead form → creates leads in CRM          │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │                      ROOT LAYOUT (__root.tsx)                        │   │
│  │  • Wrapped with <AuthProvider>                                      │   │
│  │  • Contains: Header + Outlet (routes) + Footer + WhatsAppFab        │   │
│  │  • Manages global authentication state                              │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                    ┌────────────────┴────────────────┐                       │
│                    ▼                                 ▼                       │
│  ┌────────────────────────────┐    ┌────────────────────────────┐           │
│  │   PROTECTED PAGES          │    │   AUTHENTICATION PAGES     │           │
│  │ (Auth Required - JWT)      │    │                            │           │
│  │                            │    │ • Login (login.tsx)        │           │
│  │ • Dashboard                │    │   - Email + Password       │           │
│  │   (dashboard.tsx)          │    │   - Test credentials shown │           │
│  │   - Metrics cards          │    │   - Success redirect →     │           │
│  │   - Module navigation      │    │     /dashboard             │           │
│  │                            │    └────────────────────────────┘           │
│  │ • Leads Module             │                                             │
│  │   (leads.tsx)              │                                             │
│  │   - CREATE lead            │                                             │
│  │   - READ all leads         │                                             │
│  │   - UPDATE lead status     │                                             │
│  │   - DELETE lead            │                                             │
│  │   - SEARCH by name/phone   │                                             │
│  │   - FILTER by status       │                                             │
│  │   - Real-time stats        │                                             │
│  │                            │                                             │
│  │ • Projects Module          │                                             │
│  │   (projects-crm.tsx)       │                                             │
│  │   - CREATE from converted  │                                             │
│  │     leads only             │                                             │
│  │   - Auto-calculate amount  │                                             │
│  │     with GST               │                                             │
│  │   - UPDATE status          │                                             │
│  │   - SEARCH & FILTER        │                                             │
│  │   - Real-time stats        │                                             │
│  │                            │                                             │
│  │ • Payments Module          │                                             │
│  │   (payments.tsx)           │                                             │
│  │   - CREATE payment         │                                             │
│  │   - RECORD by type         │                                             │
│  │     (ADVANCE/PARTIAL/      │                                             │
│  │      FINAL)                │                                             │
│  │   - UPDATE status (PENDING/│                                             │
│  │     DUE/PAID/OVERDUE)      │                                             │
│  │   - Collection statistics  │                                             │
│  │                            │                                             │
│  │ • Employees Module         │                                             │
│  │   (employees.tsx)          │                                             │
│  │   - Employees Tab:         │                                             │
│  │     * ADD employee         │                                             │
│  │     * EDIT employee        │                                             │
│  │     * DELETE employee      │                                             │
│  │   - Attendance Tab:        │                                             │
│  │     * MARK attendance      │                                             │
│  │     * View history         │                                             │
│  │     * Daily statistics     │                                             │
│  │                            │                                             │
│  └────────────────────────────┘                                             │
│            │                                                                 │
│            └─────────────────────┬──────────────────────────────┐           │
│                                  ▼                              ▼           │
│                    ┌──────────────────────┐    ┌───────────────────┐      │
│                    │  FOOTER COMPONENT    │    │  UPDATED SECTIONS │      │
│                    │  (site/Footer.tsx)   │    │                   │      │
│                    │                      │    │ • "Account"       │      │
│                    │ • Company info       │    │   section added   │      │
│                    │ • Services           │    │ • Conditional:    │      │
│                    │ • Locations          │    │   - Not logged in │      │
│                    │ • Account section ✨ │    │     → Login btn   │      │
│                    │   NEW! Dynamic links │    │   - Logged in →   │      │
│                    │   based on auth      │    │     Dashboard +   │      │
│                    │                      │    │     Logout        │      │
│                    └──────────────────────┘    └───────────────────┘      │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│              🔐 AUTH LAYER (Context API + Supabase Auth)                     │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │              AuthContext (src/lib/auth-context.tsx)                  │   │
│  │                                                                      │   │
│  │  Global State:                                                      │   │
│  │  • user: Supabase User (email, id, updated_at)                      │   │
│  │  • userProfile: UserProfile (id, email, name, phone, role)          │   │
│  │  • isAuthenticated: boolean (user logged in?)                       │   │
│  │  • loading: boolean (auth checking?)                                │   │
│  │                                                                      │   │
│  │  Functions:                                                         │   │
│  │  • signUp(email, password, name, phone) → creates user + profile   │   │
│  │  • signIn(email, password) → validates → returns JWT               │   │
│  │  • signOut() → clears session → redirects /home                    │   │
│  │  • getSession() → reads from localStorage → validates JWT          │   │
│  │                                                                      │   │
│  │  Features:                                                          │   │
│  │  • Session persistence (survives page reload)                      │   │
│  │  • Auto-sync userProfile from Supabase                             │   │
│  │  • JWT token refresh on auth state change                          │   │
│  │  • Global useAuth() hook for all components                        │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                     │                                        │
│                                     ▼                                        │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │            Supabase Authentication (JWT Tokens)                      │   │
│  │                                                                      │   │
│  │  • Email/Password login                                             │   │
│  │  • JWT token generation                                             │   │
│  │  • Token refresh mechanism                                          │   │
│  │  • User session management                                          │   │
│  │  • RLS policy enforcement                                           │   │
│  │                                                                      │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
                                     │
                                     ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│           🗄️ SUPABASE BACKEND (PostgreSQL + RLS + Triggers)                 │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                               │
│  ┌─ USERS TABLE ─────────────────────────────────────────────────────────┐  │
│  │ id (UUID) | email | password_hash | role | created_at               │  │
│  │ Roles: admin, sales, operations, accounts                            │  │
│  │ RLS: Each user can only read own profile                             │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│          │                                                                    │
│          ├──────────────────────────────────────────────────────────┐       │
│          │                                                          │        │
│          ▼                                                          ▼        │
│  ┌─ LEADS TABLE ─────────────────┐         ┌─ EMPLOYEES TABLE ──────┐     │
│  │ id | name | phone | location  │         │ id | full_name | email  │     │
│  │ status (NEW→CONVERTED/LOST)   │         │ phone | role | status  │     │
│  │ created_by (user_id)          │         │ created_at             │     │
│  │ created_at | updated_at       │         │ RLS: All can view      │     │
│  │ RLS: User sees own leads      │         │ RLS: Admin/Ops only    │     │
│  └───────────────┬───────────────┘         └────────┬────────────────┘     │
│                  │                                  │                       │
│                  │ (when CONVERTED)                 │                       │
│                  ▼                                  │                       │
│  ┌─ PROJECTS TABLE ───────────────────┐             │                       │
│  │ id | lead_id (FK) | project_name   │             │                       │
│  │ total_sqft | rate_per_sqft         │             │                       │
│  │ final_amount | gst_percentage      │             │                       │
│  │ total_with_gst (AUTO-CALCULATED)   │             │                       │
│  │ status (ACTIVE→COMPLETED)          │             │                       │
│  │ target_date | start_date | created_at            │                       │
│  │ RLS: Ops team sees all projects    │             │                       │
│  │                                    │             │                       │
│  │ TRIGGER: calculate_project_amount()│             │                       │
│  │ • Auto-calc: total = sqft × rate   │             │                       │
│  │ • Auto-calc: with_gst = +GST%      │             │                       │
│  │ • Runs on INSERT & UPDATE          │             │                       │
│  └────────────────┬────────────────────┘             │                       │
│                   │                                  │                       │
│                   ▼                                  │                       │
│  ┌─ PAYMENTS TABLE ────────────────────┐            │                       │
│  │ id | project_id (FK) | amount       │            │                       │
│  │ payment_type (ADVANCE/PARTIAL/      │            │                       │
│  │ FINAL) | payment_status (PENDING/   │            │                       │
│  │ DUE/PAID/OVERDUE)                   │            │                       │
│  │ paid_on | due_on | created_at       │            │                       │
│  │ RLS: Accounts team sees all         │            │                       │
│  └────────────────┬─────────────────────┘            │                       │
│                   │                                  │                       │
│                   ▼                                  ▼                       │
│  ┌──────────────────────────────────────────────────────────────────────┐   │
│  │ ATTENDANCE TABLE                    WHATSAPP_LOGS TABLE             │   │
│  │ id | employee_id (FK) | date        id | lead_id | contact_number  │   │
│  │ status | notes | created_at         message | sent_at | status     │   │
│  │ UNIQUE(employee_id, date)           RLS: Sales team views          │   │
│  │ RLS: Ops/Admin see attendance       CREATE trigger on new leads    │   │
│  └──────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌─ PROJECT_UPDATES TABLE ────────────────────────────────────────────────┐  │
│  │ id | project_id (FK) | update_text | photos_url[] | updated_by | date   │  │
│  │ RLS: Ops team adds, all see                                             │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
│                                                                               │
│  ┌─ COMPLETED_PROJECTS TABLE ────────────────────────────────────────────┐   │
│  │ id | project_id (FK) | completion_photos[] | testimonial | rating      │   │
│  │ Portfolio/gallery display                                              │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌─ AUDIT_LOGS TABLE ────────────────────────────────────────────────────┐   │
│  │ id | user_id (FK) | action | table_name | record_id | timestamp       │   │
│  │ Compliance & compliance tracking                                       │   │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌─ DATABASE VIEWS (FOR REPORTING) ────────────────────────────────────┐     │
│  │ • leads_summary: lead count by status, conversion rate               │     │
│  │ • projects_summary: project metrics, avg amount, delays              │     │
│  │ • payments_summary: collection stats, pending, overdue               │     │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
│  ┌─ ROW-LEVEL SECURITY (RLS) POLICIES ──────────────────────────────────┐    │
│  │ Leads:     Only visible to user who created them + admin             │    │
│  │ Projects:  Only visible to operations & admin                        │    │
│  │ Payments:  Only visible to accounts & admin                          │    │
│  │ Employees: Only visible to admin & ops                               │    │
│  │ Attendance: Only admin/ops can view/edit                             │    │
│  │ WhatsApp:  Sales team only                                           │    │
│  └────────────────────────────────────────────────────────────────────────┘   │
│                                                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 🔄 Complete Data Flow Workflow

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          CUSTOMER JOURNEY                                │
└─────────────────────────────────────────────────────────────────────────┘

Step 1: WEBSITE VISIT
┌──────────────────────┐
│ Customer visits site │
│ Browses products     │
│ Interested in quote  │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────────────────────────────────────────┐
│ Fills Contact Form (contact.tsx)                         │
│ Sends inquiry details                                    │
│ SubmitForm validates & inserts into Supabase leads table │
└──────────┬───────────────────────────────────────────────┘
           │
           ▼ (Auto trigger)

Step 2: LEAD CREATION [DATABASE]
┌─────────────────────────────────────────────────────────────┐
│ New record created in LEADS TABLE                           │
│ Automatically:                                              │
│ • Status = 'NEW'                                            │
│ • created_by = null (website submission)                    │
│ • WhatsApp message auto-sent to customer                    │
│ • Audit log entry created                                   │
│                                                             │
│ TRIGGER: send_whatsapp_on_new_lead()                       │
│ • Creates entry in whatsapp_logs                           │
│ • Sends "Thank you for inquiry" message                    │
└─────────────────────────────────────────────────────────────┘
           │
           ▼

Step 3: SALES TEAM WORKFLOW
┌────────────────────────────────┐
│ Sales Manager logs in          │
│ Dashboard → Leads Module       │
│ Views new lead                 │
└────────────┬───────────────────┘
             │
             ├─ Calls customer
             │
             ▼
             UPDATE Lead Status
             NEW → CONTACTED
             
             ├─ Discusses requirements
             │
             ▼
             UPDATE Lead Status
             CONTACTED → FOLLOW_UP
             
             ├─ Arranges site visit
             │
             ▼
             UPDATE Lead Status
             FOLLOW_UP → SITE_VISIT
             
             ├─ Takes measurements, photos
             │
             ▼
             UPDATE Lead Status
             SITE_VISIT → QUOTATION_SENT
             
             ├─ Sends detailed quote
             │
             ▼
             UPDATE Lead Status
             QUOTATION_SENT → NEGOTIATION
             
             ├─ Negotiates price/timeline
             │
             ▼
             Decision Point
             ├─ Deal Closed
             │  └─ UPDATE Lead Status → CONVERTED
             │
             └─ Deal Lost
                └─ UPDATE Lead Status → LOST
                   └─ Archive in system

Step 4: PROJECT CREATION [FROM CONVERTED LEAD]
┌──────────────────────────────────┐
│ Operations Manager logs in       │
│ Dashboard → Projects Module      │
│ Clicks "Add Project"             │
│ Dropdown shows only CONVERTED    │
│ leads                            │
└────────────┬─────────────────────┘
             │
             ▼
┌────────────────────────────────────────┐
│ Fill Project Form:                     │
│ • Select Lead                          │
│ • Project name                         │
│ • Total sqft                           │
│ • Rate per sqft                        │
│ • GST % (0/18/28)                      │
│ • Target completion date               │
└────────────┬───────────────────────────┘
             │
             ▼ (Submit)

┌────────────────────────────────────────────────────┐
│ DATABASE TRIGGER: calculate_project_amount()       │
│                                                    │
│ AUTO-CALCULATE on INSERT:                          │
│ • final_amount = total_sqft × rate_per_sqft        │
│ • gst_amount = final_amount × (gst_percentage/100) │
│ • total_with_gst = final_amount + gst_amount       │
│                                                    │
│ EXAMPLE:                                           │
│ • 1000 sqft × ₹500/sqft = ₹5,00,000                │
│ • GST (18%) = ₹90,000                              │
│ • Total with GST = ₹5,90,000                       │
└────────────┬───────────────────────────────────────┘
             │
             ▼

Step 5: PROJECT EXECUTION
┌──────────────────────────────────────┐
│ Project Status: ACTIVE               │
│ Operations team updates progress     │
│                                      │
│ Weekly:                              │
│ • Add project update photos          │
│ • Update status (stays ACTIVE)       │
│ • Add completion percentage          │
│                                      │
│ If delayed:                          │
│ • Update Status → DELAYED            │
│ • Add delay reason notes             │
│                                      │
│ If on hold:                          │
│ • Update Status → ON_HOLD            │
│                                      │
│ On completion:                       │
│ • Update Status → COMPLETED          │
└────────────┬───────────────────────────┘
             │
             ▼

Step 6: PAYMENT COLLECTION
┌───────────────────────────────────┐
│ Accounts Manager logs in          │
│ Dashboard → Payments Module       │
│ Creates payment record            │
└───────────┬─────────────────────────┘
            │
            ▼ Payment Phases
            
      ┌─────────────────────────┐
      │ PHASE 1: ADVANCE (20-30%)│
      │                         │
      │ Amount: ₹1,18,000-       │
      │         1,77,000         │
      │ Due on: Contract sign    │
      └─────────┬───────────────┘
                │
                ▼ (After work starts)
                Status: PAID ✓
                
      ┌─────────────────────────┐
      │ PHASE 2: PARTIAL (50%)   │
      │                         │
      │ Amount: ₹2,95,000        │
      │ Due on: 50% completion  │
      └─────────┬───────────────┘
                │
                ▼ (On completion)
                Status: PAID ✓
                
      ┌─────────────────────────┐
      │ PHASE 3: FINAL (20-30%)  │
      │                         │
      │ Amount: ₹1,18,000-       │
      │         1,77,000         │
      │ Due on: Final delivery   │
      └─────────┬───────────────┘
                │
                ▼ (After delivery)
                Status: PAID ✓

            TOTAL COLLECTED
            ₹5,90,000 ✓ ALL PAID

Step 7: PROJECT COMPLETION
┌──────────────────────────────────┐
│ Project marked COMPLETED          │
│ All payments received             │
│                                  │
│ Moved to COMPLETED_PROJECTS       │
│ Portfolio item created            │
│ Customer testimonial added        │
│ Rating recorded                   │
└──────────────────────────────────┘

Step 8: ATTENDANCE & TEAM MANAGEMENT
┌─────────────────────────────────────────┐
│ Admin/Ops logs daily attendance         │
│ Dashboard → Employees Module            │
│ Mark attendance tab                     │
│                                         │
│ • Employee: [dropdown]                  │
│ • Date: [today]                         │
│ • Status: PRESENT / ABSENT / LEAVE      │
│ • Notes: [optional]                     │
│                                         │
│ Automatic stats:                        │
│ • Total employees                       │
│ • Present today                         │
│ • Absent today                          │
│ • On leave today                        │
└─────────────────────────────────────────┘
```

---

## 🔐 Security & Data Access Matrix

```
┌──────────────────────────────────────────────────────────────────────────┐
│                    ROLE-BASED DATA ACCESS CONTROL                         │
├──────────────────────────────────────────────────────────────────────────┤

┌─ ADMIN (Full Access) ────────────────────────────────────────────────────┐
│ ✓ All tables (CREATE, READ, UPDATE, DELETE)                             │
│ ✓ All operations                                                        │
│ ✓ User management                                                        │
│ ✓ System settings                                                        │
│ ✓ Reports & analytics                                                    │
│ ✓ Audit logs                                                             │
└──────────────────────────────────────────────────────────────────────────┘

┌─ SALES (Leads Only) ─────────────────────────────────────────────────────┐
│ ✓ Create leads                                                           │
│ ✓ View own leads + all leads (read only)                                │
│ ✓ Update lead status (via buttons)                                      │
│ ✓ Send WhatsApp messages                                                │
│ ✗ Cannot access projects                                                │
│ ✗ Cannot access payments                                                │
│ ✗ Cannot access employees                                               │
│ ✗ Cannot delete any data                                                │
└──────────────────────────────────────────────────────────────────────────┘

┌─ OPERATIONS (Projects Only) ──────────────────────────────────────────────┐
│ ✓ View converted leads (for project creation)                           │
│ ✓ Create projects                                                       │
│ ✓ View all projects                                                     │
│ ✓ Update project status                                                 │
│ ✓ Add project progress updates & photos                                │
│ ✓ Mark employee attendance                                              │
│ ✓ View employees                                                        │
│ ✗ Cannot create leads                                                   │
│ ✗ Cannot access payments                                                │
│ ✗ Cannot change lead status                                             │
└──────────────────────────────────────────────────────────────────────────┘

┌─ ACCOUNTS (Payments Only) ────────────────────────────────────────────────┐
│ ✓ View all projects (for payment linking)                               │
│ ✓ Create payment records                                                │
│ ✓ View all payments                                                     │
│ ✓ Update payment status                                                 │
│ ✓ Generate payment receipts                                             │
│ ✓ View collection statistics                                            │
│ ✗ Cannot create leads                                                   │
│ ✗ Cannot create projects                                                │
│ ✗ Cannot update project status                                          │
│ ✗ Cannot manage employees                                               │
└──────────────────────────────────────────────────────────────────────────┘

┌─ PUBLIC USER (Not Logged In) ─────────────────────────────────────────────┐
│ ✓ View home page                                                        │
│ ✓ View products gallery                                                 │
│ ✓ View projects gallery                                                 │
│ ✓ Fill contact form → auto-creates lead in CRM                         │
│ ✗ Cannot access any CRM modules                                         │
│ ✗ Redirected to /login for protected pages                             │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 🗄️ Database Schema Relationships

```
USERS (4 rows - test data)
├── admin@mim.com (Admin)
├── sales@mim.com (Sales)
├── operations@mim.com (Operations)
└── accounts@mim.com (Accounts)

LEADS (multiple)
├── Lead 1: Ramesh Kumar (NEW)
├── Lead 2: Priya Singh (CONTACTED)
├── Lead 3: Amit Patel (CONVERTED) ────┐
├── Lead 4: Neha Verma (LOST)          │
└── ...                                 │
                                        │
PROJECTS (created from CONVERTED leads) │
│                                        │
├── Project 1 (from Lead 3) ────────────┤
│   • Amount: ₹5,90,000 (auto-calc)    │
│   • Status: ACTIVE                    │
│   • GST: ₹90,000 (18%)               │
│   │                                   │
│   ├── PAYMENTS (ADVANCE/PARTIAL/FINAL)
│   │   ├── Advance: ₹1,18,000 (PAID)  │
│   │   ├── Partial: ₹2,95,000 (PAID)  │
│   │   └── Final: ₹1,77,000 (PAID)    │
│   │                                   │
│   └── PROJECT_UPDATES (Progress)     │
│       ├── Week 1: Foundation done     │
│       ├── Week 2: Walls up           │
│       ├── Week 3: Doors fitted       │
│       └── Week 4: Finishing          │
│                                       │
├── Project 2 (from Lead Y)            │
│   • Status: DELAYED                  │
│   └── PAYMENTS (Partial collection)  │
│                                       │
└── Project 3 (from Lead Z)            │
    • Status: COMPLETED               │
    └── COMPLETED_PROJECTS (Portfolio) │
        • Photos: [...]               │
        • Rating: 5/5                │
        • Testimonial: "Excellent!"  │

EMPLOYEES (multiple)
├── Employee 1 (Manager)
├── Employee 2 (Technician)
└── Employee 3 (Support)
    │
    └── ATTENDANCE (Daily records)
        ├── 2024-05-01: PRESENT
        ├── 2024-05-02: ABSENT
        ├── 2024-05-03: LEAVE
        └── ...

WHATSAPP_LOGS (messages)
├── Message 1: Lead inquiry → "Thanks for interest"
├── Message 2: Quote sent → "Your quote is ready"
└── Message 3: Reminder → "Payment due in 2 days"

AUDIT_LOGS (compliance)
├── Log 1: Sales created lead (2024-05-01 10:30)
├── Log 2: Ops updated project status (2024-05-02 14:15)
└── Log 3: Accounts recorded payment (2024-05-03 11:45)
```

---

## ⚡ Performance Optimization

```
DATABASE INDEXES:
├── Index on leads.status (fast filtering)
├── Index on projects.status
├── Index on payments.status
├── Index on employees.id
├── Index on attendance.employee_id + date (unique constraint)
└── Index on users.email (fast login lookup)

QUERY OPTIMIZATION:
├── Pre-calculated GST via trigger (no real-time calc)
├── Database views for aggregations (leads_summary, etc)
├── Lazy loading of payment history
├── Pagination on large tables (100 records/page)
└── Search index on lead names

FRONTEND CACHING:
├── Session cached in localStorage (JWT)
├── Component state for filters (don't re-query)
├── Real-time updates via Supabase subscriptions
└── Lazy loading of modules on dashboard
```

---

## 🔄 Update & Scalability

```
WHEN ADDING NEW MODULES (Phase 2):

1. Create new table in database-complete.sql
2. Add RLS policies for security
3. Create new file: src/routes/newmodule.tsx
4. Update dashboard.tsx with navigation card
5. Add useAuth hook for protection
6. Test with all user roles

WHEN CHANGING DATA STRUCTURE:

1. Don't modify existing tables directly
2. Create migration SQL file
3. Test in staging Supabase project first
4. Deploy via SQL Editor
5. Verify with sample queries
6. Update app if schema changes
```

---

**This architecture supports:**
- ✅ 1000+ leads
- ✅ 100+ projects
- ✅ 1000+ payments
- ✅ 100+ employees
- ✅ Multiple concurrent users
- ✅ Real-time data sync
- ✅ Role-based access
- ✅ Complete audit trail
- ✅ Geographic scaling
