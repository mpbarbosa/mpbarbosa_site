# Roadmap — Clear AdSense "ads.txt: Não encontrado" for mpbarbosa.com

**Goal:** make Google AdSense find `ads.txt` for the registered site `mpbarbosa.com`,
clearing the **`Status do ads.txt: Não encontrado`** flag on the AdSense
"Gerenciar seus sites" page.

**Chosen strategy:** serve `ads.txt` at the **apex** `mpbarbosa.com` (the
"correct" canonical-domain path), via this `mpbarbosa_site` repo + Route 53 +
nginx. (A shortcut alternative is in the appendix.)

---

## Verified facts (the starting state)

| Thing | Value / status | How verified |
|---|---|---|
| AdSense publisher ID | `pub-9509229216258895` | URL in the AdSense screenshot |
| Correct `ads.txt` line | `google.com, pub-9509229216258895, DIRECT, f08c47fec0942fa0` | matches the copa2026 file already accepted by the same account |
| Apex `mpbarbosa.com` DNS | **No record** — does not resolve | `dig +short mpbarbosa.com` → empty |
| `www.mpbarbosa.com` DNS | Resolves → `18.229.20.196` (personal/professional site) | `dig +short www.mpbarbosa.com` |
| `www.mpbarbosa.com/ads.txt` | **404** (file not deployed yet) | `curl -I https://www.mpbarbosa.com/ads.txt` |
| `copa2026.mpbarbosa.com/ads.txt` | **200** (different app — Agora na Copa — already fine) | `curl https://copa2026.mpbarbosa.com/ads.txt` |
| Deploy chain (this repo) | `src/` → staging repo `../mpbarbosa.com` → rsync to `/var/www/mpbarbosa.com` | `shell_scripts/prod_deploy.sh`, `deploy_to_webserver.sh` |
| Root-file sync | **Explicit per-file allow-list** in `sync_to_staging.sh` (not a wholesale `src/` copy) | code read |
| AWS user `mpb` | **No Route 53 permissions** (`route53:ListHostedZones` denied) | `aws route53 list-hosted-zones` |

**Why the flag is red:** AdSense fetches `https://mpbarbosa.com/ads.txt` (the
registered apex). The apex has no DNS record, so the fetch fails regardless of
any file. Fixing it needs **both** a served file **and** apex DNS + nginx.

---

## Phase 0 — Code changes (DONE, staged in this repo, uncommitted)

These are already written in the working tree:

- [x] `src/ads.txt` — the ads.txt file (correct publisher line)
- [x] `shell_scripts/sync_to_staging.sh` — added `copy_ads_txt()` + wired it into
      the step-1 flow (without this, the deploy's allow-list silently skips the file)
- [x] `src/__tests__/staging_content.test.js` — presence + publisher-line tests,
      mirroring the existing `robots.txt` test

**Next action:** review, then commit (Phase 1).

---

## Phase 1 — Commit + deploy the file (serves it at `www`)

- [ ] Review the diff
      ```bash
      cd ~/Documents/GitHub/mpbarbosa_site
      git status --short
      git diff
      ```
- [ ] Commit
      ```bash
      git add src/ads.txt shell_scripts/sync_to_staging.sh src/__tests__/staging_content.test.js
      git commit -m "feat: serve ads.txt for Google AdSense"
      ```
- [ ] Deploy (runs on the prod host, per this repo's flow)
      ```bash
      ./shell_scripts/prod_deploy.sh
      ```
- [ ] **Verify** `ads.txt` is live at `www`:
      ```bash
      curl -s https://www.mpbarbosa.com/ads.txt
      # expect: google.com, pub-9509229216258895, DIRECT, f08c47fec0942fa0
      ```

> ✅ End of Phase 1: file is served at `www`, but AdSense (checking the apex)
> is still red. Continue to Phase 2.

---

## Phase 2 — Route 53: make the apex resolve

Console → Route 53 → Hosted zone **`mpbarbosa.com`** → **Create record**:

| Field | Value |
|---|---|
| Record name | *(blank — the zone apex `mpbarbosa.com`)* |
| Record type | **A** |
| Value | `18.229.20.196` |
| TTL | 300 |
| Alias | **Off** |

- [ ] Create the apex **A** record above
- [ ] **Pre-check:** confirm `18.229.20.196` is an **Elastic IP** (static). If it
      is an auto-assigned public IP, attach an EIP first so it can't change.
- [ ] **Verify** resolution (allow a few minutes for TTL):
      ```bash
      dig +short mpbarbosa.com        # expect: 18.229.20.196
      ```

> **Why A, not CNAME/Alias:** a zone apex can't be a CNAME (DNS spec), and Route
> 53 Alias only targets AWS resources (CloudFront/ELB/S3), not a raw IP. A plain
> A record to the IP is the right tool here.

---

## Phase 3 — nginx + TLS on the prod host (answer the apex)

Resolving DNS isn't enough — nginx currently only answers for `www`, so a
request to the bare apex won't match any server block.

- [ ] Add an apex server block that 301-redirects to `www` (AdSense follows
      redirects when fetching `ads.txt`):
      ```nginx
      server {
          listen 80;
          listen 443 ssl;
          server_name mpbarbosa.com;          # apex only
          # ssl cert MUST cover the apex SAN (see TLS step below)
          return 301 https://www.mpbarbosa.com$request_uri;
      }
      ```
- [ ] Extend the TLS cert to cover the apex (a www-only cert fails the handshake
      on `https://mpbarbosa.com` *before* the redirect). With certbot:
      ```bash
      sudo certbot --nginx -d mpbarbosa.com -d www.mpbarbosa.com
      ```
- [ ] Reload nginx:
      ```bash
      sudo nginx -t && sudo systemctl reload nginx
      ```
- [ ] **Verify** the apex now serves the file through the redirect:
      ```bash
      curl -sL https://mpbarbosa.com/ads.txt        # expect the publisher line
      curl -sI https://mpbarbosa.com/ads.txt | head # expect 301 → www
      ```

---

## Phase 4 — Tell AdSense to re-check

- [ ] In AdSense → **Sites** → `mpbarbosa.com`, trigger a re-review / verify of
      the ads.txt status (or simply wait — Google re-crawls ads.txt periodically,
      typically within a day or so).
- [ ] Confirm **`Status do ads.txt`** flips from `Não encontrado` to found/OK.

> Note: `Status de aprovação: Precisa de revisão` is a **separate** item (content
> + traffic review) and is not gated on ads.txt. It clears on Google's own
> review timeline.

---

## Done when

- `curl -sL https://mpbarbosa.com/ads.txt` returns the publisher line, **and**
- AdSense no longer shows `ads.txt: Não encontrado` for `mpbarbosa.com`.

---

## Appendix — Shortcut alternative (skips Phases 2–3)

If you'd rather not touch DNS/nginx/TLS: in AdSense, **change the registered
site** from `mpbarbosa.com` to **`www.mpbarbosa.com`**. That host already
resolves, so after **Phase 1** alone the file is served and AdSense can find it.
Trade-off: `www` becomes your canonical AdSense domain instead of the bare apex.

---

## Rollback notes

- **File/deploy (Phase 1):** revert the commit and redeploy; `ads.txt` is
  additive and serves no purpose to anyone but ad crawlers, so leaving it is
  harmless.
- **Route 53 (Phase 2):** delete the apex A record to return to the prior
  (non-resolving) state.
- **nginx (Phase 3):** remove the apex server block and reload. Keep the
  broadened cert — it does no harm.
