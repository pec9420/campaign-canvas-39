import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { generateMockCampaign } from "@/data/mockCampaigns";
import { PRELOADED_PROFILES } from "@/data/profiles";

const CampaignTest = () => {
  const navigate = useNavigate();
  const [campaign, setCampaign] = useState<any>(null);

  useEffect(() => {
    // Test with Stack Creamery profile
    const profile = PRELOADED_PROFILES["stack_creamery"];
    const goal = "Get more catering bookings";

    console.log("Generating test campaign with profile:", profile);
    const mockCampaign = generateMockCampaign(goal, profile);
    console.log("Generated campaign:", mockCampaign);
    setCampaign(mockCampaign);
  }, []);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-6">
        <Card className="p-12 max-w-md w-full text-center">
          <p className="text-lg text-muted-foreground">Loading test campaign...</p>
        </Card>
      </div>
    );
  }

  const profile = PRELOADED_PROFILES["stack_creamery"];

  return (
    <DashboardLayout
      title="Campaign Test"
      profile={profile}
      onSwitchBusiness={() => navigate("/")}
    >
      <div className="space-y-6">
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-4">Test Campaign Generated!</h2>
          <p className="text-muted-foreground mb-4">
            This is a test page to verify campaign generation works.
          </p>

          <div className="space-y-4">
            <div>
              <h3 className="font-semibold">Campaign Title:</h3>
              <p>{campaign.strategy?.overview?.title || "No title"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Objective:</h3>
              <p>{campaign.strategy?.overview?.objective || "No objective"}</p>
            </div>

            <div>
              <h3 className="font-semibold">Scripts Preview:</h3>
              <pre className="bg-muted p-4 rounded text-sm overflow-auto max-h-40">
                {campaign.scripts?.substring(0, 200) || "No scripts"}...
              </pre>
            </div>

            <Button onClick={() => navigate("/")}>
              Back to Home
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CampaignTest;