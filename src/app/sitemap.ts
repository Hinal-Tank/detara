import { MetadataRoute } from 'next';

async function getProducts() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (!supabaseUrl || !supabaseKey) return [];
    const res = await fetch(
      `${supabaseUrl}/rest/v1/products?select=slug,created_at,category&is_active=eq.true&order=created_at.asc`,
      {
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          'Content-Type': 'application/json',
        },
        next: { revalidate: 3600 },
      }
    );
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.detara.store';
  const lastModified = new Date();

  const staticRoutes: MetadataRoute.Sitemap = [
    // Core pages — highest priority
    { url: `${baseUrl}/`, lastModified, changeFrequency: 'weekly', priority: 1.0 },
    { url: `${baseUrl}/homepage`, lastModified, changeFrequency: 'weekly', priority: 1.0 },

    // Commercial collection pages
    { url: `${baseUrl}/products`, lastModified, changeFrequency: 'weekly', priority: 0.95 },
    { url: `${baseUrl}/kiss`, lastModified, changeFrequency: 'weekly', priority: 0.9 },

    // Category-filtered collection pages (commercial intent)
    { url: `${baseUrl}/products?category=engagement-rings`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/products?category=diamond-studs`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/products?category=tennis-bracelets`, lastModified, changeFrequency: 'weekly', priority: 0.9 },
    { url: `${baseUrl}/products?category=diamond-bands`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/products?category=diamond-pendants`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/products?category=rings`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/products?category=earrings`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/products?category=necklaces`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/products?category=bracelets`, lastModified, changeFrequency: 'weekly', priority: 0.85 },
    { url: `${baseUrl}/products?category=mens-jewellery`, lastModified, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${baseUrl}/products?category=gemstone-jewellery`, lastModified, changeFrequency: 'weekly', priority: 0.8 },

    // Service pages
    { url: `${baseUrl}/custom-jewelry`, lastModified, changeFrequency: 'monthly', priority: 0.9 },

    // Brand / trust pages
    { url: `${baseUrl}/about`, lastModified, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${baseUrl}/contact`, lastModified, changeFrequency: 'monthly', priority: 0.75 },

    // Education / guides (informational + AEO)
    { url: `${baseUrl}/diamond-guide`, lastModified, changeFrequency: 'monthly', priority: 0.75 },
    { url: `${baseUrl}/care-guide`, lastModified, changeFrequency: 'monthly', priority: 0.65 },
    { url: `${baseUrl}/ring-size-guide`, lastModified, changeFrequency: 'monthly', priority: 0.65 },

    // Journal / content
    { url: `${baseUrl}/journal`, lastModified, changeFrequency: 'weekly', priority: 0.75 },
    { url: `${baseUrl}/journal/how-to-choose-a-diamond-engagement-ring`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/journal/understanding-diamond-quality`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/journal/lab-vs-natural-diamonds`, lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${baseUrl}/journal/scandinavian-jewelry-design-principles`, lastModified, changeFrequency: 'monthly', priority: 0.65 },

    // Policy pages
    { url: `${baseUrl}/shipping`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/refund`, lastModified, changeFrequency: 'monthly', priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${baseUrl}/terms`, lastModified, changeFrequency: 'monthly', priority: 0.5 },
  ];

  // Dynamic product routes
  const products = await getProducts();
  const productRoutes: MetadataRoute.Sitemap = products
    .filter((p: { slug?: string }) => p.slug)
    .map((p: { slug: string; created_at?: string }) => ({
      url: `${baseUrl}/product/${p.slug}`,
      lastModified: p.created_at ? new Date(p.created_at) : lastModified,
      changeFrequency: 'weekly' as const,
      priority: 0.85,
    }));

  return [...staticRoutes, ...productRoutes];
}