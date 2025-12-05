"use client";

import { useState, useEffect } from "react";

interface CursedTextProps {
  text: string;
  delay?: number; // Delay in ms before curse effect starts
  enabled?: boolean;
}

/**
 * CursedText Component
 * Applies jitter animation to text after a delay to create the "curse" effect
 */
export function CursedText({
  text,
  delay = 2000,
  enabled = true,
}: CursedTextProps) {
  const [isCursed, setIsCursed] = useState(false);

  useEffect(() => {
    if (!enabled) {
      setIsCursed(false);
      return;
    }

    // Start curse effect after delay
    const timer = setTimeout(() => {
      setIsCursed(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay, enabled]);

  if (!enabled || !isCursed) {
    return <span>{text}</span>;
  }

  // Split text into individual characters for animation
  return (
    <span className="cursed-text-container">
      {text.split("").map((char, index) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: Text characters are static and won't be reordered
          key={`${text}-${index}`}
          className="cursed-char"
          style={{
            animationDelay: `${index * 0.05}s`,
          }}
        >
          {char}
        </span>
      ))}

      <style jsx>{`
        .cursed-text-container {
          display: inline-block;
        }
        
        .cursed-char {
          display: inline-block;
          animation: jitter 0.3s ease-in-out infinite;
        }
        
        @keyframes jitter {
          0%, 100% {
            transform: translate(0, 0) rotate(0deg);
          }
          10% {
            transform: translate(-1px, -1px) rotate(-0.5deg);
          }
          20% {
            transform: translate(1px, 1px) rotate(0.5deg);
          }
          30% {
            transform: translate(-1px, 1px) rotate(-0.3deg);
          }
          40% {
            transform: translate(1px, -1px) rotate(0.3deg);
          }
          50% {
            transform: translate(-0.5px, 0.5px) rotate(-0.2deg);
          }
          60% {
            transform: translate(0.5px, -0.5px) rotate(0.2deg);
          }
          70% {
            transform: translate(-0.5px, -0.5px) rotate(-0.4deg);
          }
          80% {
            transform: translate(0.5px, 0.5px) rotate(0.4deg);
          }
          90% {
            transform: translate(-0.3px, 0.3px) rotate(-0.1deg);
          }
        }
      `}</style>
    </span>
  );
}

/**
 * Hook to manage cursed text state
 * Returns whether text should be cursed based on time elapsed
 */
export function useCursedText(delay = 2000) {
  const [startTime] = useState(Date.now());
  const [isCursed, setIsCursed] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsCursed(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return {
    isCursed,
    elapsedTime: Date.now() - startTime,
  };
}
