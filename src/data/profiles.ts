export interface BusinessProfile {
  id: string;
  business_name: string;
  niche: string;
  owner_name: string;
  brand_identity: {
    colors: string[];
    personality: string[];
    visual_style: string;
  };
  voice: {
    tone: string;
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
    location: string;
    services: string[];
    price_point: string;
    capacity: string;
    unique_selling_points: string[];
  };
  audience: {
    primary: string[];
    platforms: string[];
  };
  reset_on_load?: boolean;
}

export const PRELOADED_PROFILES: Record<string, BusinessProfile> = {
  stack_creamery: {
    id: "stack_creamery",
    business_name: "Stack Creamery",
    niche: "ice_cream_shop",
    owner_name: "Sarah",
    brand_identity: {
      colors: ["#14B8A6", "#FBBF24", "#EC4899"],
      personality: ["playful", "bold", "nostalgic", "fun"],
      visual_style: "pop_art"
    },
    voice: {
      tone: "fun_and_cheeky",
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
      services: ["In-store sales", "Catering", "Events"],
      price_point: "mid_range",
      capacity: "4 catering events per weekend max",
      unique_selling_points: [
        "Pop-art aesthetic",
        "Local flavor collaborations",
        "Nostalgic vibe"
      ]
    },
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
    brand_identity: {
      colors: ["#1E3A8A", "#F97316", "#FFFFFF"],
      personality: ["reliable", "professional", "friendly", "fast"],
      visual_style: "clean_modern"
    },
    voice: {
      tone: "professional_but_approachable",
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
      services: ["Emergency repairs", "Installations", "Maintenance", "Inspections"],
      price_point: "mid_to_premium",
      capacity: "24/7 emergency service, 5 crews",
      unique_selling_points: [
        "Same-day service",
        "Upfront pricing",
        "Licensed & insured",
        "20+ years experience"
      ]
    },
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
    brand_identity: {
      colors: [],
      personality: [],
      visual_style: ""
    },
    voice: {
      tone: "",
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
      services: [],
      price_point: "",
      capacity: "",
      unique_selling_points: []
    },
    audience: {
      primary: [],
      platforms: []
    },
    reset_on_load: true
  }
};
