## Spec-Driven Development vs Vibe Coding

### How We Structured Our Spec for Kiro

#### Initial Brainstorming → Spec Mode Workflow

Step 1: Unstructured Idea Dump We started with a chaotic brainstorming doc containing:

* "Cursed code editor" concept
* "Heartbeat morse code" audio idea
* "Terminal escape game" mechanics
* "Multiple endings" narrative structure
* "Kiroween" Halloween theme

Step 2: Spec Mode Processing Fed the brainstorm document to Kiro in Spec Mode with the prompt:
"Convert these ideas into a comprehensive requirements document for a Kiroween Hackathon game in the Costume Contest category."
Step 3: Generated `requirements.md` Kiro produced a structured specification with 10 user stories including:

```markdown
### Requirement 1
User Story: As a player, I want to see a terminal interface with limited
keyboard input, so that I understand I'm trapped and need to solve puzzles to escape

#### Acceptance Criteria
1. WHEN the game loads, THE Terminal Interface SHALL display a welcome message
   indicating the curse
2. WHEN the player attempts to type, THE Terminal Interface SHALL only accept
   characters that are currently unlocked
3. THE Terminal Interface SHALL display a Virtual Keyboard showing locked
   characters as visually distinct from unlocked characters
...

### Requirement 2
User Story: As a player, I want to input Morse code through clicks, so that
I can unlock new characters to type commands

#### Acceptance Criteria
1. THE Morse Input System SHALL provide a clickable interface for entering dots
   and dashes
2. WHEN the player clicks the dot button, THE Morse Input System SHALL play the
   heartbeat audio file
...

[Requirements 3-10: Terminal commands, multiple endings, audio/visual effects,
special commands, leaderboard, hints, ghost events, initial unlocked characters]
```

The complete specification included:
- 10 user stories with acceptance criteria written in "WHEN/THE/SHALL" format
- Glossary defining 10 key terms (Terminal Interface, Morse Input System, etc.)
- Technical requirements: Audio attribution, Halloween color palette, desktop-first design

Step 4: Architecture Generation After approving `requirements.md`, Kiro auto-generated:

* `design.md`: Component architecture (15+ components), state management patterns, API design, error handling, testing strategy
* `tasks.md`: Implementation checklist with 16 major tasks, 50+ subtasks, dependency tracking

Step 5: Implementation Kiro autonomously built the entire system following the spec, producing:

* 15+ React components
* Type-safe TypeScript interfaces
* AWS Amplify backend
* Web Audio API integration

---

### How Spec-Driven Approach Improved Development

#### 1. Clarity Upfront = Faster Implementation

Problem Without Spec: "Build a terminal game" → ambiguous → multiple iterations to clarify

With Spec: Kiro understood:

* Exact data models (GameState interface with 15+ properties)
* Precise command behavior (e.g., `heartbeat` unlocks ALL characters including symbols)
* Architectural patterns (React Reducer for state, Context for sharing)
* All 10 user stories with testable acceptance criteria

Result: Zero architectural rework. First implementation was structurally correct.

---

#### 2. Eliminated Miscommunication

Example Miscommunication (Avoided):

* Ambiguous Prompt: "Add Morse code input"
* Spec Clarification:

```
- Auto-complete after 1 second of inactivity
- Visual feedback: display current sequence
- Audio feedback: play sound on each input
- Validation: check against Morse dictionary
```

Result: Kiro implemented exactly what we envisioned on first try—no "that's not what I meant" moments.

---

#### 3. Dependency Management

Task Ordering in `tasks.md` (actual file from `.kiro/specs/cursed-kirosh-game/tasks.md`):

```
1. ✅ Set up project structure and core utilities
2. ✅ Implement Morse code system
   2.1 Create Morse code dictionary and validation logic
   2.2 Build MorseInput component
   2.3 Integrate audio playback for Morse input
3. ✅ Build game state management
   3.1 Create game state reducer and context
   3.2 Implement character lock/unlock system
   3.3 Create timer and game progress tracking
4. ✅ Build terminal interface components
   4.1 Create Terminal component structure
   4.2 Build CommandPrompt component
   4.3 Create OutputDisplay component
   4.4 Implement curse effect animation
...
[16 major tasks, 50+ subtasks total]
```

Benefit: Kiro built components in correct order without us micromanaging dependencies.

---

#### 4. Scope Control

Spec as Contract:

* In scope: 6 endings, 15 commands, Morse input, leaderboard
* Out of scope: Mobile gestures, file system interaction (cut due to time)

Result: Clear priorities prevented scope creep. When time constrained, we knew what to cut based on spec priorities.

---

### Spec-Driven vs Vibe Coding: When to Use Each

| Aspect | Spec-Driven | Vibe Coding |
| ----- | ----- | ----- |
| Best for | Greenfield architecture, complex systems | UI/UX refinement, bug fixes |
| Input style | Structured document (requirements.md) | Conversational prompts ("make it bolder") |
| Kiro's role | Architect + implementer | Pair programmer |
| Iteration speed | Slower upfront (spec writing), faster overall | Instant, incremental |
| Risk of rework | Low (clear contract) | Medium (trial-and-error) |
| Cognitive load | High (must think through full system) | Low (focus on one change at a time) |

---

### Real Example: Spec-Driven for Core, Vibe Coding for Polish

#### Phase 1: Spec-Driven (Days 1-2)

Prompt:
"Implement the game according to requirements.md"
Kiro Output:

* Full React component tree
* Game state reducer with 15 action types
* Terminal command system with 15+ commands
* AWS Amplify backend
* Web Audio API integration

Time: ~4 hours of Kiro autonomous work Developer Effort: Reviewing generated code, running tests

---

#### Phase 2: Vibe Coding (Days 3-4)

Prompts (via `fix-list.md`):
"Purple text is hard to read. Make it lighter and bold."
"Virtual keyboard symbols should be grouped closer but centered as a pair."
"Show countdown before ending modal appears (10 seconds)."
Kiro Responses: Instant CSS/layout adjustments with no architectural changes Time: ~50 refinements in ~10 hours (12 minutes per refinement on average) Developer Effort: Playtesting, writing natural language feedback

---

### Key Insight: Spec-Driven ≠ Waterfall

Traditional Waterfall: Spec → Complete implementation → No changes Our Spec-Driven: Spec → Implementation → Vibe Coding refinement The spec provided architectural guardrails, but we freely iterated on UX details through Vibe Mode. This hybrid approach combined:

* Spec's clarity (no architectural thrashing)
* Vibe's flexibility (rapid UI/UX iteration)

---

### What We Learned

1. Spec Mode for "what": Defines the complete system behavior upfront
2. Vibe Mode for "how": Refines the user experience incrementally
3. Don't skip spec: Jumping straight to Vibe Coding caused 2-3 rewrites in early experiments
4. Spec = shared language: When explaining to playtesters, we referenced `requirements.md` sections