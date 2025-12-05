# About the Project

## What Inspired Us

When we first saw the Kiroween Hackathon announcement, our initial concept was a "cursed online code editor"perfect for the **Costume Contest** category. We imagined an engineer's worst nightmare: an editor where `console.log` outputs became garbled text, or `.kiro` files contained cursed instructions. The idea evolved through several brainstorming phases: a "cursed IDE escape room," a fictional "kiroween lang" where `print("Hello World")` outputs "Goodbye World," and even a minimal language using only the letters k-i-r-o-w-e-n and ={.

The breakthrough came when we connected two concepts: **Morse code as "resurrection"** (reviving obsolete technology) and **Halloween horror audio**. Instead of boring beeps, we asked: "What if dots sound like heartbeats and dashes sound like screams?" This audio innovation became the soul of the project.

Separately, we were exploring "spell commands"typing `light` to brighten something. But brighten what? A terminal. Commands + magic = shell. This sparked the name **"kirosh"** (a cute play on "Kiro" + "shell"), which eventually became **"Cursed Kirosh"**a terminal escape game where players decode horror-themed Morse code to break free.

The terminal felt natural because as developers, we interact with it dailyespecially in AI-driven development workflows. Morse code, meanwhile, held personal significance: it appears in several of our favorite songs and carries an inherently mysterious, cryptographic quality. The combination of everyday familiarity and cryptic unfamiliarity created the perfect tension for an immersive puzzle experience.

For the visual identity, we chose **Kiro's signature purple** paired with **Halloween orange** to establish a cohesive, immediately recognizable atmosphere.

---

## What We Learned

### Technical Growth
As a web application engineer, I rarely build games beyond simple single-HTML projects. **Cursed Kirosh** was my first experience orchestrating complex game architecturemanaging state across multiple components, coordinating event systems, and synchronizing audio feedback. Watching Kiro AI autonomously assemble these interconnected systems taught me how game components work together holistically. Understanding this architecturehow reducers manage state, how actions cascade through the system, and how UI responds to eventswas the biggest technical takeaway.

### UI/UX Philosophy
We deliberately avoided cheap jump scares. Instead, we focused on creating an **unforgettable experience** through uniqueness and surprise. The goal was "What is this?"a reaction that lingers in memory. We achieved this through:
- **Unprecedented audio design**: Heartbeat dots and scream dashes (no other game does this)
- **Cursed typography**: Glitchy, animated text that feels genuinely haunted
- **Replayability mechanics**: Time-attack leaderboards and six distinct endings incentivize multiple playthroughs

The "Costume Contest" category taught us that exceptional UI/UX isn't about perfectionit's about being memorable.

### Game Balance Insights
The hardest lesson: **the creator's curse**. As we built the game, we became experts, making us blind to first-time player struggles. External playtesting was invaluablewatching others fumble with Morse patterns or miss hidden commands revealed where we needed adaptive hints and better onboarding. We learned to balance difficulty so players feel clever, not frustrated.

---

## How We Built It

### Development Process
1. **Ideation**: Brainstormed wild ideas in a collaborative doc
2. **Specification**: Fed ideas to Kiro in Spec Mode � generated `requirements.md`
3. **Architecture**: Reviewed requirements � auto-generated `design.md` and `task.md`
4. **Core Implementation**: Built Morse input system first, immediately integrating audio feedback
5. **Iterative Refinement**: Used **Vibe Mode** extensively, maintaining a `fix-list.md` for UI/UX improvements

The `fix-list.md` approach was crucial. Instead of scattered feedback, we consolidated requests into a structured file, allowing Kiro to batch-process improvements in 5-10 minute cycles. When new issues emerged during testing, we nested them as sub-tasks, creating a living document of refinements.

### Backend Architecture (AWS Amplify Gen2)
We prioritized **simplicity**. While Amplify Gen2 supports complex backends, our game experience was the heroinfrastructure was supporting cast. For the leaderboard:
- **Fast queries**: Optimized for instant rank display to fuel competitive replay
- **Public API**: No authentication frictionsubmit scores immediately after completion
- **Minimal schema**: Just the essentials (time, ending type, unlocked characters, secrets)

This lean approach let us focus on polish rather than over-engineering.

### Audio System (Web Audio API)
Creating audio was unexpectedly challengingthis was our first game with sound. We spent significant time processing audio files, applying effects to make even brief clips unmistakably sound like real heartbeats and screams. The implementation itself? Kiro nailed it without explicit guidance, demonstrating the power of AI-assisted development for domains where we lacked expertise.

### UI/UX Refinement
The **virtual keyboard** was deceptively complex. We committed to "Vibe Coding"never touching code directly, only natural language instructions. Communicating precise layout adjustments through prose alone tested our descriptive precision. It taught us to think like designers explaining to developers, which paradoxically made us better at both roles.

