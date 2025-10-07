import { CheckCircle2, Circle } from "lucide-react";
import { cn } from "@/lib/utils";

interface Step {
  id: number;
  title: string;
  description?: string;
}

interface ProgressStepperProps {
  steps: Step[];
  currentStep: number;
  className?: string;
}

export function ProgressStepper({ steps, currentStep, className }: ProgressStepperProps) {
  return (
    <div className={cn("w-full", className)}>
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.id;
          const isCurrent = currentStep === step.id;
          const isUpcoming = currentStep < step.id;

          return (
            <div key={step.id} className="flex items-center">
              {/* Step Circle */}
              <div className="relative">
                <div
                  className={cn(
                    "w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300",
                    {
                      "bg-primary border-primary text-primary-foreground": isCompleted || isCurrent,
                      "bg-background border-muted-foreground text-muted-foreground": isUpcoming,
                    }
                  )}
                >
                  {isCompleted ? (
                    <CheckCircle2 className="w-6 h-6" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </div>

                {/* Step Info */}
                <div className="absolute top-14 left-1/2 transform -translate-x-1/2 text-center min-w-max">
                  <p
                    className={cn(
                      "text-sm font-medium transition-colors",
                      {
                        "text-primary": isCompleted || isCurrent,
                        "text-muted-foreground": isUpcoming,
                      }
                    )}
                  >
                    {step.title}
                  </p>
                  {step.description && (
                    <p className="text-xs text-muted-foreground mt-1">
                      {step.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    "flex-1 h-0.5 mx-4 transition-all duration-300",
                    {
                      "bg-primary": currentStep > step.id,
                      "bg-muted-foreground/30": currentStep <= step.id,
                    }
                  )}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}