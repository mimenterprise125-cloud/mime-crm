-- ============================================================================
-- MIM CRM COMPLETE DATABASE SCHEMA
-- ============================================================================
-- This file contains all tables, relationships, indexes, and initial data
-- for the MIM CRM system. Run this in Supabase SQL Editor.
-- ============================================================================

-- ============================================================================
-- 1. USERS TABLE (Linked to Supabase Auth)
-- ============================================================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL DEFAULT 'sales' CHECK (role IN ('admin', 'sales', 'operations', 'accounts')),
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 2. LEADS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255),
  location VARCHAR(255),
  project_type VARCHAR(100),
  message TEXT,
  source VARCHAR(50) DEFAULT 'contact_form' CHECK (source IN ('website', 'phone', 'referral', 'social_media', 'contact_form')),
  status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'FOLLOW_UP', 'SITE_VISIT', 'QUOTATION_SENT', 'NEGOTIATION', 'CONVERTED', 'LOST')),
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 3. PROJECTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  name VARCHAR(255),
  total_sqft DECIMAL(10, 2) NOT NULL,
  rate_per_sqft DECIMAL(10, 2) NOT NULL,
  final_amount DECIMAL(15, 2) NOT NULL,
  gst_percentage DECIMAL(5, 2) DEFAULT 18,
  gst_amount DECIMAL(15, 2) DEFAULT 0,
  total_with_gst DECIMAL(15, 2),
  profit_percentage DECIMAL(5, 2),
  expected_completion_date DATE,
  actual_completion_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DELAYED', 'COMPLETED', 'ON_HOLD', 'CANCELLED')),
  delay_reason TEXT,
  new_completion_date DATE,
  assigned_to UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 4. PAYMENTS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('ADVANCE', 'PARTIAL', 'FINAL')),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'DUE', 'PAID', 'OVERDUE')),
  payment_date DATE,
  due_date DATE,
  notes TEXT,
  receipt_url VARCHAR(500),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 5. PROJECT UPDATES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('PROGRESS', 'DELAY', 'COMPLETION')),
  description TEXT NOT NULL,
  old_date DATE,
  new_date DATE,
  delay_reason TEXT,
  images_json JSON,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 6. WHATSAPP LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS whatsapp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  message_type VARCHAR(50),
  sent_by UUID REFERENCES users(id) ON DELETE SET NULL,
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'SENT' CHECK (status IN ('SENT', 'DELIVERED', 'READ', 'FAILED'))
);

-- ============================================================================
-- 7. COMPLETED PROJECTS TABLE (Portfolio)
-- ============================================================================
CREATE TABLE IF NOT EXISTS completed_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  sqft DECIMAL(10, 2),
  description TEXT,
  image_url VARCHAR(500),
  is_published BOOLEAN DEFAULT TRUE,
  display_order INT,
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 8. EMPLOYEES TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL UNIQUE,
  role VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ON_LEAVE')),
  created_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 9. ATTENDANCE TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LEAVE')),
  notes TEXT,
  marked_by UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

-- ============================================================================
-- 10. CONTACTS TABLE (From Contact Form)
-- ============================================================================
CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  message TEXT,
  status VARCHAR(50) DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'CONVERTED')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- 11. AUDIT LOGS TABLE
-- ============================================================================
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  action VARCHAR(50),
  old_values JSON,
  new_values JSON,
  created_at TIMESTAMP DEFAULT NOW()
);

-- ============================================================================
-- CREATE INDEXES FOR PERFORMANCE
-- ============================================================================
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX IF NOT EXISTS idx_leads_created_by ON leads(created_by);
CREATE INDEX IF NOT EXISTS idx_leads_phone ON leads(phone);
CREATE INDEX IF NOT EXISTS idx_projects_lead_id ON projects(lead_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_assigned_to ON projects(assigned_to);
CREATE INDEX IF NOT EXISTS idx_payments_project_id ON payments(project_id);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments(status);
CREATE INDEX IF NOT EXISTS idx_project_updates_project_id ON project_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance(date);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_lead_id ON whatsapp_logs(lead_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON audit_logs(user_id);

-- ============================================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- ============================================================================
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- ============================================================================
-- RLS POLICIES - Leads Table
-- ============================================================================
CREATE POLICY "Users can view leads assigned to them or created by them"
ON leads FOR SELECT
USING (assigned_to = auth.uid() OR created_by = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

CREATE POLICY "Sales can create leads"
ON leads FOR INSERT
WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'sales'));

CREATE POLICY "Users can update their assigned leads"
ON leads FOR UPDATE
USING (assigned_to = auth.uid() OR (SELECT role FROM users WHERE id = auth.uid()) = 'admin');

-- ============================================================================
-- RLS POLICIES - Projects Table
-- ============================================================================
CREATE POLICY "Users can view projects"
ON projects FOR SELECT
USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'operations'));

