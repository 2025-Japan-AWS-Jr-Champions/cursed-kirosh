# Design Document

## Overview

Cursed Kirosh is a Next.js 16 web application that creates an immersive terminal-based puzzle game. The architecture leverages React Server Components for initial rendering, client components for interactive gameplay, and AWS Amplify Gen2 for backend services (authentication, data storage for leaderboard). The game combines real-time audio playback, canvas-based visual effects, and state management to create a cohesive Halloween-themed experience.

## Architecture

### Technology Stack

- **Frontend Framework**: Next.js 16.0.2 (App Router)
- **UI Components**: React 19.2.0 with TypeScript
- **Styling**: Tailwind CSS with custom Halloween theme
- **State Management**: React Context API + useReducer for game state
- **Audio**: Web Audio API for sound effects
- **Backend**: AWS Amplify Gen2 (Auth, Data)
- **Database**: DynamoDB (via Amplify Data)
- **Deployment**: AWS Amplify Hosting

### Application Structure

```
amplify-nextjs-app/
├── app/
│   ├── game/
│   │   ├── page.tsx                 # Main game page
│   │   └── layout.tsx               # Game-specific layout
│   ├── leaderboard/
│   │   └── page.tsx                 # Leaderboard display
│   ├── layout.tsx                   # Root layout
│   └── page.tsx                     # Landing/intro page
├── components/
│   ├── game/
│   │   ├── Terminal.tsx             # Main terminal interface
│   │   ├── VirtualKeyboard.tsx      # Visual keyboard display
│   │   ├── MorseInput.tsx           # Morse code input UI
│   │   ├── CommandPrompt.tsx        # Command line input
│   │   ├── OutputDisplay.tsx        # Terminal output area
│   │   ├── GhostEvent.tsx           # Trick or treat popup
│   │   └── EndingScreen.tsx         # Ending displays
│   ├── audio/
│   │   └── AudioManager.tsx         # Audio playback controller
│   └── ui/
│       ├── Button.tsx               # Reusable button
│       └── Modal.tsx                # Modal dialogs
├── lib/
│   ├── game/
│   │   ├── gameState.ts             # Game state types and logic
│   │   ├── morseCode.ts             # Morse code dictionary
│   │   ├── commandParser.ts         # Command execution logic
│   │   ├── endings.ts               # Ending conditions and content
│   │   └── characterUnlock.ts       # Character unlock logic
│   ├── audio/
│   │   └── audioController.ts       # Audio playback utilities
│   └── utils/
│       ├── localStorage.ts          # Browser storage utilities
│       └── timeFormat.ts            # Time formatting helpers
├── hooks/
│   ├── useGameState.ts              # Game state management hook
│   ├── useAudio.ts                  # Audio playback hook
│   ├── useMorseInput.ts             # Morse input handling hook
│   └── useTimer.ts                  # Game timer hook
├── amplify/
│   ├── data/
│   │   └── resource.ts              # Leaderboard data model
│   └── auth/
│       └── resource.ts              # Authentication config
└── public/
    ├── audio/
    │   ├── heartbeat.mp3            # Existing heartbeat sound
    │   └── scream.mp3               # Existing scream sound
    └── image/
        └── ghost.png                # Ghost image for trick or treat event
```

## Components and Interfaces

### Core Game Components

#### Terminal Component
```typescript
interface TerminalProps {
  gameState: GameState;
  onCommand: (command: string) => void;
}

// Manages the overall terminal UI, coordinates child components
// Handles cursor blinking, text rendering, and layout
```

#### VirtualKeyboard Component
```typescript
interface VirtualKeyboardProps {
  unlockedChars: Set<string>;
  onCharacterClick?: (char: string) => void;
}

// Displays QWERTY keyboard layout
// Shows locked characters with visual "crack" effect when unlocked
// Provides visual feedback for locked/unlocked state
```

