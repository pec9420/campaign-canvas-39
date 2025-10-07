import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { getProfile } from "@/utils/storage";
import { generateMockCampaign } from "@/data/mockCampaigns";

const CampaignSimple = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const searchParams = new URLSearchParams(location.search);
  const profileId = searchParams.get('profileId');
  const goal = searchParams.get('goal');

  const [loading, setLoading] = useState(true);
  const [campaign, setCampaign] = useState<any>(null);

  console.log("CampaignSimple - ProfileId:", profileId, "Goal:", goal);

  useEffect(() => {
    if (!profileId || !goal) {
      console.log("Missing profileId or goal");
      navigate("/");
      return;
    }

    const profile = getProfile(profileId);
    if (!profile) {
      console.log("Profile not found");
      navigate("/");
      return;
    }

    // Simulate campaign generation
    const generateCampaign = async () => {
      try {
        console.log("Generating campaign...");
        await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

        const mockCampaign = generateMockCampaign(goal, profile);
        console.log("Generated campaign:", mockCampaign);

        setCampaign(mockCampaign);
        setLoading(false);
      } catch (error) {
        console.error("Error generating campaign:", error);
        setLoading(false);
      }
    };

    generateCampaign();
  }, [profileId, goal, navigate]);

  const profile = profileId ? getProfile(profileId) : null;

  if (loading) {
    return (
      <DashboardLayout
        title="Generating Campaign"
        profile={profile}
        onSwitchBusiness={() => navigate("/")}
      >
        <div style={{ padding: '20px', backgroundColor: 'white', minHeight: '200px' }}>
          <h1>Loading...</h1>
          <p>Generating your campaign, please wait...</p>
        </div>
      </DashboardLayout>
    );
  }

  if (!campaign) {
    return (
      <DashboardLayout
        title="Campaign Error"
        profile={profile}
        onSwitchBusiness={() => navigate("/")}
      >
        <div style={{ padding: '20px', backgroundColor: 'white', minHeight: '200px' }}>
          <h1>Error</h1>
          <p>Failed to generate campaign</p>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout
      title="Campaign Results"
      profile={profile}
      onSwitchBusiness={() => navigate("/")}
    >
      <div style={{ padding: '20px', backgroundColor: 'white', minHeight: '400px' }}>
        <h1>Campaign Generated Successfully!</h1>
        <h2>Campaign Title: {campaign.strategy?.overview?.title || "No title"}</h2>
        <p><strong>Objective:</strong> {campaign.strategy?.overview?.objective || "No objective"}</p>
        <p><strong>Duration:</strong> {campaign.strategy?.overview?.duration || "No duration"}</p>

        <h3>Scripts Preview:</h3>
        <div style={{ backgroundColor: '#f5f5f5', padding: '10px', maxHeight: '200px', overflow: 'auto' }}>
          <pre>{campaign.scripts?.substring(0, 500) || "No scripts"}...</pre>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default CampaignSimple;