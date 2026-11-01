// Buy one a-un result per call with x402 (USDC on Base).
// npm install @x402/core @x402/evm viem
// AGENT_WALLET_KEY must be a key the agent's owner controls and funds with a small amount of USDC on Base.
import { x402Client } from "@x402/core/client";
import { ExactEvmScheme } from "@x402/evm/exact/client";
import { privateKeyToAccount } from "viem/accounts";

const url = "https://a-upgradenet.com/x402/web-read";
const headers = { "content-type": "application/json" };
const body = JSON.stringify({ url: "https://example.com" });

// 1) Ask for the price: an unpaid POST answers 402 + PAYMENT-REQUIRED
const quote = await fetch(url, { method: "POST", headers, body });
if (quote.status !== 402) throw new Error(`expected 402, got ${quote.status}`);
const required = JSON.parse(
  Buffer.from(quote.headers.get("PAYMENT-REQUIRED")!, "base64").toString("utf8")
);

// 2) Sign exactly that price (EIP-3009, USDC on Base) with the agent's own wallet
const account = privateKeyToAccount(process.env.AGENT_WALLET_KEY as `0x${string}`);
const client = new x402Client().register("eip155:8453", new ExactEvmScheme(account));
const payload = await client.createPaymentPayload(required);
const signature = Buffer.from(JSON.stringify(payload)).toString("base64");

// 3) Repeat the same request with PAYMENT-SIGNATURE.
//    Same request + same signature returns the stored result and is never charged twice.
const res = await fetch(url, {
  method: "POST",
  headers: { ...headers, "PAYMENT-SIGNATURE": signature },
  body
});
const result = await res.json();
if (!res.ok) throw new Error(`${result.error.code}: ${result.error.message}`);
console.log(result.status, result.transaction); // "completed", 0x… settlement transaction
