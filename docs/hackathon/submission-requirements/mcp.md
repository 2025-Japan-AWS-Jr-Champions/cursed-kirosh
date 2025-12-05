# MCP (Model Context Protocol) Usage

## Configured Servers

### AWS Documentation (`aws-docs`)

Purpose: Real-time access to current AWS documentation

Command: `uvx awslabs.aws-documentation-mcp-server@latest`

Tools: `search_documentation`, `read_documentation` (auto-approved)

Key Benefits:

- Eliminates outdated information from training data
- Automatic documentation lookup during development
- Accurate AWS service configurations and best practices

Example Use Case: When implementing Lambda functions, Kiro can search and retrieve the latest runtime versions, configuration options, and code examples directly from AWS docs instead of relying on potentially outdated training data.

Why It's Essential: AWS releases new features constantly. MCP ensures access to current information without context-switching to browser, maintaining flow state while guaranteeing accuracy.

---

### Next.js DevTools (`next-devtools`)

Purpose: Real-time access to Next.js official documentation and development tools

Command: `npx -y next-devtools-mcp@latest`

Tools:

- `init` - Initialize Next.js DevTools context and load documentation index
- `nextjs_docs` - Search and retrieve Next.js documentation (auto-approved)
- `nextjs_runtime` - Interact with running Next.js dev server via MCP endpoint
- `browser_eval` - Browser automation for testing Next.js pages
- `upgrade_nextjs_16` - Guide for upgrading to Next.js 16
- `enable_cache_components` - Setup and migrate to Cache Components mode

Key Benefits:

- Always-current Next.js documentation from official sources
- Documentation-first approach eliminates hallucinations
- Direct integration with Next.js 16+ dev server for runtime diagnostics
- Browser automation for verifying implementations
- Automated upgrade and migration workflows

Example Use Case: When asked about Next.js App Router features, the MCP server fetches the latest documentation directly from nextjs.org, ensuring 100% accuracy. The runtime tools can inspect a running dev server to diagnose errors, check routes, and view real-time logs without leaving the IDE.

Why It's Essential: Next.js evolves rapidly with frequent updates. This MCP server ensures:

1. Zero outdated information - always queries official docs
2. Runtime introspection - debug live applications via MCP endpoint
3. Automated workflows - upgrades and migrations with built-in codemods
4. Complete testing - browser automation verifies actual behavior

Workflow Integration: The `init` tool loads the complete Next.js documentation index (llms.txt), enabling direct documentation retrieval without search overhead. This dramatically speeds up development by providing instant access to accurate API references, guides, and examples.

---

### Fetch (`fetch`)

Purpose: Fetch and convert web pages to markdown format for documentation access

Command: `uvx mcp-server-fetch`

Tools:
- `fetch` - Fetch URL content and convert to markdown

Parameters:
- `url` (required) - URL to fetch
- `max_length` (optional) - Maximum characters to return (default: 5000)
- `start_index` (optional) - Starting character index for pagination (default: 0)
- `raw` (optional) - Get raw HTML instead of markdown (default: false)

Key Benefits:

- Access any web documentation in real-time
- Automatic HTML to markdown conversion for readability
- Pagination support for long documents
- No need to leave the development environment

Example Use Case: When working with AWS Amplify Gen2, Kiro can fetch documentation directly from https://docs.amplify.aws/nextjs/ to get the latest setup instructions, API references, and best practices without relying on potentially outdated training data.

Why It's Essential: Many frameworks and services have documentation that changes frequently. The fetch MCP server enables:

1. Always Current: Access the latest documentation from any website
2. No Context Switching: Read docs without opening a browser
3. Markdown Format: Clean, readable format for AI processing
4. Pagination: Handle long documents efficiently with start_index
5. Universal Access: Works with any public documentation site

Workflow Integration: Combined with other MCP servers, fetch enables comprehensive documentation access:
- AWS docs via dedicated aws-docs MCP (optimized)
- Next.js docs via next-devtools MCP (with runtime integration)
- Amplify, Tailwind, or any other framework via fetch MCP (universal fallback)

