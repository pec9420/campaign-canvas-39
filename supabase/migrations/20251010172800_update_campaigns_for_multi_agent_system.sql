-- Update campaigns table to support multi-agent campaign system
-- This migration transforms the old single-persona schema to the new multi-agent structure

-- Drop old columns that are no longer used
ALTER TABLE campaigns
  DROP COLUMN IF EXISTS persona_id,
  DROP COLUMN IF EXISTS strategy;

-- Rename campaign_goal to goal (more concise)
ALTER TABLE campaigns
  RENAME COLUMN campaign_goal TO goal;

-- Add new JSONB columns for multi-agent workflow
ALTER TABLE campaigns
  ADD COLUMN IF NOT EXISTS persona_strategies JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS content_calendar JSONB DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS generated_copy JSONB DEFAULT '[]'::jsonb;

-- Make target_outcome optional (some campaigns may not have specific outcomes)
ALTER TABLE campaigns
  ALTER COLUMN target_outcome DROP NOT NULL;

-- Update status constraint to include 'approved' status
ALTER TABLE campaigns
  DROP CONSTRAINT IF EXISTS campaigns_status_check;

ALTER TABLE campaigns
  ADD CONSTRAINT campaigns_status_check
  CHECK (status IN ('draft', 'approved', 'archived'));

-- Update default status to 'approved' (campaigns are approved when saved)
ALTER TABLE campaigns
  ALTER COLUMN status SET DEFAULT 'approved';

-- Add comment to explain the schema
COMMENT ON TABLE campaigns IS 'Stores multi-agent generated campaigns with persona strategies, content calendar, and generated copy';
COMMENT ON COLUMN campaigns.persona_strategies IS 'JSONB: Stage 1 output - persona recommendations with emotional strategies';
COMMENT ON COLUMN campaigns.content_calendar IS 'JSONB: Stage 2 output - day-by-day content calendar with journey stages';
COMMENT ON COLUMN campaigns.generated_copy IS 'JSONB: Stage 3 output - array of generated posts with hooks, scripts, hashtags';
