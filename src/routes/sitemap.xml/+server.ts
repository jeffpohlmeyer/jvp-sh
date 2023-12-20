import { website } from '$lib/info';

export const GET = async () => {
  const pages = ['privacy', 'auth', 'account'];

  return new Response(`<?xml version="1.0" encoding="UTF-8" ?>
<urlset
  xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
  xmlns:xhtml="https://www.w3.org/1999/xhtml"
  xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
  xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
  xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
<url>
  <loc>${website}</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
${pages
  .map(
    (page) => `
  <url>
  <loc>${website}/${page}</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
  </url>
`
  )
  .join('')}
</urlset>`);
};
