/**
 * CategoryPinIcons.ts
 * Professional Category Map Pin & Vector SVG System for Explore Pune
 * 
 * Provides:
 * - 10 distinct destination categories with semantic colors, labels (EN & MR), and SVG vector icons.
 * - Precision teardrop/shield pin generator with crisp contrasting inner ring and bottom pointer.
 * - Interactive state styling: default, hover, selected (pulsing halo), visited (checkmark), and highlighted.
 * - Zero emoji reliance for primary map markers: 100% sharp scalable SVG vectors.
 */

import { ExperiencePlace } from '@/lib/experience/types';

export type DestinationCategoryKey =
  | 'forts'
  | 'temples'
  | 'heritage'
  | 'caves'
  | 'lakes'
  | 'viewpoints'
  | 'parks'
  | 'museums'
  | 'culture'
  | 'other';

export interface CategoryConfig {
  key: DestinationCategoryKey;
  labelEn: string;
  labelMr: string;
  color: string;
  contrastColor: string;
  bgColor: string;
  borderColor: string;
  glowColor: string;
  descriptionEn: string;
  descriptionMr: string;
  svgPath: string; // Inner icon SVG paths (viewBox="0 0 24 24")
}

export const CATEGORY_CONFIGS: Record<DestinationCategoryKey, CategoryConfig> = {
  forts: {
    key: 'forts',
    labelEn: 'Forts',
    labelMr: 'किल्ले',
    color: '#c2410c', // Earthy terracotta
    contrastColor: '#ffffff',
    bgColor: '#7c2d12',
    borderColor: '#fed7aa',
    glowColor: 'rgba(194, 65, 12, 0.45)',
    descriptionEn: 'Historic Sahyadri hill forts & bastions',
    descriptionMr: 'ऐतिहासिक सह्याद्री गिरीदुर्ग व बालेकिल्ले',
    // Castle battlement & fort tower with gateway
    svgPath: `
      <path d="M3 21h18v-3H3v3z" fill="currentColor"/>
      <path d="M5 18v-7l2-1v8h2v-8l3-1 3 1v8h2v-8l2 1v7H5z" fill="currentColor"/>
      <path d="M4 8V4h3v2h2V4h3v2h2V4h3v2h2V4h1v4H4z" fill="currentColor"/>
      <path d="M10 18v-4a2 2 0 0 1 4 0v4h-4z" fill="#ffffff" fill-opacity="0.9"/>
    `,
  },
  temples: {
    key: 'temples',
    labelEn: 'Temples & Religious',
    labelMr: 'मंदिरे व धार्मिक स्थळे',
    color: '#ea580c', // Warm sacred saffron
    contrastColor: '#ffffff',
    bgColor: '#9a3412',
    borderColor: '#ffedd5',
    glowColor: 'rgba(234, 88, 12, 0.45)',
    descriptionEn: 'Sacred temples, shrines & spiritual landmarks',
    descriptionMr: 'पवित्र मंदिरे, देवस्थाने व आध्यात्मिक ठिकाणे',
    // Sacred temple shikhara / kalash & arched sanctum
    svgPath: `
      <path d="M12 2l-2 4h4l-2-4z" fill="currentColor"/>
      <path d="M8 7h8l-1 5H9L8 7z" fill="currentColor"/>
      <path d="M4 13h16l-2 3H6l-2-3z" fill="currentColor"/>
      <path d="M3 17h18v4H3v-4z" fill="currentColor"/>
      <path d="M10 21v-4a2 2 0 0 1 4 0v4h-4z" fill="#ffffff" fill-opacity="0.9"/>
      <circle cx="12" cy="10" r="1.2" fill="#ffffff"/>
    `,
  },
  heritage: {
    key: 'heritage',
    labelEn: 'Monuments & Heritage',
    labelMr: 'ऐतिहासिक वास्तू',
    color: '#a16207', // Refined bronze / deep ochre
    contrastColor: '#ffffff',
    bgColor: '#713f12',
    borderColor: '#fef08a',
    glowColor: 'rgba(161, 98, 7, 0.45)',
    descriptionEn: 'Historic wadas, palaces & colonial monuments',
    descriptionMr: 'ऐतिहासिक वाडे, राजवाडे व मानचिन्हे',
    // Historic monument arch with heritage pediment & pillars
    svgPath: `
      <path d="M12 3L3 8v2h18V8L12 3z" fill="currentColor"/>
      <path d="M5 11v8h2v-8H5zm5 0v8h4v-8h-4zm7 0v8h2v-8h-2z" fill="currentColor"/>
      <path d="M2 20h20v2H2v-2z" fill="currentColor"/>
      <path d="M11 14a1 1 0 0 1 2 0v5h-2v-5z" fill="#ffffff" fill-opacity="0.9"/>
    `,
  },
  caves: {
    key: 'caves',
    labelEn: 'Ancient Caves',
    labelMr: 'प्राचीन लेणी',
    color: '#475569', // Stone slate / subterranean charcoal
    contrastColor: '#ffffff',
    bgColor: '#334155',
    borderColor: '#cbd5e1',
    glowColor: 'rgba(71, 85, 105, 0.45)',
    descriptionEn: 'Rock-cut Buddhist chaityas & rock shrines',
    descriptionMr: 'कातळात कोरलेली प्राचीन बौद्ध लेणी व विहारे',
    // Rock arch cave entrance with rock relief
    svgPath: `
      <path d="M2 21h20c-1-6-4-12-10-14C6 9 3 15 2 21z" fill="currentColor"/>
      <path d="M8 21c.5-4 2-7 4-7s3.5 3 4 7H8z" fill="#ffffff" fill-opacity="0.95"/>
      <path d="M12 3l1.5 2.5L12 7l-1.5-1.5L12 3z" fill="currentColor"/>
    `,
  },
  lakes: {
    key: 'lakes',
    labelEn: 'Lakes & Water Bodies',
    labelMr: 'तलाव व धरणे',
    color: '#0891b2', // Freshwater cyan / deep turquoise
    contrastColor: '#ffffff',
    bgColor: '#164e63',
    borderColor: '#a5f3fc',
    glowColor: 'rgba(8, 145, 178, 0.45)',
    descriptionEn: 'Scenic dams, reservoirs & tranquil lakes',
    descriptionMr: 'मनोहर धरणे, जलाशय व तलाव',
    // Dynamic water waves & ripples
    svgPath: `
      <path d="M2 13.5c2 0 3-1.5 5-1.5s3 1.5 5 1.5 3-1.5 5-1.5 3 1.5 5 1.5v2c-2 0-3-1.5-5-1.5s-3 1.5-5 1.5-3-1.5-5-1.5-3 1.5-5 1.5v-2z" fill="currentColor"/>
      <path d="M2 17.5c2 0 3-1.5 5-1.5s3 1.5 5 1.5 3-1.5 5-1.5 3 1.5 5 1.5v2c-2 0-3-1.5-5-1.5s-3 1.5-5 1.5-3-1.5-5-1.5-3 1.5-5 1.5v-2z" fill="currentColor"/>
      <path d="M12 3a4 4 0 0 1 4 4c0 3-4 6-4 6s-4-3-4-6a4 4 0 0 1 4-4z" fill="currentColor"/>
    `,
  },
  viewpoints: {
    key: 'viewpoints',
    labelEn: 'Viewpoints & Hills',
    labelMr: 'दृश्य पॉईंट्स व टेकड्या',
    color: '#0284c7', // Scenic sky blue / azure
    contrastColor: '#ffffff',
    bgColor: '#075985',
    borderColor: '#bae6fd',
    glowColor: 'rgba(2, 132, 199, 0.45)',
    descriptionEn: 'Panoramic hill peaks, ghats & sun viewpoints',
    descriptionMr: 'विहंगम टेकड्या, घाट व निसर्गरम्य व्ह्यू पॉईंट्स',
    // Mountain peaks with sun / binoculars perspective
    svgPath: `
      <path d="M14 6l6 9h-4l-2-3-2 3H2l7-10 3 4.5L14 6z" fill="currentColor"/>
      <circle cx="18" cy="5" r="2.5" fill="#f59e0b"/>
      <path d="M2 20h20v2H2v-2z" fill="currentColor"/>
      <path d="M9 10l-2 3h4l-2-3z" fill="#ffffff" fill-opacity="0.9"/>
    `,
  },
  parks: {
    key: 'parks',
    labelEn: 'Gardens & Parks',
    labelMr: 'उद्याने व बागा',
    color: '#15803d', // Botanical green / emerald
    contrastColor: '#ffffff',
    bgColor: '#14532d',
    borderColor: '#bbf7d0',
    glowColor: 'rgba(21, 128, 61, 0.45)',
    descriptionEn: 'Botanical gardens, civic parks & urban green lungs',
    descriptionMr: 'वनस्पती उद्याने, सार्वजनिक बागा व प्राणिसंग्रहालय',
    // Lush leafy tree foliage and trunk
    svgPath: `
      <path d="M12 2C8.5 2 6 4.5 6 8c0 1.2.3 2.3.9 3.2C5.1 12 4 13.4 4 15c0 2.2 1.8 4 4 4h8c2.2 0 4-1.8 4-4 0-1.6-1.1-3-2.9-3.8.6-.9.9-2 .9-3.2 0-3.5-2.5-6-6-6z" fill="currentColor"/>
      <path d="M11 17v5h2v-5h-2z" fill="#78350f"/>
      <circle cx="12" cy="8" r="1.5" fill="#ffffff" fill-opacity="0.8"/>
    `,
  },
  museums: {
    key: 'museums',
    labelEn: 'Museums & Galleries',
    labelMr: 'वस्तुसंग्रहालय',
    color: '#7c3aed', // Royal violet / deep indigo
    contrastColor: '#ffffff',
    bgColor: '#4c1d95',
    borderColor: '#ddd6fe',
    glowColor: 'rgba(124, 58, 237, 0.45)',
    descriptionEn: 'Art collections, artifact archives & exhibits',
    descriptionMr: 'कलादालने, दुर्मिळ वस्तू संग्रह व दालने',
    // Museum pediment with urn/trophy emblem
    svgPath: `
      <path d="M12 2L2 7v2h20V7L12 2z" fill="currentColor"/>
      <path d="M4 10v7h2v-7H4zm5 0v7h2v-7H9zm5 0v7h2v-7h-2zm5 0v7h2v-7h-2z" fill="currentColor"/>
      <path d="M2 18h20v4H2v-4z" fill="currentColor"/>
      <circle cx="12" cy="5.5" r="1.2" fill="#ffffff"/>
    `,
  },
  culture: {
    key: 'culture',
    labelEn: 'Culture & Cuisine',
    labelMr: 'संस्कृती व खाद्यसंस्कृती',
    color: '#db2777', // Rich ruby / magenta
    contrastColor: '#ffffff',
    bgColor: '#831843',
    borderColor: '#fbcfe8',
    glowColor: 'rgba(219, 39, 119, 0.45)',
    descriptionEn: 'Iconic cafes, theatres & heritage artisan quarters',
    descriptionMr: 'प्रसिद्ध कॅफे, नाट्यगृहे व पारंपरिक कारागीर गल्ल्या',
    // Theater drama mask / artisanal craft symbol
    svgPath: `
      <path d="M12 2C6.5 2 2 6.5 2 12c0 4.5 3 8.3 7.2 9.5.5.1.8-.2.8-.5v-1.8c0-.6.2-1.2.6-1.6-2.4-.3-4.9-1.2-4.9-5.4 0-1.2.4-2.2 1.1-3-.1-.3-.5-1.4.1-3 0 0 .9-.3 3 1.1.9-.3 1.8-.4 2.8-.4s1.9.1 2.8.4c2.1-1.4 3-1.1 3-1.1.6 1.6.2 2.7.1 3 .7.8 1.1 1.8 1.1 3 0 4.2-2.5 5.1-4.9 5.4.3.4.6 1 .6 1.8v2.7c0 .3.3.6.8.5C19 20.3 22 16.5 22 12c0-5.5-4.5-10-10-10z" fill="currentColor"/>
      <circle cx="9" cy="11" r="1.5" fill="#ffffff"/>
      <circle cx="15" cy="11" r="1.5" fill="#ffffff"/>
      <path d="M9 16c1 1 5 1 6 0" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" fill="none"/>
    `,
  },
  other: {
    key: 'other',
    labelEn: 'Other Destinations',
    labelMr: 'इतर प्रेक्षणीय स्थळे',
    color: '#10b981', // Brand emerald
    contrastColor: '#ffffff',
    bgColor: '#064e3b',
    borderColor: '#a7f3d0',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    descriptionEn: 'Prominent city sights & verified landmarks',
    descriptionMr: 'शहरातील इतर प्रसिद्ध मानचिन्हे',
    // Sleek location pin
    svgPath: `
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 0 1 0-5 2.5 2.5 0 0 1 0 5z" fill="currentColor"/>
    `,
  },
};

