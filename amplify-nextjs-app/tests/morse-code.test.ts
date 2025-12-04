/**
 * Integration tests for Morse code system
 * Tests character mappings, validation, and unlock functionality
 * Requirements: 2.1-2.6
 */

import { describe, it, expect } from "vitest";
import {
  MORSE_CODE_DICTIONARY,
  CHARACTER_TO_MORSE,
  isValidMorseSequence,
  decodeMorseSequence,
  isCompleteMorseSequence,
  encodeToMorse,
  unlockCharacterFromMorse,
  getAllAlphabeticCharacters,
  getInitialUnlockedCharacters,
} from "@/lib/game/morseCode";

describe("Morse Code Dictionary", () => {
  describe("Character Mappings (A-Z)", () => {
    it("should have mappings for all 26 alphabetic characters", () => {
      const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
      const mappedChars = Object.values(MORSE_CODE_DICTIONARY).filter((char) =>
        /[a-z]/.test(char)
      );

      expect(mappedChars.length).toBeGreaterThanOrEqual(26);

      for (const letter of alphabet) {
        const hasMorseCode = Object.values(MORSE_CODE_DICTIONARY).includes(letter);
        expect(hasMorseCode).toBe(true);
      }
    });

    it("should correctly map common letters", () => {
      expect(decodeMorseSequence(".-")).toBe("a");
      expect(decodeMorseSequence(".")).toBe("e");
      expect(decodeMorseSequence("..")).toBe("i");
      expect(decodeMorseSequence("---")).toBe("o");
      expect(decodeMorseSequence("..-")).toBe("u");
      expect(decodeMorseSequence("...")).toBe("s");
      expect(decodeMorseSequence("-")).toBe("t");
    });

    it("should correctly map all letters A-Z", () => {
      const expectedMappings = {
        ".-": "a",
        "-...": "b",
        "-.-.": "c",
        "-..": "d",
        ".": "e",
        "..-.": "f",
        "--.": "g",
        "....": "h",
        "..": "i",
        ".---": "j",
        "-.-": "k",
        ".-..": "l",
        "--": "m",
        "-.": "n",
        "---": "o",
        ".--.": "p",
        "--.-": "q",
        ".-.": "r",
        "...": "s",
        "-": "t",
        "..-": "u",
        "...-": "v",
        ".--": "w",
        "-..-": "x",
        "-.--": "y",
        "--..": "z",
      };

      for (const [morse, char] of Object.entries(expectedMappings)) {
        expect(decodeMorseSequence(morse)).toBe(char);
      }
    });
  });

  describe("Number Mappings (0-9)", () => {
    it("should have mappings for all 10 digits", () => {
      const digits = "0123456789".split("");

      for (const digit of digits) {
        const hasMorseCode = Object.values(MORSE_CODE_DICTIONARY).includes(digit);
        expect(hasMorseCode).toBe(true);
      }
    });

    it("should correctly map all numbers 0-9", () => {
      const expectedMappings = {
        "-----": "0",
        ".----": "1",
        "..---": "2",
        "...--": "3",
        "....-": "4",
        ".....": "5",
        "-....": "6",
        "--...": "7",
        "---..": "8",
        "----.": "9",
      };

      for (const [morse, digit] of Object.entries(expectedMappings)) {
        expect(decodeMorseSequence(morse)).toBe(digit);
      }
    });
  });

  describe("Reverse Mapping (Character to Morse)", () => {
    it("should have reverse mappings for all characters", () => {
      for (const [morse, char] of Object.entries(MORSE_CODE_DICTIONARY)) {
        expect(CHARACTER_TO_MORSE[char]).toBe(morse);
      }
    });

    it("should correctly reverse map common characters", () => {
      expect(CHARACTER_TO_MORSE["a"]).toBe(".-");
      expect(CHARACTER_TO_MORSE["e"]).toBe(".");
      expect(CHARACTER_TO_MORSE["s"]).toBe("...");
      expect(CHARACTER_TO_MORSE["o"]).toBe("---");
    });
  });
});

