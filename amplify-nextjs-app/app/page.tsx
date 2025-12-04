"use client";

import { useRouter } from "next/navigation";

/**
 * Landing Page
 * Welcome screen with game introduction, instructions, and attribution credits
 */
export default function Home() {
  const router = useRouter();

  const handleStartGame = () => {
    router.push("/game");
  };

  return (
    <div className="landing-page">
      <div className="landing-container">
        {/* Main Title */}
        <div className="title-section">
          <h1 className="main-title">CURSED KIROSH</h1>
          <p className="subtitle">A Halloween Terminal Mystery</p>
        </div>

        {/* Introduction */}
        <div className="intro-section">
          <p className="intro-text">
            You wake up trapped in a cursed terminal. Most of your keyboard is
            locked. Only the letters <span className="highlight">S</span> and{" "}
            <span className="highlight">O</span> remain...
          </p>
          <p className="intro-text">
            Strange sounds echo through the darkness—heartbeats and screams.
            They're not just sounds. They're{" "}
            <span className="highlight">Morse code</span>.
          </p>
          <p className="intro-text">
            Decode the signals. Unlock the characters. Escape the curse.
          </p>
          <p className="intro-text warning">
            But beware... the ghost is watching. 👻
          </p>
        </div>

        {/* Start Game Button */}
        <button
          type="button"
          onClick={handleStartGame}
          className="start-button"
        >
          <span className="button-text">START GAME</span>
          <span className="button-glow" />
        </button>

        {/* Instructions */}
        <div className="instructions-section">
          <h2 className="section-title">How to Play</h2>
          <div className="instructions-grid">
            <div className="instruction-card">
              <div className="instruction-icon">🎵</div>
              <h3 className="instruction-title">Decode Morse Code</h3>
              <p className="instruction-text">
                Click the dot (•) and dash (—) buttons to input Morse code.
                Heartbeat = dot, Scream = dash. Unlock characters to type
                commands.
              </p>
            </div>

            <div className="instruction-card">
              <div className="instruction-icon">⌨️</div>
              <h3 className="instruction-title">Type Commands</h3>
              <p className="instruction-text">
                Use the terminal to explore. Try commands like <code>ls</code>,{" "}
                <code>cd</code>, <code>echo</code>, and <code>help</code>.
                Discover secrets and find your way out.
              </p>
            </div>

            <div className="instruction-card">
              <div className="instruction-icon">👻</div>
              <h3 className="instruction-title">Face the Ghost</h3>
              <p className="instruction-text">
                A ghost will appear asking "trick or treat?" Type{" "}
                <code>treat</code> quickly or lose your unlocked characters!
              </p>
            </div>

            <div className="instruction-card">
              <div className="instruction-icon">🎃</div>
              <h3 className="instruction-title">Find the Endings</h3>
              <p className="instruction-text">
                Multiple endings await. Will you escape normally? Dominate the
                system? Or discover the true ending? Your choices matter.
              </p>
            </div>
          </div>
        </div>

        {/* Attribution Credits */}
        <div className="credits-section">
          <h2 className="section-title">Credits</h2>
          <div className="credits-content">
            <p className="credit-item">
              <span className="credit-label">Sound Effects:</span>{" "}
              <a
                href="https://otologic.jp/free/license.html"
                target="_blank"
                rel="noopener noreferrer"
                className="credit-link"
              >
                OtoLogic
              </a>
            </p>
            <p className="credit-item">
              <span className="credit-label">Ghost Image:</span>{" "}
              <span className="credit-value">©DESIGNALIKIE</span>
            </p>
            <p className="credit-item">
              <span className="credit-label">Game Design:</span>{" "}
              <span className="credit-value">Cursed Kirosh Team</span>
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <div className="footer-note">
          <p>🎃 Best experienced on desktop (1024px+) with audio enabled 🎃</p>
        </div>
      </div>

      <style jsx>{`
        .landing-page {
          min-height: 100vh;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a0a1a 50%, #0a0a0a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 40px 20px;
          font-family: 'Courier New', monospace;
        }

        .landing-container {
          max-width: 900px;
          width: 100%;
        }

        /* Title Section */
        .title-section {
          text-align: center;
          margin-bottom: 48px;
        }

        .main-title {
          font-size: 64px;
          font-weight: bold;
          color: #ff6600;
          text-shadow: 0 0 30px rgba(255, 102, 0, 0.8),
                       0 0 60px rgba(255, 102, 0, 0.4);
          letter-spacing: 12px;
          margin-bottom: 16px;
          animation: pulse 3s ease-in-out infinite;
        }

        @keyframes pulse {
          0%, 100% {
            text-shadow: 0 0 30px rgba(255, 102, 0, 0.8),
                         0 0 60px rgba(255, 102, 0, 0.4);
          }
          50% {
            text-shadow: 0 0 40px rgba(255, 102, 0, 1),
                         0 0 80px rgba(255, 102, 0, 0.6);
          }
        }

        .subtitle {
          font-size: 20px;
          color: #9933ff;
          font-style: italic;
          text-shadow: 0 0 15px rgba(153, 51, 255, 0.6);
        }

        /* Introduction Section */
        .intro-section {
          background: rgba(26, 10, 26, 0.6);
          border: 2px solid #9933ff;
          border-radius: 12px;
          padding: 32px;
          margin-bottom: 40px;
          box-shadow: 0 0 20px rgba(153, 51, 255, 0.3);
        }

        .intro-text {
          font-size: 18px;
          line-height: 1.8;
          color: #ff8833;
          margin-bottom: 16px;
        }

        .intro-text:last-child {
          margin-bottom: 0;
        }

        .intro-text.warning {
          color: #ff6600;
          font-weight: bold;
          text-align: center;
          font-size: 20px;
          margin-top: 24px;
          animation: flicker 2s ease-in-out infinite;
        }

        @keyframes flicker {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.7; }
        }

        .highlight {
          color: #ff6600;
          font-weight: bold;
          text-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
        }

        /* Start Button */
        .start-button {
          position: relative;
          display: block;
          margin: 0 auto 48px;
          padding: 20px 60px;
          font-size: 24px;
          font-weight: bold;
          color: #0a0a0a;
          background: linear-gradient(135deg, #ff6600 0%, #ff8833 100%);
          border: 3px solid #9933ff;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          overflow: hidden;
          box-shadow: 0 0 20px rgba(255, 102, 0, 0.5),
                      0 0 40px rgba(153, 51, 255, 0.3);
        }

        .start-button:hover {
          transform: translateY(-4px);
          box-shadow: 0 0 30px rgba(255, 102, 0, 0.8),
                      0 0 60px rgba(153, 51, 255, 0.5);
        }

        .start-button:active {
          transform: translateY(-2px);
        }

        .button-text {
          position: relative;
          z-index: 2;
          letter-spacing: 4px;
        }

        .button-glow {
          position: absolute;
          top: 0;
          left: -100%;
          width: 100%;
          height: 100%;
          background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.3), transparent);
          transition: left 0.5s ease;
        }

        .start-button:hover .button-glow {
          left: 100%;
        }

        /* Instructions Section */
        .instructions-section {
          margin-bottom: 48px;
        }

        .section-title {
          font-size: 32px;
          color: #ff6600;
          text-align: center;
          margin-bottom: 32px;
          text-shadow: 0 0 15px rgba(255, 102, 0, 0.5);
        }

        .instructions-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 24px;
        }

        @media (max-width: 768px) {
          .instructions-grid {
            grid-template-columns: 1fr;
          }
        }

        .instruction-card {
          background: rgba(26, 10, 26, 0.4);
          border: 2px solid rgba(153, 51, 255, 0.3);
          border-radius: 8px;
          padding: 24px;
          transition: all 0.3s ease;
        }

        .instruction-card:hover {
          border-color: #9933ff;
          box-shadow: 0 0 20px rgba(153, 51, 255, 0.4);
          transform: translateY(-4px);
        }

        .instruction-icon {
          font-size: 48px;
          text-align: center;
          margin-bottom: 16px;
        }

        .instruction-title {
          font-size: 18px;
          color: #ff8833;
          text-align: center;
          margin-bottom: 12px;
          font-weight: bold;
        }

        .instruction-text {
          font-size: 14px;
          line-height: 1.6;
          color: #9933ff;
          text-align: center;
        }

        .instruction-text code {
          background: rgba(255, 102, 0, 0.2);
          padding: 2px 6px;
          border-radius: 4px;
          color: #ff6600;
          font-weight: bold;
        }

        /* Credits Section */
        .credits-section {
          background: rgba(26, 10, 26, 0.4);
          border: 2px solid rgba(153, 51, 255, 0.3);
          border-radius: 8px;
          padding: 32px;
          margin-bottom: 24px;
        }

        .credits-content {
          display: flex;
          flex-direction: column;
          gap: 12px;
        }

        .credit-item {
          font-size: 16px;
          color: #9933ff;
          text-align: center;
        }

        .credit-label {
          color: #ff8833;
          font-weight: bold;
        }

        .credit-link {
          color: #ff6600;
          text-decoration: none;
          border-bottom: 1px solid transparent;
          transition: all 0.3s ease;
        }

        .credit-link:hover {
          color: #ff8833;
          border-bottom-color: #ff8833;
          text-shadow: 0 0 10px rgba(255, 102, 0, 0.5);
        }

        .credit-value {
          color: #ff6600;
        }

        /* Footer Note */
        .footer-note {
          text-align: center;
          font-size: 14px;
          color: #9933ff;
          font-style: italic;
        }
      `}</style>
    </div>
  );
}
