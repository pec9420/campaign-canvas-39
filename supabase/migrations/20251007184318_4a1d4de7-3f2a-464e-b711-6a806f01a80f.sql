-- Create brand_profiles table
CREATE TABLE public.brand_profiles (
  id TEXT PRIMARY KEY,
  business_name TEXT NOT NULL,
  niche TEXT,
  owner_name TEXT,
  locations TEXT[] DEFAULT '{}',
  services TEXT[] DEFAULT '{}',
  programs JSONB DEFAULT '[]',
  brand_identity JSONB DEFAULT '{}',
  voice JSONB DEFAULT '{}',
  content_rules JSONB DEFAULT '{}',
  business JSONB DEFAULT '{}',
  personas JSONB DEFAULT '[]',
  audience JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.brand_profiles ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view, insert, update profiles (since no auth yet)
CREATE POLICY "Anyone can view profiles"
  ON public.brand_profiles
  FOR SELECT
  USING (true);

CREATE POLICY "Anyone can insert profiles"
  ON public.brand_profiles
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Anyone can update profiles"
  ON public.brand_profiles
  FOR UPDATE
  USING (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_brand_profiles_updated_at
  BEFORE UPDATE ON public.brand_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();