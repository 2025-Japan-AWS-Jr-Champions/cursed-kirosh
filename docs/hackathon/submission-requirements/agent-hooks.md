## Agent Hooks: Automated Workflows

### What Specific Workflows We Automated

#### Automated Quality Assurance Hook

Hook Name: `verify-lint-format-on-save.kiro.hook` Trigger: File edited (`.ts`, `.tsx`, `.js`, `.jsx` in `amplify-nextjs-app/`) Automated Workflow Steps:

1. Browser Verification (Playwright MCP integration)
   * Navigate to `http://localhost:3000`
   * Capture snapshot to verify page loads correctly
   * Check console for runtime errors
2. Linting (if app verification passes)
   * Run Biome linter on modified files
   * Review linting errors automatically
   * Iterate fixes until all errors resolved
3. Formatting (after clean lint)
   * Run Biome formatter on files
   * Confirm process completion

Configuration:

```json
{
  "when": {
    "type": "fileEdited",
    "patterns": ["amplify-nextjs-app//*.ts", "amplify-nextjs-app//*.tsx"]
  },
  "then": {
    "type": "askAgent",
    "prompt": "1. Verify app at localhost:3000 using Playwright..."
  }
}
```

---

### How Hooks Improved Our Development Process

#### 1. Eliminated Manual QA Steps

Before Hooks:

* Save file → Manually switch to browser → Refresh → Check console → Run linter manually → Fix errors → Run formatter manually
* Time per save: ~2-3 minutes

With Hooks:

* Save file → Hook automatically verifies, lints, and formats
* Time per save: ~30 seconds (automated in background)

Result: 4-6x faster iteration cycles

---

#### 2. Prevented Broken Deployments

Scenario: During UI refinement via Vibe Mode, we made ~50 edits in a single session. Without Hooks: Could accidentally commit broken code if manual testing skipped. With Hooks: Every single edit was automatically:

* ✅ Browser-tested for runtime errors
* ✅ Linted for code quality issues
* ✅ Formatted for consistency

Result: Zero broken commits throughout the hackathon.

---

#### 3. Maintained Code Quality During Rapid Vibe Coding

Challenge: Natural language prompts → Kiro generates code → Need to verify quality Hook Solution:

* Playwright integration caught visual regressions (e.g., CSS breaking layout)
* Biome linter caught TypeScript errors Kiro missed (rare but happened 2-3 times)
* Auto-formatting kept codebase consistent despite multiple Kiro code generations

Example Catch:

```
Kiro generated: const foo = bar?.baz
Biome linter: "Unsafe optional chaining - `bar` could be null"
Hook: Automatically flagged → Kiro fixed → Added null check
```

---

#### 4. Reduced Context Switching

Developer Flow:

* Stay in conversation with Kiro (Vibe Mode)
* Hook runs verification in background
* Only interrupted if errors found (with specific error messages)

Psychological Benefit: Maintained creative flow during UI/UX iteration without breaking focus for QA tasks.

---

#### 5. Integrated Best Practices Automatically

Hook enforced:

* Test-driven mindset: Browser verification before linting (user experience first)
* Code quality gates: No formatting until lint passes (logical dependency)
* Incremental validation: Small, verified changes instead of big-bang testing

Learning: By automating the workflow, the hook taught us the *correct order* of QA steps.

---

### Key Metrics

| Metric | Without Hooks | With Hooks | Improvement |
| ----- | ----- | ----- | ----- |
| Manual QA time per edit | 2-3 min | 0 min (automated) | 100% reduction |
| Broken commits | ~5 (estimated) | 0 | 100% prevention |
| Lint errors shipped | ~10 (estimated) | 0 | 100% catch rate |
| Context switches per hour | ~20 | ~2 | 90% reduction |

---

### What We'd Improve

Current Limitation: Hook runs on *every* file save, even for minor doc changes. Ideal Enhancement: Conditional triggers:

```json
{
  "when": {
    "type": "fileEdited",
    "patterns": ["/*.tsx"],
    "condition": "modifiedLines > 10" // Only run for significant changes
  }
}
```

Why It Matters: Small typo fixes don't need full browser verification—selective automation would be even more efficient.
