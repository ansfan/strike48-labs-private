---
title: Splunk
description: MCP integration for Splunk Enterprise and Splunk Cloud — search, KV store, indexes, inputs, and notable events.
nav_order: 13
parent: "Construct MCP Catalog"
---

| | |
|---|---|
| **Slug** | `splunk` |
| **Category** | SIEM |
| **Maturity** | Release |
| **Auth Type** | Splunk auth (token-based) |

## Summary

Full-surface MCP integration with the Splunk REST API for [Splunk Enterprise](https://www.splunk.com/en_us/products/splunk-enterprise.html) and [Splunk Cloud](https://www.splunk.com/en_us/products/splunk-cloud-platform.html). Lets a Prospector Studio agent run SPL searches, manage saved searches and search jobs, query and update KV store collections, list and inspect indexes, manage data inputs and HEC tokens, write events directly to indexes, and update notable events for Splunk Enterprise Security.

This plugin is **read-write**. It can ingest data, mutate KV-store records, create / update / delete saved searches, create HEC tokens and monitor inputs, control running search jobs, and update ES notable events. Bind it to agents only when that level of authority is intended.

## Capabilities

- Run SPL searches (blocking and non-blocking) and stream / preview results; control running jobs.
- List and dispatch saved searches; create, update, and delete saved searches.
- Update Splunk Enterprise Security notable events (status, comment, owner).
- List fired alerts and triggered alert instances.
- KV store: list collections, query / insert / update / delete / get records.
- List and inspect indexes; list data inputs; list and create HEC tokens; create monitor inputs; write to an index directly.
- Inspect users, roles, apps, macros, lookup files / definitions / transforms, dashboards, server info / settings / health, and `.conf` files.

## Required Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-Splunk-Token` | yes | Splunk authentication token (HEC token, REST API token, or session token, depending on the user). |
| `X-Splunk-Base-Url` | yes | Base URL of the Splunk REST API including port (e.g. `https://acme.splunkcloud.com:8089`). |

## Allowed Hosts

`*` — outbound is gated only by the base-URL header. Use a tightly-scoped network policy upstream of Studio if access must be restricted.

## Tools

The plugin advertises 54 MCP tools, organized below by capability domain.

### Search Jobs

| Tool | Action | Purpose |
|------|--------|---------|
| `search` | write | Run an SPL search (creates a search job). |
| `oneshot_search` | write | Run a search and return results in a single blocking request. |
| `export_search_results` | read | Stream search results without creating a persistent job. |
| `get_search_status` | read | Status / progress of a search job. |
| `get_search_results` | read | Results from a completed job. |
| `get_search_results_preview` | read | Preview partial results from a still-running job. |
| `get_search_events` | read | Raw events from a job. |
| `get_search_summary` | read | Field summary statistics for a completed job. |
| `control_search_job` | write | Pause, unpause, finalize, or cancel a job. |
| `delete_search_job` | write | Delete a job and free its resources. |
| `list_search_jobs` | read | List all current search jobs. |

### Saved Searches & Alerts

| Tool | Action | Purpose |
|------|--------|---------|
| `list_saved_searches` | read | List saved searches. |
| `get_saved_search` | read | Get a saved search by name. |
| `dispatch_saved_search` | write | Run a saved search and return its job ID. |
| `create_saved_search` | write | Create a saved search (optionally scheduled / with alert actions). |
| `update_saved_search` | write | Update an existing saved search. |
| `delete_saved_search` | write | Delete a saved search. |
| `list_fired_alerts` | read | List fired alert groups. |
| `get_fired_alert` | read | Triggered instances of a specific fired alert. |

### Splunk Enterprise Security (notable events)

| Tool | Action | Purpose |
|------|--------|---------|
| `get_notable_events` | read | Search the notable index by urgency / status / owner / time. |
| `update_notable` | write | Update notable event status, comment, or owner. |

### KV Store

| Tool | Action | Purpose |
|------|--------|---------|
| `list_kvstore_collections` | read | List collections in an app context. |
| `query_kvstore` | read | Query records (MongoDB-style filters). |
| `get_kvstore_record` | read | Get a single record by key. |
| `insert_kvstore_record` | write | Insert a record. |
| `update_kvstore_record` | write | Replace a record by key. |
| `delete_kvstore_record` | write | Delete a record by key. |

### Indexes & Inputs

| Tool | Action | Purpose |
|------|--------|---------|
| `list_indexes` | read | List indexes. |
| `get_index` | read | Index details (size, event count, settings). |
| `list_data_inputs` | read | List data inputs across all input types. |
| `list_hec_tokens` | read | List HEC input tokens. |
| `get_hec_token` | read | Get a specific HEC token. |
| `create_hec_token` | write | Create a HEC token. |
| `create_monitor_input` | write | Create a file / directory monitor input. |
| `write_to_index` | write | Write events directly to an index. |
| `list_sourcetypes` | read | Available source types / indexes / sources / hosts via typeahead. |

### Users, Roles & Apps

| Tool | Action | Purpose |
|------|--------|---------|
| `list_users` | read | List Splunk users. |
| `get_user` | read | Get a user by username. |
| `list_roles` | read | List roles and their capabilities. |
| `get_role` | read | Get a role with capabilities and inheritance. |
| `list_apps` | read | List installed apps. |
| `get_app` | read | Get a specific installed app. |

### Lookups, Macros & Dashboards

| Tool | Action | Purpose |
|------|--------|---------|
| `list_macros` | read | List search macros. |
| `list_lookup_files` | read | List lookup CSV files. |
| `list_lookup_files_ns` | read | List lookup files in a specific app context. |
| `list_lookup_transforms` | read | List `transforms.conf` lookup stanzas. |
| `list_lookup_definitions` | read | List lookup definitions in a specific app context. |
| `list_dashboards` | read | List dashboards in an app context. |
| `get_dashboard` | read | Get a dashboard definition. |

### Server Info & Configuration

| Tool | Action | Purpose |
|------|--------|---------|
| `get_server_info` | read | Server version, OS, license. |
| `get_server_settings` | read | `splunk-launch.conf` and `server.conf` values. |
| `get_server_health` | read | Health status for splunkd and subsystems. |
| `get_conf_file` | read | All stanzas from a `.conf` file. |
| `get_conf_stanza` | read | A specific stanza from a `.conf` file. |

## Operational Notes

- **`write_to_index`, `create_hec_token`, `create_monitor_input` ingest or expand ingestion paths.** They mutate Splunk state in ways that affect downstream pipelines. Restrict to agents that explicitly need to onboard data.
- **TLS verification.** The plugin disables TLS verification on outbound calls so it can talk to self-signed Splunk endpoints common in on-prem deployments. If your Splunk endpoint uses a public CA, treat that as a defense in depth — the host's network policy is what actually scopes egress.
- **`response_format = "toon"`.** Responses are returned in TOON (a token-efficient compact format) for agent consumption. Most downstream tooling will treat these as opaque text payloads.
- **Search-job lifecycle.** Long-running searches should be created with `search`, polled with `get_search_status` / `get_search_results_preview`, and torn down with `delete_search_job`. Prefer `oneshot_search` only for short, bounded queries.
- **Reference docs.** [Splunk REST API reference](https://docs.splunk.com/Documentation/Splunk/latest/RESTUM/RESTusing).
