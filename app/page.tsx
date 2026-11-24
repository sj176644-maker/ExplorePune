import type { Metadata } from 'next';
import { permanentRedirect } from 'next/navigation';
import { getCachedPlacesData, projectPlaceCardSummary } from '@/lib/serverPlaces';
import HomeExplorer from '@/components/HomeExplorer';

export const revalidate = 1800; // 30-minute ISR for fast response times
const PAGE = 16;

export const metadata: Metadata = {
  title: 'Explore Pune — Top Places to Visit, Tourist Attractions, Forts & Trip Planner',
  description:
    'The complete Pune tourism field guide to 106+ destinations: Sinhagad Fort, Shaniwar Wada, Aga Khan Palace, Dagdusheth Ganpati, with verified timings, entry fees, metro/bus transit, and AI trip planning.',
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Explore Pune — Top Places to Visit, Tourist Attractions & Heritage Guide',
    description:
      'The complete Pune tourism field guide to 106+ destinations: Sinhagad Fort, Shaniwar Wada, Aga Khan Palace, Dagdusheth Ganpati, with verified timings, entry fees, metro/bus transit, and AI trip planning.',
    url: '/',
    siteName: 'Explore Pune',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: '/images/pune-map-hero.jpg',
        width: 1200,
        height: 630,
        alt: 'Explore Pune - Top Places to Visit, Historic Forts & Peshwa Heritage',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Explore Pune — Top Places to Visit, Tourist Attractions & Heritage Guide',
    description:
      'The complete Pune tourism field guide to 106+ destinations: Sinhagad Fort, Shaniwar Wada, Aga Khan Palace, Dagdusheth Ganpati, with verified timings, entry fees, metro/bus transit, and AI trip planning.',
    images: ['/images/pune-map-hero.jpg'],
  },
};

export default async function HomePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; cat?: string; page?: string }>;
}) {
  const sp = await searchParams;
  const cat = (sp.cat ?? '').replace(/[^a-z0-9-]/gi, '');
  const term = (sp.q ?? '').replace(/[^\p{L}\p{N}\s]/gu, '').trim().slice(0, 60);
  const pg = Math.max(1, parseInt(sp.page ?? '1') || 1);

  // Clean permanent redirect from legacy query parameter /?cat=... to /destinations/...
  if (cat && !term) {
    permanentRedirect(`/destinations/${cat}`);
  }

  // Fetch cached categories & published places (instant in-memory resolution)
  const { places: rawPlaces, categories: cats } = await getCachedPlacesData();

  let allPlaces = [...rawPlaces];

  if (cat) {
    if (cat === 'free') {
      allPlaces = allPlaces.filter(
        (p) => p.fee_status === 'free' && (p.entry_fee === 0 || p.place_prices?.[0]?.amount === 0)
      );
    } else {
      allPlaces = allPlaces.filter(
        (p) =>
          p.place_categories?.some((c: any) => c.slug === cat) ||
          p.category_slug === cat ||
          p.category === cat
      );
    }
  }

  if (term) {
    const lowerTerm = term.toLowerCase();
    allPlaces = allPlaces.filter(
      (p) =>
        (p.name && p.name.toLowerCase().includes(lowerTerm)) ||
        (p.name_mr && p.name_mr.toLowerCase().includes(lowerTerm)) ||
        (p.description && p.description.toLowerCase().includes(lowerTerm)) ||
        (p.description_mr && p.description_mr.toLowerCase().includes(lowerTerm)) ||
        (p.category && p.category.toLowerCase().includes(lowerTerm)) ||
        (p.category_slug && p.category_slug.toLowerCase().includes(lowerTerm)) ||
        (typeof p.nearby_food === 'string' && p.nearby_food.toLowerCase().includes(lowerTerm)) ||
        (typeof p.nearby_food_mr === 'string' && p.nearby_food_mr.toLowerCase().includes(lowerTerm))
    );
  }

  // Sort by popularity_score desc then name asc
  allPlaces.sort((a, b) => {
    if ((b.popularity_score || 0) !== (a.popularity_score || 0)) {
      return (b.popularity_score || 0) - (a.popularity_score || 0);
    }
    return (a.name || '').localeCompare(b.name || '');
  });

  const count = allPlaces.length;
  const pages = Math.max(1, Math.ceil(count / PAGE));
  const places = allPlaces.slice((pg - 1) * PAGE, pg * PAGE).map(projectPlaceCardSummary);

  const topPlacesSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Places to Visit in Pune | Explore Pune',
    description: 'Featured historic forts, Peshwa wadas, and heritage landmarks across Pune.',
    itemListElement: places.slice(0, 12).map((p: any, idx: number) => ({
      '@type': 'ListItem',
      position: idx + 1,
      name: p.name,
      url: `https://explorepune-guide.vercel.app/places/${encodeURIComponent(p.slug || p.id)}`,
    })),
  };

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(topPlacesSchema) }}
      />
      <HomeExplorer
        places={places}
        categories={cats}
        currentCat={cat}
        searchTerm={term}
        page={pg}
        totalPages={pages}
        totalCount={count}
        masterCount={rawPlaces.length}
      />
    </main>
  );
}
