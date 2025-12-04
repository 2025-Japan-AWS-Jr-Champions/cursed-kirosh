# Hint System Specification

## Overview

The Cursed Kirosh game implements a context-aware hint system that automatically displays hints based on player progress. This system is designed to support players when they get stuck while maintaining an enjoyable game experience.

## System Configuration

### Timing Settings

- **Inactivity Timeout**: 30 seconds
  - Player is considered inactive after 30 seconds of no interaction
- **Hint Cooldown**: 60 seconds
  - Next hint won't display until 60 seconds have passed since the last hint
- **Check Interval**: 5 seconds
  - System checks hint display conditions every 5 seconds

### Display Conditions

For a hint to be displayed, **ALL** of the following conditions must be met:

1. ✅ Hints are enabled (`hintsEnabled = true`)
2. ✅ Game is not complete (`gameComplete = false`)
3. ✅ Player has been inactive for 30 seconds
4. ✅ At least 60 seconds have passed since the last hint
5. ✅ The hint's specific condition is satisfied
6. ✅ The hint has not been shown before

## Implemented Hints

### 1. Morse Basics (Priority: 100)
**ID**: `morse-basics`

**Message**:
```
💡 Hint: Use the Morse Code Input buttons (DOT and DASH) to unlock new characters. Try spelling 'SOS' with what you have!
```

**Display Conditions**:
- No Morse code input history (`morseHistory.length === 0`)
- Only 2 characters unlocked (initial state)

**Purpose**: Teach new players how to use Morse code input

---

### 2. Help Command (Priority: 90)
**ID**: `help-command`

**Message**:
```
💡 Hint: Type 'help' to see available commands and get started.
```

**Display Conditions**:
- No command history (`commandHistory.length === 0`)
- Help command has not been executed

**Purpose**: Inform players about the help command

---

### 3. Unlock More (Priority: 80)
**ID**: `unlock-more`

**Message**:
```
💡 Hint: You've unlocked some characters! Keep using Morse code to unlock more. Each letter has a unique pattern.
```

**Display Conditions**:
- 3-9 characters unlocked
- Has Morse code input history (`morseHistory.length > 0`)

**Purpose**: Acknowledge player progress and encourage continuation

---

### 4. Stuck with Few Characters (Priority: 85)
**ID**: `stuck-few-chars`

**Message**:
```
💡 Hint: Feeling stuck? Focus on unlocking more characters through Morse code. Start with common letters like 'E' (.) or 'T' (-).
```

**Display Conditions**:
- Less than 8 characters unlocked
- 5 or more commands in history
- Less than 3 Morse code inputs in history

**Purpose**: Support players who are trying commands but not unlocking characters

---

### 5. Special Commands (Priority: 75)
**ID**: `special-commands`

**Message**:
```
💡 Hint: Some commands are hidden secrets. Try combinations of 'S' and 'O' like 'SOS', 'OS', 'OSS', 'SSO', or 'SOSO'.
```

**Display Conditions**:
- Help command has been executed
- SOS command has not been executed
- 5 or fewer characters unlocked

**Purpose**: Hint at hidden commands executable with initial characters

---

### 6. Heartbeat Unlock (Priority: 70)
**ID**: `heartbeat-unlock`

**Message**:
```
💡 Hint: There's a special command that can unlock all characters at once. It's related to the sound you hear when clicking DOT...
```

**Display Conditions**:
- 5 or more Morse code inputs in history
- Less than 26 characters unlocked
- Heartbeat command has not been executed

**Purpose**: Hint at the shortcut to unlock all characters

---

### 7. Multiple Endings (Priority: 65)
**ID**: `multiple-endings`

**Message**:
```
💡 Hint: This game has multiple endings! Try different commands like 'exit', 'sudo', 'treat', or 'kiro' to discover them.
```

**Display Conditions**:
- 10 or more characters unlocked
- 3 or more commands executed
- Game is not complete

**Purpose**: Inform players about multiple endings

