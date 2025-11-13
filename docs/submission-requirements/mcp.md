# MCP (Model Context Protocol) Usage

## Configured Servers

### AWS Documentation (`aws-docs`)

**Purpose**: Real-time access to current AWS documentation

**Command**: `uvx awslabs.aws-documentation-mcp-server@latest`

**Tools**: `search_documentation`, `read_documentation` (auto-approved)

**Key Benefits**:

- Eliminates outdated information from training data
- Automatic documentation lookup during development
- Accurate AWS service configurations and best practices

**Example Use Case**: When implementing Lambda functions, Kiro can search and retrieve the latest runtime versions, configuration options, and code examples directly from AWS docs instead of relying on potentially outdated training data.

**Why It's Essential**: AWS releases new features constantly. MCP ensures access to current information without context-switching to browser, maintaining flow state while guaranteeing accuracy.

---

### Next.js DevTools (`next-devtools`)

**Purpose**: Real-time access to Next.js official documentation and development tools

**Command**: `npx -y next-devtools-mcp@latest`

**Tools**:

- `init` - Initialize Next.js DevTools context and load documentation index
- `nextjs_docs` - Search and retrieve Next.js documentation (auto-approved)
- `nextjs_runtime` - Interact with running Next.js dev server via MCP endpoint
- `browser_eval` - Browser automation for testing Next.js pages
- `upgrade_nextjs_16` - Guide for upgrading to Next.js 16
- `enable_cache_components` - Setup and migrate to Cache Components mode

**Key Benefits**:

- Always-current Next.js documentation from official sources
- Documentation-first approach eliminates hallucinations
- Direct integration with Next.js 16+ dev server for runtime diagnostics
- Browser automation for verifying implementations
- Automated upgrade and migration workflows

**Example Use Case**: When asked about Next.js App Router features, the MCP server fetches the latest documentation directly from nextjs.org, ensuring 100% accuracy. The runtime tools can inspect a running dev server to diagnose errors, check routes, and view real-time logs without leaving the IDE.

**Why It's Essential**: Next.js evolves rapidly with frequent updates. This MCP server ensures:

1. Zero outdated information - always queries official docs
2. Runtime introspection - debug live applications via MCP endpoint
3. Automated workflows - upgrades and migrations with built-in codemods
4. Complete testing - browser automation verifies actual behavior

**Workflow Integration**: The `init` tool loads the complete Next.js documentation index (llms.txt), enabling direct documentation retrieval without search overhead. This dramatically speeds up development by providing instant access to accurate API references, guides, and examples.

---

### Playwright Browser Automation (`playwright`)

**Purpose**: Automated browser testing and web interaction capabilities

**Command**: `npx @playwright/mcp@latest`

**Tools**:

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

**Key Benefits**:

- Real browser automation without writing test scripts
- Accessibility-first page inspection via YAML snapshots
- Visual verification through screenshots
- Console error detection for debugging
- Form interaction and testing capabilities
- Network monitoring for API debugging

**Example Use Case**: When developing a web application, Kiro can automatically navigate to pages, interact with forms, capture screenshots for verification, and check console errors - all without leaving the conversation. This enables rapid testing and debugging cycles.

**Why It's Essential**: Traditional testing requires context switching between IDE, browser, and test frameworks. Playwright MCP enables:

1. Instant browser automation - test features as you build them
2. Visual verification - screenshots confirm UI changes
3. Accessibility inspection - YAML snapshots reveal page structure
4. Error detection - console messages catch runtime issues
5. Interactive debugging - click, type, and navigate programmatically

**Workflow Integration**: Combined with Next.js DevTools, Playwright enables end-to-end verification: start the dev server with `nextjs_runtime`, navigate to pages with `browser_navigate`, verify rendering with `browser_snapshot`, and catch errors with `browser_console_messages` - all within a single AI-assisted workflow.
