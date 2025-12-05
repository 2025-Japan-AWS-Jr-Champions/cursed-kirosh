## Vibe Coding: Conversation Structure & Impressive Code Generation

### How We Structured Conversations with Kiro

#### 1. Initial Phase - Spec Mode Workflow

```
Human Input (Unstructured Ideas)
    ↓
Kiro Spec Mode → requirements.md (Structured Specifications)
    ↓
Review & Approval
    ↓
Kiro → design.md (Architecture)
    ↓
Kiro → task.md (Implementation Plan)
```

#### 2. Implementation Phase - Autonomous Code Mode

* Minimal Prompts: "Build the Morse input system with audio integration"
* Kiro's Response: Full implementation including:
  * Component structure (`MorseInput.tsx`)
  * State management integration
  * Web Audio API hookup
  * Auto-complete timer logic
  * Visual feedback animations

#### 3. Refinement Phase - Vibe Mode with `fix-list.md`

Conversation Pattern:

```
## fix-list.md Structure:
* [ ] Task description
  * [ ] Sub-refinement 1
    * [ ] Sub-refinement 2
      * [x] Sub-refinement 3 (completed)
        * [ ] Follow-up adjustment
```

Example Conversation:

```
Human: "Purple text is hard to see. Make it bold and lighter."
    ↓
Kiro: [Updates CSS, tests contrast ratios]
    ↓
Human: "Still too thin. Make it bolder but not as bold as headings."
    ↓
Kiro: [Fine-tunes font-weight from 500 → 600]
```

Key Pattern: Nested feedback allowed us to iterate on the same issue without losing context. Checkboxes tracked completion state across sessions.

#### 4. Natural Language-Only Constraint

Challenge: Virtual keyboard layout adjustments

* ❌ Not allowed: Directly editing CSS/JSX
* ✅ Required: Conversational descriptions only

Example Prompt:
"Make the symbol groups closer but not touching, with the left group right-aligned and the right group left-aligned, but both centered as a pair."
Learning: We got better at using spatial metaphors ("like a pair of parentheses hugging content") instead of pixel values.

---

### Most Impressive Code Generation

#### #1: Web Audio API - Ambient Heartbeat Pattern

Context: First game with audio; zero Web Audio API experience. Prompt:
"Create an ambient background loop: 10 heartbeats → 2 OSS Morse sequences (--- ... ...) → repeat. Ensure no overlaps or stutters."
What Kiro Generated:

```ts
// Pre-scheduled audio timeline with precise timing
private playOSSSequences(count: number): void {
  let currentTime = this.audioContext.currentTime;
  const dotDuration = 0.2;
  const dashDuration = 0.6;
  const gapBetweenSignals = 0.3;
  const gapBetweenLetters = 0.8;
  const gapBetweenWords = 2.0;

  for (let seq = 0; seq < count; seq++) {
    // O = --- (3 dashes)
    for (let i = 0; i < 3; i++) {
      this.scheduleScream(currentTime);
      currentTime += dashDuration + gapBetweenSignals;
    }
    currentTime += gapBetweenLetters - gapBetweenSignals;

    // S = ... (3 dots, twice)
    for (let letter = 0; letter < 2; letter++) {
      for (let i = 0; i < 3; i++) {
        this.scheduleHeartbeat(currentTime);
        currentTime += dotDuration + gapBetweenSignals;
      }
      currentTime += gapBetweenLetters - gapBetweenSignals;
    }
    currentTime += gapBetweenWords;
  }

  // Schedule next pattern after completion
  const totalDuration = (currentTime - this.audioContext.currentTime) * 1000;
  this.ambientTimeoutId = window.setTimeout(() => {
    if (this.ambientGain) this.playAmbientPattern();
  }, totalDuration);
}
```

Why Impressive:

* Domain expertise: Kiro understood Web Audio API's scheduling model (`currentTime` vs `Date.now()`)
* Mathematical precision: Calculated exact timing to prevent overlaps
* Pattern recognition: Translated "OSS" text → Morse sequences without being told the encoding
* Loop management: Implemented seamless infinite loop with cleanup

---

#### #2: React Reducer State Management Architecture

Prompt:
"Set up game state management with React Reducer. Handle character unlocking, Morse input, ghost events, and multiple endings."
What Kiro Generated:

* Complex type system (`types.ts`):
  * 15 different `GameAction` union types
  * Nested state interfaces with Sets for character tracking
* Pure reducer logic (`gameState.ts`):
  * Immutable state updates
  * Ghost event failure → re-locks characters to initial set
  * Proper Set/Array cloning to avoid mutations
* Action creators with type safety throughout

Why Impressive:

* Architectural foresight: Designed for extensibility (easy to add new endings/commands)
* Best practices: Pure functions, immutability, TypeScript strictness
* No guidance needed: We didn't specify "use React Reducer"—Kiro chose it as the right pattern

---

#### #3: Adaptive Hint System with Context Awareness

Prompt:
"Create a hint system that shows tips based on player progress. Hints should be contextual and non-intrusive."
What Kiro Generated:

```ts
export const HINTS: Hint[] = [
  {
    id: 'morse-basics',
    message: "💡 Try spelling 'SOS' with what you have!",
    condition: (state) =>
      state.morseHistory.length === 0 &&
      state.unlockedChars.size === 2,
    priority: 100,
  },
  {
    id: 'stuck-few-chars',
    message: "💡 Focus on unlocking more characters through Morse code.",
    condition: (state) =>
      state.unlockedChars.size < 8 &&
      state.commandHistory.length >= 5 &&
      state.morseHistory.length < 3,
    priority: 85,
  },
  // 8 more contextual hints...
];
```

Why Impressive:

* Psychological insight: "Stuck" detection (lots of commands, few Morse unlocks = frustration)
* Priority system: Higher-priority hints surface first
* Cooldown mechanism: 30s inactivity + 60s between hints prevents spam
* Composable conditions: Boolean logic chains create nuanced triggers
