# Implementation Plan

- [ ] 1. Set up project structure and core utilities
  - Create directory structure for game components, hooks, and utilities
  - Set up TypeScript types for game state and interfaces
  - Create Morse code dictionary mapping
  - _Requirements: 1.1, 2.1_

- [ ] 2. Implement Morse code system
- [ ] 2.1 Create Morse code dictionary and validation logic
  - Implement complete A-Z and 0-9 Morse code mappings
  - Create validation function for Morse sequences
  - Create character unlock logic based on Morse input
  - _Requirements: 2.4, 2.5_

- [ ] 2.2 Build MorseInput component
  - Create dot/dash input buttons with visual feedback
  - Display current Morse sequence being entered
  - Implement sequence completion detection
  - _Requirements: 2.1, 2.6_

- [ ] 2.3 Integrate audio playback for Morse input
  - Load heartbeat.mp3 and scream.mp3 audio files
  - Play heartbeat sound on dot input
  - Play scream sound on dash input
  - _Requirements: 2.2, 2.3_

- [ ] 3. Build game state management
- [ ] 3.1 Create game state reducer and context
  - Define GameState interface with all required fields
  - Implement useReducer with all game actions
  - Create GameContext provider
  - Initialize with 's' and 'o' unlocked
  - _Requirements: 1.2, 10.1_

- [ ] 3.2 Implement character lock/unlock system
  - Create functions to lock and unlock characters
  - Update Virtual Keyboard display on state changes
  - Handle "heartbeat" command for unlock all
  - _Requirements: 2.5, 6.2_

- [ ] 3.3 Create timer and game progress tracking
  - Implement game timer from start to completion
  - Track completed commands and discovered secrets
  - Store game start and end times
  - _Requirements: 7.1_

- [ ] 4. Build terminal interface components
- [ ] 4.1 Create Terminal component structure
  - Set up main terminal container with Halloween styling
  - Implement cursor blinking animation
  - Create terminal prompt display
  - _Requirements: 1.1, 5.3_

- [ ] 4.2 Build CommandPrompt component
  - Implement text input with character filtering
  - Only allow unlocked characters to be typed
  - Display visual feedback for locked characters
  - Implement command history (up/down arrows)
  - _Requirements: 1.2, 1.4_

- [ ] 4.3 Create OutputDisplay component
  - Render terminal output history
  - Support different line types (command, output, error, system)
  - Implement auto-scroll to bottom
  - Apply color coding based on line type
  - _Requirements: 1.5_

- [ ] 4.4 Implement curse effect animation
  - Add CSS animation for character jitter
  - Apply effect to typed characters after 2-second delay
  - Make characters move erratically
  - _Requirements: 5.2_

- [ ] 5. Build Virtual Keyboard component
- [ ] 5.1 Create keyboard layout and structure
  - Implement QWERTY keyboard layout
  - Display all alphabetic characters and common symbols
  - Apply Halloween color scheme (orange/purple)
  - _Requirements: 1.3_

- [ ] 5.2 Implement lock/unlock visual states
  - Show locked characters in dark gray
  - Show unlocked characters in orange
  - Add "crack" animation when character unlocks
  - Update display based on game state
  - _Requirements: 1.3, 2.5_

- [ ] 6. Implement command parser and execution
- [ ] 6.1 Create command parser core
  - Parse command strings into command and arguments
  - Implement command validation
  - Handle unknown commands with helpful messages
  - _Requirements: 3.5, 8.2_

- [ ] 6.2 Implement basic commands (ls, cd, echo)
  - Create "ls" command to list files
  - Create "cd" command for directory navigation
  - Create "echo" command to display text
  - _Requirements: 3.1, 3.2, 3.3_

- [ ] 6.3 Implement special commands (SOS, OS, OSS, SSO, SOSO)
  - Create "SOS" command with rescue event
  - Create "OS" command with boot sequence
  - Create "OSS" command with Morse-encoded projects
  - Create "SSO" command for game over
  - Create "SOSO" command with encouragement
  - _Requirements: 6.1, 6.3, 6.4, 6.5, 6.6_

- [ ] 6.4 Implement "heartbeat" unlock all command
  - Detect "heartbeat" command
  - Unlock all alphabetic characters
  - Display confirmation message
  - _Requirements: 6.2_

- [ ] 6.5 Implement "light" command
  - Toggle interface brightness
  - Apply lighter color scheme
  - Maintain readability
  - _Requirements: 5.5_

- [ ] 7. Implement game endings
- [ ] 7.1 Create ending detection logic
  - Detect "exit" command for Normal Ending
  - Detect "sudo" command for Kirosh Domination Ending
  - Detect "treat" command for Kiroween Ending
  - Detect "kiro" command for Kiro Editor Ending
  - Detect "echo Hello, world!" for Engineer Ending
  - Detect "save kiro" command for True Ending
  - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

- [ ] 7.2 Build EndingScreen component
  - Create unique visual for each ending type
  - Display completion time
  - Show ending-specific message and artwork
  - Provide restart and leaderboard buttons
  - _Requirements: 4.7_

- [ ] 8. Implement ghost "trick or treat" mechanic
- [ ] 8.1 Create GhostEvent component
  - Display ghost.png image with animation
  - Show "trick or treat" prompt
  - Implement countdown timer
  - Add ©DESIGNALIKIE attribution
  - _Requirements: 9.1_

