'use client';

import { useState, useEffect, useRef } from 'react';
import {
  isValidMorseSequence,
  isCompleteMorseSequence,
  decodeMorseSequence,
} from '@/lib/game/morseCode';
import { useAudio } from '@/hooks/useAudio';
import { useGameContext } from '@/lib/game/GameContext';

interface MorseInputProps {
  onMorseComplete: (character: string) => void;
  onMorseInput?: (type: 'dot' | 'dash') => void;
  disabled?: boolean;
  autoCompleteDelay?: number; // milliseconds to wait before auto-completing
}

export default function MorseInput({
  onMorseComplete,
  onMorseInput,
  disabled = false,
  autoCompleteDelay = 1000, // 1 second default
}: MorseInputProps) {
  const [currentSequence, setCurrentSequence] = useState('');
  const [feedback, setFeedback] = useState<string>('');
  const { playHeartbeat, playScream } = useAudio();
  const { dispatch } = useGameContext();
  const autoCompleteTimerRef = useRef<NodeJS.Timeout | null>(null);
  const feedbackTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-complete sequence after delay
  useEffect(() => {
    // Clear existing timer
    if (autoCompleteTimerRef.current) {
      clearTimeout(autoCompleteTimerRef.current);
      autoCompleteTimerRef.current = null;
    }

    // If there's a sequence and it's valid, set timer to auto-complete
    if (currentSequence && isValidMorseSequence(currentSequence)) {
      autoCompleteTimerRef.current = setTimeout(() => {
        // Check if it's a complete sequence
        if (isCompleteMorseSequence(currentSequence)) {
          const character = decodeMorseSequence(currentSequence);
          if (character) {
            setFeedback(`Unlocked: ${character.toUpperCase()}`);
            onMorseComplete(character);
            setCurrentSequence('');
            
            // Clear feedback after showing it
            if (feedbackTimerRef.current) {
              clearTimeout(feedbackTimerRef.current);
            }
            feedbackTimerRef.current = setTimeout(() => {
              setFeedback('');
            }, 1500);
          }
        } else {
          // Sequence is incomplete but valid - just clear it
          setFeedback('Incomplete sequence');
          setCurrentSequence('');
          
          if (feedbackTimerRef.current) {
            clearTimeout(feedbackTimerRef.current);
          }
          feedbackTimerRef.current = setTimeout(() => {
            setFeedback('');
          }, 1000);
        }
      }, autoCompleteDelay);
    }

    // Cleanup timer on unmount or when sequence changes
    return () => {
      if (autoCompleteTimerRef.current) {
        clearTimeout(autoCompleteTimerRef.current);
        autoCompleteTimerRef.current = null;
      }
    };
  }, [currentSequence, autoCompleteDelay, onMorseComplete]);

  // Cleanup feedback timer on unmount
  useEffect(() => {
    return () => {
      if (feedbackTimerRef.current) {
        clearTimeout(feedbackTimerRef.current);
      }
    };
  }, []);

  const handleInput = async (type: 'dot' | 'dash') => {
    if (disabled) return;

    // Update activity time
    dispatch({ type: 'UPDATE_ACTIVITY' });

    const symbol = type === 'dot' ? '.' : '-';
    const newSequence = currentSequence + symbol;

    // Play audio based on input type
    if (type === 'dot') {
      await playHeartbeat();
    } else {
      await playScream();
    }

    // Trigger optional callback
    if (onMorseInput) {
      onMorseInput(type);
    }

    // Validate the sequence
    if (!isValidMorseSequence(newSequence)) {
      setFeedback('Invalid sequence');
      setTimeout(() => {
        setFeedback('');
        setCurrentSequence('');
      }, 1000);
      return;
    }

    setCurrentSequence(newSequence);
    setFeedback('');
  };

  const handleClear = () => {
    // Clear both timers
    if (autoCompleteTimerRef.current) {
      clearTimeout(autoCompleteTimerRef.current);
      autoCompleteTimerRef.current = null;
    }
    if (feedbackTimerRef.current) {
      clearTimeout(feedbackTimerRef.current);
      feedbackTimerRef.current = null;
    }
    setCurrentSequence('');
    setFeedback('');
  };

  return (
    <div className="morse-input-container p-6 bg-gradient-to-b from-purple-950 to-black border-2 border-orange-500 rounded-lg shadow-lg shadow-orange-500/20 relative">
      {/* Highlight pulse animation when active */}
      {currentSequence && (
        <div className="absolute inset-0 border-2 border-orange-400 rounded-lg animate-pulse pointer-events-none" />
      )}
      
      <h3 className="text-xl font-bold text-orange-500 mb-4 text-center flex items-center justify-center gap-2">
        <span className="text-2xl">📡</span>
        Morse Code Input
        <span className="text-2xl">📡</span>
      </h3>
      
      {/* Current Sequence Display */}
      <div className="sequence-display mb-6 min-h-[80px] bg-black/50 border border-purple-700 rounded p-4 text-center relative overflow-hidden">
        <div className="text-sm text-purple-400 mb-2">Current Sequence:</div>
        <div className="text-2xl font-mono text-orange-400 tracking-widest">
          {currentSequence || <span className="text-gray-600 animate-pulse">Waiting for input...</span>}
        </div>
        {feedback && (
          <div className={`text-sm mt-2 font-bold animate-bounce ${
            feedback.startsWith('Unlocked') ? 'text-green-400' : 'text-red-400'
          }`}>
            {feedback}
          </div>
        )}
        
        {/* Progress indicator */}
        {currentSequence && (
          <div className="mt-2 text-xs text-purple-300">
            {currentSequence.length} signal{currentSequence.length !== 1 ? 's' : ''} entered
          </div>
        )}
      </div>

      {/* Example Morse Sequences */}
      <div className="examples mb-4 p-3 bg-purple-900/30 border border-purple-700/50 rounded text-xs">
        <div className="text-purple-300 font-semibold mb-2 text-center">📚 Common Patterns:</div>
        <div className="grid grid-cols-2 gap-2 text-purple-200">
          <div>E = <span className="text-orange-400 font-mono">•</span></div>
          <div>T = <span className="text-orange-400 font-mono">—</span></div>
          <div>A = <span className="text-orange-400 font-mono">• —</span></div>
          <div>N = <span className="text-orange-400 font-mono">— •</span></div>
          <div>S = <span className="text-orange-400 font-mono">• • •</span></div>
          <div>O = <span className="text-orange-400 font-mono">— — —</span></div>
        </div>
      </div>

      {/* Input Buttons */}
      <div className="button-group flex gap-4 mb-4">
        <button
          type="button"
          onClick={() => handleInput('dot')}
          disabled={disabled}
          className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-600/50 hover:shadow-orange-500/70 relative group"
        >
          <div className="text-3xl mb-1">•</div>
          <div className="text-sm">DOT</div>
          <div className="absolute inset-0 bg-orange-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </button>
        
        <button
          type="button"
          onClick={() => handleInput('dash')}
          disabled={disabled}
          className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-600/50 hover:shadow-purple-500/70 relative group"
        >
          <div className="text-3xl mb-1">—</div>
          <div className="text-sm">DASH</div>
          <div className="absolute inset-0 bg-purple-400/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        </button>
      </div>

      {/* Clear Button */}
      <button
        type="button"
        onClick={handleClear}
        disabled={disabled || !currentSequence}
        className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-gray-300 font-semibold py-2 px-4 rounded transition-colors duration-200"
      >
        Clear Sequence
      </button>

      {/* Help Text */}
      <div className="help-text mt-4 text-xs text-gray-400 text-center space-y-1">
        <div className="flex items-center justify-center gap-2">
          <span className="text-orange-400">💡</span>
          <span>Click DOT (•) or DASH (—) to input Morse code</span>
        </div>
        <div>Sequences auto-complete after 1 second</div>
        <div className="text-purple-400">Listen for heartbeat (•) and scream (—) sounds!</div>
      </div>
    </div>
  );
}
