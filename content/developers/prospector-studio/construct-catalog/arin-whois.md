---
title: ARIN Whois
description: MCP integration for ARIN Whois IP, organization, and network registration lookups.
nav_order: 2
parent: "Construct MCP Catalog"
---

| | |
|---|---|
| **Slug** | `arin-whois` |
| **Category** | Data Enrichment |
| **Maturity** | Beta |
| **Auth Type** | None (public API) |

## Summary

Read-only MCP integration with the [ARIN Whois RESTful API](https://www.arin.net/resources/registry/whois/rws/api/). Lets a Prospector Studio agent enrich IP addresses with registration metadata — owning organization, network range, contact handles — directly from the authoritative North American regional registry.

## Capabilities

- Look up the ARIN Whois record for an IPv4 or IPv6 address.
- Look up an organization record by ARIN handle.
- Look up a network record by ARIN handle.

## Required Headers

The ARIN Whois RESTful API is public. **No authentication headers required.**

## Allowed Hosts

`whois.arin.net`

## Tools

| Tool | Action | Purpose |
|------|--------|---------|
| `lookup_ip` | read | Whois registration record for an IP address. |
| `lookup_org` | read | Organization details by ARIN handle. |
| `lookup_net` | read | Network details by ARIN handle. |

## Invocation Example

```json
{
  "name": "lookup_ip",
  "arguments": {
    "ip": "8.8.8.8"
  }
}
```

## Operational Notes

- **Authoritative for ARIN region only.** ARIN covers North America, parts of the Caribbean, and Antarctica. For addresses delegated to RIPE, APNIC, LACNIC, or AFRINIC the response will redirect to the appropriate RIR — agents should be prepared to follow up against another data source for full coverage.
- **Public API; rate-limited.** ARIN does not require auth but enforces fair-use limits. High-volume bulk enrichment should batch and back off on errors.
- **Reference docs.** [ARIN Whois RESTful API](https://www.arin.net/resources/registry/whois/rws/api/).
