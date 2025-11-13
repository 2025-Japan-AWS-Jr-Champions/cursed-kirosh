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

### Fetch (`fetch`)

**Purpose**: Fetch and convert web pages to markdown format for documentation access

**Command**: `uvx mcp-server-fetch`

**Tools**:
- `fetch` - Fetch URL content and convert to markdown

**Parameters**:
- `url` (required) - URL to fetch
- `max_length` (optional) - Maximum characters to return (default: 5000)
- `start_index` (optional) - Starting character index for pagination (default: 0)
- `raw` (optional) - Get raw HTML instead of markdown (default: false)

**Key Benefits**:

- Access any web documentation in real-time
- Automatic HTML to markdown conversion for readability
- Pagination support for long documents
- No need to leave the development environment

**Example Use Case**: When working with AWS Amplify Gen2, Kiro can fetch documentation directly from https://docs.amplify.aws/nextjs/ to get the latest setup instructions, API references, and best practices without relying on potentially outdated training data.

**Why It's Essential**: Many frameworks and services have documentation that changes frequently. The fetch MCP server enables:

1. **Always Current**: Access the latest documentation from any website
2. **No Context Switching**: Read docs without opening a browser
3. **Markdown Format**: Clean, readable format for AI processing
4. **Pagination**: Handle long documents efficiently with start_index
5. **Universal Access**: Works with any public documentation site

**Workflow Integration**: Combined with other MCP servers, fetch enables comprehensive documentation access:
- AWS docs via dedicated aws-docs MCP (optimized)
- Next.js docs via next-devtools MCP (with runtime integration)
- Amplify, Tailwind, or any other framework via fetch MCP (universal fallback)

**Usage Pattern**:
```typescript
// Fetch Amplify documentation
fetch("https://docs.amplify.aws/nextjs/start/quickstart/", max_length: 15000)

// Continue reading if truncated
fetch("https://docs.amplify.aws/nextjs/start/quickstart/", start_index: 15000, max_length: 15000)
```

**Best Practices**:
1. Use dedicated MCP servers (aws-docs, next-devtools) when available for better integration
2. Use fetch MCP for frameworks without dedicated servers
3. Start with reasonable max_length (5000-15000) to avoid truncation
4. Use pagination (start_index) for long documents
5. Prefer markdown mode (default) over raw HTML for better readability

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

---

### Serena Code Intelligence (`serena`)

**Purpose**: Semantic code analysis and intelligent editing for multiple programming languages

**Command**: `uvx --from git+https://github.com/oraios/serena serena start-mcp-server`

**Supported Languages**: Python, JavaScript/TypeScript, Java, C#, Rust, Go, Ruby, C++, PHP, Swift, Elixir, Terraform, Bash

**Core Tools**:

**Code Reading & Analysis**:
- `read_file` - Read file content with optional line ranges
- `get_symbols_overview` - Get high-level overview of symbols in a file
- `find_symbol` - Find symbols by name path with hierarchy support
- `find_referencing_symbols` - Find all references to a symbol
- `search_for_pattern` - Flexible regex-based code search

**Code Editing**:
- `replace_symbol_body` - Replace entire symbol definitions
- `insert_after_symbol` - Insert code after a symbol
- `insert_before_symbol` - Insert code before a symbol
- `replace_regex` - Regex-based replacements for precise edits
- `rename_symbol` - Rename symbols across entire codebase

**Project Management**:
- `activate_project` - Initialize Serena for a project
- `list_dir` - List directory contents
- `find_file` - Find files by pattern
- `create_text_file` - Create new files
- `execute_shell_command` - Run shell commands

**Memory System**:
- `write_memory` - Store project knowledge
- `read_memory` - Retrieve stored knowledge
- `list_memories` - List available memories
- `edit_memory` - Update memory content
- `delete_memory` - Remove memories

**Key Benefits**:

- **Semantic Understanding**: Works with code symbols (classes, functions, methods) rather than raw text
- **Language-Agnostic**: Single interface for multiple programming languages
- **Precise Editing**: Symbol-level operations prevent accidental changes
- **Cross-File Intelligence**: Track references and dependencies across files
- **Memory System**: Persist project knowledge between sessions
- **Efficient Reading**: Read only necessary code, not entire files

**Example Use Case**: When refactoring a Python class, Serena can:
1. Find the class definition with `find_symbol`
2. Discover all methods with depth parameter
3. Find all references across the codebase with `find_referencing_symbols`
4. Replace method bodies with `replace_symbol_body`
5. Rename the class with `rename_symbol` (updates all references automatically)

**Why It's Essential**: Traditional text-based editing is error-prone and inefficient. Serena provides:

1. **Symbol-Level Precision**: Edit functions/classes without regex complexity
2. **Intelligent Search**: Find code by semantic meaning, not just text patterns
3. **Safe Refactoring**: Automatic reference tracking prevents breaking changes
4. **Multi-Language Support**: Consistent interface across 13+ languages
5. **Project Memory**: Store architectural decisions and patterns for future reference

**Workflow Integration**: 

Serena excels at large-scale refactoring and codebase exploration:

- **Before Implementation**: Use `get_symbols_overview` to understand file structure
- **During Development**: Use `find_symbol` with depth to explore class hierarchies
- **For Refactoring**: Use `find_referencing_symbols` to ensure safe changes
- **Cross-File Changes**: Use `rename_symbol` for codebase-wide updates
- **Knowledge Retention**: Use memory system to document patterns and decisions

**Comparison with Traditional Tools**:

| Task | Traditional Approach | Serena Approach |
|------|---------------------|-----------------|
| Find a method | Grep + manual inspection | `find_symbol` with name path |
| Rename a class | Find/replace (risky) | `rename_symbol` (safe, automatic) |
| Understand file | Read entire file | `get_symbols_overview` (summary) |
| Edit function | Regex or manual | `replace_symbol_body` (precise) |
| Track references | Manual search | `find_referencing_symbols` (automatic) |

**Best Practices**:

1. **Start with Overview**: Always call `get_symbols_overview` before editing unfamiliar files
2. **Use Symbol Tools First**: Prefer symbol-level operations over regex when possible
3. **Verify References**: Check `find_referencing_symbols` before major changes
4. **Leverage Memory**: Document architectural patterns for consistent development
5. **Efficient Reading**: Use depth parameter to control how much code to retrieve
