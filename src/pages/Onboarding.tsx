import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { ProgressStepper } from "@/components/ui/progress-stepper";
import { saveProfile, getProfile } from "@/utils/storage";
import { BusinessProfile } from "@/data/profiles";
import { ChevronLeft, ChevronRight, Building2, Palette, MessageSquare, Users, MapPin, Target, CheckCircle2 } from "lucide-react";

const Onboarding = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileId = location.state?.profileId;

  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<Partial<BusinessProfile>>({
    id: profileId || `profile_${Date.now()}`,
    business_name: "",
    niche: "",
    owner_name: "",
    brand_identity: {
      colors: [],
      personality: [],
      visual_style: ""
    },
    voice: {
      tones: [],
      loved_words: [],
      banned_words: []
    },
    locations: [],
    services: [],
    programs: [],
    content_rules: {
      show_owner: true,
      show_staff: true,
      show_customers: true,
      topics_to_avoid: []
    },
    audience: {
      primary: [],
      platforms: []
    }
  });

  useEffect(() => {
    const checkProfile = async () => {
      if (profileId) {
        const existing = await getProfile(profileId);
        if (existing && !(existing as any).reset_on_load) {
          navigate("/dashboard", { state: { profileId } });
        }
      }
    };
    checkProfile();
  }, [profileId, navigate]);

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
  };

  const handleBack = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSave = () => {
    saveProfile(formData as BusinessProfile);
    navigate("/dashboard", { state: { profileId: formData.id } });
  };

  const updateField = (path: string, value: any) => {
    setFormData(prev => {
      const keys = path.split(".");
      const newData = { ...prev };
      let current: any = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        current[keys[i]] = { ...current[keys[i]] };
        current = current[keys[i]];
      }
      
      current[keys[keys.length - 1]] = value;
      return newData;
    });
  };

  const toggleArrayItem = (path: string, item: string) => {
    const keys = path.split(".");
    let current: any = formData;
    for (const key of keys) {
      current = current[key];
    }
    const array = current || [];
    const newArray = array.includes(item)
      ? array.filter((i: string) => i !== item)
      : [...array, item];
    updateField(path, newArray);
  };

  const steps = [
    { id: 1, title: "Business", description: "Basic info" },
    { id: 2, title: "Brand", description: "Identity" },
    { id: 3, title: "Voice", description: "Tone & style" },
    { id: 4, title: "Content", description: "Rules" },
    { id: 5, title: "Audience", description: "Target" },
    { id: 6, title: "Review", description: "Confirm" }
  ];

  return (
    <div className="min-h-screen bg-background py-12 px-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            Set Up Your Business Profile
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help us understand your business so we can create the perfect social media campaigns for you.
          </p>
        </div>

        {/* Progress Stepper */}
        <div className="mb-16">
          <ProgressStepper steps={steps} currentStep={step} />
        </div>

        {/* Main Content Card */}
        <Card className="max-w-2xl mx-auto p-8 bg-card border-border shadow-lg">
          {step === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Building2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold text-card-foreground mb-2">Business Basics</h2>
                <p className="text-muted-foreground">Let's start with the essentials about your business</p>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="business_name">Business Name</Label>
                <Input
                  id="business_name"
                  value={formData.business_name}
                  onChange={(e) => updateField("business_name", e.target.value)}
                  placeholder="e.g., Joe's Coffee Shop"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="niche">Business Type</Label>
                <Input
                  id="niche"
                  value={formData.niche}
                  onChange={(e) => updateField("niche", e.target.value)}
                  placeholder="e.g., coffee shop, yoga studio"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="owner_name">Owner Name</Label>
                <Input
                  id="owner_name"
                  value={formData.owner_name}
                  onChange={(e) => updateField("owner_name", e.target.value)}
                  placeholder="Your name"
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-card-foreground mb-6">Brand Identity</h2>
              
              <div className="space-y-2">
                <Label>Brand Colors (select 2-3)</Label>
                <div className="grid grid-cols-6 gap-3">
                  {["#3B82F6", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6", "#EC4899", "#14B8A6", "#F97316"].map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        const colors = formData.brand_identity?.colors || [];
                        if (colors.includes(color)) {
                          updateField("brand_identity.colors", colors.filter(c => c !== color));
                        } else if (colors.length < 3) {
                          updateField("brand_identity.colors", [...colors, color]);
                        }
                      }}
                      className={`w-12 h-12 rounded-lg border-2 transition-all ${
                        formData.brand_identity?.colors?.includes(color)
                          ? "border-primary scale-110"
                          : "border-border"
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Brand Personality</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["Playful", "Professional", "Bold", "Elegant", "Fun", "Serious", "Quirky", "Reliable", "Nostalgic", "Modern"].map((trait) => (
                    <div key={trait} className="flex items-center space-x-2">
                      <Checkbox
                        id={trait}
                        checked={formData.brand_identity?.personality?.includes(trait.toLowerCase())}
                        onCheckedChange={() => toggleArrayItem("brand_identity.personality", trait.toLowerCase())}
                      />
                      <Label htmlFor={trait} className="cursor-pointer">{trait}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Visual Style</Label>
                <RadioGroup
                  value={formData.brand_identity?.visual_style}
                  onValueChange={(value) => updateField("brand_identity.visual_style", value)}
                >
                  {["pop_art", "minimalist", "vintage", "modern", "rustic", "clean"].map((style) => (
                    <div key={style} className="flex items-center space-x-2">
                      <RadioGroupItem value={style} id={style} />
                      <Label htmlFor={style} className="cursor-pointer capitalize">{style.replace("_", "-")}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-card-foreground mb-6">Voice & Tone</h2>
              
              <div className="space-y-3">
                <Label>Tone (select all that apply)</Label>
                <div className="space-y-2">
                  {[
                    { value: "fun_playful", label: "Fun & Playful" },
                    { value: "professional_polished", label: "Professional & Polished" },
                    { value: "warm_friendly", label: "Warm & Friendly" },
                    { value: "bold_edgy", label: "Bold & Edgy" }
                  ].map((tone) => (
                    <div key={tone.value} className="flex items-center space-x-2">
                      <Checkbox
                        id={tone.value}
                        checked={formData.voice?.tones?.includes(tone.value)}
                        onCheckedChange={() => toggleArrayItem("voice.tones", tone.value)}
                      />
                      <Label htmlFor={tone.value} className="cursor-pointer">{tone.label}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="loved_words">Words You Love Using</Label>
                <Input
                  id="loved_words"
                  placeholder="e.g., amazing, fresh, authentic (comma separated)"
                  value={formData.voice?.loved_words?.join(", ")}
                  onChange={(e) => updateField("voice.loved_words", e.target.value.split(",").map(w => w.trim()))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="banned_words">Words to Avoid</Label>
                <Input
                  id="banned_words"
                  placeholder="e.g., cheap, discount (comma separated)"
                  value={formData.voice?.banned_words?.join(", ")}
                  onChange={(e) => updateField("voice.banned_words", e.target.value.split(",").map(w => w.trim()))}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-card-foreground mb-6">Content Rules</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <Label htmlFor="show_owner" className="cursor-pointer">Can we show owner's face?</Label>
                  <Checkbox
                    id="show_owner"
                    checked={formData.content_rules?.show_owner}
                    onCheckedChange={(checked) => updateField("content_rules.show_owner", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <Label htmlFor="show_staff" className="cursor-pointer">Can we show staff?</Label>
                  <Checkbox
                    id="show_staff"
                    checked={formData.content_rules?.show_staff}
                    onCheckedChange={(checked) => updateField("content_rules.show_staff", checked)}
                  />
                </div>

                <div className="flex items-center justify-between p-4 bg-secondary rounded-lg">
                  <Label htmlFor="show_customers" className="cursor-pointer">Can we show customers?</Label>
                  <Checkbox
                    id="show_customers"
                    checked={formData.content_rules?.show_customers}
                    onCheckedChange={(checked) => updateField("content_rules.show_customers", checked)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="topics_avoid">Topics to Avoid</Label>
                <Textarea
                  id="topics_avoid"
                  placeholder="Enter any sensitive topics to avoid..."
                  value={formData.content_rules?.topics_to_avoid?.join("\n")}
                  onChange={(e) => updateField("content_rules.topics_to_avoid", e.target.value.split("\n").filter(Boolean))}
                  rows={4}
                />
              </div>
            </div>
          )}

          {step === 6 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-card-foreground mb-6">Target Audience</h2>
              
              <div className="space-y-3">
                <Label>Primary Customers</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["Families", "College students", "Young professionals", "Retirees", "Event planners", "Homeowners", "Property managers", "Small businesses", "Corporate clients"].map((audience) => (
                    <div key={audience} className="flex items-center space-x-2">
                      <Checkbox
                        id={audience}
                        checked={formData.audience?.primary?.includes(audience.toLowerCase())}
                        onCheckedChange={() => toggleArrayItem("audience.primary", audience.toLowerCase())}
                      />
                      <Label htmlFor={audience} className="cursor-pointer">{audience}</Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <Label>Social Media Platforms</Label>
                <div className="grid grid-cols-2 gap-3">
                  {["Instagram", "TikTok", "Facebook", "LinkedIn", "Twitter", "Pinterest"].map((platform) => (
                    <div key={platform} className="flex items-center space-x-2">
                      <Checkbox
                        id={platform}
                        checked={formData.audience?.platforms?.includes(platform.toLowerCase())}
                        onCheckedChange={() => toggleArrayItem("audience.platforms", platform.toLowerCase())}
                      />
                      <Label htmlFor={platform} className="cursor-pointer">{platform}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 7 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-semibold text-card-foreground mb-6">Review & Confirm</h2>
              
              <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="font-semibold mb-2">Business</h3>
                  <p className="text-sm text-muted-foreground">
                    {formData.business_name} • {formData.niche}<br />
                    Owner: {formData.owner_name}<br />
                    Locations: {formData.locations?.join(", ") || "Not set"}
                  </p>
                </div>

                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="font-semibold mb-2">Brand Identity</h3>
                  <p className="text-sm text-muted-foreground">
                    Style: {formData.brand_identity?.visual_style}<br />
                    Personality: {formData.brand_identity?.personality?.join(", ")}
                  </p>
                </div>

                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="font-semibold mb-2">Voice</h3>
                  <p className="text-sm text-muted-foreground">
                    Tones: {formData.voice?.tones?.join(", ")?.replace(/_/g, " ")}
                  </p>
                </div>

                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="font-semibold mb-2">Services</h3>
                  <p className="text-sm text-muted-foreground">
                    {formData.services?.join(", ") || "Not set"}
                  </p>
                </div>

                <div className="p-4 bg-secondary rounded-lg">
                  <h3 className="font-semibold mb-2">Audience</h3>
                  <p className="text-sm text-muted-foreground">
                    {formData.audience?.primary?.join(", ")}<br />
                    Platforms: {formData.audience?.platforms?.join(", ")}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-border">
            {step > 1 ? (
              <Button variant="outline" onClick={handleBack} size="lg">
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            ) : (
              <Button variant="ghost" onClick={() => navigate("/")} size="lg">
                ← Return Home
              </Button>
            )}

            {step < 6 ? (
              <Button onClick={handleNext} size="lg" className="px-8">
                Continue
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button onClick={handleSave} size="lg" className="bg-success hover:bg-success/90 px-8">
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Complete Setup
              </Button>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Onboarding;
