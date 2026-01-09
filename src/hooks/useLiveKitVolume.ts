import { useEffect, useState } from "react";
import { Participant, ParticipantEvent } from "livekit-client";

export const useLiveKitVolume = (participant?: Participant) => {
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!participant) return;

    const onAudioLevelChanged = (level: number) => {
      setVolume(prev => {
          if (level > prev) return level;
          return prev * 0.9;
      });
    };

    // Use the ParticipantEvent enum to satisfy TypeScript
    participant.on(ParticipantEvent.AudioLevelChanged, onAudioLevelChanged);
    setVolume(participant.audioLevel);

    return () => {
      participant.off(ParticipantEvent.AudioLevelChanged, onAudioLevelChanged);
    };
  }, [participant]);

  return volume;
};