# Hostinger + WordPress Assessment — can the AWS EC2 bill move there?

Answers a direct question: *is it feasible to migrate from AWS EC2 to WordPress +
Hostinger, and how?*

**Status: ASSESSED 2026-10-30. The question splits in two, and the two halves get
opposite answers.**

- **WordPress: no.** Not "expensive" or "risky" — it is not a migration. One of
  the three sites is static HTML with no CMS to import, and the other two are
  React 19 + TypeScript + Express applications. Moving those to WordPress means
  rewriting them in PHP and discarding the test suites and CI that currently
  guard them. **Drop WordPress from the plan.**
- **Hostinger as a VPS host: yes, feasible** — and it is the first provider found
  with a **Brazilian region and no published São Paulo surcharge**, which is a
  genuine amendment to `devops/fleet/NON_AWS_PROVIDER_ASSESSMENT.md` (ASSESSED
  2026-10-19, amended 2026-10-23). That document's conclusion — *"no provider
  outside AWS hosts this workload for less while the São Paulo requirement
  holds"* — was reached without Hostinger in the comparison. It appeared nowhere
  in that repo.
  📌 **Folded back in on 2026-11-06** as that document's **§12**, which carries
  the provider entry, the amended comparison table, the corrected recommendation
  and the open Hostinger gaps. Two claims there were corrected in the process:
  *"of the rows that can, AWS is the cheapest"* and *"AWS's own bundled product
  does it for less than any of them can in São Paulo."* **That file is now the
  canonical record for the fleet-wide decision**; this one keeps the full
  working, the per-workload inventory and the WordPress argument.
- **But the saving it unlocks over the already-scoped plan is $5.51/month**, and
  it carries exactly the same deploy blockers as Lightsail. The large saving is
  in the billing model, not the vendor — which is what the prior assessment said,
  and that part still holds.
- **The money available without changing anything:** ~$8.40/month from
  terminating the already-stopped Host B and moving DNS to Cloudflare, then
  ~$19–21/month total from adding a Savings Plan. That is **about half the bill,
  inside AWS, with no migration.** Do that before deciding anything about
  Hostinger — it is also what makes the Hostinger comparison honest, because it
  reprices the decision against ~$27/month instead of ~$47.

Prices marked **official** (vendor's own page), **third-party** (tracker or
review — a hint) or **inferred**. Latency is **measured**. Prices move; re-check
before acting.

---

## What is actually running, measured 2026-10-30

Not one site. **Six hostnames on one box**, all resolving to `18.229.20.196`
(sa-east-1), served by `nginx/1.24.0 (Ubuntu)`:

| Hostname | What it is | Evidence |
|---|---|---|
| `mpbarbosa.com`, `www` | Static HTML portfolio, 5 pages, 11–24 KB each | `ETag`/`Last-Modified` present, no `X-Powered-By` |
| `brasileirao.mpbarbosa.com` | Node/Express app | `X-Powered-By: Express`, `/api/health` → `{"node":"22.23.2","provider":"football-data","sha":"fe9e811"}` |
| `copa2026.mpbarbosa.com` | Node/Express app | `X-Powered-By: Express`, `/api/health` → `{"version":"0.4.1",...}` |
| `es.copa2026`, `en.copa2026` | Same app, locale subdomains | HTTP 200, same IP, `hreflang` reciprocity in `<head>` |

The host, from `copa2026`'s own `/api/health`: **`totalMem` 2,000,433,152 B
(1.86 GiB), load average `[0.01, 0.01, 0]`** — a 2 GB instance, essentially idle.
That matches `t3.small` and matches the roadmap's `i-0ca13c62d0d9d0d00`.

Measured TTFB to `mpbarbosa.com` from the operator's network, 3 samples:
**connect 12–14 ms, TLS 23–28 ms, TTFB 32–39 ms.** Consistent with the prior
assessment's 39–75 ms band for sa-east-1.

