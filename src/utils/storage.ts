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
        locations: profile.locations || [],
        what_we_offer: profile.what_we_offer || null,
        voice: profile.voice as any,
        personas: profile.personas as any,
      }, { onConflict: 'id' });

    if (error) {
      console.error("Supabase error details:", error);
      throw error;
    }
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
    if (!data) return null;

    return data as unknown as BusinessProfile;
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
  console.log("getCurrentProfile: Starting...");
  const currentId = getCurrentProfileId();
  console.log("getCurrentProfile: currentId from localStorage:", currentId);

  if (currentId) {
    const profile = await getProfile(currentId);
    console.log("getCurrentProfile: profile from DB:", profile);
    if (profile) return profile;
  }

  // Fallback: get first available profile or use stack_creamery
  console.log("getCurrentProfile: No current profile, fetching all profiles...");
  const profiles = await getAllProfiles();
  const profileIds = Object.keys(profiles);
  console.log("getCurrentProfile: All profile IDs:", profileIds);

  if (profileIds.length > 0) {
    const firstId = profileIds[0];
    console.log("getCurrentProfile: Using first profile:", firstId);
    localStorage.setItem(CURRENT_PROFILE_KEY, firstId);
    return profiles[firstId];
  }

  // Last resort: load stack_creamery from preloaded profiles
  console.log("getCurrentProfile: No profiles in DB, creating default profile...");
  const defaultProfile = PRELOADED_PROFILES.stack_creamery;
  console.log("getCurrentProfile: Default profile:", defaultProfile);
  await saveProfile(defaultProfile);
  console.log("getCurrentProfile: Default profile saved, returning it");
  return defaultProfile;
};

export const saveCampaign = async (profileId: string, campaign: any): Promise<string> => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .insert({
        profile_id: profileId,
        goal: campaign.goal,
        target_outcome: campaign.target_outcome || null,
        duration_days: campaign.duration_days,
        persona_strategies: campaign.persona_strategies as any,
        content_calendar: campaign.content_calendar as any,
        generated_copy: campaign.generated_copy as any,
        status: campaign.status || 'approved'
      })
      .select()
      .single();

    if (error) {
      console.error("Error saving campaign:", error);
      throw error;
    }

    return data.id;
  } catch (error) {
    console.error("Error saving campaign:", error);
    throw error;
  }
};

export const getCampaign = async (campaignId: string): Promise<any | null> => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('id', campaignId)
      .maybeSingle();

    if (error) {
      console.error("Error loading campaign:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error loading campaign:", error);
    return null;
  }
};

export const getCampaignsByProfile = async (profileId: string): Promise<any[]> => {
  try {
    const { data, error } = await supabase
      .from('campaigns')
      .select('*')
      .eq('profile_id', profileId)
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error loading campaigns:", error);
      throw error;
    }

    return data || [];
  } catch (error) {
    console.error("Error loading campaigns:", error);
    return [];
  }
};
