---
title: Catalog Authoring Guide (Internal)
description: Internal — template for adding new plugin entries to the Construct MCP Catalog. Not published.
draft: true
---

> **Internal documentation.** This page is marked `draft: true` and is not published on the public docs site. It exists in the repo so catalog maintainers have a template to copy when adding a new plugin entry.

Use the template below for new plugins. The [CrowdStrike Falcon](/developers/prospector-studio/construct-catalog/crowdstrike-falcon/) page is the reference implementation — when in doubt, mirror its structure.

````markdown
---
title: <Human-Friendly Plugin Name>
description: <One-line summary of what the integration does>
nav_order: <integer — controls catalog ordering>
parent: "Construct MCP Catalog"
---

| | |
|---|---|
| **Slug** | `<plugin-slug>` |
| **Category** | <EDR / SIEM / SOAR / Cloud / …> |
| **Maturity** | <Alpha / Beta / Stable> |
| **Auth Type** | <oauth2_client_credentials / api_key / basic / …> |

## Summary

One short paragraph: what this integration does, what upstream system it talks to, and the kind of agent question it is meant to answer. No marketing copy.

## Capabilities

- Bullet list of the high-level things an agent can do with this plugin.
- Frame each bullet as a user-facing capability, not an API endpoint.

## Required Headers

Studio must include these headers on every `tools/call` request routed to this plugin. The host uses them to authenticate to the upstream system; plugin code never sees the raw values.

| Header | Required | Description |
|--------|----------|-------------|
| `X-…` | yes / no | What the value is and where to obtain it |

If the integration uses OAuth2 or another multi-step flow, add a short note here explaining what the host does on the integrator's behalf (e.g. "the host performs the OAuth2 client-credentials exchange and attaches the bearer token to outbound calls"). Do not document internal target headers or host implementation details.

## Supported Endpoints / Regions

List the upstream hosts the plugin is allowed to call, and — if the upstream service has regional deployments — how to select between them.

## Tools

One subsection per tool. Use the tool's MCP-published name as the heading.

### `tool_name`

What the tool does in one sentence.

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `param_a` | string | yes | … |
| `param_b` | integer | no | … |

```json
{
  "name": "tool_name",
  "arguments": {
    "param_a": "..."
  }
}
```

Notes (optional): pagination, valid enum values, gotchas.

## Operational Notes

- Rate limits, scoping behavior, read-only vs. read-write surface, anything an integrator should know before exposing the tool to an agent.
- Cross-link to the upstream API docs where helpful.
````

## Checklist when adding a plugin

- Read the plugin's manifest (`plugins/<plugin-slug>/<plugin-slug>.toml` in the construct repo).
- Pull the public-facing fields: name, slug, version, description, category, maturity, allowed_hosts, source headers from `[[auth]]` blocks, auth_type from `[api]`.
- **Do not document internal target headers** (`X-Construct-…`), DNS regex patterns, or host-side rewriting — those are construct internals, not the integrator contract.
- Group tools by capability domain. For large plugins (>30 tools) prefer summary tables over enumerating every input schema; pick one read and one write example invocation.
- Note read-only vs. read-write at the top — write surfaces (containment, deletes, IOC mutation, RTR command execution, mail send, etc.) deserve an explicit warning.
- Add the plugin to the table in `index.md` and to the sidebar in `content/_data.yml` in alphabetical order. Renumber `nav_order` on entries that shift down.
