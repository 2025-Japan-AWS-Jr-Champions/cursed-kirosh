/**
 * Morse code dictionary and utilities
 * Maps Morse code sequences to characters (A-Z, 0-9)
 */

export const MORSE_CODE_DICTIONARY: Record<string, string> = {
  // Letters A-Z
  '.-': 'a',
  '-...': 'b',
  '-.-.': 'c',
  '-..': 'd',
  '.': 'e',
  '..-.': 'f',
  '--.': 'g',
  '....': 'h',
  '..': 'i',
  '.---': 'j',
  '-.-': 'k',
  '.-..': 'l',
  '--': 'm',
  '-.': 'n',
  '---': 'o',
  '.--.': 'p',
  '--.-': 'q',
  '.-.': 'r',
  '...': 's',
  '-': 't',
  '..-': 'u',
  '...-': 'v',
  '.--': 'w',
  '-..-': 'x',
  '-.--': 'y',
  '--..': 'z',
  
  // Numbers 0-9
  '-----': '0',
  '.----': '1',
  '..---': '2',
  '...--': '3',
  '....-': '4',
  '.....': '5',
  '-....': '6',
  '--...': '7',
  '---..': '8',
  '----.': '9',
  
  // Punctuation marks
  '.-.-.-': '.',  // Period (full stop)
  '--..--': ',',  // Comma
  '..--..': '?',  // Question mark
  '.----.': "'",  // Apostrophe
  '-.-.--': '!',  // Exclamation mark
  '-..-.': '/',   // Slash
  '-.--.': '(',   // Left parenthesis
  '-.--.-': ')',  // Right parenthesis
  '.-...': '&',   // Ampersand
  '---...': ':',  // Colon
  '-.-.-.': ';',  // Semicolon
  '-...-': '=',   // Equal sign
  '.-.-.': '+',   // Plus sign
  '-....-': '-',  // Hyphen/minus
  '..--.-': '_',  // Underscore
  '.-..-.': '"',  // Quotation mark
  '...-..-': '$', // Dollar sign
  '.--.-.': '@',  // At sign
};

/**
 * Reverse mapping: character to Morse code
 */
export const CHARACTER_TO_MORSE: Record<string, string> = Object.entries(
  MORSE_CODE_DICTIONARY
).reduce((acc, [morse, char]) => {
  acc[char] = morse;
  return acc;
}, {} as Record<string, string>);

/**
 * Validates if a Morse sequence is valid (complete or partial)
 * @param sequence - The Morse code sequence to validate
 * @returns true if the sequence is valid or could be part of a valid sequence
 */
export function isValidMorseSequence(sequence: string): boolean {
  if (!sequence) return true;
  
  // Check if it only contains dots and dashes
  if (!/^[.-]+$/.test(sequence)) return false;
  
  // Check if it matches a complete sequence or is a prefix of one
  return Object.keys(MORSE_CODE_DICTIONARY).some(
    (morse) => morse === sequence || morse.startsWith(sequence)
  );
}

/**
 * Decodes a Morse sequence to a character
 * @param sequence - The Morse code sequence
 * @returns The decoded character or null if invalid
 */
export function decodeMorseSequence(sequence: string): string | null {
  return MORSE_CODE_DICTIONARY[sequence] || null;
}

/**
 * Checks if a Morse sequence is complete (matches a character)
 * @param sequence - The Morse code sequence
 * @returns true if the sequence represents a complete character
 */
export function isCompleteMorseSequence(sequence: string): boolean {
  return sequence in MORSE_CODE_DICTIONARY;
}

/**
 * Encodes text to Morse code
 * @param text - The text to encode
 * @returns Morse code representation with spaces between characters
 */
export function encodeToMorse(text: string): string {
  return text
    .toLowerCase()
    .split('')
    .map((char) => CHARACTER_TO_MORSE[char] || char)
    .join(' ');
}