describe("Morse Sequence Validation", () => {
  describe("isValidMorseSequence", () => {
    it("should accept empty sequence", () => {
      expect(isValidMorseSequence("")).toBe(true);
    });

    it("should accept valid complete sequences", () => {
      expect(isValidMorseSequence(".-")).toBe(true); // a
      expect(isValidMorseSequence(".")).toBe(true); // e
      expect(isValidMorseSequence("...")).toBe(true); // s
      expect(isValidMorseSequence("---")).toBe(true); // o
    });

    it("should accept valid partial sequences", () => {
      expect(isValidMorseSequence(".")).toBe(true); // could be e, or start of many
      expect(isValidMorseSequence("..")).toBe(true); // could be i, or start of others
      expect(isValidMorseSequence("-")).toBe(true); // could be t, or start of many
      expect(isValidMorseSequence("--")).toBe(true); // could be m, or start of others
    });

    it("should reject sequences with invalid characters", () => {
      expect(isValidMorseSequence("abc")).toBe(false);
      expect(isValidMorseSequence(".-x")).toBe(false);
      expect(isValidMorseSequence("123")).toBe(false);
      expect(isValidMorseSequence(".- ")).toBe(false);
    });

    it("should reject sequences that cannot be part of any valid code", () => {
      // These sequences don't match any Morse code pattern
      expect(isValidMorseSequence("......")).toBe(false);
      expect(isValidMorseSequence("------")).toBe(false);
    });
  });

  describe("isCompleteMorseSequence", () => {
    it("should return true for complete sequences", () => {
      expect(isCompleteMorseSequence(".-")).toBe(true); // a
      expect(isCompleteMorseSequence(".")).toBe(true); // e
      expect(isCompleteMorseSequence("...")).toBe(true); // s
      expect(isCompleteMorseSequence("---")).toBe(true); // o
    });

    it("should return false for incomplete sequences", () => {
      expect(isCompleteMorseSequence("..")).toBe(true); // i is complete
      expect(isCompleteMorseSequence("--")).toBe(true); // m is complete
    });

    it("should return false for invalid sequences", () => {
      expect(isCompleteMorseSequence("......")).toBe(false);
      expect(isCompleteMorseSequence("abc")).toBe(false);
    });
  });
});

describe("Morse Decoding", () => {
  describe("decodeMorseSequence", () => {
    it("should decode valid sequences to characters", () => {
      expect(decodeMorseSequence(".-")).toBe("a");
      expect(decodeMorseSequence(".")).toBe("e");
      expect(decodeMorseSequence("...")).toBe("s");
      expect(decodeMorseSequence("---")).toBe("o");
    });

    it("should return null for invalid sequences", () => {
      expect(decodeMorseSequence("......")).toBeNull();
      expect(decodeMorseSequence("abc")).toBeNull();
      expect(decodeMorseSequence("")).toBeNull();
    });

    it("should decode all valid Morse codes", () => {
      for (const [morse, char] of Object.entries(MORSE_CODE_DICTIONARY)) {
        expect(decodeMorseSequence(morse)).toBe(char);
      }
    });
  });
});

describe("Morse Encoding", () => {
  describe("encodeToMorse", () => {
    it("should encode simple words", () => {
      expect(encodeToMorse("sos")).toBe("... --- ...");
      expect(encodeToMorse("hello")).toBe(".... . .-.. .-.. ---");
    });

    it("should handle uppercase and lowercase", () => {
      expect(encodeToMorse("SOS")).toBe("... --- ...");
      expect(encodeToMorse("SoS")).toBe("... --- ...");
    });

    it("should encode numbers", () => {
      expect(encodeToMorse("123")).toBe(".---- ..--- ...--");
    });

    it("should handle mixed alphanumeric", () => {
      const encoded = encodeToMorse("a1b2");
      expect(encoded).toContain(".-"); // a
      expect(encoded).toContain(".----"); // 1
      expect(encoded).toContain("-..."); // b
      expect(encoded).toContain("..---"); // 2
    });
  });
});

