/**
 * Audio controller for managing game sound effects
 * Uses Web Audio API for better control and performance
 */

export interface AudioController {
  playHeartbeat: () => Promise<void>;
  playScream: () => Promise<void>;
  playAmbientHeartbeat: () => void;
  stopAmbientHeartbeat: () => void;
  setVolume: (volume: number) => void;
  loadAudioFiles: () => Promise<void>;
  isLoaded: boolean;
}

class AudioControllerImpl implements AudioController {
  private audioContext: AudioContext | null = null;
  private heartbeatBuffer: AudioBuffer | null = null;
  private screamBuffer: AudioBuffer | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;
  private ambientGain: GainNode | null = null;
  private gainNode: GainNode | null = null;
  private volume = 0.5;
  public isLoaded = false;
  private ambientTimeoutId: number | null = null;
  private ambientHeartbeatCount = 0;

  constructor() {
    if (typeof window !== "undefined") {
      this.initializeAudioContext();
    }
  }

  private initializeAudioContext() {
    try {
      const AudioContextClass =
        window.AudioContext ||
        (window as typeof window & { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      this.audioContext = new AudioContextClass();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.volume;
    } catch (error) {
      console.error("Failed to initialize audio context:", error);
    }
  }

  async loadAudioFiles() {
    if (!this.audioContext) {
      console.warn("Audio context not initialized");
      return;
    }

    try {
      // Load heartbeat
      const heartbeatResponse = await fetch("/audio/heartbeat.mp3");
      const heartbeatArrayBuffer = await heartbeatResponse.arrayBuffer();
      this.heartbeatBuffer =
        await this.audioContext.decodeAudioData(heartbeatArrayBuffer);

      // Load scream
      const screamResponse = await fetch("/audio/scream.mp3");
      const screamArrayBuffer = await screamResponse.arrayBuffer();
      this.screamBuffer =
        await this.audioContext.decodeAudioData(screamArrayBuffer);

      this.isLoaded = true;
    } catch (error) {
      console.error("Failed to load audio files:", error);
    }
  }

  async playHeartbeat(): Promise<void> {
    if (!this.audioContext || !this.heartbeatBuffer || !this.gainNode) {
      return;
    }

    try {
      // Resume audio context if suspended (browser autoplay policy)
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = this.heartbeatBuffer;

      // Create a gain node for this specific sound for fade effects
      const soundGain = this.audioContext.createGain();
      soundGain.connect(this.gainNode);

      // Quick fade in for smoother playback
      soundGain.gain.setValueAtTime(0, this.audioContext.currentTime);
      soundGain.gain.linearRampToValueAtTime(
        1,
        this.audioContext.currentTime + 0.05,
      );

      source.connect(soundGain);
      source.start(0);

      // Fade out at the end
      const duration = this.heartbeatBuffer.duration;
      soundGain.gain.setValueAtTime(
        1,
        this.audioContext.currentTime + duration - 0.1,
      );
      soundGain.gain.linearRampToValueAtTime(
        0,
        this.audioContext.currentTime + duration,
      );
    } catch (error) {
      console.error("Failed to play heartbeat:", error);
    }
  }

  async playScream(): Promise<void> {
    if (!this.audioContext || !this.screamBuffer || !this.gainNode) {
      return;
    }

    try {
      // Resume audio context if suspended (browser autoplay policy)
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = this.screamBuffer;

      // Create a gain node for this specific sound for fade effects
      const soundGain = this.audioContext.createGain();
      soundGain.connect(this.gainNode);

      // Quick fade in for smoother playback
      soundGain.gain.setValueAtTime(0, this.audioContext.currentTime);
      soundGain.gain.linearRampToValueAtTime(
        1,
        this.audioContext.currentTime + 0.05,
      );

      source.connect(soundGain);
      source.start(0);

      // Fade out at the end
      const duration = this.screamBuffer.duration;
      soundGain.gain.setValueAtTime(
        1,
        this.audioContext.currentTime + duration - 0.1,
      );
      soundGain.gain.linearRampToValueAtTime(
        0,
        this.audioContext.currentTime + duration,
      );
    } catch (error) {
      console.error("Failed to play scream:", error);
    }
  }

  playAmbientHeartbeat(): void {
    if (
      !this.audioContext ||
      !this.heartbeatBuffer ||
      !this.screamBuffer ||
      !this.gainNode
    ) {
      return;
    }

    // Stop existing ambient if playing
    this.stopAmbientHeartbeat();

    try {
      // Resume audio context if suspended (browser autoplay policy)
      if (this.audioContext.state === "suspended") {
        this.audioContext.resume();
      }

      // Create a separate gain node for ambient with lower volume
      this.ambientGain = this.audioContext.createGain();
      this.ambientGain.gain.value = 0.3; // Lower volume for ambient
      this.ambientGain.connect(this.gainNode);

      // Reset counter and start pattern
      this.ambientHeartbeatCount = 0;
      this.playAmbientPattern();

      console.log("Ambient pattern started");
    } catch (error) {
      console.error("Failed to play ambient:", error);
    }
  }

  private playAmbientPattern(): void {
    if (!this.audioContext || !this.ambientGain || !this.heartbeatBuffer)
      return;

    // Pattern: 10 heartbeats, 2 OSS, 10 heartbeats, 2 OSS, repeat...
    let shouldPlayOSS = false;
    let ossCount = 0;

    if (this.ambientHeartbeatCount >= 10) {
      // After 10 heartbeats, play 2 OSS
      shouldPlayOSS = true;
      ossCount = 2;
      this.ambientHeartbeatCount = 0; // Reset counter
    }

    if (shouldPlayOSS) {
      // Play OSS sequences
      this.playOSSSequences(ossCount);
    } else {
      // Play single heartbeat
      this.playSingleAmbientHeartbeat();
    }
  }

  private playSingleAmbientHeartbeat(): void {
    if (!this.audioContext || !this.heartbeatBuffer || !this.ambientGain)
      return;

    const source = this.audioContext.createBufferSource();
    source.buffer = this.heartbeatBuffer;
    source.connect(this.ambientGain);
    source.start(0);

    this.ambientHeartbeatCount++;

    // Schedule next heartbeat (slower pace for ambient)
    const heartbeatInterval = 1500; // 1.5 seconds between heartbeats
    this.ambientTimeoutId = window.setTimeout(() => {
      if (this.ambientGain) {
        this.playAmbientPattern();
      }
    }, heartbeatInterval);
  }

  private playOSSSequences(count: number): void {
    if (!this.audioContext || !this.ambientGain) return;

    let currentTime = this.audioContext.currentTime;
    const dotDuration = 0.2;
    const dashDuration = 0.6;
    const gapBetweenSignals = 0.3;
    const gapBetweenLetters = 0.8;
    const gapBetweenWords = 2.0;

    // Play OSS sequence 'count' times
    for (let seq = 0; seq < count; seq++) {
      // O = --- (dash dash dash)
      for (let i = 0; i < 3; i++) {
        this.scheduleScream(currentTime);
        currentTime += dashDuration + gapBetweenSignals;
      }
      currentTime += gapBetweenLetters - gapBetweenSignals;

      // S = ... (dot dot dot)
      for (let i = 0; i < 3; i++) {
        this.scheduleHeartbeat(currentTime);
        currentTime += dotDuration + gapBetweenSignals;
      }
      currentTime += gapBetweenLetters - gapBetweenSignals;

      // S = ... (dot dot dot)
      for (let i = 0; i < 3; i++) {
        this.scheduleHeartbeat(currentTime);
        currentTime += dotDuration + gapBetweenSignals;
      }
      currentTime += gapBetweenWords;
    }

    // Schedule next pattern after OSS sequences complete
    const totalDuration = (currentTime - this.audioContext.currentTime) * 1000;
    this.ambientTimeoutId = window.setTimeout(() => {
      if (this.ambientGain) {
        this.playAmbientPattern();
      }
    }, totalDuration);
  }

  private scheduleHeartbeat(startTime: number): void {
    if (!this.audioContext || !this.heartbeatBuffer || !this.ambientGain)
      return;

    const source = this.audioContext.createBufferSource();
    source.buffer = this.heartbeatBuffer;
    source.connect(this.ambientGain);
    source.start(startTime);
  }

  private scheduleScream(startTime: number): void {
    if (!this.audioContext || !this.screamBuffer || !this.ambientGain) return;

    const source = this.audioContext.createBufferSource();
    source.buffer = this.screamBuffer;
    source.connect(this.ambientGain);
    source.start(startTime);
  }

  stopAmbientHeartbeat(): void {
    // Clear any pending timeouts
    if (this.ambientTimeoutId !== null) {
      clearTimeout(this.ambientTimeoutId);
      this.ambientTimeoutId = null;
    }

    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
      } catch (_error) {
        // Source might already be stopped
      }
      this.ambientSource = null;
    }

    if (this.ambientGain) {
      try {
        this.ambientGain.disconnect();
      } catch (_error) {
        // Gain might already be disconnected
      }
      this.ambientGain = null;
    }

    // Reset counter
    this.ambientHeartbeatCount = 0;

    console.log("Ambient heartbeat stopped");
  }

  setVolume(volume: number): void {
    this.volume = Math.max(0, Math.min(1, volume));
    if (this.gainNode) {
      this.gainNode.gain.value = this.volume;
    }
  }
}

// Singleton instance
let audioControllerInstance: AudioControllerImpl | null = null;

export function getAudioController(): AudioController {
  if (!audioControllerInstance) {
    audioControllerInstance = new AudioControllerImpl();
  }
  return audioControllerInstance;
}