The two apps are not small. From their repository descriptions (public on
GitHub): `portal_brasileirao` is *"React 19 · TypeScript · Express · AWS"* with
**742 commits, 45 unit + 30 Playwright e2e tests, 7 GitHub Actions workflows**
including a documented rollback drill and keyless OIDC deploy;
`agora_na_copa_2026` is the same stack with a **Monte Carlo qualification
simulator on a Dixon-Coles model, 283 unit tests across 34 files + 37 Playwright
e2e specs, 1,204 commits.**

---

## Why WordPress is the wrong half of the question

WordPress is a PHP + MySQL content management system. Set against what is running:

**For `mpbarbosa.com` (static):** there is no content to import — no posts, no
database, no CMS. `CLAUDE.md` in this repo describes it as *"a static HTML5
personal portfolio (`src/index.html`) with no build step"*. Putting WordPress in
front of five static pages adds PHP, MySQL, a plugin update treadmill and an
authenticated admin surface, in order to serve files nginx already serves in
32 ms. It is strictly worse on cost, speed, and attack surface. If the goal is to
get this site off the VPS entirely, the right target is **Cloudflare Pages or
GitHub Pages — free**, not WordPress.

**For `copa2026` and `brasileirao`:** WordPress cannot run them. They are Node
22/25 Express servers with React 19 front-ends, a live external data provider
(`football-data`), and a Monte Carlo simulator. "Migrating" them to WordPress
means a ground-up PHP rewrite that throws away ~328 unit tests, ~67 Playwright
specs, 7 CI workflows and ~1,950 commits of accumulated behaviour. That is not a
hosting change; it is rebuilding two applications, and the sites would be worse
at the end of it.

Hostinger's own managed Node.js product is the relevant option if a managed
platform is wanted — **Unlimited $3.49/mo intro, renews $16.99/mo**; **Cloud
Startup $7.99/mo intro, renews $25.99/mo**, 10 web apps / 4 CPU / 4 GB RAM
(official). Note the renewal on Unlimited is **higher than the KVM 1 VPS below**,
for a platform with less control, and the page does not state its RAM or CPU
allocation at all. On price alone, the VPS wins.

---

## Hostinger as a VPS host — the part that does hold up

### The qualifying fact the prior assessment missed

`NON_AWS_PROVIDER_ASSESSMENT.md` establishes that a provider qualifies only with
a Brazilian region, and that every qualifying provider charges a São Paulo
premium: Akamai **+40%** (`br-gru`), Vultr **+50%** (`sao`, the only region in its
139-plan catalogue with a `location_cost` override). Hostinger was never checked.

**Hostinger has a Brazilian VPS region** (official support page): *"South
America: Brazil."* — the only South American VPS location. Their changelog and
blog describe a São Paulo tier-3 campus, over 43,000 sq ft and 4 MW, and
Brazilian press reported the inauguration in August 2025.

**Measured RTT from the operator's network, 5 ICMP samples, `LC_ALL=C`:**

| Target | min | avg |
|---|---:|---:|
| `hostinger.com.br` | **4.5 ms** | 9.2 ms |
| `ns1.dns-parking.com` (Hostinger DNS) | 4.3 ms | 10.2 ms |

That puts Hostinger's Brazilian edge in the same band as the best entries in the
prior assessment's table (Oracle `sa-saopaulo-1` 4.5/7.3 ms, Akamai `br-gru`
5.6/7.8 ms). ⚠️ **Same method caveat that document applies to itself:** this
probes a public edge, not a rented VM, and `hostinger.com.br` may be anycast or
CDN-fronted. It is evidence of Brazilian presence, not a VM latency measurement.
See "Not verified".

**And the price does not appear to carry a São Paulo premium.** The VPS pricing
page lists one price per plan with no location breakdown (official) — unlike
Akamai and Vultr, which both publish machine-readable regional overrides. Treat
as **inferred until seen at checkout with Brazil selected**; it is the single
figure the whole case rests on.

### The plans (official, 2026-10-30)

