# Agent Operating Notes (aucdt-utilities)

Short, additive rules earned from real misses in agent sessions. Read alongside
CLAUDE.md (§12 secrets, §13 command formatting). Add a rule only after an actual
incident, and only with the fix that makes recurrence structurally impossible.
Keep every entry terse: the incident, then the rule.

## 1. Server path selection: name the exact vhost, never a glob

Incident (20 Jul 2026): `ls -d /var/www/vhosts/*/httpdocs/wp-content/uploads | head -1`
returned `asanskafc.com`, not the intended `aucdt.edu.gh`, so an inventory ran
against the wrong site and reported 6,012 images that were not ours.

Rule: when a command targets one site's files, write the full vhost path
explicitly, for example `/var/www/vhosts/aucdt.edu.gh/httpdocs/...`. A `*` glob
plus `head -1` is a guess about directory ordering; never put it in an
instruction handed to the user.

## 2. SSH one-liners from PowerShell: single-quote the outer argument

Incident (19 to 20 Jul 2026, twice): a double-quoted `ssh host "... $f ..."` let
PowerShell consume `$f` / `\$f` before the remote shell ever saw it, so the loop
died with a syntax error. The same class of error had already bitten an awk
command earlier the same day, so this was a repeat, not a surprise.

Rule: wrap the remote command in SINGLE quotes so PowerShell passes it through
untouched: `ssh root@host 'for f in ...; do ... $f ...; done'`. Do not
backslash-escape `$`. If the remote command itself needs single quotes, switch
the outer quoting deliberately and reason it through; do not guess.

## 3. Size before you offer shapes

Incident (20 Jul 2026): a gallery-architecture choice was put to the user before
the assets were counted, implicitly assuming "hundreds". Reality was 17,409
files, which was 1,137 unique originals once WordPress size-variants were
stripped. The decision was taken without the number that drives it.

Rule: for any "how should we build X" decision, get the sizing fact first
(count, disk, cardinality), then present the options with that number stated in
the same breath as the choice.

## 4. Copy-box every command, path, and step

Standing instruction (Daniel, 20 Jul 2026): responses drift into inline commands
and bare relative paths that cannot be pasted straight into PowerShell, forcing
the user to reassemble them. This repeats CLAUDE.md §13 but kept slipping.

Rule: every runnable command, file path, snippet, or step the user is meant to
run goes inside its own fenced code block (a copy box), with full absolute
Windows / SSH paths, never inline in a sentence and never a bare relative path.
A step the user executes is copyable, no assumptions. Locked into session init
via the SessionStart governance banner so it loads every session.

## 5. Open every task by stating the Workflow Card (JOB / BOUNDARY / HUMAN CALL)

Standing instruction (Daniel, 21 Jul 2026): CLAUDE.md already forces the
machine-checkable half of a task (OUTPUT and VERIFICATION via Core Principle #4,
INPUTS via the Session Start Protocol), but the accountable half stayed implicit.
The two misses that hurt, a commit landing on `main` instead of the branch and
the urge to batch-fix the risky env/key deploy scripts blind, were both missing
BOUNDARY and HUMAN CALL, not missing a success check.

Rule: before touching anything on a non-trivial task, state the card. Six lines,
no ceremony:

- **JOB** — what am I responsible for here?
- **INPUTS** — which files, references, constraints, current-state facts does it need?
- **BOUNDARY** — what am I explicitly not allowed to decide or change?
- **OUTPUT** — what artifact must exist when the job is done?
- **VERIFICATION** — what evidence proves the output works?
- **HUMAN CALL** — which decision still belongs to Daniel?

The three that CLAUDE.md leaves implicit, JOB, BOUNDARY, HUMAN CALL, are the
non-negotiable ones: name them out loud before the first edit. Trivial one-liners
do not need the ceremony; use judgement. A prompt asks for activity; the card
asks for an outcome someone is accountable for.

## 6. `plesk db` runs its argument as SQL: pipe the file, don't name the DB

