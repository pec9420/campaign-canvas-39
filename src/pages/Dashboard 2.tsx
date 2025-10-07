import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { getProfile } from "@/utils/storage";
import { BusinessProfile } from "@/data/profiles";
import { Sparkles, TrendingUp, Calendar, Palette, Target, CheckCircle, Clock, Users } from "lucide-react";

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

  const handleQuickGoal = (quickGoal: string) => {
    setGoal(quickGoal);
  };

  const handleSwitchBusiness = () => {
    navigate("/");
  };

  if (!profile) return null;

  const quickGoals = [
    "Increase foot traffic",
    "Boost catering orders",
    "Launch new product",
    "Holiday promotion"
  ];

  const insights = [
    "Post consistently 3-4 times per week for best engagement",
    "Video content gets 5x more engagement than photos",
    "Local hashtags increase visibility by 40%",
    "Stories with polls boost interaction rates"
  ];

  const nextSteps = [
    { task: "Complete brand profile", completed: true },
    { task: "Set up first campaign", completed: false },
    { task: "Connect social accounts", completed: false },
    { task: "Review content calendar", completed: false }
  ];

  return (
    <DashboardLayout
      title="Dashboard"
      profile={profile}
      onSwitchBusiness={handleSwitchBusiness}
    >
      <div className="space-y-6">
        {/* Create Campaign Card */}
        <Card className="p-8 bg-gradient-to-r from-primary/5 to-purple-500/5 border-primary/20 hover-glow animate-fadeIn">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Create New Campaign
              </h2>
              <p className="text-muted-foreground">
                Tell us what you want to achieve, and we'll create a tailored social media campaign for you.
              </p>
            </div>

            <div className="space-y-4">
              <Textarea
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="e.g., Get more catering bookings, Increase foot traffic, Launch new product..."
                rows={4}
                className="text-base resize-none"
              />

              {/* Quick Goal Pills */}
              <div className="flex flex-wrap gap-2">
                <span className="text-sm text-muted-foreground mr-2">Quick ideas:</span>
                {quickGoals.map((quickGoal) => (
                  <Badge
                    key={quickGoal}
                    variant="secondary"
                    className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                    onClick={() => handleQuickGoal(quickGoal)}
                  >
                    {quickGoal}
                  </Badge>
                ))}
              </div>
            </div>

            <Button
              onClick={handleCreateCampaign}
              disabled={!goal.trim()}
              size="lg"
              className="w-full h-14 text-lg font-semibold"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Generate Campaign
            </Button>
          </div>
        </Card>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - 2/3 width */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Campaigns */}
            <Card className="p-6 card-hover">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-semibold">Recent Campaigns</h3>
                  <Badge variant="secondary">0</Badge>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>

              <div className="text-center py-12">
                <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="w-8 h-8 text-muted-foreground" />
                </div>
                <h4 className="text-lg font-medium text-foreground mb-2">No campaigns yet</h4>
                <p className="text-muted-foreground mb-4">
                  Create your first campaign to start building your social media presence.
                </p>
                <Button
                  variant="outline"
                  onClick={() => setGoal("Increase brand awareness")}
                >
                  Get Started
                </Button>
              </div>
            </Card>

            {/* Brand Profile Overview */}
            <Card className="p-6 card-hover">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold">Brand Profile</h3>
                <Button variant="outline" size="sm" onClick={() => navigate("/brand-hub")}>
                  <Palette className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="flex justify-center space-x-1 mb-2">
                    {profile.brand_identity.colors.slice(0, 3).map((color, index) => (
                      <div
                        key={index}
                        className="w-4 h-4 rounded-full border border-border"
                        style={{ backgroundColor: color }}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Brand Colors</p>
                </div>

                <div className="text-center">
                  <p className="font-medium text-foreground mb-1 capitalize">
                    {profile.voice.tone}
                  </p>
                  <p className="text-sm text-muted-foreground">Voice Tone</p>
                </div>

                <div className="text-center">
                  <p className="font-medium text-foreground mb-1">
                    {profile.business.services.length}
                  </p>
                  <p className="text-sm text-muted-foreground">Services</p>
                </div>

                <div className="text-center">
                  <p className="font-medium text-foreground mb-1 capitalize">
                    {profile.business.price_point}
                  </p>
                  <p className="text-sm text-muted-foreground">Price Point</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Column - 1/3 width */}
          <div className="space-y-6">
            {/* AI Insights */}
            <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-primary/10 border-primary/20">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">AI Insights</h3>
              </div>

              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <div key={index} className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                    <p className="text-sm text-foreground">{insight}</p>
                  </div>
                ))}
              </div>

              <Button variant="outline" size="sm" className="w-full mt-4">
                Learn More
              </Button>
            </Card>

            {/* Next Steps */}
            <Card className="p-6">
              <div className="flex items-center space-x-3 mb-4">
                <Target className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold">Next Steps</h3>
              </div>

              <div className="space-y-3">
                {nextSteps.map((step, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    {step.completed ? (
                      <CheckCircle className="w-4 h-4 text-green-500" />
                    ) : (
                      <Clock className="w-4 h-4 text-muted-foreground" />
                    )}
                    <span className={`text-sm ${step.completed ? 'text-muted-foreground line-through' : 'text-foreground'}`}>
                      {step.task}
                    </span>
                  </div>
                ))}
              </div>
            </Card>

            {/* Quick Stats */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">This Week</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Campaigns</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Content Created</span>
                  <span className="font-medium">0</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Scheduled Posts</span>
                  <span className="font-medium">0</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;
