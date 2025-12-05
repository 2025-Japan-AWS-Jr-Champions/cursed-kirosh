"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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
  const [showEndingModal, setShowEndingModal] = useState(false);
  const [endingCountdown, setEndingCountdown] = useState(10);
  const [elapsedTime, setElapsedTime] = useState(0);

  // Initialize ghost event system
  useGhostEvent({
    minInterval: 60000, // 1 minute
    maxInterval: 180000, // 3 minutes
    warningTime: 3000, // 3 seconds
    enabled: true,
  });

  // Delay showing ending modal to allow reading terminal output with countdown
  useEffect(() => {
    if (state.gameComplete && !showEndingModal) {
      setEndingCountdown(10);

      const countdownInterval = setInterval(() => {
        setEndingCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(countdownInterval);
            setShowEndingModal(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(countdownInterval);
    }
  }, [state.gameComplete, showEndingModal]);

  // Update elapsed time every 10 seconds in dev mode
  useEffect(() => {
    if (
      process.env.NODE_ENV === "development" &&
      state.startTime &&
      !state.gameComplete
    ) {
      const startTime = state.startTime; // Capture in closure
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setElapsedTime(Math.floor(elapsed / 1000));
      }, 10000); // Update every 10 seconds

      return () => clearInterval(interval);
    }
  }, [state.startTime, state.gameComplete]);

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

  const handleGhostTrick = (isTypo?: boolean) => {
    // Resolve ghost event with failure (timeout or typo)
    dispatch({ type: "RESOLVE_GHOST_EVENT", success: false });

    // Add failure message to output
    const message = isTypo
      ? "👻 Wrong spelling! The ghost is furious and has re-locked your characters!"
      : "👻 Too late! The ghost has re-locked your characters!";

    dispatch({
      type: "ADD_OUTPUT",
      line: {
        id: `ghost-fail-${Date.now()}`,
        text: message,
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
    // Start the game timer on first morse input if not already started
    if (!state.startTime) {
      dispatch({ type: "START_GAME" });
    }

    // Track Morse input in game state
    dispatch({ type: "ADD_MORSE_INPUT", input: type });
  };

  const handleRestart = () => {
    dispatch({ type: "RESET_GAME" });
    setShowEndingModal(false);
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
      {/* Show ending screen if game is complete (with delay) */}
      {showEndingModal &&
        state.gameComplete &&
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

          {/* DEV MODE: Elapsed Time Display */}
          {process.env.NODE_ENV === "development" && state.startTime && (
            <div className="elapsed-time-display">
              ⏱️ {Math.floor(elapsedTime / 60)}:
              {(elapsedTime % 60).toString().padStart(2, "0")}
            </div>
          )}

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

        {/* Ending countdown overlay - fixed position */}
        {state.gameComplete && !showEndingModal && (
          <div className="ending-countdown">
            <p className="countdown-text">Ending in {endingCountdown}s</p>
          </div>
        )}

        <div className="game-content">
          <div className="top-row">
            <div className="terminal-section">
              <Terminal
                onCommand={handleCommand}
                disabled={state.ghostEventActive}
              />
            </div>

            <div className="morse-section">
              <MorseInput
                onMorseComplete={handleMorseComplete}
                onMorseInput={handleMorseInput}
                disabled={state.gameComplete}
              />
            </div>
          </div>

          <div className="keyboard-section">
            <VirtualKeyboard unlockedChars={state.unlockedChars} />
          </div>
        </div>
      </div>

      {/* Audio Controls */}
      <AudioControls />

      {/* Attribution Footer */}
      <footer className="game-footer">
        <div className="attribution-container">
          <div className="attribution-item">
            <span className="attribution-label">Game Design:</span>{" "}
            <a
              href="https://x.com/amixedcolor"
              target="_blank"
              rel="noopener noreferrer"
              className="attribution-link"
            >
              @amixedcolor
            </a>
            {" & "}
            <a
              href="https://x.com/ryudai_dayo"
              target="_blank"
              rel="noopener noreferrer"
              className="attribution-link"
            >
              @ryudai
            </a>
          </div>
          <div className="attribution-divider">•</div>
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
        
        .elapsed-time-display {
          position: absolute;
          top: 0;
          left: 0;
          padding: 10px 20px;
          background: rgba(204, 0, 0, 0.9);
          color: white;
          border: 2px solid #ff0000;
          border-radius: 8px;
          font-family: 'Courier New', monospace;
          font-weight: bold;
          font-size: 16px;
          box-shadow: 0 0 20px rgba(204, 0, 0, 0.8);
          animation: blood-pulse 2s ease-in-out infinite;
        }
        
        @keyframes blood-pulse {
          0%, 100% {
            box-shadow: 0 0 20px rgba(204, 0, 0, 0.8);
          }
          50% {
            box-shadow: 0 0 40px rgba(204, 0, 0, 1);
          }
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
        
        /* Layout: Terminal and Morse side by side, Keyboard full width below */
        .game-content {
          display: flex;
          flex-direction: column;
          gap: 24px;
          margin-bottom: 24px;
        }
        
        .top-row {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 24px;
          align-items: start;
        }
        
        .terminal-section {
          width: 100%;
          min-height: 500px;
          position: relative;
        }
        
        .ending-countdown {
          position: fixed;
          top: 20px;
          right: 20px;
          background: rgba(255, 102, 0, 0.95);
          border: 2px solid #9933ff;
          border-radius: 8px;
          padding: 10px 20px;
          box-shadow: 0 0 30px rgba(255, 102, 0, 0.8);
          z-index: 100;
          animation: pulse-glow 1s ease-in-out infinite;
        }
        
        .countdown-text {
          color: #0a0a0a;
          font-weight: bold;
          font-size: 14px;
          margin: 0;
          text-align: center;
          font-family: 'Courier New', monospace;
        }
        
        @keyframes pulse-glow {
          0%, 100% {
            box-shadow: 0 0 30px rgba(255, 102, 0, 0.8);
          }
          50% {
            box-shadow: 0 0 50px rgba(255, 102, 0, 1);
          }
        }
        
        .morse-section {
          width: 100%;
        }
        
        .keyboard-section {
          width: 100%;
        }
        
        /* Responsive: Stack on smaller screens (below 1024px) */
        @media (max-width: 1024px) {
          .game-container {
            min-width: auto;
          }
          
          .top-row {
            grid-template-columns: 1fr;
          }
          
          .morse-section {
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
