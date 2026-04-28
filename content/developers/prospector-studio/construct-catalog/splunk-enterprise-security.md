---
title: Splunk Enterprise Security
description: MCP integration for Splunk Enterprise Security v2 — investigations, findings, risk scores, response plans, and triage.
nav_order: 14
parent: "Construct MCP Catalog"
---

| | |
|---|---|
| **Slug** | `splunk-es` |
| **Category** | SIEM / SOAR |
| **Maturity** | Release |
| **Auth Type** | Splunk auth (token-based) |

## Summary

MCP integration with the [Splunk Enterprise Security](https://www.splunk.com/en_us/products/enterprise-security.html) v2 REST API. Lets a Prospector Studio agent operate the ES analyst workflow end-to-end: walk and triage findings, manage investigations and notes, query and modify the risk framework, look up assets and identities, list and apply response plan templates, and run SPL searches against the ES correlation and risk indexes.

This plugin is **read-write**. It can create / update findings and investigations, add risk modifiers to entities, create / update / delete notes, import response templates, and apply response plans. Bind it to agents only when that level of authority is intended.

## Capabilities

- Investigations: list, create, update, add findings, attach notes, set disposition, escalate, close.
- Findings: list, get, create, bulk-update status / disposition.
- Risk framework: read entity risk scores, add risk modifiers, build entity risk profiles, query risk trend.
- Asset and identity lookup (KV-store-backed and SPL-backed).
- Response templates: list, get, import; apply a template to an investigation; advance individual response-plan tasks.
- Notes: full CRUD on investigation notes and response-plan task notes.
- Detections: list correlation searches; get detection details; pull recent hits for a detection.
- High-level analyst helpers: enriched triage queue, full entity profile, investigation summary dossier, threat-intel lookups by indicator type.
- Run arbitrary SPL searches and retrieve results.

## Required Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-Splunk-Token` | yes | Splunk authentication token. |
| `X-Splunk-Base-Url` | yes | Base URL of the Splunk REST API including port (e.g. `https://acme.splunkcloud.com:8089`). |

The token must be valid against the Splunk instance hosting Enterprise Security and have the capabilities the bound tools require (writing to ES collections, dispatching searches, modifying risk).

## Allowed Hosts

`*` — outbound is gated only by the base-URL header. Use a tightly-scoped network policy upstream of Studio if access must be restricted.

## Tools

The plugin advertises 44 MCP tools, organized below by capability domain.

### Investigations

| Tool | Action | Purpose |
|------|--------|---------|
| `list_investigations` | read | List investigations with filters. |
| `create_investigation` | write | Create a new investigation. |
| `update_investigation` | write | Update name / description / status / owner / urgency / sensitivity. |
| `add_findings_to_investigation` | write | Attach findings to an investigation. |
| `acknowledge_finding` | write | One-step acknowledge: create an investigation from a finding and assign it. |
| `classify_finding` | write | Set disposition on an investigation. |
| `escalate_investigation` | write | Escalate urgency. |
| `close_investigation` | write | Close with mandatory disposition. |
| `investigation_summary` | read | Full investigation dossier (details, notes, findings, response plan). |

### Findings

| Tool | Action | Purpose |
|------|--------|---------|
| `list_findings` | read | List findings (notable events) with filters. |
| `get_finding` | read | Get a finding by composite event ID. |
| `create_finding` | write | Create a manual finding. |
| `bulk_update_findings` | write | Batch update status and / or disposition. |
| `triage_queue` | read | Enriched triage queue with risk context. |

### Risk Framework

| Tool | Action | Purpose |
|------|--------|---------|
| `get_entity_risk_scores` | read | Risk scores for an entity (user, host, IP). |
| `add_risk_modifier` | write | Add a risk modifier to an entity. |
| `high_risk_entities` | read | Entities above a risk-score threshold. |
| `entity_risk_profile` | read | Comprehensive risk profile via supplied SPL. |
| `risk_trend` | read | Risk score trend via SPL `timechart`. |
| `investigate_entity` | read | Full entity profile with risk and related findings. |

### Assets & Identities

| Tool | Action | Purpose |
|------|--------|---------|
| `get_asset` | read | Asset details by KV store ID. |
| `get_identity` | read | Identity details by KV store ID. |
| `search_assets` | read | Search asset lookup via SPL `inputlookup`. |
| `search_identities` | read | Search identity lookup via SPL `inputlookup`. |

### Notes

| Tool | Action | Purpose |
|------|--------|---------|
| `list_investigation_notes` | read | List notes on an investigation. |
| `create_investigation_note` | write | Create a note on an investigation. |
| `update_investigation_note` | write | Update a note. |
| `delete_investigation_note` | write | Delete a note. |
| `list_task_notes` | read | List notes on a response-plan task. |
| `create_task_note` | write | Create a note on a task. |
| `update_task_note` | write | Update a task note. |
| `delete_task_note` | write | Delete a task note. |

### Response Plans & Detections

| Tool | Action | Purpose |
|------|--------|---------|
| `list_response_templates` | read | List Splunk-owned response templates. |
| `get_response_template` | read | Get a template by name and version. |
| `import_response_template` | write | Import response template files. |
| `apply_response_plan` | write | Apply a template to an investigation. |
| `advance_response_task` | write | Complete a response-plan task with a note. |
| `list_detections` | read | List correlation searches (detections). |
| `get_detection` | read | Get a correlation search (SPL, schedule, MITRE annotations). |
| `get_detection_hits` | read | Recent notable events for a detection. |

### Search & Threat Intel

| Tool | Action | Purpose |
|------|--------|---------|
| `run_search` | write | Run arbitrary SPL (blocking or non-blocking). |
| `get_search_results` | read | Get results from a search job by SID. |
| `search_events` | read | Run a oneshot SPL search. |
| `threat_intel_lookup` | read | Query threat intel collections (`ip_intel`, `domain_intel`, `file_intel`, `email_intel`, `url_intel`). |

## Invocation Example

Triage flow — pull the enriched queue, then acknowledge a finding into an investigation:

```json
{
  "name": "triage_queue",
  "arguments": { "limit": 25 }
}
```

```json
{
  "name": "acknowledge_finding",
  "arguments": {
    "finding_id": "AB12-3CDE-4567-89F0",
    "owner": "alice@example.com",
    "urgency": "high"
  }
}
```

## Operational Notes

- **Workflow shape.** Several tools (`classify_finding`, `escalate_investigation`, `close_investigation`) accept the core action only — to record a justification or summary, follow up with `create_investigation_note`. The two-call pattern is intentional and surfaces the note as its own auditable event.
- **SPL-backed tools require valid SPL.** `entity_risk_profile`, `risk_trend`, and `get_detection_hits` take a full SPL string in the `search` argument. Agents need to construct SPL correctly; consider wrapping them behind tighter prompts before exposing to non-expert agents.
- **TLS verification.** Like the core Splunk plugin, this disables TLS verification on outbound calls to support self-signed on-prem deployments. The host's network policy is the actual egress boundary.
- **Token capabilities.** The supplied token must have the capabilities ES uses for the surfaces you bind: writing to ES KV-store collections, dispatching searches, and modifying risk scores. Failures surface only at tool invocation time.
- **Reference docs.** [Splunk Enterprise Security REST API](https://docs.splunk.com/Documentation/ES/latest/RESTAPI/Overview).
