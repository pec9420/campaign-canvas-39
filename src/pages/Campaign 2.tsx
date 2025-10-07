import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { getProfile, saveCampaign } from "@/utils/storage";
import { generateMockCampaign } from "@/data/mockCampaigns";
import { Loader2, Copy, Download, Sparkles, FileText, MessageSquare, Image, ArrowLeft, ExternalLink } from "lucide-react";
import { toast } from "sonner";

const Campaign = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { profileId, goal } = location.state || {};

  const [loading, setLoading] = useState(true);
  const [loadingStep, setLoadingStep] = useState(1);
  const [campaign, setCampaign] = useState<any>(null);

  useEffect(() => {
    if (!profileId || !goal) {
      navigate("/");
      return;
    }

    const profile = getProfile(profileId);
    if (!profile) {
      navigate("/");
      return;
    }

    // Simulate AI generation
    const generateCampaign = async () => {
      // Agent 1
      setLoadingStep(1);
      await new Promise(resolve => setTimeout(resolve, 10000));

      // Agent 2
      setLoadingStep(2);
      await new Promise(resolve => setTimeout(resolve, 15000));

      // Agent 3
      setLoadingStep(3);
      await new Promise(resolve => setTimeout(resolve, 15000));

      // Generate mock campaign
      const mockCampaign = generateMockCampaign(goal, profile);
      setCampaign(mockCampaign);
      saveCampaign(profileId, { goal, ...mockCampaign });
      setLoading(false);
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

    const funMessages = [
      "Brewing viral content...",
      "Making your competitors jealous...",
      "Channeling social media magic...",
      "Crafting scroll-stopping posts...",
      "Building your brand empire..."
    ];

    const [currentMessage, setCurrentMessage] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setCurrentMessage(prev => (prev + 1) % funMessages.length);
      }, 3000);
      return () => clearInterval(interval);
    }, []);

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
              <p className="text-lg text-muted-foreground transition-all duration-500">
                {funMessages[currentMessage]}
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
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-12 max-w-md w-full text-center">
          <p className="text-lg text-muted-foreground">Loading campaign...</p>
        </Card>
      </div>
    );
  }

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
              Your Campaign is Ready! 🎉
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
                      <div className="font-semibold">{campaign.strategy.overview.title}</div>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Objective</div>
                      <div className="font-semibold">{campaign.strategy.overview.objective}</div>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Duration</div>
                      <div className="font-semibold">{campaign.strategy.overview.duration}</div>
                    </div>
                    <div className="p-4 bg-secondary rounded-lg">
                      <div className="text-sm text-muted-foreground mb-1">Target Audience</div>
                      <div className="font-semibold">{campaign.strategy.overview.target_audience}</div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Conversion Funnel</h3>
                  <div className="space-y-3">
                    {campaign.strategy.funnel.map((stage: any, i: number) => (
                      <div key={i} className="p-4 bg-secondary rounded-lg">
                        <div className="font-semibold mb-2">{stage.stage}</div>
                        <div className="text-sm text-muted-foreground">{stage.description}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold mb-4">Post Outline</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border">
                          <th className="text-left py-3 px-4 font-semibold">Day</th>
                          <th className="text-left py-3 px-4 font-semibold">Platform</th>
                          <th className="text-left py-3 px-4 font-semibold">Format</th>
                          <th className="text-left py-3 px-4 font-semibold">Stage</th>
                          <th className="text-left py-3 px-4 font-semibold">Goal</th>
                        </tr>
                      </thead>
                      <tbody>
                        {campaign.strategy.post_outline.map((post: any, i: number) => (
                          <tr key={i} className="border-b border-border">
                            <td className="py-3 px-4">{post.day}</td>
                            <td className="py-3 px-4">{post.platform}</td>
                            <td className="py-3 px-4">{post.format}</td>
                            <td className="py-3 px-4">{post.stage}</td>
                            <td className="py-3 px-4">{post.goal}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="scripts">
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Campaign Scripts</h2>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(campaign.scripts, "All scripts")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All
                </Button>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                  {campaign.scripts}
                </pre>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="visuals">
            <Card className="p-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold">Visual Direction</h2>
                <Button
                  variant="outline"
                  onClick={() => copyToClipboard(campaign.visuals, "Visual direction")}
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy All
                </Button>
              </div>
              <div className="prose prose-sm max-w-none">
                <pre className="whitespace-pre-wrap text-sm leading-relaxed font-sans">
                  {campaign.visuals}
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

export default Campaign;
