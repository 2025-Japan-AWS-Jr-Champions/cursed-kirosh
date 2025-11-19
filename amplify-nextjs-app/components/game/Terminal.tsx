'use client';

import React from 'react';
import { useGameContext } from '@/lib/game/GameContext';
import { OutputDisplay } from './OutputDisplay';
import { CommandPrompt } from './CommandPrompt';

interface TerminalProps {
  onCommand?: (command: string) => void;
}

/**
 * Terminal Component
 * Main terminal interface with Halloween styling, cursor animation, and prompt display
 */
export function Terminal({ onCommand }: TerminalProps) {
  const { state, dispatch } = useGameContext();

  const handleCommandSubmit = (command: string) => {
    // Add command to history
    dispatch({
      type: 'SUBMIT_COMMAND',
      command,
    });
    
    // Add command to output
    dispatch({
      type: 'ADD_OUTPUT',
      line: {
        id: `cmd-${Date.now()}`,
        text: command,
        type: 'command',
        timestamp: Date.now(),
      },
    });

    // Call parent handler if provided
    if (onCommand) {
      onCommand(command);
    }
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
      
      <div className="terminal-body">
        {/* Welcome message */}
        {state.outputLines.length === 0 && (
          <div className="terminal-welcome">
            <p className="text-system">{'>'} SYSTEM CURSED...</p>
            <p className="text-system">{'>'} MOST KEYS LOCKED...</p>
            <p className="text-system">{'>'} USE MORSE CODE TO UNLOCK...</p>
            <p className="text-system">{'>'} ONLY 's' AND 'o' AVAILABLE...</p>
            <p className="mt-4 text-primary">Type 'help' for assistance</p>
          </div>
        )}
        
        {/* Output display */}
        <OutputDisplay lines={state.outputLines} />
        
        {/* Command prompt */}
        <CommandPrompt
          unlockedChars={state.unlockedChars}
          onSubmit={handleCommandSubmit}
          disabled={state.gameComplete}
          commandHistory={state.commandHistory}
        />
      </div>
      
      <style jsx>{`
        .terminal-container {
          background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 100%);
          border: 2px solid #9933ff;
          border-radius: 8px;
          box-shadow: 0 0 20px rgba(153, 51, 255, 0.3);
          height: 600px;
          display: flex;
          flex-direction: column;
          font-family: 'Courier New', monospace;
          overflow: hidden;
        }
        
        .terminal-header {
          background: #1a0a1a;
          border-bottom: 1px solid #9933ff;
          padding: 8px 16px;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .terminal-title {
          color: #ff6600;
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
          color: #ff6600;
          font-size: 16px;
          line-height: 1.5;
        }
        
        .terminal-welcome {
          margin-bottom: 24px;
        }
        
        .text-system {
          color: #8b00ff;
          margin-bottom: 4px;
        }
        
        .text-primary {
          color: #ff6600;
        }
        
        .terminal-prompt {
          display: flex;
          gap: 4px;
          align-items: center;
          margin-top: 8px;
        }
        
        .prompt-text {
          color: #ff8833;
          font-weight: bold;
        }
        
        .prompt-separator {
          color: #ff6600;
        }
        
        .prompt-path {
          color: #9933ff;
          font-weight: bold;
        }
        
        .prompt-symbol {
          color: #ff6600;
          margin-right: 8px;
        }
        
        .cursor-blink {
          color: #ff6600;
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
          background: #0a0a0a;
        }
        
        .terminal-body::-webkit-scrollbar-thumb {
          background: #9933ff;
          border-radius: 4px;
        }
        
        .terminal-body::-webkit-scrollbar-thumb:hover {
          background: #ff6600;
        }
      `}</style>
    </div>
  );
}
