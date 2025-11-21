"use client";

import React from "react";

interface VirtualKeyboardProps {
  unlockedChars: Set<string>;
  onCharacterClick?: (char: string) => void;
}

/**
 * VirtualKeyboard Component
 * Displays QWERTY keyboard layout with locked/unlocked character states
 * Shows visual feedback when characters are unlocked
 */
export function VirtualKeyboard({
  unlockedChars,
  onCharacterClick,
}: VirtualKeyboardProps) {
  // QWERTY keyboard layout
  const keyboardRows = [
    ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
    ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
    ["z", "x", "c", "v", "b", "n", "m"],
  ];

  const commonSymbols = [" ", ".", ",", "!", "?", "-", "_"];

  const isUnlocked = (char: string): boolean => {
    return unlockedChars.has(char.toLowerCase());
  };

  const handleKeyClick = (char: string) => {
    if (isUnlocked(char) && onCharacterClick) {
      onCharacterClick(char);
    }
  };

  return (
    <div className="virtual-keyboard">
      <div className="keyboard-title">VIRTUAL KEYBOARD</div>

      {/* Alphabetic keys */}
      <div className="keyboard-rows">
        {keyboardRows.map((row) => (
          <div key={row.join("")} className="keyboard-row">
            {row.map((char) => (
              <Key
                key={char}
                character={char}
                isUnlocked={isUnlocked(char)}
                onClick={() => handleKeyClick(char)}
              />
            ))}
          </div>
        ))}
      </div>

      {/* Symbol keys */}
      <div className="keyboard-symbols">
        <div className="symbols-label">SYMBOLS:</div>
        <div className="symbols-row">
          {commonSymbols.map((char) => (
            <Key
              key={char === " " ? "space" : char}
              character={char === " " ? "SPACE" : char}
              isUnlocked={isUnlocked(char)}
              onClick={() => handleKeyClick(char)}
              isSymbol
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .virtual-keyboard {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 100%);
          border: 2px solid #9933ff;
          border-radius: 8px;
          padding: 24px;
          box-shadow: 0 0 20px rgba(153, 51, 255, 0.3);
          font-family: 'Courier New', monospace;
        }

        .keyboard-title {
          color: #ff6600;
          font-weight: bold;
          font-size: 14px;
          letter-spacing: 2px;
          text-align: center;
          margin-bottom: 20px;
          text-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
        }

        .keyboard-rows {
          display: flex;
          flex-direction: column;
          gap: 8px;
          margin-bottom: 20px;
        }

        .keyboard-row {
          display: flex;
          justify-content: center;
          gap: 6px;
        }

        .keyboard-symbols {
          border-top: 1px solid #9933ff;
          padding-top: 16px;
        }

        .symbols-label {
          color: #9933ff;
          font-size: 12px;
          font-weight: bold;
          margin-bottom: 8px;
          text-align: center;
        }

        .symbols-row {
          display: flex;
          justify-content: center;
          gap: 6px;
          flex-wrap: wrap;
        }
      `}</style>
    </div>
  );
}

interface KeyProps {
  character: string;
  isUnlocked: boolean;
  onClick: () => void;
  isSymbol?: boolean;
}

/**
 * Key Component
 * Individual keyboard key with lock/unlock states and crack animation
 */
function Key({ character, isUnlocked, onClick, isSymbol = false }: KeyProps) {
  const [justUnlocked, setJustUnlocked] = React.useState(false);

  // Track when a character becomes unlocked to trigger animation
  React.useEffect(() => {
    if (isUnlocked && !justUnlocked) {
      setJustUnlocked(true);
      // Reset animation state after it completes
      const timer = setTimeout(() => setJustUnlocked(false), 600);
      return () => clearTimeout(timer);
    } else if (!isUnlocked && justUnlocked) {
      // Reset animation state when character is locked again
      setJustUnlocked(false);
    }
  }, [isUnlocked, justUnlocked]);

  return (
    <button
      type="button"
      className={`key ${isUnlocked ? "unlocked" : "locked"} ${justUnlocked ? "crack-animation" : ""} ${isSymbol ? "symbol-key" : ""}`}
      onClick={onClick}
      disabled={!isUnlocked}
      aria-label={`${character} key - ${isUnlocked ? "unlocked" : "locked"}`}
    >
      <span className="key-char">{character.toUpperCase()}</span>
      {!isUnlocked && <span className="lock-icon">🔒</span>}

      <style jsx>{`
        .key {
          position: relative;
          width: ${isSymbol ? "60px" : "40px"};
          height: 40px;
          border: 2px solid;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 14px;
          font-weight: bold;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }

        .key.locked {
          background: #1a1a1a;
          border-color: #333333;
          color: #333333;
          cursor: not-allowed;
        }

        .key.locked:hover {
          background: #222222;
          box-shadow: 0 0 5px rgba(51, 51, 51, 0.5);
        }

        .key.unlocked {
          background: linear-gradient(135deg, #ff6600 0%, #ff8833 100%);
          border-color: #ff6600;
          color: #0a0a0a;
          box-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
        }

        .key.unlocked:hover {
          background: linear-gradient(135deg, #ff8833 0%, #ffaa55 100%);
          box-shadow: 0 0 15px rgba(255, 102, 0, 0.8);
          transform: translateY(-2px);
        }

        .key.unlocked:active {
          transform: translateY(0);
          box-shadow: 0 0 5px rgba(255, 102, 0, 0.5);
        }

        .key-char {
          position: relative;
          z-index: 2;
        }

        .lock-icon {
          position: absolute;
          top: 2px;
          right: 2px;
          font-size: 10px;
          opacity: 0.6;
        }

        /* Crack animation when character unlocks */
        .key.crack-animation {
          animation: crack 0.6s ease-out;
        }

        @keyframes crack {
          0% {
            background: #1a1a1a;
            border-color: #333333;
            transform: scale(1);
          }
          20% {
            transform: scale(1.1) rotate(2deg);
          }
          40% {
            transform: scale(0.95) rotate(-2deg);
            box-shadow: 0 0 20px rgba(255, 102, 0, 0.8),
                        inset 0 0 10px rgba(255, 102, 0, 0.5);
          }
          60% {
            transform: scale(1.05) rotate(1deg);
          }
          80% {
            transform: scale(0.98) rotate(-1deg);
          }
          100% {
            background: linear-gradient(135deg, #ff6600 0%, #ff8833 100%);
            border-color: #ff6600;
            transform: scale(1) rotate(0deg);
            box-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
          }
        }

        /* Add crack effect overlay during animation */
        .key.crack-animation::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(
            45deg,
            transparent 30%,
            rgba(255, 102, 0, 0.3) 50%,
            transparent 70%
          );
          animation: crack-flash 0.6s ease-out;
          pointer-events: none;
          z-index: 1;
        }

        @keyframes crack-flash {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
        }

        .symbol-key {
          font-size: 12px;
        }
      `}</style>
    </button>
  );
}