| Plan | vCPU | RAM | NVMe | Transfer | Intro/mo (24-mo prepay) | Renewal/mo |
|---|---|---|---|---|---:|---:|
| **KVM 1** | 1 | **4 GB** | 50 GB | 4 TB | **$6.49** | $11.99 |
| KVM 2 | 2 | 8 GB | 100 GB | 8 TB | $8.79 | $14.99 |
| KVM 4 | 4 | 16 GB | 200 GB | 16 TB | $12.99 | $28.99 |
| KVM 8 | 8 | 32 GB | 400 GB | 32 TB | $25.99 | $49.99 |

Verbatim on KVM 1: *"Today you pay $155.76 for 24 months. Renews at $11.99/mo for
the same term. Cancel anytime."* And: *"All plans are paid upfront. The monthly
rate reflects the total plan price divided by the number of months in your plan."*

**KVM 1 is the right size, and it fixes a real constraint.** The production host
has **1.9 GiB RAM and 0 B swap**, with the root filesystem **61% used**
(`copa_2026/production-environment-memory.md`). Measured CPU across the old fleet
was **1.6% average**. So 1 vCPU is ample and **4 GB is more than double the
memory the box has now** — which matters because `npm run build` (vite + `tsc`)
runs on the production host, and that work is memory-bound, not CPU-bound. KVM 1
is a downgrade on vCPU count and an upgrade on everything that is actually tight.

---

## Cost, side by side

**Baseline.** September 2026, measured from Cost Explorer (prior assessment §
Baseline): **$60.15/mo** total, $52.83 pre-tax + ~13.9% tax (*Amazon AWS Serviços
Brasil Ltda.*), for two instances at 1.6% CPU.

Since then Phases 0–2 and 4 completed and **Host B was stopped 2026-10-23 —
stopped, not terminated, with its EIP and volume retained** for the rollback
window. So the bill today is lower than September's but still carries Host B's
disk and IP:

| Line | Sept (measured) | Now (**inferred**) |
|---|---:|---:|
| EC2-Instances | 36.29 | ~24.53 — `t3.small` only, $0.0336/h × 730 (third-party) |
| EC2-Other (45 GiB gp3 + snapshots) | 8.47 | ~8.47 — a stopped instance keeps its volume |
| VPC (2 × public IPv4 @ $0.005/h) | 7.20 | ~7.20 — retained EIP still bills |
| Route 53 (1 zone) | 0.53 | 0.53 |
| S3 (3 buckets) | 0.34 | 0.34 |
| Pre-tax | 52.83 | **~41.07** |
| Tax ~13.9% | 7.32 | ~5.71 |
| **Total** | **60.15** | **~46.78** |

The $24.53 figure cross-checks: `t3.small` $0.0336/h + `t3.micro` $0.0168/h =
$36.79/mo against September's measured $36.29 — close enough to confirm the
instance identification.

**The options, all-in per month, tax included.** Options A and A+SP are the
roadmap's own measured figures (Phase 0 §5), not re-derived here:

| Option | Monthly | vs today | What it costs to get there |
|---|---:|---:|---|
| **Do nothing** | ~$46.78 | — | — |
| **A. Finish what is scoped** — terminate Host B, Cloudflare DNS | **~$38.4** | −$8.4 | Nothing. Already planned, no vendor change |
| **A + 1-yr no-upfront Compute Savings Plan** | **~$26–28** | −$19 to −$21 | A 1-year account commitment, no architectural change |
| **B. Lightsail 2 GB sa-east-1** (roadmap Phase 3) | **~$14.05** | −$32.7 | Loses SSM + instance roles |
| **C. Hostinger KVM 1, Brazil** | **~$6.9** → ~$12.4–13.3 after 24 mo | −$40 → −$34 | Loses SSM + instance roles, **and** AWS; $155.76 prepaid |

