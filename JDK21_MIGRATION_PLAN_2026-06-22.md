# JDK 21 Migration Plan — Legacy Tomcat Application Fleet

**Document ID:** TUC-ICT-MIG-2026-001
**Status:** Draft — Gate 0 closed (22 Jun); Phase 0 (Discovery) continues on remaining Gate 1 items; dates below are provisional until Gate 1 closes
**Supervisor:** Daniel Twum (DT), Head of ICT
**Execution team:** MV · JT · JA
**Date raised:** 22 June 2026
**Server:** techbridge.edu.gh (66.226.72.199) — Ubuntu 22, Plesk, 8 GB RAM, 8 vCPU

---

## 1. Background

A live diagnostic session on 22 June 2026 found a single Apache Tomcat instance (`CATALINA_BASE=/opt/tomcat`) running on JDK 1.8 (`/opt/jdk/jdk1.8.0_291`), continuously since 7 June, currently the single largest memory consumer on the box (~990 MB RSS, ahead of MariaDB). The server already has JDK 21 installed side-by-side at `/opt/jdk/jdk-21` for the LEMS backend, which runs as its own JDK 21 systemd service entirely outside Tomcat. That existing setup is the template for this migration:

- **Never run `update-alternatives` to change the system-default JDK.** It must stay on 8 for as long as anything — including this Tomcat instance — still depends on it.
- New/migrated services get pinned explicitly to `/opt/jdk/jdk-21` in their own startup unit, side-by-side with the untouched 8 install.

## 2. Current Application Inventory

Confirmed by direct inspection of `/opt/tomcat/webapps/` on 22 June, after Daniel's cleanup pass removed `fees-comparison`, `lecturer-assessment`, `lems` (a same-named, unrelated legacy WAR — the real LEMS runs independently on JDK 21 already, untouched by this plan), `applicant-dashboard` (166-byte stub), and a stray misnamed file.

| App family | dev | qa | uat | prd | Note |
|---|---|---|---|---|---|
| `techbridge` | ✓ | ✓ | ✓ | ✓ | Most actively redeployed (prd: 20 May; admin: 3 Jun) |
| ~~`aucdt`~~ | ✓ | ✓ | ✓ | ✓ | **OUT OF SCOPE — Gate 0 closed 22 Jun, retiring, see §3.** Not part of this migration. |
| ~~`admissions`~~ | ✓ | ✓ | ✓ | ✓ (bare) | **OUT OF SCOPE — aucdt administration app, per DT (22 Jun). Same retiring line as Gate 0.** |
| ~~`admissions-admin`~~ | ✓ | — | — | ✓ (bare) | **OUT OF SCOPE — same as above.** |
| `techbridge-admin` | ✓ | — | — | ✓ | No qa/uat — confirmed frontend-only (§4.3), no Java migration needed regardless |
| `techbridge-admissionsui` | ✓ | — | — | ✓ | No qa/uat — confirmed frontend-only (§4.3), no Java migration needed regardless |
| `students` | ✓ (dev only) | — | — | — | **No production deployment at all. Source still not located (§4.6) — the one genuinely open item.** |
| ~~`registration`~~ | — | — | — | bare only | **OUT OF SCOPE — aucdt administration app, per DT (22 Jun). Same retiring line as Gate 0.** |

## 3. Gate 0 — Scope Decision — CLOSED 22 June 2026

**Decision (DT, post-10 AM meeting): `aucdt-*` is out of scope.** Confirmed as the predecessor naming superseded by `techbridge-*` (consistent with the 16 Apr redeploy pattern noted below). `aucdt-dev`/`-qa`/`-uat`/`-prd` are **not** part of this migration and are tracked separately for retirement/decommissioning, not JDK upgrade. This removes four WAR slots and one full app family from every phase below — §6 and §9 updated accordingly.

*Original reasoning, retained for the record:* `aucdt-*` had zero redeploys since 16 Apr, the same day `techbridge-qa`/`techbridge-uat` first appeared — consistent with `techbridge-*` being a rename/replacement rather than a parallel system.

