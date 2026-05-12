-- ============================================================================
-- FIX 1: Disable RLS on leads table to allow website contact form submissions
-- ============================================================================
ALTER TABLE leads DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- FIX 2: Update the source constraint to include 'website_contact'
-- ============================================================================
-- Drop the old check constraint
ALTER TABLE leads DROP CONSTRAINT leads_source_check;

-- Add new constraint with 'website_contact' included
ALTER TABLE leads ADD CONSTRAINT leads_source_check 
CHECK (source IN ('website', 'website_contact', 'phone', 'referral', 'social_media', 'contact_form', 'manual_entry', 'call'));

-- ============================================================================
-- FIX 3: Disable RLS on other tables if needed
-- ============================================================================
ALTER TABLE projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE payments DISABLE ROW LEVEL SECURITY;
ALTER TABLE employees DISABLE ROW LEVEL SECURITY;
ALTER TABLE attendance DISABLE ROW LEVEL SECURITY;
ALTER TABLE project_updates DISABLE ROW LEVEL SECURITY;
ALTER TABLE whatsapp_logs DISABLE ROW LEVEL SECURITY;
ALTER TABLE completed_projects DISABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs DISABLE ROW LEVEL SECURITY;
