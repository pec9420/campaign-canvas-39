import { useNavigate } from "react-router-dom";
import { Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PRELOADED_PROFILES } from "@/data/profiles";
import { saveProfile, getProfile } from "@/utils/storage";
import { useState } from "react";

const Landing = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);

  const handleSelectUser = async (profileId: string) => {
    const profile = PRELOADED_PROFILES[profileId];
    console.log("Landing - Selected user:", profileId, "Profile:", profile);

    if (profile.reset_on_load) {
      // Test user always starts fresh
      await saveProfile(profile);
      console.log("Landing - Navigating to onboarding with profileId:", profileId);
      navigate("/onboarding", { state: { profileId } });
      return;
    }

    // Only seed the default profile if it doesn't exist yet
    const existing = await getProfile(profileId);
    if (!existing) {
      await saveProfile(profile);
    } else {
      // Just switch context to the existing profile without overwriting it
      localStorage.setItem("current_profile_id", profileId);
    }

    console.log("Landing - Navigating to dashboard with profileId:", profileId);
    navigate("/dashboard", { state: { profileId } });
  };

  const handleNewBusiness = () => {
    navigate("/onboarding");
  };

  const users = [
    {
      id: "stack_creamery",
      icon: "🍦",
      name: "Stack Creamery",
      type: "Ice Cream Shop",
      location: "Springfield, IL"
    },
    {
      id: "quick_fix_plumbing",
      icon: "🔧",
      name: "Quick Fix Plumbing",
      type: "Plumbing Service",
      location: "Denver, CO"
    },
    {
      id: "test_user",
      icon: "🧪",
      name: "Test User",
      type: "Development",
      location: "Always starts fresh"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-6xl">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-foreground mb-4">
            Campaign Canvas
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            AI-powered social media campaigns for small businesses
          </p>
        </div>

        {/* Business Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {users.map((user) => (
            <Card
              key={user.id}
              onMouseEnter={() => setHoveredCard(user.id)}
              onMouseLeave={() => setHoveredCard(null)}
              className="relative group cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-card border-border overflow-hidden"
              onClick={() => handleSelectUser(user.id)}
            >
              <div className="p-8">
                <div className="flex flex-col items-center text-center space-y-4">
                  {/* Large Icon */}
                  <div className="text-6xl mb-2">
                    {user.icon}
                  </div>

                  {/* Business Info */}
                  <div>
                    <h3 className="text-xl font-bold text-card-foreground mb-1">
                      {user.name}
                    </h3>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      {user.type}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {user.location}
                    </p>
                  </div>
                </div>

                {/* Hover Button */}
                {hoveredCard === user.id && (
                  <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-card to-transparent">
                    <Button className="w-full bg-primary hover:bg-primary/90">
                      Continue Campaign
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>

        {/* Create New Business Card */}
        <div className="flex justify-center">
          <Card
            onClick={handleNewBusiness}
            onMouseEnter={() => setHoveredCard('new')}
            onMouseLeave={() => setHoveredCard(null)}
            className="w-full max-w-md cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl bg-card border-dashed border-2 border-primary/30 hover:border-primary/60 relative group overflow-hidden"
          >
            <div className="p-8">
              <div className="flex flex-col items-center text-center space-y-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Plus className="w-8 h-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-card-foreground mb-1">
                    Create New Business
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Start fresh with your own business profile
                  </p>
                </div>
              </div>

              {/* Hover Button */}
              {hoveredCard === 'new' && (
                <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-card to-transparent">
                  <Button className="w-full bg-primary hover:bg-primary/90">
                    Get Started
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Landing;