## 4. Gate 1 — Unknowns That Must Close Before Effort/Dates Are Firm

These are genuine open items, not yet investigated — the timeline in §6 is a provisional skeleton pending these:

1. **Source access — repos identified and confirmed cloneable.** None of these apps live in the `aucdt-utilities` GitHub monorepo (confirmed — zero JDK 1.8 references found there). All repos live in a single Bitbucket workspace, slug `securedataghana` — the repo list's "AUCDT" and "TUC" badges turned out to be internal Bitbucket *project* labels within that one workspace, not two separate workspaces (confirmed by checking `techbridgesb-prd`'s actual clone URL, the one repo labeled "TUC" — same `securedataghana` slug as everything else). No duplicate/fork concern. **Excluded from cloning:** `aucdt-admissions-sdev`, `aucdtsb-dev`, `aucdtsb-prd` — same retiring `aucdt` line ruled out at Gate 0 (§3), per DT. Repos in scope: `techbridge-website-prd`, `techbridge-admin-prd`/`-dev`, `techbridgesb-dev`/`-qa`/`-uat`/`-prd`, `techbridge-admissionsui-prd`/`-dev`, `techbridge-feepayment-prd`, plus **two repos with no corresponding deployment on the Tomcat instance at all** — `toabaui-prd` and `tuabasb-prd` (a "Bridge students voting system," frontend + Spring Boot middle-tier). That last pair still needs a scope call: is it live somewhere else, or undeployed? Either way it's currently outside §2's inventory and outside this plan until clarified. Clone script: `clone-legacy-bitbucket-repos.ps1` (workspace slug fixed 22 Jun after the first run failed on a display-name/slug mismatch; `aucdt*` repos removed from the list same day). Nothing else in Gate 1 can close until these are cloned and connected for review.
2. **Tomcat's own version — RESOLVED.** Confirmed via `RELEASE-NOTES`: **Apache Tomcat 9.0.50**. Tomcat 9.0.x is documented as supporting "Java 8 or later," so it is expected to run on JDK 21 without a Tomcat major-version change. Tomcat 9 is also the last major line on the `javax.*` namespace — staying on 9.0.x while changing only the JDK avoids the `javax`→`jakarta` rewrite that a Tomcat 10/11 upgrade would force. Separately logged, not blocking: **Tomcat 9.0.x is supported until 31 March 2027** (corrected — not already EOL as first noted in chat; a 9.1.x branch follows after, through 2030), so there's no near-term forcing function to leave Tomcat 9. Recommend bumping to the latest available 9.0.x patch (9.0.50 is a 2021 build) as routine hygiene while this is already being touched.
3. **Per-app dependency audit — RESOLVED, and this substantially shrinks the project's real scope.** All 12 repos cloned and reviewed. Only **two are actually Java**: `techbridgesb-dev`/`-qa`/`-uat`/`-prd` (Spring Boot **2.7.7**, Java **8**, `packaging=war`, deployed to Tomcat 9 — the shared "middle-tier API" behind most of the frontend repos) and `tuabasb-prd` (Spring Boot **3.2.4**, Java **17**, `packaging=war` — "The Bridge SRC Voting System"). **Every other repo** (`techbridge-website-prd`, `techbridge-admin-dev`/`-prd`, `techbridge-admissions-dev`, `techbridge-admissionsui-prd`, `techbridge-feepayment-prd`, `toabaui-prd`) is a pure Vite/React frontend with zero `pom.xml`/`.java` files — **no JDK migration work needed for any of them.**
   - **Architecture note, per DT (22 Jun):** every `techbridge` app is structured as a **UI + MT (middle-tier) pair** — confirms the pattern found above rather than contradicting it. The various `techbridge-*` UI repos (admin, admissionsui, website, feepayment) are the UI halves; `techbridgesb-*` is the **shared MT half** behind them, one Java backend serving multiple frontends rather than each UI having its own dedicated backend. This is why only one Java codebase turned up among twelve repos — that's the architecture working as designed, not a gap in what got cloned.
   - **`techbridgesb` path:** Spring Boot 2.7.18 (the final 2.7.x patch) officially supports JDK 21 — so this is a same-line patch bump (2.7.7 → 2.7.18, still `javax.*`, no Jakarta rename) followed by the JDK change, not a Spring Boot major-version migration. Also noted: Spring Boot 2.7 itself is past its own support window — a second, separate EOL situation layered on top of Tomcat 9's, worth tracking but not blocking this migration. Also noted: `techbridgesb-dev`'s Java package is still `edu.aucdt.springmvc`/`AucdtApplication` while qa/uat/prd use `edu.techbridge.springmvc`/`TechbridgeApplication` — the aucdt→techbridge rename never fully landed in dev; dev may differ from the other three tiers in more than just config, worth a direct diff before treating dev as representative.
   - **`tuabasb-prd` path:** already on Spring Boot 3.2.4/Java 17, both well past the line that requires a namespace rewrite — Spring Boot 3.2+ already officially supports JDK 21, so this would be a near-trivial version bump *whenever it's next deployed*. **Status per DT (22 Jun, corrected): undeployed after the vote it was built for concluded** — nothing currently running anywhere, which is why it never appeared in the Tomcat `webapps/` inventory; source is kept for reuse at a future vote. No current instance to migrate, no urgency, and nothing to chase down — out of this migration's scope entirely until it's actually redeployed for a future election, at which point the JDK 21 bump is cheap to fold in at deploy time rather than now.
   - **NEW, found while reading `techbridgesb`'s config (22 Jun) — flagged separately from the JDK work, but serious enough to raise now rather than bury in a footnote.** Environment config lives in each tier's own `src/main/resources/application.properties`, committed in plaintext to the repo. Each tier has its own DB password (expected, if not best practice) — but **the JWT signing secret is byte-for-byte identical across dev/qa/uat/prd**, and **the Hubtel payment API key is also identical across all four**. That means a token from dev would validate against production, and dev/qa testing activity hits the same live payment account as prod if that key is the real merchant key and not a sandbox one. Independent of this migration's timeline — recommend DT have this rotated/externalized regardless. Direct consequence for this migration: **don't exercise payment, email, or SMS endpoints carelessly while pilot-testing on `tomcat21`** — same shared credentials mean a "harmless" qa-tier test could trigger a real transaction, a real email, or a real SMS. See §7 and §9.
