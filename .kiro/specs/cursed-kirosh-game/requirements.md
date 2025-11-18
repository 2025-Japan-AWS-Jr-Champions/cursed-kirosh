# Requirements Document

## Introduction

Cursed Kirosh is an interactive web-based terminal game that combines Halloween themes with Morse code puzzle mechanics. Players find themselves trapped in a cursed terminal where most keyboard characters are locked. By decoding Morse code signals (represented by heartbeat and scream sounds), players unlock characters to type commands and discover multiple story endings. The game features atmospheric audio, visual effects, and a time-attack leaderboard system.

## Glossary

- **Terminal Interface**: The main game UI simulating a command-line interface where players type commands
- **Virtual Keyboard**: An on-screen keyboard display showing which characters are locked/unlocked
- **Morse Input System**: The mechanism for players to input Morse code via clicks (dot/dash)
- **Character Lock**: The state where a keyboard character cannot be typed normally
- **Character Unlock**: The process of making a locked character available for typing
- **Ending Condition**: A specific command or action that triggers a game conclusion
- **Audio Cue**: Sound effects (heartbeat/scream) that play during Morse input
- **Curse Effect**: Visual animation where typed characters become unstable
- **Leaderboard System**: Time-based ranking of players who complete the game
- **Command Parser**: The system that interprets and executes player commands
- **Game State**: The current status of unlocked characters, time elapsed, and progress

## Requirements

### Requirement 1

**User Story:** As a player, I want to see a terminal interface with limited keyboard input, so that I understand I'm trapped and need to solve puzzles to escape

#### Acceptance Criteria

1. WHEN the game loads, THE Terminal Interface SHALL display a welcome message indicating the curse
2. WHEN the player attempts to type, THE Terminal Interface SHALL only accept characters that are currently unlocked
3. THE Terminal Interface SHALL display a Virtual Keyboard showing locked characters as visually distinct from unlocked characters
4. WHEN a locked character key is pressed, THE Terminal Interface SHALL provide visual feedback indicating the character is unavailable
5. THE Terminal Interface SHALL maintain a command history visible to the player

### Requirement 2

**User Story:** As a player, I want to input Morse code through clicks, so that I can unlock new characters to type commands

#### Acceptance Criteria

1. THE Morse Input System SHALL provide a clickable interface for entering dots and dashes
2. WHEN the player clicks the dot button, THE Morse Input System SHALL play the heartbeat audio file
3. WHEN the player clicks the dash button, THE Morse Input System SHALL play the scream audio file
4. WHEN a valid Morse code sequence is completed, THE Morse Input System SHALL unlock the corresponding character
5. WHEN a character is unlocked, THE Virtual Keyboard SHALL update to show the character as available
6. THE Morse Input System SHALL display the current Morse sequence being entered

### Requirement 3

**User Story:** As a player, I want to execute commands in the terminal, so that I can progress through the game and discover endings

#### Acceptance Criteria

1. THE Command Parser SHALL recognize and execute the "ls" command to list available files
2. THE Command Parser SHALL recognize and execute the "cd" command to change directories
3. THE Command Parser SHALL recognize and execute the "echo" command to display text
4. THE Command Parser SHALL recognize file execution commands using "./" prefix
5. THE Command Parser SHALL provide appropriate feedback for unrecognized commands
6. THE Command Parser SHALL track which commands have been executed for game state management

### Requirement 4

**User Story:** As a player, I want to discover multiple endings based on my actions, so that the game has replay value and rewards exploration

#### Acceptance Criteria

1. WHEN the player types "exit", THE Game State SHALL trigger the Normal Ending
2. WHEN the player types "sudo", THE Game State SHALL trigger the Kirosh Domination Ending
3. WHEN the player types "treat", THE Game State SHALL trigger the Kiroween Ending
4. WHEN the player types "kiro", THE Game State SHALL trigger the Kiro Editor Ending with appropriate visual representation
5. WHEN the player types "echo Hello, world!", THE Game State SHALL trigger the Engineer Ending
6. WHEN the player types "save kiro", THE Game State SHALL trigger the True Ending
7. WHEN an Ending Condition is met, THE Terminal Interface SHALL display the corresponding ending message and prevent further input

