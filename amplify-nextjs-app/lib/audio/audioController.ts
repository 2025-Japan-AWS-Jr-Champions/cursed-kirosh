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
      soundGain.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.05);
      
      source.connect(soundGain);
      source.start(0);
      
      // Fade out at the end
      const duration = this.heartbeatBuffer.duration;
      soundGain.gain.setValueAtTime(1, this.audioContext.currentTime + duration - 0.1);
      soundGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
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
      soundGain.gain.linearRampToValueAtTime(1, this.audioContext.currentTime + 0.05);
      
      source.connect(soundGain);
      source.start(0);
      
      // Fade out at the end
      const duration = this.screamBuffer.duration;
      soundGain.gain.setValueAtTime(1, this.audioContext.currentTime + duration - 0.1);
      soundGain.gain.linearRampToValueAtTime(0, this.audioContext.currentTime + duration);
    } catch (error) {
      console.error("Failed to play scream:", error);
    }
  }

  playAmbientHeartbeat(): void {
    if (!this.audioContext || !this.heartbeatBuffer || !this.gainNode) {
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
      this.ambientGain.gain.value = 0; // Start at 0 for fade in
      this.ambientGain.connect(this.gainNode);
      
      this.ambientSource = this.audioContext.createBufferSource();
      this.ambientSource.buffer = this.heartbeatBuffer;
      this.ambientSource.loop = true;
      this.ambientSource.connect(this.ambientGain);
      
      // Fade in the ambient sound over 2 seconds
      this.ambientGain.gain.setValueAtTime(0, this.audioContext.currentTime);
      this.ambientGain.gain.linearRampToValueAtTime(0.4, this.audioContext.currentTime + 2);
      
      this.ambientSource.start(0);
      
      console.log("Ambient heartbeat started");
    } catch (error) {
      console.error("Failed to play ambient heartbeat:", error);
    }
  }

  stopAmbientHeartbeat(): void {
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
