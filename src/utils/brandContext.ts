import { BusinessProfile } from "@/data/profiles";

export function buildBrandContext(profile: BusinessProfile): string {
  return `
# BUSINESS PROFILE
Company: ${profile.business_name}
Niche: ${profile.niche}
Owner: ${profile.owner_name}
Locations: ${profile.locations.join(", ")}
Services: ${profile.services.join(", ")}

# BRAND IDENTITY
Colors: ${profile.brand_identity.colors.join(", ")}
Personality: ${profile.brand_identity.personality.join(", ")}
Visual Style: ${profile.brand_identity.visual_style}

# VOICE & TONE
Tones: ${profile.voice.tones.join(", ")}
✅ Use these words: ${profile.voice.loved_words.join(", ")}
❌ NEVER use: ${profile.voice.banned_words.join(", ")}

# CONTENT RULES
${profile.content_rules.show_owner ? "✅" : "❌"} Show owner face
${profile.content_rules.show_staff ? "✅" : "❌"} Show staff
${profile.content_rules.show_customers ? "✅" : "❌"} Show customers
${profile.content_rules.topics_to_avoid.length > 0 ? `Avoid topics: ${profile.content_rules.topics_to_avoid.join(", ")}` : ""}

# TARGET PERSONAS
${profile.personas
  .map(
    (p) => `
${p.emoji} ${p.name}: ${p.description}
Demographics: ${p.demographics.age_range}, ${p.demographics.income_level} income, ${p.demographics.location_types.join("/")}
Pain Points: ${p.psychographics.pain_points.join(", ")}
Goals: ${p.psychographics.goals.join(", ")}
Social Platforms: ${p.social_behavior.platforms.join(", ")}
Content Types: ${p.social_behavior.content_types.join(", ")}
Real Example: ${p.real_example}
`
  )
  .join("\n")}

# PROGRAMS
${profile.programs
  .map(
    (p) => `
- ${p.name} (${p.type}): ${p.description}
  Details: ${p.details}
`
  )
  .join("\n")}

# BUSINESS DETAILS
Price Point: ${profile.business.price_point}
Capacity: ${profile.business.capacity}
Unique Selling Points: ${profile.business.unique_selling_points.join(", ")}
Primary Audience: ${profile.audience.primary.join(", ")}
Platforms: ${profile.audience.platforms.join(", ")}
  `.trim();
}
