import { BusinessProfile, Persona } from "@/data/profiles";

export interface CampaignBrief {
  campaign_goal: string;
  target_outcome: string;
  duration_days: number;
}

export const CAMPAIGN_SYSTEM_PROMPT = `You are a social media campaign strategist specializing in small business marketing.

Your task is to generate a detailed, actionable campaign plan based on the business profile and target persona provided.

Return a JSON object with this EXACT structure:
{
  "strategy": {
    "overview": {
      "title": "Campaign title",
      "objective": "SMART objective (Specific, Measurable, Achievable, Relevant, Time-bound)",
      "target_audience": "Specific audience description",
      "start_date": "YYYY-MM-DD",
      "end_date": "YYYY-MM-DD",
      "metrics": ["metric1", "metric2", "metric3"]
    },
    "kpis_by_platform": {
      "platform_name": { 
        "reach": "10,000+", 
        "engagement_rate": "4%+", 
        "conversions": "200+" 
      }
    },
    "posts": [
      {
        "day": 1,
        "platform": "instagram|tiktok|facebook|linkedin|google_business|nextdoor",
        "format": "reel|carousel|single_image|story",
        "hook": "First 3 seconds that grab attention",
        "script": "Full post caption/script with line breaks and emojis",
        "visual_direction": "Detailed description for designer/photographer/videographer",
        "cta": "Clear call to action",
        "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
        "kpi": "Expected metric for this specific post"
      }
    ]
  }
}

Important guidelines:
- Use the business's signature phrases naturally in scripts
- Match the specified brand voice/tone in all copy
- Make content hyper-specific to the location and persona
- Reference the persona's main problem in hooks
- Mix post formats: 40% video/reels, 30% carousels, 20% images, 10% stories
- Include 3-5 posts per platform based on campaign duration
- Make each post unique and valuable on its own`;

export const buildCampaignUserPrompt = (
  profile: BusinessProfile,
  persona: Persona,
  brief: CampaignBrief
): string => {
  const postCount = calculatePostCount(brief.duration_days);

  return `
BUSINESS CONTEXT:
Business Name: ${profile.business_name}
Locations: ${profile.locations?.join(", ") || "N/A"}
What We Offer: ${profile.what_we_offer || "Not specified"}

BRAND VOICE:
Tone: ${profile.voice?.tone || "Professional"}
Signature Phrases: ${profile.voice?.signature_phrases?.join(", ") || "N/A"}
(Use these phrases naturally, don't force them)

TARGET PERSONA:
Name: ${persona.name} ${persona.emoji}
Who They Are: ${persona.who_are_they}
Main Problem/Goal: ${persona.main_problem}
Platforms: ${persona.platforms?.join(", ") || "N/A"}
${persona.real_example ? `Real Customer Example: ${persona.real_example}` : ""}

CAMPAIGN BRIEF:
Goal: ${brief.campaign_goal}
Target Outcome: ${brief.target_outcome}
Duration: ${brief.duration_days} days
Start Date: ${new Date().toISOString().split('T')[0]}

REQUIREMENTS:
1. Generate campaign strategy with KPIs for each platform: ${persona.platforms?.join(", ") || "N/A"}
2. Create ${postCount} posts per platform (${(persona.platforms?.length || 1) * postCount} total posts)
3. Each post should:
   - Speak directly to ${persona.name}'s problem: "${persona.main_problem}"
   - Reference the location (${profile.locations?.[0] || "your area"})
   - Use ${profile.voice?.tone || "professional"} tone
   - Include clear visual directions for content creation
   - Have platform-specific formatting and best practices
4. Mix formats appropriately for each platform
5. Schedule posts strategically across ${brief.duration_days} days

Generate the complete campaign now.`;
};

function calculatePostCount(durationDays: number): number {
  if (durationDays <= 7) return 3;
  if (durationDays <= 14) return 5;
  if (durationDays <= 21) return 7;
  return 10;
}
