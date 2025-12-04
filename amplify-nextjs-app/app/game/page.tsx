"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { GameProvider, useGameContext } from "@/lib/game/GameContext";
import {
  Terminal,
  VirtualKeyboard,
  MorseInput,
  EndingScreen,
  GhostEvent,
} from "@/components/game";
import AudioManager from "@/components/audio/AudioManager";
import { AudioControls } from "@/components/audio/AudioControls";
import { useGhostEvent } from "@/hooks/useGhostEvent";
import { useAudio } from "@/hooks/useAudio";

/**
 * Game Page
 * Main game interface for Cursed Kirosh
 */
export default function GamePage() {
  return (
    <AudioManager enabled={true}>
      <GameProvider>
        <GameContent />
      </GameProvider>
    </AudioManager>
  );
}

function GameContent() {
  const router = useRouter();
  const { state, dispatch } = useGameContext();
  const { playAmbientHeartbeat, stopAmbientHeartbeat, isLoaded, isEnabled } =
    useAudio();

  // Initialize ghost event system
  useGhostEvent({
    minInterval: 60000, // 1 minute
    maxInterval: 180000, // 3 minutes
    warningTime: 3000, // 3 seconds
    enabled: true,
  });

  // Start ambient heartbeat when audio is loaded and enabled
  useEffect(() => {
    if (isLoaded && isEnabled && !state.gameComplete) {
      playAmbientHeartbeat();
    } else {
      stopAmbientHeartbeat();
    }

    // Cleanup on unmount
    return () => {
      stopAmbientHeartbeat();
    };
  }, [
    isLoaded,
    isEnabled,
    state.gameComplete,
    playAmbientHeartbeat,
    stopAmbientHeartbeat,
  ]);

  const handleGhostTreat = () => {
    // Resolve ghost event successfully
    dispatch({ type: "RESOLVE_GHOST_EVENT", success: true });

    // Add success message to output
    dispatch({
      type: "ADD_OUTPUT",
      line: {
        id: `ghost-success-${Date.now()}`,
        text: "🎃 The ghost is satisfied! Your characters are safe.",
        type: "system",
        timestamp: Date.now(),
      },
    });
  };

  const handleGhostTrick = () => {
    // Resolve ghost event with failure (timeout)
    dispatch({ type: "RESOLVE_GHOST_EVENT", success: false });

    // Add failure message to output
    dispatch({
      type: "ADD_OUTPUT",
      line: {
        id: `ghost-fail-${Date.now()}`,
        text: "👻 Too late! The ghost has re-locked your characters!",
        type: "error",
        timestamp: Date.now(),
      },
    });
  };

  const handleCommand = (command: string) => {
    // Start the game timer on first command if not already started
    if (!state.startTime) {
      dispatch({ type: "START_GAME" });
    }

    // Import command parser functions
    const {
      parseCommand,
      executeCommand,
    } = require("@/lib/game/commandParser");

    // Parse and execute the command
    const parsed = parseCommand(command);
    const result = executeCommand(parsed, state);

    // Add output to terminal
    dispatch({
      type: "ADD_OUTPUT",
      line: {
        id: `output-${Date.now()}`,
        text: result.output,
        type: result.type,
        timestamp: Date.now(),
      },
    });

    // Execute any actions returned by the command
    if (result.actions) {
      for (const action of result.actions) {
        dispatch(action);
      }
    }

    console.log("Command executed:", command, result);
  };

  const handleMorseComplete = (character: string) => {
    // Unlock the character when Morse sequence is completed
    dispatch({ type: "UNLOCK_CHARACTER", character: character.toLowerCase() });

    // Also add to Morse history
    dispatch({
      type: "COMPLETE_MORSE",
      character: character.toLowerCase(),
    });
  };

  const handleMorseInput = (type: "dot" | "dash") => {
    // Track Morse input in game state
    dispatch({ type: "ADD_MORSE_INPUT", input: type });
  };

  const handleRestart = () => {
    dispatch({ type: "RESET_GAME" });
  };

  const handleViewLeaderboard = () => {
    router.push("/leaderboard");
  };

  // TEST FUNCTION: Manually trigger ghost event
  const handleTestGhostTrigger = () => {
    // Show warning message first
    dispatch({
      type: "ADD_OUTPUT",
      line: {
        id: `test-warning-${Date.now()}`,
        text: "⚠️ [TEST] Something approaches... ⚠️",
        type: "system",
        timestamp: Date.now(),
      },
    });

    // Trigger ghost event after 3 seconds
    setTimeout(() => {
      dispatch({ type: "TRIGGER_GHOST_EVENT" });
    }, 3000);
  };

  return (
    <div className="game-page">
      {/* Show ending screen if game is complete */}
      {state.gameComplete &&
        state.currentEnding &&
        state.startTime &&
        state.endTime && (
          <EndingScreen
            ending={state.currentEnding}
            completionTime={state.endTime - state.startTime}
            unlockedCharCount={state.unlockedChars.size}
            secretsFound={state.discoveredSecrets.size}
            onRestart={handleRestart}
            onViewLeaderboard={handleViewLeaderboard}
          />
        )}

      {/* Show ghost event when active */}
      <GhostEvent
        isActive={state.ghostEventActive}
        onTreat={handleGhostTreat}
        onTrick={handleGhostTrick}
        timeLimit={10}
      />

      <div className="game-container">
        <div className="game-header">
          <h1 className="game-title">CURSED KIROSH</h1>
          <p className="game-subtitle">Escape the Terminal... If You Can</p>

          {/* TEST BUTTON: Trigger Ghost Event */}
          {process.env.NODE_ENV === "development" && (
            <button
              type="button"
              onClick={handleTestGhostTrigger}
              disabled={state.ghostEventActive}
              className="test-ghost-button"
            >
              👻 TEST: Trigger Ghost Event
            </button>
          )}
        </div>

        <div className="game-content">
          <div className="terminal-section">
            <Terminal
              onCommand={handleCommand}
              disabled={state.ghostEventActive}
            />
          </div>

          <div className="keyboard-section">
            <VirtualKeyboard unlockedChars={state.unlockedChars} />

            {/* Morse Input for unlocking characters */}
            <div style={{ marginTop: "24px" }}>
              <MorseInput
                onMorseComplete={handleMorseComplete}
                onMorseInput={handleMorseInput}
                disabled={state.gameComplete}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Audio Controls */}
      <AudioControls />

      {/* Attribution Footer */}
      <footer className="game-footer">
        <div className="attribution-container">
          <div className="attribution-item">
            <span className="attribution-label">Sound Effects:</span>{" "}
            <a
              href="https://otologic.jp/free/license.html"
              target="_blank"
              rel="noopener noreferrer"
              className="attribution-link"
            >
              OtoLogic
            </a>
          </div>
          <div className="attribution-divider">•</div>
          <div className="attribution-item">
            <span className="attribution-label">Ghost Image:</span>{" "}
            <span className="attribution-value">©DESIGNALIKIE</span>
          </div>
        </div>
      </footer>

      <style jsx>{`
        /* Main Game Page Layout */
        .game-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 20px;
          font-family: 'Courier New', monospace;
        }
        
        .game-container {
          max-width: 1400px;
          width: 100%;
          min-width: 1024px; /* Desktop-optimized minimum width */
        }
        
        /* Header Section */
        .game-header {
          text-align: center;
          margin-bottom: 32px;
          position: relative;
        }
        
        .test-ghost-button {
          position: absolute;
          top: 0;
          right: 0;
          padding: 10px 20px;
          background: linear-gradient(135deg, #ff6600 0%, #ff8833 100%);
          color: white;
          border: 2px solid #9933ff;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          font-size: 14px;
          cursor: pointer;
          transition: all 0.3s ease;
          box-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
        }
        
        .test-ghost-button:hover:not(:disabled) {
          background: linear-gradient(135deg, #ff8833 0%, #ffaa55 100%);
          box-shadow: 0 0 20px rgba(255, 102, 0, 0.8);
          transform: translateY(-2px);
        }
        
        .test-ghost-button:disabled {
          opacity: 0.5;
          cursor: not-allowed;
          background: #666;
        }
        
        .game-title {
          font-size: 48px;
          font-weight: bold;
          color: #ff6600; /* Halloween orange */
          text-shadow: 0 0 20px rgba(255, 102, 0, 0.5);
          letter-spacing: 8px;
          margin-bottom: 8px;
          font-family: 'Courier New', monospace;
          animation: titleGlow 3s ease-in-out infinite;
        }
        
        @keyframes titleGlow {
          0%, 100% {
            text-shadow: 0 0 20px rgba(255, 102, 0, 0.5);
          }
          50% {
            text-shadow: 0 0 30px rgba(255, 102, 0, 0.8),
                         0 0 40px rgba(255, 102, 0, 0.4);
          }
        }
        
        .game-subtitle {
          font-size: 18px;
          color: #9933ff; /* Purple */
          font-style: italic;
          text-shadow: 0 0 10px rgba(153, 51, 255, 0.5);
        }
        
        /* Side-by-Side Layout: Terminal and Keyboard */
        .game-content {
          display: grid;
          grid-template-columns: 1fr 400px; /* Terminal takes remaining space, keyboard fixed width */
          gap: 24px;
          align-items: start;
          margin-bottom: 24px;
        }
        
        .terminal-section {
          width: 100%;
          min-height: 500px;
        }
        
        .keyboard-section {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }
        
        /* Responsive: Stack on smaller screens (below 1024px) */
        @media (max-width: 1024px) {
          .game-container {
            min-width: auto;
          }
          
          .game-content {
            grid-template-columns: 1fr;
          }
          
          .keyboard-section {
            max-width: 600px;
            margin: 0 auto;
          }
        }
        
        /* Footer with Attributions */
        .game-footer {
          margin-top: 32px;
          padding: 20px;
          text-align: center;
          border-top: 2px solid rgba(153, 51, 255, 0.3);
          background: rgba(26, 10, 26, 0.3);
        }
        
        .attribution-container {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 16px;
          flex-wrap: wrap;
        }
        
        .attribution-item {
          font-size: 14px;
          color: #9933ff; /* Purple */
          font-family: 'Courier New', monospace;
        }
        
        .attribution-label {
          color: #ff8833; /* Light orange */
          font-weight: bold;
        }
        
        .attribution-value {
          color: #ff6600; /* Halloween orange */
        }
        
        .attribution-divider {
          color: #9933ff;
          font-size: 18px;
        }
        
        .attribution-link {
          color: #ff6600; /* Halloween orange */
          text-decoration: none;
          transition: all 0.3s ease;
          border-bottom: 1px solid transparent;
        }
        
        .attribution-link:hover {
          color: #ff8833; /* Light orange */
          border-bottom-color: #ff8833;
          text-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
        }
      `}</style>
    </div>
  );
}