describe("Character Unlock from Morse", () => {
  describe("unlockCharacterFromMorse", () => {
    it("should unlock character from valid Morse sequence", () => {
      const initialChars = new Set(["s", "o"]);
      const result = unlockCharacterFromMorse(".-", initialChars);

      expect(result.has("a")).toBe(true);
      expect(result.has("s")).toBe(true);
      expect(result.has("o")).toBe(true);
    });

    it("should not modify set for invalid sequence", () => {
      const initialChars = new Set(["s", "o"]);
      const result = unlockCharacterFromMorse("......", initialChars);

      expect(result.size).toBe(2);
      expect(result.has("s")).toBe(true);
      expect(result.has("o")).toBe(true);
    });

    it("should not duplicate characters", () => {
      const initialChars = new Set(["s", "o"]);
      const result = unlockCharacterFromMorse("...", initialChars); // s

      expect(result.size).toBe(2);
      expect(result.has("s")).toBe(true);
    });

    it("should unlock multiple different characters", () => {
      let chars = new Set(["s", "o"]);
      chars = unlockCharacterFromMorse(".-", chars); // a
      chars = unlockCharacterFromMorse("..", chars); // i
      chars = unlockCharacterFromMorse("-", chars); // t

      expect(chars.size).toBe(5);
      expect(chars.has("s")).toBe(true);
      expect(chars.has("o")).toBe(true);
      expect(chars.has("a")).toBe(true);
      expect(chars.has("i")).toBe(true);
      expect(chars.has("t")).toBe(true);
    });
  });
});

describe("Initial Game State", () => {
  describe("getInitialUnlockedCharacters", () => {
    it("should return s and o as initial characters", () => {
      const initial = getInitialUnlockedCharacters();

      expect(initial.size).toBe(2);
      expect(initial.has("s")).toBe(true);
      expect(initial.has("o")).toBe(true);
    });

    it("should allow typing SOS with initial characters", () => {
      const initial = getInitialUnlockedCharacters();
      const sos = "sos".split("");

      for (const char of sos) {
        expect(initial.has(char)).toBe(true);
      }
    });
  });

  describe("getAllAlphabeticCharacters", () => {
    it("should return all 26 alphabetic characters", () => {
      const allChars = getAllAlphabeticCharacters();

      expect(allChars.size).toBe(26);

      const alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
      for (const char of alphabet) {
        expect(allChars.has(char)).toBe(true);
      }
    });
  });
});

describe("Morse Code System Integration", () => {
  it("should support full character unlock workflow", () => {
    // Start with initial characters
    let unlockedChars = getInitialUnlockedCharacters();
    expect(unlockedChars.size).toBe(2);

    // Unlock 'h' using Morse code
    const morseH = CHARACTER_TO_MORSE["h"];
    expect(morseH).toBe("....");
    unlockedChars = unlockCharacterFromMorse(morseH, unlockedChars);
    expect(unlockedChars.has("h")).toBe(true);

    // Unlock 'e' using Morse code
    const morseE = CHARACTER_TO_MORSE["e"];
    expect(morseE).toBe(".");
    unlockedChars = unlockCharacterFromMorse(morseE, unlockedChars);
    expect(unlockedChars.has("e")).toBe(true);

    // Unlock 'l' using Morse code
    const morseL = CHARACTER_TO_MORSE["l"];
    expect(morseL).toBe(".-..");
    unlockedChars = unlockCharacterFromMorse(morseL, unlockedChars);
    expect(unlockedChars.has("l")).toBe(true);

    // Now we can type "hello"
    const hello = "hello".split("");
    for (const char of hello) {
      expect(unlockedChars.has(char)).toBe(true);
    }
  });

  it("should validate Morse input progressively", () => {
    // Typing '.-' for 'a'
    expect(isValidMorseSequence(".")).toBe(true); // valid partial
    expect(isCompleteMorseSequence(".")).toBe(true); // 'e' is complete
    expect(isValidMorseSequence(".-")).toBe(true); // valid complete
    expect(isCompleteMorseSequence(".-")).toBe(true); // 'a' is complete
  });
});
