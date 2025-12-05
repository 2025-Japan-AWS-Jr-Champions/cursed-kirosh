# Cursed Kirosh 🎃

A Kiroween-themed terminal mystery game where players decode Morse code to escape a cursed terminal. Built with Next.js 16, AWS Amplify Gen2, and React 19.

## 🎮 Game Overview

You wake up trapped in a cursed terminal with only the letters **S** and **O** unlocked. Strange sounds echo through the darkness—heartbeats and screams that are actually **Morse code**. Decode the signals, unlock characters, execute commands, and discover multiple endings while avoiding the ghost that haunts the terminal.

**Category**: Costume Contest (Exceptional UI/UX)

## ✨ Features

### Game Mechanics
- **Morse Code Input**: Decode heartbeat (dot) and scream (dash) sounds to unlock characters
- **Progressive Unlocking**: Start with 2 characters, unlock all 26 through gameplay
- **Multiple Endings**: 6 different endings based on player choices (Normal, Sudo, Kiroween, Kiro, Engineer, True)
- **Ghost Events**: Random encounters requiring quick responses or lose progress
- **Context-Aware Hints**: 10 intelligent hints that adapt to player progress
- **Audio System**: Immersive sound effects with volume controls

### Technical Features
- **Real-time Leaderboard**: AWS Amplify Gen2 with public API access
- **Persistent State**: LocalStorage-based game state management
- **Responsive Design**: Optimized for desktop (1024px+)
- **Light/Dark Mode**: Toggle between cursed darkness and light mode
- **Type-Safe**: Full TypeScript implementation with generated Amplify types

## 🚀 Quick Start

### Prerequisites

- **Node.js**: v18.x or later
- **npm**: v8.x or later
- **AWS Account**: With `AmplifyBackendDeployFullAccess` permission
- **AWS CLI**: Configured with profile named `kirosh`

### 1. Install Dependencies

```bash
cd amplify-nextjs-app
npm install
```

### 2. Configure AWS Profile

Ensure you have an AWS profile named `kirosh` configured:

```bash
aws configure --profile kirosh
```

Enter your AWS credentials when prompted. This profile is required for all Amplify commands.

### 3. Start Amplify Sandbox

The sandbox deploys your backend to AWS and watches for changes:

```bash
npm run amplify:sandbox
# Or manually: npx ampx sandbox --profile kirosh
```

This will:
- Deploy authentication (Cognito)
- Deploy data layer (AppSync GraphQL API)
- Generate `amplify_outputs.json` with connection details
- Watch for backend changes and auto-deploy

**Keep this terminal running** during development.

### 4. Run Development Server

In a **separate terminal**:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to play the game.

## 📁 Project Structure

```
amplify-nextjs-app/
├── amplify/                    # AWS Amplify Gen2 backend
│   ├── auth/resource.ts        # Cognito authentication config
│   ├── data/resource.ts        # GraphQL schema (LeaderboardEntry)
│   └── backend.ts              # Backend definition
│
├── app/                        # Next.js App Router
│   ├── page.tsx                # Landing page with instructions
│   ├── game/page.tsx           # Main game interface
│   ├── leaderboard/page.tsx    # Global leaderboard
│   └── layout.tsx              # Root layout with Amplify config
│
├── components/                 # React components
│   ├── game/
│   │   ├── Terminal.tsx        # Terminal interface
│   │   ├── MorseInput.tsx      # Morse code input buttons
│   │   ├── GhostEvent.tsx      # Ghost encounter UI
│   │   └── EndingScreen.tsx    # Game completion screens
│   └── audio/
│       └── AudioControls.tsx   # Volume and audio toggle
│
├── lib/                        # Core game logic
│   ├── game/
│   │   ├── types.ts            # TypeScript type definitions
│   │   ├── gameState.ts        # State management and reducer
│   │   ├── commands.ts         # Terminal command handlers
│   │   ├── morseCode.ts        # Morse code decoder
│   │   ├── hintSystem.ts       # Context-aware hint logic
│   │   └── endings.ts          # Ending detection logic
│   └── utils/
│       └── localStorage.ts     # Persistent state management
│
├── hooks/                      # Custom React hooks
│   ├── useGameState.ts         # Game state hook
│   ├── useAudio.ts             # Audio playback hook
│   └── useHints.ts             # Hint display hook
│
├── tests/                      # Vitest unit tests
│   ├── morse-code.test.ts      # Morse decoder tests
│   ├── endings.test.ts         # Ending detection tests
│   ├── ghost-event.test.ts     # Ghost event tests
│   ├── leaderboard.test.ts     # Leaderboard tests
│   └── TESTING_REPORT.md       # Test coverage report
│
├── public/                     # Static assets
│   ├── sounds/                 # Audio files (OtoLogic)
│   └── ghost.png               # Ghost image (©DESIGNALIKIE)
│
└── docs/                       # Documentation
    ├── hint-system.md          # Hint system specification
    └── submission-requirements/ # Hackathon documentation
```

## 🎯 Available Commands

### Development
```bash
npm run dev              # Start Next.js dev server (port 3000)
npm run build            # Build for production
npm run start            # Start production server
npm run lint             # Run Biome linter
npm run format           # Format code with Biome
```

### Testing
```bash
npm test                 # Run all tests once
npm run test:watch       # Run tests in watch mode
npm run test:ui          # Open Vitest UI
```

### Amplify
```bash
npm run amplify:sandbox  # Start cloud sandbox (requires --profile kirosh)
npm run amplify:deploy   # Deploy to production (update YOUR_APP_ID first)
```

**Important**: All Amplify commands automatically use the `kirosh` AWS profile. If you need to use a different profile, modify the scripts in `package.json`.

