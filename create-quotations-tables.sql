-- Create quotations table
CREATE TABLE IF NOT EXISTS public.quotations (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  lead_id uuid NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  total_sqft decimal(10, 2) NOT NULL,
  rate_per_sqft decimal(10, 2) NOT NULL,
  subtotal decimal(15, 2) NOT NULL,
  gst_percentage decimal(5, 2) NOT NULL DEFAULT 18,
  gst_amount decimal(15, 2) NOT NULL,
  total_with_gst decimal(15, 2) NOT NULL,
  profit_percentage decimal(5, 2) DEFAULT 0,
  notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quotation history table
CREATE TABLE IF NOT EXISTS public.quotation_history (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  quotation_id uuid NOT NULL REFERENCES public.quotations(id) ON DELETE CASCADE,
  field_name varchar(255) NOT NULL,
  old_value text,
  new_value text,
  change_notes text,
  created_by uuid,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_quotations_lead_id ON public.quotations(lead_id);
CREATE INDEX IF NOT EXISTS idx_quotation_history_quotation_id ON public.quotation_history(quotation_id);
CREATE INDEX IF NOT EXISTS idx_quotation_history_created_at ON public.quotation_history(created_at DESC);

-- Add quotation_status column to leads table if not exists
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS quotation_status varchar(50);

-- Add payment_date column to projects table
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS next_payment_date timestamptz;
