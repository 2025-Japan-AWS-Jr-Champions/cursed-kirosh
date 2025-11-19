'use client';

import React, { useEffect, useRef } from 'react';
import type { OutputLine } from '@/lib/game/types';

interface OutputDisplayProps {
  lines: OutputLine[];
  maxLines?: number;
}

/**
 * OutputDisplay Component
 * Renders terminal output history with color coding and auto-scroll
 */
export function OutputDisplay({ lines, maxLines = 1000 }: OutputDisplayProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldAutoScroll = useRef(true);

  // Auto-scroll to bottom when new lines are added
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

  const getLineClassName = (type: OutputLine['type']): string => {
    switch (type) {
      case 'command':
        return 'output-line-command';
      case 'output':
        return 'output-line-output';
      case 'error':
        return 'output-line-error';
      case 'system':
        return 'output-line-system';
      default:
        return 'output-line-output';
    }
  };

  const formatLine = (line: OutputLine): React.ReactNode => {
    if (line.type === 'command') {
      return (
        <>
          <span className="command-prompt">cursed@kirosh:~$</span>{' '}
          <span className="command-text">{line.text}</span>
        </>
      );
    }
    return line.text;
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
          color: #ff8833;
          font-weight: normal;
        }
        
        .command-prompt {
          color: #ff8833;
          font-weight: bold;
        }
        
        .command-text {
          color: #ff6600;
        }
        
        .output-line-output {
          color: #ff6600;
        }
        
        .output-line-error {
          color: #cc0000;
          font-weight: bold;
          text-shadow: 0 0 5px rgba(204, 0, 0, 0.5);
        }
        
        .output-line-system {
          color: #8b00ff;
          font-style: italic;
        }
        
        /* Scrollbar styling */
        .output-display-container::-webkit-scrollbar {
          width: 8px;
        }
        
        .output-display-container::-webkit-scrollbar-track {
          background: transparent;
        }
        
        .output-display-container::-webkit-scrollbar-thumb {
          background: #9933ff;
          border-radius: 4px;
        }
        
        .output-display-container::-webkit-scrollbar-thumb:hover {
          background: #ff6600;
        }
      `}</style>
    </div>
  );
}
