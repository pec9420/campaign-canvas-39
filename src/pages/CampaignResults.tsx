import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { getProfile, getCampaign, getCurrentProfile } from "@/utils/storage";
import { BusinessProfile } from "@/data/profiles";
import { Sparkles, ArrowLeft, Download, Copy, Edit2 } from "lucide-react";
import { toast } from "sonner";

const CampaignResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignId = searchParams.get('campaignId');

  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<any>(null);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  useEffect(() => {
    const loadData = async () => {
      if (!campaignId) {
        navigate("/");
        return;
      }

      try {
        // Load campaign from localStorage
        const campaignData = getCampaign(campaignId);

        if (!campaignData) {
          console.error("Campaign not found");
          toast.error("Campaign not found");
          navigate("/dashboard");
          return;
        }

        // Load profile
        const loadedProfile = await getCurrentProfile();
        if (!loadedProfile) {
          navigate("/");
          return;
        }

        setCampaign(campaignData);
        setProfile(loadedProfile);
        setLoading(false);
      } catch (error) {
        console.error("Error loading campaign:", error);
        toast.error("Failed to load campaign");
        navigate("/dashboard");
      }
    };

    loadData();
  }, [campaignId, navigate]);

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard!`);
  };

  const handleSwitchBusiness = () => {
    navigate("/");
  };

  const copyPost = (post: any) => {
    const text = `${post.hook}

${post.script}

${(post.hashtags || []).map((tag: string) => `#${tag}`).join(" ")}`;
    copyToClipboard(text, "Post");
  };

  const exportPost = (post: any, index: number) => {
    const text = `${post.hook}

${post.script}

${(post.hashtags || []).map((tag: string) => `#${tag}`).join(" ")}

---
Day: ${post.day}
Platform: ${post.platform}
Format: ${post.format}
Persona: ${post.persona}
Visual Direction: ${post.visual_direction}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `post-day${post.day}-${post.platform}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Post exported!");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-12 max-w-md w-full text-center">
          <p className="text-lg text-muted-foreground">Loading campaign...</p>
        </Card>
      </div>
    );
  }

  if (!campaign || !profile) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-12 max-w-md w-full text-center">
          <p className="text-lg text-muted-foreground mb-4">Campaign not found</p>
          <Button onClick={() => navigate("/dashboard")}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  // Handle new campaign structure
  const posts = campaign.generated_copy || [];
  const personas = campaign.persona_strategies?.persona_strategies || [];

  // Group posts by platform
  const postsByPlatform = posts.reduce((acc: any, post: any) => {
    if (!acc[post.platform]) {
      acc[post.platform] = [];
    }
    acc[post.platform].push(post);
    return acc;
  }, {});

  const platforms = Object.keys(postsByPlatform);

  return (
    <DashboardLayout
      title="Campaign Results"
      profile={profile}
      onSwitchBusiness={handleSwitchBusiness}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              {campaign.goal || "Campaign Results"}
            </h1>
            <p className="text-muted-foreground">
              Created: {new Date(campaign.created_at).toLocaleDateString()}
            </p>
          </div>
          <div className="flex space-x-3">
            <Button variant="outline" size="lg">
              <Download className="w-4 h-4 mr-2" />
              Export PDF
            </Button>
            <Button size="lg" onClick={() => navigate("/campaign")}>
              <Sparkles className="w-4 h-4 mr-2" />
              Create Another
            </Button>
          </div>
        </div>

        {/* Campaign Brief */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Campaign Brief</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Goal</p>
              <p className="font-medium">{campaign.goal}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Target Outcome</p>
              <p className="font-medium">{campaign.target_outcome || 'Not specified'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-1">Duration</p>
              <p className="font-medium">{campaign.duration_days} days</p>
            </div>
          </div>
        </Card>

        {/* Strategy Overview - Persona Strategies */}
        {personas.length > 0 && (
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Persona Strategies</h2>
            <p className="text-muted-foreground mb-6">
              {campaign.persona_strategies?.strategy_summary}
            </p>

            <div className="space-y-4">
              {personas.map((persona: any, index: number) => (
                <Card key={index} className="p-4 bg-secondary/50">
                  <div className="flex items-start space-x-3 mb-3">
                    <span className="text-3xl">{persona.persona_emoji}</span>
                    <div className="flex-1">
                      <h3 className="font-semibold text-lg mb-1">{persona.persona_name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">{persona.why_target_them}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-muted-foreground mb-1">Key Message</p>
                      <p className="font-medium">{persona.key_message}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Desired Emotion</p>
                      <Badge variant="secondary">{persona.desired_emotion}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Immediate Action</p>
                      <Badge variant="secondary">{persona.immediate_action}</Badge>
                    </div>
                    <div>
                      <p className="text-muted-foreground mb-1">Expected Outcome</p>
                      <p className="font-medium">{persona.expected_outcome}</p>
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="text-sm text-muted-foreground mb-1">Platforms</p>
                    <div className="flex flex-wrap gap-2">
                      {persona.platforms?.map((platform: string, i: number) => (
                        <Badge key={i} variant="outline" className="capitalize">{platform}</Badge>
                      ))}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>
        )}

        {/* Posts by Platform */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Content Posts</h2>
          
          {platforms.length > 0 ? (
            <Tabs defaultValue={platforms[0]}>
              <TabsList className="mb-4">
                {platforms.map((platform) => (
                  <TabsTrigger key={platform} value={platform} className="capitalize">
                    {platform} ({postsByPlatform[platform].length})
                  </TabsTrigger>
                ))}
              </TabsList>

              {platforms.map((platform) => (
                <TabsContent key={platform} value={platform} className="space-y-4">
                  {postsByPlatform[platform].map((post: any, index: number) => (
                    <Card key={index} className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Badge>Day {post.day}</Badge>
                            <Badge variant="outline">{post.format}</Badge>
                            <Badge variant="secondary">{post.persona}</Badge>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => copyPost(post)}>
                              <Copy className="w-4 h-4 mr-2" />
                              Copy
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => exportPost(post, index)}>
                              <Download className="w-4 h-4 mr-2" />
                              Export
                            </Button>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Hook</p>
                          <p className="font-medium">{post.hook}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Script/Caption</p>
                          <p className="whitespace-pre-wrap">{post.script}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Visual Direction</p>
                          <p className="text-sm">{post.visual_direction}</p>
                        </div>

                        {post.hashtags && post.hashtags.length > 0 && (
                          <div className="flex items-center pt-4 border-t">
                            <p className="text-sm text-muted-foreground mr-2">Hashtags:</p>
                            <div className="flex flex-wrap gap-2">
                              {post.hashtags.map((tag: string, i: number) => (
                                <span key={i} className="text-sm text-primary">#{tag}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <p className="text-center py-8 text-muted-foreground">No posts generated</p>
          )}
        </Card>

        {/* Bottom Actions */}
        <div className="flex gap-4 pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => navigate("/campaign")}
            size="lg"
            className="flex-1"
          >
            <Sparkles className="w-4 h-4 mr-2" />
            Create Another Campaign
          </Button>
          <Button variant="outline" size="lg" className="flex-1">
            <Download className="w-4 h-4 mr-2" />
            Export as PDF
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CampaignResults;