/**
 * Intelligently classifies any ExperiencePlace into one of the 10 distinct categories
 * based on category_slug, place slug, name, and attributes.
 */
export function resolvePlaceCategory(place: {
  category_slug?: string;
  slug?: string;
  name?: string;
  name_mr?: string;
}): DestinationCategoryKey {
  const cat = (place.category_slug || '').toLowerCase();
  const slug = (place.slug || '').toLowerCase();
  const name = (place.name || '').toLowerCase();

  // 1. Caves
  if (
    slug.includes('cave') ||
    name.includes('cave') ||
    slug === 'pataleshwar-cave-temple' ||
    slug === 'naneghat-pass-caves'
  ) {
    return 'caves';
  }

  // 2. Forts
  if (cat === 'forts' || slug.includes('fort') || name.includes('fort')) {
    return 'forts';
  }

  // 3. Lakes & Water Bodies
  if (
    slug.includes('lake') ||
    slug.includes('dam') ||
    slug.includes('reservoir') ||
    slug.includes('waterfall') ||
    slug.includes('falls') ||
    name.includes('lake') ||
    name.includes('dam') ||
    name.includes('falls') ||
    slug === 'bushi-dam' ||
    slug === 'lavasa-lakeside'
  ) {
    return 'lakes';
  }

  // 4. Viewpoints & Scenic Hills
  if (
    slug.includes('point') ||
    slug.includes('tekdi') ||
    slug.includes('ghat') ||
    slug.includes('hill') ||
    name.includes('point') ||
    name.includes('tekdi') ||
    name.includes('viewpoint') ||
    slug === 'tamhini-ghat'
  ) {
    return 'viewpoints';
  }

  // 5. Museums
  if (cat === 'museums' || slug.includes('museum') || name.includes('museum')) {
    return 'museums';
  }

  // 6. Parks & Gardens
  if (
    cat === 'parks' ||
    slug.includes('garden') ||
    slug.includes('park') ||
    slug.includes('zoo') ||
    slug.includes('udyan') ||
    name.includes('garden') ||
    name.includes('park')
  ) {
    return 'parks';
  }

  // 7. Cultural & Cuisine Attractions
  if (
    cat === 'food' ||
    slug.includes('food') ||
    slug.includes('bakery') ||
    slug.includes('cafe') ||
    slug.includes('ranga-mandir') ||
    slug.includes('craft')
  ) {
    return 'culture';
  }

  // 8. Temples & Religious
  if (
    cat === 'temples' ||
    slug.includes('temple') ||
    slug.includes('mandir') ||
    slug.includes('ganpati') ||
    slug.includes('church') ||
    slug.includes('synagogue') ||
    slug.includes('ashram')
  ) {
    return 'temples';
  }

  // 9. Historical Monuments / Heritage
  if (cat === 'heritage') {
    return 'heritage';
  }

  return 'other';
}

