---
title: Abnormal Security
description: MCP integration for Abnormal Security email threat detection, case management, and remediation.
nav_order: 1
parent: "Construct MCP Catalog"
---

| | |
|---|---|
| **Slug** | `abnormal-security` |
| **Category** | Email Security |
| **Maturity** | Alpha |
| **Auth Type** | Bearer token |

## Summary

MCP integration with the [Abnormal Security](https://abnormalsecurity.com/) email-security platform. Lets a Prospector Studio agent triage and respond to email threats: enumerate detected threats, manage cases, work through the abuse-mailbox queue, look up vendor and employee risk signals, and run search-and-remediate flows on individual messages.

This plugin is **read-write** — it can remediate threats, take action on cases, and remediate messages. Bind it to agents only when that level of authority is intended.

## Capabilities

- List, read, remediate, and check status on Abnormal threats; download threat-log CSV exports.
- List and act on cases; pull case analysis and timelines.
- Read and triage abuse-mailbox campaigns and unanalyzed user reports.
- Look up vendor risk levels, contact info, activity timelines, and vendor cases.
- Pull employee profile information, behavioral analysis, and login history.
- Search messages across `abnormal` and `quarantine` sources and remediate them in bulk.
- Submit and list Detection 360 misclassification reports.
- Read portal audit logs.

## Required Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-AbnormalSecurity-Base-Url` | yes | Regional API base URL — `https://api.abnormalplatform.com` (US) or `https://eu.rest.abnormalsecurity.com` (EU). |
| `X-AbnormalSecurity-Token` | yes | Abnormal Security API token. Provisioned per-tenant from the portal. |

## Tools

### Threats

| Tool | Action | Purpose |
|------|--------|---------|
| `list_threats` | read | List detected threats with optional filters. |
| `get_threat` | read | Fetch a threat with its messages. |
| `manage_threat` | write | Remediate or unremediate a threat. |
| `get_threat_action_status` | read | Check status of a remediation action. |
| `get_threat_attachments` | read | Attachment details for a threat campaign. |
| `get_threat_links` | read | Link details for a threat campaign. |
| `export_threats_csv` | read | Threat-log CSV export (max 14-day window). |

### Cases

| Tool | Action | Purpose |
|------|--------|---------|
| `list_cases` | read | List cases. |
| `get_case` | read | Fetch a case. |
| `manage_case` | write | Take action on a case. |
| `get_case_action_status` | read | Check status of a case action. |
| `get_case_analysis_and_timeline` | read | Analysis insights and event timeline. |

### Abuse Mailbox

| Tool | Action | Purpose |
|------|--------|---------|
| `list_abuse_mailbox_campaigns` | read | List AI Security Mailbox campaigns. |
| `get_abuse_mailbox_campaign` | read | Fetch a specific campaign. |
| `list_unanalyzed_abuse_mailbox` | read | User-submitted reports Abnormal did not analyze. |

### Vendors

| Tool | Action | Purpose |
|------|--------|---------|
| `list_vendors` | read | List tracked vendor domains. |
| `get_vendor_details` | read | Risk levels and contact info for a vendor. |
| `get_vendor_activity` | read | Vendor event timeline and engagement. |
| `list_vendor_cases` | read | List vendor cases. |
| `get_vendor_case_details` | read | Insights and timeline for a vendor case. |

### Employees

| Tool | Action | Purpose |
|------|--------|---------|
| `get_employee_information` | read | Name, title, manager. |
| `get_employee_identity_analysis` | read | Behavioral analysis (IP / login histograms). |
| `get_employee_logins` | read | Login info for the last 30 days (CSV). |

### Search & Remediate

| Tool | Action | Purpose |
|------|--------|---------|
| `search_messages` | read | Search across `abnormal` and `quarantine` sources. |
| `remediate_messages` | write | Delete, restore to inbox, or submit to Detection 360. |
| `list_search_activities` | read | Search/remediation activity log. |
| `get_search_activity_status` | read | Status of a search/remediation activity. |

### Detection 360 & Audit

| Tool | Action | Purpose |
|------|--------|---------|
| `list_detection360_reports` | read | Missed-attack and false-positive reports. |
| `submit_detection360_report` | write | Submit a misclassification report. |
| `list_audit_logs` | read | Portal audit logs (max 90-day history). |

## Operational Notes

- **Read-write surface.** `manage_threat`, `manage_case`, and `remediate_messages` mutate Abnormal state. Scope per agent and prefer narrowly-permissioned tokens.
- **Region selection.** Set the base URL header to match the customer's tenant region. Tokens are not portable across regions.
- **Time-windowed exports.** `export_threats_csv` is capped to 14 days; `list_audit_logs` to 90 days. Build agent flows that page through windows rather than asking for unbounded history.
- **Reference docs.** [Abnormal Security API documentation](https://app.abnormalsecurity.com/docs).
