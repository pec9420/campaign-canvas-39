-- Create brand_hub_uploads table for file metadata
CREATE TABLE IF NOT EXISTS public.brand_hub_uploads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id TEXT NOT NULL,
  file_type TEXT NOT NULL CHECK (file_type IN ('business_info', 'brand_voice', 'persona_research')),
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  extracted_text TEXT,
  uploaded_at TIMESTAMPTZ DEFAULT NOW(),
  file_size BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.brand_hub_uploads ENABLE ROW LEVEL SECURITY;

-- Policy: Public access for now (localStorage-based profiles)
CREATE POLICY "Anyone can view uploads"
  ON public.brand_hub_uploads FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert uploads"
  ON public.brand_hub_uploads FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can delete uploads"
  ON public.brand_hub_uploads FOR DELETE
  USING (true);

-- Index for faster queries by profile_id
CREATE INDEX IF NOT EXISTS idx_brand_hub_uploads_profile_id ON public.brand_hub_uploads(profile_id);

-- Create storage bucket for brand hub files
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-hub-files', 'brand-hub-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies - public bucket
CREATE POLICY "Anyone can upload files"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'brand-hub-files');

CREATE POLICY "Anyone can view files"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'brand-hub-files');

CREATE POLICY "Anyone can delete files"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'brand-hub-files');