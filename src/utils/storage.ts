import { BusinessProfile, PRELOADED_PROFILES } from "@/data/profiles";
import { supabase } from "@/integrations/supabase/client";

const CAMPAIGNS_KEY = "campaign_generator_campaigns";
const CURRENT_PROFILE_KEY = "current_profile_id";

export const saveProfile = async (profile: BusinessProfile): Promise<void> => {
  try {
    const { error } = await supabase
      .from('brand_profiles')
      .upsert({
        id: profile.id,
        business_name: profile.business_name,
        niche: profile.niche || null,
        owner_name: profile.owner_name || null,
        locations: profile.locations || [],
        services: profile.services || [],
        programs: profile.programs as any,
        brand_identity: profile.brand_identity as any,
        voice: profile.voice as any,
        content_rules: profile.content_rules as any,
        business: profile.business as any,
        personas: profile.personas as any,
        audience: profile.audience as any,
      });

    if (error) throw error;
    localStorage.setItem(CURRENT_PROFILE_KEY, profile.id);
  } catch (error) {
    console.error("Error saving profile:", error);
    throw error;
  }
};

export const getProfile = async (id: string): Promise<BusinessProfile | null> => {
  try {
    const { data, error } = await supabase
      .from('brand_profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) throw error;
    return data as unknown as BusinessProfile | null;
  } catch (error) {
    console.error("Error loading profile:", error);
    return null;
  }
};

export const getAllProfiles = async (): Promise<Record<string, BusinessProfile>> => {
  try {
    const { data, error } = await supabase
      .from('brand_profiles')
      .select('*');

    if (error) throw error;

    const profiles: Record<string, BusinessProfile> = {};
    (data || []).forEach((profile: any) => {
      profiles[profile.id] = profile as unknown as BusinessProfile;
    });
    return profiles;
  } catch (error) {
    console.error("Error loading profiles:", error);
    return {};
  }
};

export const getCurrentProfileId = (): string | null => {
  return localStorage.getItem(CURRENT_PROFILE_KEY);
};

export const getCurrentProfile = async (): Promise<BusinessProfile | null> => {
  const currentId = getCurrentProfileId();
  if (currentId) {
    const profile = await getProfile(currentId);
    if (profile) return profile;
  }

  // Fallback: get first available profile or use stack_creamery
  const profiles = await getAllProfiles();
  const profileIds = Object.keys(profiles);

  if (profileIds.length > 0) {
    const firstId = profileIds[0];
    localStorage.setItem(CURRENT_PROFILE_KEY, firstId);
    return profiles[firstId];
  }

  // Last resort: load stack_creamery from preloaded profiles
  const defaultProfile = PRELOADED_PROFILES.stack_creamery;
  await saveProfile(defaultProfile);
  return defaultProfile;
};

export const saveCampaign = (profileId: string, campaign: any) => {
  const campaigns = getAllCampaigns();
  if (!campaigns[profileId]) {
    campaigns[profileId] = [];
  }
  campaigns[profileId].push({
    ...campaign,
    id: Date.now().toString(),
    created_at: new Date().toISOString()
  });
  localStorage.setItem(CAMPAIGNS_KEY, JSON.stringify(campaigns));
  return campaigns[profileId][campaigns[profileId].length - 1].id;
};

export const getCampaign = (campaignId: string): any | null => {
  const campaigns = getAllCampaigns();
  for (const profileCampaigns of Object.values(campaigns)) {
    const found = (profileCampaigns as any[]).find((c: any) => c.id === campaignId);
    if (found) return found;
  }
  return null;
};

export const getAllCampaigns = (): Record<string, any[]> => {
  const stored = localStorage.getItem(CAMPAIGNS_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const getCampaignsByProfile = (profileId: string): any[] => {
  const campaigns = getAllCampaigns();
  return campaigns[profileId] || [];
};

export const clearAllCampaigns = () => {
  localStorage.removeItem(CAMPAIGNS_KEY);
};