#### MorseInput Component
```typescript
interface MorseInputProps {
  onMorseComplete: (character: string) => void;
  onMorseInput: (type: 'dot' | 'dash') => void;
}

// Provides dot/dash input buttons
// Displays current Morse sequence
// Validates and decodes Morse patterns
// Triggers audio playback
```

#### CommandPrompt Component
```typescript
interface CommandPromptProps {
  unlockedChars: Set<string>;
  onSubmit: (command: string) => void;
  disabled: boolean;
}

// Handles text input with character filtering
// Displays command prompt (e.g., "cursed@kirosh:~$")
// Manages input history (up/down arrows)
// Applies curse effect to typed characters
```

#### OutputDisplay Component
```typescript
interface OutputDisplayProps {
  lines: OutputLine[];
  maxLines?: number;
}

interface OutputLine {
  id: string;
  text: string;
  type: 'command' | 'output' | 'error' | 'system';
  timestamp: number;
}

// Renders terminal output history
// Auto-scrolls to bottom
// Applies different styling based on line type
```

#### GhostEvent Component
```typescript
interface GhostEventProps {
  isActive: boolean;
  onTreat: () => void;
  onTrick: () => void;
  timeLimit: number;
}

// Displays ghost image (ghost.png) with "trick or treat" prompt
// Shows countdown timer
// Triggers appropriate callback based on player response
// Animates ghost appearance from bottom of screen
```

#### EndingScreen Component
```typescript
interface EndingScreenProps {
  ending: EndingType;
  completionTime: number;
  onRestart: () => void;
  onViewLeaderboard: () => void;
}

type EndingType = 'normal' | 'sudo' | 'kiroween' | 'kiro' | 'engineer' | 'true';

// Displays ending-specific content and visuals
// Shows completion time
// Provides options to restart or view leaderboard
```

### State Management

#### Game State Structure
```typescript
interface GameState {
  // Character management
  unlockedChars: Set<string>;
  initialChars: Set<string>; // 's', 'o'
  
  // Morse input
  currentMorseSequence: string;
  morseHistory: MorseEntry[];
  
  // Terminal state
  commandHistory: string[];
  outputLines: OutputLine[];
  currentInput: string;
  
  // Game progress
  startTime: number | null;
  endTime: number | null;
  completedCommands: Set<string>;
  discoveredSecrets: Set<string>;
  
  // Events
  ghostEventActive: boolean;
  ghostEventCount: number;
  lastGhostEventTime: number;
  
  // Ending
  currentEnding: EndingType | null;
  gameComplete: boolean;
  
  // Settings
  audioEnabled: boolean;
  hintsEnabled: boolean;
}

interface MorseEntry {
  sequence: string;
  character: string;
  timestamp: number;
}

// Game state actions
type GameAction =
  | { type: 'UNLOCK_CHARACTER'; character: string }
  | { type: 'LOCK_CHARACTER'; character: string }
  | { type: 'ADD_MORSE_INPUT'; input: 'dot' | 'dash' }
  | { type: 'CLEAR_MORSE_INPUT' }
  | { type: 'COMPLETE_MORSE'; character: string }
  | { type: 'SUBMIT_COMMAND'; command: string }
  | { type: 'ADD_OUTPUT'; line: OutputLine }
  | { type: 'START_GAME' }
  | { type: 'END_GAME'; ending: EndingType }
  | { type: 'TRIGGER_GHOST_EVENT' }
  | { type: 'RESOLVE_GHOST_EVENT'; success: boolean }
  | { type: 'RESET_GAME' };
```

### Audio System

#### AudioManager Component
```typescript
interface AudioManagerProps {
  enabled: boolean;
  children: React.ReactNode;
}

// Provides audio context to child components
// Manages audio file loading and caching
// Controls global audio settings
```