4. **Existing automated test coverage.** Not yet known whether `techbridgesb`/`tuabasb` have unit, integration, or E2E tests. This directly drives how much of §7's testing has to be written from scratch versus run as-is.
5. **Missing qa/uat tiers — MOOT.** `admissions-admin` (the one remaining family with this gap) is now out of scope entirely (item 6 below), and `techbridge-admin`/`techbridge-admissionsui` were already confirmed frontend-only. No app left in scope actually has this gap. `students` still has no production deployment at all, but that's a deployment-completeness question, not a test-tier gap — see item 6.
6. **`admissions`, `admissions-admin`, `registration`, `students-dev` source — RESOLVED for three of four.** Per DT (22 Jun): `admissions`, `admissions-admin`, and `registration` are AUCDT-administration applications — **same retiring line as Gate 0, out of scope**, struck from §2. Confirmed separately: `techbridgesb-{dev,qa,uat,prd}`'s Maven `artifactId` is literally `techbridge-{dev,qa,uat,prd}`, so that repo *is* the source behind the `techbridge-*.war` deployments, not a separate mystery app. **`students-dev` remains the one genuinely open item** — no source located, no qa/uat/prd deployment exists for it either way. Locate its source before deciding whether it needs anything from this migration.

## 5. Migration Pattern — Real Deployment Mechanism: Bitbucket Pipelines

