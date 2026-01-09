import { useEffect, useState } from "react";
import { Participant, Track } from "livekit-client";

export const useLiveKitVolume = (participant?: Participant) => {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!participant) return;

    const onAudioLevelChanged = (level: number) => {
      // LiveKit returns level in decibels (0 to 1 usually, but can vary)
      // We accept the raw level directly as it maps well to our scale
      // We can apply a slight multiplier if it's too subtle
      setVolume(prev => {
          // Smooth decay to prevent jitter
          if (level > prev) return level;
          return prev * 0.9; // Slow fade out
      });
    };

    // Listen to the specific event on this participant
    participant.on("audioLevelChanged", onAudioLevelChanged);

    // Check if they are currently speaking to set initial state
    setVolume(participant.audioLevel);

    return () => {
      participant.off("audioLevelChanged", onAudioLevelChanged);
    };
  }, [participant]);

  return volume;
};