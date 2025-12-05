"use client";

import React, { useState, useRef, useEffect, type KeyboardEvent } from "react";

interface CommandPromptProps {
  unlockedChars: Set<string>;
  onSubmit: (command: string) => void;
  disabled?: boolean;
  commandHistory?: string[];
}

/**
 * CommandPrompt Component
 * Handles text input with character filtering, visual feedback for locked characters,
 * and command history navigation
 */
export function CommandPrompt({
  unlockedChars,
  onSubmit,
  disabled = false,
  commandHistory = [],
}: CommandPromptProps) {
  const [input, setInput] = useState("");
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [lockedKeyPressed, setLockedKeyPressed] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Import game context for light mode
  const { useGameContext } = require('@/lib/game/GameContext');
  const { state } = useGameContext();

  // Focus input on mount
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Clear locked key feedback after delay
  useEffect(() => {
    if (lockedKeyPressed) {
      // Scroll to bottom when error appears
      const terminalBody = document.querySelector(".terminal-body");
      if (terminalBody) {
        terminalBody.scrollTop = terminalBody.scrollHeight;
      }

      const timer = setTimeout(() => {
        setLockedKeyPressed(null);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [lockedKeyPressed]);

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    // Handle command history navigation
    if (e.key === "ArrowUp") {
      e.preventDefault();
      if (commandHistory.length > 0) {
        const newIndex =
          historyIndex < commandHistory.length - 1
            ? historyIndex + 1
            : historyIndex;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      }
      return;
    }

    if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[commandHistory.length - 1 - newIndex] || "");
      } else if (historyIndex === 0) {
        setHistoryIndex(-1);
        setInput("");
      }
      return;
    }

    // Handle Enter key
    if (e.key === "Enter") {
      e.preventDefault();
      if (input.trim() && !disabled) {
        onSubmit(input.trim());
        setInput("");
        setHistoryIndex(-1);
      }
      return;
    }

    // Check if character is locked (for all printable characters)
    if (e.key.length === 1) {
      const char = e.key.toLowerCase();

      // Check if character is unlocked (including symbols and numbers)
      if (!unlockedChars.has(char)) {
        e.preventDefault();
        setLockedKeyPressed(char);
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;

    // Filter out locked characters (including symbols)
    const filtered = newValue
      .split("")
      .filter((char) => {
        const lower = char.toLowerCase();
        // Only allow unlocked characters (letters, numbers, and symbols)
        return unlockedChars.has(lower);
      })
      .join("");

    setInput(filtered);
  };

  return (
    <div className="command-prompt-container">
      <div className="prompt-line">
        <span className="prompt-prefix">
          <span className="prompt-user">cursed@kirosh</span>
          <span className="prompt-separator">:</span>
          <span className="prompt-path">~</span>
          <span className="prompt-symbol">$</span>
        </span>

        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="prompt-input"
          autoComplete="off"
          spellCheck={false}
          placeholder={disabled ? "Terminal locked..." : ""}
        />
      </div>

      {lockedKeyPressed && (
        <div className="locked-feedback">
          Character '{lockedKeyPressed}' is locked! Use Morse code to unlock.
        </div>
      )}

      <style jsx>{`
        .command-prompt-container {
          margin-top: 8px;
        }
        
        .prompt-line {
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .prompt-prefix {
          display: flex;
          gap: 4px;
          flex-shrink: 0;
        }
        
        .prompt-user {
          color: ${state.lightMode ? '#0077cc' : '#ff8833'};
          font-weight: bold;
        }
        
        .prompt-separator {
          color: ${state.lightMode ? '#0099ff' : '#ff6600'};
        }
        
        .prompt-path {
          color: ${state.lightMode ? '#66cc00' : '#9933ff'};
          font-weight: bold;
        }
        
        .prompt-symbol {
          color: ${state.lightMode ? '#0099ff' : '#ff6600'};
        }
        
        .prompt-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          color: ${state.lightMode ? '#0099ff' : '#ff6600'};
          font-family: 'Courier New', monospace;
          font-size: 16px;
          caret-color: ${state.lightMode ? '#0099ff' : '#ff6600'};
        }
        
        .prompt-input::placeholder {
          color: ${state.lightMode ? '#999' : '#666'};
          font-style: italic;
        }
        
        .prompt-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .locked-feedback {
          margin-top: 8px;
          padding: 8px 12px;
          background: ${state.lightMode ? 'rgba(255, 51, 0, 0.2)' : 'rgba(204, 0, 0, 0.2)'};
          border-left: 3px solid ${state.lightMode ? '#ff3300' : '#cc0000'};
          color: ${state.lightMode ? '#ff3300' : '#ff6666'};
          font-size: 14px;
          animation: shake 0.3s ease-in-out;
        }
        
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-4px); }
          75% { transform: translateX(4px); }
        }
      `}</style>
    </div>
  );
}
