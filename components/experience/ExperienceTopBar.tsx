'use client';

import React, { useState, useRef, useEffect, useMemo } from 'react';
import { Search, X, MapPin, Compass, Globe2, Layers, SlidersHorizontal, Mountain } from 'lucide-react';
import { ExperiencePlace } from '@/lib/experience/types';
import {
  CATEGORY_CONFIGS,
  DestinationCategoryKey,
  resolvePlaceCategory,
  getAllCategoriesList,
} from './CategoryPinIcons';
import {
  getTalukaOrRegion,
  calculateDistanceKm,
  getElevationEstimate,
} from '@/lib/experience/puneDistrictData';
import { ambientAudio } from '@/lib/experience/ambientAudio';

interface ExperienceTopBarProps {
  allPlaces: ExperiencePlace[];
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onSelectPlace: (place: ExperiencePlace) => void;
  mapUiMode: 'explorer' | 'radar';
  onToggleMapUiMode: () => void;
  onOpenSpotlight: () => void;
  lang?: string;
}

export default function ExperienceTopBar({
  allPlaces,
  selectedCategory,
  onSelectCategory,
  searchQuery,
  onSearchChange,
  onSelectPlace,
  mapUiMode,
  onToggleMapUiMode,
  onOpenSpotlight,
  lang = 'en',
}: ExperienceTopBarProps) {
  const isMr = lang === 'mr';
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const searchInputRef = useRef<HTMLInputElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Compute live search suggestions based on query
  const searchSuggestions = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return [];

    return allPlaces
      .filter((p) => {
        const nameEn = (p.name || '').toLowerCase();
        const nameMr = (p.name_mr || '').toLowerCase();
        const catSlug = (p.category_slug || '').toLowerCase();
        const resolved = resolvePlaceCategory(p);
        const cfg = CATEGORY_CONFIGS[resolved] || CATEGORY_CONFIGS.other;

        return (
          nameEn.includes(q) ||
          nameMr.includes(q) ||
          catSlug.includes(q) ||
          resolved.includes(q) ||
          cfg.labelEn.toLowerCase().includes(q) ||
          cfg.labelMr.includes(q) ||
          (p.address || '').toLowerCase().includes(q)
        );
      })
      .slice(0, 6);
  }, [allPlaces, searchQuery]);

  // Compute category count breakdown
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allPlaces.length };
    allPlaces.forEach((p) => {
      const catKey = resolvePlaceCategory(p);
      counts[catKey] = (counts[catKey] || 0) + 1;
    });
    return counts;
  }, [allPlaces]);

  const categories = getAllCategoriesList();

  const handleSelectSuggestion = (place: ExperiencePlace) => {
    onSelectPlace(place);
    setIsSearchFocused(false);
    onSearchChange('');
    ambientAudio.playUiBlip(980, 0.06);
  };

  return (
    <header
      ref={containerRef}
      className="w-full bg-[var(--card)] border-b border-[var(--border)] px-4 py-3 sm:px-6 z-20 shadow-sm"
      role="region"
      aria-label="Pune Experience Discovery Navigation"
    >
      <div className="max-w-7xl mx-auto flex flex-col gap-3">
        {/* Row 1: Compact Title, Subtitle, Stats & Mode Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-2.5">
          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider bg-[var(--primary-light)] text-[var(--primary)] border border-[var(--primary-border)]">
                {isMr ? 'पुणे जिल्हा थेट संवादी नकाशा' : 'PUNE DISTRICT INTERACTIVE EXPLORER'}
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">•</span>
              <span className="text-xs font-semibold text-[var(--foreground)]">
                {allPlaces.length} {isMr ? 'सत्यापित स्थळे' : 'Verified Locations'}
              </span>
              <span className="text-xs text-[var(--muted-foreground)]">•</span>
              <span className="text-xs font-semibold text-[var(--muted-foreground)]">
                15 {isMr ? 'तालुके' : 'Talukas'}
              </span>
            </div>
            <h1 className="text-lg sm:text-xl font-bold tracking-tight text-[var(--foreground)] mt-0.5 truncate">
              {isMr ? 'पुणे जिल्हा थेट संवादी नकाशा व पर्यटन स्थळे' : 'Explore Pune Interactive District Map'}
            </h1>
            <p className="text-xs text-[var(--muted-foreground)] line-clamp-1">
              {isMr
                ? '१५ तालुक्यांमधील १०६ ऐतिहासिक किल्ले, मंदिरे, लेणी, तलाव व पर्यटन स्थळे अचूक GPS निर्देशक व श्रेणीनुसार नकाशामार्फत एक्सप्लोर करा.'
                : '106 destinations across 15 talukas with live GPS coordinates, terrain elevation, and distinct category pins.'}
            </p>
          </div>

          {/* Quick Action Controls */}
          <div className="flex items-center gap-2 flex-shrink-0 self-start md:self-auto">
            <button
              type="button"
              onClick={onToggleMapUiMode}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all shadow-sm ${
                mapUiMode === 'radar'
                  ? 'bg-amber-500/15 text-amber-500 border-amber-500/40'
                  : 'bg-[var(--surface-secondary)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--hover-background)]'
              }`}
              title={
                mapUiMode === 'radar'
                  ? 'Switch back to clean Travel Explorer view'
                  : 'Switch to Open-World Radar HUD with GTA minimap'
              }
            >
              <Compass
                size={14}
                className={mapUiMode === 'radar' ? 'text-amber-500 animate-spin' : 'text-[var(--primary)]'}
                style={mapUiMode === 'radar' ? { animationDuration: '6s' } : undefined}
              />
              <span>{mapUiMode === 'radar' ? (isMr ? 'रडार HUD सक्रिय' : 'RADAR HUD') : (isMr ? 'स्वच्छ नकाशा दृश्य' : 'CLEAN VIEW')}</span>
            </button>

            <button
              type="button"
              onClick={onOpenSpotlight}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[var(--border)] text-xs font-semibold bg-[var(--surface-secondary)] text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover-background)] transition-colors shadow-sm"
              title="Open Spotlight Search (Ctrl+K or /)"
            >
              <Search size={13} />
              <span className="hidden sm:inline">{isMr ? 'स्पॉटलाइट' : 'SPOTLIGHT'}</span>
              <kbd className="px-1 py-0.5 rounded text-[10px] bg-[var(--card)] border border-[var(--border)] font-mono text-[var(--foreground)]">
                /
              </kbd>
            </button>
          </div>
        </div>

        {/* Row 2: Search Input with Live Suggestions Dropdown */}
        <div className="relative w-full">
          <div className="relative flex items-center">
            <div className="absolute left-3.5 pointer-events-none text-[var(--muted-foreground)] flex items-center">
              <Search size={16} />
            </div>

            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              onFocus={() => setIsSearchFocused(true)}
              placeholder={
                isMr
                  ? 'किल्ले, मंदिरे, लेणी, तलाव, धरणे, उद्याने किंवा तालुक्याचे नाव शोधा...'
                  : 'Search destinations by name, fort, temple, cave, lake, museum, or taluka...'
              }
              className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-[var(--surface-secondary)] border border-[var(--border)] text-sm text-[var(--foreground)] placeholder-[var(--muted-foreground)] focus:outline-none focus:ring-2 focus:ring-[var(--primary)] focus:border-transparent transition-all shadow-inner"
              aria-label="Search destination locations"
              aria-expanded={isSearchFocused && searchSuggestions.length > 0}
            />

            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  onSearchChange('');
                  searchInputRef.current?.focus();
                }}
                className="absolute right-3 p-1 rounded-full text-[var(--muted-foreground)] hover:text-[var(--foreground)] hover:bg-[var(--hover-background)] transition-colors"
                aria-label="Clear search query"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Autocomplete Suggestions Dropdown */}
          {isSearchFocused && searchSuggestions.length > 0 && (
            <div
              className="absolute top-full left-0 right-0 mt-1.5 z-50 rounded-2xl bg-[var(--card)] border border-[var(--border)] shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1"
              role="listbox"
            >
              <div className="px-3 py-2 bg-[var(--surface-secondary)] border-b border-[var(--border)] flex items-center justify-between text-[11px] font-mono text-[var(--muted-foreground)]">
                <span>{isMr ? 'शोध परिणाम' : 'SEARCH SUGGESTIONS'}</span>
                <span>{searchSuggestions.length} {isMr ? 'सापडले' : 'Matches'}</span>
              </div>

              <div className="max-h-72 overflow-y-auto divide-y divide-[var(--border)] custom-scrollbar">
                {searchSuggestions.map((place) => {
                  const catKey = resolvePlaceCategory(place);
                  const cfg = CATEGORY_CONFIGS[catKey] || CATEGORY_CONFIGS.other;
                  const taluka = getTalukaOrRegion(place.latitude, place.longitude, place.address);
                  const dist = calculateDistanceKm(18.5204, 73.8567, place.latitude, place.longitude);
                  const elevation = getElevationEstimate(place.latitude, place.longitude, place.category_slug);
                  const title = isMr ? place.name_mr || place.name : place.name;

                  return (
                    <button
                      key={place.slug}
                      type="button"
                      onClick={() => handleSelectSuggestion(place)}
                      className="w-full text-left p-3 hover:bg-[var(--hover-background)] transition-colors flex items-center justify-between gap-3 group"
                      role="option"
                      aria-selected={false}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        {/* Category Vector Color Indicator */}
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 text-white shadow-sm"
                          style={{ backgroundColor: cfg.color }}
                        >
                          <svg
                            viewBox="0 0 24 24"
                            width="16"
                            height="16"
                            className="fill-current text-white"
                          >
                            <g dangerouslySetInnerHTML={{ __html: cfg.svgPath }} />
                          </svg>
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-xs font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors truncate">
                              {title}
                            </span>
                            <span
                              className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold uppercase text-white"
                              style={{ backgroundColor: cfg.color }}
                            >
                              {isMr ? cfg.labelMr : cfg.labelEn}
                            </span>
                          </div>

                          <div className="flex items-center gap-2 text-[10px] font-mono text-[var(--muted-foreground)] mt-0.5">
                            <span className="flex items-center gap-0.5">
                              <MapPin size={10} />
                              <span>{taluka.nameEn.split(' ')[0]}</span>
                            </span>
                            <span>•</span>
                            <span>{dist} km</span>
                            <span>•</span>
                            <span className="text-amber-500 font-semibold">⛰️ ~{elevation}m</span>
                          </div>
                        </div>
                      </div>

                      <span className="text-xs font-mono font-bold text-[var(--primary)] group-hover:translate-x-1 transition-transform flex-shrink-0">
                        ↗
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Row 3: Horizontal Scrollable Category Filter Pills */}
        <nav
          className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar select-none"
          aria-label="Filter destinations by category"
        >
          {/* All Destinations Pill */}
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 border ${
              selectedCategory === 'all'
                ? 'bg-[var(--primary)] text-[var(--primary-foreground)] border-transparent shadow-md'
                : 'bg-[var(--surface-secondary)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--hover-background)]'
            }`}
          >
            <Globe2 size={13} />
            <span>{isMr ? 'सर्व ठिकाणे' : 'All Destinations'}</span>
            <span
              className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                selectedCategory === 'all'
                  ? 'bg-black/20 text-white'
                  : 'bg-[var(--card)] text-[var(--muted-foreground)]'
              }`}
            >
              {categoryCounts.all}
            </span>
          </button>

          {/* Category-Specific Pills */}
          {categories.map((cfg) => {
            const isCatActive = selectedCategory === cfg.key;
            const count = categoryCounts[cfg.key] || 0;

            return (
              <button
                key={cfg.key}
                type="button"
                onClick={() => onSelectCategory(cfg.key)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all flex-shrink-0 border ${
                  isCatActive
                    ? 'text-white border-transparent shadow-md'
                    : 'bg-[var(--surface-secondary)] text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--hover-background)]'
                }`}
                style={isCatActive ? { backgroundColor: cfg.color } : undefined}
              >
                {/* Embedded SVG icon */}
                <svg viewBox="0 0 24 24" width="13" height="13" className="fill-current flex-shrink-0">
                  <g dangerouslySetInnerHTML={{ __html: cfg.svgPath }} />
                </svg>

                <span>{isMr ? cfg.labelMr : cfg.labelEn}</span>

                <span
                  className={`px-1.5 py-0.2 rounded-full text-[10px] font-mono ${
                    isCatActive
                      ? 'bg-black/25 text-white'
                      : 'bg-[var(--card)] text-[var(--muted-foreground)]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
