---
title: DNS
description: MCP integration for DNS resolution, reverse lookups, and RDAP queries via public resolvers.
nav_order: 8
parent: "Construct MCP Catalog"
---

| | |
|---|---|
| **Slug** | `dns` |
| **Category** | Network Security |
| **Maturity** | Beta |
| **Auth Type** | None (public APIs) |

## Summary

Read-only MCP integration for DNS resolution and registration lookups. Resolution uses [Google Public DNS over HTTPS](https://developers.google.com/speed/public-dns/docs/doh); domain / IP registration metadata uses public RDAP (Verisign and rdap.org). Lets a Prospector Studio agent answer "what does this domain resolve to," "who owns this address," and "what mail / nameserver records does this domain publish."

## Capabilities

- Resolve domains to A, AAAA, CNAME, MX, NS, TXT, and other record types.
- Reverse-lookup an IP to a hostname.
- Targeted record-type lookups (MX, TXT, NS, CNAME, SOA).
- Aggregate lookup that returns all common record types in one call.

## Required Headers

All resolvers used by this plugin are public. **No authentication headers required.**

## Allowed Hosts

`dns.google`, `rdap.org`, `rdap.verisign.com`

## Tools

| Tool | Action | Purpose |
|------|--------|---------|
| `resolve` | read | Resolve a domain to DNS records (A, AAAA, CNAME, MX, NS, TXT, etc.). |
| `reverse_lookup` | read | Reverse DNS — find the hostname for an IP. |
| `mx_lookup` | read | MX records — mail servers and priorities. |
| `txt_lookup` | read | TXT records — useful for SPF, DKIM, DMARC, domain verification. |
| `ns_lookup` | read | NS records — authoritative nameservers. |
| `cname_lookup` | read | CNAME records — domain aliases. |
| `soa_lookup` | read | SOA record — zone serial, refresh intervals, admin contact. |
| `any_lookup` | read | All available DNS records in one query. |

## Invocation Example

```json
{
  "name": "resolve",
  "arguments": {
    "name": "example.com",
    "type": "A"
  }
}
```

## Operational Notes

- **Resolver perspective.** Lookups go through Google Public DNS — results reflect Google's resolver view of the public DNS, not split-horizon or internal DNS. Don't use this plugin to resolve internal hostnames.
- **No authoritative source for `any`.** Most authoritative servers refuse `ANY` queries; `any_lookup` aggregates targeted queries instead. Use it for breadth, not as proof of an exhaustive record set.
- **RDAP for registration metadata.** Domain / IP ownership comes from RDAP, which is public and rate-limited per registrar. Bulk enrichment should batch and back off.
- **Reference docs.** [Google Public DNS DoH](https://developers.google.com/speed/public-dns/docs/doh) · [RDAP overview](https://www.icann.org/rdap).
