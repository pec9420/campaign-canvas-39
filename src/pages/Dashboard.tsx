import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { getCurrentProfile, getCampaignsByProfile, saveCampaign, clearAllCampaigns } from "@/utils/storage";
import { generateMockCampaign } from "@/data/mockCampaigns";
import { BusinessProfile } from "@/data/profiles";
import { Sparkles, TrendingUp, Calendar, Palette, Target, CheckCircle, Clock } from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [goal, setGoal] = useState("");
  const [campaigns, setCampaigns] = useState<any[]>([]);
  const [calendarView, setCalendarView] = useState<'weekly' | 'monthly'>('weekly');

  useEffect(() => {
    const loadProfile = async () => {
      // Get profile from location state or fallback to current/default profile
      const loadedProfile = await getCurrentProfile();

      if (!loadedProfile) {
        navigate("/");
        return;
      }

      setProfile(loadedProfile);
      const profileId = loadedProfile.id;

      // One-time cleanup for existing duplicates and add new campaigns
      const cleanupDone = localStorage.getItem('cleanup_duplicates_v2_done');
      if (!cleanupDone && profileId === "stack_creamery") {
        clearAllCampaigns();
        localStorage.removeItem('stack_creamery_campaigns_initialized');
        localStorage.setItem('cleanup_duplicates_v2_done', 'true');
      }

      // Load campaigns for this profile
      let profileCampaigns = getCampaignsByProfile(profileId);

      // For Stack Creamery, ensure we have exactly one sample campaign
      if (profileId === "stack_creamery") {
        const hasInitialized = localStorage.getItem(`${profileId}_campaigns_initialized`);

        if (!hasInitialized) {
          // Clear any existing campaigns and create fresh ones
          clearAllCampaigns();

          // Create first sample campaign (completed)
          const completedCampaign = generateMockCampaign("boost catering orders", loadedProfile);
          const completedCampaignWithMeta = {
            ...completedCampaign,
            goal: "Boost catering orders for summer events",
            status: "completed",
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
          };
          saveCampaign(profileId, completedCampaignWithMeta);

          // Create second sample campaign (in progress)
          const inProgressCampaign = generateMockCampaign("increase foot traffic", loadedProfile);
          // Modify the title for the in-progress campaign
          inProgressCampaign.strategy.overview.title = "Stack Creamery Holiday Promotion Campaign";
          const inProgressCampaignWithMeta = {
            ...inProgressCampaign,
            goal: "Increase foot traffic during holiday season",
            status: "in_progress",
            created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
          };
          saveCampaign(profileId, inProgressCampaignWithMeta);

          // Mark as initialized to prevent future duplicates
          localStorage.setItem(`${profileId}_campaigns_initialized`, 'true');

          profileCampaigns = getCampaignsByProfile(profileId);
        }
      }

      setCampaigns(profileCampaigns);
    };
    loadProfile();
  }, [navigate]);

  const handleCreateCampaign = () => {
    if (!goal.trim() || !profile) return;
    const encodedGoal = encodeURIComponent(goal);
    navigate(`/campaign?profileId=${profile.id}&goal=${encodedGoal}`);
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
            {/* Recent Campaigns & Calendar */}
            <Card className="p-6 card-hover">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <h3 className="text-xl font-semibold">Campaigns & Schedule</h3>
                  <Badge variant="secondary">{campaigns.length}</Badge>
                </div>
                <Button variant="outline" size="sm">View All</Button>
              </div>

              <Tabs defaultValue="campaigns" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2 h-12">
                  <TabsTrigger value="campaigns" className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4" />
                    <span>Recent Campaigns</span>
                  </TabsTrigger>
                  <TabsTrigger value="calendar" className="flex items-center space-x-2">
                    <Calendar className="w-4 h-4" />
                    <span>Content Calendar</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="campaigns">
                  {campaigns.length === 0 ? (
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
                  ) : (
                    <div className="space-y-4">
                      {campaigns.slice(0, 3).map((campaign, index) => (
                        <div
                          key={campaign.id}
                          className="p-4 border border-border rounded-lg hover:border-primary/50 cursor-pointer transition-colors"
                          onClick={() => {
                            // Navigate to campaign results page
                            navigate(`/campaign-results?campaignId=${campaign.id}`);
                          }}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <h4 className="font-medium text-foreground mb-1">
                                {campaign.strategy?.overview?.title || `Campaign ${index + 1}`}
                              </h4>
                              <p className="text-sm text-muted-foreground mb-2">
                                {campaign.goal}
                              </p>
                              <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                <span>
                                  {campaign.strategy?.overview?.start_date && campaign.strategy?.overview?.end_date ?
                                    `${new Date(campaign.strategy.overview.start_date).toLocaleDateString()} - ${new Date(campaign.strategy.overview.end_date).toLocaleDateString()}` :
                                    "14 days"
                                  }
                                </span>
                                <span className={`px-2 py-1 rounded text-xs font-medium ${
                                  campaign.status === 'completed' ? 'bg-green-100 text-green-700' :
                                  campaign.status === 'in_progress' ? 'bg-blue-100 text-blue-700' :
                                  'bg-gray-100 text-gray-700'
                                }`}>
                                  {campaign.status === 'completed' ? 'Completed' :
                                   campaign.status === 'in_progress' ? 'In Progress' :
                                   'Draft'}
                                </span>
                              </div>
                            </div>
                            <div className="ml-4">
                              <Calendar className="w-5 h-5 text-muted-foreground" />
                            </div>
                          </div>
                        </div>
                      ))}
                      {campaigns.length > 3 && (
                        <Button
                          variant="ghost"
                          className="w-full"
                          onClick={() => navigate("/campaigns")}
                        >
                          View All Campaigns ({campaigns.length})
                        </Button>
                      )}
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="calendar">
                  <div className="space-y-4">
                    {/* Calendar View Toggle */}
                    <div className="flex items-center justify-between">
                      <h4 className="text-lg font-medium">Content Schedule</h4>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant={calendarView === 'weekly' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCalendarView('weekly')}
                        >
                          Weekly
                        </Button>
                        <Button
                          variant={calendarView === 'monthly' ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => setCalendarView('monthly')}
                        >
                          Monthly
                        </Button>
                      </div>
                    </div>

                    {/* Calendar Content */}
                    {(() => {
                      const inProgressCampaigns = campaigns.filter(c => c.status === 'in_progress');
                      const allContent = inProgressCampaigns.flatMap(campaign =>
                        (campaign.strategy?.post_outline || []).map((post: any) => ({
                          ...post,
                          campaignTitle: campaign.strategy?.overview?.title || 'Untitled Campaign'
                        }))
                      );

                      if (allContent.length === 0) {
                        return (
                          <div className="text-center py-12">
                            <Calendar className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                            <h4 className="text-lg font-medium text-foreground mb-2">No content scheduled</h4>
                            <p className="text-muted-foreground">
                              Content from in-progress campaigns will appear here.
                            </p>
                          </div>
                        );
                      }

                      // Sort content by date
                      const sortedContent = allContent
                        .filter(item => item.date)
                        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

                      if (calendarView === 'weekly') {
                        // Group by week
                        const weekContent = sortedContent.slice(0, 7); // Show next 7 days
                        return (
                          <div className="space-y-3">
                            {weekContent.map((item, index) => (
                              <div key={index} className="flex items-center space-x-4 p-3 border border-border rounded-lg">
                                <div className="flex-shrink-0 w-20 text-sm font-medium text-muted-foreground">
                                  {new Date(item.date).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric'
                                  })}
                                </div>
                                <div className="flex-1">
                                  <div className="font-medium text-sm">{item.goal}</div>
                                  <div className="text-xs text-muted-foreground">{item.platform} • {item.format}</div>
                                </div>
                                <div className="flex-shrink-0">
                                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                                    item.stage === 'Awareness' ? 'bg-blue-100 text-blue-800' :
                                    item.stage === 'Consideration' ? 'bg-yellow-100 text-yellow-800' :
                                    item.stage === 'Conversion' ? 'bg-green-100 text-green-800' :
                                    'bg-purple-100 text-purple-800'
                                  }`}>
                                    {item.stage}
                                  </span>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      } else {
                        // Monthly view - group by date
                        const monthContent = sortedContent.slice(0, 14); // Show next 14 days
                        return (
                          <div className="grid grid-cols-7 gap-2">
                            {/* Calendar header */}
                            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                              <div key={day} className="text-center text-xs font-medium text-muted-foreground p-2">
                                {day}
                              </div>
                            ))}

                            {/* Calendar days */}
                            {(() => {
                              const today = new Date();
                              const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
                              const lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
                              const startDate = new Date(firstDay);
                              startDate.setDate(startDate.getDate() - firstDay.getDay());

                              const days = [];
                              for (let i = 0; i < 42; i++) {
                                const currentDate = new Date(startDate);
                                currentDate.setDate(startDate.getDate() + i);

                                const dateStr = currentDate.toISOString().split('T')[0];
                                const dayContent = monthContent.filter(item => item.date === dateStr);

                                days.push(
                                  <div key={i} className={`min-h-20 p-1 border border-border rounded ${
                                    currentDate.getMonth() !== today.getMonth() ? 'bg-muted/30' : 'bg-background'
                                  }`}>
                                    <div className="text-xs font-medium mb-1">
                                      {currentDate.getDate()}
                                    </div>
                                    {dayContent.slice(0, 2).map((item, idx) => (
                                      <div key={idx} className="text-xs p-1 bg-primary/10 text-primary rounded mb-1 truncate">
                                        {item.platform}
                                      </div>
                                    ))}
                                    {dayContent.length > 2 && (
                                      <div className="text-xs text-muted-foreground">
                                        +{dayContent.length - 2} more
                                      </div>
                                    )}
                                  </div>
                                );
                              }
                              return days;
                            })()}
                          </div>
                        );
                      }
                    })()}
                  </div>
                </TabsContent>
              </Tabs>
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
                  <p className="font-medium text-foreground mb-1">
                    {profile.locations?.length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Locations</p>
                </div>

                <div className="text-center">
                  <p className="font-medium text-foreground mb-1 capitalize">
                    {profile.voice?.tone?.replace(/_/g, " ") || "Not set"}
                  </p>
                  <p className="text-sm text-muted-foreground">Voice Tone</p>
                </div>

                <div className="text-center">
                  <p className="font-medium text-foreground mb-1">
                    {profile.voice?.signature_phrases?.length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Signature Phrases</p>
                </div>

                <div className="text-center">
                  <p className="font-medium text-foreground mb-1">
                    {profile.personas?.length || 0}
                  </p>
                  <p className="text-sm text-muted-foreground">Personas</p>
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
