"use client";

import type React from "react";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface GhostEventProps {
  isActive: boolean;
  onTreat: () => void;
  onTrick: () => void;
  timeLimit: number; // in seconds
}

/**
 * GhostEvent Component
 * Displays ghost image with "trick or treat" prompt and countdown timer
 * During ghost event, character restrictions are lifted but typos cause failure
 * Requirements: 9.1
 */
export function GhostEvent({
  isActive,
  onTreat,
  onTrick,
  timeLimit,
}: GhostEventProps) {
  const [timeRemaining, setTimeRemaining] = useState(timeLimit);
  const [input, setInput] = useState("");
  const [error, setError] = useState("");
  const [isTypoDetected, setIsTypoDetected] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isActive) {
      setTimeRemaining(timeLimit);
      setInput("");
      setError("");
      setIsTypoDetected(false);
      return;
    }

    // Focus input when ghost appears
    inputRef.current?.focus();

    // Start countdown
    const interval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTrick(); // Time's up - trigger trick
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isActive, timeLimit, onTrick]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Ignore input if typo was already detected
    if (isTypoDetected) {
      e.preventDefault();
      return;
    }

    const value = e.target.value.toLowerCase();
    const target = "treat";

    // Check if input matches the beginning of "treat"
    if (target.startsWith(value)) {
      setInput(value);
      setError("");

      // Check if complete
      if (value === target) {
        onTreat();
      }
    } else {
      // Typo detected!
      setIsTypoDetected(true);
      setInput(value); // Show the typo
      setError("❌ TYPO! The ghost is angry!");
      
      // Wait 2 seconds before closing to let user read the message
      setTimeout(() => {
        onTrick();
      }, 2000);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // Prevent default behavior for Enter key
    if (e.key === "Enter") {
      e.preventDefault();
      if (input === "treat") {
        onTreat();
      }
    }
  };

  if (!isActive) {
    return null;
  }

  return (
    <div className="ghost-event-overlay">
      <div className="ghost-event-container">
        <div className="ghost-image-wrapper">
          <Image
            src="/image/ghost.png"
            alt="Ghost"
            width={200}
            height={200}
            className="ghost-image"
            priority
          />
          <div className="ghost-attribution">©DESIGNALIKIE</div>
        </div>

        <div className="ghost-prompt">
          <h2 className="ghost-title">TRICK OR TREAT?</h2>
          <p className="ghost-instruction">
            Type "treat" carefully - no typos allowed!
          </p>

          {/* Input field for typing "treat" */}
          <div className="ghost-input-container">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={handleInputChange}
              onKeyDown={handleKeyDown}
              className="ghost-input"
              placeholder="Type here..."
              maxLength={5}
              autoComplete="off"
              disabled={isTypoDetected}
            />
            <div className="ghost-input-hint">
              Target: <span className="target-word">treat</span>
            </div>
          </div>

          {error && <div className="ghost-error">{error}</div>}

          <div className="ghost-timer">
            <span className="timer-label">Time remaining:</span>
            <span className="timer-value">{timeRemaining}s</span>
          </div>
          <p className="ghost-warning">
            {timeRemaining <= 3
              ? "⚠️ HURRY! ⚠️"
              : "Character restrictions lifted during ghost event!"}
          </p>
        </div>
      </div>

      <style jsx>{`
        .ghost-event-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.9);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          animation: fadeIn 0.5s ease-in;
        }

        .ghost-event-container {
          background: linear-gradient(135deg, #1a0a1a 0%, #0a0a0a 100%);
          border: 3px solid #9933ff;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 0 40px rgba(153, 51, 255, 0.6);
          text-align: center;
          animation: slideUp 0.5s ease-out;
          max-width: 500px;
        }

        .ghost-image-wrapper {
          position: relative;
          margin-bottom: 24px;
        }

        .ghost-image {
          animation: float 3s ease-in-out infinite;
          filter: drop-shadow(0 0 20px rgba(255, 255, 255, 0.5));
        }

        .ghost-attribution {
          position: absolute;
          bottom: -20px;
          right: 50%;
          transform: translateX(50%);
          font-size: 10px;
          color: #666;
          font-family: 'Courier New', monospace;
        }

        .ghost-prompt {
          margin-top: 32px;
        }

        .ghost-title {
          font-size: 32px;
          font-weight: bold;
          color: #ff6600;
          margin-bottom: 16px;
          font-family: 'Courier New', monospace;
          letter-spacing: 4px;
          text-shadow: 0 0 10px rgba(255, 102, 0, 0.8);
          animation: pulse 2s ease-in-out infinite;
        }

        .ghost-instruction {
          font-size: 18px;
          color: #ff8833;
          margin-bottom: 24px;
          font-family: 'Courier New', monospace;
        }

        .ghost-timer {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 12px;
          margin-bottom: 16px;
          padding: 12px 24px;
          background: rgba(139, 0, 255, 0.2);
          border: 2px solid #8b00ff;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
        }

        .timer-label {
          color: #9933ff;
          font-size: 16px;
        }

        .timer-value {
          color: #ff6600;
          font-size: 24px;
          font-weight: bold;
          min-width: 50px;
          text-align: center;
        }

        .ghost-warning {
          font-size: 14px;
          color: ${timeRemaining <= 3 ? "#ff0000" : "#8b00ff"};
          font-family: 'Courier New', monospace;
          animation: ${timeRemaining <= 3 ? "blink 0.5s step-end infinite" : "none"};
        }

        .ghost-input-container {
          margin: 24px 0;
        }

        .ghost-input {
          width: 100%;
          padding: 16px;
          font-size: 24px;
          font-family: 'Courier New', monospace;
          text-align: center;
          background: rgba(10, 10, 10, 0.8);
          border: 3px solid #ff6600;
          border-radius: 8px;
          color: #ff6600;
          outline: none;
          letter-spacing: 4px;
          text-transform: lowercase;
          box-shadow: 0 0 20px rgba(255, 102, 0, 0.5);
        }

        .ghost-input:focus {
          border-color: #ff8833;
          box-shadow: 0 0 30px rgba(255, 102, 0, 0.8);
        }

        .ghost-input:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          border-color: #ff0000;
        }

        .ghost-input::placeholder {
          color: #666;
          letter-spacing: normal;
        }

        .ghost-input-hint {
          margin-top: 12px;
          font-size: 16px;
          color: #9933ff;
          text-align: center;
          font-family: 'Courier New', monospace;
        }

        .target-word {
          color: #ff6600;
          font-weight: bold;
          letter-spacing: 2px;
        }

        .ghost-error {
          margin: 16px 0;
          padding: 12px;
          background: rgba(255, 0, 0, 0.2);
          border: 2px solid #ff0000;
          border-radius: 8px;
          color: #ff0000;
          font-size: 18px;
          font-weight: bold;
          text-align: center;
          font-family: 'Courier New', monospace;
          animation: shake 0.5s;
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(100px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }

        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
