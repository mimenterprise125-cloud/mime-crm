-- Add missing columns to leads table
ALTER TABLE public.leads
ADD COLUMN IF NOT EXISTS mailing_address text,
ADD COLUMN IF NOT EXISTS preferred_contact_method varchar(50) DEFAULT 'phone';

-- Update quotations table to ensure all fields exist
ALTER TABLE public.quotations
ADD COLUMN IF NOT EXISTS rate_without_gst decimal(15, 2),
ADD COLUMN IF NOT EXISTS status varchar(50) DEFAULT 'ACTIVE';

-- Create payments detailed table if not exists
CREATE TABLE IF NOT EXISTS public.payment_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  payment_id uuid REFERENCES public.payments(id) ON DELETE CASCADE,
  amount_paid decimal(15, 2) NOT NULL,
  payment_date timestamptz NOT NULL DEFAULT now(),
  payment_method varchar(100),
  reference_number varchar(255),
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes for payment history
CREATE INDEX IF NOT EXISTS idx_payment_history_payment_id ON public.payment_history(payment_id);
CREATE INDEX IF NOT EXISTS idx_payment_history_date ON public.payment_history(payment_date DESC);

-- Update projects table with additional fields
ALTER TABLE public.projects
ADD COLUMN IF NOT EXISTS attended boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS completion_percentage integer DEFAULT 0;

-- Create project_updates table if not exists
CREATE TABLE IF NOT EXISTS public.project_status_updates (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  project_id uuid REFERENCES public.projects(id) ON DELETE CASCADE,
  old_status varchar(50),
  new_status varchar(50) NOT NULL,
  updated_by uuid,
  notes text,
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_project_status_updates_project_id ON public.project_status_updates(project_id);
CREATE INDEX IF NOT EXISTS idx_project_status_updates_date ON public.project_status_updates(updated_at DESC);
