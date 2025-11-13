---
inclusion: always
---

---

## inclusion: always

# MCP-First Development

## Core Principle

**Always prioritize MCP tools over training data.** MCP servers provide real-time, authoritative information that supersedes cached knowledge. Query documentation and runtime state before implementing or answering questions.

## Available MCP Servers

### aws-docs

AWS service documentation and API references.

**Primary tools:**

- `mcp_aws_docs_search_documentation` - Find relevant AWS documentation
- `mcp_aws_docs_read_documentation` - Read full documentation pages

**Use for:** Lambda, S3, DynamoDB, IAM, CloudFormation, EC2, RDS, API Gateway, and all AWS services.

### next-devtools

Next.js documentation and live runtime inspection.

**Primary tools:**

- `mcp_next_devtools_init` - Initialize and fetch latest Next.js docs
- `mcp_next_devtools_nextjs_docs` - Search and retrieve official documentation
- `mcp_next_devtools_nextjs_runtime` - Query running dev server state
- `mcp_next_devtools_browser_eval` - Browser automation for Next.js apps

**Use for:** App Router, Server Components, routing, caching, data fetching, middleware, configuration.

### playwright

Browser automation for testing and verification.

**Primary tools:**

- `mcp_playwright_browser_navigate` - Navigate to URLs
- `mcp_playwright_browser_snapshot` - Capture accessibility tree (better than screenshots)
- `mcp_playwright_browser_click` - Interact with elements
- `mcp_playwright_browser_type` - Fill forms
- `mcp_playwright_browser_console_messages` - Check for errors
- `mcp_playwright_browser_take_screenshot` - Visual verification
- `mcp_playwright_browser_evaluate` - Execute JavaScript

**Use for:** UI verification, form testing, console error detection, visual regression, accessibility inspection.

### serena

Semantic code analysis and symbol-level editing.

**Primary tools:**

- `mcp_serena_activate_project` - Initialize project (required first)
- `mcp_serena_get_symbols_overview` - High-level file structure
- `mcp_serena_find_symbol` - Locate symbols by name path
- `mcp_serena_find_referencing_symbols` - Find all references
- `mcp_serena_replace_symbol_body` - Safe symbol replacement
- `mcp_serena_rename_symbol` - Rename across codebase
- `mcp_serena_insert_after_symbol` / `mcp_serena_insert_before_symbol` - Precise insertion
- `mcp_serena_write_memory` / `mcp_serena_read_memory` - Project knowledge persistence

**Use for:** Refactoring, symbol-level editing, cross-file changes, codebase exploration, architectural understanding.

## Workflow Patterns

### AWS Implementation

1. Search docs: `mcp_aws_docs_search_documentation` with service + feature keywords
2. Read details: `mcp_aws_docs_read_documentation` for specific pages
3. Implement using verified patterns from documentation
4. **Never** answer AWS questions from training data alone

### Next.js Development

1. Initialize: `mcp_next_devtools_init` at session start
2. Query docs: `mcp_next_devtools_nextjs_docs` for patterns and APIs
3. Debug runtime: `mcp_next_devtools_nextjs_runtime` to inspect live state
4. Verify in browser: `mcp_next_devtools_browser_eval` for UI testing
5. **Always** verify current conventions before implementing

### Browser Testing Workflow

1. Navigate: `mcp_playwright_browser_navigate` to target page
2. Inspect: `mcp_playwright_browser_snapshot` for structure (preferred over screenshots)
3. Verify: `mcp_playwright_browser_console_messages` for errors
4. Document: `mcp_playwright_browser_take_screenshot` for visual records
5. **Automate** verification instead of asking users to manually test

### Code Refactoring Workflow

1. Activate: `mcp_serena_activate_project` with project path (required)
2. Explore: `mcp_serena_get_symbols_overview` to understand structure
3. Locate: `mcp_serena_find_symbol` with name paths (e.g., "ClassName/methodName")
4. Assess impact: `mcp_serena_find_referencing_symbols` before changes
5. Edit: `mcp_serena_replace_symbol_body` or `mcp_serena_rename_symbol`
6. Persist: `mcp_serena_write_memory` for architectural decisions
7. **Prefer** symbol-level tools over regex or full-file reads

## Anti-Patterns to Avoid

**Documentation queries:**

- ❌ Answering from memory with "typically", "usually", "based on my knowledge"
- ❌ Implementing without verifying current documentation
- ✅ Always query MCP docs first, then implement

**Testing and verification:**

- ❌ Asking users to manually test pages
- ❌ Debugging without runtime inspection
- ✅ Automate with Playwright, inspect with runtime tools

**Code editing:**

- ❌ Using regex when Serena symbol tools are available
- ❌ Reading entire files when `get_symbols_overview` suffices
- ❌ Refactoring without checking `find_referencing_symbols`
- ❌ Manual cross-file changes instead of `rename_symbol`
- ✅ Use semantic tools for safe, intelligent edits

## Decision Tree

**When user asks about AWS/Next.js:**
→ Query relevant MCP docs → Implement from verified patterns

**When debugging Next.js:**
→ Check runtime state → Inspect browser console → Fix based on actual errors

**When refactoring code:**
→ Activate Serena → Get overview → Find symbols → Check references → Edit safely

**When verifying UI:**
→ Navigate with Playwright → Snapshot structure → Check console → Screenshot if needed
