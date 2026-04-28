---
title: Darktrace
description: MCP integration for Darktrace — model breaches, AI Analyst, Antigena autonomous response, devices, and intel feeds.
nav_order: 6
parent: "Construct MCP Catalog"
---

| | |
|---|---|
| **Slug** | `darktrace` |
| **Category** | Network Detection & Response |
| **Maturity** | Beta |
| **Auth Type** | HMAC-signed (public token + private key) |

## Summary

Full-surface MCP integration with the [Darktrace](https://darktrace.com/) platform. Lets a Prospector Studio agent investigate and act across the Darktrace estate: triage model breaches, walk AI Analyst incident groups and investigations, manage Antigena autonomous-response actions, query and tag devices, look up endpoint intel, manage the watched-domain intel feed, and inspect appliance metrics and PCAPs.

This plugin is **read-write**. Several tools mutate Darktrace state (acknowledgement / pinning of incidents, Antigena action lifecycle, manual Antigena creation, intel feed updates, tag CRUD, PCAP requests). Bind it to agents only when that level of authority is intended.

## Capabilities

- Read, comment on, and acknowledge model breaches.
- Walk AI Analyst incident groups, events, statistics, and investigations; create new investigations.
- List, activate, extend, clear, reactivate, and manually create Antigena autonomous-response actions.
- List, search, update, and find similar Darktrace devices.
- Look up endpoint (external IP / hostname) intelligence.
- Read and modify the watched intel feed.
- Browse models, metrics, network statistics, subnets, components, and CVE inventory.
- Manage tags and tag-to-entity associations.
- List and request PCAP captures.

## Required Headers

Darktrace API requests are signed with HMAC. The host performs the HMAC signature on each outbound call using the supplied tokens — plugin code never sees the raw private key.

| Header | Required | Description |
|--------|----------|-------------|
| `X-Darktrace-Base-Url` | yes | Full Darktrace instance URL (e.g. `https://{instance}.cloud.darktrace.com`). |
| `X-Darktrace-Public-Token` | yes | Darktrace API public token. |
| `X-Darktrace-Private-Key` | yes | Darktrace API private key used for HMAC signing. |

## Allowed Hosts

`*.cloud.darktrace.com`, `*.darktrace.com`

## Tools

The plugin advertises 56 MCP tools, organized below by capability domain.

### Model Breaches

| Tool | Action | Purpose |
|------|--------|---------|
| `list_model_breaches` | read | List model breaches with filters. |
| `get_model_breach_comments` | read | Comments on a specific breach. |
| `add_model_breach_comment` | write | Add a comment to a breach. |
| `acknowledge_model_breach` | write | Acknowledge a breach. |
| `unacknowledge_model_breach` | write | Unacknowledge a breach. |
| `list_mbcomments` | read | List model-breach comments globally. |
| `post_mbcomment` | write | Post a comment via the global comments endpoint. |

### AI Analyst

| Tool | Action | Purpose |
|------|--------|---------|
| `get_ai_analyst_groups` | read | AI Analyst incident groups. |
| `get_ai_analyst_incident_events` | read | AI Analyst incident events. |
| `acknowledge_ai_analyst` | write | Acknowledge incidents by UUID. |
| `unacknowledge_ai_analyst` | write | Unacknowledge incidents. |
| `pin_ai_analyst` | write | Pin incidents. |
| `unpin_ai_analyst` | write | Unpin incidents. |
| `get_ai_analyst_comments` | read | Comments on an AI Analyst incident. |
| `add_ai_analyst_comment` | write | Add a comment to an incident. |
| `get_ai_analyst_stats` | read | AI Analyst statistics. |
| `get_ai_analyst_investigations` | read | List AI Analyst investigations. |
| `create_ai_analyst_investigation` | write | Create an investigation for a device + time. |

### Antigena (Autonomous Response)

| Tool | Action | Purpose |
|------|--------|---------|
| `get_antigena_actions` | read | List Antigena actions. |
| `activate_antigena_action` | write | Activate a pending action. |
| `extend_antigena_action` | write | Extend an active action. |
| `clear_antigena_action` | write | Clear an active action. |
| `reactivate_antigena_action` | write | Reactivate a cleared action. |
| `create_manual_antigena_action` | write | Create a manual action on a device. |
| `get_antigena_summary` | read | Antigena summary. |

### Devices

| Tool | Action | Purpose |
|------|--------|---------|
| `list_devices` | read | List tracked devices. |
| `update_device` | write | Update label, priority, type. |
| `search_devices` | read | Search by filters or raw query. |
| `get_device_info` | read | Connection / traffic info for a device. |
| `get_device_summary` | read | Device summary. |
| `get_similar_devices` | read | Find devices similar to a given device. |
| `get_details` | read | Detailed events / connections for a device or breach. |

### Endpoint Intel & Intel Feed

| Tool | Action | Purpose |
|------|--------|---------|
| `get_endpoint_details` | read | Intelligence on an external IP or hostname. |
| `get_intel_feed` | read | List watched domain / IP entries. |
| `update_intel_feed` | write | Add or remove entries from the feed. |

### Inventory & Metrics

| Tool | Action | Purpose |
|------|--------|---------|
| `list_models` | read | List detection models. |
| `list_metrics` | read | List metrics or fetch one by ID. |
| `get_metric_data` | read | Metric values over time. |
| `get_network` | read | Network traffic statistics. |
| `list_subnets` | read | List subnets or fetch one by ID. |
| `update_subnet` | write | Update subnet properties. |
| `list_components` | read | List components or fetch one by ID. |
| `list_cves` | read | List CVE vulnerabilities seen on the network. |
| `get_status` | read | Appliance status. |
| `get_summary_statistics` | read | High-level summary statistics. |

### Tags

| Tool | Action | Purpose |
|------|--------|---------|
| `list_tags` | read | List tags or fetch one by ID. |
| `create_tag` | write | Create a tag. |
| `delete_tag` | write | Delete a tag. |
| `list_tag_entities` | read | List tag-to-entity associations. |
| `apply_tag_to_device` | write | Apply a tag to a device. |
| `remove_tag_from_device` | write | Remove a tag from a device. |
| `list_tag_entities_by_tag` | read | List entities tagged with a tag ID. |
| `add_tag_entity` | write | Associate an entity with a tag. |
| `delete_tag_entity` | write | Remove a tag-entity association. |

### PCAP

| Tool | Action | Purpose |
|------|--------|---------|
| `list_pcaps` | read | List PCAPs or fetch metadata for one. |
| `create_pcap` | write | Request a PCAP capture. |

## Operational Notes

- **HMAC signing happens host-side.** The agent / plugin never sees the raw private key; the host computes the signature on each outbound call. Rotate keys in the Darktrace console as you would normally; Studio just needs the new pair on the next request.
- **Antigena scope.** Active Antigena tools (activate / extend / clear / create_manual) take effective network actions on managed devices. Restrict their use to agents that are explicitly meant to perform autonomous response.
- **Wildcard host allowance.** Outbound calls match `*.cloud.darktrace.com` and `*.darktrace.com` — the base-URL header drives which exact instance is reached.
- **Reference docs.** [Darktrace Threat Visualizer API](https://customerportal.darktrace.com/) (login required).
