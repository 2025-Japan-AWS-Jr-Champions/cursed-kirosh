"use client";

import { useGameContext } from "@/lib/game/GameContext";
import { OutputDisplay } from "./OutputDisplay";
import { CommandPrompt } from "./CommandPrompt";
import { CursedText } from "./CursedText";
import { useHints } from "@/hooks/useHints";
import { useRef, useEffect, useState } from "react";

interface TerminalProps {
  onCommand?: (command: string) => void;
  disabled?: boolean;
}

/**
 * Terminal Component
 * Main terminal interface with Halloween styling, cursor animation, and prompt display
 */
export function Terminal({ onCommand, disabled = false }: TerminalProps) {
  const { state, dispatch } = useGameContext();
  const { updateActivity } = useHints();
  const terminalBodyRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);
  const [autoScroll, setAutoScroll] = useState(true);

  // Auto-scroll to bottom when new output is added
  useEffect(() => {
    if (autoScroll && terminalBodyRef.current) {
      // Use setTimeout to ensure DOM has updated
      setTimeout(() => {
        if (terminalBodyRef.current) {
          terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
        }
      }, 0);
    }
  }, [state.outputLines, autoScroll]);

  // Check if user has scrolled up
  const handleScroll = () => {
    if (!terminalBodyRef.current) return;

    const { scrollTop, scrollHeight, clientHeight } = terminalBodyRef.current;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 10;

    if (!isAtBottom && autoScroll) {
      setAutoScroll(false);
      setShowScrollButton(true);
    } else if (isAtBottom && !autoScroll) {
      setAutoScroll(true);
      setShowScrollButton(false);
    }
  };

  const scrollToBottom = () => {
    if (terminalBodyRef.current) {
      terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
      setAutoScroll(true);
      setShowScrollButton(false);
    }
  };

  const handleCommandSubmit = (command: string) => {
    // Update activity time
    updateActivity();

    // Add command to history
    dispatch({
      type: "SUBMIT_COMMAND",
      command,
    });

    // Add command to output
    dispatch({
      type: "ADD_OUTPUT",
      line: {
        id: `cmd-${Date.now()}`,
        text: command,
        type: "command",
        timestamp: Date.now(),
      },
    });

    // Call parent handler if provided
    if (onCommand) {
      onCommand(command);
    }
  };

  const handleTerminalClick = () => {
    // Focus the input when clicking anywhere in the terminal
    const inputElement = document.querySelector(
      ".prompt-input",
    ) as HTMLInputElement;
    if (inputElement) {
      inputElement.focus();
    }
    // Also scroll to bottom and enable auto-scroll
    scrollToBottom();
  };

  return (
    <div className="terminal-container">
      <div className="terminal-header">
        <div className="terminal-title">CURSED TERMINAL</div>
        <div className="terminal-controls">
          <span className="control-dot bg-red-500" />
          <span className="control-dot bg-yellow-500" />
          <span className="control-dot bg-green-500" />
        </div>
      </div>

      {/* biome-ignore lint/a11y/useKeyWithClickEvents: Terminal body click focuses input, keyboard events handled by input itself */}
      {/* biome-ignore lint/a11y/noStaticElementInteractions: Click-to-focus is a common terminal UX pattern */}
      <div
        ref={terminalBodyRef}
        className="terminal-body"
        onClick={handleTerminalClick}
        onScroll={handleScroll}
      >
        {/* Welcome message - always shown */}
        <div className="terminal-welcome">
          <p className="text-system"><CursedText text="> SYSTEM CURSED..." delay={5000} /></p>
          <p className="text-system"><CursedText text="> MOST KEYS LOCKED..." delay={5000} /></p>
          <p className="text-system"><CursedText text="> USE MORSE CODE TO UNLOCK..." delay={5000} /></p>
          <p className="text-system"><CursedText text="> ONLY 's' AND 'o' AVAILABLE..." delay={5000} /></p>
          <p className="mt-4 text-primary"><CursedText text="Type 'help' for assistance" delay={5000} /></p>
        </div>

        {/* Output display */}
        <OutputDisplay lines={state.outputLines} />

        {/* Command prompt */}
        <CommandPrompt
          unlockedChars={state.unlockedChars}
          onSubmit={handleCommandSubmit}
          disabled={state.gameComplete || disabled}
          commandHistory={state.commandHistory}
        />

        {/* Show message when disabled by ghost event */}
        {disabled && !state.gameComplete && (
          <div className="terminal-disabled-message">
            👻 Ghost event active - use the ghost input above!
          </div>
        )}
      </div>

      {/* Scroll to bottom button */}
      {showScrollButton && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="scroll-to-bottom"
          aria-label="Scroll to bottom"
        >
          ↓
        </button>
      )}

      <style jsx>{`
        .terminal-container {
          background: ${state.lightMode 
            ? 'linear-gradient(135deg, #f5f5f5 0%, #e5f5e5 100%)' 
            : 'linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 100%)'};
          border: 2px solid ${state.lightMode ? '#66cc00' : '#9933ff'};
          border-radius: 8px;
          box-shadow: 0 0 20px ${state.lightMode ? 'rgba(102, 204, 0, 0.3)' : 'rgba(153, 51, 255, 0.3)'};
          height: 600px;
          display: flex;
          flex-direction: column;
          font-family: 'Courier New', monospace;
          overflow: hidden;
        }
        
        .terminal-header {
          background: ${state.lightMode ? '#e5f5e5' : '#1a0a1a'};
          border-bottom: 1px solid ${state.lightMode ? '#66cc00' : '#9933ff'};
          padding: 8px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .terminal-title {
          color: ${state.lightMode ? '#0099ff' : '#ff6600'};
          font-weight: bold;
          font-size: 14px;
          letter-spacing: 2px;
        }
        
        .terminal-controls {
          display: flex;
          gap: 8px;
        }
        
        .control-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          opacity: 0.8;
        }
        
        .terminal-body {
          flex: 1;
          padding: 16px;
          overflow-y: auto;
          color: ${state.lightMode ? '#0099ff' : '#ff6600'};
          font-size: 16px;
          line-height: 1.5;
        }
        
        .terminal-welcome {
          margin-bottom: 24px;
        }
        
        .text-system {
          color: ${state.lightMode ? '#4499ff' : '#bb66ff'};
          margin-bottom: 4px;
          font-weight: 500;
        }
        
        .text-primary {
          color: ${state.lightMode ? '#0099ff' : '#ff6600'};
        }
        
        .terminal-prompt {
          display: flex;
          gap: 4px;
          align-items: center;
          margin-top: 8px;
        }
        
        .prompt-text {
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
          margin-right: 8px;
        }
        
        .cursor-blink {
          color: ${state.lightMode ? '#0099ff' : '#ff6600'};
          animation: blink 1s step-end infinite;
          font-weight: bold;
        }
        
        @keyframes blink {
          0%, 50% {
            opacity: 1;
          }
          51%, 100% {
            opacity: 0;
          }
        }
        
        /* Scrollbar styling */
        .terminal-body::-webkit-scrollbar {
          width: 8px;
        }
        
        .terminal-body::-webkit-scrollbar-track {
          background: ${state.lightMode ? '#f5f5f5' : '#0a0a0a'};
        }
        
        .terminal-body::-webkit-scrollbar-thumb {
          background: ${state.lightMode ? '#66cc00' : '#9933ff'};
          border-radius: 4px;
        }
        
        .terminal-body::-webkit-scrollbar-thumb:hover {
          background: ${state.lightMode ? '#0099ff' : '#ff6600'};
        }
        
        .terminal-disabled-message {
          color: ${state.lightMode ? '#66cc00' : '#9933ff'};
          font-size: 14px;
          font-style: italic;
          margin-top: 8px;
          text-align: center;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        .scroll-to-bottom {
          position: absolute;
          bottom: 20px;
          right: 20px;
          width: 40px;
          height: 40px;
          background: ${state.lightMode 
            ? 'linear-gradient(135deg, #0099ff 0%, #0077cc 100%)' 
            : 'linear-gradient(135deg, #ff6600 0%, #ff8833 100%)'};
          border: 2px solid ${state.lightMode ? '#66cc00' : '#9933ff'};
          border-radius: 50%;
          color: ${state.lightMode ? '#f5f5f5' : '#0a0a0a'};
          font-size: 20px;
          font-weight: bold;
          cursor: pointer;
          box-shadow: 0 0 20px ${state.lightMode ? 'rgba(0, 153, 255, 0.5)' : 'rgba(255, 102, 0, 0.5)'};
          transition: all 0.3s ease;
          z-index: 10;
          display: flex;
          align-items: center;
          justify-content: center;
          animation: bounce 2s ease-in-out infinite;
        }
        
        .scroll-to-bottom:hover {
          background: ${state.lightMode 
            ? 'linear-gradient(135deg, #0077cc 0%, #0055aa 100%)' 
            : 'linear-gradient(135deg, #ff8833 0%, #ffaa55 100%)'};
          box-shadow: 0 0 30px ${state.lightMode ? 'rgba(0, 153, 255, 0.8)' : 'rgba(255, 102, 0, 0.8)'};
          transform: translateY(-2px);
        }
        
        @keyframes bounce {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
      `}</style>
    </div>
  );
}
