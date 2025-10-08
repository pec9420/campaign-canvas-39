import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Persona } from "@/data/profiles";
import { Trash2 } from "lucide-react";

interface PersonaModalProps {
  persona: Persona | null;
  open: boolean;
  onClose: () => void;
  onSave: (persona: Persona) => void;
  onDelete?: (id: string) => void;
}

const EMOJI_OPTIONS = ["💑", "🎉", "👨‍👧", "🔧", "🤷‍♀️", "🏢", "👨‍💼", "👩‍💼", "👪", "🎓", "💰", "🍕"];

const PLATFORM_OPTIONS = [
  { id: "instagram", label: "Instagram", icon: "📷" },
  { id: "tiktok", label: "TikTok", icon: "🎵" },
  { id: "facebook", label: "Facebook", icon: "👥" },
  { id: "linkedin", label: "LinkedIn", icon: "💼" },
  { id: "google_business", label: "Google", icon: "🔍" },
  { id: "nextdoor", label: "Nextdoor", icon: "🏘️" }
];

export const PersonaModalSimplified = ({ persona, open, onClose, onSave, onDelete }: PersonaModalProps) => {
  const [formData, setFormData] = useState<Persona>(
    persona || {
      id: `persona-${Date.now()}`,
      name: "",
      emoji: "👤",
      who_are_they: "",
      main_problem: "",
      platforms: [],
      real_example: ""
    }
  );

  // Reset form when persona prop changes or modal opens
  useEffect(() => {
    if (open) {
      setFormData(
        persona || {
          id: `persona-${Date.now()}`,
          name: "",
          emoji: "👤",
          who_are_they: "",
          main_problem: "",
          platforms: [],
          real_example: ""
        }
      );
    }
  }, [persona, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.who_are_they.trim() || !formData.main_problem.trim()) {
      return;
    }
    onSave(formData);
  };

  const togglePlatform = (platformId: string) => {
    if (formData.platforms.includes(platformId)) {
      setFormData({
        ...formData,
        platforms: formData.platforms.filter(p => p !== platformId)
      });
    } else if (formData.platforms.length < 3) {
      setFormData({
        ...formData,
        platforms: [...formData.platforms, platformId]
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{persona ? 'Edit Persona' : 'Create New Persona'}</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Create a quick profile of who you're targeting. Takes 2-3 minutes.
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Emoji Picker */}
          <div>
            <Label>Pick an Emoji</Label>
            <div className="flex flex-wrap gap-2 mt-2">
              {EMOJI_OPTIONS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => setFormData({ ...formData, emoji })}
                  className={`text-3xl p-2 rounded-lg border-2 transition-all ${
                    formData.emoji === emoji
                      ? 'border-primary bg-primary/10 scale-110'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <Label htmlFor="name">Persona Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Date Night Dani, Fix-It Felix, Event Planner Emma..."
              className="mt-1"
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Give them a memorable, alliterative name
            </p>
          </div>

          {/* Who are they */}
          <div>
            <Label htmlFor="who">Who are they? *</Label>
            <Textarea
              id="who"
              value={formData.who_are_they}
              onChange={(e) => setFormData({ ...formData, who_are_they: e.target.value })}
              placeholder="Young couples (25-35) seeking Instagram-worthy date night experiences"
              className="mt-1"
              rows={2}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              Describe them in 1-2 sentences. Who are they? What do they do?
            </p>
          </div>

          {/* Main Problem */}
          <div>
            <Label htmlFor="problem">Their Main Problem or Goal *</Label>
            <Textarea
              id="problem"
              value={formData.main_problem}
              onChange={(e) => setFormData({ ...formData, main_problem: e.target.value })}
              placeholder="Want unique, photogenic date spots that feel special and worth posting about"
              className="mt-1"
              rows={2}
              required
            />
            <p className="text-xs text-muted-foreground mt-1">
              What's the ONE problem they're trying to solve or goal they're trying to achieve?
            </p>
          </div>

          {/* Platforms */}
          <div>
            <Label>Where do they hang out online? (Pick up to 3)</Label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mt-2">
              {PLATFORM_OPTIONS.map((platform) => {
                const isSelected = formData.platforms.includes(platform.id);
                const isDisabled = !isSelected && formData.platforms.length >= 3;

                return (
                  <button
                    key={platform.id}
                    type="button"
                    onClick={() => !isDisabled && togglePlatform(platform.id)}
                    disabled={isDisabled}
                    className={`p-3 rounded-lg border-2 text-left transition-all ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : isDisabled
                        ? 'border-border bg-muted/50 opacity-50 cursor-not-allowed'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <span className="text-xl">{platform.icon}</span>
                      <span className="text-sm font-medium">{platform.label}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Real Example (Optional) */}
          <div>
            <Label htmlFor="example">Real Customer Example (Optional)</Label>
            <Textarea
              id="example"
              value={formData.real_example || ""}
              onChange={(e) => setFormData({ ...formData, real_example: e.target.value })}
              placeholder="Alex and Jamie came for their anniversary, ordered the 'Lovers Stack', took 20 photos, tagged us in 3 posts. Came back twice that month."
              className="mt-1"
              rows={3}
            />
            <p className="text-xs text-muted-foreground mt-1">
              Share a real story of a customer like this. Makes campaigns feel authentic.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-4 border-t">
            <div>
              {persona && onDelete && (
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => {
                    if (confirm(`Delete ${persona.name}?`)) {
                      onDelete(persona.id);
                      onClose();
                    }
                  }}
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              )}
            </div>
            <div className="flex space-x-3">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                {persona ? 'Update Persona' : 'Create Persona'}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
