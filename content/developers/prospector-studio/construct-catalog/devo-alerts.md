---
title: Devo Alerts
description: MCP integration for the Devo Alerts API — alert rule CRUD and triggered alert management.
nav_order: 7
parent: "Construct MCP Catalog"
---

| | |
|---|---|
| **Slug** | `devo-alerts` |
| **Category** | SIEM (alerting) |
| **Maturity** | Alpha |
| **Auth Type** | Bearer token |

## Summary

Focused MCP integration with the [Devo](https://www.devo.com/) Alerts API. Lets a Prospector Studio agent manage Devo alert rules (create / update / delete / enable / disable / share / search) and act on triggered alert instances (list, fetch detail, update status, update priority, delete). Carved out of the broader Devo SIEM integration so a small, token-scoped surface can be granted to agents that only need alerting.

This plugin is **read-write** — it can create, modify, and delete alert rules and triggered alert instances. Bind it to agents only when that level of authority is intended.

## Capabilities

- Alert-rule lifecycle: create rules with query, thresholds, and delivery policy; update; delete; enable / disable; search and filter; share with child domains.
- Triggered-alert management: list with filtering and pagination, fetch detail, delete, update status, update priority.

## Required Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-Devo-Alerts-Token` | yes | Devo API bearer token scoped to the Alerts API. |
| `X-Devo-Deployment-Region` | yes | Devo deployment region (e.g. `us`, `eu`). Determines which `*.devo.com` subdomain the plugin reaches. |

The plugin also adds `X-Devo-Alerts-Token` to the redaction pattern set, so the token is scrubbed from logs and stored values regardless of how it surfaces through the request pipeline.

## Allowed Hosts

`*.devo.com`

## Tools

### Alert Rules

| Tool | Action | Purpose |
|------|--------|---------|
| `create_rule` | write | Create a new Devo alert rule with query, thresholds, and delivery policy. |
| `update_rule` | write | Update an existing alert rule. |
| `delete_rule` | write | Delete one or more alert rules by ID. |
| `manage_rule` | write | Enable or disable one or more alert rules. |
| `search_rule` | read | Search and filter alert rules with pagination. |
| `share_rules` | write | Share an alert rule with child domains. |

### Triggered Alerts

| Tool | Action | Purpose |
|------|--------|---------|
| `get_triggered_alerts` | read | List triggered alert instances with filtering and pagination. |
| `get_triggered_alert_detail` | read | Get detailed information for a specific triggered alert. |
| `delete_triggered_alert` | write | Delete one or more triggered alert instances. |
| `update_alert_status` | write | Update the status of triggered alerts. |
| `update_alert_priority` | write | Update the priority of triggered alerts. |

## Invocation Example

```json
{
  "name": "create_rule",
  "arguments": {
    "name": "Suspicious admin login burst",
    "description": "More than 5 admin logins from the same IP in 5 minutes",
    "message": "Possible brute force or credential stuffing attempt",
    "querySourceCode": "from siem.logtrust.web.activity where action=\"login\" and user_role=\"admin\" group every 5m by srcIp every 5m where count() > 5 select srcIp",
    "priority": "HIGH",
    "type": { "name": "several", "parameters": { "occurrences": 5 } },
    "subcategory": { "name": "authentication" }
  }
}
```

## Operational Notes

- **Carved-out surface.** This plugin intentionally exposes only the alerts API — not the broader Devo SIEM (`devo-siem`) integration. Use this when you want to grant alerting authority without granting general query access to logs.
- **Region selection.** `X-Devo-Deployment-Region` is required and not defaulted; the host needs to know which Devo region to reach. Set per agent or per conversation to match the customer's tenant.
- **Tokens are tenant-scoped.** Devo bearer tokens are scoped to a single tenant / domain. Use `share_rules` deliberately — sharing into child domains requires the parent token to have authority over them.
- **Reference docs.** [Devo Alerts API](https://docs.devo.com/space/latest/95191143/Alerts+API).
