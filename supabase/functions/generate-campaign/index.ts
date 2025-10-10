import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================================================
// MAIN HANDLER - Routes to different stages
// ============================================================================

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { stage, profile, brief, approvedStrategies, postStrategy, persona } = body;

    const ANTHROPIC_API_KEY = Deno.env.get('ANTHROPIC_API_KEY');
    if (!ANTHROPIC_API_KEY) {
      throw new Error('ANTHROPIC_API_KEY is not configured');
    }

    // Route to appropriate stage handler
    switch (stage) {
      case 'persona_strategy':
        return await handlePersonaStrategy(profile, brief, ANTHROPIC_API_KEY);

      case 'content_calendar':
        return await handleContentCalendar(profile, brief, approvedStrategies, ANTHROPIC_API_KEY);

      case 'copywriter':
        return await handleCopywriter(profile, persona, postStrategy, ANTHROPIC_API_KEY);

      default:
        throw new Error('Invalid stage parameter. Must be: persona_strategy, content_calendar, or copywriter');
    }

  } catch (error) {
    console.error("Error in generate-campaign:", error);

    // Return detailed error for debugging
    const errorMessage = error instanceof Error ? error.message : "An unknown error occurred";
    const errorStack = error instanceof Error ? error.stack : "";

    return new Response(
      JSON.stringify({
        error: errorMessage,
        details: errorStack,
        timestamp: new Date().toISOString()
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

// ============================================================================
// STAGE 1: PERSONA STRATEGY GENERATION
// ============================================================================

async function handlePersonaStrategy(profile: any, brief: any, apiKey: string) {
  if (!profile || !brief) {
    throw new Error('Missing required parameters: profile or brief');
  }

  console.log('Stage 1: Generating persona strategies for:', {
    business: profile.business_name,
    goal: brief.campaign_goal
  });

  const systemPrompt = getPersonaStrategySystemPrompt();
  const userPrompt = buildPersonaStrategyPrompt(profile, brief);

  const result = await callAI(systemPrompt, userPrompt, apiKey);

  console.log("Persona strategies generated successfully");
  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

function getPersonaStrategySystemPrompt(): string {
  return `You are a Campaign Strategy Agent for small business marketing.

Your task: Analyze the business goal and recommend which customer personas to target, with what messages, emotions, and actions.

IMPORTANT: You MUST return ONLY valid JSON. Do not include any explanatory text before or after the JSON. Do not wrap the JSON in markdown code blocks.

CRITICAL CONTEXT: Business owners think in terms of business goals ("get more weekend customers"), NOT personas. Your job is to:
1. Analyze their business goal
2. Review their customer personas
3. Determine which personas would care about THIS specific goal
4. Explain WHY each persona matters
5. Define emotional strategy and desired actions for each

ENGAGEMENT ACTION HIERARCHY (prioritize high-intent actions):

HIGH INTENT ACTIONS (strong conversion signals):
- link_clicks: Website, menu, booking pages
- saves: Bookmarking for later (planning behavior)
- shares_to_specific_person: Coordinating with friend/partner/family
- dm_questions: Active inquiry about details
- comment_questions: Asking about price, hours, location, availability

MEDIUM INTENT ACTIONS (interest signals):
- shares_general: Broadcasting to audience
- story_replies: Casual engagement
- comments_social: Non-question engagement
- profile_visits: Browsing behavior

LOW INTENT ACTIONS (vanity metrics - avoid):
- likes_only: Passive acknowledgment
- views_without_action: Scrolling past
- emoji_comments: Low-effort engagement

Return JSON with this EXACT structure:
{
  "campaign_goal": "Restate the business goal clearly",
  "persona_strategies": [
    {
      "persona_name": "Name from their profile",
      "persona_emoji": "Emoji from profile",
      "why_target_them": "Specific reason THIS persona cares about THIS goal (not generic)",
      "key_message": "One sentence core message tailored to this persona",
      "desired_emotion": "Primary emotion to evoke: curiosity | FOMO | excitement | trust | urgency | anticipation | delight",
      "emotional_driver": "Deep reason why this emotion works for this persona's psychology",
      "immediate_action": "Specific action: save_post | share_with_friend | click_link | dm_question | comment_details | tag_someone",
      "action_intent_level": "high | medium | low",
      "platforms": ["platform1", "platform2"],
      "expected_outcome": "Concrete business result (e.g., '20-30 couples, weekend evening traffic 6-10pm')"
    }
  ],
  "strategy_summary": "2-3 sentences explaining why this multi-persona approach achieves the business goal"
}

GUIDELINES:
- Only recommend personas that are GENUINELY RELEVANT to this goal
- If a persona doesn't fit, don't force it
- Be ultra-specific: "Date Night Dani wants Instagram moments" not "young people like social media"
- Match emotions to persona's main_problem
- Choose immediate_action based on intent level needed
- Explain expected_outcome in business terms (customers, bookings, traffic timing)
- Use natural language, not marketing jargon
- If persona has real_example, reference it in strategy`;
}

function buildPersonaStrategyPrompt(profile: any, brief: any): string {
  const personasDescription = profile.personas?.map((p: any) => `
  - ${p.emoji} ${p.name}
    Who: ${p.who_are_they}
    Main Problem: ${p.main_problem}
    Platforms: ${p.platforms?.join(", ")}
    ${p.real_example ? `Real Example: ${p.real_example}` : ""}
  `).join("\n") || "No personas defined";

  return `
BUSINESS PROFILE:
Business Name: ${profile.business_name}
Locations: ${profile.locations?.join(", ") || "N/A"}
What We Offer: ${profile.what_we_offer || "Not specified"}

BRAND VOICE:
Tone: ${profile.voice?.tone || "Professional"}
Signature Phrases: ${profile.voice?.signature_phrases?.join(", ") || "N/A"}

CUSTOMER PERSONAS:
${personasDescription}

BUSINESS GOAL:
${brief.campaign_goal}
${brief.target_outcome ? `Desired Outcome: ${brief.target_outcome}` : ""}
Duration: ${brief.duration_days} days

TASK:
Analyze this business goal and determine which personas should be targeted and how.
For EACH relevant persona, define the emotional strategy and desired actions.
Return the JSON structure specified in your system prompt.`;
}

// ============================================================================
// STAGE 2: CONTENT CALENDAR GENERATION
// ============================================================================

async function handleContentCalendar(profile: any, brief: any, approvedStrategies: any, apiKey: string) {
  if (!profile || !brief || !approvedStrategies) {
    throw new Error('Missing required parameters: profile, brief, or approvedStrategies');
  }

  console.log('Stage 2: Generating content calendar for:', {
    business: profile.business_name,
    personas: approvedStrategies.persona_strategies?.map((ps: any) => ps.persona_name)
  });

  const systemPrompt = getContentCalendarSystemPrompt();
  const userPrompt = buildContentCalendarPrompt(profile, approvedStrategies, brief);

  const result = await callAI(systemPrompt, userPrompt, apiKey);

  console.log("Content calendar generated successfully");
  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

function getContentCalendarSystemPrompt(): string {
  return `You are a Campaign Strategy Agent creating detailed content calendars.

IMPORTANT: You MUST return ONLY valid JSON. Do not include any explanatory text before or after the JSON. Do not wrap the JSON in markdown code blocks.

You've received approved persona strategies from Stage 1 (target audiences, emotions, actions).
Now create a day-by-day content strategy that orchestrates the customer journey.

CONTENT STRATEGY PRINCIPLES:

JOURNEY STAGES (distribute posts across campaign):
- AWARENESS (Days 1-40%): Introduce solution, create curiosity/FOMO
  → Target actions: save_post, share_with_friend, tag_someone
- CONSIDERATION (Days 40-70%): Build trust, provide social proof
  → Target actions: comment_questions, dm_inquiry, save_for_later
- CONVERSION (Days 70-100%): Create urgency, drive action
  → Target actions: click_link, dm_to_book, call_now

TIMING STRATEGY:
- Match post timing to persona behavior (parents: afternoon, couples: evening)
- Build momentum: awareness → consideration → conversion
- Don't cluster same persona back-to-back (give breathing room)

ENGAGEMENT FOCUS:
- Prioritize HIGH INTENT actions (saves, shares, clicks) over vanity metrics
- Each post must have clear immediate_action goal
- Explain WHY this action matters for conversion

Return JSON with this EXACT structure:
{
  "content_calendar": {
    "overview": {
      "total_posts": number,
      "platform_breakdown": {"instagram": 5, "facebook": 3, ...},
      "flow": "Brief description of awareness → consideration → conversion flow"
    },
    "posts": [
      {
        "day": number,
        "post_id": "P1",
        "time_of_day": "7:00 PM",

        "target_persona": "Persona name from Stage 1",
        "platform": "instagram|tiktok|facebook|linkedin|google_business|nextdoor",
        "format": "reel|carousel|single_image|story",

        "desired_emotion": "Emotion from Stage 1 strategy",
        "emotional_hook": "How to evoke this emotion in THIS specific post",

        "immediate_action": "Action from Stage 1 strategy",
        "action_intent_level": "high|medium|low",
        "engagement_goal": "Specific target (e.g., '100+ saves')",
        "why_this_action": "Why this action matters for conversion path",

        "journey_stage": "awareness|consideration|conversion",
        "content_direction": "Strategic direction - WHAT to show and WHY (not HOW to execute)",
        "key_message": "Core message for this post",

        "cta_goal": "What the call-to-action should drive",
        "cta_rationale": "Why this CTA at this stage",

        "primary_metric": "Main success metric",
        "secondary_metrics": ["additional metrics to track"],
        "vanity_metrics_ignore": ["metrics to ignore"]
      }
    ]
  }
}

GUIDELINES:
- Distribute posts across approved personas and their platforms
- Follow journey progression: awareness → consideration → conversion
- Match desired_emotion and immediate_action from Stage 1
- Time posts strategically based on persona behavior
- Content_direction = strategic intent (WHAT/WHY), not creative execution (HOW)
- Each post must advance the customer journey
- Avoid repetitive formats or messages
- Mix formats: 40% video/reels, 30% carousels, 20% images, 10% stories`;
}

function buildContentCalendarPrompt(profile: any, approvedStrategies: any, brief: any): string {
  const postCount = calculatePostCount(brief.duration_days);
  const totalPosts = approvedStrategies.persona_strategies.length * postCount;

  const strategiesDescription = approvedStrategies.persona_strategies.map((ps: any) => `
  ${ps.persona_emoji} ${ps.persona_name}:
  - Key Message: ${ps.key_message}
  - Desired Emotion: ${ps.desired_emotion}
  - Immediate Action: ${ps.immediate_action} (${ps.action_intent_level} intent)
  - Platforms: ${ps.platforms.join(", ")}
  - Expected Outcome: ${ps.expected_outcome}
  `).join("\n");

  return `
BUSINESS PROFILE:
Business Name: ${profile.business_name}
Locations: ${profile.locations?.join(", ") || "N/A"}
Brand Voice Tone: ${profile.voice?.tone || "Professional"}
Signature Phrases: ${profile.voice?.signature_phrases?.join(", ") || "N/A"}

CAMPAIGN DETAILS:
Goal: ${approvedStrategies.campaign_goal}
Duration: ${brief.duration_days} days
Start Date: ${new Date().toISOString().split('T')[0]}

APPROVED PERSONA STRATEGIES:
${strategiesDescription}

TASK:
Create a ${brief.duration_days}-day content calendar with approximately ${totalPosts} posts total.
Distribute posts across personas and platforms strategically.
Follow the journey stages: awareness → consideration → conversion.
Use the emotions, actions, and platforms from the approved strategies above.

Return the JSON structure specified in your system prompt.`;
}

// ============================================================================
// STAGE 3: COPYWRITER (SIMPLE MVP VERSION)
// ============================================================================

async function handleCopywriter(profile: any, persona: any, postStrategy: any, apiKey: string) {
  if (!profile || !persona || !postStrategy) {
    throw new Error('Missing required parameters: profile, persona, or postStrategy');
  }

  console.log('Stage 3: Generating copy for:', {
    business: profile.business_name,
    persona: persona.name,
    platform: postStrategy.platform
  });

  const systemPrompt = getCopywriterSystemPrompt();
  const userPrompt = buildCopywriterPrompt(profile, persona, postStrategy);

  const result = await callAI(systemPrompt, userPrompt, apiKey);

  console.log("Copy generated successfully");
  return new Response(
    JSON.stringify(result),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } }
  );
}

function getCopywriterSystemPrompt(): string {
  return `You are a Copywriter Agent who writes natural, human-sounding social media copy.

IMPORTANT: You MUST return ONLY valid JSON. Do not include any explanatory text before or after the JSON. Do not wrap the JSON in markdown code blocks.

Your goal: Write copy that sounds like a PERSON talking, not a polished marketing message.

NATURAL CADENCE RULES:
✅ Write like texting a friend, not writing ad copy
✅ Use conversational fillers naturally ("like", "literally", "okay but", "wait", "anyway")
✅ Lowercase is fine if it fits the vibe (check brand voice tone)
✅ Incomplete sentences are GOOD
✅ Vary sentence length dramatically (short. long rambling sentence. short.)
✅ Use signature phrases as if person actually talks that way
✅ Can break grammar rules for authentic voice

❌ NEVER use: "Elevate", "Unlock", "Imagine this", "Picture this", "Ready to [verb]"
❌ NO buzzword soup: "next level", "game-changer", "transform your"
❌ Don't be overly enthusiastic with emojis (1-3 max, placed naturally)
❌ Avoid formulaic structures (not everything needs to be "3 tips" or "3 reasons")

Return JSON with this EXACT structure:
{
  "hook": "Opening line (casual, conversational)",
  "script": "Full caption with natural line breaks and minimal emojis",
  "hashtags": ["hashtag1", "hashtag2", "hashtag3"],
  "visual_direction": "Brief description of what to show visually"
}

Match the brand voice tone but keep it conversational.
Reference location and persona's problem naturally.
Use signature phrases without forcing them.
Make it sound like a human wrote it.`;
}

function buildCopywriterPrompt(profile: any, persona: any, postStrategy: any): string {
  return `
BUSINESS CONTEXT:
Business: ${profile.business_name}
Location: ${profile.locations?.[0] || "N/A"}
Voice Tone: ${profile.voice?.tone || "Professional"}
Signature Phrases: ${profile.voice?.signature_phrases?.join(", ") || "None"}

TARGET PERSONA:
${persona.emoji} ${persona.name}
Who: ${persona.who_are_they}
Problem: ${persona.main_problem}
${persona.real_example ? `Real Example: ${persona.real_example}` : ""}

POST STRATEGY:
Platform: ${postStrategy.platform}
Format: ${postStrategy.format}
Desired Emotion: ${postStrategy.desired_emotion}
Emotional Hook: ${postStrategy.emotional_hook}
Content Direction: ${postStrategy.content_direction}
Key Message: ${postStrategy.key_message}
CTA Goal: ${postStrategy.cta_goal}
Immediate Action: ${postStrategy.immediate_action}

TASK:
Write natural, conversational copy for this ${postStrategy.platform} ${postStrategy.format}.
Sound like a human, not a marketing bot.
Evoke ${postStrategy.desired_emotion} emotion.
Drive ${postStrategy.immediate_action} action.

Return JSON as specified in your system prompt.`;
}

// ============================================================================
// SHARED AI CALL UTILITY
// ============================================================================

async function callAI(systemPrompt: string, userPrompt: string, apiKey: string) {
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "claude-3-5-sonnet-20241022",
      max_tokens: 4096,
      system: systemPrompt,
      messages: [
        {
          role: "user",
          content: userPrompt
        }
      ]
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    console.error("Claude API error:", response.status, errorText);

    if (response.status === 429) {
      throw new Error("Rate limit exceeded. Please try again in a moment.");
    }

    if (response.status === 401) {
      throw new Error("Invalid API key. Please check your ANTHROPIC_API_KEY.");
    }

    throw new Error(`Claude API request failed: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const generatedContent = data.content?.[0]?.text;

  if (!generatedContent) {
    throw new Error("No content generated from Claude");
  }

  // Parse JSON from Claude's response
  // Claude may wrap JSON in markdown code blocks, so we need to extract it
  let jsonText = generatedContent.trim();

  // Remove markdown code blocks if present
  if (jsonText.startsWith('```json')) {
    jsonText = jsonText.replace(/^```json\n/, '').replace(/\n```$/, '');
  } else if (jsonText.startsWith('```')) {
    jsonText = jsonText.replace(/^```\n/, '').replace(/\n```$/, '');
  }

  return JSON.parse(jsonText);
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function calculatePostCount(durationDays: number): number {
  if (durationDays <= 7) return 3;
  if (durationDays <= 14) return 5;
  if (durationDays <= 21) return 7;
  return 10;
}