CREATE POLICY "Operations can create projects"
ON projects FOR INSERT
WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'operations'));

-- ============================================================================
-- RLS POLICIES - Payments Table
-- ============================================================================
CREATE POLICY "Accounts can view payments"
ON payments FOR SELECT
USING ((SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'accounts'));

CREATE POLICY "Accounts can manage payments"
ON payments FOR INSERT
WITH CHECK ((SELECT role FROM users WHERE id = auth.uid()) IN ('admin', 'accounts'));

-- ============================================================================
-- SAMPLE DATA (Remove in production if not needed)
-- ============================================================================
-- NOTE: These are placeholder UUIDs. Replace with actual auth user IDs from Supabase.
-- You can get actual UUIDs from: Supabase Dashboard → Authentication → Users

-- Don't insert sample users here - they should be created via Supabase Auth first
-- Then insert their profiles with: INSERT INTO users (id, email, full_name, phone, role)

-- ============================================================================
-- HELPFUL VIEWS
-- ============================================================================

-- Lead Summary View
CREATE OR REPLACE VIEW leads_summary AS
SELECT 
  l.id,
  l.name,
  l.phone,
  l.status,
  l.created_at,
  u.full_name as assigned_to_name,
  CASE WHEN p.id IS NOT NULL THEN true ELSE false END as has_project
FROM leads l
LEFT JOIN users u ON l.assigned_to = u.id
LEFT JOIN projects p ON l.id = p.lead_id;

-- Project Summary View
CREATE OR REPLACE VIEW projects_summary AS
SELECT 
  p.id,
  p.name,
  l.name as client_name,
  p.final_amount,
  p.status,
  p.expected_completion_date,
  p.created_at,
  COALESCE(SUM(pay.amount), 0) as total_paid,
  p.final_amount - COALESCE(SUM(pay.amount), 0) as remaining_amount
FROM projects p
LEFT JOIN leads l ON p.lead_id = l.id
LEFT JOIN payments pay ON p.id = pay.project_id AND pay.status = 'PAID'
GROUP BY p.id, l.name;

-- Payment Summary View
CREATE OR REPLACE VIEW payments_summary AS
SELECT 
  p.id,
  proj.name as project_name,
  l.name as client_name,
  p.amount,
  p.type,
  p.status,
  p.payment_date,
  p.due_date
FROM payments p
LEFT JOIN projects proj ON p.project_id = proj.id
LEFT JOIN leads l ON proj.lead_id = l.id;

-- ============================================================================
-- FUNCTIONS FOR COMMON OPERATIONS
-- ============================================================================

-- Function to calculate project amounts
CREATE OR REPLACE FUNCTION calculate_project_amount()
RETURNS TRIGGER AS $$
BEGIN
  NEW.final_amount := NEW.total_sqft * NEW.rate_per_sqft;
  IF NEW.gst_percentage > 0 THEN
    NEW.gst_amount := NEW.final_amount * (NEW.gst_percentage / 100);
    NEW.total_with_gst := NEW.final_amount + NEW.gst_amount;
  ELSE
    NEW.gst_amount := 0;
    NEW.total_with_gst := NEW.final_amount;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for project amount calculation
CREATE TRIGGER trigger_calculate_project_amount
BEFORE INSERT OR UPDATE ON projects
FOR EACH ROW
EXECUTE FUNCTION calculate_project_amount();

-- ============================================================================
-- END OF DATABASE SCHEMA
-- ============================================================================
-- Run this entire script in Supabase SQL Editor
-- After running, remember to:
-- 1. Create auth users in Supabase Authentication
-- 2. Insert their profiles in the users table with correct IDs
-- 3. Test login with the created users
-- ============================================================================
