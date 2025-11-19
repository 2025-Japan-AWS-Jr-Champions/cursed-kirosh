'use client';

import { useCallback } from 'react';
import { useAudio as useAudioContext } from '@/components/audio/AudioManager';

/**
 * Custom hook for audio playback
 * Provides convenient methods for playing game sounds
 */
export function useAudio() {
  const { audioController, isLoaded, isEnabled } = useAudioContext();

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
    (volume: number) => {
      if (audioController) {
        audioController.setVolume(volume);
      }
    },
    [audioController]
  );

  return {
    playHeartbeat,
    playScream,
    playAmbientHeartbeat,
    stopAmbientHeartbeat,
    setVolume,
    isLoaded,
    isEnabled,
  };
}
