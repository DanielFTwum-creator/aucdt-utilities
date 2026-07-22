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

---
*Last updated: 21 July 2026. Home for agent operating lessons; discovered via
the Session Start Protocol top-level `ls`. If a rule becomes a hard standard,
promote it into CLAUDE.md and delete it here to avoid drift.*
