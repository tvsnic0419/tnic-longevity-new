import { describe, expect, it } from 'vitest';
import { DEFENSE_STACKS, defenseStackPmids } from './defense-stacks';
import { libraryModules } from './library-modules';

/**
 * Defense-stack integrity guard.
 *
 * These two pages carry more risk than anything else on the site. They are read
 * by people with an active, uncontrolled exposure, and two of their claims —
 * "do not take beta-carotene" and "never combine a stimulant with a serotonergic
 * supplement" — exist specifically to prevent harm. A refactor that quietly
 * dropped a warning, or softened a negative trial into a positive one, would do
 * real damage and would not be obvious in review.
 *
 * So the structure itself is asserted:
 *
 *  1. Every stack states what the exposure costs BEFORE it recommends anything.
 *  2. Every stack carries the cessation benchmark — the comparison that stops
 *     the protocol reading as a substitute for removing the exposure.
 *  3. Every stack has at least one hard 'avoid' warning.
 *  4. Every item is graded AND explains what the grade rests on, so no claim
 *     rides on an unexplained tier badge.
 *  5. Every PMID is well-formed and every compound reference resolves.
 */

describe('defense stacks', () => {
  it.each(DEFENSE_STACKS.map((s) => [s.slug, s] as const))(
    '%s states the exposure risks and the cessation benchmark',
    (_slug, stack) => {
      expect(stack.exposureRisks.length, 'no exposure risks stated').toBeGreaterThan(0);
      for (const r of stack.exposureRisks) {
        expect(r.title.length).toBeGreaterThan(0);
        expect(r.body.length, `${r.title} has no body`).toBeGreaterThan(80);
      }
      // The benchmark is what keeps the protocol honest — it must never be empty.
      expect(stack.cessationBenchmark.body.length).toBeGreaterThan(80);
      expect(stack.cessationBenchmark.citations.length).toBeGreaterThan(0);
    },
  );

  it.each(DEFENSE_STACKS.map((s) => [s.slug, s] as const))(
    '%s carries at least one hard avoid warning',
    (_slug, stack) => {
      const avoid = stack.warnings.filter((w) => w.severity === 'avoid');
      expect(
        avoid.length,
        'a defense stack with no avoid-list is not doing its most important job',
      ).toBeGreaterThan(0);
      for (const w of stack.warnings) {
        expect(w.body.length, `${w.title} warning has no substance`).toBeGreaterThan(80);
      }
    },
  );

  it.each(DEFENSE_STACKS.map((s) => [s.slug, s] as const))(
    '%s grades every item and justifies the grade',
    (_slug, stack) => {
      expect(stack.core.length).toBeGreaterThan(0);
      for (const item of stack.core) {
        expect(['A', 'B', 'C']).toContain(item.tier);
        expect(item.dose.length, `${item.name} has no dose`).toBeGreaterThan(0);
        expect(item.timing.length, `${item.name} has no timing`).toBeGreaterThan(0);
        // A bare tier badge is an assertion; the note is what makes it checkable.
        expect(
          item.tierNote.length,
          `${item.name} carries a tier with no explanation of what it rests on`,
        ).toBeGreaterThan(60);
      }
    },
  );

  it('every compound referenced by a stack exists in the library', () => {
    // Checked against library MODULES, not lib/data.ts's structured compounds:
    // the library ships more compound pages than data.ts has entries, and a
    // link to a real page would otherwise fail this check (aged-garlic did).
    const known = new Set(
      libraryModules
        .filter((m) => m.category === 'compounds')
        .map((m) => m.compoundId ?? m.slug),
    );
    for (const stack of DEFENSE_STACKS) {
      for (const item of stack.core) {
        if (!item.compoundId) continue;
        expect(known.has(item.compoundId), `${stack.slug}: unknown compound "${item.compoundId}"`).toBe(
          true,
        );
      }
    }
  });

  it('every cited PMID is a well-formed 7-8 digit id', () => {
    const pmids = defenseStackPmids();
    expect(pmids.length).toBeGreaterThan(0);
    for (const p of pmids) {
      expect(/^\d{7,8}$/.test(p), `malformed PMID "${p}"`).toBe(true);
    }
  });

  it('every citation says what the study actually found', () => {
    for (const stack of DEFENSE_STACKS) {
      const all = [
        ...stack.exposureRisks.flatMap((r) => r.citations ?? []),
        ...stack.cessationBenchmark.citations,
        ...stack.core.flatMap((c) => c.citations ?? []),
        ...stack.warnings.flatMap((w) => w.citations ?? []),
      ];
      for (const c of all) {
        expect(c.label.length, `${c.pmid} has no label`).toBeGreaterThan(0);
        // A citation with no finding is decoration. The finding is the claim.
        expect(c.finding.length, `${c.pmid} is cited without stating its finding`).toBeGreaterThan(
          25,
        );
      }
    }
  });

  it('keeps the two warnings that exist to prevent harm', () => {
    const smoker = DEFENSE_STACKS.find((s) => s.slug === 'smoker-defense-stack')!;
    const betaCarotene = smoker.warnings.find((w) => /beta-carotene/i.test(w.title));
    expect(betaCarotene, 'the beta-carotene warning has been removed').toBeTruthy();
    expect(betaCarotene!.severity).toBe('avoid');
    // Both trials must stay attached — one alone reads as a single outlier.
    const pmids = (betaCarotene!.citations ?? []).map((c) => c.pmid);
    expect(pmids).toContain('8602180'); // CARET
    expect(pmids).toContain('8127329'); // ATBC

    const stim = DEFENSE_STACKS.find((s) => s.slug === 'stimulant-defense-stack')!;
    const serotonin = stim.warnings.find((w) => /serotonergic/i.test(w.title));
    expect(serotonin, 'the serotonin-syndrome warning has been removed').toBeTruthy();
    expect(serotonin!.severity).toBe('avoid');
  });

  it('does not present the negative NAC trial as a positive result', () => {
    const stim = DEFENSE_STACKS.find((s) => s.slug === 'stimulant-defense-stack')!;
    const nac = stim.core.find((c) => c.compoundId === 'nac')!;
    expect(nac, 'NAC entry missing from the stimulant stack').toBeTruthy();
    // The largest trial was negative, so NAC cannot carry a top grade here.
    expect(nac.tier, 'NAC is graded above what the trial evidence supports').toBe('C');
    const nIce = (nac.citations ?? []).find((c) => c.pmid === '34308314');
    expect(nIce, 'the negative N-ICE trial has been dropped from the NAC entry').toBeTruthy();
    expect(/no significant effect|negative/i.test(nIce!.finding)).toBe(true);
  });
});
