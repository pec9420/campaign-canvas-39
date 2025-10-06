import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { getProfile } from "@/utils/storage";
import { BusinessProfile } from "@/data/profiles";
import { Sparkles } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileId = location.state?.profileId;

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [goal, setGoal] = useState("");

  useEffect(() => {
    if (!profileId) {
      navigate("/");
      return;
    }

    const loadedProfile = getProfile(profileId);
    if (!loadedProfile) {
      navigate("/");
      return;
    }

    setProfile(loadedProfile);
  }, [profileId, navigate]);

  const handleCreateCampaign = () => {
    if (!goal.trim()) return;
    navigate("/campaign", { state: { profileId, goal } });
  };

  if (!profile) return null;

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Welcome back, {profile.owner_name}!
          </h1>
          <p className="text-xl text-muted-foreground">
            {profile.business_name} • {profile.business.location}
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-8 shadow-sm">
          <div className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="goal" className="text-lg font-semibold">
                What do you want to achieve?
              </Label>
              <Textarea
                id="goal"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Get more catering bookings, Increase foot traffic, Launch new product"
                rows={4}
                className="text-base"
              />
            </div>

            <Button
              onClick={handleCreateCampaign}
              disabled={!goal.trim()}
              className="w-full h-14 text-lg font-semibold"
              size="lg"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Create Campaign
            </Button>
          </div>
        </div>

        <div className="mt-8 text-center">
          <button
            onClick={() => navigate("/")}
            className="text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to profiles
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
