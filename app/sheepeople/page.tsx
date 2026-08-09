import type { Metadata } from 'next';
import { Nav } from '@/components/Nav';
import { Footer } from '@/components/Footer';
import { NotebookPen } from 'lucide-react';

/**
 * The back page — an unlisted survival cheat sheet for psychologically harmful
 * mental warfare (mobbing, gaslighting, being worn down on purpose) that the
 * reader didn't sign up for and doesn't deserve. Kept out of search (noindex)
 * and out of the sitemap/nav; reachable by direct URL and one discreet,
 * keyboard-focusable footer link. Not clinical content — validation + established,
 * safe coping strategies (documentation, disengagement, grey-rock, breaking
 * isolation, boundaries, survival-mode permission). No fabricated claims.
 */
export const metadata: Metadata = {
  title: 'How to survive attack of the sheepeople',
  description:
    'A back-page survival cheat sheet for the kind of harm that’s aimed at your mind — the game everyone seems in on but you. You didn’t sign up for it and you don’t deserve it.',
  robots: { index: false, follow: false },
};

const points: Array<{ title: string; body: string }> = [
  {
    title: 'It’s not you. (Read that twice.)',
    body: 'The whole point of this kind of pressure is to make you doubt yourself so you’ll do the taking-apart for them. That you’re even asking “is it me?” shows how hard you’ve been pushed — not that it is. The people who are actually the problem almost never ask.',
  },
  {
    title: 'Keep a record — it’s your reality anchor.',
    body: 'When someone rewrites what happened, your own memory starts to feel unreliable. Write it down: what was said, when, how it felt. Not to win a case — to keep one place where the truth can’t be edited. Reread it when they try to tell you it didn’t happen.',
  },
  {
    title: 'You don’t have to attend every fight you’re invited to.',
    body: 'Some people argue to trap you, not to understand you. You will never explain your way to fair with someone committed to misreading you. Walking away isn’t losing — it’s refusing to keep feeding a machine that runs on your reaction.',
  },
  {
    title: 'Starve the show.',
    body: 'A lot of this runs on getting a rise out of you so they can point and say “see?” Flat, brief, boring answers give them nothing to use. Your calm isn’t surrender — it’s you taking away the fuel.',
  },
  {
    title: 'Break the isolation — one witness is enough.',
    body: 'Isolation is the weapon; it makes their version the only version. You don’t need an army. One person outside it who can say “no, you’re not crazy” cracks the whole thing open. Being believed by even one person is medicine.',
  },
  {
    title: 'Your worth is not up for a vote.',
    body: 'Least of all by people who benefit from your doubt. “Not good enough as you are” is the lie the pressure needs you to swallow. You were enough before any of them, and you’ll be enough after.',
  },
  {
    title: 'Get small to get through — that’s allowed.',
    body: 'Going numb, shrinking, saying what they want to be left alone — those are survival skills, not failures. Survive first; process later, when you’re safe. Outlasting it is winning.',
  },
];

export default function SheepeoplePage() {
  return (
    <div className="min-h-screen canvas-scrim text-foreground">
      <Nav />
      <main id="main-content" tabIndex={-1} className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(#12203c_0.8px,transparent_1px)] [background-size:22px_22px] opacity-40" />
          <div className="absolute -left-32 top-0 h-[34rem] w-[34rem] rounded-full bg-[radial-gradient(circle,rgba(0,224,255,0.10),transparent_60%)] blur-2xl" />
        </div>

        <section className="container-page max-w-3xl py-20 md:py-28">
          <p className="text-label mb-4 text-accent-cyan">The back page</p>
          <h1 className="heading-page mb-5">How to survive attack of the sheepeople.</h1>
          <p className="text-body text-muted-foreground">
            If it feels like a game everyone’s in on but you — that’s not paranoia,
            and it’s not a flaw in you. Being worn down on purpose is a real thing
            real people do. You didn’t imagine it, you didn’t cause it, and needing
            a cheat sheet to survive it doesn’t make you weak. It makes you someone
            under fire who’s still standing.
          </p>

          {/* The seven */}
          <ol className="mt-12 space-y-8">
            {points.map((p, i) => (
              <li key={p.title} className="flex gap-4">
                <span
                  aria-hidden="true"
                  className="mt-0.5 shrink-0 font-mono text-sm font-semibold text-accent-cyan/70 tabular-nums"
                >
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h2 className="font-display text-xl font-medium tracking-tight text-foreground">
                    {p.title}
                  </h2>
                  <p className="text-body mt-1.5 text-muted-foreground">{p.body}</p>
                </div>
              </li>
            ))}
          </ol>

          {/* About the joke */}
          <div
            className="premium-card mt-12 p-6 md:p-8"
            style={{ ['--card-accent' as string]: 'var(--accent-amber)' }}
          >
            <h2 className="text-h3 mb-2">About the joke.</h2>
            <p className="text-body text-muted-foreground">
              If they’ve made you the punchline, that says everything about the kind
              of people they are — and nothing about you. Cruelty in a costume of
              humor is still cruelty. You’re not the joke. You’re the target of
              people who can’t tell the difference.
            </p>
          </div>

          {/* Parting action — take notes */}
          <div
            className="premium-card mt-6 p-6 md:p-8"
            style={{ ['--card-accent' as string]: 'var(--accent-cyan)' }}
          >
            <div className="mb-2 flex items-center gap-2">
              <NotebookPen className="h-4 w-4 text-accent-cyan" aria-hidden="true" />
              <h2 className="text-h3">Start with one thing — take notes.</h2>
            </div>
            <p className="text-body text-muted-foreground">
              Write down what happened today — the words, the time, how it felt —
              before anyone gets to tell you it didn’t. Keep it somewhere only you
              can reach. That page is proof to yourself that you’re not making it
              up, and the first thing that stops the ground moving under you.
            </p>
          </div>

          {/* Close */}
          <div className="mt-14 border-t border-border/50 pt-8">
            <p className="font-display text-2xl font-medium leading-snug tracking-tight text-foreground">
              You didn’t sign up for this and you don’t deserve it. Full stop.
            </p>
            <p className="text-body mt-4 text-muted-foreground">
              Surviving it isn’t nothing — some days it’s the whole job, and doing
              it is enough. Come back to this page whenever you need to hear it again.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
