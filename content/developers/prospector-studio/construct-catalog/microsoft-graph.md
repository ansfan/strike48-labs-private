---
title: Microsoft Graph
description: MCP integration for Microsoft Graph — users, mail, security alerts, devices, groups, sign-in logs, conditional access, and incidents.
nav_order: 10
parent: "Construct MCP Catalog"
---

| | |
|---|---|
| **Slug** | `microsoft-graph` |
| **Category** | Identity |
| **Maturity** | Beta |
| **Auth Type** | OAuth2 client credentials *(or pre-fetched bearer token)* |

## Summary

Full-surface MCP integration with the [Microsoft Graph API](https://learn.microsoft.com/graph/) (`v1.0`). Lets a Prospector Studio agent investigate and act across the Microsoft 365 / Entra estate: read and manage users and groups; read mailboxes and send mail; triage Microsoft Graph security alerts and Microsoft 365 Defender incidents; manage registered and Intune-managed devices; pull sign-in and audit logs; review and modify conditional-access policies and named locations; inspect service principals, applications, and domains; and run arbitrary Graph queries.

This plugin is **read-write**. Several tools mutate tenant state (user CRUD, mail send/delete/move, device remote lock and wipe, group membership changes, security alert / incident updates, conditional-access policy and named-location updates, sign-in session revocation). Bind it to agents only when that level of authority is intended.

## Capabilities

- User CRUD; manager / direct reports / membership lookups; revoke all sign-in sessions.
- Mailbox read; send / delete / move messages.
- Security alert and Microsoft 365 Defender incident read / update.
- Device read; Intune managed-device read, remote lock, and wipe.
- Group read, member listing, member add / remove.
- Sign-in log and directory audit log read.
- Directory roles, role members, service principals, app role assignments, application registrations, and domains.
- Conditional access policies and named locations — read and update.
- Arbitrary Graph requests via `graph_explorer`.

## Required Headers

You can authenticate with **either** a pre-fetched bearer token **or** the OAuth2 client-credentials triple. If both are present, the bearer token takes precedence.

| Header | Required | Description |
|--------|----------|-------------|
| `X-MicrosoftGraph-OAuth-Token` | optional | Pre-fetched Microsoft Graph bearer token. Skips the client-credentials exchange. |
| `X-MicrosoftGraph-Tenant-Id` | yes (when no bearer token) | Microsoft Entra tenant ID (directory ID). |
| `X-MicrosoftGraph-Client-Id` | yes (when no bearer token) | Microsoft Entra application (client) ID. |
| `X-MicrosoftGraph-Client-Secret` | yes (when no bearer token) | Microsoft Entra client secret. |

When the client-credentials triple is supplied, the host performs the OAuth2 token exchange against `https://login.microsoftonline.com/<tenant>/oauth2/v2.0/token` with scope `https://graph.microsoft.com/.default` and attaches the resulting bearer token to outbound calls — plugin code never sees the raw client secret.

The Entra application must be granted the Graph application permissions covering the surfaces it will use: at minimum `User.Read.All`, `User.ReadWrite.All`, `Mail.Send`, `Mail.ReadWrite`, `SecurityEvents.ReadWrite.All`, `SecurityIncident.ReadWrite.All`, `Device.Read.All`, `DeviceManagementManagedDevices.PrivilegedOperations.All` (for remote lock / wipe), `Group.ReadWrite.All`, `AuditLog.Read.All`, `Policy.ReadWrite.ConditionalAccess`, `Application.Read.All`, and `Domain.Read.All`. Trim to what each agent actually needs.

## Allowed Hosts

`graph.microsoft.com`, `login.microsoftonline.com`

## Tools

The plugin advertises 52 MCP tools, organized below by capability domain.

### Users

| Tool | Action | Purpose |
|------|--------|---------|
| `list_users` | read | List directory users. |
| `get_user` | read | Get user by ID or UPN. |
| `create_user` | write | Create a directory user. |
| `update_user` | write | Update user properties. |
| `delete_user` | write | Delete a user. |
| `get_manager` | read | Get a user's manager. |
| `list_direct_reports` | read | List a user's direct reports. |
| `list_user_member_of` | read | Groups and directory roles a user belongs to. |
| `revoke_sign_in_sessions` | write | Invalidate all sign-in sessions for a user. |

### Mail

| Tool | Action | Purpose |
|------|--------|---------|
| `list_messages` | read | List messages in a mailbox. |
| `get_message` | read | Get a message. |
| `send_message` | write | Send an email. |
| `delete_message` | write | Delete a message. |
| `move_message` | write | Move a message to another folder. |

### Security Alerts & Incidents

| Tool | Action | Purpose |
|------|--------|---------|
| `list_security_alerts` | read | List Graph security alerts. |
| `get_security_alert` | read | Get a security alert. |
| `update_security_alert` | write | Update a security alert. |
| `list_incidents` | read | List Microsoft 365 Defender incidents. |
| `get_incident` | read | Get an incident. |
| `update_incident` | write | Update an incident. |

### Devices

| Tool | Action | Purpose |
|------|--------|---------|
| `list_devices` | read | List registered devices. |
| `get_device` | read | Get a registered device. |
| `list_managed_devices` | read | List Intune managed devices. |
| `get_managed_device` | read | Get a managed device. |
| `remote_lock` | write | Remotely lock a managed device. |
| `wipe_device` | write | Wipe a managed device (factory reset). |

### Groups

| Tool | Action | Purpose |
|------|--------|---------|
| `list_groups` | read | List directory groups. |
| `get_group` | read | Get a group. |
| `list_group_members` | read | List group members. |
| `add_group_member` | write | Add a member. |
| `remove_group_member` | write | Remove a member. |

### Sign-Ins & Audit Logs

| Tool | Action | Purpose |
|------|--------|---------|
| `list_sign_ins` | read | Sign-in logs for the tenant. |
| `get_sign_in` | read | Specific sign-in log entry. |
| `list_directory_audits` | read | Directory audit log events. |
| `get_directory_audit` | read | Specific audit log entry. |

### Directory Roles & Service Principals

| Tool | Action | Purpose |
|------|--------|---------|
| `list_directory_roles` | read | List activated directory roles. |
| `get_directory_role` | read | Get a directory role. |
| `list_directory_role_members` | read | Members of a directory role. |
| `list_service_principals` | read | List service principals. |
| `get_service_principal` | read | Get a service principal. |
| `list_sp_app_role_assignments` | read | App role assignments for a service principal. |

### Conditional Access

| Tool | Action | Purpose |
|------|--------|---------|
| `list_conditional_access_policies` | read | List policies. |
| `get_conditional_access_policy` | read | Get a policy. |
| `update_conditional_access_policy` | write | Update a policy. |
| `list_named_locations` | read | List named locations. |
| `get_named_location` | read | Get a named location. |
| `update_named_location` | write | Update a named location. |

### Applications & Domains

| Tool | Action | Purpose |
|------|--------|---------|
| `list_applications` | read | List application registrations. |
| `get_application` | read | Get an application registration. |
| `list_domains` | read | List tenant domains. |
| `get_domain` | read | Get a domain. |

### Escape Hatch

| Tool | Action | Purpose |
|------|--------|---------|
| `graph_explorer` | read/write | Make an arbitrary Microsoft Graph request. |

## Operational Notes

- **`graph_explorer` is unbounded.** It can call any Graph endpoint the credentials are scoped for, including endpoints not surfaced as named tools. Treat it as the most-privileged tool and bind it only to agents that need exploratory Graph access.
- **`wipe_device` and `remote_lock` are irreversible at the device.** Wipe in particular requires the privileged management permission and will factory-reset the device. Strongly prefer narrowly-scoped agents and human-in-the-loop confirmation.
- **Tenant scoping is upstream.** The Entra app + tenant ID determine which tenant is queried. Studio should scope credential injection per conversation or agent so one agent can't reach another tenant.
- **Token caching.** When the OAuth2 path is used, the host caches the bearer between calls within the request scope; no plugin-side caching is involved.
- **Reference docs.** [Microsoft Graph REST API v1.0](https://learn.microsoft.com/graph/api/overview).
