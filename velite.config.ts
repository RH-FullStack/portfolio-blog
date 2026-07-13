// velite.config.ts — git-based MDX content layer for the blog (BLOG-01..06).
// Velite is the ONLY content pipeline (CLAUDE.md): no gray-matter, no @next/mdx.
// Schema mirrors CONTEXT.md D-09; excerpt is a MANUAL field (D-10), slug is
// filename-derived so authors write zero boilerplate per post (BLOG-06).
import { defineConfig, s, context } from 'velite'
import remarkGfm from 'remark-gfm'
import rehypeSlug from 'rehype-slug'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypePrettyCode from 'rehype-pretty-code'

export default defineConfig({
  collections: {
    posts: {
      name: 'Post',
      pattern: 'posts/*.mdx',
      schema: s
        .object({
          title: s.string().max(99),
          date: s.isodate(),
          tags: s.array(s.string()),
          excerpt: s.string(),
          draft: s.boolean().default(false),
          metadata: s.metadata(),
          code: s.mdx(),
        })
        .transform((data) => ({
          ...data,
          // `context().file.path` returns an ABSOLUTE path in this Velite version
          // (verified via slug spike, closes RESEARCH.md Assumption A1) — extract
          // the bare filename regardless of path separator/prefix format.
          slug: context().file.path.split('/').pop()!.replace(/\.mdx$/, ''),
        })),
    },
  },
  mdx: {
    remarkPlugins: [remarkGfm],
    rehypePlugins: [
      rehypeSlug,
      // D-13: default behavior renders an aria-hidden, tabIndex=-1, CSS-only
      // "icon" span — invisible and keyboard-unreachable (WR-03). Append a
      // visible "#" glyph after the heading text instead, reachable via
      // keyboard and with an explicit accessible name; styled in globals.css
      // (`.heading-anchor`).
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'append',
          properties: {
            className: ['heading-anchor'],
            ariaLabel: 'Link to this heading',
          },
          content: { type: 'text', value: '#' },
        },
      ],
      [rehypePrettyCode, { theme: { light: 'github-light', dark: 'github-dark' } }],
    ],
  },
})
