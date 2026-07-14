import type { MetadataRoute } from 'next';
import { getAllPosts, getAllTags } from '@/lib/posts';
import { siteConfig } from '@/lib/site-config';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['', '/about', '/projects', '/contact', '/blog'].map((path) => ({
    url: `${siteConfig.siteUrl}${path}`,
  }));

  const postRoutes = getAllPosts().map((post) => ({
    url: `${siteConfig.siteUrl}/blog/${post.slug}`,
    lastModified: post.date,
  }));

  const tagRoutes = getAllTags().map((tag) => ({
    url: `${siteConfig.siteUrl}/blog/tags/${tag}`,
  }));

  return [...staticRoutes, ...postRoutes, ...tagRoutes];
}
