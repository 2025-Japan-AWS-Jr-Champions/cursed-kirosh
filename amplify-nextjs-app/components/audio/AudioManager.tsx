"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  getAudioController,
  type AudioController,
} from "@/lib/audio/audioController";

interface AudioContextType {
  audioController: AudioController | null;
  isLoaded: boolean;
  isEnabled: boolean;
  volume: number;
  setIsEnabled: (enabled: boolean) => void;
  setVolume: (volume: number) => void;
}

const AudioContext = createContext<AudioContextType>({
  audioController: null,
  isLoaded: false,
  isEnabled: true,
  volume: 0.5,
  setIsEnabled: () => {},
  setVolume: () => {},
});

export function useAudio() {
  return useContext(AudioContext);
}

interface AudioManagerProps {
  enabled?: boolean;
  children: ReactNode;
}

export default function AudioManager({
  enabled = true,
  children,
}: AudioManagerProps) {
  const [audioController, setAudioController] =
    useState<AudioController | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(enabled);
  const [volume, setVolumeState] = useState(0.5);

  useEffect(() => {
    const controller = getAudioController();
    setAudioController(controller);

    // Load audio files
    controller.loadAudioFiles().then(() => {
      setIsLoaded(controller.isLoaded);
    });

    // Load saved preferences from localStorage
    if (typeof window !== "undefined") {
      const savedEnabled = localStorage.getItem("audio-enabled");
      const savedVolume = localStorage.getItem("audio-volume");

      if (savedEnabled !== null) {
        setIsEnabled(savedEnabled === "true");
      }

      if (savedVolume !== null) {
        const vol = parseFloat(savedVolume);
        if (!Number.isNaN(vol) && vol >= 0 && vol <= 1) {
          setVolumeState(vol);
          controller.setVolume(vol);
        }
      }
    }
  }, []);

  const handleSetEnabled = (enabled: boolean) => {
    setIsEnabled(enabled);
    if (typeof window !== "undefined") {
      localStorage.setItem("audio-enabled", enabled.toString());
    }

    // Stop ambient heartbeat if disabling
    if (!enabled && audioController) {
      audioController.stopAmbientHeartbeat();
    }
  };

  const handleSetVolume = (vol: number) => {
    const clampedVolume = Math.max(0, Math.min(1, vol));
    setVolumeState(clampedVolume);

    if (audioController) {
      audioController.setVolume(clampedVolume);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem("audio-volume", clampedVolume.toString());
    }
  };

  const value: AudioContextType = {
    audioController,
    isLoaded,
    isEnabled,
    volume,
    setIsEnabled: handleSetEnabled,
    setVolume: handleSetVolume,
  };

  return (
    <AudioContext.Provider value={value}>{children}</AudioContext.Provider>
  );
}
