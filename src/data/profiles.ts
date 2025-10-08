// Simplified Persona - only essential fields for campaign creation
export interface Persona {
  id: string;
  name: string;              // "Date Night Dani"
  emoji: string;             // 💑
  who_are_they: string;      // "Young couples (25-35) seeking Instagram-worthy date experiences"
  main_problem: string;      // "Want unique date night spots worth posting about"
  platforms: string[];       // ["instagram", "tiktok"] (max 3)
  real_example?: string;     // Optional customer story
}

// Streamlined Business Profile - MVP essentials only
export interface BusinessProfile {
  id: string;
  business_name: string;
  niche: string;

  // Business Basics
  locations: string[];          // ["Springfield, IL", "Chicago, IL"]
  what_we_offer: string;        // Multi-sentence description of services/products

  // Voice & Tone - Simplified
  voice: {
    tone: string;               // Single-select: "fun_playful", "professional_polished", etc.
    signature_phrases: string[]; // ["stack", "drip", "loaded"] (max 5)
  };

  // Target Personas - Multiple allowed, each simplified
  personas: Persona[];

  // File uploads metadata (optional)
  uploaded_files?: {
    business_info?: { name: string; url: string; uploaded_at: string };
    brand_voice?: { name: string; url: string; uploaded_at: string };
    persona_research?: { name: string; url: string; uploaded_at: string };
  };

  reset_on_load?: boolean;
}

export const PRELOADED_PROFILES: Record<string, BusinessProfile> = {
  stack_creamery: {
    id: "stack_creamery",
    business_name: "Stack Creamery",
    niche: "ice_cream_shop",
    locations: ["Springfield, IL"],
    what_we_offer: "Over-the-top ice cream creations with premium toppings and Instagram-worthy presentations. We do in-store sales, event catering, custom flavors, and party bookings. Known for our signature 'Stacks' - towering sundaes that make every visit a celebration.",
    voice: {
      tone: "fun_playful",
      signature_phrases: ["stack it up", "drip", "scoop squad", "loaded", "treat yourself"]
    },
    personas: [
      {
        id: "persona-1",
        name: "Date Night Dani",
        emoji: "💑",
        who_are_they: "Young couples (25-35) seeking Instagram-worthy date night experiences",
        main_problem: "Want unique, photogenic date spots that feel special and worth posting about",
        platforms: ["instagram", "tiktok"],
        real_example: "Alex and Jamie came for their anniversary, ordered the 'Lovers Stack' (strawberry + chocolate), took 20 photos, tagged us in 3 posts. Came back twice that month."
      },
      {
        id: "persona-2",
        name: "Event Planner Emma",
        emoji: "🎉",
        who_are_they: "Event coordinators and party planners booking dessert catering for corporate and private events",
        main_problem: "Need reliable caterer with wow-factor desserts that impress clients and fit budget",
        platforms: ["linkedin", "facebook", "google_business"],
        real_example: "Emma books us for 3-4 company parties per year. Says our ice cream bars always get the most Instagram stories from attendees."
      },
      {
        id: "persona-3",
        name: "Treat Time Tom",
        emoji: "👨‍👧",
        who_are_they: "Parents treating kids after sports/school activities, looking for quick rewards",
        main_problem: "Need affordable, kid-friendly treats that are convenient and nearby",
        platforms: ["facebook", "google_business"],
        real_example: "Tom brings his daughter every Thursday after soccer practice. Knows all the staff by name. Always gets the mini stack."
      }
    ]
  },
  quick_fix_plumbing: {
    id: "quick_fix_plumbing",
    business_name: "Quick Fix Plumbing",
    niche: "plumbing_service",
    locations: ["Denver, CO"],
    what_we_offer: "Fast, reliable plumbing services for homes and businesses. We handle emergency repairs, installations, routine maintenance, and inspections. Same-day service available, upfront pricing, and guaranteed work.",
    voice: {
      tone: "professional_polished",
      signature_phrases: ["fast response", "honest pricing", "done right", "guaranteed"]
    },
    personas: [
      {
        id: "persona-1",
        name: "Fix-It Felix",
        emoji: "🔧",
        who_are_they: "Handy homeowners who usually DIY but hit a problem they can't solve",
        main_problem: "Tried to fix it themselves, made it worse, need a pro ASAP without judgment",
        platforms: ["google_business", "youtube"],
        real_example: "Felix tried replacing a valve himself at 9pm, flooded the bathroom, called us embarrassed. We fixed it in 30 mins, showed him what went wrong, no judgment."
      },
      {
        id: "persona-2",
        name: "Clueless Carla",
        emoji: "🤷‍♀️",
        who_are_they: "New homeowners or renters who know nothing about plumbing systems",
        main_problem: "Something's wrong but has no idea what, worried about being overcharged or talked down to",
        platforms: ["facebook", "nextdoor"],
        real_example: "Carla called worried about her water bill, didn't know what a flapper was. We explained everything in plain English, she became a regular."
      },
      {
        id: "persona-3",
        name: "Property Manager Pete",
        emoji: "🏢",
        who_are_they: "Property managers overseeing 10+ rental units, need reliable go-to plumber",
        main_problem: "Tenant complaints pile up, needs same-day response and transparent billing for owners",
        platforms: ["linkedin", "email"],
        real_example: "Pete manages 15 properties, has us on speed dial. We respond within 2 hours, send detailed invoices to owners, he refers us to other managers."
      }
    ]
  },
  test_user: {
    id: "test_user",
    business_name: "Test Business",
    niche: "test",
    locations: [],
    what_we_offer: "",
    voice: {
      tone: "",
      signature_phrases: []
    },
    personas: [],
    reset_on_load: true
  }
};
