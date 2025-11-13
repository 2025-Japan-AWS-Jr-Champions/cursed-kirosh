# MCP (Model Context Protocol) Usage

## Configured Servers

### AWS Documentation (`aws-docs`)

**Purpose**: Real-time access to current AWS documentation

**Tools**: `search_documentation`, `read_documentation` (auto-approved)

**Key Benefits**:

- Eliminates outdated information from training data
- Automatic documentation lookup during development
- Accurate AWS service configurations and best practices

**Example Use Case**: When implementing Lambda functions, Kiro can search and retrieve the latest runtime versions, configuration options, and code examples directly from AWS docs instead of relying on potentially outdated training data.

**Why It's Essential**: AWS releases new features constantly. MCP ensures access to current information without context-switching to browser, maintaining flow state while guaranteeing accuracy.