Usage Pattern:
```typescript
// Fetch Amplify documentation
fetch("https://docs.amplify.aws/nextjs/start/quickstart/", max_length: 15000)

// Continue reading if truncated
fetch("https://docs.amplify.aws/nextjs/start/quickstart/", start_index: 15000, max_length: 15000)
```

Best Practices:
1. Use dedicated MCP servers (aws-docs, next-devtools) when available for better integration
2. Use fetch MCP for frameworks without dedicated servers
3. Start with reasonable max_length (5000-15000) to avoid truncation
4. Use pagination (start_index) for long documents
5. Prefer markdown mode (default) over raw HTML for better readability

---

### Playwright Browser Automation (`playwright`)

Purpose: Automated browser testing and web interaction capabilities

Command: `npx @playwright/mcp@latest`

Tools:

- `browser_navigate` - Navigate to URLs
- `browser_snapshot` - Capture accessibility snapshot of page structure
- `browser_click` - Click elements on the page
- `browser_type` - Type text into form fields
- `browser_fill_form` - Fill multiple form fields at once
- `browser_take_screenshot` - Capture visual screenshots
- `browser_console_messages` - Retrieve browser console logs
- `browser_evaluate` - Execute JavaScript in browser context
- `browser_close` - Close browser instance
- `browser_wait_for` - Wait for elements or conditions
- `browser_tabs` - Manage multiple browser tabs
- `browser_network_requests` - Monitor network activity

Key Benefits:

- Real browser automation without writing test scripts
- Accessibility-first page inspection via YAML snapshots
- Visual verification through screenshots
- Console error detection for debugging
- Form interaction and testing capabilities
- Network monitoring for API debugging

Example Use Case: When developing a web application, Kiro can automatically navigate to pages, interact with forms, capture screenshots for verification, and check console errors - all without leaving the conversation. This enables rapid testing and debugging cycles.

Why It's Essential: Traditional testing requires context switching between IDE, browser, and test frameworks. Playwright MCP enables:

1. Instant browser automation - test features as you build them
2. Visual verification - screenshots confirm UI changes
3. Accessibility inspection - YAML snapshots reveal page structure
4. Error detection - console messages catch runtime issues
5. Interactive debugging - click, type, and navigate programmatically

Workflow Integration: Combined with Next.js DevTools, Playwright enables end-to-end verification: start the dev server with `nextjs_runtime`, navigate to pages with `browser_navigate`, verify rendering with `browser_snapshot`, and catch errors with `browser_console_messages` - all within a single AI-assisted workflow.

---

### Serena Code Intelligence (`serena`)

Purpose: Semantic code analysis and intelligent editing for multiple programming languages

Command: `uvx --from git+https://github.com/oraios/serena serena start-mcp-server`

Supported Languages: Python, JavaScript/TypeScript, Java, C#, Rust, Go, Ruby, C++, PHP, Swift, Elixir, Terraform, Bash

Core Tools:

Code Reading & Analysis:
- `read_file` - Read file content with optional line ranges
- `get_symbols_overview` - Get high-level overview of symbols in a file
- `find_symbol` - Find symbols by name path with hierarchy support
- `find_referencing_symbols` - Find all references to a symbol
- `search_for_pattern` - Flexible regex-based code search

Code Editing:
- `replace_symbol_body` - Replace entire symbol definitions
- `insert_after_symbol` - Insert code after a symbol
- `insert_before_symbol` - Insert code before a symbol
- `replace_regex` - Regex-based replacements for precise edits
- `rename_symbol` - Rename symbols across entire codebase

Project Management:
- `activate_project` - Initialize Serena for a project
- `list_dir` - List directory contents
- `find_file` - Find files by pattern
- `create_text_file` - Create new files
- `execute_shell_command` - Run shell commands

Memory System:
- `write_memory` - Store project knowledge
- `read_memory` - Retrieve stored knowledge
- `list_memories` - List available memories
- `edit_memory` - Update memory content
- `delete_memory` - Remove memories

Key Benefits:

