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
import { Sparkles, ArrowLeft, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

const CampaignWorking = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [selectedPersona, setSelectedPersona] = useState<Persona | null>(null);
  const [campaignGoal, setCampaignGoal] = useState("");
  const [targetOutcome, setTargetOutcome] = useState("");
  const [duration, setDuration] = useState("14");
  const [loading, setLoading] = useState(false);
  const [loadingStep, setLoadingStep] = useState(1);

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

  const handlePersonaSelect = (persona: Persona) => {
    setSelectedPersona(persona);
  };

  const handleGenerateCampaign = async () => {
    if (!profile || !selectedPersona || !campaignGoal || !targetOutcome) {
      toast.error("Please fill in all fields and select a persona");
      return;
    }

    setLoading(true);
    setLoadingStep(1);

    try {
      // Simulate agent progress
      setTimeout(() => setLoadingStep(2), 2000);
      setTimeout(() => setLoadingStep(3), 4000);

      const { data, error } = await supabase.functions.invoke('generate-campaign', {
        body: {
          profile,
          persona: selectedPersona,
          brief: {
            campaign_goal: campaignGoal,
            target_outcome: targetOutcome,
            duration_days: parseInt(duration)
          }
        }
      });

      if (error) {
        console.error("Error generating campaign:", error);
        toast.error(error.message || "Failed to generate campaign");
        setLoading(false);
        return;
      }

      console.log("Campaign generated:", data);

      // Save to database
      const { data: savedCampaign, error: saveError } = await supabase
        .from('campaigns')
        .insert({
          profile_id: profile.id,
          persona_id: selectedPersona.id,
          campaign_goal: campaignGoal,
          target_outcome: targetOutcome,
          duration_days: parseInt(duration),
          strategy: data.strategy,
          status: 'draft'
        })
        .select()
        .single();

      if (saveError) {
        console.error("Error saving campaign:", saveError);
        toast.error("Failed to save campaign");
        setLoading(false);
        return;
      }

      toast.success("Campaign generated successfully! 🎉");
      
      // Navigate to results page
      navigate(`/campaign-results?campaignId=${savedCampaign.id}`);

    } catch (error) {
      console.error("Error:", error);
      toast.error("An error occurred while generating the campaign");
      setLoading(false);
    }
  };

  const handleSwitchBusiness = () => {
    navigate("/");
  };

  if (!profile) return null;

  if (loading) {
    const agents = [
      {
        id: 1,
        name: "Strategist",
        icon: "🧠",
        task: "Analyzing your brand and persona...",
        completed: loadingStep > 1,
        active: loadingStep === 1
      },
      {
        id: 2,
        name: "Content Creator",
        icon: "✍️",
        task: "Crafting platform-specific posts...",
        completed: loadingStep > 2,
        active: loadingStep === 2
      },
      {
        id: 3,
        name: "Performance Analyst",
        icon: "📊",
        task: "Setting KPIs and success metrics...",
        completed: loadingStep > 3,
        active: loadingStep === 3
      }
    ];

    return (
      <div className="min-h-screen bg-gradient-to-br from-primary/5 via-purple-500/5 to-background flex items-center justify-center p-6">
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm"></div>
        <Card className="relative z-10 p-12 max-w-lg w-full bg-card/95 backdrop-blur border shadow-2xl">
          <div className="text-center">
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

            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Creating Your Campaign
              </h2>
              <p className="text-lg text-muted-foreground">
                Our AI agents are working their magic...
              </p>
            </div>

            <div className="space-y-4">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={`flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                    agent.completed
                      ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
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
                        {agent.task}
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

  return (
    <DashboardLayout
      title="Create Campaign"
      profile={profile}
      onSwitchBusiness={handleSwitchBusiness}
    >
      <div className="max-w-4xl mx-auto space-y-6">
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
            Fill in the details below to generate a complete social media campaign
          </p>
        </div>

        {/* Campaign Brief Form */}
        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-4">Campaign Brief</h2>
              <p className="text-muted-foreground mb-6">
                Tell us what you want to achieve with this campaign
              </p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="campaign-goal">Campaign Goal</Label>
                <Textarea
                  id="campaign-goal"
                  placeholder="e.g., Increase weekend bookings by 20%"
                  value={campaignGoal}
                  onChange={(e) => setCampaignGoal(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="target-outcome">Target Outcome</Label>
                <Textarea
                  id="target-outcome"
                  placeholder="e.g., Get 50+ catering inquiries"
                  value={targetOutcome}
                  onChange={(e) => setTargetOutcome(e.target.value)}
                  rows={3}
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
          </div>
        </Card>

        {/* Persona Selection */}
        <Card className="p-8">
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold mb-2">Select Target Persona</h2>
              <p className="text-muted-foreground">
                Choose the audience you want to reach with this campaign
              </p>
            </div>

            {profile.personas && profile.personas.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profile.personas.map((persona) => (
                  <Card
                    key={persona.id}
                    className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                      selectedPersona?.id === persona.id
                        ? "border-2 border-primary bg-primary/5"
                        : "border border-border"
                    }`}
                    onClick={() => handlePersonaSelect(persona)}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-4xl">{persona.emoji}</span>
                          <div>
                            <h3 className="font-semibold text-lg">{persona.name}</h3>
                          </div>
                        </div>
                        {selectedPersona?.id === persona.id && (
                          <CheckCircle2 className="w-6 h-6 text-primary" />
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground">
                        {persona.who_are_they}
                      </p>

                      <div>
                        <p className="text-xs text-muted-foreground mb-2">Main Problem:</p>
                        <p className="text-sm font-medium">{persona.main_problem}</p>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {persona.platforms.map((platform) => (
                          <Badge key={platform} variant="secondary" className="text-xs">
                            {platform}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-12 bg-secondary rounded-lg">
                <p className="text-muted-foreground">
                  No personas found. Please add personas in your Brand Hub first.
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => navigate("/brand-hub")}
                >
                  Go to Brand Hub
                </Button>
              </div>
            )}
          </div>
        </Card>

        {/* Generate Button */}
        <div className="flex justify-end">
          <Button
            size="lg"
            onClick={handleGenerateCampaign}
            disabled={!selectedPersona || !campaignGoal || !targetOutcome || loading}
            className="w-full md:w-auto"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            Generate Campaign
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CampaignWorking;
