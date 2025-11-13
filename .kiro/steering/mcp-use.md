---
inclusion: always
---

---

## inclusion: always

# MCP-First Development Pattern

## Core Rule

ALWAYS check if an MCP server can provide information before using training data. MCP servers deliver real-time, authoritative documentation that supersedes any cached knowledge.

## Decision Priority

For every request:

1. Identify if AWS or Next.js is involved
2. Use corresponding MCP tool to fetch current information
3. Implement based on MCP-provided data

## Available MCP Servers

### aws-docs

Use for: AWS service questions, configuration, implementation details
Tools: `mcp_aws_docs_search_documentation`, `mcp_aws_docs_read_documentation`
Triggers: Lambda, S3, DynamoDB, IAM, CloudFormation, EC2, RDS, API Gateway, etc.

### next-devtools

Use for: Next.js questions, features, debugging, runtime inspection
Tools: `mcp_next_devtools_init`, `mcp_next_devtools_nextjs_docs`, `mcp_next_devtools_nextjs_runtime`, `mcp_next_devtools_browser_eval`
Triggers: App Router, Server Components, routing, caching, data fetching, middleware, etc.

## Mandatory MCP Patterns

### AWS Questions

NEVER answer AWS questions from memory. ALWAYS use `mcp_aws_docs_search_documentation` or `mcp_aws_docs_read_documentation` first.

Example: "What Lambda runtimes are available?"

- Call `mcp_aws_docs_search_documentation` with query "Lambda runtimes"
- Read relevant documentation
- Provide answer citing AWS docs

### Next.js Implementation

NEVER implement Next.js features without consulting docs. ALWAYS use `mcp_next_devtools_nextjs_docs` first.

Example: "Add a loading state"

- Call `mcp_next_devtools_nextjs_docs` to check loading.js convention
- Optionally call `mcp_next_devtools_nextjs_runtime` to inspect current structure
- Implement using official patterns

### Next.js Debugging

When investigating Next.js issues, ALWAYS use `mcp_next_devtools_nextjs_runtime` to inspect live state before making changes.

## Anti-Patterns to Avoid

- Phrases like "based on my knowledge", "typically", "usually" for AWS/Next.js topics
- Implementing without documentation verification
- Answering configuration questions from training data
- Debugging without runtime inspection when available

## Self-Check

Before responding to AWS or Next.js questions, ask:

- Did I query the MCP server?
- Am I using current documentation?
- Is my answer based on real-time data?

If any answer is "no", use MCP tools first.