---

## Challenges We Faced

### Technical Obstacles

**Unsolved: The Flash of Unstyled Content (FOUC)**
On page load, raw HTML briefly appears before CSS loadsa jarring break from the cursed atmosphere. We attempted inline critical CSS, preloading stylesheets, and dangerouslySetInnerHTML workarounds, but Next.js 16's rendering pipeline proved stubborn. Eventually, we reframed it: *the FOUC is part of the curse*. This "feature, not bug" mindset let us redirect effort toward more impactful polish.

**Conquered: Audio Synchronization**
Timing the ambient heartbeat loop (10 heartbeats � 2 OSS Morse sequences � repeat) required precise Web Audio API scheduling. Early attempts caused overlaps and stutters. Solution: pre-calculated event timelines with `scheduleSourceNode` ensured seamless transitions.

### Design Challenges

**Virtual Keyboard Layout**
Translating our vision into natural language prompts was harder than coding directly. Example struggle: "Make the symbol groups closer but not touching, with the left group right-aligned and the right group left-aligned, but both centered as a pair." After multiple iterations, we learned to use visual analogies and component relationships rather than absolute positioning.

**First-Time User Experience**
Our biggest blind spot. Features obvious to us (like typing `sos` with only S and O unlocked) completely eluded playtesters. This drove the adaptive hint system, which triggers context-aware tips after 30 seconds of inactivitysaving players from frustration without hand-holding.

### Scope Management

**Features We Cut**
- **Interactive file system**: The `ls` command shows files (`secrets.txt`, `morse_guide.txt`, etc.), but we didn't implement `cat` to read theman entire meta-narrative lost to time constraints.
- **Expanded command library**: Only ~15 commands made it. We envisioned 50+, including easter eggs like `sudo rm -rf /` (triggering a fake system wipe animation).
- **FOUC resolution**: As mentioned, we chose to ship rather than perfect.

**What We Kept**
Despite cuts, we delivered on our core promise: an **unforgettable, polished UI/UX experience** worthy of the Costume Contest category. The six endings, adaptive hints, ghost events, and audio-visual cohesion create a complete, memorable journey.

---

## Future Improvements

While we're proud of what we built, several challenges remain:

1. **Fix FOUC**: We'll explore SSR pre-rendering or custom Next.js plugins to eliminate unstyled flashes.
2. **Expand content**: More commands, additional endings (we have ideas for "bad" endings triggered by specific mistakes), and interactive files.
3. **Enhanced audio**: Spatial audio for ghost events, dynamic music that responds to player stress levels.
4. **Mobile support**: Currently optimized for desktop (1024px+). A mobile-first redesign could use swipe gestures for Morse input.
5. **Accessibility**: Screen reader support for terminal output, colorblind-friendly palettes, and keyboard-only navigation.

This project proved that with thoughtful design, AI collaboration, and relentless iteration, even a short hackathon timeline can produce something genuinely unforgettable.

---

## Built With

### Frontend Technologies
- **Next.js 16** (App Router) - Latest React framework with server components
- **React 19** - UI component library with concurrent features
- **TypeScript 5** - Type-safe development throughout the codebase
- **Tailwind CSS 4** - Utility-first styling with custom Halloween theme

### Backend & Infrastructure
- **AWS Amplify Gen2** - Full-stack serverless platform
  - **AWS AppSync** - GraphQL API for real-time leaderboard queries
  - **Amazon Cognito** - Authentication (configured for public API key access)
  - **Amazon DynamoDB** - NoSQL database for leaderboard storage
- **AWS Amplify Hosting** - CI/CD pipeline with automatic deployments

### Audio & Media
- **Web Audio API** - Native browser audio with precise scheduling
- **Audio Processing**: Custom heartbeat and scream samples processed with effects (reverb, pitch shift, compression)

### Development Tools
- **Biome** - Fast linter and formatter (ESLint/Prettier alternative)
- **Vitest** - Unit testing framework with React Testing Library
- **Kiro AI** - AI-powered development assistant
  - Spec Mode for requirements generation
  - Vibe Mode for iterative UI/UX refinement

### Key Libraries
- **aws-amplify (v6.15.8)** - Client SDK for AWS services
- **@aws-amplify/backend (v1.18.0)** - Backend infrastructure as code

### Design & Assets
- **OtoLogic** - Audio sound effects library (licensed)
- **DESIGNALIKIE** - Ghost illustration artwork (©)

The entire stack was chosen to maximize development velocity while maintaining production-grade quality—leveraging AWS Amplify Gen2's code-first approach allowed us to define infrastructure alongside application logic, and Kiro AI enabled natural language-driven development that accelerated iteration cycles.
