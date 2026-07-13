/**
 * Renders Velite's compiled MDX (a function-body code string) to JSX
 * (BLOG-02). Server Component. The MDX is first-party git-committed
 * content (no CMS), so new Function() here is not an untrusted-input
 * vector (RESEARCH.md Security Domain).
 */
import * as runtime from 'react/jsx-runtime';

const sharedComponents = {};

function useMDXComponent(code: string) {
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
  const Component = useMDXComponent(code);
  return <Component components={{ ...sharedComponents, ...components }} />;
}
