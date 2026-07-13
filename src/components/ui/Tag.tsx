import Link from 'next/link';

type TagProps = {
  children: string;
  href?: string; // D-02: clickable variant for /blog/tags/[tag] navigation
  className?: string;
};

const baseClasses =
  'inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-label text-ink dark:bg-secondary-dark dark:text-ink-dark';

/**
 * Tech-stack tag/badge primitive.
 *
 * Renders on the neutral secondary surface (never the vermillion accent —
 * accent stays reserved for interaction/emphasis per UI-SPEC Color section).
 *
 * When `href` is present, renders as an internal `next/link` (D-02, blog
 * tag-archive navigation) — resting state stays neutral, vermillion appears
 * only on hover/focus-visible. Blog tags only ever link internally, so no
 * external-link/`rel` handling is needed here (see Button.tsx for that case).
 */
export function Tag({ children, href, className = '' }: TagProps) {
  const classes = `${baseClasses} ${className}`.trim();
  if (href) {
    return (
      <Link
        href={href}
        className={`${classes} hover:text-vermillion focus-visible:text-vermillion focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vermillion dark:hover:text-vermillion-dark dark:focus-visible:text-vermillion-dark dark:focus-visible:outline-vermillion-dark`}
      >
        {children}
      </Link>
    );
  }
  return <span className={classes}>{children}</span>;
}
