# Affiliate & Sponsor Outreach Kit

A ready-to-run pipeline for turning TNiC's traffic into revenue through
**affiliate partnerships** and **clearly-labeled sponsorships**. It pairs with
two pieces of infrastructure shipped alongside it:

- **Affiliate tagging engine** (`lib/affiliate.ts` → `/api/go`) — attaches your
  affiliate id to outbound product links. Nothing earns until you're accepted
  into a program and add your id (see [Wiring a win into the site](#wiring-a-win-into-the-site)).
- **Sponsorship slots** (`lib/sponsors.ts` + `components/sponsors/SponsorSlot.tsx`) —
  sellable, clearly-labeled placements on the Protocol Brief and partnerships
  pages. Empty until you add a signed placement.

Companion tracker: **`docs/sponsor-outreach-tracker.xlsx`** — log status, dates,
and follow-ups there as you work the list below.

> **Commission/cookie figures are indicative (researched 2026-08-09) and change
> often.** Confirm the live terms on each program's application page before you
> rely on them. Nothing here is a signed agreement.

---

## Why this works for TNiC specifically

TNiC is an unusually strong affiliate/sponsor partner, and the pitch should lean
on what makes it different — not generic "we have traffic" language:

- **Buyer-intent, evidence-first audience.** Readers arrive researching a
  specific compound's *human* evidence and dose before they buy — high intent,
  low refund risk. You already send qualified traffic to 10+ brands.
- **Editorial integrity as a selling point.** "No pay-for-placement, commission
  never changes an evidence tier" is a *feature* for serious brands who don't
  want to be lumped in with pay-to-win review sites. Lead with it.
- **Transparent, disclosed placements.** Every sponsor slot is labeled
  "Sponsored" and linked to your published sponsorship principles — exactly the
  disclosure posture regulators (and the NAD/BBB) now expect in this category.
- **Real numbers to quote.** Pull the current figures from your own
  `/partnerships` page ("The platform, by the numbers": evidence-graded
  compounds, hallmarks, pathways, peptides, head-to-head comparisons, and
  indexed PubMed citations). Use those live counts in every email — they're
  derived from the registries, so they're always accurate.

Two things you are selling:

1. **Affiliate partnerships** — you join *their* program; they pay commission on
   sales from your links. Low friction, mostly self-serve applications.
2. **Sponsorships** — they pay you for a clearly-labeled placement (Protocol
   Brief, tools, partnerships page). Higher value, requires a direct pitch and
   a media-kit conversation.

---

## Ranked target list

Priority = likelihood of acceptance × value to TNiC. **Warm** = the site already
features/links to this brand, so you're already sending them traffic — mention
that in the first line of your email.

### Tier 1 — warm leads with open programs (apply this week)

| # | Company | Warm? | Relationship | Program / network | Est. commission | Cookie | Apply / contact |
|---|---------|-------|--------------|-------------------|-----------------|--------|-----------------|
| 1 | **Life Extension** | ✅ (Taurine pick) | Affiliate | CJ Affiliate | 6% base → 8–12% tiered; AOV ~$170 | **120 days** (longest in CJ) | lifeextension.com/aff |
| 2 | **Thorne** | ✅ (Resveratrol pick) | Affiliate + Ambassador | Direct (Thorne Ambassador) | 10% → 15% → 20% tiered | — | thorne.com/ambassador |
| 3 | **Tru Niagen (ChromaDex)** | ✅ (NR pick) | Affiliate | Impact / direct | 10–15% | 30 days | truniagen.com/pages/affiliate-program |
| 4 | **Codeage** | ✅ (NMN pick) | Affiliate | Awin (also FlexOffers) | 15% | 30 days | codeage.com affiliate registration / Awin |
| 5 | **Double Wood** | ✅ (Pterostilbene, TUDCA picks) | Affiliate | Impact | 10% → 25% tiered; EPC ~$4.10 | 30 days | doublewoodsupplements.com/pages/affiliate-program |
| 6 | **Oxford Healthspan (Primeadine)** | ✅ (Spermidine pick) | Affiliate | Direct | Verify at signup | Verify | oxfordhealthspan.com/pages/register-affiliate-account |

### Tier 2 — high-value longevity brands (expand coverage beyond current picks)

| # | Company | Warm? | Relationship | Program / network | Est. commission | Cookie | Apply / contact |
|---|---------|-------|--------------|-------------------|-----------------|--------|-----------------|
| 7 | **NOVOS** | — | Affiliate | Direct | up to 35% | Verify | novoslabs.com/affiliate-application |
| 8 | **ProHealth Longevity** | — | Affiliate | Direct | Standard affiliate; "healthcare partner" tier 50% first / 35% recurring | Verify | prohealth.com/pages/affiliates |
| 9 | **iHerb** | — | Affiliate | Direct | 5–10%+ tiered (up to ~25% promo) | 7 days | iherb.com/info/affiliates |
| 10 | **DoNotAge.org** | — | Affiliate + Sponsor | Direct | ~10% (partner codes); funds research | Verify | Contact via donotage.org |
| 11 | **Toniiq** | ✅ (Ca-AKG pick) | Affiliate | Verify (Amazon-heavy brand) | Verify | Verify | Contact via toniiq.com / Amazon |
| 12 | **GNC / Nature's Fusions** | ✅ (GlyNAC pick) | Affiliate | CJ / Impact (historically) | Verify | Verify | GNC affiliate program via network |
| 13 | **Allergy Research Group** | ✅ (Sulforaphane pick) | Affiliate | Verify | Verify | Verify | Contact via allergyresearchgroup.com |
| 14 | **GeroNova** | ✅ (R-ALA pick) | Affiliate | Direct (small brand) | Verify | Verify | Direct email — geronova.com |

### Tier 3 — affiliate networks (join once, unlock many brands)

Joining these networks lets you apply to hundreds of supplement/health merchants
from one dashboard, and is how several Tier 1–2 brands above are actually run.

| Network | Notable brands it carries | Sign up |
|---------|---------------------------|---------|
| **Impact** | Double Wood, ChromaDex/Tru Niagen | impact.com |
| **CJ Affiliate** | Life Extension, GNC | cj.com |
| **Awin** | Codeage | awin.com |
| **ShareASale** | Broad supplement catalog | shareasale.com |
| **FlexOffers** | Aggregator across the above | flexoffers.com |
| **Amazon Associates** | Universal catalog (backstop) | affiliate-program.amazon.com — note: Health & Personal Care pays only ~1% |

> **Sequencing tip:** create your Impact and CJ accounts first (Tier 3), because
> Tier 1 brands #1, #3, #4, #5 are administered through them — you'll often apply
> to the brand *inside* the network.

---

## Wiring a win into the site

The moment a brand accepts you, make the links earn — three cases:

1. **Amazon** → set `AMAZON_ASSOCIATES_TAG=yourtag-20` in Vercel. Every
   `amazon.*` outbound link is tagged automatically.
2. **Query-parameter programs** (a brand that appends `?rcode=…`, `?refID=…`,
   etc.) → add one entry to the `TNIC_AFFILIATE_RULES` env JSON, e.g.
   `[{"domain":"thorne.com","param":"refID","value":"tnic"}]`. No code change.
3. **Deep-link programs** (Impact / CJ / Awin / ShareASale give you a full
   tracking URL) → paste that URL into the matching pick's `affiliateUrl` in
   `lib/product-picks.ts`. The redirect already prefers `affiliateUrl` over
   `purchaseUrl`, and the tagging engine leaves it untouched.

For a **sponsorship**, add a placement object to `SPONSORS` in `lib/sponsors.ts`
(the file has a commented example) — it appears in that slot immediately, labeled
"Sponsored."

---

## Email templates

Replace every `{...}` placeholder. Keep them short — decision-makers skim.
Pull live platform numbers from your `/partnerships` page.

### Template A — Warm-lead affiliate outreach (Tier 1)

> **Subject:** TNiC already sends buyers to {Brand} — can we make it official?
>
> Hi {Name / "{Brand} Partnerships team"},
>
> I run TNiC (tnic.help), an independent, evidence-graded longevity library.
> We already feature {Brand}'s {product} as our recommended pick for {compound}
> and send readers to your site — I'd like to formalize that as an affiliate
> partnership so the traffic is tracked on your side.
>
> Why our traffic converts: readers reach us researching a specific compound's
> human evidence and studied dose *before* they buy — high intent, low refund
> risk. We grade every compound A–C by strength of human evidence with traceable
> PubMed citations ({N} indexed), covering {N} compounds across all 12 hallmarks
> of aging.
>
> One thing to know up front: we don't do pay-for-placement — commission never
> changes an evidence tier or which product we recommend. That editorial line is
> exactly why serious brands like partnering with us.
>
> Is there an affiliate program I should apply to, or someone I can talk to?
>
> Thanks,
> {Your name} — TNiC · protocol@tnic.help

### Template B — Cold affiliate application follow-up / inquiry (Tier 2)

> **Subject:** Affiliate partnership — TNiC (evidence-graded longevity library)
>
> Hi {Brand} team,
>
> I'd like to apply to your affiliate program. TNiC (tnic.help) is an
> independent longevity education platform — {N} evidence-graded compounds, all
> 12 hallmarks of aging, {N} head-to-head comparisons, {N} PubMed citations —
> built for advanced consumers who research the science before they buy.
>
> {Brand} is a strong fit for our audience because {one specific reason —
> e.g. "your NMN is used in published human trials, which matches how we grade"}.
> We'd feature you within our editorial standards (clear affiliate disclosure,
> no pay-for-placement).
>
> Where should I apply, and are there tiered/exclusive rates for content
> partners who send qualified, in-market traffic?
>
> Best,
> {Your name} — TNiC · protocol@tnic.help

### Template C — Direct sponsorship pitch (for the on-site slots)

> **Subject:** Sponsoring TNiC — a disclosed, evidence-first placement
>
> Hi {Name},
>
> TNiC (tnic.help) has clearly-labeled sponsorship inventory open on our
> highest-intent surfaces: the Protocol Brief research digest and our tools/
> partnerships pages. Every placement is marked "Sponsored" and linked to our
> published sponsorship principles — the disclosure posture regulators now
> expect in this category, and a clean fit for a brand that doesn't want to look
> like a pay-to-win review.
>
> Audience: advanced longevity consumers actively researching compounds,
> biomarkers, and stacks. The numbers are live on tnic.help/partnerships.
>
> Our non-negotiables (they protect your brand too): no paid evidence-tier
> upgrades, no silent sponsored recommendations, no sponsor control over
> methodology or citations, no sale of user data.
>
> Could I send our one-page rate card and available slots?
>
> Thanks,
> {Your name} — TNiC · protocol@tnic.help

### Template D — Follow-up (send 5–7 days after no reply)

> **Subject:** Re: {original subject}
>
> Hi {Name}, floating this back to the top in case it slipped by. Happy to keep
> it simple — even just the link to your affiliate application works, and I'll
> take it from there. Thanks! — {Your name}, TNiC

---

## Compliance notes (keep the money clean)

- **Always disclose.** The FTC (and NAD/BBB — see the 2023 Renue by Science
  decision) require conspicuous affiliate disclosure. TNiC already does this in
  the footer and via `rel="sponsored"` on outbound links; keep it.
- **Never trade tiers for commission.** The "no pay-for-placement" line is both
  an ethics rule and your best sales argument — don't undercut it.
- **YMYL health care.** Keep sponsor copy free of disease/treatment claims;
  route everything through the existing disclaimer posture.
- **Track everything** in `docs/sponsor-outreach-tracker.xlsx` so you can show a
  buyer a clean revenue/partnership picture later (a valuation lever per
  `docs/GROWTH_ROADMAP.md`).
