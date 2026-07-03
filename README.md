# KFN Accounting & Financial — Website Redesign

A complete redesign of [kfnfinancial.com](https://www.kfnfinancial.com/) as a static site — no build step, host anywhere (Netlify, Vercel, Cloudflare Pages, or any web host).

Two full design directions were built; the client-selected direction lives in `site/`:

- **`site/` — "Obsidian Volt"** (current): global-powerhouse register modeled on Big Four
  visual language (research pass fetched Deloitte, KPMG, EY, Accenture, Grant Thornton, BDO live).
- **`site-v1-modern-trust/`** (archived): the earlier navy/gold "private bank" direction,
  kept for comparison.

## Design direction: "Obsidian Volt"

Weight without noise — modern, power, strength, success:

- **Palette**: obsidian `#0A0A0C` + pure white strata, one electric volt accent `#C6FF32`
  (dark surfaces only; `#4C7300` volt-ink on light — the pair rule keeps it AA everywhere)
- **Type**: Archivo (monumental grotesk display, up to 116px) + Inter (silent body)
- **Power devices**: the volt full-stop mark ending every headline, full-width mega-menu,
  annual-report running-head section numbering, giant tabular "Engagement Standards" numerals,
  hairline broadsheet practice grid, SteveKnows AI presented as a flagship product with a
  terminal readout (status words only — nothing fabricated), the volt-rule CTA band,
  and a monument footer with a 300px ghosted "KFN∎"
- **Honesty rule**: scale is performed by design discipline, not claims — no fake headcount,
  offices, clients, or metrics anywhere. Stats used: 50 states, 6 practices, CPA/CFE,
  1-business-day response.

## Structure

```
site/
  index.html                All pages share utility bar / header + mega-menu / footer chrome
  tax.html                  Practice 01 — Tax Preparation & Planning
  accounting.html           Practice 02 — Accounting & Bookkeeping
  cfo-services.html         Practice 03 — Fractional CFO
  business-management.html  Practice 04 — Private Business Management (HNW)
  work-with-us.html         Process + booking + contact form + #advisory (05) + #angel (06)
  business-ai.html          SteveKnows AI flagship platform page
  about.html                Firm story + Kyle F. Nader, CPA/CFE
  tax-refund.html           Federal + Illinois refund trackers (current IRS guidance)
  privacy-policy.html       Rebuilt from the live GLBA notice
  disclaimer.html           Draft disclaimer (counsel review flagged)
  css/main.css              Entire design system
  js/main.js                Header, mega-menu, mobile nav, reveals, count-ups,
                            terminal type-on, accordions, polyline draw
```

## Preview locally

```
node serve.mjs        # http://localhost:4173 (respects PORT env)
```

## Client presentation preview

A single-file compilation of all 11 pages (embedded fonts, hash-based navigation) is
published at https://claude.ai/code/artifact/acaf31d0-8a9a-40ea-83f2-512f9e819df5
(private by default — share from that page). Rebuild it by re-running the compiler
step if the site changes; source of truth is always `site/`.

## Carried over from the v1 rebuild (fixes vs the live site)

- Every CTA points at the firm's real Calendly (`calendly.com/kfn_/taxes-1`) — the live site's
  booking button linked back to its own page
- Corrected `Chicago, IL 600611` → `60611`; Michigan Ave HQ address surfaced
- Consistent founder title, corrected career-timeline order, grammar cleaned throughout
- "Avoiding taxes" → "minimizing tax liability"; refund timing updated to current IRS guidance
- SteveKnows unified into one public page (was split across a password wall + a stub)

## Before launch (client to-dos)

1. **Photography**: Kyle's portrait is a monogram placeholder (about.html + index.html) —
   spec: obsidian duotone treatment.
2. **Contact form** (work-with-us.html) uses a `mailto:` fallback — swap for Formspree/Basin/
   Netlify Forms.
3. **Newsletter form** is front-end only — wire to a provider.
4. **Legal review**: privacy-policy.html and disclaimer.html carry counsel-review comments.
5. **Confirm process promises**: intro-call length and "quote within 2 days" are suggested
   commitments — confirm with the firm.
