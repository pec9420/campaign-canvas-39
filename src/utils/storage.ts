import { BusinessProfile, PRELOADED_PROFILES } from "@/data/profiles";

const STORAGE_KEY = "campaign_generator_profiles";
const CAMPAIGNS_KEY = "campaign_generator_campaigns";
const CURRENT_PROFILE_KEY = "current_profile_id";

export const saveProfile = (profile: BusinessProfile) => {
  const profiles = getAllProfiles();
  profiles[profile.id] = profile;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
  // Set as current profile
  localStorage.setItem(CURRENT_PROFILE_KEY, profile.id);
};

export const getProfile = (id: string): BusinessProfile | null => {
  const profiles = getAllProfiles();
  return profiles[id] || null;
};

export const getAllProfiles = (): Record<string, BusinessProfile> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
};

export const getCurrentProfileId = (): string | null => {
  return localStorage.getItem(CURRENT_PROFILE_KEY);
};

export const getCurrentProfile = (): BusinessProfile | null => {
  const currentId = getCurrentProfileId();
  if (currentId) {
    return getProfile(currentId);
  }

  // Fallback: get first available profile or use stack_creamery
  const profiles = getAllProfiles();
  const profileIds = Object.keys(profiles);

  if (profileIds.length > 0) {
    const firstId = profileIds[0];
    localStorage.setItem(CURRENT_PROFILE_KEY, firstId);
    return profiles[firstId];
  }

  // Last resort: load stack_creamery from preloaded profiles
  const defaultProfile = PRELOADED_PROFILES.stack_creamery;
  saveProfile(defaultProfile);
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
