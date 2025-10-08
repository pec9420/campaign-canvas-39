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
import { getProfile } from "@/utils/storage";
import { BusinessProfile } from "@/data/profiles";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowLeft, Download, Copy, Edit2, RefreshCw } from "lucide-react";
import { toast } from "sonner";

const CampaignResults = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const campaignId = searchParams.get('campaignId');

  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<any>(null);
  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [isEditingBrief, setIsEditingBrief] = useState(false);
  const [editedGoal, setEditedGoal] = useState("");
  const [editedOutcome, setEditedOutcome] = useState("");
  const [editedDuration, setEditedDuration] = useState("14");
  const [regenerating, setRegenerating] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!campaignId) {
        navigate("/");
        return;
      }

      try {
        // Load campaign from database
        const { data: campaignData, error: campaignError } = await supabase
          .from('campaigns')
          .select('*')
          .eq('id', campaignId)
          .maybeSingle();

        if (campaignError || !campaignData) {
          console.error("Campaign not found:", campaignError);
          toast.error("Campaign not found");
          navigate("/dashboard");
          return;
        }

        // Load profile
        const loadedProfile = await getProfile(campaignData.profile_id);
        if (!loadedProfile) {
          navigate("/");
          return;
        }

        setCampaign(campaignData);
        setProfile(loadedProfile);
        setEditedGoal(campaignData.campaign_goal);
        setEditedOutcome(campaignData.target_outcome);
        setEditedDuration(campaignData.duration_days.toString());
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

  const handleSaveBrief = async () => {
    if (!campaign || !campaignId) return;

    try {
      const { error } = await supabase
        .from('campaigns')
        .update({
          campaign_goal: editedGoal,
          target_outcome: editedOutcome,
          duration_days: parseInt(editedDuration)
        })
        .eq('id', campaignId);

      if (error) throw error;

      setCampaign({
        ...campaign,
        campaign_goal: editedGoal,
        target_outcome: editedOutcome,
        duration_days: parseInt(editedDuration)
      });

      setIsEditingBrief(false);
      toast.success("Campaign brief updated");
    } catch (error) {
      console.error("Error updating campaign:", error);
      toast.error("Failed to update campaign brief");
    }
  };

  const handleRegenerateCampaign = async () => {
    if (!profile || !campaign) return;

    setRegenerating(true);

    try {
      // Find the persona from the profile
      const persona = profile.personas.find(p => p.id === campaign.persona_id);
      if (!persona) {
        toast.error("Persona not found");
        setRegenerating(false);
        return;
      }

      const { data, error } = await supabase.functions.invoke('generate-campaign', {
        body: {
          profile,
          persona,
          brief: {
            campaign_goal: editedGoal,
            target_outcome: editedOutcome,
            duration_days: parseInt(editedDuration)
          }
        }
      });

      if (error) throw error;

      // Update campaign in database
      const { error: updateError } = await supabase
        .from('campaigns')
        .update({
          strategy: data.strategy,
          campaign_goal: editedGoal,
          target_outcome: editedOutcome,
          duration_days: parseInt(editedDuration)
        })
        .eq('id', campaignId);

      if (updateError) throw updateError;

      setCampaign({
        ...campaign,
        strategy: data.strategy,
        campaign_goal: editedGoal,
        target_outcome: editedOutcome,
        duration_days: parseInt(editedDuration)
      });

      setIsEditingBrief(false);
      toast.success("Campaign regenerated successfully!");
    } catch (error) {
      console.error("Error regenerating campaign:", error);
      toast.error("Failed to regenerate campaign");
    } finally {
      setRegenerating(false);
    }
  };

  const copyPost = (post: any) => {
    const text = `${post.hook}

${post.script}

${post.cta}

${post.hashtags.join(" ")}`;
    copyToClipboard(text, "Post");
  };

  const exportPost = (post: any, index: number) => {
    const text = `${post.hook}

${post.script}

${post.cta}

${post.hashtags.join(" ")}

---
Platform: ${post.platform}
Format: ${post.format}
Visual Direction: ${post.visual_direction}
Expected KPI: ${post.kpi}`;

    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `post-${index + 1}-${post.platform}.txt`;
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

  const strategy = campaign.strategy;
  const posts = strategy?.posts || [];

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
              {strategy?.overview?.title || "Campaign Results"}
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

        {/* Editable Campaign Brief */}
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold">Campaign Brief</h2>
            {!isEditingBrief ? (
              <Button variant="outline" size="sm" onClick={() => setIsEditingBrief(true)}>
                <Edit2 className="w-4 h-4 mr-2" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={() => setIsEditingBrief(false)}>
                  Cancel
                </Button>
                <Button size="sm" onClick={handleSaveBrief}>
                  Save
                </Button>
                <Button size="sm" onClick={handleRegenerateCampaign} disabled={regenerating}>
                  <RefreshCw className={`w-4 h-4 mr-2 ${regenerating ? 'animate-spin' : ''}`} />
                  Regenerate
                </Button>
              </div>
            )}
          </div>

          {isEditingBrief ? (
            <div className="space-y-4">
              <div>
                <Label>Campaign Goal</Label>
                <Textarea
                  value={editedGoal}
                  onChange={(e) => setEditedGoal(e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label>Target Outcome</Label>
                <Textarea
                  value={editedOutcome}
                  onChange={(e) => setEditedOutcome(e.target.value)}
                  rows={2}
                />
              </div>
              <div>
                <Label>Duration</Label>
                <Select value={editedDuration} onValueChange={setEditedDuration}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="7">7 days</SelectItem>
                    <SelectItem value="14">14 days</SelectItem>
                    <SelectItem value="21">21 days</SelectItem>
                    <SelectItem value="30">30 days</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Goal</p>
                <p className="font-medium">{campaign.campaign_goal}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Target Outcome</p>
                <p className="font-medium">{campaign.target_outcome}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Duration</p>
                <p className="font-medium">{campaign.duration_days} days</p>
              </div>
            </div>
          )}
        </Card>

        {/* Strategy Overview */}
        <Card className="p-6">
          <h2 className="text-xl font-semibold mb-4">Strategy Overview</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Objective</p>
              <p className="font-medium">{strategy?.overview?.objective}</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Target Audience</p>
              <p className="font-medium">{strategy?.overview?.target_audience}</p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Campaign Dates</p>
              <p className="font-medium">
                {strategy?.overview?.start_date && strategy?.overview?.end_date
                  ? `${new Date(strategy.overview.start_date).toLocaleDateString()} - ${new Date(strategy.overview.end_date).toLocaleDateString()}`
                  : "Not set"}
              </p>
            </div>
            <div className="p-4 bg-secondary rounded-lg">
              <p className="text-sm text-muted-foreground mb-1">Key Metrics</p>
              <div className="flex flex-wrap gap-2 mt-2">
                {strategy?.overview?.metrics?.map((metric: string, i: number) => (
                  <Badge key={i} variant="secondary">{metric}</Badge>
                ))}
              </div>
            </div>
          </div>

          {/* KPIs by Platform */}
          {strategy?.kpis_by_platform && (
            <div>
              <h3 className="font-semibold mb-3">Platform KPIs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Object.entries(strategy.kpis_by_platform).map(([platform, kpis]: [string, any]) => (
                  <div key={platform} className="p-4 border border-border rounded-lg">
                    <h4 className="font-medium mb-2 capitalize">{platform}</h4>
                    <div className="space-y-2 text-sm">
                      {Object.entries(kpis).map(([key, value]: [string, any]) => (
                        <div key={key} className="flex justify-between">
                          <span className="text-muted-foreground capitalize">{key.replace(/_/g, " ")}:</span>
                          <span className="font-medium">{value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </Card>

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

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div>
                            <Badge variant="secondary">{post.cta}</Badge>
                          </div>
                          <div className="flex flex-wrap gap-2">
                            {post.hashtags?.map((tag: string, i: number) => (
                              <span key={i} className="text-sm text-primary">#{tag}</span>
                            ))}
                          </div>
                        </div>

                        <div className="text-sm text-muted-foreground">
                          <span className="font-medium">Expected KPI:</span> {post.kpi}
                        </div>
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
