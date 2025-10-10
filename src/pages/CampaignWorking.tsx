import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getCurrentProfile } from "@/utils/storage";
import { BusinessProfile, Persona } from "@/data/profiles";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowLeft, CheckCircle2, Check, Edit } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";

const CampaignWorking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [campaignGoal, setCampaignGoal] = useState("");
  const [targetOutcome, setTargetOutcome] = useState("");
  const [duration, setDuration] = useState("14");

  // Multi-stage flow state
  const [currentStage, setCurrentStage] = useState(1); // 1 = Brief, 2 = Strategy, 3 = Calendar
  const [loading, setLoading] = useState(false);
  const [personaStrategies, setPersonaStrategies] = useState<any>(null); // Stage 1 results
  const [contentCalendar, setContentCalendar] = useState<any>(null); // Stage 2 results

  useEffect(() => {
    const loadData = async () => {
      const loadedProfile = await getCurrentProfile();
      if (!loadedProfile) {
        navigate("/");
        return;
      }
      setProfile(loadedProfile);
    };
    loadData();
  }, [navigate]);

  // Stage 1: Generate persona strategies
  const handleStage1 = async () => {
    if (!profile || !campaignGoal) {
      toast.error("Please fill in the campaign goal");
      return;
    }

    setLoading(true);

    try {
      console.log("Calling generate-campaign edge function with:", {
        stage: 'persona_strategy',
        campaign_goal: campaignGoal,
        business_name: profile.business_name
      });

      const { data, error } = await supabase.functions.invoke('generate-campaign', {
        body: {
          stage: 'persona_strategy',
          profile,
          brief: {
            campaign_goal: campaignGoal,
            target_outcome: targetOutcome,
            duration_days: parseInt(duration)
          }
        }
      });

      if (error) {
        console.error("Error generating persona strategies:", error);
        console.error("Full error details:", JSON.stringify(error, null, 2));

        // Try to extract detailed error from response
        const errorMsg = data?.error || error.message || "Failed to generate strategies";
        const errorDetails = data?.details || "";

        console.error("Edge function error:", errorMsg);
        if (errorDetails) console.error("Stack trace:", errorDetails);

        toast.error(errorMsg);
        setLoading(false);
        return;
      }

      console.log("Raw API response:", JSON.stringify(data, null, 2));

      console.log("Persona strategies generated:", data);
      setPersonaStrategies(data);
      setCurrentStage(2);
      toast.success("Persona strategies generated! Review and approve to continue.");

    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during strategy generation");
    } finally {
      setLoading(false);
    }
  };

  // Stage 2: Generate content calendar
  const handleStage2 = async () => {
    if (!profile || !personaStrategies) {
      toast.error("Missing persona strategies");
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('generate-campaign', {
        body: {
          stage: 'content_calendar',
          profile,
          brief: {
            campaign_goal: campaignGoal,
            target_outcome: targetOutcome,
            duration_days: parseInt(duration)
          },
          approvedStrategies: personaStrategies
        }
      });

      if (error) {
        console.error("Error generating content calendar:", error);
        console.error("Full error details:", JSON.stringify(error, null, 2));
        toast.error(error.message || "Failed to generate calendar");
        setLoading(false);
        return;
      }

      console.log("Raw API response:", JSON.stringify(data, null, 2));

      console.log("Content calendar generated:", data);
      setContentCalendar(data);
      setCurrentStage(3);
      toast.success("Content calendar generated!");

    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during calendar generation");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchBusiness = () => {
    navigate("/");
  };

  if (!profile) return null;

  // Loading overlay
  if (loading) {
    const loadingMessage = currentStage === 1
      ? "Analyzing your business goal and recommending persona strategies..."
      : "Generating content calendar with strategic posts...";

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-500/5 to-background flex items-center justify-center p-6">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
        <Card className="relative z-10 p-12 max-w-lg w-full bg-card/95 backdrop-blur border shadow-2xl">
          <div className="text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
              <Sparkles className="w-12 h-12 text-white animate-spin" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              AI Agent Working
            </h2>
            <p className="text-lg text-muted-foreground">
              {loadingMessage}
            </p>
          </div>
        </Card>
      </div>
    );
  }

  // Stepper UI
  const steps = [
    { number: 1, label: "Campaign Brief", completed: currentStage > 1 },
    { number: 2, label: "Persona Strategy", completed: currentStage > 2 },
    { number: 3, label: "Content Calendar", completed: currentStage > 3 },
  ];

  return (
    <DashboardLayout
      title="Create Campaign"
      profile={profile}
      onSwitchBusiness={handleSwitchBusiness}
    >
      <div className="max-w-5xl mx-auto space-y-6">
        {/* Header */}
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
            Create New Campaign
          </h1>
          <p className="text-lg text-muted-foreground">
            3-stage AI campaign generation: Brief → Strategy → Calendar
          </p>
        </div>

        {/* Stepper */}
        <Card className="p-6">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center flex-1">
                <div className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                      step.completed
                        ? "bg-green-500 text-white"
                        : currentStage === step.number
                        ? "bg-primary text-white"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {step.completed ? <Check className="w-5 h-5" /> : step.number}
                  </div>
                  <div className="ml-3">
                    <p className={`font-medium ${currentStage === step.number ? "text-primary" : ""}`}>
                      {step.label}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div className={`flex-1 h-1 mx-4 ${step.completed ? "bg-green-500" : "bg-muted"}`} />
                )}
              </div>
            ))}
          </div>
        </Card>

        {/* Stage 1: Campaign Brief */}
        {currentStage === 1 && (
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-4">Stage 1: Campaign Brief</h2>
                <p className="text-muted-foreground mb-6">
                  Tell us your business goal, and AI will recommend which personas to target
                </p>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign-goal">Campaign Goal *</Label>
                  <Textarea
                    id="campaign-goal"
                    placeholder='e.g., "Promote our new summer menu and get more weekend customers"'
                    value={campaignGoal}
                    onChange={(e) => setCampaignGoal(e.target.value)}
                    rows={3}
                  />
                  <p className="text-sm text-muted-foreground">
                    Think business outcome, not marketing jargon
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="target-outcome">Target Outcome (Optional)</Label>
                  <Textarea
                    id="target-outcome"
                    placeholder='e.g., "50+ bookings for Saturday nights"'
                    value={targetOutcome}
                    onChange={(e) => setTargetOutcome(e.target.value)}
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration">Campaign Duration</Label>
                  <Select value={duration} onValueChange={setDuration}>
                    <SelectTrigger id="duration">
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

              <div className="flex justify-end pt-4">
                <Button
                  size="lg"
                  onClick={handleStage1}
                  disabled={!campaignGoal || loading}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Persona Strategy
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Stage 2: Persona Strategy Approval */}
        {currentStage === 2 && personaStrategies && (
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Stage 2: Persona Strategy</h2>
                <p className="text-muted-foreground">
                  Review the recommended personas and their strategies
                </p>
              </div>

              <div className="bg-muted/50 p-4 rounded-lg">
                <p className="font-medium text-lg mb-2">Campaign Goal:</p>
                <p className="text-muted-foreground">{personaStrategies.campaign_goal}</p>
              </div>

              <Separator />

              <div>
                <h3 className="font-semibold text-lg mb-4">Recommended Personas:</h3>
                <div className="space-y-4">
                  {personaStrategies.persona_strategies?.map((ps: any, index: number) => (
                    <Card key={index} className="p-6 border-l-4 border-l-primary">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-4xl">{ps.persona_emoji}</span>
                            <h4 className="font-semibold text-xl">{ps.persona_name}</h4>
                          </div>
                          <Badge variant="secondary">{ps.action_intent_level} intent</Badge>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Why target them:</p>
                          <p className="font-medium">{ps.why_target_them}</p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Key Message:</p>
                            <p className="text-sm">{ps.key_message}</p>
                          </div>
                          <div>
                            <p className="text-sm text-muted-foreground mb-1">Desired Emotion:</p>
                            <p className="text-sm capitalize">{ps.desired_emotion}</p>
                          </div>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Immediate Action:</p>
                          <p className="text-sm font-medium">{ps.immediate_action}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Expected Outcome:</p>
                          <p className="text-sm">{ps.expected_outcome}</p>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {ps.platforms?.map((platform: string) => (
                            <Badge key={platform} variant="outline">
                              {platform}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {personaStrategies.strategy_summary && (
                <div className="bg-primary/5 p-4 rounded-lg border border-primary/20">
                  <p className="text-sm font-medium mb-2">Strategy Summary:</p>
                  <p className="text-sm text-muted-foreground">{personaStrategies.strategy_summary}</p>
                </div>
              )}

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStage(1)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Brief
                </Button>
                <Button
                  size="lg"
                  onClick={handleStage2}
                  disabled={loading}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Approve & Generate Calendar
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Stage 3: Content Calendar */}
        {currentStage === 3 && contentCalendar && (
          <Card className="p-8">
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-semibold mb-2">Stage 3: Content Calendar</h2>
                <p className="text-muted-foreground">
                  Your strategic content calendar is ready!
                </p>
              </div>

              {contentCalendar.content_calendar?.overview && (
                <div className="bg-muted/50 p-6 rounded-lg space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Total Posts:</p>
                    <p className="text-2xl font-bold">{contentCalendar.content_calendar.overview.total_posts}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Platform Breakdown:</p>
                    <div className="flex flex-wrap gap-2">
                      {Object.entries(contentCalendar.content_calendar.overview.platform_breakdown || {}).map(
                        ([platform, count]: [string, any]) => (
                          <Badge key={platform} variant="secondary">
                            {platform}: {count}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Flow:</p>
                    <p className="text-sm">{contentCalendar.content_calendar.overview.flow}</p>
                  </div>
                </div>
              )}

              <Separator />

              <div>
                <h3 className="font-semibold text-lg mb-4">Content Posts:</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                  {contentCalendar.content_calendar?.posts?.map((post: any, index: number) => (
                    <Card key={index} className="p-4">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">Day {post.day}</Badge>
                            <Badge variant="secondary">{post.platform}</Badge>
                            <Badge>{post.format}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{post.time_of_day}</p>
                        </div>

                        <div>
                          <p className="text-sm text-muted-foreground mb-1">Target: {post.target_persona}</p>
                          <p className="font-medium">{post.key_message}</p>
                        </div>

                        <div className="grid grid-cols-3 gap-2 text-sm">
                          <div>
                            <p className="text-muted-foreground">Emotion:</p>
                            <p className="capitalize">{post.desired_emotion}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Action:</p>
                            <p>{post.immediate_action}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Stage:</p>
                            <p className="capitalize">{post.journey_stage}</p>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground italic">
                          {post.content_direction}
                        </p>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-4">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStage(2)}
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Strategy
                </Button>
                <Button
                  size="lg"
                  onClick={() => toast.info("Copy generation coming in future session!")}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Copy (Coming Soon)
                </Button>
              </div>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CampaignWorking;
