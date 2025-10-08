-- Add missing what_we_offer column
ALTER TABLE brand_profiles ADD COLUMN IF NOT EXISTS what_we_offer TEXT;

-- Migrate existing data from services array to what_we_offer
UPDATE brand_profiles 
SET what_we_offer = services[1] 
WHERE what_we_offer IS NULL AND array_length(services, 1) > 0;

-- Restructure voice JSONB to match Brand Hub UI (tone + signature_phrases only)
UPDATE brand_profiles
SET voice = jsonb_build_object(
  'tone', COALESCE(voice->>'tone', (voice->'tones'->>0)),
  'signature_phrases', COALESCE(voice->'loved_words', voice->'signature_phrases', '[]'::jsonb)
)
WHERE voice IS NOT NULL;

-- Drop unused columns not in Brand Hub UI
ALTER TABLE brand_profiles
  DROP COLUMN IF EXISTS services,
  DROP COLUMN IF EXISTS owner_name,
  DROP COLUMN IF EXISTS niche,
  DROP COLUMN IF EXISTS audience,
  DROP COLUMN IF EXISTS programs,
  DROP COLUMN IF EXISTS brand_identity,
  DROP COLUMN IF EXISTS content_rules;