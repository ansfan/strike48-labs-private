---
title: Joe Security Sandbox
description: MCP integration for Joe Sandbox malware analysis — sample submission, report retrieval, and analysis search.
nav_order: 9
parent: "Construct MCP Catalog"
---

| | |
|---|---|
| **Slug** | `joe-security-sandbox` |
| **Category** | Sandbox |
| **Maturity** | Beta |
| **Auth Type** | API key |

## Summary

MCP integration with [Joe Sandbox](https://www.joesecurity.org/) (cloud or on-prem) using the Joe Sandbox API v2. Lets a Prospector Studio agent submit files, URLs, or full cookbooks for deep malware analysis; check status; retrieve reports; and search prior analyses by hash, filename, or URL.

This plugin is **read-write** — it can submit and delete samples and analyses. Bind it to agents only when that level of authority is intended.

## Capabilities

- Submit files, URLs, file URLs, and custom cookbooks for analysis.
- List and search prior submissions and analyses; retrieve full reports.
- Delete submissions and analyses.
- Check sandbox health, server info, supported analysis systems, languages, locales, and LIA countries.
- Read account info including remaining quota and permissions.

## Required Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-JoeSandbox-Base-Url` | yes | Joe Sandbox instance URL (e.g. `https://jbxcloud.joesecurity.org` or your on-prem URL). |
| `X-JoeSandbox-Api-Key` | yes | Joe Sandbox API key. |

## Allowed Hosts

`*` — outbound is gated only by the base-URL header. Use a tightly-scoped network policy upstream of Studio if access must be restricted to a specific Joe Sandbox tenant.

## Tools

### Submission

| Tool | Action | Purpose |
|------|--------|---------|
| `submit_sample` | write | Submit a file for analysis. |
| `submit_url` | write | Submit a URL for analysis. |
| `submit_sample_url` | write | Submit a file URL for the sandbox to download and analyze. |
| `submit_cookbook` | write | Submit a custom cookbook. |
| `get_submission_info` | read | Submission info including all analysis IDs. |
| `list_submissions` | read | List all submissions. |
| `delete_submission` | write | Delete a submission and its analyses. |

### Analysis

| Tool | Action | Purpose |
|------|--------|---------|
| `get_analysis_info` | read | Analysis info by web ID. |
| `list_analyses` | read | List analyses with pagination. |
| `search_analyses` | read | Search by hash, filename, or URL. |
| `download_report` | read | Download a report or resource. |
| `delete_analysis` | write | Delete an analysis. |

### Server & Account

| Tool | Action | Purpose |
|------|--------|---------|
| `server_online` | read | Server health check. |
| `server_info` | read | Server information and version. |
| `server_systems` | read | Available analysis systems and configurations. |
| `server_lia_countries` | read | Available localized internet anonymization countries. |
| `server_languages_and_locales` | read | Available languages and locales. |
| `account_info` | read | Account info including quota and permissions. |

## Invocation Example

```json
{
  "name": "submit_url",
  "arguments": {
    "url": "https://example.com/suspicious-page",
    "analysis_systems": ["w10x64"]
  }
}
```

## Operational Notes

- **Submissions consume quota.** Joe Sandbox accounts are quota-limited. Have agents consult `account_info` before bulk submissions, and prefer `search_analyses` to reuse prior reports for known hashes.
- **Asynchronous flow.** Submission tools return a web ID; results land later. Agents should poll with `get_analysis_info` rather than blocking on submission.
- **Open allowed-hosts list.** The plugin's allowed_hosts is `*`; the base-URL header is what scopes outbound. Make sure the header is set per-conversation so an agent can't redirect calls.
- **Reference docs.** [Joe Sandbox API v2](https://jbxcloud.joesecurity.org/api).