---

### 8. Echo Secret (Priority: 60)
**ID**: `echo-secret`

**Message**:
```
💡 Hint: The 'echo' command can do more than just repeat text. Try echoing a classic programmer's greeting...
```

**Display Conditions**:
- Echo command has been executed
- "echo Hello, world!" has not been executed
- 15 or more characters unlocked

**Purpose**: Hint at the path to Engineer Ending

---

### 9. Save Kiro (Priority: 55)
**ID**: `save-kiro`

**Message**:
```
💡 Hint: You can save things in this terminal. What if you tried to save... Kiro?
```

**Display Conditions**:
- Kiro command has been executed, **OR**
- 20 or more characters unlocked AND 5 or more commands executed

**Purpose**: Hint at the path to True Ending

---

### 10. Light Mode (Priority: 50)
**ID**: `light-mode`

**Message**:
```
💡 Hint: The darkness getting to you? Try the 'light' command to brighten things up.
```

**Display Conditions**:
- 10 or more commands in history
- Light mode is disabled (`lightMode = false`)
- Light command has not been executed

**Purpose**: Inform players about the light mode feature

---

## Hint Selection Logic

1. **Filtering**: Extract hints that meet display conditions and haven't been shown yet
2. **Priority Sorting**: Sort by priority in descending order (higher numbers first)
3. **Selection**: Select the single hint with the highest priority
4. **Display**: Show as a system message in the terminal
5. **Recording**: Mark as shown (same hint will never be displayed again)

## Activity Tracking

The `lastActivityTime` is updated by the following user actions:

- ✅ Sending a command
- ✅ Morse code input (clicking DOT/DASH buttons)
- ✅ Typing in the terminal

## Technical Implementation

### File Structure

```
amplify-nextjs-app/
├── lib/game/
│   ├── hintSystem.ts          # Hint logic and hint definitions
│   ├── types.ts               # Hint-related type definitions
│   └── gameState.ts           # Hint state management
├── hooks/
│   └── useHints.ts            # Hint display hook
└── components/game/
    ├── Terminal.tsx           # Activity tracking
    └── MorseInput.tsx         # Activity tracking
```

### Key Functions

- `getNextHint(state)`: Get the next hint to display
- `canShowHint(state)`: Check if a hint can be shown
- `isPlayerInactive(state)`: Check if player is inactive
- `shouldShowHintForInactivity(state)`: Determine if hint should be shown due to inactivity

### Game Actions

- `UPDATE_ACTIVITY`: Update activity timestamp
- `SHOW_HINT`: Mark hint as shown

## Configuration Customization

The hint system can be configured in `lib/game/hintSystem.ts`:

```typescript
// Timeout settings
export const INACTIVITY_TIMEOUT = 30000;  // 30 seconds
export const HINT_COOLDOWN = 60000;       // 60 seconds

// Adding hints
export const HINTS: Hint[] = [
  {
    id: 'custom-hint',
    message: 'Your custom hint message',
    condition: (state) => /* your condition */,
    priority: 50,
  },
  // ...
];
```

## Testing

The hint system is covered by comprehensive unit tests:

```bash
npm test -- lib/game/hintSystem.test.ts
```

Test Coverage:
- ✅ Inactivity detection
- ✅ Hint display eligibility
- ✅ Hint selection logic
- ✅ Duplicate display prevention
- ✅ Priority sorting

## Player Experience Considerations

1. **Non-intrusive**: 60-second cooldown prevents overly frequent displays
2. **Context-aware**: Appropriate hints based on player progress
3. **One-time only**: Same hint never displays twice
4. **Disableable**: Can be completely disabled with `hintsEnabled` flag
5. **Visually distinct**: Displayed in purple as system messages

## Future Enhancement Ideas

- [ ] Hint difficulty settings (beginner/advanced mode)
- [ ] Player-requested hint feature
- [ ] Hint display history viewer
- [ ] Ability to re-display specific hints
- [ ] Multi-language hint support
