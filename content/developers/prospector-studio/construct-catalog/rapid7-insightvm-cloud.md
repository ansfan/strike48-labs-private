---
title: Rapid7 InsightVM Cloud
description: MCP integration for Rapid7 InsightVM Cloud — assets, vulnerabilities, scans, sites, and scan engines.
nav_order: 12
parent: "Construct MCP Catalog"
---

| | |
|---|---|
| **Slug** | `rapid7-insight-vm-cloud` |
| **Category** | Vulnerability Management |
| **Maturity** | Alpha |
| **Auth Type** | API key |

## Summary

MCP integration with the [Rapid7 InsightVM Cloud Integrations API v4](https://docs.rapid7.com/insightvm/). Lets a Prospector Studio agent search the asset and vulnerability inventory, list and start / stop scans, list sites, and inspect or update scan engine configuration.

This plugin is **read-write** — it can start and stop scans and modify scan-engine configuration. Bind it to agents only when that level of authority is intended.

## Capabilities

- Health-check the InsightVM Cloud API.
- Search assets with combined asset and vulnerability filter criteria.
- Search vulnerabilities.
- List, start, stop, and inspect scans.
- List scan engines; inspect or modify per-engine custom properties.
- List sites.

## Required Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-InsightVM-Cloud-Base-Url` | yes | Regional InsightVM Cloud API base URL (see below). |
| `X-InsightVM-Cloud-Api-Key` | yes | InsightVM Cloud API key. |

## Supported Regions

Set `X-InsightVM-Cloud-Base-Url` to the base URL for the customer's InsightVM Cloud region:

| Region | Base URL |
|--------|----------|
| US-1 | `https://us.api.insight.rapid7.com` |
| US-2 | `https://us2.api.insight.rapid7.com` |
| US-3 | `https://us3.api.insight.rapid7.com` |
| EU | `https://eu.api.insight.rapid7.com` |
| Canada | `https://ca.api.insight.rapid7.com` |
| Australia | `https://au.api.insight.rapid7.com` |
| Asia-Pacific | `https://ap.api.insight.rapid7.com` |

## Tools

| Tool | Action | Purpose |
|------|--------|---------|
| `health_check` | read | Health status of the InsightVM Cloud API. |
| `search_assets` | read | Search assets with optional asset + vulnerability filter criteria. |
| `get_asset` | read | Asset details by ID. |
| `search_vulnerabilities` | read | Search the vulnerability inventory. |
| `list_scans` | read | List scans (with optional details). |
| `start_scan` | write | Start a scan. |
| `get_scan` | read | Scan details by ID. |
| `stop_scan` | write | Stop a running scan. |
| `list_scan_engines` | read | List scan engines. |
| `get_scan_engine` | read | Scan engine details by ID. |
| `update_scan_engine_config` | write | Update custom properties on a scan engine (may require restart). |
| `remove_scan_engine_config` | write | Remove custom properties from a scan engine (may require restart). |
| `list_sites` | read | List sites with pagination. |

## Invocation Example

```json
{
  "name": "search_assets",
  "arguments": {
    "filter": {
      "asset": [{ "field": "operating-system", "operator": "contains", "value": "Windows" }],
      "vulnerability": [{ "field": "severity", "operator": "is", "value": "critical" }]
    },
    "size": 100
  }
}
```

## Operational Notes

- **Engine config changes can require a restart.** `update_scan_engine_config` and `remove_scan_engine_config` modify custom properties; depending on the property changed, the engine may need to restart before the change takes effect. Schedule changes outside of active scan windows.
- **Pagination.** Search and list tools support offset / size — use narrower filters in preference to deep paging on a large estate.
- **API key scope.** InsightVM Cloud API keys are scoped per organization. The credentials passed via headers determine which tenant is queried; make sure Studio scopes injection per agent.
- **Reference docs.** [InsightVM Cloud Integrations API v4](https://help.rapid7.com/insightvm/en-us/api/index.html).
