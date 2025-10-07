import { useState, useEffect } from "react";
import { getCurrentProfile } from "@/utils/storage";

const DashboardTest = () => {
  const [profile, setProfile] = useState<any>(null);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    try {
      console.log("DashboardTest - Loading profile...");
      const loadedProfile = getCurrentProfile();
      console.log("DashboardTest - Loaded profile:", loadedProfile);

      if (!loadedProfile) {
        setError("No profile found");
        return;
      }

      setProfile(loadedProfile);
    } catch (err) {
      console.error("DashboardTest - Error:", err);
      setError(String(err));
    }
  }, []);

  if (error) {
    return (
      <div style={{ padding: "20px", color: "red" }}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!profile) {
    return (
      <div style={{ padding: "20px" }}>
        <h1>Loading...</h1>
      </div>
    );
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Dashboard Test</h1>
      <h2>Profile Loaded: {profile.business_name}</h2>
      <pre>{JSON.stringify(profile, null, 2)}</pre>
    </div>
  );
};

export default DashboardTest;
