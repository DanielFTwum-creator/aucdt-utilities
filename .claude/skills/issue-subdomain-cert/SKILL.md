---
name: issue-subdomain-cert
description: >-
  Issue and bind a trusted Let's Encrypt TLS certificate to a Techbridge
  (techbridge.edu.gh) subdomain on the Plesk server, replacing the default
  self-signed cert a new subdomain comes up with. Use this whenever a
  techbridge.edu.gh subdomain shows a certificate warning, serves a self-signed
  cert, throws MOZILLA_PKIX_ERROR_SELF_SIGNED_CERT / NET::ERR_CERT_AUTHORITY_INVALID,
  or when a freshly deployed app's URL "isn't secure / has no padlock / won't be
  indexed". Also use it right after standing up any new subdomain vhost (a fresh
  app deploy, a new *.techbridge.edu.gh host) to get HTTPS working before launch.
  Trigger even if the user only says "the cert is broken", "secure this domain",
  "sort out https for <name>.techbridge.edu.gh", or "google won't index it because
  of the certificate" — this is the skill for all of that.
---

# Issue a Let's Encrypt certificate for a TUC subdomain

## Why this exists

New subdomain vhosts on the TUC Plesk box (`root@techbridge.edu.gh`) come up bound
to Plesk's default **self-signed** certificate (`/opt/psa/var/certificates/cert…`).
Browsers then show a full-page security warning, and — the reason this keeps
surfacing during SEO work — **search engines will not index a site behind an
untrusted certificate**. The fix is to issue a real Let's Encrypt cert through the
Plesk **SSL It!** extension and bind it to the domain. This skill does that
deterministically so nobody has to click through the Plesk UI and misconfigure it
by hand.

## Before you start (preconditions)

Two things must already be true, or Let's Encrypt's HTTP-01 challenge fails:

1. **DNS resolves publicly** for the subdomain to the server. A browser reaching
   the site and getting a *certificate* error (not a DNS error) already proves this.
2. **Port 80 is reachable** from the internet (Plesk serves the ACME challenge there).

If issuance fails, check these first before retrying.

## Procedure

Run everything over SSH as `root@techbridge.edu.gh`. Substitute the real
fully-qualified subdomain for `<DOMAIN>` (e.g. `thebench.techbridge.edu.gh`) — use
the **live** host, not the repo folder name.

### 1. Confirm the current state

```bash
ssh root@techbridge.edu.gh 'D=<DOMAIN>; echo "== LE dir =="; ls -la /etc/letsencrypt/live/$D/ 2>/dev/null || echo "none yet (still self-signed)"; echo "== bound cert =="; grep -riE "ssl_certificate" /var/www/vhosts/system/$D/conf/nginx.conf 2>/dev/null | head'
```

A missing LE dir plus a `/opt/psa/var/certificates/cert…` binding confirms it's on
the default self-signed cert.

### 2. Issue and bind the certificate

This SSL It! build takes **no `-registrationEmail` flag** (the ACME account is
already configured server-side). `-secure-domain` both issues the cert and assigns
it to the domain, which makes Plesk reconfigure the vhost and reload nginx.

```bash
ssh root@techbridge.edu.gh 'plesk ext sslit --certificate -issue -domain <DOMAIN> -secure-domain'
```

**Do not add `-secure-www`** unless a `www.<DOMAIN>` DNS record actually exists.
Asking SSL It! to secure a `www` name with no DNS record fails that name's ACME
challenge and aborts the whole issuance. For a normal app subdomain there is no
`www.` record, so leave it off.

If the command errors on an unknown option, the extension's flags differ on this
build — check them with `ssh root@techbridge.edu.gh 'plesk ext sslit --help'` and
adapt, rather than guessing.

### 3. Verify the issuer is Let's Encrypt

```bash
ssh root@techbridge.edu.gh 'echo | openssl s_client -connect <DOMAIN>:443 -servername <DOMAIN> 2>/dev/null | openssl x509 -noout -issuer -dates'
```

Success = `Issuer` contains `Let's Encrypt` (e.g. `R10`/`R11`/`E5`) and a valid date
range. From a client machine, `curl -sSI https://<DOMAIN>/` returning `200` with **no**
`-k` flag is the end-to-end confirmation that users and crawlers are unblocked.

### 4. Fallback if it still shows self-signed

Occasionally issuance succeeds but the vhost doesn't pick up the new cert. Force a
reconfigure and reload, then re-verify:

```bash
ssh root@techbridge.edu.gh 'plesk repair web <DOMAIN> -y >/dev/null 2>&1; systemctl reload nginx; echo | openssl s_client -connect <DOMAIN>:443 -servername <DOMAIN> 2>/dev/null | openssl x509 -noout -issuer'
```

If it is *still* not Let's Encrypt after this, stop and report — the cause is almost
always a failed ACME challenge from a DNS or port-80 problem (see preconditions),
not the binding.

## One-command path for the user (Windows / PowerShell)

The same logic is bundled as a script the user can run directly, no skill invocation
needed:

```
C:\Development\github\aucdt-utilities\scripts\issue-cert.ps1 -Domain <DOMAIN>
```

It issues, verifies, and self-heals with the repair + reload fallback. It accepts
`-SecureWww` (opt-in, same caveat as above) and `-Server` (defaults to
`root@techbridge.edu.gh`). Point the user at this when they'd rather run it
themselves than have you drive it over SSH.

## Guardrails

- This is production infrastructure. Only issue a cert for a subdomain the user
  actually intends to secure — confirm the exact `<DOMAIN>` if there's any ambiguity.
- Never echo or log secrets (CLAUDE.md §12). Cert issuance needs none; keep it that way.
- Quote SSH one-liners in **single** quotes when the user runs them from PowerShell,
  so the shell passes `$D` and pipes through untouched (AGENT_OPERATING_NOTES rule 2).
