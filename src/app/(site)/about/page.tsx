import type { Metadata } from 'next';
import { Container } from '@/components/ui/Container';
import { Prose } from '@/components/ui/Prose';
import { siteConfig } from '@/lib/site-config';

export const metadata: Metadata = {
  title: 'About',
  description:
    'The story behind Rasmus Hansen — how software development, aikido, and long-term investing braid into one path toward a life split between Denmark and Japan.',
};

/**
 * About page (Server Component) — the developer, aikidoka, and long-term
 * investor threads told as ONE coherent story (CORE-02), not three siloed
 * sections, woven around the Japan/freedom throughline from PROJECT.md.
 * Static typed prose — no content pipeline needed for Phase 1.
 */
export default function About() {
  return (
    <Container className="py-16 sm:py-24">
      <Prose>
        <h1 className="text-heading font-semibold sm:text-display">About {siteConfig.name}</h1>
        <p>
          I&apos;m Rasmus — a software developer, and for the last few years those two words have
          been in service of a third: freedom. Not the vague kind, but a specific, compounding
          kind — the freedom to spend part of every year living and working from Japan, and to
          build a life where a laptop, a mat, and a long time horizon are all I really need.
        </p>
        <p>
          The developer thread is the engine. I build software professionally and, increasingly,
          for myself — shipping products and small SaaS experiments on the side, learning the
          unglamorous parts of running something (pricing, positioning, actually finishing) as
          much as the code itself. Every project I ship is one more rep toward being able to
          work from anywhere, on my own terms, which is the whole point.
        </p>
        <p>
          The aikido thread is where I learned what patience under pressure actually looks like.
          I train under Mark Jewkes (6th dan Aikido, 4th dan Iaido), and the discipline of the mat — showing
          up, falling, getting back up, refining the same technique for years — turned out to be
          the same discipline that ships software and holds an investment thesis for a decade.
          My first trip to Japan wasn&apos;t a vacation; it was an international Aikido seminar
          with eight training partners, and it&apos;s the trip that made &quot;living there part
          of the year&quot; feel less like a daydream and more like a plan with a budget.
        </p>
        <p>
          The investor thread is the part most people don&apos;t see. I started investing at 30,
          later than I&apos;d have liked, which is exactly why I care about it: long-term,
          unglamorous, compounding capital toward a concrete goal — a 1M DKK portfolio — is the
          financial version of the same patience aikido taught me on the mat. It&apos;s what
          turns &quot;I&apos;d like to split my life between Denmark and Japan&quot; from a wish
          into a number I can actually track.
        </p>
        <p>
          None of these are side projects to each other. The code funds the trips, the mat
          teaches the patience the code and the portfolio both need, and the portfolio buys back
          the time to keep doing all three. This site is where I write that story down as it
          happens — the wins, the failed experiments, and the slow, compounding progress toward
          Japan.
        </p>
      </Prose>
    </Container>
  );
}
