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
  isLoaded: boolean;
}

class AudioControllerImpl implements AudioController {
  private audioContext: AudioContext | null = null;
  private heartbeatBuffer: AudioBuffer | null = null;
  private screamBuffer: AudioBuffer | null = null;
  private ambientSource: AudioBufferSourceNode | null = null;
  private gainNode: GainNode | null = null;
  private volume = 0.5;
  public isLoaded = false;

  constructor() {
    if (typeof window !== 'undefined') {
      this.initializeAudioContext();
    }
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
      this.gainNode.gain.value = this.volume;
    } catch (error) {
      console.error('Failed to initialize audio context:', error);
    }
  }

  async loadAudioFiles() {
    if (!this.audioContext) {
      console.warn('Audio context not initialized');
      return;
    }

    try {
      // Load heartbeat
      const heartbeatResponse = await fetch('/audio/heartbeat.mp3');
      const heartbeatArrayBuffer = await heartbeatResponse.arrayBuffer();
      this.heartbeatBuffer = await this.audioContext.decodeAudioData(heartbeatArrayBuffer);

      // Load scream
      const screamResponse = await fetch('/audio/scream.mp3');
      const screamArrayBuffer = await screamResponse.arrayBuffer();
      this.screamBuffer = await this.audioContext.decodeAudioData(screamArrayBuffer);

      this.isLoaded = true;
    } catch (error) {
      console.error('Failed to load audio files:', error);
    }
  }

  async playHeartbeat(): Promise<void> {
    if (!this.audioContext || !this.heartbeatBuffer || !this.gainNode) {
      return;
    }

    try {
      // Resume audio context if suspended (browser autoplay policy)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = this.heartbeatBuffer;
      source.connect(this.gainNode);
      source.start(0);
    } catch (error) {
      console.error('Failed to play heartbeat:', error);
    }
  }

  async playScream(): Promise<void> {
    if (!this.audioContext || !this.screamBuffer || !this.gainNode) {
      return;
    }

    try {
      // Resume audio context if suspended (browser autoplay policy)
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      const source = this.audioContext.createBufferSource();
      source.buffer = this.screamBuffer;
      source.connect(this.gainNode);
      source.start(0);
    } catch (error) {
      console.error('Failed to play scream:', error);
    }
  }

  playAmbientHeartbeat(): void {
    if (!this.audioContext || !this.heartbeatBuffer || !this.gainNode) {
      return;
    }

    // Stop existing ambient if playing
    this.stopAmbientHeartbeat();

    try {
      this.ambientSource = this.audioContext.createBufferSource();
      this.ambientSource.buffer = this.heartbeatBuffer;
      this.ambientSource.loop = true;
      this.ambientSource.connect(this.gainNode);
      this.ambientSource.start(0);
    } catch (error) {
      console.error('Failed to play ambient heartbeat:', error);
    }
  }

  stopAmbientHeartbeat(): void {
    if (this.ambientSource) {
      try {
        this.ambientSource.stop();
        this.ambientSource.disconnect();
      } catch (error) {
        // Source might already be stopped
      }
      this.ambientSource = null;
    }
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
