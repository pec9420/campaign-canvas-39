import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { profile, persona, brief } = await req.json();
    
    if (!profile || !persona || !brief) {
      throw new Error('Missing required parameters: profile, persona, or brief');
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating campaign for:', {
      business: profile.business_name,
      persona: persona.name,
      goal: brief.campaign_goal
    });

    // Build the prompts
    const systemPrompt = buildSystemPrompt();
    const userPrompt = buildUserPrompt(profile, persona, brief);

    // Call Lovable AI Gateway
    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        response_format: { type: "json_object" }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI API error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit exceeded. Please try again in a moment." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Payment required. Please add credits to your workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      
      throw new Error(`AI API request failed: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    const generatedContent = data.choices?.[0]?.message?.content;

    if (!generatedContent) {
      throw new Error("No content generated from AI");
    }

    console.log("Campaign generated successfully");

    // Parse the JSON response
    const campaignStrategy = JSON.parse(generatedContent);

    return new Response(
      JSON.stringify({ strategy: campaignStrategy.strategy }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );

  } catch (error) {
    console.error("Error in generate-campaign:", error);
    return new Response(
      JSON.stringify({
        error: error instanceof Error ? error.message : "An unknown error occurred"
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

function buildSystemPrompt(): string {
  return `You are a social media campaign strategist specializing in small business marketing.

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
}

function buildUserPrompt(profile: any, persona: any, brief: any): string {
  const postCount = calculatePostCount(brief.duration_days);

  return `
BUSINESS CONTEXT:
Business Name: ${profile.business_name}
Locations: ${profile.locations.join(", ")}
What We Offer: ${profile.what_we_offer}
Niche: ${profile.niche}

BRAND VOICE:
Tone: ${profile.voice.tone}
Signature Phrases: ${profile.voice.signature_phrases.join(", ")}
(Use these phrases naturally, don't force them)

TARGET PERSONA:
Name: ${persona.name} ${persona.emoji}
Who They Are: ${persona.who_are_they}
Main Problem/Goal: ${persona.main_problem}
Platforms: ${persona.platforms.join(", ")}
${persona.real_example ? `Real Customer Example: ${persona.real_example}` : ""}

CAMPAIGN BRIEF:
Goal: ${brief.campaign_goal}
Target Outcome: ${brief.target_outcome}
Duration: ${brief.duration_days} days
Start Date: ${new Date().toISOString().split('T')[0]}

REQUIREMENTS:
1. Generate campaign strategy with KPIs for each platform: ${persona.platforms.join(", ")}
2. Create ${postCount} posts per platform (${persona.platforms.length * postCount} total posts)
3. Each post should:
   - Speak directly to ${persona.name}'s problem: "${persona.main_problem}"
   - Reference the location (${profile.locations[0]})
   - Use ${profile.voice.tone} tone
   - Include clear visual directions for content creation
   - Have platform-specific formatting and best practices
4. Mix formats appropriately for each platform
5. Schedule posts strategically across ${brief.duration_days} days

Generate the complete campaign now.`;
}

function calculatePostCount(durationDays: number): number {
  if (durationDays <= 7) return 3;
  if (durationDays <= 14) return 5;
  if (durationDays <= 21) return 7;
  return 10;
}
