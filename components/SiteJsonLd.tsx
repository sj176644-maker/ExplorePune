import React from 'react';

/**
 * SiteJsonLd: Global Entity & Local SEO Structured Data for Explore Pune
 * Injects:
 * 1. Organization & TouristInformationCenter (Local authority & branding)
 * 2. WebSite with SearchAction (Sitelinks Search Box)
 * 3. TouristDestination (Geospatial entity grounding for Pune, Maharashtra)
 * 4. ItemList (Top 16 must-visit attractions for Google carousel rich results)
 * 5. FAQPage (High-intent traveler queries for rich search snippets)
 */
export default function SiteJsonLd() {
  const siteUrl = 'https://explorepune-guide.vercel.app';

  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'TouristInformationCenter'],
    '@id': `${siteUrl}/#organization`,
    name: 'Explore Pune',
    alternateName: ['एक्सप्लोर पुणे', 'ExplorePune Guide', 'Explore Pune Heritage Initiative', 'ExplorePune'],
    url: siteUrl,
    logo: `${siteUrl}/assets/explore-pune-logo.png`,
    image: [
      `${siteUrl}/assets/explore-pune-logo.png`,
      `${siteUrl}/images/pune-map-hero.jpg`,
    ],
    description:
      'The authoritative, field-verified digital guide and itinerary planner for Pune, Maharashtra — covering 106+ Maratha hill forts, Peshwa-era wadas, ancient Hemadpanthi temples, and Sahyadri nature trails.',
    areaServed: [
      {
        '@type': 'City',
        name: 'Pune',
        containedInPlace: {
          '@type': 'AdministrativeArea',
          name: 'Maharashtra',
          containedInPlace: {
            '@type': 'Country',
            name: 'India',
          },
        },
      },
    ],
    knowsAbout: [
      'Pune Tourism',
      'Places to visit in Pune',
      'Things to do in Pune',
      'Maratha Empire History',
      'Peshwa Architecture',
      'Sahyadri Hill Forts',
      'Sinhagad Fort 3D Reconstruction',
      'Shaniwar Wada Palace',
      'Pune Metro Transit Routes',
      'PMPML Bus Routes',
      'Maharashtra Trekking Trails',
      'Punekar Food Heritage',
    ],
    founder: [
      {
        '@type': 'Person',
        name: 'Suraj Dhok',
      },
      {
        '@type': 'Person',
        name: 'Sahil Jadhav',
      },
      {
        '@type': 'Person',
        name: 'Ishan Kakade',
      },
    ],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial & field guide inquiries',
      email: 'surajdhok1010@gmail.com',
      availableLanguage: ['English', 'Marathi', 'Hindi'],
    },
    sameAs: [
      'https://github.com/sj176644-maker/ExplorePune',
    ],
  };

  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${siteUrl}/#website`,
    name: 'Explore Pune',
    alternateName: ['एक्सप्लोर पुणे', 'ExplorePune'],
    url: siteUrl,
    inLanguage: ['en-IN', 'mr-IN'],
    publisher: {
      '@id': `${siteUrl}/#organization`,
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${siteUrl}/destinations?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };

  const touristDestinationSchema = {
    '@context': 'https://schema.org',
    '@type': 'TouristDestination',
    '@id': `${siteUrl}/#pune-destination`,
    name: 'Pune',
    alternateName: ['Poona', 'पुणे', 'Queen of the Deccan', 'Cultural Capital of Maharashtra', 'Punekar Heritage Hub'],
    description:
      'Pune is Maharashtra’s premier cultural and historical destination, celebrated for Maratha hill forts like Sinhagad, 18th-century Peshwa palaces like Shaniwar Wada, sacred Ganpati shrines, and scenic Sahyadri trekking trails.',
    url: siteUrl,
    geo: {
      '@type': 'GeoCoordinates',
      latitude: 18.5204,
      longitude: 73.8567,
      elevation: 560,
    },
    containedInPlace: {
      '@type': 'AdministrativeArea',
      name: 'Maharashtra',
      containedInPlace: {
        '@type': 'Country',
        name: 'India',
      },
    },
    touristType: [
      'Heritage Tourism',
      'Historical Fort Treks',
      'Peshwa Architecture',
      'Spiritual & Temple Pilgrimage',
      'Cultural & Culinary Tourism',
      'Eco Tourism & Nature Trails',
    ],
    hasMap: `${siteUrl}/destinations`,
    includesAttraction: [
      {
        '@type': 'TouristAttraction',
        name: 'Sinhagad Fort (Lion’s Fort)',
        url: `${siteUrl}/places/sinhagad-fort`,
        image: `${siteUrl}/images/places/sinhagad-fort.jpg`,
        description: 'Iconic 17th-century Maratha hill fort famous for Tanaji Malusare’s 1670 battle, Pune Darwaza, and panoramic Sahyadri views.',
        geo: { '@type': 'GeoCoordinates', latitude: 18.3664, longitude: 73.7558 },
      },
      {
        '@type': 'TouristAttraction',
        name: 'Shaniwar Wada Palace',
        url: `${siteUrl}/places/shaniwar-wada`,
        image: `${siteUrl}/images/places/shaniwar-wada.jpg`,
        description: 'Seat of the Peshwa rulers built in 1732 CE, featuring the massive Dilli Darwaza fortified gateway and historical gardens.',
        geo: { '@type': 'GeoCoordinates', latitude: 18.5196, longitude: 73.8553 },
      },
      {
        '@type': 'TouristAttraction',
        name: 'Aga Khan Palace',
        url: `${siteUrl}/places/aga-khan-palace`,
        image: `${siteUrl}/images/places/aga-khan-palace.jpg`,
        description: 'National monument where Mahatma Gandhi and Kasturba Gandhi were interned during the 1942 Quit India Movement.',
        geo: { '@type': 'GeoCoordinates', latitude: 18.5524, longitude: 73.9015 },
      },
      {
        '@type': 'TouristAttraction',
        name: 'Shreemant Dagdusheth Halwai Ganpati Mandir',
        url: `${siteUrl}/places/shreemant-dagdusheth-halwai-ganpati`,
        image: `${siteUrl}/images/places/shreemant-dagdusheth-halwai-ganpati.jpg`,
        description: 'One of Maharashtra’s most revered Ganesh temples, established in 1893 and visited by millions of devotees.',
        geo: { '@type': 'GeoCoordinates', latitude: 18.5164, longitude: 73.8561 },
      },
      {
        '@type': 'TouristAttraction',
        name: 'Raja Dinkar Kelkar Museum',
        url: `${siteUrl}/places/raja-dinkar-kelkar-museum`,
        image: `${siteUrl}/images/places/raja-dinkar-kelkar-museum.jpg`,
        description: 'Eclectic collection of 20,000+ traditional Indian artifacts, musical instruments, and the Mastani Mahal recreation.',
        geo: { '@type': 'GeoCoordinates', latitude: 18.5109, longitude: 73.8542 },
      },
      {
        '@type': 'TouristAttraction',
        name: 'Pataleshwar Cave Temple',
        url: `${siteUrl}/places/pataleshwar-cave-temple`,
        image: `${siteUrl}/images/places/pataleshwar-cave-temple.jpg`,
        description: '8th-century Rashtrakuta-era monolithic rock-cut cave temple dedicated to Lord Shiva, carved from living basalt.',
        geo: { '@type': 'GeoCoordinates', latitude: 18.5286, longitude: 73.8504 },
      },
      {
        '@type': 'TouristAttraction',
        name: 'Lal Mahal',
        url: `${siteUrl}/places/lal-mahal`,
        image: `${siteUrl}/images/places/lal-mahal.jpg`,
        description: 'Reconstructed red-brick palace where Chhatrapati Shivaji Maharaj spent his formative childhood years.',
        geo: { '@type': 'GeoCoordinates', latitude: 18.5186, longitude: 73.8568 },
      },
      {
        '@type': 'TouristAttraction',
        name: 'Okayama Friendship Garden (Pu La Deshpande Garden)',
        url: `${siteUrl}/places/okayama-friendship-garden`,
        image: `${siteUrl}/images/places/okayama-friendship-garden.jpg`,
        description: 'Tranquil Japanese-style strolling garden modeled after Korakuen in Okayama, with canal waterways and bridges.',
        geo: { '@type': 'GeoCoordinates', latitude: 18.4919, longitude: 73.8344 },
      },
    ],
  };

  const topAttractionsItemListSchema = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'Top Places to Visit in Pune | Explore Pune',
    description: 'The definitive ranking of must-visit historical monuments, forts, wadas, and heritage gardens in Pune.',
    numberOfItems: 12,
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Sinhagad Fort',
        url: `${siteUrl}/places/sinhagad-fort`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Shaniwar Wada',
        url: `${siteUrl}/places/shaniwar-wada`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: 'Aga Khan Palace',
        url: `${siteUrl}/places/aga-khan-palace`,
      },
      {
        '@type': 'ListItem',
        position: 4,
        name: 'Shreemant Dagdusheth Halwai Ganpati Mandir',
        url: `${siteUrl}/places/shreemant-dagdusheth-halwai-ganpati`,
      },
      {
        '@type': 'ListItem',
        position: 5,
        name: 'Pataleshwar Cave Temple',
        url: `${siteUrl}/places/pataleshwar-cave-temple`,
      },
      {
        '@type': 'ListItem',
        position: 6,
        name: 'Raja Dinkar Kelkar Museum',
        url: `${siteUrl}/places/raja-dinkar-kelkar-museum`,
      },
      {
        '@type': 'ListItem',
        position: 7,
        name: 'Lal Mahal',
        url: `${siteUrl}/places/lal-mahal`,
      },
      {
        '@type': 'ListItem',
        position: 8,
        name: 'Okayama Friendship Garden (Pu La Deshpande)',
        url: `${siteUrl}/places/okayama-friendship-garden`,
      },
      {
        '@type': 'ListItem',
        position: 9,
        name: 'Saras Baug',
        url: `${siteUrl}/places/saras-baug`,
      },
      {
        '@type': 'ListItem',
        position: 10,
        name: 'Khadakwasla Dam',
        url: `${siteUrl}/places/khadakwasla-dam`,
      },
      {
        '@type': 'ListItem',
        position: 11,
        name: 'Parvati Hill Temple Complex',
        url: `${siteUrl}/places/parvati-hill-temple`,
      },
      {
        '@type': 'ListItem',
        position: 12,
        name: 'Rajgad Fort',
        url: `${siteUrl}/places/rajgad-fort`,
      },
    ],
  };

  const faqPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What are the top must-visit places in Pune?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The top places to visit in Pune include Shaniwar Wada (Peshwa palace fortress), Sinhagad Fort (historic mountain battleground), Aga Khan Palace (Gandhi memorial), Dagdusheth Halwai Ganpati Temple, the 8th-century rock-cut Pataleshwar Caves, Raja Dinkar Kelkar Museum, and Okayama Friendship Garden (Pu La Deshpande Garden).',
        },
      },
      {
        '@type': 'Question',
        name: 'How many days are needed to explore Pune?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'A 2 to 3 day itinerary is ideal to explore Pune. Day 1 can cover central heritage monuments (Shaniwar Wada, Lal Mahal, Dagdusheth Ganpati, Raja Dinkar Kelkar Museum). Day 2 is perfect for a morning trek to Sinhagad Fort, followed by Khadakwasla Dam and Pu La Deshpande Garden. Day 3 can explore Aga Khan Palace, Pataleshwar Caves, and Koregaon Park cafes.',
        },
      },
      {
        '@type': 'Question',
        name: 'What are the most famous forts to visit near Pune?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The most famous forts near Pune are Sinhagad Fort (30 km, accessible by road and trek), Rajgad Fort (capital of Shivaji Maharaj’s realm), Torna Fort (Prachandagad), Lohagad Fort near Lonavala, and Shivneri Fort (birthplace of Chhatrapati Shivaji Maharaj in Junnar).',
        },
      },
      {
        '@type': 'Question',
        name: 'How do I travel around Pune using Pune Metro and PMPML buses?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Pune Metro operates Line 1 (Purple Line: PCMC to Swargate) and Line 2 (Aqua Line: Vanaz to Ramwadi). For historic core sites like Shaniwar Wada and Dagdusheth, alight at Mandai or Kasba Peth Metro Stations. For Sinhagad Fort, board PMPML Bus Route 50 from Swargate to Sinhagad Foothills (Donje / Golewadi). Explore Pune provides verified bus and metro routes for all 106+ destinations.',
        },
      },
      {
        '@type': 'Question',
        name: 'What is the best time of year to visit Pune?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'The best time to visit Pune is from October to February when the weather is cool and pleasant for sightseeing (15°C to 28°C). The monsoon season from July to September is magical for visiting Sahyadri hill forts like Sinhagad and Rajgad to witness lush green valleys and waterfalls.',
        },
      },
      {
        '@type': 'Question',
        name: 'Is there an interactive 3D virtual tour available for Pune forts?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Yes! Explore Pune offers an independent, geographically accurate 3D heritage reconstruction of Sinhagad Fort (accessible at /sinhagad). Visitors can walk through the historical three-gate sequence of Pune Darwaza and inspect Maratha stone fortification bastions in full 3D directly in their web browser.',
        },
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(touristDestinationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(topAttractionsItemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPageSchema) }}
      />
    </>
  );
}