**Correction to the original draft of this section:** deployment is not manual `scp`/`cp` — it's already fully automated. Each environment tier is its **own Bitbucket repo** (`techbridgesb-dev`, `-qa`, `-uat`, `-prd`), each with its own `bitbucket-pipelines.yml`, and **every push to that repo's default branch auto-builds and auto-deploys straight to `/opt/tomcat/webapps/` on the live JDK 8 instance — no test gating, no approval step, today.** Confirmed by reading all four pipeline files directly:

| Tier | Build command | Deploys to |
|---|---|---|
| dev | `mvn -e clean package -DskipTests` | `root@66.226.72.199:/opt/tomcat/webapps/techbridge-dev.war` |
| qa | `mvn -e clean package -Pqa` | `.../techbridge-qa.war` |
| uat | `mvn -e clean package -Puat` | `.../techbridge-uat.war` |
| prd | `mvn clean install -DskipTests` | `.../techbridge-prd.war` |

(Minor inconsistency, not blocking: dev/prd don't use a Maven environment profile while qa/uat do via `-Pqa`/`-Puat` — worth asking whoever owns these whether that's intentional.)

Because every tier auto-deploys on push, **the JDK 21 work cannot just modify these existing pipelines** — the next normal commit would deploy straight to the live JDK 8 Tomcat the moment it's merged. The pattern instead, per tier:

1. ~~Stand up a second Tomcat instance...~~ **DONE 22 Jun 2026, reusable for all four tiers.** `/opt/tomcat21`, copied from the existing install (inherits Plesk-specific config rather than a blank fresh install), `JAVA_HOME=/opt/jdk/jdk-21`, dedicated `tomcat21` systemd service. Ports changed to avoid clashing with the original, which turned out to run on **8181** (HTTP) / **8005** (shutdown), not Tomcat's default 8080 — new instance: **8191** / **8015**. Verified via the running process's actual binary path that it's genuinely JDK 21.
2. **Add a manually-triggered `custom` pipeline to that tier's repo** (Bitbucket's "Run pipeline → Custom" UI, not the automatic `default` one) that builds the same WAR and `scp`s it to `/opt/tomcat21/webapps/` instead of the live path. **DONE for `techbridgesb-qa`** — `jdk21-pilot-qa` custom pipeline added, default pipeline untouched. Same pattern needed for dev/uat/prd repos once qa is validated.
3. Run that custom pipeline, then smoke-test and run the full suite (§7) against `tomcat21` directly via its own port — bypassing nginx/Apache entirely, so this is a pure infrastructure/app test with zero production exposure.
4. Only once signed off: flip nginx/Apache's `proxy_pass` for that domain from port 8181 to 8191, **and** update that tier's `default` pipeline's `scp` target from `/opt/tomcat/webapps/` to `/opt/tomcat21/webapps/` — both steps needed, since they're independent (one controls where live traffic goes, the other controls where the next ordinary push deploys to). Doing only one half leaves the pipeline and the live proxy pointed at different Tomcat instances.
5. Leave the JDK 8 instance and old WAR untouched for a bake-in period (recommend minimum 2 weeks) before decommissioning anything.

**Sequencing across tiers — the standard DEV → QA → UAT → PRD pipeline:** because each tier is a separate repo with its own independent pipeline, "promotion" here means repeating steps 2–4 once per repo, in order, only advancing to the next tier after the current one has been live on `tomcat21` and stable for the bake-in window — not a single cross-repo automated promotion gate (none exists today). Order: **dev → qa → uat → prd**, the normal SDLC sequence, each tier only proceeding once the previous one has baked in cleanly. (The infrastructure pilot already done used the qa repo specifically to first prove `tomcat21`/JDK 21 works at all on a low-stakes real environment — that's a one-time infrastructure check, not a reordering of the actual promotion path, which still runs dev first.)

This keeps every other still-on-8 app, and every other tier of `techbridgesb` itself, completely unaffected during any single tier's cutover — and gives a same-day rollback (flip the proxy back, revert the pipeline's `scp` target) if anything breaks.