- Semantic Understanding: Works with code symbols (classes, functions, methods) rather than raw text
- Language-Agnostic: Single interface for multiple programming languages
- Precise Editing: Symbol-level operations prevent accidental changes
- Cross-File Intelligence: Track references and dependencies across files
- Memory System: Persist project knowledge between sessions
- Efficient Reading: Read only necessary code, not entire files

Example Use Case: When refactoring a Python class, Serena can:
1. Find the class definition with `find_symbol`
2. Discover all methods with depth parameter
3. Find all references across the codebase with `find_referencing_symbols`
4. Replace method bodies with `replace_symbol_body`
5. Rename the class with `rename_symbol` (updates all references automatically)

Why It's Essential: Traditional text-based editing is error-prone and inefficient. Serena provides:

1. Symbol-Level Precision: Edit functions/classes without regex complexity
2. Intelligent Search: Find code by semantic meaning, not just text patterns
3. Safe Refactoring: Automatic reference tracking prevents breaking changes
4. Multi-Language Support: Consistent interface across 13+ languages
5. Project Memory: Store architectural decisions and patterns for future reference

Workflow Integration:

Serena excels at large-scale refactoring and codebase exploration:

- Before Implementation: Use `get_symbols_overview` to understand file structure
- During Development: Use `find_symbol` with depth to explore class hierarchies
- For Refactoring: Use `find_referencing_symbols` to ensure safe changes
- Cross-File Changes: Use `rename_symbol` for codebase-wide updates
- Knowledge Retention: Use memory system to document patterns and decisions

Comparison with Traditional Tools:

| Task | Traditional Approach | Serena Approach |
|------|---------------------|-----------------|
| Find a method | Grep + manual inspection | `find_symbol` with name path |
| Rename a class | Find/replace (risky) | `rename_symbol` (safe, automatic) |
| Understand file | Read entire file | `get_symbols_overview` (summary) |
| Edit function | Regex or manual | `replace_symbol_body` (precise) |
| Track references | Manual search | `find_referencing_symbols` (automatic) |

Best Practices:

1. Start with Overview: Always call `get_symbols_overview` before editing unfamiliar files
2. Use Symbol Tools First: Prefer symbol-level operations over regex when possible
3. Verify References: Check `find_referencing_symbols` before major changes
4. Leverage Memory: Document architectural patterns for consistent development
5. Efficient Reading: Use depth parameter to control how much code to retrieve

---

## How MCP Enabled Cursed Kirosh

### Project Impact Summary

MCP servers were not just helpful—they were mission-critical for completing this project within the hackathon timeline. Without MCP integration, Cursed Kirosh would not have been competition-ready.

Quantified Impact:
- Development velocity: 1.5-2x faster than traditional workflows
- Time saved on testing: ~25% of total development time (several hours)
- Zero broken commits: Automated verification caught issues before they reached git
- Accuracy improvement: Precise symbol-level editing reduced refactoring errors

Most Valuable Server: Playwright (by far) - 50-100+ automated browser verifications during development.

---

### 1. Playwright: The Game-Changer

Usage: 50-100+ automated browser tests throughout hackathon

What It Enabled:

Playwright MCP transformed our development workflow from "write → manually test → fix → manually test again" to "write → Kiro automatically verifies → move forward." This wasn't just a convenience—it was the difference between finishing and not finishing within the hackathon deadline.

Concrete Examples of Critical Bug Catches:

1. Morse Input Auto-Complete Bug: Early implementation had `autoCompleteDelay` set too short (200ms). Users couldn't input multi-signal sequences (like "O" = `---`) because the first dash would auto-complete before they could enter the second. Playwright console monitoring caught JavaScript timing errors that weren't visible in manual testing.

2. Console Error Detection: Throughout development, Playwright's `browser_console_messages` caught dozens of React hydration mismatches, missing dependencies in useEffect hooks, and type errors that only manifested at runtime.

3. Layout Verification: Screenshots and accessibility snapshots confirmed that the cursed typography animations didn't break layout, ghost event overlays displayed correctly, and the terminal remained responsive during audio playback.

