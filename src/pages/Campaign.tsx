import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getProfile, saveCampaign } from "@/utils/storage";
import { generateMockCampaign } from "@/data/mockCampaigns";
import { Loader2, Copy, Download, Sparkles } from "lucide-react";
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
    const steps = [
      { num: 1, text: "Agent 1: Creating campaign strategy..." },
      { num: 2, text: "Agent 2: Writing scripts..." },
      { num: 3, text: "Agent 3: Planning visuals..." }
    ];

    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-12 max-w-md w-full text-center">
          <Loader2 className="w-16 h-16 text-primary animate-spin mx-auto mb-6" />
          <div className="space-y-4">
            {steps.map((step) => (
              <div
                key={step.num}
                className={`text-lg transition-all duration-300 ${
                  loadingStep === step.num
                    ? "text-primary font-semibold"
                    : loadingStep > step.num
                    ? "text-success font-medium"
                    : "text-muted-foreground"
                }`}
              >
                {loadingStep > step.num ? "✓ " : loadingStep === step.num ? "⟳ " : "○ "}
                {step.text}
              </div>
            ))}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Campaign Results
          </h1>
          <p className="text-lg text-muted-foreground">
            Goal: {goal}
          </p>
        </div>

        <Tabs defaultValue="strategy" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="strategy">Strategy</TabsTrigger>
            <TabsTrigger value="scripts">Scripts</TabsTrigger>
            <TabsTrigger value="visuals">Visuals</TabsTrigger>
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

        <div className="flex gap-4 mt-8">
          <Button
            variant="outline"
            onClick={() => navigate("/dashboard", { state: { profileId } })}
            className="flex-1"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Create Another Campaign
          </Button>
          <Button
            onClick={() => toast.info("PDF export coming soon!")}
            className="flex-1"
          >
            <Download className="w-4 h-4 mr-2" />
            Export as PDF
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Campaign;
