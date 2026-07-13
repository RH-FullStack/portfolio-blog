import type { ReactNode } from 'react';

type ProseProps = {
  children: ReactNode;
  className?: string;
};

/**
 * Readable long-form prose container (D-04 "ma" whitespace philosophy).
 * Constrains content to `max-w-2xl` (672px) per UI-SPEC's Prose container
 * value — keeps line length readable for About-page-style copy. Body
 * typography (16/400/1.6) plus generous vertical rhythm between headings
 * and paragraphs. Server Component — no interactivity, no client JS.
 */
export function Prose({ children, className = '' }: ProseProps) {
  return (
    <div
      className={`mx-auto w-full max-w-2xl text-body [&>*+*]:mt-4 [&>h2+*]:mt-3 [&>h2]:mt-8 [&>h2]:text-heading [&>h2]:font-semibold [&>p]:text-body ${className}`.trim()}
    >
      {children}
    </div>
  );
}
