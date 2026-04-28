---
title: VirusTotal
description: MCP integration for VirusTotal — file, URL, domain, and IP analysis plus threat intel, graphs, and collections.
nav_order: 15
parent: "Construct MCP Catalog"
---

| | |
|---|---|
| **Slug** | `virus-total` |
| **Category** | Threat Intelligence |
| **Maturity** | Beta |
| **Auth Type** | API key |

## Summary

MCP integration with the [VirusTotal API v3](https://docs.virustotal.com/reference/overview). Lets a Prospector Studio agent enrich and reason about IOCs: pull file / URL / domain / IP analysis reports, submit new files and URLs for scanning, inspect sandbox behavior and MITRE ATT&CK technique mapping, browse and contribute community comments and votes, run intelligence search, and create / read VirusTotal Graph visualizations and IOC collections.

This plugin is **read-write** — it can submit files / URLs for scanning, post comments, cast community votes, delete your own comments, and create graphs and collections. Bind it to agents only when those actions are intended.

## Capabilities

- File analysis: hash lookup, upload (≤32 MB or via dedicated upload URL for larger), rescan, sandbox behavior reports and summaries, MITRE ATT&CK technique mapping, Sigma rule results, comments and votes.
- URL analysis: submit, look up by ID, rescan, comments, votes.
- Domain analysis: report (WHOIS, DNS, detections), comments, votes.
- IP analysis: report (geolocation, ASN, detections), comments, votes.
- Comments: latest comments across all IOC types, get / delete a specific comment.
- Intelligence search across files / URLs / domains / IPs / comments.
- Graphs: search, read, create.
- Collections: create, read.
- DNS resolution objects (domain ↔ IP mappings).
- Threat-category lookup.

## Required Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-VirusTotal-Api-Key` | yes | VirusTotal API key. Premium / Enterprise keys are required for some endpoints (Intelligence search, Graph creation, large uploads). |

## Allowed Hosts

`www.virustotal.com`

## Tools

The plugin advertises 38 MCP tools, organized below by IOC type and capability domain.

### Files

| Tool | Action | Purpose |
|------|--------|---------|
| `get_file_report` | read | File report by hash (detection results from 70+ engines). |
| `upload_file` | write | Upload a file (≤32 MB). |
| `get_upload_url` | read | Get a special upload URL for files larger than 32 MB. |
| `rescan_file` | write | Re-analyze a previously submitted file. |
| `get_file_behavior` | read | Sandbox behavior reports. |
| `get_file_behavior_summary` | read | Summarized sandbox behavior. |
| `get_file_mitre_attack` | read | MITRE ATT&CK techniques observed in sandboxing. |
| `get_file_sigma_results` | read | Sigma rule analysis results. |
| `get_file_comments` | read | Community comments. |
| `add_file_comment` | write | Add a community comment. |
| `get_file_votes` | read | Community votes. |
| `add_file_vote` | write | Vote on a file (harmless / malicious). |

### URLs

| Tool | Action | Purpose |
|------|--------|---------|
| `scan_url` | write | Submit a URL for scanning. |
| `get_url_report` | read | URL report (vendor verdicts). |
| `rescan_url` | write | Re-analyze a previously submitted URL. |
| `get_url_comments` | read | Community comments. |
| `add_url_comment` | write | Add a community comment. |
| `get_url_votes` | read | Community votes. |

### Domains

| Tool | Action | Purpose |
|------|--------|---------|
| `get_domain_report` | read | Domain report (WHOIS, DNS, detections). |
| `get_domain_comments` | read | Community comments. |
| `add_domain_comment` | write | Add a community comment. |
| `get_domain_votes` | read | Community votes. |

### IP Addresses

| Tool | Action | Purpose |
|------|--------|---------|
| `get_ip_report` | read | IP report (geolocation, ASN, detections). |
| `get_ip_comments` | read | Community comments. |
| `add_ip_comment` | write | Add a community comment. |
| `get_ip_votes` | read | Community votes. |

### Comments & Analysis

| Tool | Action | Purpose |
|------|--------|---------|
| `get_latest_comments` | read | Latest community comments across all IOC types. |
| `get_comment` | read | Get a comment by ID. |
| `delete_comment` | write | Delete one of your own comments. |
| `get_analysis` | read | Status / results of a file or URL analysis by analysis ID. |
| `get_threat_categories` | read | Popular VirusTotal threat categories. |

### Intelligence, Graphs & Collections

| Tool | Action | Purpose |
|------|--------|---------|
| `intelligence_search` | read | Search files, URLs, domains, IPs, and comments (Premium). |
| `search_graphs` | read | Search Graph visualizations. |
| `get_graph` | read | Get a Graph by ID. |
| `create_graph` | write | Create a Graph with IOC nodes and links. |
| `create_collection` | write | Create an IOC collection. |
| `get_collection` | read | Get a collection. |
| `get_resolution` | read | DNS resolution object (domain ↔ IP). |

## Invocation Example

```json
{
  "name": "get_file_report",
  "arguments": {
    "hash": "44d88612fea8a8f36de82e1278abb02f"
  }
}
```

## Operational Notes

- **API tier matters.** Public free keys are heavily rate-limited (4 requests/minute). Premium / Enterprise keys are required for `intelligence_search`, `create_graph`, and uploads above 32 MB. Bind tools that depend on those endpoints only on instances with the right key tier.
- **Submissions are public by default.** Files and URLs uploaded to VirusTotal become visible to other VT customers under the Premium API. Do not bind `upload_file` / `scan_url` / `submit_*` tools to agents that handle sensitive customer data unless the customer has explicitly accepted that.
- **Async results.** `upload_file`, `rescan_file`, `scan_url`, and `rescan_url` return an `analysis_id`. Agents should poll with `get_analysis` rather than blocking on submission.
- **Voting / commenting is community-visible.** `add_*_comment` and `add_*_vote` write to the public VirusTotal community. Restrict these to agents with explicit human-in-the-loop oversight.
- **Reference docs.** [VirusTotal API v3 reference](https://docs.virustotal.com/reference/overview).
