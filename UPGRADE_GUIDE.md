# TNiC Visual & Interactive Upgrade Guide

This guide documents the new components added by the priority-upgrades sprint and how to integrate them into your pages.

---

## New Components

### `components/Hero.tsx`
A standalone, full-bleed hero section with a dark navy background, emerald accent palette, and two CTA buttons.

**Usage**
```tsx
import Hero from '@/components/Hero';

// Basic — scrolls to #recommendations and #science on click
<Hero />

// With custom click handlers
<Hero
  onJoinClick={() => router.push('/stacks')}
  onExploreClick={() => router.push('/learn')}
/>
```

**Image requirement:** Place your hero image at `public/images/hero-tnic.jpg`. The component overlays a gradient and dot grid so any scientific/abstract image works.

---

### `components/ProductCard.tsx`
A reusable affiliate-ready product card with image, evidence badge, tags, and dosage note.

**Usage**
```tsx
import { ProductCard } from '@/components/ProductCard';

<ProductCard
  name="Tri-NMN Complex"
  brand="Renue By Science"
  description="Liposomal NMN + NADH for superior NAD+ restoration."
  dosageNote="250–500 mg NMN daily, taken in the morning."
  purchaseUrl="https://example.com/nmn"
  imageSrc="/images/products/nmn.jpg"
  evidenceLevel="strong"          // 'strong' | 'moderate' | 'emerging'
  tags={['NAD+', 'Mitochondria']}
/>
```

Use `compact={true}` for rail/grid layouts where space is tight.

---

### `components/ResilienceQuiz.tsx`
A 3-question inline quiz that scores the user and outputs a personalized compound recommendation with a next-step CTA.

**Usage**
```tsx
import { ResilienceQuiz } from '@/components/ResilienceQuiz';

// Drop in anywhere — self-contained, no server calls
<ResilienceQuiz />

// With custom wrapper class
<ResilienceQuiz className="max-w-lg mx-auto" />
```

The quiz outputs one of three tiers: **Foundation Builder**, **Cellular Optimizer**, or **Longevity Advanced**, each with a curated compound list and a contextual next-step link.

---

## Integration into `app/page.tsx`

Add the quiz between `<HomepageTrustStrip />` and `<HomepageOSFunnel />` for maximum funnel placement:

```tsx
import { ResilienceQuiz } from '@/components/ResilienceQuiz';

// In HomePage JSX:
<HomepageTrustStrip />
<section className="container-page py-16">
  <ResilienceQuiz className="max-w-xl mx-auto" />
</section>
<HomepageOSFunnel />
```

---

## Vercel Deployment

1. Push this branch to GitHub.
2. Vercel auto-deploys on merge to `main` (see `.github/workflows/ci.yml`).
3. Confirm `CRON_SECRET` and `LAB_WEBHOOK_SECRET` env vars are set in the Vercel dashboard (see `.env.example`).
4. Visit the preview URL listed in the Vercel deployment to QA before promoting.