#### Audio Controller
```typescript
interface AudioController {
  playHeartbeat: () => Promise<void>;
  playScream: () => Promise<void>;
  playAmbientHeartbeat: () => void;
  stopAmbientHeartbeat: () => void;
  setVolume: (volume: number) => void;
}

// Handles Web Audio API interactions
// Manages audio file buffers
// Controls playback timing and volume
```

## Data Models

### Leaderboard Entry (Amplify Data)
```typescript
// amplify/data/resource.ts
const schema = a.schema({
  LeaderboardEntry: a.model({
    playerName: a.string().required(),
    completionTime: a.integer().required(), // milliseconds
    endingType: a.string().required(),
    completedAt: a.datetime().required(),
    unlockedCharCount: a.integer(),
    secretsFound: a.integer(),
  })
  .authorization((allow) => [
    allow.publicApiKey().to(['read']),
    allow.authenticated().to(['create', 'read'])
  ])
});
```

### Local Storage Schema
```typescript
interface LocalGameData {
  bestTime: number | null;
  gamesPlayed: number;
  endingsDiscovered: Set<string>;
  totalSecretsFound: number;
  preferences: {
    audioEnabled: boolean;
    hintsEnabled: boolean;
  };
}
```

## Error Handling

### Error Categories

1. **Audio Playback Errors**
   - Fallback to silent mode if audio fails to load
   - Display notification to user about audio issues
   - Log errors for debugging

2. **Network Errors (Leaderboard)**
   - Retry logic with exponential backoff
   - Cache leaderboard data locally
   - Display offline indicator
   - Allow game completion without leaderboard submission

3. **Invalid Command Input**
   - Display helpful error messages
   - Suggest similar valid commands
   - Maintain game state integrity

4. **State Corruption**
   - Validate state transitions
   - Implement state recovery from localStorage
   - Provide "reset game" option

### Error Handling Patterns

```typescript
// Command execution with error handling
async function executeCommand(command: string, gameState: GameState): Promise<CommandResult> {
  try {
    const result = commandParser.parse(command);
    return result;
  } catch (error) {
    if (error instanceof InvalidCommandError) {
      return {
        success: false,
        output: `Command not found: ${command}. Type 'help' for available commands.`,
        type: 'error'
      };
    }
    throw error; // Re-throw unexpected errors
  }
}

// Audio playback with graceful degradation
async function playSound(audioFile: string): Promise<void> {
  try {
    await audioController.play(audioFile);
  } catch (error) {
    console.warn('Audio playback failed:', error);
    // Continue game without audio
  }
}

// Leaderboard submission with retry
async function submitScore(entry: LeaderboardEntry): Promise<boolean> {
  const maxRetries = 3;
  let attempt = 0;
  
  while (attempt < maxRetries) {
    try {
      await client.models.LeaderboardEntry.create(entry);
      return true;
    } catch (error) {
      attempt++;
      if (attempt === maxRetries) {
        // Store locally for later submission
        localStorage.setItem('pendingScore', JSON.stringify(entry));
        return false;
      }
      await delay(Math.pow(2, attempt) * 1000);
    }
  }
  return false;
}
```

## Testing Strategy

### Unit Tests

1. **Morse Code Logic**
   - Test all Morse code mappings (A-Z, 0-9)
   - Validate sequence parsing
   - Test invalid sequence handling

2. **Command Parser**
   - Test each command type (ls, cd, echo, etc.)
   - Test command with arguments
   - Test invalid commands
   - Test ending triggers

3. **Character Unlock Logic**
   - Test initial character set
   - Test unlock/lock operations
   - Test "heartbeat" command unlock all

4. **Game State Reducer**
   - Test all action types
   - Test state transitions
   - Test state immutability

### Integration Tests

1. **Game Flow**
   - Test complete game playthrough
   - Test each ending path
   - Test ghost event triggering and resolution

2. **Audio Integration**
   - Test audio playback on Morse input
   - Test ambient heartbeat loop
   - Test audio enable/disable

