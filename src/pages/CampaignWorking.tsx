import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { getProfile, saveCampaign } from "@/utils/storage";
import { generateMockCampaign } from "@/data/mockCampaigns";
import { Sparkles, ArrowLeft, Download, Copy, FileText, MessageSquare, Image } from "lucide-react";
import { toast } from "sonner";

const CampaignWorking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Get parameters from URL search params
  const searchParams = new URLSearchParams(location.search);
  const profileId = searchParams.get('profileId');
  const goal = searchParams.get('goal');

  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(1);
  const [campaign, setCampaign] = useState<any>(null);

  console.log("CampaignWorking - ProfileId:", profileId, "Goal:", goal);

  useEffect(() => {
    if (!profileId || !goal) {
      console.log("Missing profileId or goal, redirecting to home");
      navigate("/");
      return;
    }

    const profile = getProfile(profileId);
    if (!profile) {
      console.log("Profile not found, redirecting to home");
      navigate("/");
      return;
    }

    // Simulate AI generation
    const generateCampaign = async () => {
      try {
        // Agent 1
        setLoadingStep(1);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Agent 2
        setLoadingStep(2);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Agent 3
        setLoadingStep(3);
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Generate mock campaign
        const mockCampaign = generateMockCampaign(goal, profile);
        console.log("Generated campaign:", mockCampaign);

        if (mockCampaign && mockCampaign.strategy) {
          setCampaign(mockCampaign);
          saveCampaign(profileId, { goal, ...mockCampaign });
          // Show success toast
          toast.success("Your campaign is now ready! 🎉", {
            duration: 4000,
          });
        } else {
          console.error("Invalid campaign data generated");
        }
        setLoading(false);
      } catch (error) {
        console.error("Error generating campaign:", error);
        setLoading(false);
      }
    };

    generateCampaign();
  }, [profileId, goal, navigate]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  if (loading) {
    const agents = [
      {
        id: 1,
        name: "Strategist",
        icon: "🧠",
        task: "Analyzing your business...",
        completed: loadingStep > 1,
        active: loadingStep === 1
      },
      {
        id: 2,
        name: "Scripter",
        icon: "✍️",
        task: "Writing your content...",
        completed: loadingStep > 2,
        active: loadingStep === 2
      },
      {
        id: 3,
        name: "Visual Planner",
        icon: "📸",
        task: "Planning visuals...",
        completed: loadingStep > 3,
        active: loadingStep === 3
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-500/5 to-background flex items-center justify-center p-6">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
        <Card className="relative z-10 p-12 max-w-lg w-full bg-card/95 backdrop-blur border shadow-2xl">
          <div className="text-center">
            {/* Main Loader */}
            <div className="relative mb-8">
              <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
                <Sparkles className="w-12 h-12 text-white animate-spin" />
              </div>
              <div className="w-32 h-2 bg-muted rounded-full mx-auto">
                <div
                  className="h-full bg-gradient-to-r from-primary to-purple-500 rounded-full transition-all duration-1000"
                  style={{ width: `${(loadingStep / 3) * 100}%` }}
                />
              </div>
            </div>

            {/* Fun Messages */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Creating Your Campaign
              </h2>
              <p className="text-lg text-muted-foreground">
                Channeling social media magic...
              </p>
            </div>

            {/* Agent Status */}
            <div className="space-y-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                    agent.completed
                      ? "bg-green-50 border border-green-200"
                      : agent.active
                      ? "bg-primary/10 border border-primary/30"
                      : "bg-muted/50"
                  }`}
                >
                  <div className="text-2xl">{agent.icon}</div>
                  <div className="flex-1 text-left">
                    <p className="font-medium">
                      {agent.completed ? "✓ Complete" : agent.active ? "🔄 In progress" : "⏳ Waiting"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Agent {agent.id}: {agent.name}
                    </p>
                    {agent.active && (
                      <p className="text-sm text-primary">
                        Currently: {agent.task}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>
    );
  }

  if (!campaign) {
    console.log("Campaign is null/undefined. Loading:", loading);
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-12 max-w-md w-full text-center">
          <p className="text-lg text-muted-foreground">Loading campaign...</p>
        </Card>
      </div>
    );
  }

  console.log("Rendering campaign results with data:", campaign);

  const profile = getProfile(profileId);

  const handleSwitchBusiness = () => {
    navigate("/");
  };

  return (
    <DashboardLayout
      title="Campaign Results"
      profile={profile}
      onSwitchBusiness={handleSwitchBusiness}
    >
      <div className="space-y-6">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/dashboard", { state: { profileId } })}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Dashboard
              </Button>
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {campaign.strategy?.overview?.title || "Campaign Results"}
            </h1>
            <p className="text-lg text-muted-foreground">
              <span className="font-medium">Goal:</span> {goal}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button size="lg" onClick={() => navigate("/dashboard", { state: { profileId } })}>
              <Sparkles className="w-4 h-4 mr-2" />
              Create Another
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="strategy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 h-12">
            <TabsTrigger value="strategy" className="flex items-center space-x-2">
              <FileText className="w-4 h-4" />
              <span>Strategy</span>
            </TabsTrigger>
            <TabsTrigger value="scripts" className="flex items-center space-x-2">
              <MessageSquare className="w-4 h-4" />
              <span>Content</span>
            </TabsTrigger>
            <TabsTrigger value="visuals" className="flex items-center space-x-2">
              <Image className="w-4 h-4" />
              <span>Visuals</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="strategy" className="space-y-6">
            <Card className="p-8">
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold mb-4">Campaign Overview</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 bg-secondary rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Title</div>
                      <div className="font-semibold">{campaign.strategy?.overview?.title || "No title"}</div>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Objective</div>
                      <div className="font-semibold">{campaign.strategy?.overview?.objective || "No objective"}</div>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Campaign Dates</div>
                      <div className="font-semibold">
                        {campaign.strategy?.overview?.start_date && campaign.strategy?.overview?.end_date ?
                          `${new Date(campaign.strategy.overview.start_date).toLocaleDateString()} - ${new Date(campaign.strategy.overview.end_date).toLocaleDateString()}` :
                          "No dates set"
                        }
                      </div>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Target Audience</div>
                      <div className="font-semibold">{campaign.strategy?.overview?.target_audience || "No audience"}</div>
                    </div>
                  </div>
                </div>

                {/* Content Schedule */}
                <div>
                  <h3 className="text-xl font-bold mb-4">Content Schedule</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold text-sm">Date</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Platform</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Format</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Stage</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Goal</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Description</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Purpose</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">Persona</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">CTA</th>
                          <th className="text-left py-3 px-4 font-semibold text-sm">KPI</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaign.strategy?.post_outline?.map((post: any, i: number) => (
                          <tr key={i} className="border-b border-border hover:bg-secondary/50 transition-colors">
                            <td className="py-3 px-4 text-sm font-medium">
                              {post.date ? new Date(post.date).toLocaleDateString() : (post.day ? `Day ${post.day}` : "TBD")}
                            </td>
                            <td className="py-3 px-4 text-sm">{post.platform}</td>
                            <td className="py-3 px-4 text-sm">{post.format}</td>
                            <td className="py-3 px-4 text-sm">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${
                                post.stage === 'Awareness' ? 'bg-blue-100 text-blue-800' :
                                post.stage === 'Consideration' ? 'bg-yellow-100 text-yellow-800' :
                                post.stage === 'Conversion' ? 'bg-green-100 text-green-800' :
                                'bg-purple-100 text-purple-800'
                              }`}>
                                {post.stage}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm">{post.goal}</td>
                            <td className="py-3 px-4 text-sm max-w-xs">
                              <div className="truncate" title={post.description}>
                                {post.description || "No description"}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm max-w-xs">
                              <div className="truncate" title={post.purpose}>
                                {post.purpose || "No purpose"}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm max-w-xs">
                              <div className="truncate" title={post.persona}>
                                {post.persona || "No persona"}
                              </div>
                            </td>
                            <td className="py-3 px-4 text-sm">
                              <span className="px-2 py-1 bg-primary/10 text-primary rounded text-xs font-medium">
                                {post.cta}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-sm max-w-xs">
                              <div className="truncate" title={post.kpi}>
                                {post.kpi || "No KPI"}
                              </div>
                            </td>
                          </tr>
                        )) || (
                          <tr>
                            <td colSpan={10} className="py-6 px-4 text-center text-muted-foreground">
                              No content schedule available
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="scripts" className="space-y-6">
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Content Scripts</h2>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(campaign.scripts || "", "Scripts")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All
                </Button>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap text-foreground overflow-auto max-h-96">
                  {campaign.scripts || "No scripts available"}
                </pre>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="visuals" className="space-y-6">
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Visual Guidelines</h2>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(campaign.visuals || "", "Visual Guidelines")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All
                </Button>
              </div>
              <div className="bg-muted p-6 rounded-lg">
                <pre className="text-sm whitespace-pre-wrap text-foreground overflow-auto max-h-96">
                  {campaign.visuals || "No visual guidelines available"}
                </pre>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Bottom Actions */}
        <div className="flex gap-4 mt-8 pt-6 border-t border-border">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard", { state: { profileId } })}
            size="lg"
            className="flex-1"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Create Another Campaign
          </Button>
          <Button
            onClick={() => toast.info("PDF export coming soon!")}
            size="lg"
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as PDF
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CampaignWorking;