# TUC-INC-2026-010: Whole-Domain Outage via Interrupted nginx Config Write

| Field | Value |
|---|---|
| Incident ID | TUC-INC-2026-010 |
| Date | Monday, 6 July 2026 |
| Duration | Approximately 4 hours |
| Scope | techbridge.edu.gh and all subdomains (web tier only) |
| Not affected | Email, student portal backend, databases, PM2 app fleet |
| Severity | Major (availability) |
| Security impact | None. No data loss, no unauthorised access. |
| Status | Resolved. Site restored and verified. |
| Prepared by | Daniel Twum, Head of ICT |
| Recorded in repo by | ICT (from the incident summary PDF, 7 Jul 2026) |

## Summary

The TUC website and every subdomain became unreachable for roughly four
hours on the morning of 6 July 2026. Visitors received connection errors.
Everything behind the web tier (mail, databases, the PM2 application fleet)
kept running normally throughout.

## Root cause

An AI-assisted session (Fable) generating an nginx configuration file for
the NetScan tool ran out of allotted credits partway through writing the
file, leaving a broken, half-written config on the server with a duplicated,
incomplete entry.

The running nginx was not affected at write time, because nginx only reads
configuration at start or reload. The broken file sat latent until nginx
next tried to start, found the config invalid, refused to come up, and
entered a repeated failure loop. Because a single nginx instance fronts
every vhost on the shared server, one broken file for one tool took down the
entire domain.

Corroborating evidence from the repo session of 7 Jul 2026: server uptime at
19:36 on 7 July was 1 day 11:31, placing the last boot at roughly 08:05 on
6 July, the morning of the incident. The PM2 fleet uptime (35h) matches.
This is consistent with the broken config detonating at boot rather than at
write time.

## Resolution

1. Identified nginx stuck in a repeated failure loop, not accepting
   connections.
2. Traced the failure to the broken config file left by the interrupted
   session.
3. Corrected the broken sections by hand and removed the duplicated,
   incomplete entry.
4. Validated the corrected configuration (`nginx -t`) before restarting.
5. Restarted nginx and confirmed techbridge.edu.gh, NetScan, and all
   subdomains loading normally.

## Preventive measures

Codified as **Pattern 26 (NGINX CONFIG CHANGE GATE)** in `PATTERNS.md`, with
the gate implemented in `scripts/nginx-safe-apply.sh` (deployed to
`/usr/local/sbin/nginx-safe-apply` on the server):

1. AI-generated config is never applied directly. Candidates are written to
   a separate file and installed only through the gate.
2. The gate validates with `nginx -t` before any reload and rolls back
   automatically on failure, so an incomplete or broken file can no longer
   take effect.
3. Reload instead of restart, so the old config keeps serving if the new one
   is bad.
4. A daily `nginx -t` cron catches latent breakage before the next reboot
   does.
5. Infra-config changes are atomic units of work. An interrupted session
   doing nginx work triggers an immediate `nginx -t` review on resume.

## Lessons

- nginx configs are landmines, not tripwires: a broken file can look
  harmless for days and detonate at the next reboot. Validation must happen
  at write time.
- Blast radius of the shared web tier is total. Per-tool config work carries
  whole-domain risk and gets whole-domain safeguards.
- Interruption (credit exhaustion, network drop, session kill) is a normal
  failure mode of AI-assisted work. Infrastructure procedures must be safe
  to interrupt at any point.