- [ ] 8.2 Implement ghost event triggering
  - Trigger ghost appearance at random intervals
  - Provide visual warning before appearance
  - Track ghost event count
  - _Requirements: 9.4_

- [ ] 8.3 Handle treat/trick responses
  - Detect "treat" command during ghost event
  - Maintain unlocked characters on successful treat
  - Re-lock characters on failed treat (timeout)
  - Update game state accordingly
  - _Requirements: 9.2, 9.3, 9.5_

- [ ] 9. Implement audio system
- [ ] 9.1 Create AudioManager component
  - Set up Web Audio API context
  - Load and cache audio files
  - Provide audio control interface
  - _Requirements: 2.2, 2.3_

- [ ] 9.2 Implement ambient heartbeat loop
  - Play heartbeat sound at regular intervals
  - Control volume and timing
  - Allow enable/disable toggle
  - _Requirements: 5.1_

- [ ] 9.3 Add audio attribution
  - Display "Sound effects by OtoLogic" in footer
  - Link to https://otologic.jp/free/license.html
  - Include in credits section
  - _Requirements: 5.4_

- [ ] 10. Implement hint system
- [ ] 10.1 Create contextual hint logic
  - Determine appropriate hints based on game progress
  - Track player inactivity
  - Display hints after inactivity timeout
  - _Requirements: 8.1, 8.4_

- [ ] 10.2 Implement help command
  - Display available commands
  - Show Morse code input instructions
  - Provide gameplay tips
  - _Requirements: 8.2_

- [ ] 10.3 Add visual cues for Morse input
  - Highlight Morse input area
  - Show example Morse sequences
  - Provide feedback on progress
  - _Requirements: 8.3, 8.5_

- [ ] 11. Set up Amplify backend for leaderboard
- [ ] 11.1 Configure Amplify Data model
  - Define LeaderboardEntry schema
  - Set up public read, authenticated create permissions
  - Deploy data model
  - _Requirements: 7.2_

- [ ] 11.2 Implement leaderboard submission
  - Prompt for player name on game completion
  - Submit score with completion time and ending type
  - Handle network errors gracefully
  - Store pending submissions locally if offline
  - _Requirements: 7.2, 7.3_

- [ ] 11.3 Create leaderboard display page
  - Fetch and display top scores
  - Sort by completion time (ascending)
  - Show player name, time, and ending type
  - Implement loading and error states
  - _Requirements: 7.4_

- [ ] 12. Implement local storage and persistence
- [ ] 12.1 Create localStorage utilities
  - Save game preferences (audio, hints)
  - Store best time and games played
  - Track discovered endings
  - _Requirements: 7.5_

- [ ] 12.2 Implement game state persistence
  - Save current game state on progress
  - Allow resume from saved state
  - Clear saved state on game completion
  - _Requirements: 7.5_

- [ ] 13. Create landing and layout pages
- [ ] 13.1 Build landing page
  - Create welcome screen with game introduction
  - Add "Start Game" button
  - Display game instructions
  - Show attribution credits
  - _Requirements: 1.1_

- [ ] 13.2 Create game layout
  - Set up side-by-side terminal and keyboard layout
  - Apply Halloween color scheme (purple/orange)
  - Add footer with attributions
  - Ensure desktop-optimized design (1024px+)
  - _Requirements: 1.1, 5.3, 5.5_

- [ ] 14. Polish and visual effects
- [ ] 14.1 Implement all animations
  - Cursor blink animation
  - Character unlock crack effect
  - Curse effect jitter
  - Ghost appearance fade-in
  - Ending screen transitions
  - _Requirements: 5.2, 5.3_

- [ ] 14.2 Apply Halloween theming
  - Implement purple and orange color scheme
  - Add glow effects for text
  - Create atmospheric dark background
  - Ensure consistent styling across all components
  - _Requirements: 5.3, 5.5_

- [ ] 14.3 Add sound effect polish
  - Fine-tune audio timing
  - Implement volume controls
  - Add audio enable/disable toggle
  - Test audio playback across browsers
  - _Requirements: 5.1, 5.3_

- [ ] 15. Testing and bug fixes
- [ ] 15.1 Test all game endings
  - Verify each ending triggers correctly
  - Test ending screen displays
  - Verify completion time tracking
  - _Requirements: 4.1-4.7_

- [ ] 15.2 Test Morse code system
  - Verify all character mappings work
  - Test invalid sequence handling
  - Verify character unlock functionality
  - _Requirements: 2.1-2.6_

- [ ] 15.3 Test ghost event mechanic
  - Verify ghost appearance timing
  - Test treat/trick responses
  - Verify character re-locking on trick
  - _Requirements: 9.1-9.5_

- [ ] 15.4 Test leaderboard functionality
  - Verify score submission
  - Test leaderboard display
  - Test offline behavior
  - _Requirements: 7.1-7.5_

- [ ] 15.5 Cross-browser testing
  - Test in Chrome, Firefox, Safari, Edge
  - Verify audio playback compatibility
  - Test visual rendering consistency
  - Fix any browser-specific issues
  - _Requirements: All_

- [ ] 16. Documentation and deployment
- [ ] 16.1 Create README documentation
  - Document game mechanics
  - List all commands and secrets
  - Provide setup instructions
  - Include attribution information
  - _Requirements: All_

- [ ] 16.2 Deploy to Amplify Hosting
  - Configure build settings
  - Set up environment variables
  - Deploy production build
  - Verify deployment functionality
  - _Requirements: All_
