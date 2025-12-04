'use client';

import { useCallback } from 'react';
import { useAudio as useAudioContext } from '@/components/audio/AudioManager';

/**
 * Custom hook for audio playback
 * Provides convenient methods for playing game sounds
 */
export function useAudio() {
  const { audioController, isLoaded, isEnabled, volume, setVolume: setVolumeContext, setIsEnabled } = useAudioContext();

  const playHeartbeat = useCallback(async () => {
    if (audioController && isLoaded && isEnabled) {
      await audioController.playHeartbeat();
    }
  }, [audioController, isLoaded, isEnabled]);

  const playScream = useCallback(async () => {
    if (audioController && isLoaded && isEnabled) {
      await audioController.playScream();
    }
  }, [audioController, isLoaded, isEnabled]);

  const playAmbientHeartbeat = useCallback(() => {
    if (audioController && isLoaded && isEnabled) {
      audioController.playAmbientHeartbeat();
    }
  }, [audioController, isLoaded, isEnabled]);

  const stopAmbientHeartbeat = useCallback(() => {
    if (audioController && isLoaded) {
      audioController.stopAmbientHeartbeat();
    }
  }, [audioController, isLoaded]);

  const setVolume = useCallback(
    (vol: number) => {
      setVolumeContext(vol);
    },
    [setVolumeContext]
  );

  const toggleAudio = useCallback(() => {
    setIsEnabled(!isEnabled);
  }, [isEnabled, setIsEnabled]);

  return {
    playHeartbeat,
    playScream,
    playAmbientHeartbeat,
    stopAmbientHeartbeat,
    setVolume,
    toggleAudio,
    isLoaded,
    isEnabled,
    volume,
  };
}
