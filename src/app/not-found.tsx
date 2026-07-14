import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Page Not Found',
  description: "The page you're looking for doesn't exist or has moved.",
};

/**
 * Custom 404 (root-level Server Component) — lives at `src/app/not-found.tsx`
 * (project root, outside the `(site)` route group) so it auto-handles all
 * unmatched routes app-wide (Next.js 13.3+). Not the experimental
 * `global-not-found.js` convention (CORE-04).
 */
export default function NotFound() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center">
      <h1 className="text-heading font-semibold">Page Not Found</h1>
      <p className="mt-4 text-body">
        The page you&apos;re looking for doesn&apos;t exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-8 inline-block text-vermillion hover:underline dark:text-vermillion-dark"
      >
        Back to Home
      </Link>
    </div>
  );
}
