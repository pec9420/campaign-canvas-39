import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DashboardLayout } from "@/components/ui/dashboard-layout";
import { PersonaModal } from "@/components/PersonaModal";
import { getCurrentProfile, saveProfile } from "@/utils/storage";
import { BusinessProfile, Program, Persona } from "@/data/profiles";
import {
  Upload,
  X,
  Plus,
  Save,
  CheckCircle2,
  Building2,
  Users,
  MessageSquare,
  FileText,
  Edit
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

const BrandHubNew = () => {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<BusinessProfile | null>(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Local state for inputs
  const [newLocation, setNewLocation] = useState("");
  const [newService, setNewService] = useState("");
  const [newLovedWord, setNewLovedWord] = useState("");
  const [newBannedWord, setNewBannedWord] = useState("");
  const [newTopicToAvoid, setNewTopicToAvoid] = useState("");

  // Program modal state
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<Program | null>(null);

  // Persona modal state
  const [showPersonaModal, setShowPersonaModal] = useState(false);
  const [currentPersona, setCurrentPersona] = useState<Persona | null>(null);

  useEffect(() => {
    const loadedProfile = getCurrentProfile();
    if (!loadedProfile) {
      navigate("/");
      return;
    }
    setProfile(loadedProfile);
  }, [navigate]);

  // Auto-save every 30 seconds if there are changes
  useEffect(() => {
    if (!hasChanges || !profile) return;

    const timer = setTimeout(() => {
      handleSave(true);
    }, 30000);

    return () => clearTimeout(timer);
  }, [hasChanges, profile]);

  const handleSwitchBusiness = () => {
    navigate("/");
  };

  const handleSave = (isAutoSave = false) => {
    if (profile) {
      saveProfile(profile);
      setHasChanges(false);
      setLastSaved(new Date());
      toast.success(isAutoSave ? "Auto-saved" : "Brand profile saved successfully!");
    }
  };

  const updateProfile = (updates: Partial<BusinessProfile>) => {
    if (profile) {
      setProfile({ ...profile, ...updates });
      setHasChanges(true);
    }
  };

  // Business Basics handlers
  const addLocation = () => {
    if (profile && newLocation.trim()) {
      updateProfile({ locations: [...profile.locations, newLocation.trim()] });
      setNewLocation("");
    }
  };

  const removeLocation = (index: number) => {
    if (profile) {
      updateProfile({ locations: profile.locations.filter((_, i) => i !== index) });
    }
  };

  const addService = () => {
    if (profile && newService.trim()) {
      updateProfile({ services: [...profile.services, newService.trim()] });
      setNewService("");
    }
  };

  const removeService = (index: number) => {
    if (profile) {
      updateProfile({ services: profile.services.filter((_, i) => i !== index) });
    }
  };

  const handleSaveProgram = (program: Program) => {
    if (!profile) return;

    const existingIndex = profile.programs.findIndex(p => p.id === program.id);
    let updatedPrograms;

    if (existingIndex >= 0) {
      updatedPrograms = [...profile.programs];
      updatedPrograms[existingIndex] = program;
    } else {
      updatedPrograms = [...profile.programs, program];
    }

    updateProfile({ programs: updatedPrograms });
    setShowProgramModal(false);
    setCurrentProgram(null);
  };

  const removeProgram = (id: string) => {
    if (profile) {
      updateProfile({ programs: profile.programs.filter(p => p.id !== id) });
    }
  };

  // Persona handlers
  const handleSavePersona = (persona: Persona) => {
    if (!profile) return;

    const existingIndex = profile.personas.findIndex(p => p.id === persona.id);
    let updatedPersonas;

    if (existingIndex >= 0) {
      updatedPersonas = [...profile.personas];
      updatedPersonas[existingIndex] = persona;
    } else {
      updatedPersonas = [...profile.personas, persona];
    }

    updateProfile({ personas: updatedPersonas });
    setShowPersonaModal(false);
    setCurrentPersona(null);
  };

  const handleDeletePersona = (id: string) => {
    if (profile) {
      updateProfile({ personas: profile.personas.filter(p => p.id !== id) });
    }
  };

  // Voice & Tone handlers
  const toggleTone = (toneId: string) => {
    if (!profile) return;
    const tones = profile.voice.tones.includes(toneId)
      ? profile.voice.tones.filter(t => t !== toneId)
      : [...profile.voice.tones, toneId];
    updateProfile({ voice: { ...profile.voice, tones } });
  };

  const addLovedWord = () => {
    if (profile && newLovedWord.trim() && !profile.voice.loved_words.includes(newLovedWord.trim())) {
      updateProfile({
        voice: {
          ...profile.voice,
          loved_words: [...profile.voice.loved_words, newLovedWord.trim()]
        }
      });
      setNewLovedWord("");
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

  const addBannedWord = () => {
    if (profile && newBannedWord.trim() && !profile.voice.banned_words.includes(newBannedWord.trim())) {
      updateProfile({
        voice: {
          ...profile.voice,
          banned_words: [...profile.voice.banned_words, newBannedWord.trim()]
        }
      });
      setNewBannedWord("");
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

  const addTopicToAvoid = () => {
    if (profile && newTopicToAvoid.trim() && !profile.content_rules.topics_to_avoid.includes(newTopicToAvoid.trim())) {
      updateProfile({
        content_rules: {
          ...profile.content_rules,
          topics_to_avoid: [...profile.content_rules.topics_to_avoid, newTopicToAvoid.trim()]
        }
      });
      setNewTopicToAvoid("");
    }
  };

  const removeTopicToAvoid = (topic: string) => {
    if (profile) {
      updateProfile({
        content_rules: {
          ...profile.content_rules,
          topics_to_avoid: profile.content_rules.topics_to_avoid.filter(t => t !== topic)
        }
      });
    }
  };

  if (!profile) return null;

  return (
    <DashboardLayout
      title="Brand Hub"
      profile={profile}
      onSwitchBusiness={handleSwitchBusiness}
    >
      <div className="space-y-6">
        {/* Header with subtitle and save indicator */}
        <div className="flex items-start justify-between">
          <div>
            <p className="text-muted-foreground max-w-3xl">
              Your brand's source of truth. Fill in manually or upload files—AI agents will reference this when creating campaigns.
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

        {/* 1. BUSINESS BASICS SECTION */}
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <Building2 className="w-6 h-6 text-primary" />
              <h2 className="text-2xl font-bold">Business Basics</h2>
            </div>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Business Info
            </Button>
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
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.locations.map((location, index) => (
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
                  placeholder="Add location (e.g., Springfield, IL)"
                />
                <Button onClick={addLocation} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Services & Products */}
            <div>
              <Label className="text-lg font-semibold mb-2">Services & Products</Label>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.services.map((service, index) => (
                  <Badge key={index} variant="outline" className="px-3 py-1.5">
                    {service}
                    <button
                      onClick={() => removeService(index)}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newService}
                  onChange={(e) => setNewService(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addService()}
                  placeholder="Add service or product"
                />
                <Button onClick={addService} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Programs */}
            <div>
              <div className="flex items-center justify-between mb-3">
                <Label className="text-lg font-semibold">Programs</Label>
                <Button
                  onClick={() => {
                    setCurrentProgram({
                      id: `program-${Date.now()}`,
                      name: "",
                      type: "referral",
                      description: "",
                      details: ""
                    });
                    setShowProgramModal(true);
                  }}
                  variant="outline"
                  size="sm"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Program
                </Button>
              </div>
              <div className="space-y-3">
                {profile.programs.map((program) => (
                  <Card key={program.id} className="p-4 hover:border-primary/50 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h4 className="font-semibold">{program.name}</h4>
                          <Badge variant="secondary" className="text-xs">
                            {program.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-1">{program.description}</p>
                        <p className="text-xs text-muted-foreground">{program.details}</p>
                      </div>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setCurrentProgram(program);
                            setShowProgramModal(true);
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeProgram(program.id)}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </Card>

        {/* 2. TARGET PERSONAS SECTION */}
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <Users className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Target Personas</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                Get specific. Who exactly are you talking to? Name them, describe them, understand them.
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Persona Research
            </Button>
          </div>

          {/* Persona Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {profile.personas.map((persona) => (
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
                  <p className="text-sm text-muted-foreground mb-3">{persona.description}</p>
                  <div className="flex flex-wrap justify-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {persona.demographics.age_range}
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      {persona.demographics.income_level === 'budget' ? '$' :
                       persona.demographics.income_level === 'middle' ? '$$' : '$$$'}
                    </Badge>
                  </div>
                </div>
              </Card>
            ))}

            {/* Add Persona Card */}
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
                <p className="font-medium">{profile.personas.length === 0 ? 'Add Your First Persona' : 'Add Another Persona'}</p>
                <p className="text-xs text-muted-foreground mt-1">Click to create</p>
              </div>
            </Card>
          </div>

          {/* Example Personas */}
          {profile.personas.length === 0 && (
            <div className="mt-6 p-4 bg-muted/30 rounded-lg">
              <p className="text-sm font-medium mb-3">Examples to inspire you:</p>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• <strong>Date Night Dani</strong> - Young couple looking for Instagram-worthy dessert experience</p>
                <p>• <strong>Unsavvy Ursula</strong> - Homeowner who needs plumbing help but doesn't understand the problem</p>
              </div>
            </div>
          )}
        </Card>

        {/* 3. VOICE & TONE SECTION */}
        <Card className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <MessageSquare className="w-6 h-6 text-primary" />
                <h2 className="text-2xl font-bold">Voice & Tone</h2>
              </div>
              <p className="text-sm text-muted-foreground">
                How your brand sounds. Be specific—this guides every word AI writes.
              </p>
            </div>
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Brand Voice Guide
            </Button>
          </div>

          <div className="space-y-8">
            {/* Tone Selector */}
            <div>
              <Label className="text-lg font-semibold mb-4 block">Tone Selector</Label>
              <p className="text-sm text-muted-foreground mb-4">Select one or more that fit your brand</p>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TONE_OPTIONS.map((tone) => {
                  const isSelected = profile.voice.tones.includes(tone.id);
                  return (
                    <Card
                      key={tone.id}
                      onClick={() => toggleTone(tone.id)}
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

            {/* Phrases Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Loved Words */}
              <div>
                <Label className="text-lg font-semibold mb-2 block">Phrases to USE ✅</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Brand-specific words, catchphrases, signature expressions
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.voice.loved_words.map((word) => (
                    <Badge key={word} className="bg-green-100 text-green-800 hover:bg-green-200">
                      {word}
                      <button
                        onClick={() => removeLovedWord(word)}
                        className="ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newLovedWord}
                    onChange={(e) => setNewLovedWord(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addLovedWord()}
                    placeholder="Add phrase"
                  />
                  <Button onClick={addLovedWord} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Banned Words */}
              <div>
                <Label className="text-lg font-semibold mb-2 block">Phrases to AVOID ❌</Label>
                <p className="text-sm text-muted-foreground mb-3">
                  Words that feel off-brand or overused
                </p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {profile.voice.banned_words.map((word) => (
                    <Badge key={word} className="bg-red-100 text-red-800 hover:bg-red-200">
                      {word}
                      <button
                        onClick={() => removeBannedWord(word)}
                        className="ml-2"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
                <div className="flex space-x-2">
                  <Input
                    value={newBannedWord}
                    onChange={(e) => setNewBannedWord(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && addBannedWord()}
                    placeholder="Add banned phrase"
                  />
                  <Button onClick={addBannedWord} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Topics to Avoid */}
            <div>
              <Label className="text-lg font-semibold mb-2 block">Topics to Avoid</Label>
              <p className="text-sm text-muted-foreground mb-3">
                Sensitive topics your brand doesn't discuss
              </p>
              <div className="flex flex-wrap gap-2 mb-3">
                {profile.content_rules.topics_to_avoid.map((topic) => (
                  <Badge key={topic} variant="outline">
                    {topic}
                    <button
                      onClick={() => removeTopicToAvoid(topic)}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newTopicToAvoid}
                  onChange={(e) => setNewTopicToAvoid(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && addTopicToAvoid()}
                  placeholder="Add topic to avoid"
                />
                <Button onClick={addTopicToAvoid} variant="outline">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Program Modal */}
      <Dialog open={showProgramModal} onOpenChange={setShowProgramModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{currentProgram?.name ? 'Edit Program' : 'Add Program'}</DialogTitle>
          </DialogHeader>
          {currentProgram && (
            <ProgramForm
              program={currentProgram}
              onSave={handleSaveProgram}
              onCancel={() => {
                setShowProgramModal(false);
                setCurrentProgram(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Persona Modal */}
      <PersonaModal
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

// Program Form Component
const ProgramForm = ({
  program,
  onSave,
  onCancel
}: {
  program: Program;
  onSave: (program: Program) => void;
  onCancel: () => void;
}) => {
  const [formData, setFormData] = useState<Program>(program);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label>Program Name</Label>
        <Input
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          placeholder="Scoop Squad Referral"
          required
        />
      </div>

      <div>
        <Label>Program Type</Label>
        <Select
          value={formData.type}
          onValueChange={(value: any) => setFormData({ ...formData, type: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="referral">Referral</SelectItem>
            <SelectItem value="loyalty">Loyalty</SelectItem>
            <SelectItem value="membership">Membership</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label>Description</Label>
        <Input
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          placeholder="Get $10 off when you refer a friend"
          required
        />
      </div>

      <div>
        <Label>Details</Label>
        <Textarea
          value={formData.details}
          onChange={(e) => setFormData({ ...formData, details: e.target.value })}
          placeholder="Both you and your friend get $10 off your next order of $30 or more"
          rows={3}
        />
      </div>

      <div className="flex justify-end space-x-3">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          Save Program
        </Button>
      </div>
    </form>
  );
};

export default BrandHubNew;
