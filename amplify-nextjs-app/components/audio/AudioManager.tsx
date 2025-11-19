'use client';

import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { getAudioController, type AudioController } from '@/lib/audio/audioController';

interface AudioContextType {
  audioController: AudioController | null;
  isLoaded: boolean;
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
}

const AudioContext = createContext<AudioContextType>({
  audioController: null,
  isLoaded: false,
  isEnabled: true,
  setIsEnabled: () => {},
});

export function useAudio() {
  return useContext(AudioContext);
}

interface AudioManagerProps {
  enabled?: boolean;
  children: ReactNode;
}

export default function AudioManager({ enabled = true, children }: AudioManagerProps) {
  const [audioController, setAudioController] = useState<AudioController | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isEnabled, setIsEnabled] = useState(enabled);

  useEffect(() => {
    const controller = getAudioController();
    setAudioController(controller);

    // Load audio files
    controller.loadAudioFiles().then(() => {
      setIsLoaded(controller.isLoaded);
    });
  }, []);

  const value: AudioContextType = {
    audioController,
    isLoaded,
    isEnabled,
    setIsEnabled,
  };

  return <AudioContext.Provider value={value}>{children}</AudioContext.Provider>;
}