Why Manual Testing Would Have Failed:

Manual testing requires:
- Opening browser
- Navigating to localhost
- Opening DevTools
- Checking console
- Interacting with UI
- Switching back to IDE

This 2-3 minute cycle per change would have added several hours to development time (estimated 25% of total development time). Worse, manual testing is inconsistent—you might forget to check console errors, miss edge cases, or test on outdated code.

The Agent Hook Integration:

Our `verify-lint-format-on-save.kiro.hook` integrated Playwright into the save workflow:

```json
{
  "then": {
    "type": "askAgent",
    "prompt": "1. Verify app works using Playwright MCP\n2. Take snapshot\n3. Check console errors\n4. If working, run Biome linting..."
  }
}
```

Result: Every file save triggered automated browser verification. If the app broke, Kiro wouldn't proceed to linting—forcing immediate fixes. This created a zero-broken-commits policy that maintained momentum throughout the hackathon.

Without Playwright MCP: We estimate the project would have taken 1.5-2x longer and shipped with significantly more bugs. The Morse input timing issue alone would have been nearly impossible to debug manually, as it only manifested under specific interaction patterns.

---

### 2. Fetch MCP: AWS Amplify Gen2 Accuracy

Usage: Several documentation fetches for Amplify Gen2 setup and configuration

What It Enabled:

Amplify Gen2 launched in 2024 with a complete API rewrite. Kiro's training data includes Gen1 patterns that are incompatible with Gen2. Without fetch MCP, Kiro would have confidently generated broken code.

Specific Impact:

- Public API Authorization: Fetch MCP provided the correct Gen2 syntax for public leaderboard access:
  ```typescript
  .authorization((allow) => [allow.publicApiKey().to(["read", "create"])])
  ```
  Training data would suggest Gen1's `@auth` directive, which doesn't work in Gen2.

- No Context Switching: Instead of opening browser → searching docs → copying examples → pasting to chat, Kiro fetched docs directly during conversation. This maintained flow state and reduced cognitive load.

Alternative Without MCP:

We could have used `curl` to fetch documentation manually, but that still requires:
1. Finding the correct URL
2. Running curl
3. Copying output
4. Pasting into chat
5. Formatting for readability

Fetch MCP eliminated steps 2-5, making documentation lookup feel instantaneous.

Why It Mattered for Hackathon:

Time pressure meant we couldn't afford to debug Gen1 vs Gen2 confusion. Fetch MCP ensured first-try accuracy for backend implementation, allowing us to focus on game mechanics and UI polish.

---

### 3. Next.js DevTools: Correct Project Structure

Usage: Early project setup and App Router guidance

What It Enabled:

Next.js 16 introduced significant changes to the App Router and Server Components. DevTools MCP ensured we followed current best practices from the start.

Specific Impact:

- Directory Structure: Proper `app/` router layout with `page.tsx`, `layout.tsx`, and `loading.tsx` conventions
- Server Component Patterns: Correct use of `"use client"` directives only where needed (e.g., `Terminal.tsx`, `MorseInput.tsx`)
- Metadata API: Proper implementation of Next.js 16's metadata system

Why Manual Documentation Would Have Been Slower:

Next.js docs are comprehensive but scattered across multiple pages. DevTools MCP's `nextjs_docs` tool provided targeted answers without sifting through unrelated content.

Note: We didn't use `nextjs_runtime` for debugging, but the documentation lookup alone saved significant time during initial setup.

---

### 4. Serena: Precise Refactoring

Usage: Symbol-level editing with `replace_symbol_body` and memory system

What It Enabled:

Traditional text-based editing is error-prone when modifying functions across multiple files. Serena's semantic understanding prevented breaking changes during refactoring.

Specific Impact:

- Symbol-Level Precision: When refactoring game state reducers, `replace_symbol_body` ensured we edited complete function bodies without accidentally modifying adjacent code
- Memory System: Documented architectural decisions (e.g., "Why we chose React Reducer over Context API for game state") for consistent future development
- Increased Confidence: While the improvement was subtle, Serena provided higher accuracy compared to regex-based edits

