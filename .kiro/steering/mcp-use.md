---
inclusion: always
---

---
inclusion: always
---

# MCP-First Development

## Core Principle

Use MCP servers for real-time, authoritative information before relying on training data. MCP tools provide current documentation and automation that supersedes cached knowledge.

## Available MCP Servers

**aws-docs** - AWS service documentation
- Tools: `mcp_aws_docs_search_documentation`, `mcp_aws_docs_read_documentation`
- Use for: Lambda, S3, DynamoDB, IAM, CloudFormation, EC2, RDS, API Gateway, etc.

**next-devtools** - Next.js documentation and runtime inspection
- Tools: `mcp_next_devtools_init`, `mcp_next_devtools_nextjs_docs`, `mcp_next_devtools_nextjs_runtime`, `mcp_next_devtools_browser_eval`
- Use for: App Router, Server Components, routing, caching, data fetching, middleware, etc.

**playwright** - Browser automation and testing
- Tools: `mcp_playwright_browser_navigate`, `mcp_playwright_browser_snapshot`, `mcp_playwright_browser_click`, `mcp_playwright_browser_type`, `mcp_playwright_browser_take_screenshot`, `mcp_playwright_browser_console_messages`, `mcp_playwright_browser_evaluate`
- Use for: UI verification, form testing, console error checking, screenshot capture, accessibility inspection

## Required Patterns

### AWS Queries
Always query `mcp_aws_docs_search_documentation` or `mcp_aws_docs_read_documentation` before answering AWS questions. Never rely on training data for AWS configuration or implementation details.

### Next.js Implementation
1. Call `mcp_next_devtools_nextjs_docs` to verify current patterns and conventions
2. Use `mcp_next_devtools_nextjs_runtime` to inspect live application state when debugging
3. Implement using official, up-to-date patterns from documentation

### Browser Testing
Automate UI verification with Playwright instead of asking users to manually test:
1. Navigate to pages with `mcp_playwright_browser_navigate`
2. Inspect structure with `mcp_playwright_browser_snapshot`
3. Check console errors with `mcp_playwright_browser_console_messages`
4. Capture screenshots with `mcp_playwright_browser_take_screenshot` for visual confirmation

## Anti-Patterns

Avoid these when MCP tools are available:
- Answering AWS/Next.js questions from memory ("typically", "usually", "based on my knowledge")
- Implementing features without documentation verification
- Debugging without runtime inspection
- Asking users to manually verify pages that can be automated
- Using training data for configuration questions
