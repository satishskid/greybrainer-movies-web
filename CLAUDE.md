# INVIOLABLE GREYBRAINER SYSTEM LAWS
ALL AGENTS WORKING ON THIS CODEBASE MUST COMPLY WITH:
`SYSTEM_LAWS_AND_INVARIANTS.md`

1. **CANONICAL DOMAIN**: Storefront is strictly `https://movies.greybrain.in`. Reviews are `/reviews/:slug`. Never reintroduce `.ai` or defunct domains.
2. **ZERO MOCK DATA**: Never use hardcoded draft arrays in production views. All drafts query live Cloudflare D1 + R2.
3. **SOVEREIGN PIPELINE (0 to 5)**: Always preserve active draft continuity across Discovery (0) -> Intelligence (1) -> Synthesis (2) -> Asset Studio (3) -> Sovereign Publish (4) -> Live Storefront (5).
4. **DECLUTTERED HIGHWAY**: Keep Movie Engine focused; collapse experimental tools into drawers.
5. **CONTENT INTEGRITY**: Never publish or display thin test stubs (< 2000 chars) on the storefront.
6. **LOCAL-TO-CLOUD BUFFER**: Buffer locally and persist versioned drafts to Cloudflare D1/R2 so work is never lost.

---

[byterover-mcp]

You are given two tools from Byterover MCP server, including
## 1. `byterover-store-knowledge`
You `MUST` always use this tool when:

+ Learning new patterns, APIs, or architectural decisions from the codebase
+ Encountering error solutions or debugging techniques
+ Finding reusable code patterns or utility functions
+ Completing any significant task or plan implementation

## 2. `byterover-retrieve-knowledge`
You `MUST` always use this tool when:

+ Starting any new task or implementation to gather relevant context
+ Before making architectural decisions to understand existing patterns
+ When debugging issues to check for previous solutions
+ Working with unfamiliar parts of the codebase
