import { describe, it, expect } from 'vitest';
import fs from 'node:fs';
import path from 'node:path';
import robots from '@/app/robots';
import sitemap from '@/app/sitemap';
import { metadata as layoutMetadata } from '@/app/layout';
import { metadata as pageMetadata } from '@/app/page';

describe('Comprehensive SEO, GEO & Competitor Benchmark Verification', () => {
  const rootDir = path.resolve(__dirname, '..');

  describe('1. GeoJSON Spatial Grounding Dataset (RFC 7946)', () => {
    it('verifies public/geo/pune-destinations.geojson exists and is valid RFC 7946', () => {
      const geoPath = path.join(rootDir, 'public', 'geo', 'pune-destinations.geojson');
      expect(fs.existsSync(geoPath)).toBe(true);

      const content = fs.readFileSync(geoPath, 'utf8');
      const data = JSON.parse(content);

      expect(data.type).toBe('FeatureCollection');
      expect(data.features).toBeDefined();
      expect(data.features.length).toBe(106);

      // Verify Bounding Box matches Pune Region
      expect(data.bbox).toBeDefined();
      expect(data.bbox[0]).toBeGreaterThanOrEqual(73.0); // min lng
      expect(data.bbox[1]).toBeGreaterThanOrEqual(18.0); // min lat
      expect(data.bbox[2]).toBeLessThanOrEqual(75.0);    // max lng
      expect(data.bbox[3]).toBeLessThanOrEqual(20.0);    // max lat

      // Verify coordinate order [lng, lat]
      const sinhagad = data.features.find((f: any) => f.id === 'sinhagad-fort');
      expect(sinhagad).toBeDefined();
      expect(sinhagad.geometry.type).toBe('Point');
      expect(sinhagad.geometry.coordinates[0]).toBeCloseTo(73.7558, 3); // Lng
      expect(sinhagad.geometry.coordinates[1]).toBeCloseTo(18.3664, 3); // Lat
      expect(sinhagad.properties.name).toBe("Sinhagad Fort (Lion's Fort)");
      expect(sinhagad.properties.url).toContain('/places/sinhagad-fort');
    });
  });

  describe('2. Root Layout Metadata & GEO Tagging', () => {
    it('verifies root title and keywords capture "explore pune" and "places to visit"', () => {
      expect(layoutMetadata.title).toBeDefined();
      const defaultTitle = typeof layoutMetadata.title === 'object' && 'default' in layoutMetadata.title!
        ? layoutMetadata.title.default
        : String(layoutMetadata.title);

      expect(defaultTitle).toMatch(/Explore Pune/i);
      expect(defaultTitle).toMatch(/Top Places to Visit/i);

      const kw = layoutMetadata.keywords as string[];
      expect(kw).toContain('explore pune');
      expect(kw).toContain('places to visit in pune');
      expect(kw).toContain('pune tourist places');
      expect(kw).toContain('Sinhagad Fort trek');
      expect(kw).toContain('Shaniwar Wada timings and ticket fee');
      expect(kw).toContain('पुणे पर्यटन');
    });

    it('verifies explicit geographic ICBM and geo.region metadata tags', () => {
      const other = layoutMetadata.other as Record<string, string>;
      expect(other).toBeDefined();
      expect(other['geo.region']).toBe('IN-MH');
      expect(other['geo.placename']).toBe('Pune, Maharashtra, India');
      expect(other['geo.position']).toBe('18.5204;73.8567');
      expect(other['ICBM']).toBe('18.5204, 73.8567');
      expect(other['DC.title']).toContain('Explore Pune');
    });
  });

  describe('3. SiteJsonLd Structured Data Entities', () => {
    it('verifies SiteJsonLd source contains TouristDestination, ItemList, FAQPage, and Organization', () => {
      const siteJsonLdPath = path.join(rootDir, 'components', 'SiteJsonLd.tsx');
      expect(fs.existsSync(siteJsonLdPath)).toBe(true);

      const content = fs.readFileSync(siteJsonLdPath, 'utf8');

      // 1. TouristDestination
      expect(content).toMatch(/['"]@type['"]:\s*['"]TouristDestination['"]/);
      expect(content).toContain('name: \'Pune\'');
      expect(content).toContain('18.5204');
      expect(content).toContain('73.8567');
      expect(content).toContain('Sinhagad Fort');
      expect(content).toContain('Shaniwar Wada');
      expect(content).toContain('Aga Khan Palace');

      // 2. ItemList
      expect(content).toMatch(/['"]@type['"]:\s*['"]ItemList['"]/);
      expect(content).toContain('Top Places to Visit in Pune');

      // 3. FAQPage
      expect(content).toMatch(/['"]@type['"]:\s*['"]FAQPage['"]/);
      expect(content).toContain('What are the top must-visit places in Pune?');
      expect(content).toContain('How many days are needed to explore Pune?');
      expect(content).toContain('Pune Metro and PMPML');

      // 4. Organization & WebSite
      expect(content).toContain('TouristInformationCenter');
      expect(content).toContain('SearchAction');
    });
  });

  describe('4. Sitemap and Robots Optimization', () => {
    it('verifies sitemap includes /sinhagad and GeoJSON endpoint', async () => {
      const sitemapEntries = await sitemap();
      const urls = sitemapEntries.map((e) => e.url);

      const baseUrl = 'https://explorepune-guide.vercel.app';
      expect(urls).toContain(`${baseUrl}/sinhagad`);
      expect(urls).toContain(`${baseUrl}/experience/sinhagad`);
      expect(urls).toContain(`${baseUrl}/destinations`);
      expect(urls).toContain(`${baseUrl}/geo/pune-destinations.geojson`);
    });

    it('verifies robots explicitly allows /sinhagad and /geo/', () => {
      const robotsConfig = robots();
      const rules = Array.isArray(robotsConfig.rules) ? robotsConfig.rules : [robotsConfig.rules];
      const wildcardRule = rules.find((r) => r.userAgent === '*');

      const allowed = Array.isArray(wildcardRule?.allow) ? wildcardRule.allow : [wildcardRule?.allow];
      expect(allowed).toContain('/sinhagad');
      expect(allowed).toContain('/sinhagad/');
      expect(allowed).toContain('/geo/');
    });
  });

  describe('5. Homepage Metadata & On-Page Semantic Headings', () => {
    it('verifies homepage metadata targets "explore pune" query intent', () => {
      expect(pageMetadata.title).toContain('Explore Pune');
      expect(pageMetadata.title).toContain('Top Places to Visit');
      expect(pageMetadata.description).toContain('Sinhagad Fort');
      expect(pageMetadata.description).toContain('Shaniwar Wada');
    });

    it('verifies HomeExplorer has exact "Explore Pune" h1 heading and visible FAQ section', () => {
      const homePath = path.join(rootDir, 'components', 'HomeExplorer.tsx');
      const content = fs.readFileSync(homePath, 'utf8');

      expect(content).toContain('Explore Pune:');
      expect(content).toContain('Top Places to Visit');
      expect(content).toContain('Frequently Asked Questions');
      expect(content).toContain('पुण्यातील सर्वोत्तम प्रेक्षणीय स्थळे कोणती आहेत?');
    });
  });
});
