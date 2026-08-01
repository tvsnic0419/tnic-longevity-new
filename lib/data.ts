/**
 * Back-compat barrel for the former monolithic data module.
 *
 * PERFORMANCE: importing from this file pulls in EVERY dataset below. That is
 * fine for server components (nothing ships to the browser), but a `'use
 * client'` component that imports from here ships the whole content library —
 * compounds, the research feed, every FAQ answer — to the browser, even if it
 * only needed `navLinks`. That was measured at ~1.2 MB of JS on a static
 * privacy page.
 *
 * Client components must import from the focused module instead:
 *   import { navLinks } from '@/lib/data/nav';
 *   import { compounds } from '@/lib/data/compounds';
 */
export * from './data/nav';
export * from './data/compounds';
export * from './data/biomarkers';
export * from './data/research-feed';
export * from './data/competitors';
export * from './data/hallmarks';
export * from './data/engine';
export * from './data/trust-content';
export * from './data/glossary';
export * from './data/faq';
