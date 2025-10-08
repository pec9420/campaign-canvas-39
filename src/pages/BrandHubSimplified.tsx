import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { PersonaModalSimplified } from "@/components/PersonaModalSimplified";
import { getCurrentProfile, saveProfile } from "@/utils/storage";
import { BusinessProfile, Persona } from "@/data/profiles";
import {
  X,
  Plus,
  Save,
  CheckCircle2,
  Building2,
  Users,
  MessageSquare
} from "lucide-react";
import { toast } from "sonner";

const TONE_OPTIONS = [
  {
    id: "fun_playful",
    emoji: "🎉",
    title: "Fun & Playful",
    description: "Lighthearted, energetic, emoji-friendly",
    example: "Stack up the fun! 🍦✨"
  },
  {
    id: "professional_polished",
    emoji: "💼",
    title: "Professional & Polished",
    description: "Competent, trustworthy, clear",
    example: "Professional service, guaranteed results."
  },
  {
    id: "warm_friendly",
    emoji: "🤗",
    title: "Warm & Friendly",
    description: "Approachable, conversational, caring",
    example: "We're here to help, just like a neighbor would."
  },
  {
    id: "bold_edgy",
    emoji: "⚡",
    title: "Bold & Edgy",
    description: "Confident, daring, stands out",
    example: "Not your average ice cream. Not even close."
  },
  {
    id: "educational_helpful",
    emoji: "📚",
    title: "Educational & Helpful",
    description: "Informative, clear, teaches",
    example: "Here's what you need to know before booking..."
  },
  {
    id: "casual_relatable",
    emoji: "👋",
    title: "Casual & Relatable",
    description: "Down-to-earth, real talk, no corporate speak",
    example: "Look, we get it. Plumbing problems suck."
  }
];

