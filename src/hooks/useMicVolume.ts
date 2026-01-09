import { useEffect, useRef, useState } from "react";

export const useMicVolume = (enabled: boolean) => {
  const [volume, setVolume] = useState(0);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    if (!enabled) {
      cleanup();
      return;
    }

    const startMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        streamRef.current = stream;

        const audioContext = new AudioContext();
        audioContextRef.current = audioContext;

        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8; // Smoothing factor (0.0 - 1.0)
        analyserRef.current = analyser;

        const source = audioContext.createMediaStreamSource(stream);
        sourceRef.current = source;
        source.connect(analyser);

        const dataArray = new Uint8Array(analyser.frequencyBinCount);

        const updateVolume = () => {
          analyser.getByteFrequencyData(dataArray);
          
          // Calculate average volume
          let sum = 0;
          for (let i = 0; i < dataArray.length; i++) {
            sum += dataArray[i];
          }
          const average = sum / dataArray.length;
          
          // Normalize to 0.0 - 1.0 range (Typical max byte value is 255)
          // We amplify it a bit (multiply by 2) to make it more reactive
          const norm = Math.min((average / 255) * 2.5, 1);

          setVolume(prev => {
              // Smooth decay: Rise fast, fall slow
              if (norm > prev) return prev + (norm - prev) * 0.5; // Attack
              return prev + (norm - prev) * 0.1; // Decay
          });

          animationFrameRef.current = requestAnimationFrame(updateVolume);
        };

        updateVolume();

      } catch (err) {
        console.error("Microphone access denied:", err);
      }
    };

    startMic();

    return cleanup;
  }, [enabled]);

  const cleanup = () => {
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
    if (audioContextRef.current) audioContextRef.current.close();
    setVolume(0);
  };

  return volume;
};