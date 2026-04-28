---
title: Orca Security
description: MCP integration for the Orca Security CNAPP — read-only cloud risk intelligence, attack paths, vulnerabilities, compliance, and IaC findings.
nav_order: 11
parent: "Construct MCP Catalog"
---

| | |
|---|---|
| **Slug** | `orca-security` |
| **Category** | CNAPP / Cloud Security |
| **Maturity** | Beta |
| **Auth Type** | API key (`Authorization: Token …`) |

## Summary

Read-only MCP integration with the [Orca Security](https://orca.security/) CNAPP. Lets a Prospector Studio agent answer cloud-security and posture questions: walk alerts and attack paths, inspect asset risk and runtime context, look up CVEs and affected assets, query compliance posture by framework, browse cloud accounts and the resource inventory, and review shift-left findings (IaC misconfigurations and container-image risks).

This plugin is **read-only by design** — every write, remediation, and configuration-change operation is permanently blocked at the manifest level. Bind it freely to investigative agents.

## Capabilities

Organized into 6 modules of read-only tools (30 total):

- **Alerts & Risks** — paginate alerts, fetch alert detail with timeline and recommendations, enumerate alert categories, look up an asset's Orca risk score with contributing factors, walk active attack-path chains.
- **Assets** — paginate the asset inventory, fetch full asset detail, list per-asset vulnerabilities, retrieve per-asset compliance posture, list active alerts on an asset, get runtime context (network exposure, internet-facing status, data sensitivity).
- **Vulnerabilities** — paginate vulnerabilities by severity / CVSS / status, fetch vulnerability detail with remediation guidance, browse the CVE catalogue with CVSS / EPSS / CISA KEV data, fetch CVE detail, list assets affected by a CVE.
- **Compliance** — list enabled frameworks (SOC 2, CIS, NIST, PCI-DSS, etc.), get aggregate posture per framework, paginate findings, fetch a control with its mapped alerts, list alerts linked to a framework.
- **Cloud Accounts & Inventory** — list onboarded cloud accounts (no credentials exposed), get account detail, paginate the cloud resource inventory, fetch a resource record.
- **Shift-Left** — list IaC misconfigurations (Terraform, CloudFormation, ARM, Pulumi, Kubernetes), fetch IaC risk detail with file path and line reference, list container-image scan findings, fetch container-image detail with layers, packages, and base-image risk.

## Required Headers

| Header | Required | Description |
|--------|----------|-------------|
| `X-Orca-Api-Key` | yes | Orca Security API key. The host attaches it as `Authorization: Token <key>` on outbound calls. |
| `X-Orca-Base-Url` | optional | Override the API base. Defaults to `https://api.orcasecurity.io/api`. Set this for non-US tenants. |

## Allowed Hosts

`*.orcasecurity.io`

## Tools

### Alerts & Risks

| Tool | Purpose |
|------|---------|
| `list_alerts` | Paginated alerts with severity / status / category / cloud account / date filters; sorted by OrcaScore desc. |
| `get_alert` | Full alert detail with asset context, timeline, recommendations, and compliance mappings. |
| `list_alert_categories` | Enumerate alert categories with counts. |
| `get_risk_score` | Per-asset Orca risk score with contributing factor breakdown (blast radius, sensitivity, access paths). |
| `list_attack_paths` | Active attack-path chains; optionally filtered to paths that include a given asset. |
| `get_attack_path_details` | Full attack-path detail with nodes, edges, lateral-movement vectors, and risk context. |

### Assets

| Tool | Purpose |
|------|---------|
| `list_assets` | Paginated asset inventory with type / cloud account / region / tag filters. |
| `get_asset` | Full asset detail (metadata, tags, network config, risk posture, OS, runtime metadata). |
| `list_asset_vulnerabilities` | CVEs and findings scoped to a single asset; severity-filtered. |
| `get_asset_compliance` | Per-asset compliance posture across applicable frameworks. |
| `list_asset_risks` | All active alerts associated with an asset. |
| `get_asset_context` | Runtime context (network exposure, internet-facing, data sensitivity, access paths). |

### Vulnerabilities

| Tool | Purpose |
|------|---------|
| `list_vulnerabilities` | Paginated vulnerabilities with severity / CVSS / status filters. |
| `get_vulnerability` | Full vulnerability record with remediation guidance and affected packages. |
| `list_cves` | CVE catalogue with CVSS, EPSS probability, and CISA KEV membership. |
| `get_cve_details` | Full CVE record (description, CVSS vector, EPSS, KEV status, references, affected packages). |
| `list_vulnerability_affected_assets` | All assets affected by a CVE — useful for blast-radius assessment. |

### Compliance

| Tool | Purpose |
|------|---------|
| `list_compliance_frameworks` | All enabled frameworks (SOC 2, CIS, NIST, PCI-DSS, etc.). |
| `get_compliance_posture` | Aggregate pass/fail posture for a framework. |
| `list_compliance_findings` | Paginated findings per framework with status / severity filters. |
| `get_compliance_control` | Control detail with description, requirement text, status, and mapped alerts. |
| `list_compliance_alerts` | All active alerts linked to a framework. |

### Cloud Accounts & Inventory

| Tool | Purpose |
|------|---------|
| `list_cloud_accounts` | Onboarded cloud accounts (provider, region coverage, scan status — no credentials returned). |
| `get_cloud_account` | Cloud account detail. |
| `list_cloud_resources` | Paginated cloud resource inventory; filterable by type / account / region. |
| `get_cloud_resource` | Full cloud resource record with configuration details and risk posture. |

### Shift-Left (IaC & Container Images)

| Tool | Purpose |
|------|---------|
| `list_iac_risks` | IaC misconfigurations across Terraform / CloudFormation / ARM / Pulumi / Kubernetes; severity-filtered. |
| `get_iac_risk` | IaC risk detail with file path, line reference, fix guidance, and related compliance controls. |
| `list_container_image_risks` | Container image scan findings; filterable by registry / severity / image name. |
| `get_container_image_details` | Container image detail (layers, packages, CVEs, base-image risk, registry metadata). |

## Invocation Example

```json
{
  "name": "list_alerts",
  "arguments": {
    "severity": "critical,high",
    "status": "open",
    "cloud_provider": "aws",
    "limit": 50
  }
}
```

## Operational Notes

- **Read-only by design.** All write, remediation, and configuration-change operations are blocked at the manifest level. The plugin cannot acknowledge / dismiss alerts or modify any Orca-side state. Pair it with another tool (e.g. a ticketing connector) if you need agent-driven follow-through.
- **Tenant scoping is upstream.** The API key passed via `X-Orca-Api-Key` determines which Orca tenant is queried. Studio should scope credential injection per conversation or agent so one agent can't reach another tenant's data.
- **Region selection.** Defaults to the US endpoint; set `X-Orca-Base-Url` for EU or other regional tenants.
- **Query DSL.** Several list tools (`list_alerts`, `list_assets`, `list_vulnerabilities`, `list_cloud_resources`) are backed by Orca's query DSL (`POST /api/query`) — pagination is offset-based and capped at 1000 per page. Build agent flows that page through windows rather than asking for unbounded result sets.
- **Reference docs.** [Orca Security API documentation](https://docs.orca.security/).
