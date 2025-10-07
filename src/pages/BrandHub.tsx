import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { getProfile, saveProfile } from "@/utils/storage";
import { BusinessProfile } from "@/data/profiles";
import {
  Palette,
  Upload,
  X,
  Plus,
  Save,
  FileText,
  Image,
  File,
  CheckCircle2,
  Smile,
  Briefcase,
  Heart,
  Zap
} from "lucide-react";
import { toast } from "sonner";

const BrandHub = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const profileId = location.state?.profileId;

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (!profileId) {
      navigate("/dashboard");
      return;
    }

    const loadedProfile = getProfile(profileId);
    if (!loadedProfile) {
      navigate("/dashboard");
      return;
    }

    setProfile(loadedProfile);
  }, [profileId, navigate]);

  const handleSwitchBusiness = () => {
    navigate("/");
  };

  const handleSave = () => {
    if (profile && profileId) {
      saveProfile(profile);
      setHasChanges(false);
      toast.success("Brand profile saved successfully!");
    }
  };

  const updateProfile = (updates: Partial<BusinessProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
      setHasChanges(true);
    }
  };

  const addColor = (color: string) => {
    if (profile && color) {
      const newColors = [...profile.brand_identity.colors, color];
      updateProfile({
        brand_identity: {
          ...profile.brand_identity,
          colors: newColors
        }
      });
    }
  };

  const removeColor = (index: number) => {
    if (profile) {
      const newColors = profile.brand_identity.colors.filter((_, i) => i !== index);
      updateProfile({
        brand_identity: {
          ...profile.brand_identity,
          colors: newColors
        }
      });
    }
  };

  const addLovedWord = (word: string) => {
    if (profile && word && !profile.voice.loved_words.includes(word)) {
      updateProfile({
        voice: {
          ...profile.voice,
          loved_words: [...profile.voice.loved_words, word]
        }
      });
    }
  };

  const removeLovedWord = (word: string) => {
    if (profile) {
      updateProfile({
        voice: {
          ...profile.voice,
          loved_words: profile.voice.loved_words.filter(w => w !== word)
        }
      });
    }
  };

  const addBannedWord = (word: string) => {
    if (profile && word && !profile.voice.banned_words.includes(word)) {
      updateProfile({
        voice: {
          ...profile.voice,
          banned_words: [...profile.voice.banned_words, word]
        }
      });
    }
  };

  const removeBannedWord = (word: string) => {
    if (profile) {
      updateProfile({
        voice: {
          ...profile.voice,
          banned_words: profile.voice.banned_words.filter(w => w !== word)
        }
      });
    }
  };

  if (!profile) return null;

  const personalityOptions = [
    { id: "friendly", label: "Friendly", icon: Smile },
    { id: "professional", label: "Professional", icon: Briefcase },
    { id: "playful", label: "Playful", icon: Heart },
    { id: "energetic", label: "Energetic", icon: Zap }
  ];

  const toneOptions = [
    { id: "casual", label: "Casual", description: "Relaxed and approachable", emoji: "😊" },
    { id: "professional", label: "Professional", description: "Formal and authoritative", emoji: "💼" },
    { id: "friendly", label: "Friendly", description: "Warm and welcoming", emoji: "🤝" },
    { id: "playful", label: "Playful", description: "Fun and energetic", emoji: "🎉" }
  ];

  return (
    <DashboardLayout
      title="Brand Hub"
      profile={profile}
      onSwitchBusiness={handleSwitchBusiness}
    >
      <div className="space-y-6">
        {/* Save Indicator */}
        {hasChanges && (
          <div className="fixed top-20 right-6 z-50">
            <Card className="p-4 bg-amber-50 border-amber-200">
              <div className="flex items-center space-x-3">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-amber-800">Unsaved changes</span>
                <Button size="sm" onClick={handleSave}>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </Button>
              </div>
            </Card>
          </div>
        )}

        {/* Brand Identity Card */}
        <Card className="p-6">
          <div className="flex items-center space-x-3 mb-6">
            <Palette className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Brand Identity</h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Brand Colors */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Brand Colors</h3>
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  {profile.brand_identity.colors.map((color, index) => (
                    <div key={index} className="relative group">
                      <div
                        className="w-12 h-12 rounded-lg border-2 border-border cursor-pointer"
                        style={{ backgroundColor: color }}
                      >
                        <button
                          onClick={() => removeColor(index)}
                          className="absolute -top-2 -right-2 w-5 h-5 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                      <p className="text-xs text-center mt-1 font-mono">{color}</p>
                    </div>
                  ))}
                  <div className="w-12 h-12 border-2 border-dashed border-muted-foreground rounded-lg flex items-center justify-center">
                    <input
                      type="color"
                      className="w-8 h-8 rounded border-0 cursor-pointer"
                      onChange={(e) => addColor(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Personality Tags */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Brand Personality</h3>
              <div className="grid grid-cols-2 gap-3">
                {personalityOptions.map((option) => {
                  const Icon = option.icon;
                  const isSelected = profile.brand_identity.personality.includes(option.id);
                  return (
                    <div
                      key={option.id}
                      onClick={() => {
                        const newPersonality = isSelected
                          ? profile.brand_identity.personality.filter(p => p !== option.id)
                          : [...profile.brand_identity.personality, option.id];
                        updateProfile({
                          brand_identity: {
                            ...profile.brand_identity,
                            personality: newPersonality
                          }
                        });
                      }}
                      className={`p-3 rounded-lg border-2 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4" />
                        <span className="text-sm font-medium">{option.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>

        {/* Voice & Tone Card */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Voice & Tone</h2>

          <div className="space-y-8">
            {/* Tone Selection */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Voice Tone</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {toneOptions.map((tone) => (
                  <div
                    key={tone.id}
                    onClick={() => updateProfile({ voice: { ...profile.voice, tone: tone.id } })}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      profile.voice.tone === tone.id
                        ? 'border-primary bg-primary/5'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{tone.emoji}</div>
                      <h4 className="font-semibold">{tone.label}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{tone.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Word Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Loved Words */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Loved Words</h3>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {profile.voice.loved_words.map((word) => (
                      <Badge
                        key={word}
                        variant="secondary"
                        className="bg-green-100 text-green-800 hover:bg-green-200"
                      >
                        {word}
                        <button
                          onClick={() => removeLovedWord(word)}
                          className="ml-2 text-green-600 hover:text-green-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a word..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addLovedWord((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add a word..."]') as HTMLInputElement;
                        if (input?.value) {
                          addLovedWord(input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Banned Words */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Banned Words</h3>
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-2">
                    {profile.voice.banned_words.map((word) => (
                      <Badge
                        key={word}
                        variant="secondary"
                        className="bg-red-100 text-red-800 hover:bg-red-200"
                      >
                        {word}
                        <button
                          onClick={() => removeBannedWord(word)}
                          className="ml-2 text-red-600 hover:text-red-800"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex space-x-2">
                    <Input
                      placeholder="Add a banned word..."
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          addBannedWord((e.target as HTMLInputElement).value);
                          (e.target as HTMLInputElement).value = '';
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const input = document.querySelector('input[placeholder="Add a banned word..."]') as HTMLInputElement;
                        if (input?.value) {
                          addBannedWord(input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Content Rules Card */}
        <Card className="p-6">
          <h2 className="text-2xl font-bold mb-6">Content Rules</h2>

          <div className="space-y-6">
            {/* Toggle Switches */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="show-owner" className="text-sm font-medium">
                  Show owner face
                </Label>
                <Switch
                  id="show-owner"
                  checked={profile.content_rules.show_owner}
                  onCheckedChange={(checked) =>
                    updateProfile({
                      content_rules: {
                        ...profile.content_rules,
                        show_owner: checked
                      }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-staff" className="text-sm font-medium">
                  Show staff
                </Label>
                <Switch
                  id="show-staff"
                  checked={profile.content_rules.show_staff}
                  onCheckedChange={(checked) =>
                    updateProfile({
                      content_rules: {
                        ...profile.content_rules,
                        show_staff: checked
                      }
                    })
                  }
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="show-customers" className="text-sm font-medium">
                  Show customers
                </Label>
                <Switch
                  id="show-customers"
                  checked={profile.content_rules.show_customers}
                  onCheckedChange={(checked) =>
                    updateProfile({
                      content_rules: {
                        ...profile.content_rules,
                        show_customers: checked
                      }
                    })
                  }
                />
              </div>
            </div>

            {/* Topics to Avoid */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Topics to Avoid</h3>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.content_rules.topics_to_avoid.map((topic) => (
                  <Badge key={topic} variant="outline">
                    {topic}
                    <button
                      onClick={() => {
                        const newTopics = profile.content_rules.topics_to_avoid.filter(t => t !== topic);
                        updateProfile({
                          content_rules: {
                            ...profile.content_rules,
                            topics_to_avoid: newTopics
                          }
                        });
                      }}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add topic to avoid..."
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      const value = (e.target as HTMLInputElement).value;
                      if (value && !profile.content_rules.topics_to_avoid.includes(value)) {
                        updateProfile({
                          content_rules: {
                            ...profile.content_rules,
                            topics_to_avoid: [...profile.content_rules.topics_to_avoid, value]
                          }
                        });
                        (e.target as HTMLInputElement).value = '';
                      }
                    }
                  }}
                />
              </div>
            </div>
          </div>
        </Card>

        {/* Save Button */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={!hasChanges}
            size="lg"
            className="w-32"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Changes
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default BrandHub;