B and C assume Cloudflare DNS (free) and keeping the S3 backup bucket ($0.34).
C's renewal range reflects the unresolved tax question below. These reconcile
with the roadmap: $41.07 pre-tax − $6.08 (Host B) = $34.99, against its measured
Option A of ~$34.5 pre-tax / ~$39 with tax.

⚠️ **Note what this table does to the headline.** Against today's ~$46.78 the
provider change looks like it saves $40. But **$19–21 of that is available from
Option A + a Savings Plan, inside AWS, with no migration at all.** The
provider-change decision is really C (~$6.9) against A+SP (~$26–28) — about
**$19/month** — and then C against B, which is where it gets thin.

### The number that decides it

**Hostinger KVM 1 renews at $11.99. Lightsail 2 GB is $12.00. That is a one-cent
difference.** Hostinger's clear advantage is the 24-month introductory rate:
**$5.51/month × 24 = $132 total**, prepaid, after which the two are level on
list price.

**One caveat that could extend the advantage past the intro period:** the AWS
bill carries ~13.9% tax via *Amazon AWS Serviços Brasil Ltda.*, so Lightsail's
$12.00 is really **~$13.67** delivered. If Hostinger invoices without a
comparable Brazilian tax, its $11.99 renewal stays near $12 and the edge is
~$1.70/month indefinitely rather than ending at month 24. If Hostinger bills a
Brazilian entity with similar tax, the two converge exactly. **This is
unverified and it is worth one invoice to settle** — see "Not verified".

