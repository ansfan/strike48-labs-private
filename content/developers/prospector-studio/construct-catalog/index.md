---
title: Construct MCP Catalog
description: Glossary of MCP plugins served by Strike Construct, with per-plugin reference docs.
nav_order: 2
parent: "For Developers"
---

This catalog is a per-plugin reference for the MCP integrations served by [Strike Construct](/prospector-studio/guides/mcp-servers/construct/). Each entry documents what the plugin does, the credentials Prospector Studio must pass through, and the tools the plugin advertises over MCP.

## How to Use This Catalog

Each plugin page is written for an integrator wiring the tool into a Prospector Studio agent. Pages document:

- **What it does** — a short summary and the questions the integration is meant to answer.
- **Category & maturity** — the integration's domain (EDR, SIEM, SOAR, etc.) and stability level.
- **Required headers** — the inbound headers Studio must include on `tools/call` requests so the host can attach the right credentials downstream.
- **Tools** — every tool the plugin advertises, with input schema, parameter notes, and an invocation example.
- **Operational notes** — region selection, pagination, rate-limit considerations, and anything else worth knowing before binding the tool to an agent.

Pages deliberately stay at the integration-contract level. They do not describe Construct's internal plugin format, host-side header rewriting, or sandbox capabilities — those belong to the plugin authoring docs, not the catalog.

## Plugins

| Plugin | Category | Maturity |
|--------|----------|----------|
| [Abnormal Security](/developers/prospector-studio/construct-catalog/abnormal-security/) | Email Security | Alpha |
| [ARIN Whois](/developers/prospector-studio/construct-catalog/arin-whois/) | Data Enrichment | Beta |
| [Cribl](/developers/prospector-studio/construct-catalog/cribl/) | Data Pipelines / Telemetry | — |
| [CrowdStrike Falcon](/developers/prospector-studio/construct-catalog/crowdstrike-falcon/) | EDR | Alpha |
| [CVE Lookup](/developers/prospector-studio/construct-catalog/cve-lookup/) | Vulnerability Intelligence | Beta |
| [Darktrace](/developers/prospector-studio/construct-catalog/darktrace/) | Network Detection & Response | Beta |
| [Devo Alerts](/developers/prospector-studio/construct-catalog/devo-alerts/) | SIEM | Alpha |
| [DNS](/developers/prospector-studio/construct-catalog/dns/) | Network Security | Beta |
| [Joe Security Sandbox](/developers/prospector-studio/construct-catalog/joe-security-sandbox/) | Sandbox | Beta |
| [Microsoft Graph](/developers/prospector-studio/construct-catalog/microsoft-graph/) | Identity | Beta |
| [Orca Security](/developers/prospector-studio/construct-catalog/orca-security/) | CNAPP / Cloud Security | Beta |
| [Rapid7 InsightVM Cloud](/developers/prospector-studio/construct-catalog/rapid7-insightvm-cloud/) | Vulnerability Management | Alpha |
| [Splunk](/developers/prospector-studio/construct-catalog/splunk/) | SIEM | Release |
| [Splunk Enterprise Security](/developers/prospector-studio/construct-catalog/splunk-enterprise-security/) | SIEM / SOAR | Release |
| [VirusTotal](/developers/prospector-studio/construct-catalog/virustotal/) | Threat Intelligence | Beta |

More entries will land here as plugins graduate out of preview.

## Preview

These plugins are loaded by Strike Construct but have not yet been validated for general use. They are listed here so integrators know what's available — full per-plugin documentation will land as each one graduates out of preview.

256 plugins.

