import { useNavigate } from "react-router-dom";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Download, Share2, Calendar, BarChart3 } from "lucide-react";
import { useEffect, useState } from "react";
import { getCurrentProfile } from "@/utils/storage";
import { BusinessProfile } from "@/data/profiles";

const CampaignSuccess = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<BusinessProfile | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const loadedProfile = await getCurrentProfile();
      if (!loadedProfile) {
        navigate("/");
        return;
      }
      setProfile(loadedProfile);
    };
    loadProfile();
  }, [navigate]);

  const handleSwitchBusiness = () => {
    navigate("/");
  };

  if (!profile) return null;

  return (
    <DashboardLayout
      title="Campaign Success"
      profile={profile}
      onSwitchBusiness={handleSwitchBusiness}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Success Header */}
        <Card className="p-8 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950 dark:to-emerald-950 border-green-200 dark:border-green-800">
          <div className="text-center space-y-4">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-500 rounded-full mb-4">
              <CheckCircle2 className="w-12 h-12 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-green-900 dark:text-green-100">
              🎉 Campaign Created Successfully!
            </h1>
            <p className="text-lg text-green-700 dark:text-green-300">
              Your social media campaign is ready to roll
            </p>
          </div>
        </Card>

        {/* Next Steps */}
        <Card className="p-8">
          <h2 className="text-2xl font-semibold mb-6">What's Next?</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Download Campaign */}
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <Download className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Download Campaign</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Export all posts as CSV or PDF for easy reference
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </Card>

            {/* Schedule Posts */}
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-purple-500/10 rounded-lg">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Schedule Posts</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Connect to Buffer, Hootsuite, or your scheduling tool
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </Card>

            {/* Share with Team */}
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-blue-500/10 rounded-lg">
                  <Share2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Share with Team</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Collaborate with your team or content creators
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </Card>

            {/* Track Performance */}
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer border-2 hover:border-primary">
              <div className="flex items-start space-x-4">
                <div className="p-3 bg-green-500/10 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-green-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">Track Performance</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Monitor engagement, reach, and conversions
                  </p>
                  <Button variant="outline" size="sm" disabled>
                    Coming Soon
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-semibold text-lg">Ready to create another?</h3>
              <p className="text-sm text-muted-foreground">
                You can create multiple campaigns for different goals
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => navigate("/dashboard")}>
                Back to Dashboard
              </Button>
              <Button onClick={() => navigate("/campaign")}>
                Create New Campaign
              </Button>
            </div>
          </div>
        </Card>

        {/* Pro Tips */}
        <Card className="p-6 bg-blue-50 dark:bg-blue-950 border-blue-200 dark:border-blue-800">
          <h3 className="font-semibold text-lg mb-4 text-blue-900 dark:text-blue-100">
            💡 Pro Tips for Success
          </h3>
          <ul className="space-y-3 text-sm text-blue-800 dark:text-blue-200">
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Post at optimal times for your audience (check platform insights)</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Engage with comments within the first hour to boost reach</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Track saves and shares - they're better indicators than likes</span>
            </li>
            <li className="flex items-start">
              <span className="mr-2">•</span>
              <span>Adjust your strategy based on what resonates with your audience</span>
            </li>
          </ul>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default CampaignSuccess;
