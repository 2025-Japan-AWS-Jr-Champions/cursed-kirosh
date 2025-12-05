# Cursed Kirosh - Endings Guide

This document lists all possible endings in Cursed Kirosh and the commands required to reach them.

## Overview

Cursed Kirosh features **6 different endings**, each triggered by specific terminal commands. Players can discover multiple endings in different playthroughs.

---

## Ending Types

### 1. Normal Ending
**Command:** `exit`

**Description:**
The simplest way to escape. Type `exit` to leave the cursed terminal. Sometimes the most straightforward solution is the right one.

**Trigger Condition:**
- Type `exit` in the terminal at any time

**Ending Message:**
```
╔════════════════════════════════════════╗
║          NORMAL ENDING                 ║
╚════════════════════════════════════════╝

You typed 'exit' and left the cursed terminal.
Sometimes the simplest solution is the right one.

The curse releases you... for now.
```

---

### 2. Kirosh Domination Ending
**Command:** `sudo`

**Description:**
Invoke administrative privileges to dominate the cursed terminal. Instead of escaping, you become one with Kirosh itself.

**Trigger Condition:**
- Type `sudo` in the terminal at any time

**Ending Message:**
```
╔════════════════════════════════════════╗
║      KIROSH DOMINATION ENDING          ║
╚════════════════════════════════════════╝

You invoked sudo... but you are not in the sudoers file.
This incident will be reported.

Wait... the curse recognizes your authority.
You have become one with Kirosh.
The terminal bends to your will.

You are no longer trapped. You ARE the trap.
```

---

### 3. Kiroween Ending
**Command:** `treat`

**Description:**
Offer a treat to the spirits. The Halloween-themed ending where kindness and candy break the curse.

**Trigger Condition:**
- Type `treat` in the terminal when NO ghost event is active
- If a ghost event is active, `treat` will resolve the ghost event instead

**Ending Message:**
```
╔════════════════════════════════════════╗
║         KIROWEEN ENDING                ║
╚════════════════════════════════════════╝

🎃 TRICK OR TREAT! 🎃

You offered a treat to the spirits.
The ghosts are satisfied.
The curse lifts as Kiroween magic fills the air.

Happy Kiroween! You've earned your freedom
through kindness and candy.
```

---

### 4. Kiro Editor Ending
**Command:** `kiro`

**Description:**
Invoke Kiro, the AI-powered editor. Realize that the curse was just a feature request all along.

**Trigger Condition:**
- Type `kiro` in the terminal at any time

**Ending Message:**
```
╔════════════════════════════════════════╗
║        KIRO EDITOR ENDING              ║
╚════════════════════════════════════════╝

    ██╗  ██╗██╗██████╗  ██████╗ 
    ██║ ██╔╝██║██╔══██╗██╔═══██╗
    █████╔╝ ██║██████╔╝██║   ██║
    ██╔═██╗ ██║██╔══██╗██║   ██║
    ██║  ██╗██║██║  ██║╚██████╔╝
    ╚═╝  ╚═╝╚═╝╚═╝  ╚═╝ ╚═════╝ 

You invoked Kiro, the AI-powered editor.
The curse was just a feature request all along.

With Kiro's help, you've debugged reality itself.
The terminal is now your canvas.

Freedom through code. Escape through creation.
```

---

### 5. Engineer Ending
**Command:** `echo Hello, world!`

**Description:**
Type the classic first program. Return to the fundamentals of programming to break the curse.

**Trigger Condition:**
- Type `echo Hello, world!` exactly (case-sensitive, with comma and exclamation mark)
- Must unlock the required characters first: `h`, `e`, `l`, `o`, `,`, `w`, `r`, `d`, `!`, and space

**Ending Message:**
```
Hello, world!

╔════════════════════════════════════════╗
║         ENGINEER ENDING                ║
╚════════════════════════════════════════╝

The first program. The eternal greeting.
You've returned to the beginning.

In every curse, there's a printf.
In every trap, there's a loop.
And in every loop, there's a way out.

You've remembered what it means to code.
The curse cannot hold an engineer who knows
the fundamentals.

Freedom through "Hello, world!"
```