Incident (23 Jul 2026): applying a SickBay migration with
`plesk db tuc_sickbay < 003.sql` failed with `ERROR 1064 ... near 'tuc_sickbay'`.
`plesk db` executes its positional argument as a SQL statement, so `tuc_sickbay`
was run as SQL. The same command was handed to the user three times before the
cause was spotted.

Rule: apply SQL with `plesk db < /full/path/file.sql` and let the file's own
`USE <db>;` first line select the database. Never pass the database name (or
`-e`) as a positional argument. For an ad-hoc query, pipe it:
`plesk db <<< 'USE <db>; SELECT ...;'`.

## 7. After adding a dependency, install before `-Build`

Incident (22 to 23 Jul 2026, twice): a new dependency was added to a SickBay
`package.json` (`qrcode`, then `@fontsource-variable/*`) and the deploy went
straight to `.\deploy.ps1 -Build`. Because pnpm workspace hoisting makes a plain
`pnpm install` in the app dir a no-op, the dep was absent, the local `vite build`
failed on the missing import, and the script shipped stale `dist/` anyway. Twice
in two days, so a pattern, not a one-off.

Rule: whenever a change adds or bumps a dependency, run
`pnpm install --ignore-workspace` in the app directory (the isolated install the
server deploy also uses) BEFORE `.\deploy.ps1 -Build`, and confirm the new
package resolves. A `-Build` that follows a dependency change without an install
is a stale-ship waiting to happen.

## 8. `--ignore-workspace` disables the pnpm build-script allow-list

Incident (23 Jul 2026, bench-trilogy): the server deploy failed with
`ERR_PNPM_IGNORED_BUILDS: sharp@0.34.5` (exit 1). Two compounding faults:
(a) the committed `pnpm-workspace.yaml` used `ignoredBuiltDependencies: [sharp,
unrs-resolver]`, which actively BLOCKS the native build sharp needs for Next.js
image optimisation; (b) the deploy installed with `pnpm install
--ignore-workspace`, and that flag makes pnpm skip `pnpm-workspace.yaml`
settings entirely, so even a correct `allowBuilds` never applied. Verified by
reproduction on pnpm: with `--ignore-workspace` the "Ignored build scripts"
message persists regardless of the allow-list key; without it, both
`allowBuilds` and `onlyBuiltDependencies` are honoured. A monorepo-nested app
that carries its OWN `pnpm-workspace.yaml` stays isolated from the monorepo
root WITHOUT the flag, because pnpm uses the nearest `pnpm-workspace.yaml` as
the workspace root (confirmed with a root-plus-nested layout mirroring the
sparse checkout).

Rule: for an app with native build deps (sharp, unrs-resolver, esbuild,
`@tailwindcss/oxide`), do NOT pass `--ignore-workspace` on the deploy install.
Give the app its own `pnpm-workspace.yaml` with an `allowBuilds` map (pnpm 11
key, Pattern 18) listing each native dep as `true`, and let pnpm read it via a
plain `pnpm install`. This refines §7: the "mimic the server" pre-build install
for such an app is `pnpm install` (no flag), not `pnpm install
--ignore-workspace`. Never leave a native dep under `ignoredBuiltDependencies`
if the build needs it.

## 9. §13 command formatting applies to PR/issue bodies, not just chat

Incident (24 Jul 2026): a PR description's deploy steps were written as bare,
chained relative commands (`cd tuc-ai-lab-catalog && .\deploy.ps1 -Build` then
`cd typing-tutorial && ...`) while every chat reply in the same session used
full absolute paths. Daniel flagged it: the copy-paste-with-zero-assumptions
rule is about the reader, so it cannot stop at chat.

Rule: CLAUDE.md §13 (full Windows/SSH absolute paths, each command a standalone
copy box, no relative `cd`, no assumed working directory) governs EVERY
human-read artifact the agent authors: PR descriptions, PR/issue comments,
review replies, and docs, not only chat responses. Before publishing any PR or
issue body, re-read each command block and confirm it is a full-path, standalone
copy box that runs from a fresh shell.

---
*Last updated: 24 July 2026. Home for agent operating lessons; discovered via
the Session Start Protocol top-level `ls`. If a rule becomes a hard standard,
promote it into CLAUDE.md and delete it here to avoid drift.*
