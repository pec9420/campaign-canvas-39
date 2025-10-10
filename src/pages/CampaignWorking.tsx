import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { getCurrentProfile, saveCampaign } from "@/utils/storage";
import { BusinessProfile, Persona } from "@/data/profiles";
import { supabase } from "@/integrations/supabase/client";
import { Sparkles, ArrowLeft, CheckCircle2, Check, Edit, Info, ChevronDown, X, Plus } from "lucide-react";
import { toast } from "sonner";
import { Separator } from "@/components/ui/separator";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

const CampaignWorking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [campaignGoal, setCampaignGoal] = useState("");
  const [targetOutcome, setTargetOutcome] = useState("");
  const [duration, setDuration] = useState("14");

  // Multi-stage flow state
  const [currentStage, setCurrentStage] = useState(1); // 1 = Brief, 2 = Strategy, 3 = Calendar, 4 = Copy Review
  const [loading, setLoading] = useState(false);
  const [personaStrategies, setPersonaStrategies] = useState<any>(null); // Stage 1 results
  const [contentCalendar, setContentCalendar] = useState<any>(null); // Stage 2 results
  const [selectedPersona, setSelectedPersona] = useState<any>(null); // For detail modal
  const [expandedPosts, setExpandedPosts] = useState<Set<string>>(new Set()); // For expandable table rows

  // Stage 4: Copy Review state
  const [generatedCopy, setGeneratedCopy] = useState<any[]>([]); // Array of PostCopy objects
  const [currentPostIndex, setCurrentPostIndex] = useState(0); // Which post is being viewed
  const [approvedPosts, setApprovedPosts] = useState<Set<number>>(new Set()); // Track approved post indices

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

  // Stage 3: Generate copy for all posts
  const handleGenerateAllCopy = async () => {
    if (!profile || !contentCalendar || !personaStrategies) {
      toast.error("Missing required data");
      return;
    }

    setLoading(true);

    try {
      const posts = contentCalendar.content_calendar?.posts || [];
      const copyResults = [];

      for (let i = 0; i < posts.length; i++) {
        const post = posts[i];

        // Find the matching persona strategy
        const personaStrategy = personaStrategies.persona_strategies.find(
          (ps: any) => ps.persona_name === post.target_persona
        );

        console.log(`Generating copy for post ${i + 1}/${posts.length}...`);

        const { data, error } = await supabase.functions.invoke('generate-campaign', {
          body: {
            stage: 'copywriter',
            profile,
            persona: personaStrategy,
            postStrategy: post
          }
        });

        if (error) {
          console.error(`Error generating copy for post ${i + 1}:`, error);
          toast.error(`Failed to generate copy for post ${i + 1}`);
          setLoading(false);
          return;
        }

        copyResults.push({
          post_id: post.post_id || `post-${i}`,
          day: post.day,
          platform: post.platform,
          format: post.format,
          persona: post.target_persona,
          persona_emoji: personaStrategy?.persona_emoji || "",
          key_message: post.key_message,
          desired_emotion: post.desired_emotion,
          immediate_action: post.immediate_action,
          hook: data.hook || "",
          script: data.script || "",
          hashtags: data.hashtags?.join(" ") || "",
          visual_direction: data.visual_direction || post.content_direction || "",
          approved: false,
          edited: false
        });
      }

      setGeneratedCopy(copyResults);
      setCurrentStage(4);
      setCurrentPostIndex(0);
      setApprovedPosts(new Set());
      toast.success(`Generated copy for ${copyResults.length} posts!`);

    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during copy generation");
    } finally {
      setLoading(false);
    }
  };

  const handleSwitchBusiness = () => {
    navigate("/");
  };

  const togglePostExpand = (postId: string) => {
    setExpandedPosts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(postId)) {
        newSet.delete(postId);
      } else {
        newSet.add(postId);
      }
      return newSet;
    });
  };

  // Update persona strategy field
  const updatePersonaField = (index: number, field: string, value: any) => {
    if (!personaStrategies) return;
    const updated = { ...personaStrategies };
    updated.persona_strategies[index] = {
      ...updated.persona_strategies[index],
      [field]: value
    };
    setPersonaStrategies(updated);
  };

  // Remove persona from strategy
  const removePersona = (index: number) => {
    if (!personaStrategies) return;
    const updated = { ...personaStrategies };
    updated.persona_strategies.splice(index, 1);
    setPersonaStrategies(updated);
  };

  // Add persona to strategy
  const addPersona = (persona: Persona) => {
    if (!personaStrategies) return;
    const updated = { ...personaStrategies };
    updated.persona_strategies.push({
      persona_name: persona.name,
      persona_emoji: persona.emoji,
      why_target_them: persona.who_are_they || "",
      key_message: persona.main_problem || "",
      desired_emotion: "curiosity",
      emotional_driver: "",
      immediate_action: "save_post",
      action_intent_level: "medium",
      platforms: persona.platforms || [],
      expected_outcome: ""
    });
    setPersonaStrategies(updated);
  };

  // Validate persona strategies
  const isStrategyValid = () => {
    if (!personaStrategies?.persona_strategies?.length) return false;
    return personaStrategies.persona_strategies.every((ps: any) =>
      ps.key_message?.trim() &&
      ps.platforms?.length > 0 &&
      ps.desired_emotion &&
      ps.immediate_action &&
      ps.action_intent_level
    );
  };

  // Update copy field
  const updateCopyField = (index: number, field: string, value: string) => {
    const updated = [...generatedCopy];
    updated[index] = {
      ...updated[index],
      [field]: value,
      edited: true
    };
    setGeneratedCopy(updated);
  };

  // Approve post and move to next
  const approvePost = async (index: number) => {
    const newApproved = new Set(approvedPosts);
    newApproved.add(index);
    setApprovedPosts(newApproved);

    toast.success(`Post ${index + 1} approved!`);

    // Check if all posts are now approved
    if (newApproved.size === generatedCopy.length) {
      // All posts approved - save campaign
      if (profile) {
        const completeCampaign = {
          goal: campaignGoal,
          target_outcome: targetOutcome,
          duration_days: parseInt(duration),
          persona_strategies: personaStrategies,
          content_calendar: contentCalendar,
          generated_copy: generatedCopy,
          status: 'approved'
        };

        try {
          const campaignId = await saveCampaign(profile.id, completeCampaign);
          toast.success("Campaign saved successfully!");

          // Navigate to success page
          setTimeout(() => {
            navigate(`/campaign-success?campaignId=${campaignId}`);
          }, 1000);
        } catch (error) {
          console.error("Error saving campaign:", error);
          toast.error("Failed to save campaign. Please try again.");
        }
      }
      return;
    }

    // Move to next post if not the last one
    if (index < generatedCopy.length - 1) {
      setCurrentPostIndex(index + 1);
    }
  };

  // Regenerate copy for a specific post
  const regeneratePost = async (index: number) => {
    if (!profile || !contentCalendar || !personaStrategies) return;

    setLoading(true);

    try {
      const posts = contentCalendar.content_calendar?.posts || [];
      const post = posts[index];

      const personaStrategy = personaStrategies.persona_strategies.find(
        (ps: any) => ps.persona_name === post.target_persona
      );

      const { data, error } = await supabase.functions.invoke('generate-campaign', {
        body: {
          stage: 'copywriter',
          profile,
          persona: personaStrategy,
          postStrategy: post
        }
      });

      if (error) {
        console.error(`Error regenerating copy:`, error);
        toast.error(`Failed to regenerate copy`);
        setLoading(false);
        return;
      }

      const updated = [...generatedCopy];
      updated[index] = {
        ...updated[index],
        hook: data.hook || "",
        script: data.script || "",
        hashtags: data.hashtags?.join(" ") || "",
        visual_direction: data.visual_direction || post.content_direction || "",
        edited: false
      };

      setGeneratedCopy(updated);
      toast.success("Copy regenerated!");

    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred during regeneration");
    } finally {
      setLoading(false);
    }
  };

  // Approve all remaining posts and save campaign
  const approveAllRemaining = async () => {
    if (!profile) return;

    const allIndices = new Set(generatedCopy.map((_, i) => i));
    setApprovedPosts(allIndices);

    // Save the complete campaign
    const completeCampaign = {
      goal: campaignGoal,
      target_outcome: targetOutcome,
      duration_days: parseInt(duration),
      persona_strategies: personaStrategies,
      content_calendar: contentCalendar,
      generated_copy: generatedCopy,
      status: 'approved'
    };

    try {
      const campaignId = await saveCampaign(profile.id, completeCampaign);
      toast.success("Campaign saved successfully!");

      // Navigate to campaign success page
      navigate(`/campaign-success?campaignId=${campaignId}`);
    } catch (error) {
      console.error("Error saving campaign:", error);
      toast.error("Failed to save campaign. Please try again.");
    }
  };

  if (!profile) return null;

  // Loading overlay
  if (loading) {
    const loadingMessage = currentStage === 1
      ? "Analyzing your business goal and recommending persona strategies..."
      : currentStage === 2
      ? "Generating content calendar with strategic posts..."
      : "Writing natural, human-sounding copy for your posts...";

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
    { number: 4, label: "Copy Review", completed: currentStage > 4 },
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg">Recommended Personas</h3>

                  {/* Add Persona Dropdown */}
                  {profile.personas && profile.personas.length > 0 && (
                    <Select
                      onValueChange={(personaId) => {
                        const persona = profile.personas?.find(p => p.id === personaId);
                        if (persona) addPersona(persona);
                      }}
                    >
                      <SelectTrigger className="w-48">
                        <Plus className="w-4 h-4 mr-2" />
                        <SelectValue placeholder="Add Persona" />
                      </SelectTrigger>
                      <SelectContent>
                        {profile.personas
                          .filter(p => !personaStrategies.persona_strategies?.some((ps: any) => ps.persona_name === p.name))
                          .map((persona) => (
                            <SelectItem key={persona.id} value={persona.id}>
                              {persona.emoji} {persona.name}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>

                <div className="space-y-4">
                  {personaStrategies.persona_strategies?.map((ps: any, index: number) => (
                    <Card key={index} className="p-6 border-l-4 border-l-primary">
                      <div className="space-y-4">
                        {/* Header with Remove Button */}
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <span className="text-3xl">{ps.persona_emoji}</span>
                            <h4 className="font-semibold text-lg">{ps.persona_name}</h4>
                          </div>
                          {personaStrategies.persona_strategies.length > 1 && (
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => removePersona(index)}
                              className="text-destructive hover:text-destructive"
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          )}
                        </div>

                        {/* Key Message */}
                        <div className="space-y-2">
                          <Label htmlFor={`key-message-${index}`}>Key Message *</Label>
                          <Textarea
                            id={`key-message-${index}`}
                            value={ps.key_message}
                            onChange={(e) => updatePersonaField(index, 'key_message', e.target.value)}
                            rows={2}
                            className="text-sm"
                          />
                        </div>

                        {/* Why Target Them */}
                        <div className="space-y-2">
                          <Label htmlFor={`why-target-${index}`}>Why Target Them</Label>
                          <Textarea
                            id={`why-target-${index}`}
                            value={ps.why_target_them}
                            onChange={(e) => updatePersonaField(index, 'why_target_them', e.target.value)}
                            rows={2}
                            className="text-sm"
                          />
                        </div>

                        {/* Emotion and Action Selects */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`emotion-${index}`}>Desired Emotion *</Label>
                            <Select
                              value={ps.desired_emotion}
                              onValueChange={(value) => updatePersonaField(index, 'desired_emotion', value)}
                            >
                              <SelectTrigger id={`emotion-${index}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="curiosity">Curiosity</SelectItem>
                                <SelectItem value="FOMO">FOMO</SelectItem>
                                <SelectItem value="excitement">Excitement</SelectItem>
                                <SelectItem value="trust">Trust</SelectItem>
                                <SelectItem value="urgency">Urgency</SelectItem>
                                <SelectItem value="anticipation">Anticipation</SelectItem>
                                <SelectItem value="inspiration">Inspiration</SelectItem>
                                <SelectItem value="relief">Relief</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`action-${index}`}>Immediate Action *</Label>
                            <Select
                              value={ps.immediate_action}
                              onValueChange={(value) => updatePersonaField(index, 'immediate_action', value)}
                            >
                              <SelectTrigger id={`action-${index}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="save_post">Save Post</SelectItem>
                                <SelectItem value="share">Share</SelectItem>
                                <SelectItem value="click_link">Click Link</SelectItem>
                                <SelectItem value="dm_question">DM Question</SelectItem>
                                <SelectItem value="tag_friend">Tag Friend</SelectItem>
                                <SelectItem value="comment">Comment</SelectItem>
                                <SelectItem value="visit_profile">Visit Profile</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Emotional Driver */}
                        <div className="space-y-2">
                          <Label htmlFor={`driver-${index}`}>Emotional Driver</Label>
                          <Textarea
                            id={`driver-${index}`}
                            value={ps.emotional_driver || ''}
                            onChange={(e) => updatePersonaField(index, 'emotional_driver', e.target.value)}
                            rows={2}
                            className="text-sm"
                            placeholder="What psychological driver creates this emotion?"
                          />
                        </div>

                        {/* Intent Level and Expected Outcome */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <Label htmlFor={`intent-${index}`}>Action Intent Level *</Label>
                            <Select
                              value={ps.action_intent_level}
                              onValueChange={(value) => updatePersonaField(index, 'action_intent_level', value)}
                            >
                              <SelectTrigger id={`intent-${index}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="high">High</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="low">Low</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor={`outcome-${index}`}>Expected Outcome</Label>
                            <Input
                              id={`outcome-${index}`}
                              value={ps.expected_outcome || ''}
                              onChange={(e) => updatePersonaField(index, 'expected_outcome', e.target.value)}
                              placeholder="e.g., 20-30 couples, weekend traffic"
                              className="text-sm"
                            />
                          </div>
                        </div>

                        {/* Platforms */}
                        <div className="space-y-2">
                          <Label>Target Platforms *</Label>
                          <div className="flex flex-wrap gap-4">
                            {['instagram', 'facebook', 'tiktok', 'linkedin', 'twitter', 'youtube'].map((platform) => (
                              <div key={platform} className="flex items-center space-x-2">
                                <Checkbox
                                  id={`platform-${index}-${platform}`}
                                  checked={ps.platforms?.includes(platform)}
                                  onCheckedChange={(checked) => {
                                    const platforms = ps.platforms || [];
                                    const updated = checked
                                      ? [...platforms, platform]
                                      : platforms.filter((p: string) => p !== platform);
                                    updatePersonaField(index, 'platforms', updated);
                                  }}
                                />
                                <label
                                  htmlFor={`platform-${index}-${platform}`}
                                  className="text-sm capitalize cursor-pointer"
                                >
                                  {platform}
                                </label>
                              </div>
                            ))}
                          </div>
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

              {!isStrategyValid() && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    ⚠️ Please complete all required fields (*) before generating the content calendar:
                  </p>
                  <ul className="text-xs text-yellow-700 mt-2 ml-4 list-disc">
                    <li>Key Message</li>
                    <li>Desired Emotion</li>
                    <li>Immediate Action</li>
                    <li>Action Intent Level</li>
                    <li>At least 1 platform selected</li>
                  </ul>
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
                  disabled={loading || !isStrategyValid()}
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

              {/* Campaign Overview Stats */}
              {contentCalendar.content_calendar?.overview && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Total Posts</p>
                    <p className="text-2xl font-bold">{contentCalendar.content_calendar.overview.total_posts}</p>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-2">Platforms</p>
                    <div className="flex flex-wrap gap-1">
                      {Object.entries(contentCalendar.content_calendar.overview.platform_breakdown || {}).map(
                        ([platform, count]: [string, any]) => (
                          <Badge key={platform} variant="secondary" className="text-xs">
                            {platform}: {count}
                          </Badge>
                        )
                      )}
                    </div>
                  </div>
                  <div className="bg-muted/50 p-4 rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Strategy Flow</p>
                    <p className="text-xs">{contentCalendar.content_calendar.overview.flow}</p>
                  </div>
                </div>
              )}

              {/* Journey Timeline */}
              {(() => {
                const posts = contentCalendar.content_calendar?.posts || [];
                const awarenessCount = posts.filter((p: any) => p.journey_stage === 'awareness').length;
                const considerationCount = posts.filter((p: any) => p.journey_stage === 'consideration').length;
                const conversionCount = posts.filter((p: any) => p.journey_stage === 'conversion').length;
                const totalPosts = posts.length;

                const awarenessWidth = totalPosts > 0 ? (awarenessCount / totalPosts) * 100 : 0;
                const considerationWidth = totalPosts > 0 ? (considerationCount / totalPosts) * 100 : 0;
                const conversionWidth = totalPosts > 0 ? (conversionCount / totalPosts) * 100 : 0;

                return (
                  <div className="space-y-3">
                    <h3 className="font-semibold text-sm">Campaign Journey</h3>
                    <div className="flex h-12 rounded-lg overflow-hidden border border-border">
                      {awarenessWidth > 0 && (
                        <div
                          className="bg-blue-500 flex items-center justify-center text-white text-xs font-medium px-2"
                          style={{ width: `${awarenessWidth}%` }}
                        >
                          {awarenessWidth > 15 && `Awareness (${awarenessCount})`}
                        </div>
                      )}
                      {considerationWidth > 0 && (
                        <div
                          className="bg-yellow-500 flex items-center justify-center text-white text-xs font-medium px-2"
                          style={{ width: `${considerationWidth}%` }}
                        >
                          {considerationWidth > 15 && `Consideration (${considerationCount})`}
                        </div>
                      )}
                      {conversionWidth > 0 && (
                        <div
                          className="bg-green-500 flex items-center justify-center text-white text-xs font-medium px-2"
                          style={{ width: `${conversionWidth}%` }}
                        >
                          {conversionWidth > 15 && `Conversion (${conversionCount})`}
                        </div>
                      )}
                    </div>
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>🔵 Build curiosity</span>
                      <span>🟡 Build trust</span>
                      <span>🟢 Drive action</span>
                    </div>
                  </div>
                );
              })()}

              <Separator />

              {/* Content Table */}
              <div>
                <h3 className="font-semibold text-lg mb-4">Content Posts</h3>
                <div className="border border-border rounded-lg overflow-hidden">
                  {/* Table Header */}
                  <div className="grid grid-cols-12 gap-4 bg-muted p-3 text-sm font-medium">
                    <div className="col-span-1">Day</div>
                    <div className="col-span-2">Platform</div>
                    <div className="col-span-1">Format</div>
                    <div className="col-span-2">Persona</div>
                    <div className="col-span-4">Key Message</div>
                    <div className="col-span-2">Stage</div>
                  </div>

                  {/* Table Rows */}
                  <div className="divide-y divide-border">
                    {contentCalendar.content_calendar?.posts?.map((post: any, index: number) => {
                      const postId = `${post.post_id || index}`;
                      const isExpanded = expandedPosts.has(postId);

                      return (
                        <div key={index}>
                          {/* Main Row */}
                          <div
                            className="grid grid-cols-12 gap-4 p-3 hover:bg-muted/50 cursor-pointer transition-colors text-sm"
                            onClick={() => togglePostExpand(postId)}
                          >
                            <div className="col-span-1 font-medium">
                              <Badge variant="outline" className="text-xs">{post.day}</Badge>
                            </div>
                            <div className="col-span-2">
                              <Badge variant="secondary" className="text-xs">{post.platform}</Badge>
                            </div>
                            <div className="col-span-1 text-muted-foreground capitalize text-xs">
                              {post.format}
                            </div>
                            <div className="col-span-2 text-xs">
                              {post.target_persona}
                            </div>
                            <div className="col-span-4 text-xs line-clamp-1">
                              {post.key_message}
                            </div>
                            <div className="col-span-2 flex items-center justify-between">
                              <Badge
                                className={`text-xs ${
                                  post.journey_stage === 'awareness' ? 'bg-blue-500' :
                                  post.journey_stage === 'consideration' ? 'bg-yellow-500' :
                                  'bg-green-500'
                                }`}
                              >
                                {post.journey_stage}
                              </Badge>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? 'rotate-180' : ''
                                }`}
                              />
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div className="bg-muted/30 p-4 border-t border-border animate-in slide-in-from-top-2 duration-200">
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Emotional Hook:</p>
                                  <p className="text-sm">{post.emotional_hook || post.desired_emotion}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Immediate Action:</p>
                                  <p className="text-sm font-medium">{post.immediate_action}</p>
                                </div>
                                <div className="md:col-span-2">
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Content Direction:</p>
                                  <p className="text-sm italic text-muted-foreground">{post.content_direction}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Engagement Goal:</p>
                                  <p className="text-sm">{post.engagement_goal || 'N/A'}</p>
                                </div>
                                <div>
                                  <p className="text-xs font-medium text-muted-foreground mb-1">Primary Metric:</p>
                                  <p className="text-sm capitalize">{post.primary_metric || post.immediate_action}</p>
                                </div>
                                {post.cta_goal && (
                                  <div className="md:col-span-2">
                                    <p className="text-xs font-medium text-muted-foreground mb-1">CTA Strategy:</p>
                                    <p className="text-sm">{post.cta_goal} - {post.cta_rationale}</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
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
                  onClick={handleGenerateAllCopy}
                  disabled={loading}
                >
                  <Sparkles className="w-5 h-5 mr-2" />
                  Generate Copy for All Posts
                </Button>
              </div>
            </div>
          </Card>
        )}

        {/* Stage 4: Copy Review */}
        {currentStage === 4 && generatedCopy.length > 0 && (
          <Card className="p-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-semibold mb-2">Stage 4: Copy Review</h2>
                  <p className="text-muted-foreground">
                    Review and edit each post's copy
                  </p>
                </div>
                <Button
                  onClick={approveAllRemaining}
                  variant="outline"
                  disabled={approvedPosts.size === generatedCopy.length}
                >
                  <CheckCircle2 className="w-4 h-4 mr-2" />
                  Approve All Remaining
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Progress</span>
                  <span className="font-medium">{approvedPosts.size}/{generatedCopy.length} approved</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary rounded-full h-2 transition-all duration-300"
                    style={{ width: `${(approvedPosts.size / generatedCopy.length) * 100}%` }}
                  />
                </div>
              </div>

              {/* Horizontal Scrollable Carousel */}
              <div className="space-y-4">
                <h3 className="text-sm font-medium text-muted-foreground">Posts</h3>
                <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-thin">
                  {generatedCopy.map((post, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentPostIndex(index)}
                      className={`flex-shrink-0 w-32 p-3 rounded-lg border-2 transition-all ${
                        currentPostIndex === index
                          ? 'border-primary bg-primary/5'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <Badge variant="outline" className="text-xs">Day {post.day}</Badge>
                          {approvedPosts.has(index) ? (
                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                          ) : currentPostIndex === index ? (
                            <div className="w-4 h-4 rounded-full bg-primary" />
                          ) : (
                            <div className="w-4 h-4 rounded-full bg-muted" />
                          )}
                        </div>
                        <Badge variant="secondary" className="text-xs w-full justify-center">
                          {post.platform}
                        </Badge>
                        <p className="text-xs text-muted-foreground text-center capitalize">
                          {post.format}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              <Separator />

              {/* Active Post Card */}
              {generatedCopy[currentPostIndex] && (
                <div className="space-y-6">
                  {/* Post Header */}
                  <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{generatedCopy[currentPostIndex].persona_emoji}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">Day {generatedCopy[currentPostIndex].day}</Badge>
                          <Badge variant="secondary">{generatedCopy[currentPostIndex].platform}</Badge>
                          <Badge className="capitalize">{generatedCopy[currentPostIndex].format}</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mt-1">
                          Target: {generatedCopy[currentPostIndex].persona}
                        </p>
                      </div>
                    </div>
                    <div className="text-right text-sm">
                      <p className="font-medium">
                        Post {currentPostIndex + 1} of {generatedCopy.length}
                      </p>
                      {approvedPosts.has(currentPostIndex) && (
                        <p className="text-green-600 flex items-center gap-1">
                          <CheckCircle2 className="w-4 h-4" />
                          Approved
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Strategy Reminder */}
                  <div className="grid grid-cols-3 gap-4 p-4 bg-primary/5 rounded-lg border border-primary/20">
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">🎯 Message</p>
                      <p className="text-sm">{generatedCopy[currentPostIndex].key_message}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">❤️ Emotion</p>
                      <p className="text-sm capitalize">{generatedCopy[currentPostIndex].desired_emotion}</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-muted-foreground mb-1">🎬 Action</p>
                      <p className="text-sm">{generatedCopy[currentPostIndex].immediate_action}</p>
                    </div>
                  </div>

                  {/* Editable Copy Fields */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="hook" className="text-base">📝 Hook (Opening Line)</Label>
                      <Input
                        id="hook"
                        value={generatedCopy[currentPostIndex].hook}
                        onChange={(e) => updateCopyField(currentPostIndex, 'hook', e.target.value)}
                        className="text-base"
                        placeholder="e.g., wait omg have you been..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="script" className="text-base">📖 Script / Body</Label>
                      <Textarea
                        id="script"
                        value={generatedCopy[currentPostIndex].script}
                        onChange={(e) => updateCopyField(currentPostIndex, 'script', e.target.value)}
                        rows={6}
                        className="text-base"
                        placeholder="Main content of the post..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="hashtags" className="text-base">#️⃣ Hashtags</Label>
                      <Input
                        id="hashtags"
                        value={generatedCopy[currentPostIndex].hashtags}
                        onChange={(e) => updateCopyField(currentPostIndex, 'hashtags', e.target.value)}
                        className="text-base"
                        placeholder="#SpringfieldIL #DateNight"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label className="text-base">🎬 Visual Direction (for creator)</Label>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-sm text-muted-foreground italic">
                          {generatedCopy[currentPostIndex].visual_direction}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3 pt-4">
                    <Button
                      variant="outline"
                      onClick={() => regeneratePost(currentPostIndex)}
                      disabled={loading}
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      Regenerate
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() => approvePost(currentPostIndex)}
                      disabled={approvedPosts.has(currentPostIndex)}
                    >
                      <CheckCircle2 className="w-4 h-4 mr-2" />
                      {approvedPosts.has(currentPostIndex) ? 'Approved' : 'Approve & Continue'}
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
};

export default CampaignWorking;
