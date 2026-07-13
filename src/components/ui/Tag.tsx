type TagProps = {
  children: string;
  className?: string;
};

/**
 * Tech-stack tag/badge primitive.
 *
 * Renders on the neutral secondary surface (never the vermillion accent —
 * accent stays reserved for interaction/emphasis per UI-SPEC Color section).
 */
export function Tag({ children, className = '' }: TagProps) {
  return (
    <span
      className={`inline-flex items-center rounded-md bg-secondary px-2.5 py-1 text-label text-ink dark:bg-secondary-dark dark:text-ink-dark ${className}`.trim()}
    >
      {children}
    </span>
  );
}
