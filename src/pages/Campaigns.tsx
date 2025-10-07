import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { getProfile } from "@/utils/storage";
import { BusinessProfile } from "@/data/profiles";

const Campaigns = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileId = location.state?.profileId;

  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!profileId) {
        navigate("/");
        return;
      }

      const loadedProfile = await getProfile(profileId);
      if (!loadedProfile) {
        navigate("/");
        return;
      }

      setProfile(loadedProfile);
    };
    loadProfile();
  }, [profileId, navigate]);

  const handleSwitchBusiness = () => {
    navigate("/");
  };

  if (!profile) return null;

  return (
    <DashboardLayout
      title="Campaigns"
      profile={profile}
      onSwitchBusiness={handleSwitchBusiness}
    >
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-foreground mb-4">Campaigns</h1>
          <p className="text-lg text-muted-foreground">
            This page is coming soon. Here you'll be able to view and manage all your campaigns.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Campaigns;