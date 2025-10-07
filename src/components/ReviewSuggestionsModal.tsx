import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, X } from "lucide-react";
import { BusinessProfile } from "@/data/profiles";

interface ReviewSuggestionsModalProps {
  open: boolean;
  onClose: () => void;
  suggestions: any;
  currentProfile: BusinessProfile;
  onAccept: (mergedProfile: Partial<BusinessProfile>) => void;
}

export function ReviewSuggestionsModal({
  open,
  onClose,
  suggestions,
  currentProfile,
  onAccept,
}: ReviewSuggestionsModalProps) {
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set());

  const toggleItem = (key: string) => {
    const newSelected = new Set(selectedItems);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else {
      newSelected.add(key);
    }
    setSelectedItems(newSelected);
  };

  const handleAcceptAll = () => {
    onAccept(suggestions);
    onClose();
  };

  const handleAcceptSelected = () => {
    const merged: any = {};
    selectedItems.forEach((key) => {
      const keys = key.split(".");
      let current: any = merged;
      let suggestionValue: any = suggestions;

      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) current[keys[i]] = {};
        current = current[keys[i]];
        suggestionValue = suggestionValue[keys[i]];
      }

      current[keys[keys.length - 1]] = suggestionValue[keys[keys.length - 1]];
    });

    onAccept(merged);
    onClose();
  };

  const renderComparison = (
    label: string,
    currentValue: any,
    suggestedValue: any,
    path: string
  ) => {
    const isArray = Array.isArray(suggestedValue);
    const hasChanges = JSON.stringify(currentValue) !== JSON.stringify(suggestedValue);

    if (!hasChanges) return null;

    return (
      <div key={path} className="border border-border rounded-lg p-4">
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-semibold text-sm">{label}</h4>
          <Checkbox
            checked={selectedItems.has(path)}
            onCheckedChange={() => toggleItem(path)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-xs text-muted-foreground mb-2">Current</p>
            <div className="space-y-1">
              {isArray ? (
                currentValue?.map((item: any, idx: number) => (
                  <Badge key={idx} variant="outline" className="mr-1 mb-1">
                    {typeof item === "string" ? item : item.name || JSON.stringify(item)}
                  </Badge>
                ))
              ) : (
                <p>{currentValue || "Not set"}</p>
              )}
            </div>
          </div>

          <div>
            <p className="text-xs text-muted-foreground mb-2">AI Suggestion</p>
            <div className="space-y-1">
              {isArray ? (
                suggestedValue?.map((item: any, idx: number) => (
                  <Badge key={idx} variant="secondary" className="mr-1 mb-1 bg-green-100 text-green-800">
                    {typeof item === "string" ? item : item.name || JSON.stringify(item)}
                  </Badge>
                ))
              ) : (
                <p className="text-green-600">{suggestedValue}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Review AI Suggestions</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Review the AI-extracted information and select which items to add to your profile.
          </p>

          {suggestions.locations &&
            renderComparison("Locations", currentProfile.locations, suggestions.locations, "locations")}

          {suggestions.services &&
            renderComparison("Services", currentProfile.services, suggestions.services, "services")}

          {suggestions.voice?.tones &&
            renderComparison("Voice Tones", currentProfile.voice.tones, suggestions.voice.tones, "voice.tones")}

          {suggestions.voice?.loved_words &&
            renderComparison(
              "Loved Words",
              currentProfile.voice.loved_words,
              suggestions.voice.loved_words,
              "voice.loved_words"
            )}

          {suggestions.voice?.banned_words &&
            renderComparison(
              "Banned Words",
              currentProfile.voice.banned_words,
              suggestions.voice.banned_words,
              "voice.banned_words"
            )}

          {suggestions.personas &&
            renderComparison("Personas", currentProfile.personas, suggestions.personas, "personas")}

          <div className="flex justify-end space-x-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              variant="outline"
              onClick={handleAcceptSelected}
              disabled={selectedItems.size === 0}
            >
              Accept Selected ({selectedItems.size})
            </Button>
            <Button onClick={handleAcceptAll}>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Accept All
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
