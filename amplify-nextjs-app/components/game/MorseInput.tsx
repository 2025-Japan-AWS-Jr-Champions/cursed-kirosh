'use client';

import { useState, useEffect, useRef } from 'react';
import {
  isValidMorseSequence,
  isCompleteMorseSequence,
  decodeMorseSequence,
} from '@/lib/game/morseCode';
import { useAudio } from '@/hooks/useAudio';

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
    <div className="morse-input-container p-6 bg-gradient-to-b from-purple-950 to-black border-2 border-orange-500 rounded-lg shadow-lg shadow-orange-500/20">
      <h3 className="text-xl font-bold text-orange-500 mb-4 text-center">
        Morse Code Input
      </h3>
      
      {/* Current Sequence Display */}
      <div className="sequence-display mb-6 min-h-[60px] bg-black/50 border border-purple-700 rounded p-4 text-center">
        <div className="text-sm text-purple-400 mb-2">Current Sequence:</div>
        <div className="text-2xl font-mono text-orange-400 tracking-widest">
          {currentSequence || <span className="text-gray-600">...</span>}
        </div>
        {feedback && (
          <div className={`text-sm mt-2 ${
            feedback.startsWith('Unlocked') ? 'text-green-400' : 'text-red-400'
          }`}>
            {feedback}
          </div>
        )}
      </div>

      {/* Input Buttons */}
      <div className="button-group flex gap-4 mb-4">
        <button
          type="button"
          onClick={() => handleInput('dot')}
          disabled={disabled}
          className="flex-1 bg-orange-600 hover:bg-orange-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-orange-600/50 hover:shadow-orange-500/70"
        >
          <div className="text-3xl mb-1">•</div>
          <div className="text-sm">DOT</div>
        </button>
        
        <button
          type="button"
          onClick={() => handleInput('dash')}
          disabled={disabled}
          className="flex-1 bg-purple-600 hover:bg-purple-500 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-lg shadow-purple-600/50 hover:shadow-purple-500/70"
        >
          <div className="text-3xl mb-1">—</div>
          <div className="text-sm">DASH</div>
        </button>
      </div>

      {/* Clear Button */}
      <button
        type="button"
        onClick={handleClear}
        disabled={disabled || !currentSequence}
        className="w-full bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-gray-300 font-semibold py-2 px-4 rounded transition-colors duration-200"
      >
        Clear
      </button>

      {/* Help Text */}
      <div className="help-text mt-4 text-xs text-gray-500 text-center">
        Click DOT (•) or DASH (—) to input Morse code. Sequence auto-completes after 1 second.
      </div>
    </div>
  );
}
