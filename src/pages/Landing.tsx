import { useNavigate } from "react-router-dom";
import { IceCream, Wrench, TestTube, Plus } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PRELOADED_PROFILES } from "@/data/profiles";
import { saveProfile } from "@/utils/storage";

const Landing = () => {
  const navigate = useNavigate();

  const handleSelectUser = (profileId: string) => {
    const profile = PRELOADED_PROFILES[profileId];
    
    if (profile.reset_on_load) {
      // Test user always starts fresh
      saveProfile(profile);
      navigate("/onboarding", { state: { profileId } });
    } else {
      // Existing profiles go to dashboard
      saveProfile(profile);
      navigate("/dashboard", { state: { profileId } });
    }
  };

  const handleNewBusiness = () => {
    navigate("/onboarding");
  };

  const users = [
    {
      id: "stack_creamery",
      icon: IceCream,
      name: "Stack Creamery",
      location: "Springfield, IL",
      color: "text-pink-500"
    },
    {
      id: "quick_fix_plumbing",
      icon: Wrench,
      name: "Quick Fix Plumbing",
      location: "Denver, CO",
      color: "text-blue-700"
    },
    {
      id: "test_user",
      icon: TestTube,
      name: "Test User",
      location: "Always starts fresh",
      color: "text-gray-500"
    }
  ];

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-3">
            Social Media Campaign Generator
          </h1>
          <p className="text-lg text-muted-foreground">
            Select a business or create a new one
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {users.map((user) => {
            const Icon = user.icon;
            return (
              <Card
                key={user.id}
                onClick={() => handleSelectUser(user.id)}
                className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-card border-border"
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className={`p-4 rounded-full bg-secondary ${user.color}`}>
                    <Icon className="w-8 h-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-card-foreground">
                      {user.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {user.location}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}

          <Card
            onClick={handleNewBusiness}
            className="p-6 cursor-pointer hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-card border-border border-dashed"
          >
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="p-4 rounded-full bg-secondary text-primary">
                <Plus className="w-8 h-8" />
              </div>
              <div>
                <h3 className="font-semibold text-card-foreground">
                  New Business
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Start fresh
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Landing;