## 🎮 How to Play

1. **Start the Game**: Click "START GAME" on the landing page
2. **Decode Morse Code**: Click DOT (•) and DASH (—) buttons to input Morse sequences
   - Heartbeat sound = DOT
   - Scream sound = DASH
3. **Unlock Characters**: Complete Morse sequences to unlock letters
4. **Execute Commands**: Type commands in the terminal (try `help` first)
5. **Face the Ghost**: When the ghost appears, type `treat` quickly!
6. **Find Endings**: Discover 6 different endings through exploration

### Key Commands
- `help` - Show available commands
- `ls` - List files
- `cd <dir>` - Change directory
- `cat <file>` - Read file contents
- `echo <text>` - Print text
- `sos` - Emergency signal
- `sso` - Sword Sorcerer Online (VR death game - bad ending!)
- `exit` - Normal ending
- `sudo exit` - Sudo ending
- `treat` - Kiroween ending
- `kiro` - Kiro ending
- `save kiro` - True ending (requires unlocking)
- `light` - Toggle light mode

## 🏆 Leaderboard System

The game features a global leaderboard powered by AWS Amplify Gen2:

### Data Model
```typescript
LeaderboardEntry {
  playerName: string
  completionTime: number      // Milliseconds
  endingType: string          // "normal" | "sudo" | "kiroween" | etc.
  completedAt: datetime
  unlockedCharCount: number
  secretsFound: number
}
```

### Authorization
- **Public Read**: Anyone can view leaderboard entries
- **Public Create**: Anyone can submit scores (no authentication required)
- **API Key**: 30-day expiration, auto-renewed

### Accessing the Leaderboard
- In-game: Click "View Leaderboard" after completing the game
- Direct URL: `/leaderboard`
- Sorted by: Completion time (fastest first)

## 🧪 Testing

The project uses Vitest with React Testing Library:

```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode for development
npm run test:ui          # Visual test UI
```

### Test Coverage
- ✅ Morse code decoder (100% coverage)
- ✅ Ending detection logic
- ✅ Ghost event mechanics
- ✅ Hint system logic
- ✅ Leaderboard integration

See `tests/TESTING_REPORT.md` for detailed coverage report.

## 🎨 Customization

### Adding New Commands

Edit `lib/game/commands.ts`:

```typescript
export const executeCommand = (command: string, state: GameState): CommandResult => {
  // Add your command handler
  if (command === 'mycommand') {
    return {
      success: true,
      output: 'Command executed!',
      type: 'output'
    };
  }
  // ...
};
```

### Adding New Hints

Edit `lib/game/hintSystem.ts`:

```typescript
export const HINTS: Hint[] = [
  {
    id: 'my-hint',
    message: '💡 Hint: Your helpful message here',
    condition: (state) => state.unlockedChars.size > 5,
    priority: 75,
  },
  // ...
];
```

### Modifying Morse Code Mappings

Edit `lib/game/morseCode.ts`:

```typescript
export const MORSE_CODE_MAP: Record<string, string> = {
  '.-': 'A',
  '-...': 'B',
  // Add custom mappings
};
```

## 🚀 Deployment

### Option 1: Amplify Hosting (Recommended)

1. Push code to GitHub
2. Go to [AWS Amplify Console](https://console.aws.amazon.com/amplify/create/repo-branch)
3. Select "Start with an existing app" > "GitHub"
4. Choose repository and branch
5. Update `package.json` with your App ID:
   ```json
   "amplify:deploy": "npx ampx pipeline-deploy --branch main --app-id YOUR_APP_ID --profile kirosh"
   ```
6. Deploy: `npm run amplify:deploy`

Amplify will automatically:
- Build and deploy frontend
- Deploy backend resources
- Set up CI/CD pipeline
- Generate production URLs

### Option 2: Manual Deployment

```bash
npm run build
npm run start
```

Deploy the `.next` folder to any Node.js hosting platform.

## 🔧 Troubleshooting

### `amplify_outputs.json` not found
**Solution**: Run `npm run amplify:sandbox` first to generate backend configuration.

### AWS Profile Errors
**Solution**: Ensure you have a profile named `kirosh` configured:
```bash
aws configure --profile kirosh
cat ~/.aws/credentials  # Verify [kirosh] section exists
```

### Audio Not Playing
**Solution**: 
- Check browser console for audio loading errors
- Ensure files exist in `public/sounds/`
- Click "Enable Audio" button in game

### Leaderboard Not Loading
**Solution**:
- Verify sandbox is running
- Check `amplify_outputs.json` exists
- Verify API key authorization in `amplify/data/resource.ts`

### TypeScript Errors
**Solution**: Regenerate Amplify types:
```bash
npx ampx generate outputs --profile kirosh
```

## 📚 Documentation

- **Game Design**: `docs/hint-system.md`
- **Test Report**: `tests/TESTING_REPORT.md`
- **Kiro Usage**: `docs/submission-requirements/`
- **Amplify Gen2**: https://docs.amplify.aws/nextjs/
- **Next.js 16**: https://nextjs.org/docs

## 🎃 Credits

- **Game Design**: [@amixedcolor](https://x.com/amixedcolor) & [@ryudai](https://x.com/ryudai_dayo)
- **Sound Effects**: [OtoLogic](https://otologic.jp/free/license.html)
- **Ghost Image**: ©DESIGNALIKIE
- **Built with**: Kiro AI Assistant

## 📝 License

MIT License - see [LICENSE](LICENSE) file for details.

This project was created for the Kiro Hackathon. All third-party assets are used with proper attribution and licensing.

---

**Best experienced on desktop (1024px+) with audio enabled** 🎃
