'use client';

import { useAudio } from './AudioManager';

/**
 * AudioControls Component
 * Provides UI controls for audio volume and enable/disable toggle
 */
export function AudioControls() {
  const { isEnabled, volume, setIsEnabled, setVolume, isLoaded } = useAudio();

  if (!isLoaded) {
    return null;
  }

  return (
    <div className="audio-controls">
      <div className="audio-controls-container">
        {/* Enable/Disable Toggle */}
        <button
          type="button"
          onClick={() => setIsEnabled(!isEnabled)}
          className="audio-toggle"
          aria-label={isEnabled ? 'Disable audio' : 'Enable audio'}
          title={isEnabled ? 'Disable audio' : 'Enable audio'}
        >
          {isEnabled ? '🔊' : '🔇'}
        </button>

        {/* Volume Slider */}
        {isEnabled && (
          <div className="volume-control">
            <label htmlFor="volume-slider" className="volume-label">
              Volume
            </label>
            <input
              id="volume-slider"
              type="range"
              min="0"
              max="100"
              value={volume * 100}
              onChange={(e) => setVolume(Number.parseInt(e.target.value) / 100)}
              className="volume-slider"
              aria-label="Volume control"
            />
            <span className="volume-value">{Math.round(volume * 100)}%</span>
          </div>
        )}
      </div>

      <style jsx>{`
        .audio-controls {
          position: fixed;
          bottom: 20px;
          right: 20px;
          z-index: 100;
        }

        .audio-controls-container {
          display: flex;
          align-items: center;
          gap: 12px;
          background: linear-gradient(135deg, rgba(26, 10, 26, 0.95) 0%, rgba(10, 10, 10, 0.95) 100%);
          border: 2px solid var(--accent-purple);
          border-radius: 8px;
          padding: 12px 16px;
          box-shadow: 0 0 20px var(--glow-purple);
          backdrop-filter: blur(10px);
        }

        .audio-toggle {
          background: transparent;
          border: none;
          font-size: 24px;
          cursor: pointer;
          padding: 4px;
          transition: all 0.3s ease;
          filter: grayscale(0);
        }

        .audio-toggle:hover {
          transform: scale(1.1);
          filter: drop-shadow(0 0 8px var(--glow-orange));
        }

        .audio-toggle:active {
          transform: scale(0.95);
        }

        .volume-control {
          display: flex;
          align-items: center;
          gap: 8px;
        }

        .volume-label {
          color: var(--text-secondary);
          font-size: 12px;
          font-family: 'Courier New', monospace;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        .volume-slider {
          width: 100px;
          height: 6px;
          border-radius: 3px;
          background: linear-gradient(to right, 
            var(--accent-purple) 0%, 
            var(--accent-orange) 100%);
          outline: none;
          -webkit-appearance: none;
          appearance: none;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent-orange);
          cursor: pointer;
          box-shadow: 0 0 10px var(--glow-orange);
          transition: all 0.2s ease;
        }

        .volume-slider::-webkit-slider-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px var(--glow-orange-strong);
        }

        .volume-slider::-moz-range-thumb {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: var(--accent-orange);
          cursor: pointer;
          border: none;
          box-shadow: 0 0 10px var(--glow-orange);
          transition: all 0.2s ease;
        }

        .volume-slider::-moz-range-thumb:hover {
          transform: scale(1.2);
          box-shadow: 0 0 15px var(--glow-orange-strong);
        }

        .volume-value {
          color: var(--text-primary);
          font-size: 12px;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          min-width: 40px;
          text-align: right;
        }

        /* Mobile responsive */
        @media (max-width: 768px) {
          .audio-controls {
            bottom: 10px;
            right: 10px;
          }

          .audio-controls-container {
            padding: 8px 12px;
          }

          .volume-slider {
            width: 80px;
          }
        }
      `}</style>
    </div>
  );
}
