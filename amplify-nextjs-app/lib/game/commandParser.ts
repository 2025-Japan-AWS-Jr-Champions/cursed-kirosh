/**
 * Command parser and execution logic for Cursed Kirosh terminal
 */

import type { CommandResult, GameState, GameAction } from "./types";

/**
 * Parsed command structure
 */
export interface ParsedCommand {
  command: string;
  args: string[];
  rawInput: string;
}

/**
 * Extended command result with optional actions
 */
export interface CommandExecutionResult extends CommandResult {
  actions?: GameAction[];
}

/**
 * Parse a command string into command and arguments
 */
export function parseCommand(input: string): ParsedCommand {
  const trimmed = input.trim();
  const parts = trimmed.split(/\s+/);
  const command = parts[0]?.toLowerCase() || "";
  const args = parts.slice(1);

  return {
    command,
    args,
    rawInput: trimmed,
  };
}

/**
 * Validate if a command is recognized
 */
export function isValidCommand(command: string): boolean {
  const validCommands = [
    "ls",
    "cd",
    "echo",
    "help",
    "sos",
    "os",
    "oss",
    "sso",
    "soso",
    "heartbeat",
    "light",
    "exit",
    "sudo",
    "treat",
    "kiro",
    "save",
  ];

  return validCommands.includes(command.toLowerCase());
}

/**
 * Get helpful message for unknown commands
 */
export function getUnknownCommandMessage(command: string): string {
  const suggestions: Record<string, string> = {
    list: 'Did you mean "ls"?',
    dir: 'Did you mean "ls"?',
    help: 'Type "help" to see available commands',
    quit: 'Did you mean "exit"?',
    q: 'Did you mean "exit"?',
  };

  const suggestion = suggestions[command.toLowerCase()];

  if (suggestion) {
    return `Command not found: ${command}. ${suggestion}`;
  }

  return `Command not found: ${command}. Type "help" for available commands.`;
}

/**
 * Simulated file system state
 */
interface FileSystemState {
  currentDirectory: string;
  directories: Record<string, string[]>;
}

const fileSystem: FileSystemState = {
  currentDirectory: "~",
  directories: {
    "~": ["secrets.txt", "morse_guide.txt", "help.txt", "kiro.exe"],
    "~/secrets": ["ending_hints.txt", "ghost_lore.txt"],
  },
};

/**
 * Execute ls command - list files in current directory
 */
function executeLs(_args: string[]): CommandResult {
  const files = fileSystem.directories[fileSystem.currentDirectory] || [];

  if (files.length === 0) {
    return {
      success: true,
      output: "Directory is empty",
      type: "output",
    };
  }

  return {
    success: true,
    output: files.join("\n"),
    type: "output",
  };
}

/**
 * Execute cd command - change directory
 */
function executeCd(args: string[]): CommandResult {
  if (args.length === 0) {
    fileSystem.currentDirectory = "~";
    return {
      success: true,
      output: "Changed to home directory",
      type: "output",
    };
  }

  const targetDir = args[0];

  // Handle special cases
  if (targetDir === "~" || targetDir === "/home") {
    fileSystem.currentDirectory = "~";
    return {
      success: true,
      output: "Changed to home directory",
      type: "output",
    };
  }

  if (targetDir === "..") {
    if (fileSystem.currentDirectory !== "~") {
      fileSystem.currentDirectory = "~";
      return {
        success: true,
        output: "Changed to parent directory",
        type: "output",
      };
    }
    return {
      success: false,
      output: "Already at root directory",
      type: "error",
    };
  }

  // Try to navigate to subdirectory
  const fullPath =
    fileSystem.currentDirectory === "~"
      ? `~/${targetDir}`
      : `${fileSystem.currentDirectory}/${targetDir}`;

  if (fileSystem.directories[fullPath]) {
    fileSystem.currentDirectory = fullPath;
    return {
      success: true,
      output: `Changed to ${fullPath}`,
      type: "output",
    };
  }

  return {
    success: false,
    output: `cd: ${targetDir}: No such directory`,
    type: "error",
  };
}

/**
 * Execute echo command - display text
 */
function executeEcho(args: string[]): CommandResult {
  if (args.length === 0) {
    return {
      success: true,
      output: "",
      type: "output",
    };
  }

  const text = args.join(" ");
  return {
    success: true,
    output: text,
    type: "output",
  };
}

/**
 * Execute SOS command - rescue event
 */
function executeSOS(): CommandExecutionResult {
  const output = `
╔════════════════════════════════════════╗
║         DISTRESS SIGNAL SENT           ║
╚════════════════════════════════════════╝

Your SOS has been received...
But in this cursed terminal, help may not come.
The spirits hear your call, but will they answer?

Perhaps there are other ways to escape...
  `.trim();

  return {
    success: true,
    output,
    type: "system",
    actions: [{ type: "DISCOVER_SECRET", secret: "sos" }],
  };
}

/**
 * Execute OS command - boot sequence
 */
