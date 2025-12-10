// app/sitemap.ts
import { MetadataRoute } from 'next';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://geekcreations.com';

  // Static pages
  const staticPages = [
    '',
    '/collections/all',
    '/collections/anime-gods',
    '/collections/code-and-chaos',
    '/collections/afro-geek-future',
    '/customize',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
    '/shipping',
    '/refunds',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  // TODO: Fetch product pages from Shopify
  // For now, we'll add a placeholder for dynamic product pages
  const productPages = [
    // These will be populated after Shopify integration
    // Example: '/products/anime-ninja-tee',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'weekly' as const,
    priority: 0.6,
  }));

  return [...staticPages, ...productPages];
}