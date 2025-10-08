-- Create campaigns table
CREATE TABLE public.campaigns (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id TEXT NOT NULL REFERENCES brand_profiles(id) ON DELETE CASCADE,
  persona_id TEXT NOT NULL,
  
  -- Campaign brief
  campaign_goal TEXT NOT NULL,
  target_outcome TEXT NOT NULL,
  duration_days INTEGER NOT NULL DEFAULT 14,
  
  -- AI-generated strategy (stored as JSONB)
  strategy JSONB NOT NULL DEFAULT '{}'::jsonb,
  
  -- Status tracking
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'in_progress', 'completed', 'archived')),
  
  -- Timestamps
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.campaigns ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust later based on auth requirements)
CREATE POLICY "Anyone can view campaigns" ON public.campaigns
  FOR SELECT USING (true);

CREATE POLICY "Anyone can create campaigns" ON public.campaigns
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update campaigns" ON public.campaigns
  FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete campaigns" ON public.campaigns
  FOR DELETE USING (true);

-- Create index for faster profile lookups
CREATE INDEX idx_campaigns_profile_id ON public.campaigns(profile_id);

-- Create trigger for updating updated_at
CREATE TRIGGER update_campaigns_updated_at
  BEFORE UPDATE ON public.campaigns
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();