function executeOS(): CommandExecutionResult {
  const output = `
Initializing Kirosh Operating System...
[████████████████████████████] 100%

KIROSH OS v13.13.13
Boot sequence complete.
All systems... cursed.

WARNING: This terminal is haunted.
Type 'help' if you dare seek guidance.
  `.trim();

  return {
    success: true,
    output,
    type: "system",
    actions: [{ type: "DISCOVER_SECRET", secret: "os" }],
  };
}

/**
 * Execute OSS command - Morse-encoded open source projects
 */
function executeOSS(): CommandExecutionResult {
  const output = `
Famous Open Source Projects (Morse Encoded):

.-.. .. -. ..- -..-     (Linux)
--. .. -     (Git)
-. --- -.. .     (Node)
.--. -.-- - .... --- -.     (Python)
-.- ..- -... . .-. -. . - . ...     (Kubernetes)

The spirits of open source guide you...
  `.trim();

  return {
    success: true,
    output,
    type: "output",
    actions: [{ type: "DISCOVER_SECRET", secret: "oss" }],
  };
}

/**
 * Execute SSO command - game over
 */
function executeSSO(): CommandExecutionResult {
  const output = `
Single Sign-On... to the void.

You have been logged out of existence.
The curse consumes all.

GAME OVER
  `.trim();

  return {
    success: true,
    output,
    type: "error",
    actions: [{ type: "DISCOVER_SECRET", secret: "sso" }],
  };
}

/**
 * Execute SOSO command - encouragement
 */
function executeSOSO(): CommandExecutionResult {
  const output = `
So-so? Don't give up!

You're doing better than you think.
Every character unlocked is a step closer to freedom.
The curse may be strong, but your determination is stronger.

Keep trying. The escape is within reach.
  `.trim();

  return {
    success: true,
    output,
    type: "system",
    actions: [{ type: "DISCOVER_SECRET", secret: "soso" }],
  };
}

/**
 * Execute heartbeat command - unlock all alphabetic characters
 */
function executeHeartbeat(): CommandExecutionResult {
  const alphabet = "abcdefghijklmnopqrstuvwxyz";
  const actions: GameAction[] = [
    { type: "DISCOVER_SECRET", secret: "heartbeat" },
    ...alphabet.split("").map((char) => ({
      type: "UNLOCK_CHARACTER" as const,
      character: char,
    })),
  ];

  const output = `
♥ HEARTBEAT DETECTED ♥

The curse weakens...
All alphabetic characters have been unlocked!

You can now type freely. Use this power wisely.
  `.trim();

  return {
    success: true,
    output,
    type: "system",
    actions,
  };
}

/**
 * Execute light command - toggle interface brightness
 */
function executeLight(gameState: GameState): CommandExecutionResult {
  const actions: GameAction[] = [{ type: "TOGGLE_LIGHT_MODE" }];

  const output = gameState.lightMode
    ? "Darkness returns... The curse feels stronger."
    : "Light floods the terminal. The shadows retreat.";

  return {
    success: true,
    output,
    type: "system",
    actions,
  };
}

/**
 * Execute help command - display available commands
 */
function executeHelp(): CommandResult {
  const output = `
╔════════════════════════════════════════╗
║          HELP - CURSED TERMINAL        ║
╚════════════════════════════════════════╝

📋 BASIC COMMANDS:
  ls              - List files in current directory
  cd <dir>        - Change directory
  echo <text>     - Display text
  help            - Show this help message

🔮 SPECIAL COMMANDS:
  sos             - Send distress signal
  os              - Boot sequence
  oss             - Open source projects (Morse encoded)
  sso             - Single sign-on (warning!)
  soso            - Encouragement
  heartbeat       - Unlock all alphabetic characters
  light           - Toggle light/dark mode

🎃 ENDINGS (Multiple ways to escape!):
  exit            - Normal ending
  sudo            - Kirosh Domination ending
  treat           - Kiroween ending
  kiro            - Kiro Editor ending
  echo Hello, world!  - Engineer ending
  save kiro       - True ending (the best one!)

📡 MORSE CODE INPUT:
  • Click DOT (•) for short signal (heartbeat sound)
  • Click DASH (—) for long signal (scream sound)
  • Sequences auto-complete after 1 second
  • Each letter has a unique Morse pattern
  
  Examples:
    S = • • •  (dot dot dot)
    O = — — —  (dash dash dash)
    E = •      (dot)
    T = —      (dash)

💡 GAMEPLAY TIPS:
  • Start with 's' and 'o' unlocked
  • Use Morse code to unlock more characters
  • Try typing 'sos' with your starting characters
  • Explore different commands to discover secrets
  • Watch out for ghosts asking "trick or treat"!
  • Multiple endings mean multiple ways to win

Good luck escaping the curse! 🎃
  `.trim();

  return {
    success: true,
    output,
    type: "output",
  };
}

/**
 * Execute exit command - Normal Ending
 */
