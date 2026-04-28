---
title: CrowdStrike Falcon
description: MCP integration for CrowdStrike Falcon — alerts, devices, host groups, IOCs, RTR, Spotlight, threat intel, and more.
nav_order: 4
parent: "Construct MCP Catalog"
---

| | |
|---|---|
| **Slug** | `crowdstrike-falcon-host-oauth-based` |
| **Category** | EDR |
| **Maturity** | Alpha |
| **Auth Type** | OAuth2 client credentials |

## Summary

Full-surface MCP integration with the [CrowdStrike Falcon](https://www.crowdstrike.com/platform/falcon-platform/) platform. Lets a Prospector Studio agent investigate and act across the Falcon estate: search and triage detections, incidents, and alerts; query and contain devices; manage host groups, custom IOCs, prevention policies, and quarantined files; run Real Time Response sessions; query Spotlight vulnerabilities and remediations; and pull threat-intel actor / indicator / report records.

This plugin is **read-write**. Several tools mutate Falcon state (containment, IOC create/update/delete, host-group membership, RTR command execution, alert status updates). Bind it to agents only when that level of authority is intended.

## Capabilities

- Search and read CrowdStrike alerts, detections, and incidents (free-text and FQL filters).
- Update alert / detection / incident status, assignment, comments, and tags.
- Search and read managed devices and their online state.
- Contain or lift containment on a device.
- Create, read, update, and delete host groups and group memberships.
- Search, create, read, update, and delete custom IOCs.
- Read prevention policies.
- Query Spotlight vulnerabilities and remediation guidance.
- Open, batch, and tear down Real Time Response (RTR) sessions; execute read-only, active responder, and admin commands; retrieve files via RTR.
- Query Falcon Discover for managed and unmanaged hosts, accounts, and login events.
- Upload, retrieve, and delete malware samples in the sample store.
- List event streams for real-time detection and audit consumption.
- Query Zero Trust Assessment scores.
- Manage quarantined files (search, read, release/delete actions).
- Search threat-intel actors, indicators, and reports.
- List Falcon users and available roles.

## Required Headers

Studio must include these headers on every `tools/call` request routed to this plugin. The host performs the OAuth2 client-credentials exchange against `<base>/oauth2/token` and attaches the resulting bearer token to outbound calls — plugin code never sees the raw client secret.

| Header | Required | Description |
|--------|----------|-------------|
| `X-CrowdStrike-Base-Url` | yes | Regional Falcon API base URL (see below). |
| `X-CrowdStrike-Client-Id` | yes | API client ID provisioned in the Falcon console. |
| `X-CrowdStrike-Client-Secret` | yes | API client secret paired with the client ID. |

The API client must be granted scopes covering the endpoint families the agent is expected to use. At minimum: **Alerts**, **Detects**, **Incidents**, **Hosts**, **Host Groups**, **IOC Manager APIs**, **Prevention Policies**, **Spotlight Vulnerabilities**, **Real Time Response**, **Real Time Response (Admin)** if admin commands are needed, **Falcon Intel**, **Falcon Discover**, **Sample Uploads**, **Event Streams**, **Zero Trust Assessment**, **Quarantine**, and **User Management**. Read or read-write per family depending on the tools you bind.

## Supported Regions

Set `X-CrowdStrike-Base-Url` to the base URL for the Falcon cloud the customer is provisioned in:

| Cloud | Base URL |
|-------|----------|
| US-1 (default) | `https://api.crowdstrike.com` |
| US-2 | `https://api.us-2.crowdstrike.com` |
| EU-1 | `https://api.eu-1.crowdstrike.com` |

## Tools

The plugin advertises 84 MCP tools, organized below by capability domain. Tool names match the names exposed over MCP — invoke them via `tools/call` with arguments matching the documented input schema.

### Detections, Alerts & Incidents

> Note: as of September 2025, CrowdStrike's legacy Detects API is decommissioned and the Incidents API is removed (March 2026). Detection / incident tools in this plugin operate against the unified **Alerts v2/v3** endpoints under the hood. Composite IDs returned by the search tools are passed back to the corresponding `get_*_details` and `update_*` tools.

| Tool | Action | Purpose |
|------|--------|---------|
| `search_detections` | read | Search detections by free-text or FQL filter. |
| `get_detection_details` | read | Fetch full records for detection composite IDs. |
| `update_detections` | write | Update detection status / assignee / comments. |
| `search_alerts` | read | Search alerts by FQL filter. |
| `get_alert_details` | read | Fetch full records for alert composite IDs. |
| `update_alerts` | write | Update alert status, assignment, or comments. |
| `aggregate_alerts` | read | Bucket alerts by field for triage dashboards. |
| `get_combined_alerts` | read | Paginated entity-detail listing in one call. |
| `search_incidents` | read | Search incidents (FQL). |
| `get_incident_details` | read | Fetch full records for incident composite IDs. |
| `update_incidents` | write | Apply status / assignment / tag actions. |

### Devices & Containment

| Tool | Action | Purpose |
|------|--------|---------|
| `search_devices` | read | Search managed devices (FQL). |
| `get_device_details` | read | Fetch device records by AID. |
| `get_online_state` | read | Online/offline state for one or more AIDs. |
| `contain_device` | write | Apply or lift network containment on a device. |

### Host Groups

| Tool | Action | Purpose |
|------|--------|---------|
| `search_host_groups` | read | Search host groups (FQL). |
| `get_host_groups` | read | Fetch host group records by ID. |
| `create_host_group` | write | Create a static or dynamic host group. |
| `update_host_group` | write | Update name, description, or assignment rule. |
| `delete_host_groups` | write | Delete one or more host groups. |
| `search_host_group_members` | read | List devices that belong to a host group. |
| `perform_host_group_action` | write | Add or remove hosts from a host group. |

### IOC Management

| Tool | Action | Purpose |
|------|--------|---------|
| `search_iocs` | read | Search custom IOCs (FQL). |
| `get_ioc_details` | read | Fetch IOC records by ID. |
| `create_ioc` | write | Create a custom IOC for detect or block. |
| `update_ioc` | write | Modify fields on an existing IOC. |
| `delete_ioc` | write | Delete IOCs by ID. |

### Spotlight Vulnerabilities

| Tool | Action | Purpose |
|------|--------|---------|
| `search_vulnerabilities` | read | Search Spotlight vulnerabilities (FQL). |
| `get_vulnerability_details` | read | Fetch vulnerability records by ID. |
| `get_vulnerabilities_combined` | read | Paginated entity details in one call. |
| `get_remediations` | read | Remediation guidance for vulnerability IDs. |

### Prevention Policies

| Tool | Action | Purpose |
|------|--------|---------|
| `search_prevention_policies` | read | Search prevention policies (FQL). |
| `get_prevention_policies` | read | Fetch prevention policy records by ID. |

### Real Time Response

> RTR commands are partitioned by privilege: **read-only** (`ls`, `cat`, `ps`, `netstat`, etc.), **active responder** (`kill`, `put`, `get`, `restart`, `runscript`), and **admin** (`run`, `runscript`, `reg set`). Active-responder and admin commands require their corresponding API scope on the client credential.

| Tool | Action | Purpose |
|------|--------|---------|
| `rtr_init_session` | write | Open an RTR session on a single host. |
| `rtr_batch_init_sessions` | write | Open RTR sessions on multiple hosts. |
| `rtr_batch_refresh_sessions` | write | Refresh an existing batch session. |
| `rtr_delete_session` | write | Close an RTR session. |
| `rtr_execute_command` | write | Run a read-only command on a single host. |
| `rtr_batch_command` | write | Run a read-only command across hosts. |
| `rtr_check_command_status` | read | Poll output / status by cloud request ID. |
| `rtr_execute_active_responder_command` | write | Active responder command on one host. |
| `rtr_batch_active_responder_command` | write | Active responder command across hosts. |
| `rtr_execute_admin_command` | write | Admin command on one host. |
| `rtr_batch_admin_command` | write | Admin command across hosts. |
| `rtr_check_admin_command_status` | read | Poll admin command status / output. |
| `rtr_batch_get_command` | write | Batch file retrieval across hosts. |
| `rtr_batch_get_command_status` | read | Status / results for a batch get. |
| `rtr_list_files` | read | List files queued for retrieval. |
| `rtr_get_extracted_file` | read | Download a previously extracted file. |

### Threat Intelligence

| Tool | Action | Purpose |
|------|--------|---------|
| `search_intel_indicators` | read | Search intel indicators (FQL or free-text). |
| `get_intel_indicators` | read | Fetch intel indicator records by ID. |
| `search_intel_actors` | read | Search intel actors (FQL or free-text). |
| `get_intel_actors` | read | Fetch intel actor profiles by ID. |
| `search_intel_reports` | read | Search intel reports (FQL or free-text). |
| `get_intel_reports` | read | Fetch intel report records by ID. |

### Falcon Discover (Asset Discovery)

| Tool | Action | Purpose |
|------|--------|---------|
| `query_discover_hosts` / `discover_search_hosts` | read | Search managed and unmanaged asset host IDs. |
| `get_discover_hosts` / `discover_get_hosts` | read | Fetch full asset records by ID. |
| `query_discover_accounts` / `discover_search_accounts` | read | Search account IDs. |
| `get_discover_accounts` / `discover_get_accounts` | read | Fetch account records by ID. |
| `query_discover_logins` | read | Search login event IDs. |
| `get_discover_logins` | read | Fetch login event records by ID. |

### Samples & Event Streams

| Tool | Action | Purpose |
|------|--------|---------|
| `upload_sample` | write | Upload a malware sample to the sample store. |
| `get_sample` | read | Retrieve a sample by SHA256. |
| `delete_sample` | write | Remove a sample by SHA256. |
| `list_event_streams` | read | Discover available real-time event streams. |

### Zero Trust Assessment

| Tool | Action | Purpose |
|------|--------|---------|
| `get_zta_assessment` | read | Fetch ZTA scores for one or more hosts. |
| `search_zta_assessments` | read | Search ZTA results with filtering and pagination. |

### Quarantined Files

| Tool | Action | Purpose |
|------|--------|---------|
| `search_quarantine_files` | read | Search quarantined files (FQL). |
| `get_quarantine_files` | read | Fetch quarantined file records by ID. |
| `update_quarantine_files` | write | Apply an action (release, delete, etc.). |

### Users & Roles

| Tool | Action | Purpose |
|------|--------|---------|
| `search_users` | read | List user IDs with optional FQL filter. |
| `get_user_details` | read | Fetch user records by ID. |
| `get_available_roles` | read | List all available roles. |

## Invocation Examples

The two patterns below illustrate the read and write call shapes; every other tool follows the same envelope with arguments matching its documented input schema.

Read — search and detail lookup:

```json
{
  "name": "search_detections",
  "arguments": {
    "filter": "status:'new'+severity:>='medium'",
    "sort": "created_timestamp.desc",
    "limit": 50
  }
}
```

```json
{
  "name": "get_detection_details",
  "arguments": {
    "composite_ids": ["abcd1234ef567890:ind:abcd1234:9876"]
  }
}
```

Write — apply an action:

```json
{
  "name": "update_detections",
  "arguments": {
    "composite_ids": ["abcd1234ef567890:ind:abcd1234:9876"],
    "action_parameters": [
      { "name": "update_status", "value": "in_progress" },
      { "name": "assign_to_uuid", "value": "11111111-2222-3333-4444-555555555555" }
    ]
  }
}
```

## Operational Notes

- **Read-write surface.** Containment, IOC mutation, host-group changes, RTR command execution, sample upload/delete, alert status updates, and quarantine actions are all reachable. Scope agents accordingly and prefer narrowly-scoped API client credentials.
- **Tenant scoping is upstream.** The credentials passed in via headers determine which Falcon tenant is queried. Studio should scope credential injection per conversation or agent so one agent can't reach another tenant's data.
- **API migration.** Detection and incident tools route through the unified Alerts v2/v3 endpoints. Composite IDs flow between `search_*`, `get_*_details`, and `update_*` calls — don't mix in IDs from the legacy Detects / Incidents APIs.
- **RTR scopes.** Active-responder and admin commands require dedicated API scopes (`Real Time Response (Admin)` for admin commands). A client without those scopes will see permission errors only when those tools are invoked, not at registration time.
- **Pagination.** Search tools accept `offset` / `limit`; most cap at 10,000 per response. For large sweeps prefer narrower FQL filters over deep pagination.
- **Rate limits.** CrowdStrike enforces per-API-client rate limits. Bursty agent loops over `search_devices` followed by per-device `get_device_details` calls are the easiest way to hit them.
- **Reference docs.** [CrowdStrike Falcon API documentation](https://falcon.crowdstrike.com/documentation) · [FQL reference](https://falcon.crowdstrike.com/documentation/page/d3c84a1b/falcon-query-language-fql).