3. **Leaderboard Integration**
   - Test score submission
   - Test leaderboard retrieval
   - Test offline behavior

### End-to-End Tests (Browser Automation)

1. **Complete Game Scenarios**
   - Play through to each ending
   - Verify visual effects render correctly
   - Test keyboard input filtering

2. **Performance**
   - Measure initial load time
   - Test with long command history
   - Verify smooth animations

3. **Accessibility**
   - Test keyboard navigation
   - Verify screen reader compatibility
   - Test color contrast ratios

### Testing Tools

- **Unit/Integration**: Vitest
- **E2E**: Playwright (via MCP)
- **Component**: React Testing Library
- **Coverage**: Vitest coverage reports

## Visual Design

### Color Scheme (Halloween Theme)

```css
:root {
  --bg-primary: #0a0a0a;        /* Deep black */
  --bg-secondary: #1a0a1a;      /* Dark purple-black */
  --text-primary: #ff6600;      /* Halloween orange */
  --text-secondary: #ff8833;    /* Light orange */
  --text-error: #ff0000;        /* Red */
  --text-system: #8b00ff;       /* Purple */
  --accent-purple: #9933ff;     /* Bright purple */
  --accent-orange: #ff6600;     /* Halloween orange */
  --accent-blood: #cc0000;      /* Blood red */
  --locked-char: #333333;       /* Dark gray */
  --unlocked-char: #ff6600;     /* Orange for unlocked */
  --ghost-white: #f0f0f0;       /* Ghost white */
  --glow-purple: #8b00ff80;     /* Purple glow (50% opacity) */
  --glow-orange: #ff660080;     /* Orange glow (50% opacity) */
}
```

### Typography

- **Terminal Font**: 'Courier New', monospace
- **UI Font**: 'Inter', sans-serif
- **Font Sizes**: 
  - Terminal: 16px
  - Keyboard: 14px
  - Headings: 24px

### Animations

1. **Cursor Blink**: 0.5s interval
2. **Character Unlock**: Crack effect with 0.3s duration
3. **Curse Effect**: Random jitter animation, 2s delay after typing
4. **Ghost Appearance**: Fade in from bottom, 0.5s
5. **Ending Screen**: Fade in with scale, 1s

### Responsive Design

- **Desktop Only**: Optimized for desktop screens (minimum 1024px width)
- Layout: Side-by-side terminal and keyboard display
- Note: Mobile and tablet support not required for initial version

## Performance Considerations

1. **Audio Preloading**: Load audio files on component mount
2. **Output History Limit**: Cap at 1000 lines, remove oldest
3. **Animation Optimization**: Use CSS transforms, requestAnimationFrame
4. **State Updates**: Batch updates with useReducer
5. **Memoization**: Memo expensive components (VirtualKeyboard, OutputDisplay)

## Security Considerations

1. **Input Sanitization**: Sanitize all command inputs before execution
2. **XSS Prevention**: Escape output text before rendering
3. **API Key Protection**: Use Amplify's built-in API key management
4. **Rate Limiting**: Implement client-side rate limiting for leaderboard submissions
5. **Content Security Policy**: Configure CSP headers for audio and scripts

## Accessibility

1. **Keyboard Navigation**: Full keyboard support for all interactions
2. **Screen Reader**: ARIA labels for all interactive elements
3. **Focus Management**: Clear focus indicators
4. **Audio Alternatives**: Visual feedback for all audio cues
5. **Color Contrast**: WCAG AA compliance for all text

## Attribution

### Audio Attribution
Audio files from OtoLogic (https://otologic.jp) require credit display:
- Display "Sound effects by OtoLogic" in footer
- Link to https://otologic.jp/free/license.html
- Include in about/credits section

### Image Attribution
Ghost image (ghost.png) requires copyright display:
- Display "©DESIGNALIKIE" near ghost image or in footer
- Include in about/credits section
- Ensure attribution is visible when ghost appears
