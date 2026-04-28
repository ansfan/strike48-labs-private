---
title: Construct MCP Integrations
description: How Prospector Studio integrates with Strike Construct, a consolidated MCP runtime.
nav_order: 1
parent: "MCP Servers"
---

Prospector Studio agents reach external systems through MCP servers. Most of those integrations are served by **Strike Construct** — a single MCP runtime that consolidates what would otherwise be dozens of separately-deployed servers behind one endpoint.

## Overview

Construct is a Rust runtime host that exposes a standard MCP interface to Prospector Studio while running its tools as sandboxed plugins inside the host process. To Studio, Construct looks like any other MCP server registered via [`.mcp.json`](/prospector-studio/guides/mcp-servers/) or the GraphQL API: it speaks JSON-RPC over HTTP/SSE, lists tools, and answers `tools/call`. To operators, it is one binary to deploy, observe, and secure — instead of a fleet of one-off servers each with their own auth, transport, and update story.

```
Prospector Studio                       Construct Runtime
┌─────────────────┐    MCP/JSON-RPC    ┌──────────────────────────┐
│  Agent / Tool   │ ─────────────────▶ │  Transport + Auth + Obs  │
│    Registry     │                    │            │             │
└─────────────────┘                    │            ▼             │
                                       │     Plugin Registry      │
                                       │   ┌──────┬──────┬─────┐  │
                                       │   │ WASM │ WASM │ ... │  │
                                       │   └──────┴──────┴─────┘  │
                                       │            │             │
                                       │            ▼             │
                                       │   Outbound HTTP / KV /   │
                                       │   Filesystem (gated)     │
                                       └──────────────────────────┘
```

## How Studio Uses It

From an agent's perspective, Construct is just another MCP endpoint. Tool discovery, invocation, and result handling all flow through the same path described in [MCP Servers](/prospector-studio/guides/mcp-servers/):

1. Studio registers Construct as an MCP server (HTTP transport).
2. Agents enumerate the tools Construct advertises and bind the relevant ones.
3. When a tool is called, Studio forwards the JSON-RPC request along with the user's request-scoped credentials.
4. Construct executes the tool inside a sandboxed plugin and returns the result.
5. Studio incorporates the response into the conversation.

The key Studio-side difference is that a single Construct connection can light up a large surface of integrations at once, instead of requiring separate server entries per vendor.

## How Construct Differs from a Traditional MCP Server

A typical MCP server is a standalone process that implements the protocol, embeds vendor-specific logic, and ships with its own auth handling. Construct keeps the same external contract but reorganizes what sits behind it:

- **One host, many tools.** Tools are loaded as plugins into a single runtime rather than packaged as separate servers. Adding an integration means registering a plugin, not standing up a new service.
- **Sandboxed plugin execution.** Each plugin runs in a WebAssembly sandbox with capability-gated access to host resources (HTTP, key-value storage, scoped filesystem). A misbehaving plugin cannot reach beyond what the host hands it.
- **Credentials never reach plugin code.** Inbound credentials are held by the host and attached to outbound calls based on destination matching. Plugins describe *what* they need to call; the host handles *how* it gets authenticated. Credential memory is zeroized when the request ends.
- **Bidirectional redaction.** Outbound requests, inbound responses, logs, and stored values pass through a redaction pipeline whose intensity follows the request's risk level. This happens uniformly across every tool, rather than each integration reimplementing it.
- **Built-in recall for large outputs.** Oversized tool results are compressed and stored against a deterministic recall ID, with companion MCP tools to retrieve, search, and manage them. Agents can reference earlier outputs without re-paying their context cost.
- **Uniform observability.** All tool calls share one tracing, metrics, and logging surface, so operators see the whole MCP integration layer through a single pane.

The net effect for Studio: a broad, consistent integration surface that an agent can call into without Studio needing to know which downstream system is on the other end of any given tool.

## Authentication & Access Control

Two layers control what Construct can actually do on behalf of an agent: the **upstream credentials** you hand to Studio, and the **per-agent tool grants** you configure inside Studio. They serve different purposes and you should use both.

### Principle of least privilege at the credential layer

The credentials Studio passes through to Construct (API keys, OAuth client secrets, bearer tokens, etc.) inherit *exactly* the privileges they were issued with upstream. A CrowdStrike Falcon client secret with full Read+Write scopes lets the runtime perform every Falcon mutation a tool exposes — containment, IOC create/delete, RTR command execution. A token scoped to read-only Detects gives the runtime no power to mutate anything, regardless of what tools you bind.

**Provision credentials at the smallest scope that achieves the outcome you want.** If your agents only need to triage detections, issue a read-only API client and pass that. If they need to contain hosts, issue a credential scoped to detection read + host containment write — not a fleet-admin credential. Construct will not synthesize permissions the credential doesn't already have.

This matters because Studio scopes credential injection to the request, but Construct still calls upstream as the customer's identity. If the credential has the authority to do something destructive, the only thing standing between an agent prompt and that action is the agent's tool grants — see below.

### Permission failures surface as 403s at call time

Construct does not pre-validate upstream scopes when a tool is registered or when an agent enumerates tools. The host has no way to know, at registration time, what scopes a particular API client actually carries — vendors don't reliably expose that.

The practical consequence: if an agent invokes a tool whose upstream API requires a scope the supplied credentials do not have, Construct will surface the upstream's permission error as a **403 (or vendor-equivalent) at call time**, after the request has already been issued. Tools list cleanly. Tool calls fail at runtime.

This is intentional — it means scoping decisions are made by the credentials you provision, not by Construct's tool catalog. It also means an agent that's been given a tool it can't actually use will retry, re-prompt, or surface the error to the user. Plan for that: when you provision a narrow credential, make sure the bound tools match what it can do, or accept that some calls will return permission errors.

### Tool grants at the agent layer

Credentials set the *ceiling* on what's possible. Agent tool grants set the *floor* on what's actually exposed.

Studio binds tools to agents explicitly. An agent can only call the MCP tools its configuration grants it — even if the underlying credentials would permit much more. This gives you a useful pattern:

- Provision broader credentials when narrower per-agent issuance is operationally infeasible.
- Bind only the tools each agent legitimately needs.
- Trust Studio's agent layer — not the credentials — to enforce per-agent capability boundaries.

A credible deployment uses both layers. Narrow the credentials as far as you can, then narrow the per-agent tool list further. The two layers compound: a write-capable credential combined with a read-only agent grant produces a read-only agent. A read-only credential combined with a write-bound agent produces an agent that calls write tools and gets 403s — undesirable, but not unsafe.

When in doubt, prefer narrower credentials. The blast radius of a compromised or misbehaving agent is bounded by the upstream credential's scope, not by Studio's UI.

## What's Next

Per-plugin reference docs — required headers, supported regions, and the full tool catalog for each integration — live in the [Construct MCP Catalog](/developers/prospector-studio/construct-catalog/) under For Developers.