**Resource caveat:** the server is already memory-constrained (was actively swapping at last check, 356 MB free of 7.7 GB). Running a second Tomcat instance — even temporarily — adds real memory pressure on top of that. Monitor `free -h` / `vmstat 1 5` during each cutover window, not just before and after.

## 6. Phased Timeline (provisional — firms up once §4 closes)

| Phase | What | Who | When |
|---|---|---|---|
| 0 | ~~Gate 0 + Gate 1~~ — **done except one item.** `admissions`/`admissions-admin`/`registration` resolved out of scope; qa/uat gap question is moot. Remaining: locate source for `students-dev` (§4.6) | Whoever picks up `students-dev` | Now |
| 1 | Pilot: `techbridgesb-qa` repo. **Infrastructure done** — `tomcat21` (JDK 21, port 8191) stood up and verified 22 Jun; `jdk21-pilot-qa` custom pipeline added to the qa repo (default pipeline untouched). **In progress** — running the custom pipeline to deploy `techbridge-qa.war` to `tomcat21`, then the Spring Boot 2.7.7→2.7.18 bump, then full test pass via §7 before any proxy/pipeline cutover | **MV and JA, paired** (§8) | Started 22 Jun |
| 2 | Repeat §5's steps 2–4 for `techbridgesb-dev`, `-uat`, `-prd` in that order — add each repo's own `jdk21-pilot-*` custom pipeline, validate on `tomcat21`, only then flip that tier's proxy + its `default` pipeline's deploy target. One tier fully baked in before starting the next. | **MV and JA, paired** (§8) | Following qa sign-off |
| 3 | ~~`tuabasb-prd`~~ — **removed, out of scope.** Confirmed undeployed since its election concluded; nothing currently running to migrate. Revisit only if/when it's redeployed for a future vote — fold the JDK 21 bump in at that point rather than now. | — | N/A |
| 4 | ~~`admissions`/`admissions-admin`/`registration`~~ — **removed, out of scope (aucdt administration line, §4.6).** `students-dev` — source still not located; locate first, then this phase is either zero work (if frontend-only) or a newly-scoped migration | TBD pending `students-dev` source | TBD |
| 5 | **Bake-in and decommission — detailed below given local operating conditions.** | DT signs off each decommission, explicitly, in writing — not a verbal go-ahead | Rolling, per app, minimum 2 weeks per tier |

