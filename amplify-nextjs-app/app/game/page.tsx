'use client';

import { GameProvider } from '@/lib/game/GameContext';
import { Terminal } from '@/components/game/Terminal';

/**
 * Game Page
 * Main game interface for Cursed Kirosh
 */
export default function GamePage() {
  const handleCommand = (command: string) => {
    console.log('Command executed:', command);
    // Command handling will be implemented in later tasks
  };

  return (
    <GameProvider>
      <div className="game-page">
        <div className="game-container">
          <div className="game-header">
            <h1 className="game-title">CURSED KIROSH</h1>
            <p className="game-subtitle">Escape the Terminal... If You Can</p>
          </div>
          
          <div className="game-content">
            <Terminal onCommand={handleCommand} />
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
            max-width: 1200px;
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
            display: flex;
            justify-content: center;
          }
        `}</style>
      </div>
    </GameProvider>
  );
}
