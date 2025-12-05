"use client";

import React, { useEffect, useRef } from "react";
import type { OutputLine } from "@/lib/game/types";
import { CursedText } from "./CursedText";
import { useGameContext } from "@/lib/game/GameContext";

interface OutputDisplayProps {
  lines: OutputLine[];
  maxLines?: number;
  currentEnding?: string | null;
}

/**
 * OutputDisplay Component
 * Renders terminal output history with color coding and auto-scroll
 */
export function OutputDisplay({
  lines,
  maxLines = 1000,
  currentEnding = null,
}: OutputDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);

  // Import game context for light mode
  const { state } = useGameContext();

  // Auto-scroll to bottom when new lines are added
  // biome-ignore lint/correctness/useExhaustiveDependencies: lines is a prop and needs to trigger scroll
  useEffect(() => {
    if (shouldAutoScroll.current && containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [lines]);

  // Check if user has scrolled up
  const handleScroll = () => {
    if (containerRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = containerRef.current;
      const isAtBottom = Math.abs(scrollHeight - clientHeight - scrollTop) < 10;
      shouldAutoScroll.current = isAtBottom;
    }
  };

  // Limit displayed lines to maxLines
  const displayedLines = lines.slice(-maxLines);

  const getLineClassName = (type: OutputLine["type"]): string => {
    switch (type) {
      case "command":
        return "output-line-command";
      case "output":
        return "output-line-output";
      case "error":
        return "output-line-error";
      case "system":
        return "output-line-system";
      default:
        return "output-line-output";
    }
  };

  const formatLine = (line: OutputLine): React.ReactNode => {
    // Disable cursedText for ending messages (except SSO ending)
    const isEndingMessage = currentEnding !== null;
    const isSSOEnding = currentEnding === "sso";
    const shouldUseCursedText = !isEndingMessage || isSSOEnding;

    if (line.type === "command") {
      return (
        <>
          <span className="command-prompt">
            <CursedText
              text="cursed@kirosh:~$"
              delay={5000}
              enabled={shouldUseCursedText}
            />
          </span>{" "}
          <span className="command-text">
            <CursedText
              text={line.text}
              delay={5000}
              enabled={shouldUseCursedText}
            />
          </span>
        </>
      );
    }

    // Split multi-line text and render each line separately with CursedText
    const lines = line.text.split("\n");
    if (lines.length > 1) {
      return (
        <>
          {lines.map((textLine, index) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: Text lines are static and won't be reordered
            <React.Fragment key={index}>
              <CursedText
                text={textLine}
                delay={5000}
                enabled={shouldUseCursedText}
              />
              {index < lines.length - 1 && <br />}
            </React.Fragment>
          ))}
        </>
      );
    }

    return (
      <CursedText text={line.text} delay={5000} enabled={shouldUseCursedText} />
    );
  };

  return (
    <div
      ref={containerRef}
      className="output-display-container"
      onScroll={handleScroll}
    >
      {displayedLines.map((line) => (
        <div
          key={line.id}
          className={`output-line ${getLineClassName(line.type)}`}
        >
          {formatLine(line)}
        </div>
      ))}

      <style jsx>{`
        .output-display-container {
          flex: 1;
          overflow-y: auto;
          padding-bottom: 16px;
        }
        
        .output-line {
          margin-bottom: 4px;
          line-height: 1.5;
          word-wrap: break-word;
          white-space: pre-wrap;
        }
        
        .output-line-command {
          color: ${state.lightMode ? "#0077cc" : "#ff8833"};
          font-weight: normal;
        }
        
        .command-prompt {
          color: ${state.lightMode ? "#0077cc" : "#ff8833"};
          font-weight: bold;
        }
        
        .command-text {
          color: ${state.lightMode ? "#0099ff" : "#ff6600"};
        }
        
        .output-line-output {
          color: ${state.lightMode ? "#0099ff" : "#ff6600"};
        }
        
        .output-line-error {
          color: ${state.lightMode ? "#ff3300" : "#cc0000"};
          font-weight: bold;
          text-shadow: 0 0 5px ${state.lightMode ? "rgba(255, 51, 0, 0.5)" : "rgba(204, 0, 0, 0.5)"};
        }
        
        .output-line-system {
          color: ${state.lightMode ? "#4499ff" : "#bb66ff"};
          font-style: italic;
          font-weight: 500;
        }
        
        /* Scrollbar styling */
        .output-display-container::-webkit-scrollbar {
          width: 8px;
        }
        
        .output-display-container::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .output-display-container::-webkit-scrollbar-thumb {
          background: ${state.lightMode ? "#66cc00" : "#9933ff"};
          border-radius: 4px;
        }
        
        .output-display-container::-webkit-scrollbar-thumb:hover {
          background: ${state.lightMode ? "#0099ff" : "#ff6600"};
        }
      `}</style>
    </div>
  );
}
