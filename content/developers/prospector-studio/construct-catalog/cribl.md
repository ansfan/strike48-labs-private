---
title: Cribl
description: MCP integration for Cribl Cloud — Stream, Edge, Lake, Search, and management-plane administration.
nav_order: 3
parent: "Construct MCP Catalog"
---

| | |
|---|---|
| **Slug** | `cribl` |
| **Category** | Data Pipelines / Telemetry |
| **Maturity** | (unspecified — treat as alpha until upstream tags it) |
| **Auth Type** | OAuth2 client credentials *(or pre-fetched bearer token)* |

## Summary

Full-surface MCP integration with the [Cribl Cloud](https://cribl.io/) REST API, covering Cribl **Stream** (data routing and shaping), **Edge** (edge-deployed agents and pipelines), **Lake** (object-store-backed storage), **Search** (federated search), and the **Management Plane** (auth, RBAC, settings, packs, certificates, secrets, notifications, and tenant administration). Lets a Prospector Studio agent operate the Cribl control plane: inspect topology and health, manage sources / destinations / pipelines / routes / packs, edit lookups and parsers, query worker state, deploy configuration, and administer users / teams / roles / secrets.

This plugin is **read-write**. The surface is administrative — sources, destinations, pipelines, routes, packs, secrets, certificates, RBAC, and global settings can all be created, modified, and deleted through it. Bind it to agents only when that level of authority is intended.

## Capabilities

- Inspect health, system info, and worker fleet status.
- Browse and modify Stream topology: groups, sources, destinations, pipelines, routes, functions, lookups, parsers, schemas, datasets, samples, regexes, scripts.
- Browse and modify Edge topology: outposts, projects, connections, mappings, plus the same per-component CRUD set as Stream.
- Cribl Lake: lake datasets, retention, and connection management.
- Cribl Search: search definitions, saved searches, and execution.
- Management plane: deployment / commit / publish, GitOps settings, packs, certificates, encryption keys, KMS, banners, system messages.
- RBAC: roles, policies, permissions, SSO groups, users, teams, products, ACLs.
- Secrets, credentials, and global variables.
- Notifications and notification targets.
- Diagnostics: collection, download, send to support.
- AI features and Cribl Copilot consent.

## Required Headers

You can authenticate with **either** a pre-fetched bearer token **or** the OAuth2 client-credentials pair. If both are present, the bearer token takes precedence.

| Header | Required | Description |
|--------|----------|-------------|
| `X-Cribl-Base-Url` | yes | Cribl Cloud workspace URL (e.g. `https://main-org123.cribl.cloud`). |
| `X-Cribl-Token` | optional | Pre-fetched Cribl bearer token. Skips the client-credentials exchange. |
| `X-Cribl-Client-Id` | yes (when no bearer token) | Cribl Cloud API client ID. |
| `X-Cribl-Client-Secret` | yes (when no bearer token) | Cribl Cloud API client secret. |

When the client-credentials pair is supplied, the host performs the OAuth2 token exchange against `https://login.cribl.cloud/oauth/token` (audience `https://api.cribl.cloud`) and attaches the resulting bearer token to outbound calls — plugin code never sees the raw client secret.

## Allowed Hosts

`*.cribl.cloud`, `login.cribl.cloud`

## Tools

The plugin advertises **529 MCP tools** that mirror the Cribl REST API surface. They are grouped below by domain. Within each domain the tools follow the standard `list_* / get_* / create_* / update_* / delete_*` quintuple per resource type — what changes between domains is the resource catalogue.

### Core / Administration (~60 tools)

Auth, sessions, SSO, users, teams, roles, RBAC policies, ACLs, system settings, GitOps configuration, AI features, Cribl Copilot consent, encryption keys + KMS, certificates, secrets, credentials, global variables, packs (create / clone / publish / export), banners, system messages, notifications + targets, schemas, regexes, samples, parsers, event breakers, protobuf libraries, lookups, scripts, diagnostics, search-limit quotas.

Representative tools:

| Tool | Action | Purpose |
|------|--------|---------|
| `health_check` / `get_health` | read | API and overall system health. |
| `get_worker_health` | read | Health of every connected worker node. |
| `list_users`, `create_user`, `update_user`, `delete_user` | read/write | User account CRUD. |
| `list_roles`, `create_role`, `update_role`, `delete_role` | read/write | RBAC role CRUD. |
| `list_secrets`, `create_secret`, `update_secret`, `delete_secret` | read/write | Secret store CRUD. |
| `list_packs`, `clone_pack`, `publish_pack`, `export_pack` | read/write | Configuration pack lifecycle. |
| `get_diagnostics`, `download_diagnostic_bundle`, `send_diagnostics` | read/write | Diagnostics collection. |

### Cribl Stream (`stream_*`, ~130 tools)

End-to-end Stream administration: groups, sources, destinations, pipelines, routes, functions, lookups, parsers, datasets, schemas, samples, scripts, projects, plus deployment / commit / restart / reload operations.

Representative tools:

| Tool | Action | Purpose |
|------|--------|---------|
| `stream_list_groups`, `stream_get_group` | read | Worker / fleet groups. |
| `stream_list_sources`, `stream_create_source`, `stream_update_source`, `stream_delete_source` | read/write | Source CRUD. |
| `stream_list_destinations`, `stream_create_destination`, … | read/write | Destination CRUD. |
| `stream_list_pipelines`, `stream_create_pipeline`, … | read/write | Pipeline CRUD. |
| `stream_list_routes`, `stream_create_route`, … | read/write | Route CRUD. |
| `stream_commit`, `stream_deploy`, `stream_restart` | write | Deploy and restart. |

### Cribl Edge (`edge_*`, ~199 tools)

The same shape as Stream applied to the Edge product — outposts, projects, connections, mappings, sources, destinations, pipelines, routes, functions, lookups, parsers, schemas, samples, scripts, plus version / upgrade / activate / restart / capture / preview / test operations.

Representative tools:

| Tool | Action | Purpose |
|------|--------|---------|
| `edge_list_outposts`, `edge_get_outpost`, … | read | Edge outpost (agent) topology. |
| `edge_list_projects`, `edge_create_project`, … | read/write | Edge projects. |
| `edge_list_connections`, `edge_create_connection`, … | read/write | Connections between projects. |
| `edge_list_mappings`, `edge_create_mapping`, … | read/write | Edge mapping rules. |
| `edge_capture`, `edge_preview`, `edge_test` | read | Capture, preview, and test events along a pipeline. |
| `edge_deploy`, `edge_activate`, `edge_restart`, `edge_upgrade` | write | Lifecycle operations on edge fleets. |
| `edge_clickhouse`, `edge_query` | read | Query edge-resident data. |

### Cribl Lake (`lake_*`, ~16 tools)

Lake dataset CRUD, retention, and lake-specific connections.

### Cribl Search (`search_*`, ~19 tools)

Search definitions, saved searches, and search execution against the Cribl Lake / federated sources.

### Management Plane (`mgmt_*`, ~10 tools)

Tenant / management-plane operations that span products: capabilities, data-policy enforcement, fleet-wide health and rollout controls.

## Operational Notes

- **Administrative surface.** Every Cribl primitive — sources, destinations, pipelines, routes, secrets, certificates, RBAC, system settings — is mutable through this plugin. Treat it like an admin console; bind narrowly and audit aggressively.
- **Workspace scoping is upstream.** `X-Cribl-Base-Url` determines which Cribl Cloud workspace the plugin acts against. Studio should scope this header per agent / conversation to prevent cross-workspace leakage.
- **OAuth2 token caching.** When client-credentials are supplied the host caches the bearer between calls within the request scope; no plugin-side caching is involved. When `X-Cribl-Token` is supplied directly, the host attaches it as-is.
- **Commit / deploy is a privileged action.** `stream_commit`, `stream_deploy`, `edge_deploy`, `edge_activate`, and friends push configuration to running fleets. Restrict these tools to agents intended to perform configuration changes; prefer human-in-the-loop confirmation.
- **GitOps integration.** If the workspace is GitOps-backed, edits should flow through Git, not through the API. Use `get_git_settings` to see whether the workspace has GitOps enabled before binding the write tools.
- **Surface size.** With ~529 tools, agent prompt budgets are the main practical constraint. Bind only the tool subset relevant to a given agent's task rather than the whole catalog.
- **Reference docs.** [Cribl Cloud REST API](https://docs.cribl.io/api/).
