# Quotation & Project Management System

## Overview
This system tracks quotations for leads and projects with full change history, automatic calculations, and seamless lead-to-project conversion.

## Features

### 1. Quotation Management (`/quotation`)
**Purpose**: Create and manage quotations for leads

#### Creating a Quotation
1. Select a lead from the "Leads" list (status: QUOTATION_SENT or CONVERTED)
2. Click "Create Quotation"
3. Enter quotation details:
   - **Total SqFt**: Property area
   - **Rate per SqFt**: Price per square foot
   - **GST %**: Tax percentage (default 18%)
   - **Profit %**: Profit margin percentage
   - **Notes**: Additional details

#### Auto-Calculated Fields
- **Subtotal** = Total SqFt × Rate per SqFt
- **GST Amount** = Subtotal × (GST% / 100)
- **Total with GST** = Subtotal + GST Amount

#### Editing Quotation
1. Click "Edit Quotation" button
2. Modify fields as needed
3. Add "Change Notes" to explain the modification
4. Click "Update Quotation"

#### Change History Tracking
- Every edit creates a history record
- Tracks: Old value → New value
- Includes change notes and timestamp
- Visible in the "Change History" section

---

### 2. Projects Management (`/projects-crm`)
**Purpose**: Manage converted leads as projects

#### Project Creation from Converted Leads
1. Click "+ Add Project" button
2. Select a converted lead (status: CONVERTED)
3. Enter project details:
   - **Project Name**: Custom name (auto-generated if empty)
   - **Total SqFt**: Area to be worked on
   - **Rate per SqFt**: Billing rate
   - **Expected Completion Date**: Target delivery date
   - **Next Payment Date**: When next payment is due
   - **GST %**: Tax percentage

#### Project Details View
Each project displays:
- **Project Info**: Name, SqFt, Rate, Amount, Status
- **Quotation Details**: 
  - Subtotal, GST, Total with GST
  - Profit percentage
  - Original notes
- **Change History**: All quotation edits with timestamps

#### Project Status Management
Click the Status dropdown to change:
- **ACTIVE**: Project is in progress
- **DELAYED**: Project is behind schedule
- **COMPLETED**: Project finished
- **ON_HOLD**: Temporarily paused
- **CANCELLED**: Cancelled

---

### 3. Dashboard Updates (`/dashboard`)
**New Sections**:
1. **📅 Next Payment Card**: Shows nearest upcoming payment date
2. **Recent Leads**: Last 5 leads with status
3. **Recent Projects**: Last 5 projects with payment dates

---

## Database Schema

### Quotations Table
```sql
CREATE TABLE quotations (
  id UUID PRIMARY KEY,
  lead_id UUID (references leads),
  total_sqft DECIMAL,
  rate_per_sqft DECIMAL,
  subtotal DECIMAL,
  gst_percentage DECIMAL,
  gst_amount DECIMAL,
  total_with_gst DECIMAL,
  profit_percentage DECIMAL,
  notes TEXT,
  created_by UUID,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
);
```

### Quotation History Table
```sql
CREATE TABLE quotation_history (
  id UUID PRIMARY KEY,
  quotation_id UUID (references quotations),
  field_name VARCHAR(255),
  old_value TEXT,
  new_value TEXT,
  change_notes TEXT,
  created_by UUID,
  created_at TIMESTAMP
);
```

### Projects Table Updates
- Added: `next_payment_date` column
- Used to track upcoming payment schedules

---

## Workflow

### Lead to Project Conversion
1. **Contact Form Submission**
   - Lead created with status: "NEW"
   - Source: "website_contact"

2. **Lead Qualification**
   - Sales team reviews lead
   - Status changed to: "QUOTATION_SENT"

3. **Quotation Creation**
   - Create quotation with area, rate, GST, profit %
   - System auto-calculates totals
   - Lead receives quotation details

4. **Quotation Updates**
   - If client requests changes:
     - Edit quotation
     - Add change notes explaining modifications
     - History records all changes

5. **Lead Conversion**
   - Lead status changed to: "CONVERTED"
   - Create project from converted lead
   - Set payment schedule (next_payment_date)

6. **Project Tracking**
   - View quotation details in project
   - See all quotation change history
   - Update project status as work progresses
   - Track upcoming payment dates

---

## Admin Controls

### Hiding WhatsApp FAB
- WhatsApp icon NOT shown on admin pages:
  - Dashboard (`/dashboard`)
  - Leads (`/leads`)
  - Quotations (`/quotation`)
  - Projects (`/projects-crm`)
  - Payments (`/payments`)
  - Employees (`/employees`)
  - Configurator (`/configurator`)

- WhatsApp icon ONLY shown on public pages:
  - Home (`/`)
  - Products (`/products`)
  - Contact (`/contact`)
  - Projects Gallery (`/projects`)

---

## Tips & Best Practices

### For Sales Team
1. Always add detailed change notes when editing quotations
2. Keep profit percentage realistic (5-15% typical)
3. Update project status regularly
4. Set next payment date when creating projects

### For Management
1. Monitor change history for price negotiations
2. Check dashboard for upcoming payment dates
3. Review profit percentages in quotations
4. Track lead-to-project conversion rates

### Calculations
- **Profit %** is informational only (doesn't affect calculations)
- All amounts are in INR
- GST is automatically added to totals
- Use consistent rate per sqft for all similar projects

---

## Setup Instructions

### SQL Tables Creation
Run the following in Supabase SQL Editor:

```sql
-- See: create-quotations-tables.sql
```

### Required Env Variables
- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`
- `VITE_SUPABASE_SERVICE_ROLE_KEY`

---

## Support

For issues or questions:
1. Check change history to understand quota modifications
2. Verify all calculation fields in quotation
3. Ensure lead status is "CONVERTED" before creating project
4. Confirm next_payment_date is set for projects