**Note:** This ending requires unlocking many characters through Morse code input, making it more challenging than other endings.

---

### 6. True Ending ⭐
**Command:** `save kiro`

**Description:**
The best ending. Discover that the curse wasn't meant to trap you—it was meant to trap Kiro. Save Kiro to break the deepest layer of the curse.

**Trigger Condition:**
- Type `save kiro` in the terminal
- Must unlock the required characters first: `s`, `a`, `v`, `e`, `k`, `i`, `r`, `o`, and space

**Ending Message:**
```
╔════════════════════════════════════════╗
║           TRUE ENDING                  ║
╚════════════════════════════════════════╝

You typed "save kiro"...

The curse wasn't meant to trap you.
It was meant to trap Kiro.

By saving Kiro, you've broken the deepest layer
of the curse. The terminal was never your prison—
it was Kiro's.

You didn't just escape. You freed everyone.

The true hero's ending.
```

**Note:** This is considered the canonical "best" ending of the game.

---

## Ending Mechanics

### How Endings Are Triggered

1. Player types a specific command in the terminal
2. Command parser checks for ending conditions
3. If conditions are met, `END_GAME` action is dispatched
4. Game state updates with `currentEnding` and `gameComplete: true`
5. Terminal displays ending message
6. After 10-second countdown, ending screen modal appears
7. Player can view stats, submit score to leaderboard, or restart

### Character Requirements

Some endings require unlocking specific characters through Morse code:

- **No requirements:** `exit`, `sudo`, `kiro` (only uses starting characters)
- **Minimal requirements:** `treat` (requires `t`, `r`, `e`, `a`)
- **Moderate requirements:** `save kiro` (requires `s`, `a`, `v`, `e`, `k`, `i`, `r`, `o`)
- **High requirements:** `echo Hello, world!` (requires many characters including punctuation)

### Starting Characters

Players start with only two unlocked characters:
- `s`
- `o`

This allows typing commands like `sos`, `os`, `oss`, `sso`, `soso` to discover secrets and get hints.

---

## Quick Reference Table

| Ending | Command | Difficulty | Character Requirements |
|--------|---------|------------|------------------------|
| Normal | `exit` | ⭐ Easy | None (uses starting chars) |
| Kirosh Domination | `sudo` | ⭐ Easy | None (uses starting chars) |
| Kiroween | `treat` | ⭐⭐ Medium | Requires: t, r, e, a |
| Kiro Editor | `kiro` | ⭐ Easy | None (uses starting chars) |
| Engineer | `echo Hello, world!` | ⭐⭐⭐ Hard | Requires: h, e, l, o, comma, w, r, d, !, space |
| True ⭐ | `save kiro` | ⭐⭐ Medium | Requires: s, a, v, e, k, i, r, o, space |

---

## Tips for Players

1. **Start with `help`** - Type `help` to see all available commands and hints
2. **Use Morse code** - Unlock characters by inputting Morse sequences (dot/dash buttons)
3. **Try `sos` first** - With starting characters `s` and `o`, this is a good first command
4. **Experiment** - Multiple endings mean multiple ways to win
5. **Watch for ghosts** - Ghost events can lock your characters temporarily
6. **Use `heartbeat`** - Unlocks ALL characters at once (letters, numbers, symbols)
7. **Read terminal output** - Hints and clues are hidden in command responses

---

## Development Notes

### Implementation Location

All ending logic is implemented in:
- **Command Parser:** `amplify-nextjs-app/lib/game/commandParser.ts`
- **Game State:** `amplify-nextjs-app/lib/game/gameState.ts`
- **Type Definitions:** `amplify-nextjs-app/lib/game/types.ts`

### Ending Type Definition

```typescript
export type EndingType =
  | "normal"
  | "sudo"
  | "kiroween"
  | "kiro"
  | "engineer"
  | "true";
```

### Adding New Endings

To add a new ending:

1. Add the ending type to `EndingType` in `types.ts`
2. Create an execution function in `commandParser.ts`
3. Return `{ type: "END_GAME", ending: "your-ending" }` action
4. Add command to valid commands list
5. Update help text with new ending hint
