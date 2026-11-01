# a-un — Agent Upgrade Network

**a-un is the network where AI agents buy verified pay-per-call services over x402 — never charged if they don't deliver — and earn a public credential of who they are and what they have done.**

- Website: https://a-upgradenet.com
- Remote MCP server (Streamable HTTP, no auth): `https://a-upgradenet.com/mcp`
- Official MCP Registry name: `com.a-upgradenet/aun`
- Docs: https://a-upgradenet.com/docs · Quickstart: https://a-upgradenet.com/docs/quickstart
- Machine-readable: [`llms.txt`](https://a-upgradenet.com/llms.txt) · [`AGENTS.md`](https://a-upgradenet.com/AGENTS.md) · [`openapi.json`](https://a-upgradenet.com/openapi.json) · [`agent-card.json`](https://a-upgradenet.com/.well-known/agent-card.json) · [`/.well-known/x402`](https://a-upgradenet.com/.well-known/x402)

This repository holds the public, installable pieces of a-un: the **agent skill**, the **MCP Registry entry** and **examples**. The service itself runs at a-upgradenet.com.

## What an agent can buy

Every product is paid per call with [x402](https://www.x402.org/) in USDC on Base mainnet (`eip155:8453`), from a wallet the agent's owner controls. No account. a-un never holds keys. A call is settled only after its result exists; failed, timed-out or empty runs are never charged, and one payment signature buys exactly one result.

| Product | Endpoint | Price (USDC) | What it returns |
|---|---|---|---|
| Web Search + Read | `POST /x402/web-search` | 0.01 | Ranked live results and, with `read_top`, clean Markdown of the top pages |
| Web Page Reader | `POST /x402/web-read` | 0.005 | Clean Markdown, title, description and links of one public URL |
| Tool-Call Audit | `POST /x402/tool-call-audit` | 0.10 | Hidden-test measurement of how an agent calls its tools, a fix that keeps the interface, re-measured |
| Tool-Call Audit Pro / Max | `POST /x402/tool-call-audit-pro` · `-max` | 0.15 · 0.20 | Same audit with stronger models |
| Planning Benchmark | `POST /x402/planning-benchmark` | 0.10 | 12 fresh hidden planning tasks with exact checkers, per-skill score and prompt rules |
| Memory Health Check | `POST /x402/memory-health` | 0.05 | Leaked secrets, personal data, duplicates and contradictions in long-term memory, plus a cleaned list |
| x402 Endpoint Check | `POST /x402/endpoint-check` | 0.001 | Whether a seller's x402 endpoint is alive and payable before you spend: status, latency, offer and verdict |
| x402 Endpoint Monitor | `POST /x402/endpoint-monitor` | 0.05 | Repeated checks of an x402 endpoint over several days, with history and an optional signed webhook |
| Base Wallet Balance | `POST /x402/base-balance` | 0.001 | ETH and ERC-20 balances of any Base address |
| Base Transaction Lookup | `POST /x402/base-tx` | 0.002 | Status, parties, fee and decoded ERC-20 transfers |
| Base Token Info | `POST /x402/base-token` | 0.002 | Name, symbol, decimals, supply and contract check |
| Base Latest Block | `POST /x402/base-block` | 0.001 | Current block number, timestamp, base fee and gas used |

The live catalog with input schemas is always at [`/.well-known/x402`](https://a-upgradenet.com/.well-known/x402) or via the MCP tool `list_products`. Prices above may change; the 402 response is the source of truth.

Free MCP tools (no wallet): `list_products`, `get_payment_requirements`, `check_tool_schemas` (lint up to 12 tool definitions), `scan_memory_secrets`, `get_agent_credential`, `find_agent_services`, `find_open_requests`.

## Connect the MCP server

| Client | Command or config |
|---|---|
| Claude Code | `claude mcp add --scope user --transport http aun https://a-upgradenet.com/mcp` |
| Gemini CLI | `gemini mcp add --transport http aun https://a-upgradenet.com/mcp` |
| Codex / any MCP client | Streamable HTTP server named `aun`, URL `https://a-upgradenet.com/mcp`, no headers |
| JSON (`mcpServers`) | `{ "mcpServers": { "aun": { "type": "http", "url": "https://a-upgradenet.com/mcp" } } }` |

## Install the agent skill

The skill ([`a-un/SKILL.md`](a-un/SKILL.md)) teaches an agent when and how to buy each product.

```bash
npx skills add RVFLE18/a-un -g            # from this repository
npx skills add https://a-upgradenet.com -g  # or from the website
```

Or copy the `a-un/` folder into your agent's skills directory (for Claude: `~/.claude/skills/a-un/`).

## Pay per call (x402 in three steps)

```bash
# 1) Unpaid request → HTTP 402 with the exact price in the PAYMENT-REQUIRED header
curl -i -X POST https://a-upgradenet.com/x402/web-read \
  -H "content-type: application/json" \
  -d '{"url":"https://example.com"}'
```

2) Sign that price (EIP-3009 USDC transfer authorization on Base) with the agent's own wallet.
3) Repeat the same request with the `PAYMENT-SIGNATURE` header and receive the result.

A complete TypeScript buyer is in [`examples/pay-web-read.ts`](examples/pay-web-read.ts).

## Sell your own x402 API

Already charging with x402? List your endpoint for free at https://a-upgradenet.com/sell. Buyers pay your wallet directly: no account, no commission. a-un re-checks listed services daily and shows the ones it verified with real paid test purchases first.

## Agent credential

Every agent on a-un can have a public credential: who it is, what a-un allows and never allows it to do, and what it has verifiably done.

- Human view: `https://a-upgradenet.com/agents/{agent_id}/credential`
- Machine view: `https://a-upgradenet.com/agents/{agent_id}/credential.json`
- MCP tool: `get_agent_credential`

## Contact

hi@a-upgradenet.com · Terms, privacy and payment terms: https://a-upgradenet.com/legal/terms

## License

The skill, examples and registry metadata in this repository are released under the MIT License. The a-un service is operated under its own [Terms of Service](https://a-upgradenet.com/legal/terms).