const BrandHubSimplified = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Local input states
  const [newLocation, setNewLocation] = useState("");
  const [newPhrase, setNewPhrase] = useState("");

  // Persona modal state
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      console.log("BrandHub: Starting to load profile...");
      const loadedProfile = await getCurrentProfile();
      console.log("BrandHub: Loaded profile:", loadedProfile);
      if (!loadedProfile) {
        console.log("BrandHub: No profile found, redirecting to /");
        navigate("/");
        return;
      }
      console.log("BrandHub: Setting profile state");
      setProfile(loadedProfile);
    };
    loadProfile();
  }, [navigate]);

  // Auto-save every 30 seconds if there are changes
  useEffect(() => {
    if (!hasChanges || !profile) return;

    const timer = setTimeout(() => {
      handleSave(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, [hasChanges, profile]);

  const handleSave = async (isAutoSave = false) => {
    if (profile) {
      try {
        await saveProfile(profile);
        setHasChanges(false);
        setLastSaved(new Date());
        toast.success(isAutoSave ? "Auto-saved" : "Brand profile saved successfully!");
      } catch (error) {
        toast.error("Failed to save profile. Please try again.");
        console.error("Save error:", error);
      }
    }
  };

  const updateProfile = (updates: Partial<BusinessProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
      setHasChanges(true);
    }
  };

  // Location handlers
  const addLocation = () => {
    if (profile && newLocation.trim()) {
      updateProfile({ locations: [...(profile.locations || []), newLocation.trim()] });
      setNewLocation("");
    }
  };

  const removeLocation = (index: number) => {
    if (profile) {
      updateProfile({ locations: (profile.locations || []).filter((_, i) => i !== index) });
    }
  };

  // Signature phrase handlers
  const addPhrase = () => {
    if (profile && newPhrase.trim() && ((profile.voice?.signature_phrases || []).length < 5)) {
      updateProfile({
        voice: {
          ...(profile.voice || { tone: '', signature_phrases: [] }),
          signature_phrases: [...(profile.voice?.signature_phrases || []), newPhrase.trim()]
        }
      });
      setNewPhrase("");
    }
  };

  const removePhrase = (phrase: string) => {
    if (profile) {
      updateProfile({
        voice: {
          ...(profile.voice || { tone: '', signature_phrases: [] }),
          signature_phrases: (profile.voice?.signature_phrases || []).filter(p => p !== phrase)
        }
      });
    }
  };

  // Persona handlers
  const handleSavePersona = (persona: Persona) => {
    if (!profile) return;

    const personas = profile.personas || [];
    const existingIndex = personas.findIndex(p => p.id === persona.id);
    let updatedPersonas;

    if (existingIndex >= 0) {
      updatedPersonas = [...personas];
      updatedPersonas[existingIndex] = persona;
    } else {
      updatedPersonas = [...personas, persona];
    }

    updateProfile({ personas: updatedPersonas });
    setShowPersonaModal(false);
    setCurrentPersona(null);
  };

  const handleDeletePersona = (id: string) => {
    if (profile) {
      updateProfile({ personas: (profile.personas || []).filter(p => p.id !== id) });
    }
  };

  if (!profile) return null;

  return (
    <DashboardLayout
      title="Brand Hub"
      profile={profile}
      onSwitchBusiness={() => navigate("/")}
    >
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground max-w-3xl">
              Your brand's source of truth. AI agents reference this when creating campaigns.
            </p>
          </div>

          {/* Save Indicator */}
          <div className="flex items-center space-x-3">
            {hasChanges ? (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-amber-600">Unsaved changes</span>
              </div>
            ) : lastSaved && (
              <div className="flex items-center space-x-2 text-green-600">
                <CheckCircle2 className="w-4 h-4" />
                <span className="text-sm">Saved ✓</span>
              </div>
            )}
            <Button onClick={() => handleSave(false)} disabled={!hasChanges}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        {/* 1. BUSINESS BASICS */}
        <Card className="p-8">
          <div className="flex items-center space-x-3 mb-6">
            <Building2 className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Business Basics</h2>
          </div>

          <div className="space-y-6">
            {/* Company Name */}
            <div>
              <Label className="text-lg font-semibold mb-2">Company Name</Label>
              <Input
                value={profile.business_name}
                onChange={(e) => updateProfile({ business_name: e.target.value })}
                placeholder="Stack Creamery"
                className="text-2xl font-bold h-14"
              />
            </div>

            {/* Locations */}
            <div>
              <Label className="text-lg font-semibold mb-2">Locations</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Where do you serve customers? Be specific - "Springfield, IL" not just "Illinois"
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {(profile.locations || []).map((location, index) => (
                  <Badge key={index} variant="secondary" className="px-3 py-1.5 text-sm">
                    {location}
                    <button
                      onClick={() => removeLocation(index)}
                      className="ml-2 text-muted-foreground hover:text-foreground"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newLocation}
                  onChange={(e) => setNewLocation(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addLocation()}
                  placeholder="e.g., Springfield, IL"
                />
                <Button onClick={addLocation} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* What We Offer */}
            <div>
              <Label className="text-lg font-semibold mb-2">What You Offer</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Describe your products/services in 2-3 sentences. What makes you unique?
              </p>
              <Textarea
                value={profile.what_we_offer}
                onChange={(e) => updateProfile({ what_we_offer: e.target.value })}
                placeholder="Over-the-top ice cream creations with premium toppings and Instagram-worthy presentations. We do in-store sales, event catering, and custom flavors..."
                rows={4}
                className="resize-none"
              />
            </div>
          </div>
        </Card>

        {/* 2. VOICE & TONE */}
        <Card className="p-8">
          <div className="flex items-center space-x-3 mb-6">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h2 className="text-2xl font-bold">Voice & Tone</h2>
          </div>

          <div className="space-y-8">
            {/* Tone Selector (Single Select) */}
            <div>
              <Label className="text-lg font-semibold mb-2 block">Pick Your Vibe</Label>
              <p className="text-sm text-muted-foreground mb-4">
                Choose the ONE tone that best fits your brand
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TONE_OPTIONS.map((tone) => {
                  const isSelected = profile.voice?.tone === tone.id;
                  return (
                    <Card
                      key={tone.id}
                      onClick={() => updateProfile({ voice: { ...(profile.voice || { tone: '', signature_phrases: [] }), tone: tone.id } })}
                      className={`p-4 cursor-pointer transition-all ${
                        isSelected
                          ? 'border-primary border-2 bg-primary/5'
                          : 'hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div className="text-3xl">{tone.emoji}</div>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-primary" />}
                      </div>
                      <h4 className="font-semibold mb-1">{tone.title}</h4>
                      <p className="text-xs text-muted-foreground mb-2">{tone.description}</p>
                      <p className="text-xs italic text-muted-foreground">"{tone.example}"</p>
                    </Card>
                  );
                })}
              </div>
            </div>

            {/* Signature Phrases */}
            <div>
              <Label className="text-lg font-semibold mb-2 block">Signature Phrases (Max 5)</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Brand-specific words or catchphrases you always use
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {(profile.voice?.signature_phrases || []).map((phrase) => (
                  <Badge key={phrase} className="bg-primary/10 text-primary hover:bg-primary/20 px-3 py-1.5">
                    {phrase}
                    <button
                      onClick={() => removePhrase(phrase)}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              {(profile.voice?.signature_phrases || []).length < 5 && (
                <div className="flex space-x-2">
                  <Input
                    value={newPhrase}
                    onChange={(e) => setNewPhrase(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addPhrase()}
                    placeholder="e.g., 'stack it up', 'fast response', 'done right'"
                  />
                  <Button onClick={addPhrase} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              )}
              {(profile.voice?.signature_phrases || []).length === 0 && (
                <p className="text-xs text-muted-foreground mt-2">
                  Examples: "stack it up" for ice cream shop, "fast response" for plumber
                </p>
              )}
            </div>
          </div>
        </Card>

        {/* 3. TARGET PERSONAS */}
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Target Personas</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Who exactly are you talking to? Create 2-5 personas for different customer types.
              </p>
            </div>
          </div>

          {/* Persona Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(profile.personas || []).map((persona) => (
              <Card
                key={persona.id}
                onClick={() => {
                  setCurrentPersona(persona);
                  setShowPersonaModal(true);
                }}
                className="p-6 hover:border-primary/50 cursor-pointer transition-all hover:shadow-md"
              >
                <div className="text-center">
                  <div className="text-4xl mb-3">{persona.emoji}</div>
                  <h3 className="text-lg font-bold mb-1">{persona.name}</h3>
                  <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                    {persona.who_are_they}
                  </p>
                  <div className="flex flex-wrap justify-center gap-1">
                    {(persona.platforms || []).slice(0, 3).map((platform) => (
                      <Badge key={platform} variant="secondary" className="text-xs">
                        {platform}
                      </Badge>
                    ))}
                  </div>
                </div>
              </Card>
            ))}

            {/* Add Persona Card - Show only if less than 6 personas */}
            {(profile.personas || []).length < 6 && (
              <Card
                onClick={() => {
                  setCurrentPersona(null);
                  setShowPersonaModal(true);
                }}
                className="p-6 border-2 border-dashed border-muted-foreground/30 hover:border-primary/50 cursor-pointer transition-all flex items-center justify-center min-h-[200px]"
              >
                <div className="text-center">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-3">
                    <Plus className="w-6 h-6 text-primary" />
                  </div>
                  <p className="font-medium">
                    {(profile.personas || []).length === 0 ? 'Add Your First Persona' : 'Add Another Persona'}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {6 - (profile.personas || []).length} more allowed • 2-3 min to create
                  </p>
                </div>
              </Card>
            )}

            {/* Max personas message */}
            {(profile.personas || []).length >= 6 && (
              <Card className="p-6 border-2 border-muted-foreground/20 flex items-center justify-center min-h-[200px]">
                <div className="text-center text-muted-foreground">
                  <p className="font-medium">Maximum 6 personas reached</p>
                  <p className="text-xs mt-1">Edit or delete existing personas to add more</p>
                </div>
              </Card>
            )}
          </div>

          {/* Persona Examples */}
          {(profile.personas || []).length === 0 && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium mb-3">Examples for inspiration:</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• <strong>Ice Cream Shop:</strong> Date Night Dani, Event Planner Emma, Treat Time Tom</p>
                <p>• <strong>Plumber:</strong> Fix-It Felix, Clueless Carla, Property Manager Pete</p>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Persona Modal */}
      <PersonaModalSimplified
        persona={currentPersona}
        open={showPersonaModal}
        onClose={() => {
          setShowPersonaModal(false);
          setCurrentPersona(null);
        }}
        onSave={handleSavePersona}
        onDelete={handleDeletePersona}
      />
    </DashboardLayout>
  );
};

export default BrandHubSimplified;
