export interface Program {
  id: string;
  name: string;
  type: 'referral' | 'loyalty' | 'membership' | 'other';
  description: string;
  details: string;
}

export interface Persona {
  id: string;
  name: string;
  emoji: string;
  description: string;
  demographics: {
    age_range: string;
    income_level: 'budget' | 'middle' | 'high';
    location_types: string[];
    family_status: string[];
  };
  psychographics: {
    pain_points: string[];
    goals: string[];
    values: string[];
  };
  social_behavior: {
    platforms: string[];
    content_types: string[];
    best_times: string[];
  };
  real_example: string;
}

export interface BusinessProfile {
  id: string;
  business_name: string;
  niche: string;
  owner_name: string;

  // Business Basics
  locations: string[];
  services: string[];
  programs: Program[];

  brand_identity: {
    colors: string[];
    personality: string[];
    visual_style: string;
  };

  // Voice & Tone - Enhanced
  voice: {
    tones: string[]; // Multiple tone selections
    loved_words: string[];
    banned_words: string[];
  };

  content_rules: {
    show_owner: boolean;
    show_staff: boolean;
    show_customers: boolean;
    topics_to_avoid: string[];
  };

  business: {
    location: string; // Legacy field for backwards compatibility
    price_point: string;
    capacity: string;
    unique_selling_points: string[];
  };

  // Target Personas
  personas: Persona[];

  audience: {
    primary: string[];
    platforms: string[];
  };

  // File uploads metadata
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
    owner_name: "Sarah",
    locations: ["Springfield, IL"],
    services: ["In-store sales", "Catering", "Events", "Custom flavors"],
    programs: [
      {
        id: "referral-1",
        name: "Scoop Squad Referral",
        type: "referral",
        description: "Get $10 off when you refer a friend",
        details: "Both you and your friend get $10 off your next order of $30 or more"
      }
    ],
    brand_identity: {
      colors: ["#14B8A6", "#FBBF24", "#EC4899"],
      personality: ["playful", "bold", "nostalgic", "fun"],
      visual_style: "pop_art"
    },
    voice: {
      tones: ["fun_playful", "warm_friendly"],
      loved_words: ["stack", "drip", "scoop", "loaded"],
      banned_words: ["artisanal", "craft", "gourmet", "elevated"]
    },
    content_rules: {
      show_owner: false,
      show_staff: true,
      show_customers: true,
      topics_to_avoid: []
    },
    business: {
      location: "Springfield, IL",
      price_point: "mid_range",
      capacity: "4 catering events per weekend max",
      unique_selling_points: [
        "Pop-art aesthetic",
        "Local flavor collaborations",
        "Nostalgic vibe"
      ]
    },
    personas: [
      {
        id: "persona-1",
        name: "Date Night Dani",
        emoji: "💑",
        description: "Young couples seeking Instagram-worthy date experiences",
        demographics: {
          age_range: "25-35",
          income_level: "middle",
          location_types: ["urban", "suburban"],
          family_status: ["married", "single"]
        },
        psychographics: {
          pain_points: ["Limited date night options", "Wants to impress partner", "Looking for unique experiences"],
          goals: ["Create memories", "Look good on social media", "Support local businesses"],
          values: ["Authenticity", "Experience over things", "Visual appeal"]
        },
        social_behavior: {
          platforms: ["instagram", "tiktok"],
          content_types: ["video", "behind_scenes", "user_testimonials"],
          best_times: ["evening", "weekends"]
        },
        real_example: "Alex and Jamie came in for their anniversary, ordered the 'Lovers Stack' (strawberry + chocolate), took 20 photos, tagged us in 3 posts. Came back twice in the same month."
      }
    ],
    audience: {
      primary: ["families", "college_students", "event_planners"],
      platforms: ["instagram", "tiktok", "facebook"]
    }
  },
  quick_fix_plumbing: {
    id: "quick_fix_plumbing",
    business_name: "Quick Fix Plumbing",
    niche: "plumbing_service",
    owner_name: "Mike",
    locations: ["Denver, CO"],
    services: ["Emergency repairs", "Installations", "Maintenance", "Inspections"],
    programs: [],
    brand_identity: {
      colors: ["#1E3A8A", "#F97316", "#FFFFFF"],
      personality: ["reliable", "professional", "friendly", "fast"],
      visual_style: "clean_modern"
    },
    voice: {
      tones: ["professional_polished", "warm_friendly"],
      loved_words: ["fast", "reliable", "honest", "guaranteed"],
      banned_words: ["cheap", "discount", "bargain"]
    },
    content_rules: {
      show_owner: true,
      show_staff: true,
      show_customers: true,
      topics_to_avoid: []
    },
    business: {
      location: "Denver, CO",
      price_point: "mid_to_premium",
      capacity: "24/7 emergency service, 5 crews",
      unique_selling_points: [
        "Same-day service",
        "Upfront pricing",
        "Licensed & insured",
        "20+ years experience"
      ]
    },
    personas: [],
    audience: {
      primary: ["homeowners", "property_managers", "small_businesses"],
      platforms: ["facebook", "google_business"]
    }
  },
  test_user: {
    id: "test_user",
    business_name: "Test Business",
    niche: "test",
    owner_name: "Tester",
    locations: [],
    services: [],
    programs: [],
    brand_identity: {
      colors: [],
      personality: [],
      visual_style: ""
    },
    voice: {
      tones: [],
      loved_words: [],
      banned_words: []
    },
    content_rules: {
      show_owner: true,
      show_staff: true,
      show_customers: true,
      topics_to_avoid: []
    },
    business: {
      location: "",
      price_point: "",
      capacity: "",
      unique_selling_points: []
    },
    personas: [],
    audience: {
      primary: [],
      platforms: []
    },
    reset_on_load: true
  }
};