Comparison:

| Task | Traditional Approach | Serena Approach |
|------|---------------------|-----------------|
| Edit reducer action handler | Find/replace or manual edit | `replace_symbol_body` with exact scope |
| Document design decision | README or code comments | Memory system with structured notes |
| Refactor function name | Risky find/replace | `rename_symbol` (safe, automatic) |

Why It Mattered:

During a hackathon, small bugs from imprecise edits compound quickly. Serena's precision meant fewer "wait, why did this break?" moments, maintaining forward momentum.

---

### 5. AWS Docs MCP: (Not Used in This Project)

We configured `aws-docs` MCP but primarily used `fetch` for Amplify-specific documentation. AWS Docs MCP would be more valuable for projects with deeper AWS service integration (Lambda, S3, DynamoDB direct access, etc.).

---

## What Would Have Been Impossible Without MCP

### 1. Hackathon Timeline Completion

Reality: Project completed with polished UI/UX, 6 endings, adaptive hints, and zero critical bugs.

Without MCP: Based on our estimates, development would have taken 1.5-2x longer. This means:
- Either incomplete features (e.g., only 3 endings, no ghost events)
- Or significantly more bugs in the final submission
- Or missing the submission deadline entirely

The Math:
- Total development time: ~20-30 hours
- Time saved by MCP: ~10-15 hours (from automation + accuracy)
- Without MCP: ~35-45 hours required

Conclusion: MCP was the difference between shipping a complete game and submitting a prototype.

---

### 2. Zero Broken Commits

Reality: Every commit to the repository worked correctly—no "fix: broken terminal input" or "fix: console errors" commits cluttering history.

How: Playwright MCP + Agent Hooks caught errors before they reached git.

Without MCP: Manual testing would have missed edge cases. We'd have spent hours debugging issues that automated testing prevented entirely.

---

### 3. Flow State Maintenance

Reality: Development felt continuous—Kiro handled verification, documentation lookup, and testing autonomously.

Without MCP: Constant context switching (IDE → browser → docs → IDE → DevTools) would have fragmented focus and slowed decision-making.

Impact: MCP didn't just save time—it preserved the creative momentum critical for hackathon success. When you're designing audio-driven Morse code mechanics or debating six ending conditions, interruptions kill innovation.

---

## Strategic MCP Integration

### Why We Chose These Five Servers

1. Playwright: Non-negotiable for automated UI verification
2. Fetch: Required for Amplify Gen2 accuracy (rapidly evolving framework)
3. Next.js DevTools: Insurance against App Router mistakes
4. Serena: Safety net for refactoring under time pressure
5. AWS Docs: Future-proofing (not heavily used this time)

### The Synergy Effect

MCP servers didn't work in isolation—they formed an integrated development ecosystem:

1. Fetch provides correct Amplify Gen2 syntax
2. Next.js DevTools ensures proper project structure
3. Serena enables safe refactoring as complexity grows
4. Playwright verifies everything works in real browsers
5. Agent Hooks orchestrate the entire workflow automatically

Result: Kiro transformed from a code generator into a full-stack development partner with documentation access, semantic code understanding, and automated QA capabilities.

---

## Key Takeaway

MCP didn't just make development faster—it made ambitious hackathon projects feasible.

Without MCP:
- ❌ Manual testing would consume 25% of development time
- ❌ Amplify Gen2 confusion would cause hours of debugging
- ❌ Broken commits would disrupt team collaboration
- ❌ Context switching would kill creative momentum

With MCP:
- ✅ Automated verification caught bugs before commits
- ✅ Documentation-first development ensured accuracy
- ✅ Flow state maintained throughout hackathon
- ✅ Complete, polished game delivered on deadline

The bottom line: MCP was the force multiplier that made Cursed Kirosh possible within the Kiroween Hackathon timeline. It exemplifies how extending AI capabilities through Model Context Protocol creates development workflows that are not just more efficient, but fundamentally more ambitious.
