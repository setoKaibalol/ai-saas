"use client";

import { useState, useEffect } from "react";
import { AudioLines, AudioWaveform, Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";

const STEPS = [
  { label: "Warming up the voice model...", icon: Sparkles, duration: 4000 },
  { label: "Generating speech...", icon: AudioLines, duration: 12000 },
  { label: "Processing audio...", icon: AudioWaveform, duration: 0 },
] as const;

export function VoiceGeneratingState() {
  const [activeStep, setActiveStep] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setElapsed((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeStep >= STEPS.length - 1) return;

    const timeout = setTimeout(() => {
      setActiveStep((prev) => prev + 1);
    }, STEPS[activeStep].duration);

    return () => clearTimeout(timeout);
  }, [activeStep]);

  return (
    <div className="hidden flex-1 lg:flex h-full flex-col items-center justify-center gap-8 border-t">
      {/* Pulsing icon */}
      <div className="relative flex items-center justify-center">
        <div className="absolute size-20 animate-ping rounded-full bg-foreground/5" />
        <div className="absolute size-16 animate-pulse rounded-full bg-foreground/10" />
        <div className="relative z-10 rounded-full bg-foreground p-4">
          <AudioLines className="size-5 text-background animate-pulse" />
        </div>
      </div>

      {/* Steps */}
      <div className="flex flex-col items-center gap-4">
        <div className="flex flex-col gap-2">
          {STEPS.map((step, i) => {
            const StepIcon = step.icon;
            const isActive = i === activeStep;
            const isDone = i < activeStep;

            return (
              <div
                key={i}
                className={cn(
                  "flex items-center gap-2.5 text-sm transition-all duration-500",
                  isActive && "text-foreground font-medium",
                  isDone && "text-muted-foreground",
                  !isActive && !isDone && "text-muted-foreground/40",
                )}
              >
                <StepIcon
                  className={cn(
                    "size-3.5 shrink-0 transition-all duration-500",
                    isActive && "animate-pulse",
                  )}
                />
                <span>{step.label}</span>
                {isDone && (
                  <span className="text-xs text-muted-foreground">done</span>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-xs tabular-nums text-muted-foreground">
          {elapsed}s elapsed
        </p>
      </div>
    </div>
  );
}
