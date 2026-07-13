/**
 * Renders Velite's compiled MDX (a function-body code string) to JSX
 * (BLOG-02). Server Component. The MDX is first-party git-committed
 * content (no CMS), so new Function() here is not an untrusted-input
 * vector (RESEARCH.md Security Domain).
 */
import * as runtime from 'react/jsx-runtime';

const sharedComponents = {};

function compileMdxComponent(code: string) {
  const fn = new Function(code);
  return fn({ ...runtime }).default;
}

export function MDXContent({
  code,
  components,
}: {
  code: string;
  components?: Record<string, React.ComponentType>;
}) {
  const Component = compileMdxComponent(code);
  // MDXContent is a Server Component rendered once per request (never
  // re-rendered client-side), so the "component identity resets across
  // renders" hazard this rule guards against does not apply here (see
  // 02-REVIEW.md WR-01).
  // eslint-disable-next-line react-hooks/static-components
  return <Component components={{ ...sharedComponents, ...components }} />;
}