And the blockers are the *same* — all three of them. The roadmap's Phase 3
escalated this on 2026-10-06 and the language is unambiguous: Lightsail has **no
SSM**, so `brasileirao`'s CI job that delivers releases with `aws ssm
send-command` *"cannot run at all"*, and moving means **rewriting the production
deploy pipeline, not reconfiguring it** — reintroducing inbound SSH from GitHub's
runners, *"which is precisely what the current design was built to avoid."* The
roadmap's own words: *"This alone may be disqualifying."* It also removes the
**lockout recovery path** (`aws ssm start-session` is the documented way back in
when the pinned-IP SSH rule stops matching a dynamic lease), and it **forces a
static IAM key** on the box for the S3 backup timer, which the roadmap calls
*"a genuine security regression."*

**Hostinger has none of those three either, and it is further away** — no AWS
console, no CLI against the host, and no Lightsail browser console as a last
resort. It also inherits the roadmap's secondary loss: detailed CloudWatch EC2
metrics, which, as that document notes about itself, *"this entire assessment
depended on."*

Critically, the roadmap already concluded that this trade is bad enough to shift
its own preference: *"The Savings Plan alternative below now looks materially
stronger than when this roadmap was written."* **That judgement applies to
Hostinger with equal force, and for $5.51/month more of saving.** So:

- If the SSM blocker is acceptable → **Hostinger is $132 cheaper than Lightsail
  over two years and has 2× the RAM**, and that is the honest case for it.
- If the SSM blocker is not acceptable → neither B nor C is available, and the
  answer is **Option A + Savings Plan**, inside AWS.

What Hostinger adds on top of Lightsail's blockers: a 24-month prepayment, no AWS
console or CLI for the host, S3 backup writes crossing the public internet
(ingest is free; Hostinger egress is inside the 4 TB allowance), and a new vendor
relationship. The prior assessment rejected tenma.cloud *"on trust, not price"* —
Hostinger is a different case (a long-established registrar and host, with a
physical Brazilian facility covered by national press), but it is still a vendor
change that Lightsail does not require.

**Refund terms (official, policy last revised 30 June 2026):** 30 days from the
transaction, any payment method except cryptocurrency — but **a successful VPS
refund triggers a 180-day cooldown** before another VPS refund is possible. So
the test-and-return route below works exactly once.

---

## Recommendation

**Do the free thing first, then decide B vs C on the SSM question — not on price.**

1. **Terminate Host B** once the stability window closes. It is stopped, so its
   compute already costs nothing — but it still bills its **20 GiB gp3 volume
   (`vol-05b81d57b8e9343d2`, ~$2.43)** and its **elastic IP (~$3.65)**: about
   **$6.08/month pre-tax, ~$6.93 with tax, for a machine that serves nothing.**
   Zero new risk, no vendor involved. This is the single best dollars-per-effort
   item available. ⚠️ Release the EIP and delete the volume explicitly —
   terminating an instance does not always remove them, which is the same trap
   that produced this line item.
2. **Move DNS and the registrar to Cloudflare.** Free, −$0.53/month plus the
   registrar at cost, independent of every other decision. The prior assessment
   already recommends this and `fleet/CLOUDFLARE_DNS_MIGRATION.md` already scopes
   it. ⚠️ **Do not start it from here without checking first:** another session
   is working that same runbook (`local_6c05ee7f`), reported `PREPARED` with no
   step started. The failure mode if both run it is nasty rather than untidy —
   **once delegation moves, edits in Route 53 stop taking effect and edits in
   Cloudflare start, while both consoles keep accepting them and reporting
   success**, which presents as "DNS is not propagating". The apex NS TTL is
   **172800 s (two days)**, so the change is slow to take effect *and* slow to
   roll back. The live coordination board is `devops/SESSIONS.local.md`.
3. Those two take the bill from **~$47 to ~$38.4** with no migration, no
   prepayment and no new provider. Adding the **1-year no-upfront Compute Savings
   Plan** — still no architectural change, and it also covers Graviton, so
   `t4g.small` (~20% under `t3.small`, and both apps are pure JS with no ARM
   blockers) stacks on top — takes it to **~$26–28**. That is **roughly half of
   today's bill without leaving EC2, without rewriting a deploy pipeline and
   without prepaying anyone.** Everything below is optional.
4. **Then settle the SSM question**, because it gates B and C equally and nothing
   else about them differs much. If `brasileirao`'s SSM deploy path can be
   reworked to SSH + GitHub Actions at acceptable cost, both open, and **C
   (Hostinger) beats B by $132 over two years plus 2× the RAM**. If it cannot —
   and the roadmap's own escalated view is that it may be disqualifying — then
   **stop at step 3**. The remaining gap between A+Savings-Plan (~$26–28) and
   Hostinger (~$6.9) is real money, but it is bought by rebuilding a working,
   test-gated, keyless pipeline, and by prepaying a new vendor $155.76.
5. **Drop WordPress entirely.** If the goal is to get `mpbarbosa.com` off the
   paid host, the move is **Cloudflare Pages — free** — which also shrinks
   whatever VPS the two apps end up on.

A note on sequencing: steps 1–3 are worth more per unit of effort than the
provider change, and they do not foreclose it. Doing them first also means the
Hostinger decision gets made against a $32 baseline rather than a $47 one, which
is the honest comparison.

---

## How to do it — Hostinger KVM 1, if step 4 clears

The current stack is Ubuntu + nginx + Node + systemd. Hostinger KVM 1 is Ubuntu +
root. This is a **lift-and-shift, not a re-platform** — which is exactly why it is
feasible and why WordPress is not.

**Phase 0 — prove the region before paying for two years.**
Buy **one month** (not 24) with **Brazil** selected, or buy 24 months inside the
30-day refund window. Then measure, from the operator's network, before anything
else: `ping -c 20` the new VM's IP, and `curl -w` TTFB against a placeholder page
on it. Compare against the 32–39 ms measured today. If São Paulo turns out to be
Miami — the failure mode a comparison site in the research explicitly warns about
— stop here and refund. Also confirm at checkout that the Brazil location carries
**no price premium**. Do not prepay 24 months until both are confirmed.

**Phase 1 — stand the box up beside production, DNS untouched.**
Install nginx, Node 22 (match `brasileirao`'s measured `22.23.2`; `copa2026` runs
Node 25 on the current host — check which each app needs), and certbot. Clone the
four repos. Recreate the systemd units and the nginx vhosts — `devops` already
has `fleet/phase2/brasileirao.vhost.conf` and the Phase 1 compression work in
`fleet/phase1/conf.d-compression.conf`, so this is copying known-good config, not
authoring it. Build and run all three apps. Test by `/etc/hosts` override or
`curl --resolve`, so no public DNS changes yet.

**Phase 2 — rework the three things that do not follow.**
These are the real work, and they are the same for Lightsail:
- ⚠️ **The automated deploy hook, which this document originally missed.**
  `devops/scripts/git_sync.sh` runs on the production host every 10 minutes;
  lines 187-197 hardcode `if [[ "$repo" == "mpbarbosa.com" ]]` and then run
  `devops/copa_2026/prod_deploy.sh` → this repo's
  `sync_to_staging.sh --step2 --production-dir /var/www/mpbarbosa.com`. Verified
  2026-11-06: both scripts exist and the chain is live. Two consequences.
  **First, a `git push` is a deploy trigger on that host's clock** — so the chain
  keeps publishing to the EC2 box until the hook is removed, which means a
  cutover can appear to succeed while the old origin goes on being updated.
  **Second, it fails silently:** a missing or non-executable target logs only
  `log WARN` and `git_sync.sh` continues, visible in
  `~ubuntu/.local/log/git_sync.log` and nowhere else — and that log rotates at
  500 KB keeping one copy, so it reaches back about a day. The same breakage has
  happened once already, via a `copa2026` → `copa_2026` rename. The hooks are
  hardcoded across four sibling repos (`devops`, `mpbarbosa.com`,
  `mpbarbosa_site`, `agora_na_copa_2026`), so **moving, renaming or retiring
  `sync_to_staging.sh` has to update the hook in the same pass.**
- **The SSM deploy path.** `portal_brasileirao`'s primary deploy runs over SSM
  Session Manager, which exists only on EC2. It has a second path already; make
  that one primary, or add an SSH-based GitHub Actions deploy with a deploy key.
  Seven workflows reference AWS — audit each.
- **The keyless OIDC role.** Off EC2 there are no instance roles, so the S3
  backup and any OIDC-assumed role need a scoped IAM access key stored as a
  GitHub secret, or the backups move to **Cloudflare R2** (zero egress, and the
  prior assessment already notes R2 as an option worth little on its own but
  natural here).

**Phase 3 — cut over, with the old box still running.**
TLS first: issue certificates for all six names on the new host (DNS-01 via
Cloudflare, so no downtime window is needed). Then lower the Cloudflare TTL to
60 s, repoint the records, watch logs and `/api/health` on both hosts. Keep the
EC2 instance **stopped, not terminated**, for a stability window — the same
discipline already applied to Host B, and the reason that rollback is still live
today.

**Phase 4 — stop paying AWS.**
Terminate the instance, release the EIP, delete the volumes and snapshots. ⚠️
**EBS keeps billing after an instance is terminated if the volume is retained** —
that is precisely the trap Host B is sitting in right now. Keep the S3 backup
bucket, or finish the R2 move. Expect the final bill to be the S3 line alone.

**Static site, independent of all of the above:** `mpbarbosa.com` can go to
**Cloudflare Pages** today, free, straight from the repo, with no server. It has
no build step. Doing this first removes one of the three workloads from the
migration and makes the remaining VPS decision smaller.

---

## Not verified (and how to close each gap)

- **The current month's bill.** Same gap the prior assessment records, still open
  and confirmed again 2026-10-30: the `mpb` IAM user is denied
  `ce:GetCostAndUsage`, and also `ec2:DescribeInstances`, `ec2:DescribeVolumes`,
  `ec2:DescribeAddresses`, `route53:ListHostedZones`, `cloudfront:*`,
  `lightsail:*`, `pricing:GetProducts`, `budgets:ViewBudget` and `s3:ListBucket`
  on all three buckets. The "Now (inferred)" column above is therefore
  **computed, not read**. Close it by granting the IAM user `ReadOnlyAccess` +
  `Billing`, or read the Billing console directly. **Do this before prepaying
  Hostinger $155.76** — the whole case is built on an inferred baseline.
- **Hostinger's Brazil VPS price premium.** The pricing page shows no location
  breakdown, which is why the premium is recorded as absent. Confirm at checkout
  with Brazil selected. If Hostinger does surcharge Brazil like Akamai (+40%) and
  Vultr (+50%), KVM 1 lands near $9–17/mo and **the entire advantage over
  Lightsail disappears.**
- **VM latency from the Brazilian region.** The 4.5 ms measured above is to
  `hostinger.com.br`, a public edge that may be anycast — not a rented VM. Only a
  running instance settles it. This is Phase 0.
- ~~**Host B's volume size.**~~ **CLOSED 2026-10-30** from the roadmap's Phase 0
  §3: `vol-05b81d57b8e9343d2`, **20 GiB** gp3, created 2026-08-23 (Host A is
  `vol-0685a3bdc5b810709`, 25 GiB). Both `Em uso`, both in `sae1-az1`, no
  orphans. That is what puts step 1's saving at ~$6.08 pre-tax.
- **Two Node versions may be in play on one host, and that is a provisioning
  trap.** The roadmap's Phase 0 §6 resolved an apparent discrepancy by finding it
  was two machines: Host A ran `v25.2.1`, Host B's `/api/health` reported
  `22.23.2`, *"so both figures were right and the comparison was the error."*
  **But the hosts are consolidated now, and `brasileirao`'s `/api/health` still
  reported `22.23.2` when measured 2026-10-30** — on the box the same document
  records as running `v25.2.1`. Either the app is pinned to Node 22 by its
  systemd unit, or that field is baked at build time and has not been rebuilt
  since the move. **Settle which before provisioning**, because if it is a pin,
  the new host needs both runtimes and the roadmap's "Node 22" provisioning step
  is insufficient. Read each unit's `ExecStart` and each `package.json`
  `engines`.
- **Whether `t3.small` is confirmed by the console.** Inferred from
  `totalMem` 1.86 GiB, 2 vCPU, and the arithmetic cross-check against September's
  measured EC2-Instances line ($0.0336 + $0.0168 per hour × 730 = $36.79 against
  $36.29 measured). `ec2:DescribeInstances` is denied.
- ⚠️ **There is no backup policy to migrate behind.** Phase 0 §3 records
  **`0 / 2` volumes backed up in the last 24 h and no Data Lifecycle Manager
  policy**, which made Phase 2's "snapshot both instances" a manual step *"with
  nothing standing behind it."* Any cutover below inherits that: **take a
  manual snapshot of `vol-0685a3bdc5b810709` before touching anything**, and
  treat the absence of automated backups as a reason to keep the EC2 host
  stopped-not-terminated for longer, not shorter.
- **Hostinger's monthly (1-month) KVM 1 price**, needed for the Phase 0
  test-without-prepaying route. Not found on the pricing page, which quotes
  24-month terms only.
- **Brazilian tax on Hostinger invoices.** The AWS bill carries ~13.9% via
  *Amazon AWS Serviços Brasil Ltda.* Whether Hostinger bills a Brazilian entity
  with comparable tax, or invoices from the EU, is not established — and it moves
  the comparison by up to ~$1.70/mo at these prices.

---

## Resumo em uma linha

WordPress is the wrong tool and should be dropped outright; Hostinger's Brazilian
VPS is a real find the prior assessment missed — the first qualifying provider
with no São Paulo premium — but it renews one cent under Lightsail and carries
the same three SSM blockers, so take the **~$8.40/month that costs nothing**
first (terminate the stopped Host B, move DNS to Cloudflare), then the Savings
Plan for **~half the bill without leaving EC2**, and treat Hostinger as a
$132-over-two-years decision that turns on the deploy pipeline, not on the bill.
