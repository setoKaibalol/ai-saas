"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-form";

import { useTRPC } from "@/trpc/client";
import { TextInputPanel } from "@/features/text-to-speech/components/text-input-panel";
import { VoicePreviewPlaceholder } from "@/features/text-to-speech/components/voice-preview-placeholder";
import { VoiceGeneratingState } from "@/features/text-to-speech/components/voice-generating-state";
import { SettingsPanel } from "@/features/text-to-speech/components/settings-panel";
import { useTypedAppFormContext } from "@/hooks/use-app-form";
import {
  TextToSpeechForm,
  ttsFormOptions,
  defaultTTSValues,
  type TTSFormValues
} from "@/features/text-to-speech/components/text-to-speech-form";
import { TTSVoicesProvider } from "../contexts/tts-voices-context";

export function TextToSpeechView({
  initialValues,
}: {
  initialValues?: Partial<TTSFormValues>;
}) {
  const trpc = useTRPC();
  const { 
    data: voices,
  } = useSuspenseQuery(trpc.voices.getAll.queryOptions());

  const { custom: customVoices, system: systemVoices } = voices;

  const allVoices = [...customVoices, ...systemVoices];
  const fallbackVoiceId = allVoices[0]?.id ?? "";

  // Requested voice may no longer exist (deleted); fall back to first available
  const resolvedVoiceId =
    initialValues?.voiceId &&
    allVoices.some((v) => v.id === initialValues.voiceId)
      ? initialValues.voiceId
      : fallbackVoiceId;

  const defaultValues: TTSFormValues = {
    ...defaultTTSValues,
    ...initialValues,
    voiceId: resolvedVoiceId,
  };

  return (
    <TTSVoicesProvider value={{ customVoices, systemVoices, allVoices }}>
      <TextToSpeechForm defaultValues={defaultValues}>
        <div className="flex min-h-0 flex-1 overflow-hidden">
          <div className="flex min-h-0 flex-1 flex-col">
            <TextInputPanel />
            <PreviewOrGenerating />
          </div>
          <SettingsPanel />
        </div>
      </TextToSpeechForm>
    </TTSVoicesProvider>
  );
};

function PreviewOrGenerating() {
  const form = useTypedAppFormContext(ttsFormOptions);
  const isSubmitting = useStore(form.store, (s) => s.isSubmitting);

  if (isSubmitting) {
    return <VoiceGeneratingState />;
  }

  return <VoicePreviewPlaceholder />;
}
