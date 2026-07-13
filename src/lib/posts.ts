/**
 * Published-post query layer (BLOG-01/BLOG-02/BLOG-04). Server-only:
 * pure in-memory reads over Velite's build-validated `posts` array.
 * D-11: draft posts are excluded in ONE place — getPublishedPosts() —
 * that every exported function builds on. Never filter drafts elsewhere.
 */
import { posts as allPosts } from '#site/content';
import type { Post } from '#site/content';

function getPublishedPosts(): Post[] {
  return allPosts.filter((p) => !p.draft);
}

export function getAllPosts(): Post[] {
  return getPublishedPosts().sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getPostBySlug(slug: string): Post | undefined {
  return getPublishedPosts().find((p) => p.slug === slug);
}

export function getPostsByTag(tag: string): Post[] {
  return getAllPosts().filter((p) => p.tags.includes(tag));
}

export function getAllTags(): string[] {
  return Array.from(new Set(getPublishedPosts().flatMap((p) => p.tags))).sort();
}
