import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { fileUrl, fileType, profileId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY not configured");
    }

    console.log("Processing file:", { fileUrl, fileType, profileId });

    // Download file
    const fileResponse = await fetch(fileUrl);
    if (!fileResponse.ok) {
      throw new Error("Failed to download file");
    }

    const fileBlob = await fileResponse.blob();
    const fileText = await fileBlob.text();

    // Extract text based on file type (simplified for now - in production use proper parsers)
    const extractedText = fileText.substring(0, 10000); // Limit to first 10k chars

    // Prepare AI prompt based on file type
    let systemPrompt = "";
    let tools: any[] = [];

    if (fileType === "business_info") {
      systemPrompt = "Extract business information from this document. Focus on locations, services offered, and any programs or special offerings.";
      tools = [
        {
          type: "function",
          function: {
            name: "extract_business_info",
            description: "Extract structured business information",
            parameters: {
              type: "object",
              properties: {
                locations: {
                  type: "array",
                  items: { type: "string" },
                  description: "Business locations (cities/states)",
                },
                services: {
                  type: "array",
                  items: { type: "string" },
                  description: "Services and products offered",
                },
                programs: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      type: { type: "string", enum: ["referral", "loyalty", "membership", "other"] },
                      description: { type: "string" },
                      details: { type: "string" },
                    },
                  },
                },
              },
              required: ["locations", "services"],
            },
          },
        },
      ];
    } else if (fileType === "brand_voice") {
      systemPrompt = "Analyze this brand voice guide and extract tone descriptors, preferred words, and words to avoid.";
      tools = [
        {
          type: "function",
          function: {
            name: "extract_voice_guidelines",
            description: "Extract brand voice and tone guidelines",
            parameters: {
              type: "object",
              properties: {
                voice: {
                  type: "object",
                  properties: {
                    tones: {
                      type: "array",
                      items: { type: "string" },
                      description: "Voice tones (e.g., fun_playful, professional_polished)",
                    },
                    loved_words: {
                      type: "array",
                      items: { type: "string" },
                      description: "Words the brand loves using",
                    },
                    banned_words: {
                      type: "array",
                      items: { type: "string" },
                      description: "Words to avoid",
                    },
                  },
                },
                content_rules: {
                  type: "object",
                  properties: {
                    topics_to_avoid: {
                      type: "array",
                      items: { type: "string" },
                    },
                  },
                },
              },
              required: ["voice"],
            },
          },
        },
      ];
    } else if (fileType === "persona_research") {
      systemPrompt = "Extract customer personas from this research document with detailed demographics, psychographics, and social behavior.";
      tools = [
        {
          type: "function",
          function: {
            name: "extract_personas",
            description: "Extract customer persona profiles",
            parameters: {
              type: "object",
              properties: {
                personas: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      name: { type: "string" },
                      emoji: { type: "string" },
                      description: { type: "string" },
                      demographics: {
                        type: "object",
                        properties: {
                          age_range: { type: "string" },
                          income_level: { type: "string", enum: ["budget", "middle", "high"] },
                          location_types: { type: "array", items: { type: "string" } },
                          family_status: { type: "array", items: { type: "string" } },
                        },
                      },
                      psychographics: {
                        type: "object",
                        properties: {
                          pain_points: { type: "array", items: { type: "string" } },
                          goals: { type: "array", items: { type: "string" } },
                          values: { type: "array", items: { type: "string" } },
                        },
                      },
                      social_behavior: {
                        type: "object",
                        properties: {
                          platforms: { type: "array", items: { type: "string" } },
                          content_types: { type: "array", items: { type: "string" } },
                          best_times: { type: "array", items: { type: "string" } },
                        },
                      },
                      real_example: { type: "string" },
                    },
                    required: ["name", "emoji", "description"],
                  },
                },
              },
              required: ["personas"],
            },
          },
        },
      ];
    }

    // Call Lovable AI with tool calling
    const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: extractedText },
        ],
        tools,
        tool_choice: { type: "function", function: { name: tools[0].function.name } },
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("AI Gateway error:", errorText);
      throw new Error("AI processing failed");
    }

    const aiData = await aiResponse.json();
    console.log("AI Response:", JSON.stringify(aiData));

    // Extract structured data from tool call
    const toolCall = aiData.choices?.[0]?.message?.tool_calls?.[0];
    const suggestions = toolCall ? JSON.parse(toolCall.function.arguments) : {};

    return new Response(JSON.stringify({ suggestions }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error processing file:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to process file";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
