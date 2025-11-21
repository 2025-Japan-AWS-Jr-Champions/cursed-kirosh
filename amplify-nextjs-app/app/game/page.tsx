"use client";

import { GameProvider, useGameContext } from "@/lib/game/GameContext";
import {
  Terminal,
  VirtualKeyboard,
  MorseInput,
  EndingScreen,
} from "@/components/game";
import AudioManager from "@/components/audio/AudioManager";

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
  const { state, dispatch } = useGameContext();

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
    // TODO: Navigate to leaderboard page (will be implemented in task 11)
    console.log("View leaderboard clicked");
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
            onRestart={handleRestart}
            onViewLeaderboard={handleViewLeaderboard}
          />
        )}

      <div className="game-container">
        <div className="game-header">
          <h1 className="game-title">CURSED KIROSH</h1>
          <p className="game-subtitle">Escape the Terminal... If You Can</p>
        </div>

        <div className="game-content">
          <div className="terminal-section">
            <Terminal onCommand={handleCommand} />
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

      <style jsx>{`
        .game-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
        }
        
        .game-container {
          max-width: 1400px;
          width: 100%;
        }
        
        .game-header {
          text-align: center;
          margin-bottom: 32px;
        }
        
        .game-title {
          font-size: 48px;
          font-weight: bold;
          color: #ff6600;
          text-shadow: 0 0 20px rgba(255, 102, 0, 0.5);
          letter-spacing: 8px;
          margin-bottom: 8px;
          font-family: 'Courier New', monospace;
        }
        
        .game-subtitle {
          font-size: 18px;
          color: #9933ff;
          font-style: italic;
          text-shadow: 0 0 10px rgba(153, 51, 255, 0.5);
        }
        
        .game-content {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 24px;
          align-items: start;
        }
        
        .terminal-section {
          width: 100%;
        }
        
        .keyboard-section {
          width: 100%;
        }
        
        @media (max-width: 1024px) {
          .game-content {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}