### Requirement 5

**User Story:** As a player, I want atmospheric audio and visual effects, so that the game feels immersive and Halloween-themed

#### Acceptance Criteria

1. THE Terminal Interface SHALL play ambient heartbeat sounds at regular intervals
2. THE Curse Effect SHALL cause typed characters to animate and move erratically after a delay
3. WHEN Morse code is input, THE Audio Cue SHALL play the appropriate sound (heartbeat for dot, scream for dash)
4. THE Terminal Interface SHALL display appropriate credit attribution for audio files from OtoLogic
5. THE Terminal Interface SHALL support a "light" command that brightens the interface
6. THE Terminal Interface SHALL maintain a dark, atmospheric color scheme by default

### Requirement 6

**User Story:** As a player, I want special commands and secrets, so that I can discover hidden features and shortcuts

#### Acceptance Criteria

1. WHEN the player types "SOS", THE Command Parser SHALL trigger a rescue event with special messaging
2. WHEN the player types "heartbeat", THE Game State SHALL unlock all alphabetic characters immediately
3. WHEN the player types "OS", THE Command Parser SHALL trigger a system boot sequence
4. WHEN the player types "OSS", THE Command Parser SHALL display Morse-encoded famous open source projects
5. WHEN the player types "SSO", THE Game State SHALL trigger a game over condition
6. WHEN the player types "SOSO", THE Command Parser SHALL display an encouraging message

### Requirement 7

**User Story:** As a player, I want to compete on a leaderboard, so that I can compare my escape time with others

#### Acceptance Criteria

1. THE Leaderboard System SHALL track the time elapsed from game start to completion
2. WHEN a player completes the game, THE Leaderboard System SHALL prompt for a player name
3. THE Leaderboard System SHALL store completion times with player names
4. THE Leaderboard System SHALL display the top completion times in ascending order
5. THE Leaderboard System SHALL persist leaderboard data across browser sessions

### Requirement 8

**User Story:** As a player, I want hints about what to do next, so that I don't get completely stuck

#### Acceptance Criteria

1. THE Terminal Interface SHALL provide contextual hints based on current game progress
2. WHEN the player types "help", THE Command Parser SHALL display available commands and hints
3. THE Terminal Interface SHALL display subtle visual cues indicating the Morse input mechanism
4. WHEN the player has been inactive for a specified duration, THE Terminal Interface SHALL display a hint message
5. THE Terminal Interface SHALL provide feedback when the player is close to discovering a secret

### Requirement 9

**User Story:** As a player, I want the "trick or treat" mechanic, so that the game has dynamic challenge elements

#### Acceptance Criteria

1. THE Terminal Interface SHALL periodically display a ghost character asking "trick or treat"
2. WHEN the ghost appears and the player types "treat", THE Game State SHALL maintain current unlocked characters
3. WHEN the ghost appears and the player fails to type "treat" within a time limit, THE Curse Effect SHALL re-lock previously unlocked characters
4. THE Terminal Interface SHALL provide visual warning when a ghost is about to appear
5. THE Game State SHALL track the number of successful "treat" responses

### Requirement 10

**User Story:** As a player, I want initial characters unlocked, so that I can start playing without being completely blocked

#### Acceptance Criteria

1. WHEN the game starts, THE Game State SHALL have the characters 's' and 'o' unlocked by default
2. THE Virtual Keyboard SHALL clearly indicate which characters are initially available
3. THE Terminal Interface SHALL display a message explaining the initial unlocked characters
4. THE Game State SHALL allow players to type "sos" using the starting characters (s, o, s)
5. THE Morse Input System SHALL be accessible from the start to unlock additional characters