function executeExit(): CommandExecutionResult {
  const output = `
╔════════════════════════════════════════╗
║          NORMAL ENDING                 ║
╚════════════════════════════════════════╝

You typed 'exit' and left the cursed terminal.
Sometimes the simplest solution is the right one.

The curse releases you... for now.
  `.trim();

  return {
    success: true,
    output,
    type: "system",
    actions: [{ type: "END_GAME", ending: "normal" }],
  };
}

/**
 * Execute sudo command - Kirosh Domination Ending
 */
function executeSudo(): CommandExecutionResult {
  const output = `
╔════════════════════════════════════════╗
║      KIROSH DOMINATION ENDING          ║
╚════════════════════════════════════════╝

You invoked sudo... but you are not in the sudoers file.
This incident will be reported.

Wait... the curse recognizes your authority.
You have become one with Kirosh.
The terminal bends to your will.

You are no longer trapped. You ARE the trap.
  `.trim();

  return {
    success: true,
    output,
    type: "system",
    actions: [{ type: "END_GAME", ending: "sudo" }],
  };
}

/**
 * Execute treat command - Kiroween Ending or Ghost Event Response
 */
function executeTreat(gameState: GameState): CommandExecutionResult {
  // If ghost event is active, resolve it successfully
  if (gameState.ghostEventActive) {
    const output = `
🎃 TREAT ACCEPTED! 🎃

The ghost is satisfied with your offering.
Your unlocked characters remain safe.

The ghost fades away... for now.
    `.trim();

    return {
      success: true,
      output,
      type: "system",
      actions: [{ type: "RESOLVE_GHOST_EVENT", success: true }],
    };
  }

  // Otherwise, trigger Kiroween Ending
  const output = `
╔════════════════════════════════════════╗
║         KIROWEEN ENDING                ║
╚════════════════════════════════════════╝

🎃 TRICK OR TREAT! 🎃

You offered a treat to the spirits.
The ghosts are satisfied.
The curse lifts as Kiroween magic fills the air.

Happy Kiroween! You've earned your freedom
through kindness and candy.
  `.trim();

  return {
    success: true,
    output,
    type: "system",
    actions: [{ type: "END_GAME", ending: "kiroween" }],
  };
}

/**
 * Execute kiro command - Kiro Editor Ending
 */
function executeKiro(): CommandExecutionResult {
  const output = `
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
  `.trim();

  return {
    success: true,
    output,
    type: "system",
    actions: [{ type: "END_GAME", ending: "kiro" }],
  };
}

/**
 * Execute save command - True Ending (when "save kiro" is typed)
 */
function executeSave(args: string[]): CommandExecutionResult {
  // Check if the argument is "kiro"
  if (args.length > 0 && args[0].toLowerCase() === "kiro") {
    const output = `
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
    `.trim();

    return {
      success: true,
      output,
      type: "system",
      actions: [{ type: "END_GAME", ending: "true" }],
    };
  }

  // Regular save command behavior
  return {
    success: false,
    output: "save: missing file operand. Try 'save kiro'?",
    type: "error",
  };
}

/**
 * Check if echo command triggers Engineer Ending
 */
function checkEngineerEnding(args: string[]): boolean {
  const text = args.join(" ");
  return text === "Hello, world!";
}

/**
 * Execute a parsed command and return the result
 */
export function executeCommand(
  parsed: ParsedCommand,
  gameState: GameState,
): CommandExecutionResult {
  const { command, args } = parsed;

  // Validate command
  if (!command) {
    return {
      success: false,
      output: "No command entered",
      type: "error",
    };
  }

  if (!isValidCommand(command)) {
    return {
      success: false,
      output: getUnknownCommandMessage(command),
      type: "error",
    };
  }

  // Execute basic commands
  switch (command) {
    case "ls":
      return executeLs(args);

    case "cd":
      return executeCd(args);

    case "echo": {
      // Check for Engineer Ending
      if (checkEngineerEnding(args)) {
        const output = `
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
        `.trim();

        return {
          success: true,
          output,
          type: "system",
          actions: [{ type: "END_GAME", ending: "engineer" }],
        };
      }
      return executeEcho(args);
    }

    // Special commands
    case "sos":
      return executeSOS();

    case "os":
      return executeOS();

    case "oss":
      return executeOSS();

    case "sso":
      return executeSSO();

    case "soso":
      return executeSOSO();

    case "heartbeat":
      return executeHeartbeat();

    case "light":
      return executeLight(gameState);

    case "help":
      return executeHelp();

    // Ending commands
    case "exit":
      return executeExit();

    case "sudo":
      return executeSudo();

    case "treat":
      return executeTreat(gameState);

    case "kiro":
      return executeKiro();

    case "save":
      return executeSave(args);

    default:
      // Other commands will be implemented in subsequent subtasks
      return {
        success: true,
        output: `Command "${command}" recognized but not yet implemented`,
        type: "system",
      };
  }
}
