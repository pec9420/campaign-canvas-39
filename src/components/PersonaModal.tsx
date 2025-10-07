import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Persona } from "@/data/profiles";
import { X, Smile } from "lucide-react";

interface PersonaModalProps {
  persona: Persona | null;
  open: boolean;
  onClose: () => void;
  onSave: (persona: Persona) => void;
  onDelete?: (id: string) => void;
}

const PLATFORM_OPTIONS = [
  { id: "instagram", label: "Instagram", icon: "📷" },
  { id: "tiktok", label: "TikTok", icon: "🎵" },
  { id: "facebook", label: "Facebook", icon: "👥" },
  { id: "linkedin", label: "LinkedIn", icon: "💼" },
  { id: "twitter", label: "Twitter", icon: "🐦" },
  { id: "pinterest", label: "Pinterest", icon: "📌" }
];

const CONTENT_TYPE_OPTIONS = [
  "Video content",
  "Educational posts",
  "Behind-the-scenes",
  "User testimonials",
  "Humor/Memes",
  "Product showcases",
  "How-to guides"
];

const TIME_OPTIONS = [
  { id: "morning", label: "Morning (6am-12pm)" },
  { id: "afternoon", label: "Afternoon (12pm-5pm)" },
  { id: "evening", label: "Evening (5pm-10pm)" },
  { id: "late_night", label: "Late night (10pm-2am)" },
  { id: "weekends", label: "Weekends" }
];

const LOCATION_TYPE_OPTIONS = ["urban", "suburban", "rural"];
const FAMILY_STATUS_OPTIONS = ["single", "married", "has_kids", "empty_nester"];

const EMOJI_OPTIONS = ["💑", "👨‍💼", "👩‍💼", "🏠", "👪", "🎓", "💰", "🔧", "🍕", "🏃", "🎨", "💻"];

