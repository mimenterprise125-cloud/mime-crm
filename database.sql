-- MIM CRM Database Schema for Supabase

-- 1. Users Table (Auth profiles)
CREATE TABLE users (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email VARCHAR(255) NOT NULL UNIQUE,
  full_name VARCHAR(255) NOT NULL,
  phone VARCHAR(20),
  role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'sales', 'operations', 'accounts')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 2. Leads Table
CREATE TABLE leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  phone VARCHAR(20) NOT NULL UNIQUE,
  email VARCHAR(255),
  location VARCHAR(255),
  project_type VARCHAR(100),
  message TEXT,
  source VARCHAR(50) CHECK (source IN ('website', 'phone', 'referral', 'social_media', 'contact_form')),
  status VARCHAR(50) NOT NULL DEFAULT 'NEW' CHECK (status IN ('NEW', 'CONTACTED', 'FOLLOW_UP', 'SITE_VISIT', 'QUOTATION_SENT', 'NEGOTIATION', 'CONVERTED', 'LOST')),
  assigned_to UUID REFERENCES users(id),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 3. Projects Table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  name VARCHAR(255),
  total_sqft DECIMAL(10, 2) NOT NULL,
  rate_per_sqft DECIMAL(10, 2) NOT NULL,
  final_amount DECIMAL(15, 2) NOT NULL,
  gst_amount DECIMAL(15, 2) DEFAULT 0,
  total_with_gst DECIMAL(15, 2),
  profit_percentage DECIMAL(5, 2),
  expected_completion_date DATE,
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'DELAYED', 'COMPLETED', 'ON_HOLD', 'CANCELLED')),
  delay_reason TEXT,
  new_completion_date DATE,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 4. Payments Table
CREATE TABLE payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  amount DECIMAL(15, 2) NOT NULL,
  type VARCHAR(50) NOT NULL CHECK (type IN ('ADVANCE', 'PARTIAL', 'FINAL')),
  status VARCHAR(50) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'DUE', 'PAID', 'OVERDUE')),
  payment_date DATE,
  notes TEXT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 5. Project Updates Table
CREATE TABLE project_updates (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  type VARCHAR(50) NOT NULL CHECK (type IN ('PROGRESS', 'DELAY', 'COMPLETION')),
  description TEXT NOT NULL,
  old_date DATE,
  new_date DATE,
  delay_reason TEXT,
  images JSON,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW()
);

-- 6. WhatsApp Logs Table
CREATE TABLE whatsapp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
  phone_number VARCHAR(20) NOT NULL,
  message TEXT NOT NULL,
  message_type VARCHAR(50),
  sent_by UUID REFERENCES users(id),
  sent_at TIMESTAMP DEFAULT NOW(),
  status VARCHAR(50) DEFAULT 'SENT'
);

-- 7. Completed Projects (Portfolio) Table
CREATE TABLE completed_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES projects(id),
  name VARCHAR(255) NOT NULL,
  location VARCHAR(255),
  sqft DECIMAL(10, 2),
  description TEXT,
  image_url VARCHAR(500),
  is_published BOOLEAN DEFAULT TRUE,
  display_order INT,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 8. Employees Table
CREATE TABLE employees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20) NOT NULL UNIQUE,
  role VARCHAR(100),
  status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'INACTIVE', 'ON_LEAVE')),
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- 9. Attendance Table
CREATE TABLE attendance (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  employee_id UUID NOT NULL REFERENCES employees(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('PRESENT', 'ABSENT', 'LEAVE')),
  notes TEXT,
  marked_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(employee_id, date)
);

-- 10. Audit Logs Table
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  entity_type VARCHAR(50),
  entity_id UUID,
  action VARCHAR(50),
  old_values JSON,
  new_values JSON,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create Indexes for performance
CREATE INDEX idx_leads_status ON leads(status);
CREATE INDEX idx_leads_assigned_to ON leads(assigned_to);
CREATE INDEX idx_projects_lead_id ON projects(lead_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_payments_project_id ON payments(project_id);
CREATE INDEX idx_payments_status ON payments(status);
CREATE INDEX idx_attendance_employee_id ON attendance(employee_id);
CREATE INDEX idx_attendance_date ON attendance(date);
CREATE INDEX idx_whatsapp_logs_lead_id ON whatsapp_logs(lead_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);

-- Create sample users for testing
INSERT INTO users (id, email, full_name, phone, role) VALUES
('00000000-0000-0000-0000-000000000001'::uuid, 'admin@mim.com', 'Admin User', '+91 98765 43210', 'admin'),
('00000000-0000-0000-0000-000000000002'::uuid, 'sales@mim.com', 'Sales Manager', '+91 98765 43211', 'sales'),
('00000000-0000-0000-0000-000000000003'::uuid, 'operations@mim.com', 'Operations Head', '+91 98765 43212', 'operations'),
('00000000-0000-0000-0000-000000000004'::uuid, 'accounts@mim.com', 'Accounts Manager', '+91 98765 43213', 'accounts');

-- Enable RLS (Row Level Security) for security
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE attendance ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view leads assigned to them or created by them"
ON leads FOR SELECT
USING (assigned_to = auth.uid() OR created_by = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view projects they created"
ON projects FOR SELECT
USING (created_by = auth.uid() OR auth.jwt() ->> 'role' = 'admin');

CREATE POLICY "Users can view payments they created"
ON payments FOR SELECT
USING (created_by = auth.uid() OR auth.jwt() ->> 'role' = 'admin');