The scope shrank a lot once the dependency audit landed: this is now **one Java codebase, four environment tiers** (`techbridgesb` → `techbridge-{dev,qa,uat,prd}.war`), plus one small unresolved item (`students-dev`'s source). Everything else originally listed turned out to be either frontend-only or part of the retiring `aucdt` line. No firm calendar dates given deliberately — `students-dev` is the one piece that could still change this project's size.

### Phase 5 detail — bake-in and decommission, explicit steps

This phase is spelled out in full rather than left as a one-liner, because it's the phase where "almost right" causes real harm — these apps serve live admissions, registration, and student records for Techbridge, and the team executing this is small (DT, MV, JA, JT — no large ops bench to absorb a mistake). Local operating conditions that change how this should run, not just generic best practice:

1. **Power and connectivity are not guaranteed continuous in Ghana.** A bake-in window measured in wall-clock days must tolerate brief outages without resetting the clock or causing confusion about whether the bake-in is still valid. Concretely: log the bake-in start/end as explicit GMT timestamps (Ghana is GMT year-round, no DST, but write it down anyway so there's no ambiguity for anyone reading this later) in a shared, written location — not someone's memory of "about two weeks ago." If the server itself loses power/connectivity during a bake-in window, that's not a failure of the migration — but restart the monitoring/observation clock from when connectivity is confirmed stable again, don't silently count outage time as "successfully baked in."
2. **Do not schedule a tier's final cutover or decommission during Techbridge's admissions/registration/exam periods**, even though those specific apps (`admissions`, `registration`, `students`) are out of scope for this migration — `techbridgesb` is still the shared backend behind the in-scope `techbridge-*` UIs, and high-traffic academic periods are exactly when an unexpected regression would hurt the most people and be hardest to roll back calmly. DT to confirm the current academic calendar's high-risk windows before any prd cutover date is set — this plan deliberately doesn't guess at those dates.
3. **Explicit, named, written sign-off before each decommission — not an assumed "looks fine, go ahead."** For each tier, before deleting the old `/opt/tomcat/webapps/<tier>.war` or stopping anything on the JDK 8 instance: DT confirms in writing (the same place the bake-in timestamps are logged) that the bake-in period has passed with no incidents, MV/JA confirm the `tomcat21`-hosted version has been stable for that tier's full window, and JT confirms the Cypress suites have run clean against it during that window — not just once at cutover time. Three explicit confirmations, not one person's assumption standing in for the team's.
4. **Named backup contact per tier's bake-in window.** With a four-person team, if whoever ran a tier's cutover is unreachable (travel, local holiday, anything) when an issue surfaces during that tier's bake-in, there needs to be a second named person, not a default of "wait until they're back." Assign this per tier when each cutover happens, rather than assuming it's covered.
5. **Don't decommission the old JDK 8 Tomcat instance itself (`/opt/tomcat`) until all four `techbridgesb` tiers have independently completed steps 1–4 above.** Other things may still depend on that shared instance even after `techbridgesb` itself is fully migrated (e.g., whatever `students-dev` turns out to be, if its source is found and it's not frontend-only) — decommissioning the instance, not just individual WARs within it, is a separate, later decision DT makes explicitly, not an automatic last step of this table.

## 7. Testing Strategy ("comprehensive")

Per app, before any prod cutover:

- **Build verification** — clean `mvn package` (or equivalent) against JDK 21, zero compile errors, dependency tree resolved.
- **Baseline capture** — before touching anything, record current behaviour on the live JDK 8 instance: key screenshots, core API responses, login flow. This is the regression reference.
- **Automated tests** — run existing unit/integration/E2E suites if Gate 1.4 finds any; if none exist, at minimum write smoke tests covering login, the 2–3 core workflows per app, and any data-write path, before migrating that app.
- **Side-by-side diff testing** — with both JDK 8 and JDK 21 instances running simultaneously during the pilot window, compare responses for the same requests directly (not just "looks fine").
- **Environment-tier sign-off** — each app must pass at dev, then qa, then uat (where those tiers exist) before prod. For apps missing qa/uat (§4.5), this step needs that decision resolved first.
- **Load/resource check** — given the existing memory pressure, a brief load check during the cutover window, not just a functional pass.
- **Rollback rehearsal** — prove the proxy flip-back actually works on at least the pilot app before relying on it as the safety net for the rest.
- **UI validation (JT, per §8)** — Cypress E2E suites covering the real user journey per UI app (`techbridge-website-prd`, `techbridge-admin-*`, `techbridge-admissions-dev`, `techbridge-admissionsui-prd`, `techbridge-feepayment-prd`, `toabaui-prd`), run against **dev and qa** specifically — confirms each frontend still works correctly once pointed at the `tomcat21`-hosted MT, catching backend behaviour changes that API-level testing alone wouldn't surface. Build these as real repeatable suites, not one-off manual passes, even though uat/prd runs aren't required for this migration.
- **NEW — do not trigger live payment/email/SMS during pilot testing.** `techbridgesb`'s Hubtel payment key, mail credentials, and bulk SMS token are shared identically across dev/qa/uat/prd (§4.3). Smoke-testing endpoints that touch payments, email, or SMS on `tomcat21` hits the same live external accounts as production. Either get sandbox credentials swapped in for the `tomcat21` test deployment specifically, or scope smoke tests to exclude those endpoints until that's sorted.

## 8. Roles

Provisional — DT knows each person's actual strengths better than this plan does; reassign freely:

- **DT** — Gate 0/Gate 1 decisions, prod cutover approval, final decommission sign-off.
- **MV and JA — peers on the implementation**, per DT (22 Jun). Pilot execution and the dev→qa→uat→prd rollout (§5, §6 Phases 1–2) are shared/paired work between the two, not split into separate solo assignments — joint ownership of the `tomcat21` builds, the custom pipelines per tier, and reviewing each other's changes before any cutover.
- **JT — validates all UI apps**, per DT (22 Jun). The UI repos (`techbridge-website-prd`, `techbridge-admin-dev`/`-prd`, `techbridge-admissions-dev`, `techbridge-admissionsui-prd`, `techbridge-feepayment-prd`, `toabaui-prd`) need zero JDK migration work themselves (§4.3 — confirmed pure frontend), but every one of them calls into `techbridgesb`, the MT being migrated. JT's job is confirming each UI still works correctly when pointed at the `tomcat21`-hosted MT at each tier, after MV/JA's Spring Boot 2.7.18 + JDK 21 changes — the check that catches a subtle backend behaviour change breaking a frontend that MV/JA wouldn't necessarily notice testing the API in isolation. **Concretely: JT builds Cypress E2E suites covering the real user journey per UI app, run against dev and qa** (per DT, 22 Jun) — not just ad hoc manual clicking, an actual repeatable suite per app that can be rerun at uat/prd later even though it's only required at dev/qa for this migration. See §7's UI-validation item.

## 9. Risks

- Server is already memory-constrained; a second JVM per cutover adds pressure on top of existing swap activity.
- ~~Tomcat's own version is unknown...~~ **Resolved — Tomcat 9.0.50, JDK 21–compatible, see §4.2.**
- **NEW, independent of this migration but discovered during it — shared secrets across all four environments.** `techbridgesb`'s JWT signing secret and Hubtel payment API key are identical in dev/qa/uat/prd, committed in plaintext to each repo (§4.3). A dev-environment compromise validates against prod auth; lower-environment testing can hit the live payment account. Recommend DT raise this for rotation/externalization on its own track, not gated behind the JDK work — but the JDK pilot's test plan (§7) must account for it in the meantime.
- Zero confirmed automated test coverage on `techbridgesb`/`tuabasb` as of this writing — real risk of regressions slipping through without deliberate smoke-test authoring first.
- `students` has no production deployment today — if it's actually in active use via dev only, that's a separate, more urgent gap than the JDK migration itself.
- ~~Delay on the Gate 0 `aucdt` decision...~~ **Resolved 22 Jun — `aucdt-*` out of scope, no further risk here.** Separate follow-up: confirm nothing else (DNS, links, integrations) still points at `aucdt-*` before its eventual decommissioning.
- **NEW** — `admissions`/`admissions-admin`/`registration`/`students-dev` have no located source (§4.6). This is the one open item that could still grow this project's real size; don't treat the "mostly done" Phase 0 in §6 as fully closed until it resolves.
- **NEW** — Spring Boot 2.7 (what `techbridgesb` runs on) is itself past its own support window, same situation as Tomcat 9. Not blocking, but two stacked EOL components is worth DT flagging upward, not just absorbing silently into this migration's scope.

## 10. Immediate Next Actions

1. ~~DT: confirm `aucdt` fate after the 10 AM meeting.~~ **Done — out of scope, see §3.**
2. ~~DT: clone the Bitbucket repos.~~ **Done — 12 repos cloned, dependency audit complete, see §4.3.**
3. ~~Check Tomcat version.~~ **Done — Tomcat 9.0.50, see §4.2.**
4. **Find the source for `admissions`, `admissions-admin`, `registration`, `students-dev`** (§4.6) — check the Bitbucket workspace for repos under a different naming pattern, or confirm with whoever last touched these on the server whether they're frontend-only static WARs.
5. ~~Confirm `tuabasb-prd`'s actual deployment status.~~ **Resolved — undeployed after its election concluded, per DT.** Nothing currently running; out of scope until it's redeployed for a future vote, at which point the JDK 21 bump folds in cheaply at deploy time.
6. Once 4 and 5 land: assign the `techbridgesb` qa-tier pilot (Phase 1) to one of MV/JT/JA.