export const PersonaModal = ({ persona, open, onClose, onSave, onDelete }: PersonaModalProps) => {
  const [formData, setFormData] = useState<Persona>(
    persona || {
      id: `persona-${Date.now()}`,
      name: "",
      emoji: "👤",
      description: "",
      demographics: {
        age_range: "",
        income_level: "middle",
        location_types: [],
        family_status: []
      },
      psychographics: {
        pain_points: [],
        goals: [],
        values: []
      },
      social_behavior: {
        platforms: [],
        content_types: [],
        best_times: []
      },
      real_example: ""
    }
  );

  const [newPainPoint, setNewPainPoint] = useState("");
  const [newGoal, setNewGoal] = useState("");
  const [newValue, setNewValue] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    onSave(formData);
  };

  const addChip = (field: 'pain_points' | 'goals' | 'values', value: string) => {
    if (!value.trim()) return;
    const current = formData.psychographics[field];
    if (current.length >= 5) return; // Max 5
    if (!current.includes(value.trim())) {
      setFormData({
        ...formData,
        psychographics: {
          ...formData.psychographics,
          [field]: [...current, value.trim()]
        }
      });
    }
  };

  const removeChip = (field: 'pain_points' | 'goals' | 'values', value: string) => {
    setFormData({
      ...formData,
      psychographics: {
        ...formData.psychographics,
        [field]: formData.psychographics[field].filter(v => v !== value)
      }
    });
  };

  const toggleArrayValue = (field: keyof Persona['demographics'], value: string) => {
    const current = formData.demographics[field] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];

    setFormData({
      ...formData,
      demographics: {
        ...formData.demographics,
        [field]: updated
      }
    });
  };

  const toggleSocialValue = (field: keyof Persona['social_behavior'], value: string) => {
    const current = formData.social_behavior[field] as string[];
    const updated = current.includes(value)
      ? current.filter(v => v !== value)
      : [...current, value];

    setFormData({
      ...formData,
      social_behavior: {
        ...formData.social_behavior,
        [field]: updated
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{persona ? 'Edit Persona' : 'Create New Persona'}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Section 1: Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Basic Info</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Persona Name *</Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Date Night Dani, Soccer Mom Sarah"
                  required
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Give them a memorable, alliterative name
                </p>
              </div>

              <div>
                <Label>Avatar Emoji</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {EMOJI_OPTIONS.map((emoji) => (
                    <button
                      key={emoji}
                      type="button"
                      onClick={() => setFormData({ ...formData, emoji })}
                      className={`text-2xl p-2 rounded-lg border-2 transition-colors ${
                        formData.emoji === emoji
                          ? 'border-primary bg-primary/10'
                          : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      {emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <Label>One-line Description</Label>
              <Input
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Young couples seeking Instagram-worthy date experiences"
                maxLength={100}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {formData.description.length}/100 characters
              </p>
            </div>
          </div>

          {/* Section 2: Demographics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Demographics</h3>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Age Range</Label>
                <Input
                  value={formData.demographics.age_range}
                  onChange={(e) => setFormData({
                    ...formData,
                    demographics: { ...formData.demographics, age_range: e.target.value }
                  })}
                  placeholder="25-35"
                />
              </div>

              <div>
                <Label>Income Level</Label>
                <RadioGroup
                  value={formData.demographics.income_level}
                  onValueChange={(value: any) => setFormData({
                    ...formData,
                    demographics: { ...formData.demographics, income_level: value }
                  })}
                  className="flex space-x-4 mt-2"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="budget" id="budget" />
                    <Label htmlFor="budget">Budget-conscious ($)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="middle" id="middle" />
                    <Label htmlFor="middle">Middle income ($$)</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="high" />
                    <Label htmlFor="high">High income ($$$)</Label>
                  </div>
                </RadioGroup>
              </div>
            </div>

            <div>
              <Label>Location Type</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {LOCATION_TYPE_OPTIONS.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.demographics.location_types.includes(type)}
                      onCheckedChange={() => toggleArrayValue('location_types', type)}
                    />
                    <Label className="capitalize">{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Family Status</Label>
              <div className="flex flex-wrap gap-3 mt-2">
                {FAMILY_STATUS_OPTIONS.map((status) => (
                  <div key={status} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.demographics.family_status.includes(status)}
                      onCheckedChange={() => toggleArrayValue('family_status', status)}
                    />
                    <Label className="capitalize">{status.replace('_', ' ')}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 3: Psychographics */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Psychographics</h3>

            {/* Pain Points */}
            <div>
              <Label>Pain Points (up to 5)</Label>
              <div className="flex flex-wrap gap-2 mb-2 mt-2">
                {formData.psychographics.pain_points.map((point) => (
                  <Badge key={point} variant="outline" className="bg-orange-50">
                    {point}
                    <button
                      type="button"
                      onClick={() => removeChip('pain_points', point)}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newPainPoint}
                  onChange={(e) => setNewPainPoint(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addChip('pain_points', newPainPoint);
                      setNewPainPoint("");
                    }
                  }}
                  placeholder="What problems do they have?"
                  disabled={formData.psychographics.pain_points.length >= 5}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    addChip('pain_points', newPainPoint);
                    setNewPainPoint("");
                  }}
                  disabled={formData.psychographics.pain_points.length >= 5}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Goals */}
            <div>
              <Label>Goals (up to 5)</Label>
              <div className="flex flex-wrap gap-2 mb-2 mt-2">
                {formData.psychographics.goals.map((goal) => (
                  <Badge key={goal} variant="outline" className="bg-green-50">
                    {goal}
                    <button
                      type="button"
                      onClick={() => removeChip('goals', goal)}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newGoal}
                  onChange={(e) => setNewGoal(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addChip('goals', newGoal);
                      setNewGoal("");
                    }
                  }}
                  placeholder="What are they trying to achieve?"
                  disabled={formData.psychographics.goals.length >= 5}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    addChip('goals', newGoal);
                    setNewGoal("");
                  }}
                  disabled={formData.psychographics.goals.length >= 5}
                >
                  Add
                </Button>
              </div>
            </div>

            {/* Values */}
            <div>
              <Label>Values (up to 5)</Label>
              <div className="flex flex-wrap gap-2 mb-2 mt-2">
                {formData.psychographics.values.map((value) => (
                  <Badge key={value} variant="outline" className="bg-blue-50">
                    {value}
                    <button
                      type="button"
                      onClick={() => removeChip('values', value)}
                      className="ml-2"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </Badge>
                ))}
              </div>
              <div className="flex space-x-2">
                <Input
                  value={newValue}
                  onChange={(e) => setNewValue(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      addChip('values', newValue);
                      setNewValue("");
                    }
                  }}
                  placeholder="What's important to them?"
                  disabled={formData.psychographics.values.length >= 5}
                />
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    addChip('values', newValue);
                    setNewValue("");
                  }}
                  disabled={formData.psychographics.values.length >= 5}
                >
                  Add
                </Button>
              </div>
            </div>
          </div>

          {/* Section 4: Social Media Behavior */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Social Media Behavior</h3>

            <div>
              <Label>Active Platforms</Label>
              <div className="grid grid-cols-3 gap-3 mt-2">
                {PLATFORM_OPTIONS.map((platform) => (
                  <div
                    key={platform.id}
                    onClick={() => toggleSocialValue('platforms', platform.id)}
                    className={`flex items-center space-x-2 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                      formData.social_behavior.platforms.includes(platform.id)
                        ? 'border-primary bg-primary/5'
                        : 'border-muted hover:border-primary/50'
                    }`}
                  >
                    <span className="text-xl">{platform.icon}</span>
                    <span className="text-sm font-medium">{platform.label}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Content They Engage With</Label>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {CONTENT_TYPE_OPTIONS.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.social_behavior.content_types.includes(type)}
                      onCheckedChange={() => toggleSocialValue('content_types', type)}
                    />
                    <Label>{type}</Label>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <Label>Best Times to Reach</Label>
              <div className="space-y-2 mt-2">
                {TIME_OPTIONS.map((time) => (
                  <div key={time.id} className="flex items-center space-x-2">
                    <Checkbox
                      checked={formData.social_behavior.best_times.includes(time.id)}
                      onCheckedChange={() => toggleSocialValue('best_times', time.id)}
                    />
                    <Label>{time.label}</Label>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Section 5: Real Example */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Real Example</h3>
            <div>
              <Label>Example Customer</Label>
              <Textarea
                value={formData.real_example}
                onChange={(e) => setFormData({ ...formData, real_example: e.target.value })}
                placeholder="Describe a real customer who fits this persona. What did they buy? Why? How did they find you?"
                rows={4}
              />
              <p className="text-xs text-muted-foreground mt-1">
                This helps AI write more authentic, relatable content
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between pt-4 border-t">
            <div>
              {persona && onDelete && (
                <Button
                  type="button"
                  variant="ghost"
                  className="text-destructive"
                  onClick={() => {
                    if (confirm('Are you sure you want to delete this persona?')) {
                      onDelete(persona.id);
                      onClose();
                    }
                  }}
                >
                  Delete Persona
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              {persona && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const duplicated = {
                      ...formData,
                      id: `persona-${Date.now()}`,
                      name: `${formData.name} (Copy)`
                    };
                    onSave(duplicated);
                  }}
                >
                  Duplicate
                </Button>
              )}
              <Button type="submit">
                Save Persona
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