| Plugin | Slug | Category | Tools |
|--------|------|----------|-------|
| Absolute | `absolute` | EDR | 12 |
| AbuseIPDB | `abuseipdb` | Data Enrichment | 7 |
| Accenture MSS | `accenture-mss` | Other | 5 |
| Active Directory | `active-directory` | Identity | 8 |
| Akamai | `akamai` | Network Security | 5 |
| Akamai API Gateway | `akamai-api-gateway` | Network Security | 17 |
| Alexa Web Information Service (Deprecated) | `alexa-web-information-service-deprecated` | Data Enrichment | 1 |
| AlienVault OTX | `alienvault-otx` | Threat Intel | 28 |
| AlienVault USM | `alienvault-usm` | SIEM | 13 |
| Amazon AWS | `amazon-aws` | Cloud | 17 |
| Amazon EC2 | `amazon-ec2` | Cloud | 22 |
| Amazon EC2 (Assumed Role) | `amazon-ec2-assumed-role` | Cloud | 7 |
| Amazon S3 | `amazon-s3` | Cloud | 21 |
| Anomali | `anomali` | Threat Intel | 8 |
| Anomali Match | `anomali-match` | Threat Intel | 5 |
| ANY.RUN | `anyrun` | Sandbox | 5 |
| Apache Kafka | `apache-kafka` | DevOps | 3 |
| Apility | `apility` | Data Enrichment | 11 |
| APIVoid | `apivoid` | Data Enrichment | 5 |
| Arbor Sightline | `arbor-sightline` | Network Security | 27 |
| ArcSight ESM | `arcsight-esm` | SIEM | 8 |
| Area 1 Security | `area-1-security` | Email Security | 6 |
| Atlassian | `atlassian` | — | 17 |
| AttackForge | `attackforge` | Vulnerability | 15 |
| AWS CloudTrail | `aws-cloudtrail` | SIEM | 15 |
| AWS CloudWatch Logs | `aws-cloudwatch-logs` | SIEM | 12 |
| AWS EKS | `aws-eks` | Cloud | 16 |
| AWS EKS (Assumed Role) | `aws-eks-assumed-role` | Cloud | 13 |
| AWS IAM | `aws-iam` | Cloud | 26 |
| AWS IAM (Assumed Role) | `aws-iam-assumed-role` | Cloud | 7 |
| AWS Iceberg | `iceberg` | — | 21 |
| AWS MCP Bridge | `aws-mcp-bridge` | — | 3 |
| AWS S3 | `aws-s3` | — | 33 |
| aws-elasticsearch | `aws-elasticsearch` | — | 8 |
| Azure Compute | `azure-compute` | Cloud | 17 |
| Azure Security Center | `azure-security-center` | Cloud Security | 19 |
| Azure Sentinel | `azure-sentinel` | SIEM | 41 |
| Azure Storage | `azure-storage` | Cloud | 7 |
| BeyondTrust | `beyond-trust` | Identity | 13 |
| Bitdefender | `bitdefender` | EDR | 14 |
| Blameless | `blameless` | SOAR | 15 |
| Box | `box` | Collaboration | 4 |
| C1fApp | `c1fapp` | Threat Intel | 4 |
| CA Service Desk | `ca-service-desk` | ITSM | 16 |
| Carbon Black Response | `carbon-black-response` | EDR | 9 |
| Carbon Black Response V2 | `carbon-black-response-v2` | EDR | 23 |
| Censys | `censys` | Threat Intel | 6 |
| Check Point Firewall | `checkpoint-firewall` | Network Security | 56 |
| CheckPhish AI | `checkphish-ai` | Email Security | 4 |
| CIRCL Threat Intelligence | `computer-incident-response-center-circl` | Threat Intel | 19 |
| Cisco AMP | `cisco-amp` | EDR | 13 |
| Cisco Firepower | `cisco-firepower` | Network Security | 19 |
| Cisco IronPort | `cisco-ironport` | Email Security | 5 |
| Cisco Secure Endpoint | `cisco-secure-endpoint` | EDR | 23 |
| Cisco Stealthwatch | `cisco-stealthwatch` | Network Security | 27 |
| Cisco Stealthwatch Enterprise | `cisco-stealthwatch-enterprise` | Network Security | 11 |
| Cisco Talos | `cisco-talos` | Threat Intel | 5 |
| Cisco Threat Grid | `cisco-threatgrid` | Threat Intel | 4 |
| Cisco Umbrella | `cisco-umbrella` | Network Security | 31 |
| Cisco Umbrella (Deprecated) | `cisco-umbrella-deprecated` | Network Security | 1 |
| Cisco Umbrella Investigate API | `cisco-umbrella-investigate-api` | Network Security | 32 |
| ClickSend | `clicksend` | Collaboration | 9 |
| Cloudflare | `cloudflare` | Network Security | 39 |
| Cloudflare (Deprecated) | `cloudflare-deprecated` | Network Security | 7 |
| CMDBuild | `cmdbuild` | ITSM | 14 |
| Code Eval | `code-eval` | — | 1 |
| Code Eval (Safe) | `code-eval-safe` | — | 1 |
| Confluence | `confluence` | Collaboration | 19 |
| Cortex XDR | `cortex-xdr` | EDR | 27 |
| Cortex XSOAR | `cortex-soar` | SOAR | 23 |
| CrowdStrike Falcon Host | `crowdstrike-falcon-host` | EDR | 5 |
| CRXcavator | `crxcavator` | Threat Intel | 5 |
| Cuckoo Sandbox | `cuckoo` | Sandbox | 19 |
| CyberArk EPM | `cyberark-epm` | Identity | 6 |
| Cybereason | `cybereason` | EDR | 9 |
| Cylance | `cylance` | EDR | 18 |
| Datadog | `datadog` | SIEM | 38 |
| Demisto | `demisto` | SOAR | 12 |
| Devo Collector | `devo-collector` | — | 27 |
| Devo Maduro | `devo-maduro` | — | 7 |
| Devo Relay Manager | `devo-relay` | — | 7 |
| Devo SIEM | `devo-siem` | — | 32 |
| Discord Knowledge Base | `discord-kb` | — | 3 |
| DomainTools | `domaintools` | Threat Intel | 22 |
| Dropbox | `dropbox` | Collaboration | 14 |
| Duo Security | `duo-security` | Identity | 34 |
| EasyVista | `easyvista` | ITSM | 8 |
| Elasticsearch | `elasticsearch` | SIEM | 28 |
| Emerging Threats | `emerging-threats` | Threat Intel | 7 |
| Exchange EWS | `exchange-ews` | Email Security | 14 |
| Exchange Online Graph API (Deprecated) | `exchange-online-graph-api-deprecated` | Email Security | 2 |
| Exchange Quarantine Messages | `exchange-quarantine-messages` | Email Security | 8 |
| Expel | `expel` | Other | 7 |
| Falcon Host Sandbox | `falcon-host-sandbox` | Sandbox | 5 |
| Farsight Security DNSDB | `farsight-security-dnsdb` | Threat Intel | 13 |
| Fidelis | `fidelis` | EDR | 13 |
| FireEye ETP | `fireeye-etp` | Email Security | 13 |
| FireEye Helix | `fireeye-helix` | EDR | 12 |
| Flashpoint | `flashpoint` | Threat Intel | 5 |
| Flashpoint Ignite | `flashpoint-ignite` | Threat Intel | 23 |
| Freshservice | `freshservice` | ITSM | 34 |
| GitHub | `github` | DevOps | 30 |
| GitHub App | `github-app` | DevOps | 26 |
| GitLab | `gitlab` | — | 72 |
| Google Bigtable | `google-bigtable` | Cloud | 13 |
| Google Calendar | `google-calendar` | Collaboration | 11 |
| Google Cloud Platform | `gcp` | — | 30 |
| Google Cloud Storage | `google-cloud-storage` | Cloud | 13 |
| Google Compute | `google-compute` | Cloud | 24 |
| Google Gemini | `google-gemini` | DevOps | 11 |
| Google Safe Browsing | `google-safebrowsing` | Threat Intel | 5 |
| Google SecOps | `google-secops` | — | 16 |
| Google Sheets | `google-sheets` | Collaboration | 12 |
| Google Stackdriver | `google-stackdriver` | SIEM | 13 |
| Grafana | `grafana` | — | 9 |
| Have I Been Pwned | `have-i-been-pwned` | Data Enrichment | 12 |
| HCL BigFix | `hcl-bigfix` | EDR | 12 |
| HubSpot | `hubspot` | — | 195 |
| Humio | `humio` | SIEM | 29 |
| Hybrid Analysis | `hybrid-analysis` | Sandbox | 22 |
| IBM OMNIbus via postemsg | `ibm-omnibus-via-postemsg` | SIEM | 5 |
| IBM QRadar | `ibm-qradar` | SIEM | 16 |
| IBM X-Force | `ibm-x-force` | Threat Intel | 5 |
| IMAP | `imap` | Email Security | 8 |
| Infoblox Threat Defence | `infoblox-threat-defence` | Network Security | 32 |
| Intezer | `intezer` | Threat Intel | 5 |
| IP Quality Score | `ip-quality-score` | Data Enrichment | 5 |
| IPStack | `ipstack` | Data Enrichment | 3 |
| Jamf | `jamf` | Other | 7 |
| JDBC | `jdbc` | Database | 6 |
| Jira | `jira` | ITSM | 48 |
| JumpCloud | `jumpcloud` | Identity | 39 |
| Kibana | `kibana` | SIEM | 20 |
| KnowBe4 | `knowbe4` | Other | 7 |
| Lastline | `lastline` | Sandbox | 7 |
| Logentries | `logentries` | SIEM | 6 |
| LogRhythm | `logrhythm` | SIEM | 16 |
| MalShare | `malshare` | Sandbox | 9 |
| Malware Domain List | `malware-domain-list` | Threat Intel | 2 |
| Mandiant | `mandiant` | Threat Intel | 19 |
| MaxMind | `maxmind` | Data Enrichment | 7 |
| McAfee ATD | `mcafee-atd` | Sandbox | 12 |
| McAfee ePO | `mcafee-epo` | Vulnerability | 4 |
| Metadefender | `metadefender` | Sandbox | 12 |
| Micro Focus ArcSight Logger | `micro-focus-arcsight-logger` | SIEM | 11 |
| Microsoft 365 Defender | `microsoft-365-defender` | EDR | 15 |
| Microsoft Azure NSG Flow Logs | `microsoft-azure-nsg-flow-logs` | SIEM | 5 |
| Microsoft Cloud App Security | `microsoft-cloud-app-security` | Cloud Security | 6 |
| Microsoft Defender for Endpoint | `microsoft-defender-for-endpoint` | EDR | 64 |
| Microsoft Identity And Access (Graph) | `microsoft-identity-and-access-graph` | Identity | 12 |
| Microsoft SQL Server | `microsoft-sql-server` | Database | 12 |
| Microsoft Teams | `microsoft-teams` | Collaboration | 6 |
| Microsoft Teams (Graph API) | `microsoft-teams-graph-api` | Collaboration | 18 |
| Mimecast | `mimecast` | Email Security | 15 |
| Minerva Labs | `minerva-labs` | EDR | 7 |
| MISP | `misp` | Threat Intel | 12 |
| MISP V2 | `misp-v2` | Threat Intel | 18 |
| MistNet | `mistnet` | Cloud Security | 8 |
| MongoDB | `mongodb` | Database | 9 |
| MxToolbox | `mxtoolbox` | Data Enrichment | 16 |
| Myip.ms | `myip-ms` | Data Enrichment | 5 |
| MySQL | `mysql` | Database | 11 |
| Naverisk | `naverisk` | ITSM | 7 |
| Nessus | `nessus` | Vulnerability | 25 |
| NetBIOS | `netbios` | Network Security | 4 |
| Netskope | `netskope` | Cloud Security | 21 |
| NetWitness | `netwitness` | SIEM | 10 |
| Neutrino | `neutrino` | Data Enrichment | 12 |
| NinjaRMM | `ninjarmm` | ITSM | 9 |
| Nmap (Network Mapper) | `nmap-network-mapper` | Network Security | 6 |
| Obsidian Security | `obsidian` | Cloud Security | 7 |
| Okta | `okta` | Identity | 75 |
| OpenAI ChatGPT | `openai-chatgpt` | DevOps | 13 |
| OpenPhish | `openphish` | Threat Intel | 3 |
| OpenSearch | `opensearch` | SIEM | 15 |
| OpsGenie | `opsgenie` | SOAR | 29 |
| OTRS | `otrs` | ITSM | 8 |
| PagerDuty | `pagerduty` | SOAR | 37 |
| Palo Alto Networks | `paloalto` | — | 9 |
| Palo Alto Panorama | `palo-alto-panorama` | Network Security | 24 |
| Perforce | `perforce` | DevOps | 9 |
| Phish.AI | `phish-ai` | Email Security | 4 |
| PhishTank | `phishtank` | Threat Intel | 3 |
| PostgreSQL | `postgresql` | Database | 11 |
| Power BI | `power-bi` | DevOps | 24 |
| PowerShell | `powershell` | DevOps | 3 |
| Proofpoint TAP | `proofpoint-tap` | Email Security | 12 |
| ProtectWise | `protectwise` | Network Security | 14 |
| QRadar | `qradar` | SIEM | 33 |
| Qualys SSL | `qualys-ssl` | Vulnerability | 5 |
| Qualys Vulnerability Management | `qualys-vulnerability-management` | Vulnerability | 18 |
| Randori | `randori` | Threat Intel | 8 |
| Rapid7 InsightVM | `rapid7-insight-vm` | Vulnerability | 37 |
| Recorded Future | `recorded-future` | Threat Intel | 16 |
| Recorded Future Triage | `recorded-future-triage` | Threat Intel | 14 |
| ReversingLabs TitaniumCloud | `reversinglabs-titaniumcloud` | Threat Intel | 11 |
| ReversingLabs TitaniumCore A1000 | `reversinglabs-titaniumcore-a1000` | Threat Intel | 11 |
| RiskIQ PassiveTotal | `riskiq-passivetotal` | Threat Intel | 10 |
| RSA Archer | `rsa-archer` | Other | 21 |
| SailPoint | `sailpoint` | Identity | 6 |
| Salesforce | `salesforce` | — | 39 |
| Salesforce | `salesforce-com` | ITSM | 7 |
| SANS Blacklist | `sans-blacklist` | Threat Intel | 6 |
| SAP Gigya | `sap-gigya` | Identity | 5 |
| Screenshot Machine | `screenshot-machine` | Data Enrichment | 2 |
| Securonix SNYPR | `securonix-snypr` | SIEM | 5 |
| SentinelOne | `sentinelone` | EDR | 43 |
| ServiceNow | `servicenow` | ITSM | 38 |
| ServiceNow (Basic Auth) | `servicenow-basic-auth` | ITSM | 9 |
| SharePoint | `sharepoint` | Collaboration | 19 |
| Shodan | `shodan` | Threat Intel | 29 |
| Slack | `slack` | Collaboration | 13 |
| Smartsheet | `smartsheet` | Collaboration | 14 |
| SMB Actions | `smb-actions` | DevOps | 5 |
| Smokescreen | `smokescreen` | Cloud Security | 13 |
| SMTP | `smtp` | Email Security | 4 |
| Snowflake | `snowflake` | Database | 17 |
| SOAR Integrations | `soar-integrations` | — | 27 |
| SOAR Platform | `soar-platform` | — | 78 |
| SolarWinds Orion | `solarwinds-orion` | Network Security | 19 |
| Splunk SAP | `splunk-sap` | — | 8 |
| Splunk Secure | `splunk-secure` | — | 8 |
| SpyCloud | `spycloud` | Threat Intel | 9 |
| SSH | `ssh` | DevOps | 6 |
| Sumo Logic | `sumologic` | SIEM | 27 |
| Symantec Data Loss Prevention (DLP) | `symantec-data-loss-and-prevention-dlp` | Vulnerability | 18 |
| Symantec EDR | `symantec-edr` | EDR | 14 |
| Syslog | `syslog` | SIEM | 2 |
| System Tools | `system-tools` | — | 2 |
| TAXII | `taxii` | Threat Intel | 4 |
| TCell | `tcell` | EDR | 6 |
| Telegram | `telegram` | Collaboration | 15 |
| Tenable | `tenable` | Vulnerability | 35 |
| TheHive | `thehive` | Other | 41 |
| Threatminer | `threatminer` | Threat Intel | 22 |
| Trellix Sandbox | `trellix-sandbox` | Sandbox | 7 |
| Trend Micro Cloud Conformity | `trend-micro-cloud-conformity` | Cloud Security | 6 |
| Trend Micro Workload Security | `trend-micro-workload-security` | Cloud Security | 8 |
| TruSTAR | `trustar` | Threat Intel | 5 |
| Twilio | `twilio` | Collaboration | 13 |
| Unshorten.me | `unshorten-me` | Data Enrichment | 2 |
| urlscan.io | `urlscan-io` | Data Enrichment | 6 |
| VirusTotal | `virus-total-v2` | Threat Intel | 8 |
| VMRay | `vmray` | Sandbox | 19 |
| VMware vSphere | `vmware` | Cloud | 23 |
| Web API | `web-api` | DevOps | 1 |
| Webroot BrightCloud | `webroot-brightcloud` | EDR | 8 |
| WildFire | `wildfire` | Network Security | 9 |
| xMatters | `xmatters` | SOAR | 29 |
| YETI | `yeti` | Threat Intel | 21 |
| Zendesk | `zendesk` | ITSM | 6 |
| Zenduty | `zenduty` | SOAR | 16 |
| ZeroFox | `zerofox` | Threat Intel | 6 |
| Zoom | `zoom` | Collaboration | 18 |
| Zscaler | `zscaler` | Cloud Security | 38 |
| Zscaler ZPA | `zscaler-zpa` | Cloud Security | 29 |
