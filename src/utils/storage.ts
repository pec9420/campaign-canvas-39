import { BusinessProfile } from "@/data/profiles";

const STORAGE_KEY = "campaign_generator_profiles";
const CAMPAIGNS_KEY = "campaign_generator_campaigns";

export const saveProfile = (profile: BusinessProfile) => {
  const profiles = getAllProfiles();
  profiles[profile.id] = profile;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(profiles));
};

export const getProfile = (id: string): BusinessProfile | null => {
  const profiles = getAllProfiles();
  return profiles[id] || null;
};

export const getAllProfiles = (): Record<string, BusinessProfile> => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : {};
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