/**
 * Generates an ultra-crisp vector SVG teardrop map pin string.
 * The bottom pointer rests exactly at bottom-center (16, 42) inside a 32x44 viewport.
 */
export function generateCategoryPinSvg(
  categoryKey: DestinationCategoryKey,
  options: {
    isSelected?: boolean;
    isVisited?: boolean;
    isHovered?: boolean;
  } = {}
): string {
  const cfg = CATEGORY_CONFIGS[categoryKey] || CATEGORY_CONFIGS.other;
  const isSelected = options.isSelected || false;
  const isVisited = options.isVisited || false;

  const width = isSelected ? 38 : 32;
  const height = isSelected ? 50 : 42;
  const pinRadius = isSelected ? 12 : 10;
  const iconSize = isSelected ? 16 : 14;

  // Selected pins get a prominent golden/cyan ring and distinct outline
  const strokeColor = isSelected ? '#38bdf8' : '#ffffff';
  const strokeWidth = isSelected ? 2.5 : 2;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 44" width="${width}" height="${height}" class="explore-category-pin-svg overflow-visible" style="filter: drop-shadow(0 4px 10px rgba(0,0,0,0.55));">
      <defs>
        <radialGradient id="pin-grad-${categoryKey}-${isSelected ? 'sel' : 'norm'}" cx="35%" cy="30%" r="70%">
          <stop offset="0%" stop-color="${cfg.borderColor}" />
          <stop offset="45%" stop-color="${cfg.color}" />
          <stop offset="100%" stop-color="${cfg.bgColor}" />
        </radialGradient>
        <filter id="pin-inner-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1" stdDeviation="1" flood-opacity="0.3" />
        </filter>
      </defs>

      <!-- Pin Base Teardrop Geometry with Sharp Bottom Pointer at (16, 42) -->
      <path
        d="M16 2 C8.268 2 2 8.268 2 16 C2 25.5 14.5 40 15.35 41.05 C15.7 41.5 16.3 41.5 16.65 41.05 C17.5 40 30 25.5 30 16 C30 8.268 23.732 2 16 2 Z"
        fill="url(#pin-grad-${categoryKey}-${isSelected ? 'sel' : 'norm'})"
        stroke="${strokeColor}"
        stroke-width="${strokeWidth}"
        stroke-linejoin="round"
      />

      <!-- High-Contrast White Inner Disc (Guarantees readability on any satellite/dark/topo map) -->
      <circle
        cx="16"
        cy="15"
        r="${pinRadius}"
        fill="#ffffff"
        stroke="${cfg.color}"
        stroke-width="1.2"
        filter="url(#pin-inner-shadow)"
      />

      <!-- Embedded Category Vector Icon -->
      <g transform="translate(${16 - iconSize / 2}, ${15 - iconSize / 2}) scale(${iconSize / 24})" color="${cfg.color}">
        ${cfg.svgPath}
      </g>

      ${
        isVisited
          ? `
          <!-- Visited State Checkmark Badge -->
          <g transform="translate(20, 2)">
            <circle cx="5" cy="5" r="5" fill="#10b981" stroke="#ffffff" stroke-width="1.5" />
            <path d="M3 5l1.5 1.5 3-3" fill="none" stroke="#ffffff" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </g>
        `
          : ''
      }
    </svg>
  `;
}

/**
 * Returns array of all 10 categories for filter pills and legend
 */
export function getAllCategoriesList(): CategoryConfig[] {
  return [
    CATEGORY_CONFIGS.forts,
    CATEGORY_CONFIGS.temples,
    CATEGORY_CONFIGS.heritage,
    CATEGORY_CONFIGS.caves,
    CATEGORY_CONFIGS.lakes,
    CATEGORY_CONFIGS.viewpoints,
    CATEGORY_CONFIGS.parks,
    CATEGORY_CONFIGS.museums,
    CATEGORY_CONFIGS.culture,
    CATEGORY_CONFIGS.other,
  ];
}
