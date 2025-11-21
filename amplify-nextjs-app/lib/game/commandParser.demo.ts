/**
 * Command parser demo - run with: npx tsx lib/game/commandParser.demo.ts
 */

import { parseCommand, executeCommand } from './commandParser';
import { createInitialGameState } from './gameState';

console.log('=== Cursed Kirosh Command Parser Demo ===\n');

const gameState = createInitialGameState();

// Demo commands
const commands = [
  'help',
  'ls',
  'echo Hello, Cursed Terminal!',
  'cd secrets',
  'sos',
  'heartbeat',
  'light',
  'invalid_command',
];

for (const cmd of commands) {
  console.log(`\n$ ${cmd}`);
  console.log('─'.repeat(50));
  
  const parsed = parseCommand(cmd);
  const result = executeCommand(parsed, gameState);
  
  console.log(`Status: ${result.success ? '✓ Success' : '✗ Failed'}`);
  console.log(`Type: ${result.type}`);
  
  if (result.actions && result.actions.length > 0) {
    console.log(`Actions: ${result.actions.length} action(s)`);
    console.log(`  - ${result.actions[0].type}`);
  }
  
  console.log('\nOutput:');
  console.log(result.output);
}

console.log('\n\n=== Demo Complete ===');
