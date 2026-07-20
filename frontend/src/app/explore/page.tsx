'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber, getScoreBgColor } from '@/lib/utils';
import { api } from '@/lib/api';

interface Property {
  _id: string;
  title: string;
  shortDescription: string;
  type: string;
  price: number;
  address: string;
  location: { city: string; state: string };
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  status: string;
  views: number;
  investmentScore: { score: number; roiProjections: { moderate: number } };
  rating: { average: number; count: number };
  images?: string[];
}

const mockProperties: Property[] = [
  { _id: '1', title: 'Modern 3BR Apartment in Manhattan', shortDescription: 'Newly renovated with premium finishes in prime location', type: 'apartment', price: 450000, address: '123 Broadway', location: { city: 'New York', state: 'NY' }, bedrooms: 3, bathrooms: 2, squareFeet: 2000, yearBuilt: 2015, status: 'forSale', views: 234, investmentScore: { score: 78, roiProjections: { moderate: 6.7 } }, rating: { average: 4.8, count: 124 }, images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'] },
  { _id: '2', title: 'Luxury Commercial Space Brooklyn', shortDescription: 'Prime commercial location with high foot traffic', type: 'commercial', price: 680000, address: '456 Atlantic Ave', location: { city: 'Brooklyn', state: 'NY' }, bedrooms: 0, bathrooms: 2, squareFeet: 3500, yearBuilt: 2018, status: 'forSale', views: 189, investmentScore: { score: 85, roiProjections: { moderate: 8.2 } }, rating: { average: 4.6, count: 89 }, images: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80'] },
  { _id: '3', title: 'Charming 2BR Townhouse', shortDescription: 'Historic townhouse with modern upgrades and garden', type: 'house', price: 320000, address: '789 Elm St', location: { city: 'Austin', state: 'TX' }, bedrooms: 2, bathrooms: 1.5, squareFeet: 1500, yearBuilt: 1920, status: 'forSale', views: 156, investmentScore: { score: 72, roiProjections: { moderate: 5.8 } }, rating: { average: 4.5, count: 67 }, images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80'] },
  { _id: '4', title: 'Waterfront Multi-Family', shortDescription: '4-unit building with stunning waterfront views', type: 'multifamily', price: 890000, address: '101 Shore Dr', location: { city: 'Miami', state: 'FL' }, bedrooms: 8, bathrooms: 4, squareFeet: 4200, yearBuilt: 2010, status: 'forSale', views: 312, investmentScore: { score: 91, roiProjections: { moderate: 9.4 } }, rating: { average: 4.9, count: 203 }, images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'] },
  { _id: '5', title: 'Vacant Land - Development', shortDescription: 'Prime development land with permits ready', type: 'land', price: 250000, address: '2020 Oak Rd', location: { city: 'Denver', state: 'CO' }, bedrooms: 0, bathrooms: 0, squareFeet: 15000, yearBuilt: 0, status: 'forSale', views: 98, investmentScore: { score: 65, roiProjections: { moderate: 12.1 } }, rating: { average: 4.2, count: 34 }, images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'] },
  { _id: '6', title: 'Downtown Luxury Condo', shortDescription: 'High-rise condo with panoramic city views', type: 'apartment', price: 550000, address: '555 Tower Blvd', location: { city: 'Chicago', state: 'IL' }, bedrooms: 2, bathrooms: 2, squareFeet: 1800, yearBuilt: 2021, status: 'forSale', views: 276, investmentScore: { score: 82, roiProjections: { moderate: 7.1 } }, rating: { average: 4.7, count: 156 }, images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'] },
  { _id: '7', title: 'Suburban Family Home', shortDescription: 'Spacious 4BR home in top-rated school district', type: 'house', price: 380000, address: '777 Maple Ave', location: { city: 'Seattle', state: 'WA' }, bedrooms: 4, bathrooms: 3, squareFeet: 2400, yearBuilt: 2017, status: 'forSale', views: 145, investmentScore: { score: 76, roiProjections: { moderate: 5.2 } }, rating: { average: 4.4, count: 78 }, images: ['https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=800&q=80'] },
  { _id: '8', title: 'Industrial Warehouse', shortDescription: 'Large warehouse with loading docks', type: 'commercial', price: 1200000, address: '999 Industrial Pkwy', location: { city: 'Dallas', state: 'TX' }, bedrooms: 0, bathrooms: 3, squareFeet: 8000, yearBuilt: 2005, status: 'forRent', views: 87, investmentScore: { score: 70, roiProjections: { moderate: 7.8 } }, rating: { average: 4.1, count: 45 }, images: ['https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=800&q=80'] },
  { _id: '9', title: 'Beachfront Vacation Rental', shortDescription: 'Turnkey vacation rental with strong seasonal income', type: 'house', price: 620000, address: '42 Ocean Blvd', location: { city: 'Los Angeles', state: 'CA' }, bedrooms: 3, bathrooms: 2, squareFeet: 1900, yearBuilt: 2019, status: 'forSale', views: 423, investmentScore: { score: 87, roiProjections: { moderate: 8.9 } }, rating: { average: 4.8, count: 198 }, images: ['https://images.unsplash.com/photo-1499793983690-e29ba59ef1c2?w=800&q=80'] },
  { _id: '10', title: 'Studio Apartment - Investment', shortDescription: 'Affordable entry point in growing neighborhood', type: 'apartment', price: 180000, address: '333 Pine St', location: { city: 'Portland', state: 'OR' }, bedrooms: 1, bathrooms: 1, squareFeet: 600, yearBuilt: 2013, status: 'forSale', views: 201, investmentScore: { score: 68, roiProjections: { moderate: 6.3 } }, rating: { average: 4.3, count: 56 }, images: ['https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&q=80'] },
];

const propertyTypes = ['House', 'Apartment', 'Commercial', 'Land', 'Multi-family'];
const locations = ['New York', 'Los Angeles', 'Texas', 'Miami', 'Chicago', 'Seattle', 'Denver', 'Portland', 'Austin', 'Dallas'];

export default function ExplorePage() {
  const [properties, setProperties] = useState<Property[]>(mockProperties);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]);
  const [scoreRange, setScoreRange] = useState<[number, number]>([0, 100]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [roiRange, setRoiRange] = useState<[number, number]>([0, 100]);
  const [sort, setSort] = useState('newest');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [page, setPage] = useState(1);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    api.get<{ properties: Property[] }>('/properties')
      .then((res) => {
        if (res?.properties?.length) {
          setProperties(res.properties);
        } else {
          setProperties(mockProperties);
        }
      })
      .catch(() => setProperties(mockProperties))
      .finally(() => setLoading(false));
  }, []);

  const toggleLoc = (l: string) => setSelectedLocations(p => p.includes(l) ? p.filter(x => x !== l) : [...p, l]);
  const toggleType = (t: string) => setSelectedTypes(p => p.includes(t.toLowerCase()) ? p.filter(x => x !== t.toLowerCase()) : [...p, t.toLowerCase()]);

  const filtered = properties
    .filter(p => {
      if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.location.city.toLowerCase().includes(search.toLowerCase())) return false;
      if (selectedLocations.length && !selectedLocations.some(l => p.location.city.includes(l) || p.location.state.includes(l))) return false;
      if (p.price < priceRange[0] || p.price > priceRange[1]) return false;
      const sc = p.investmentScore?.score || 0;
      if (sc < scoreRange[0] || sc > scoreRange[1]) return false;
      if (selectedTypes.length && !selectedTypes.includes(p.type)) return false;
      const roi = p.investmentScore?.roiProjections?.moderate || 0;
      if (roi < roiRange[0] || roi > roiRange[1]) return false;
      return true;
    })
    .sort((a, b) => {
      switch (sort) {
        case 'priceLow': return a.price - b.price;
        case 'priceHigh': return b.price - a.price;
        case 'roiHigh': return (b.investmentScore?.roiProjections?.moderate || 0) - (a.investmentScore?.roiProjections?.moderate || 0);
        case 'bestScore': return (b.investmentScore?.score || 0) - (a.investmentScore?.score || 0);
        case 'popular': return b.views - a.views;
        default: return 0;
      }
    });

  const perPage = 12;
  const totalPages = Math.ceil(filtered.length / perPage);
  const paginated = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Mobile Filter Toggle */}
        <div className="lg:hidden flex items-center gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" /></svg>
            Filters
          </Button>
        </div>

        <div className="flex gap-6">
          {/* ═══ SIDEBAR ═══ */}
          <aside className={`${sidebarOpen ? 'fixed inset-0 z-50 flex' : 'hidden'} lg:block lg:w-[280px] shrink-0`}>
            {sidebarOpen && <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" onClick={() => setSidebarOpen(false)} />}
            <Card className={`relative ${sidebarOpen ? 'w-[300px] mx-auto my-4 max-h-[90vh] overflow-y-auto' : ''} p-5 border-neutral-200/60`}>
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-neutral-900 text-sm">Filters</h3>
                {sidebarOpen && <button onClick={() => setSidebarOpen(false)} className="p-1 hover:bg-neutral-100 rounded-[8px]"><svg className="w-5 h-5 text-neutral-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg></button>}
              </div>

              <div className="space-y-5">
                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2 block">Search</label>
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search properties..." className="w-full h-10 pl-9 pr-3 rounded-[10px] border border-neutral-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/50 transition-all" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2 block">Location</label>
                  <div className="flex flex-wrap gap-1.5">
                    {locations.map(loc => (
                      <button key={loc} onClick={() => toggleLoc(loc)}
                        className={`text-xs px-2.5 py-1.5 rounded-full font-medium transition-all ${selectedLocations.includes(loc) ? 'bg-primary-800 text-white shadow-soft' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                        {loc}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2 block">Price Range</label>
                  <div className="flex gap-2 items-center">
                    <div className="relative flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">$</span><input type="number" value={priceRange[0]} onChange={e => setPriceRange([+e.target.value, priceRange[1]])} className="w-full h-9 pl-6 pr-2 rounded-[10px] border border-neutral-200 text-sm text-center bg-white/80" placeholder="Min" /></div>
                    <span className="text-neutral-300 text-xs">—</span>
                    <div className="relative flex-1"><span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-neutral-400">$</span><input type="number" value={priceRange[1]} onChange={e => setPriceRange([priceRange[0], +e.target.value])} className="w-full h-9 pl-6 pr-2 rounded-[10px] border border-neutral-200 text-sm text-center bg-white/80" placeholder="Max" /></div>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2 block">AI Score</label>
                  <input type="range" min={0} max={100} value={scoreRange[1]} onChange={e => setScoreRange([scoreRange[0], +e.target.value])} className="w-full accent-primary-800 h-1.5" />
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-primary-800 font-medium">0</span>
                    <span className="text-accent-600 font-medium">{scoreRange[1]}</span>
                    <span className="text-primary-800 font-medium">100</span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2 block">Property Type</label>
                  <div className="grid grid-cols-2 gap-1.5">
                    {propertyTypes.map(type => {
                      const checked = selectedTypes.includes(type.toLowerCase());
                      return (
                        <button key={type} onClick={() => toggleType(type)}
                          className={`text-xs px-3 py-2 rounded-[8px] font-medium transition-all border ${checked ? 'bg-primary-800 text-white border-primary-800' : 'bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300'}`}>
                          {type}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2 block">Min ROI: {roiRange[0]}%</label>
                  <input type="range" min={0} max={50} value={roiRange[0]} onChange={e => setRoiRange([+e.target.value, roiRange[1]])} className="w-full accent-accent-500 h-1.5" />
                </div>

                <div>
                  <label className="text-xs font-semibold text-neutral-600 uppercase tracking-wider mb-2 block">Sort By</label>
                  <select value={sort} onChange={e => setSort(e.target.value)} className="w-full h-10 px-3 rounded-[10px] border border-neutral-200 text-sm bg-white/80 focus:outline-none focus:ring-2 focus:ring-primary-800/20">
                    <option value="newest">Newest First</option>
                    <option value="popular">Most Popular</option>
                    <option value="roiHigh">Highest ROI</option>
                    <option value="bestScore">Best AI Score</option>
                    <option value="priceLow">Price: Low → High</option>
                    <option value="priceHigh">Price: High → Low</option>
                  </select>
                </div>

                <Button variant="outline" className="w-full text-sm" onClick={() => { setSearch(''); setSelectedLocations([]); setPriceRange([0, 2000000]); setScoreRange([0, 100]); setSelectedTypes([]); setRoiRange([0, 100]); setSort('newest'); }}>
                  Reset All Filters
                </Button>
              </div>
            </Card>
          </aside>

          {/* ═══ MAIN ═══ */}
          <div className="flex-1 min-w-0">
            {/* Toolbar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-neutral-500"><strong className="text-neutral-800">{filtered.length}</strong> properties found</p>
              <div className="flex items-center gap-3">
                <div className="flex rounded-[10px] border border-neutral-200 overflow-hidden bg-white/80">
                  <button onClick={() => setViewMode('grid')} className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-primary-800 text-white' : 'text-neutral-400 hover:bg-neutral-100'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h7v7H3zm0 11h7v7H3zm11-11h7v7h-7zm0 11h7v7h-7z" /></svg>
                  </button>
                  <button onClick={() => setViewMode('list')} className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-primary-800 text-white' : 'text-neutral-400 hover:bg-neutral-100'}`}>
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" /></svg>
                  </button>
                </div>
              </div>
            </div>

            {/* Loading Skeletons */}
            {loading ? (
              <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-[16px] border border-neutral-200/50 overflow-hidden">
                    <div className="h-[220px] skeleton" />
                    <div className="p-4 space-y-3">
                      <div className="h-4 skeleton rounded w-3/4" />
                      <div className="h-3 skeleton rounded w-1/2" />
                      <div className="h-3 skeleton rounded w-full" />
                      <div className="h-6 skeleton rounded w-1/3" />
                    </div>
                  </div>
                ))}
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {paginated.map((p, idx) => (
                  <Link key={p._id} href={`/properties/${p._id}`} style={{ animationDelay: `${idx * 50}ms` }} className="animate-fade-in-up opacity-0 [animation-fill-mode:forwards]">
                    <Card hover className="overflow-hidden group h-full flex flex-col border-neutral-200/50 relative z-10">
                      <div className="relative h-[220px] overflow-hidden">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-800/70 via-primary-700/60 to-primary-800/70 flex items-center justify-center">
                            <svg className="w-16 h-16 text-white/15" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        <Badge variant="secondary" size="sm" className="absolute top-3 left-3 bg-black/40 text-white/90 border-0 backdrop-blur-sm text-[10px]">{p.location.city}, {p.location.state}</Badge>
                        <div className={`absolute top-3 right-3 w-11 h-11 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-lg transition-transform duration-300 group-hover:scale-110`} style={{ backgroundColor: getScoreBgColor(p.investmentScore?.score || 0) }}>
                          {p.investmentScore?.score || '—'}
                        </div>
                      </div>
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="font-semibold text-neutral-900 text-sm leading-snug mb-1 line-clamp-2 group-hover:text-primary-800 transition-colors">{p.title}</h3>
                        <p className="text-xs text-neutral-500 mb-3 line-clamp-2">{p.shortDescription}</p>
                        <div className="flex items-center gap-3 text-xs text-neutral-500 mb-3">
                          <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>{p.bedrooms} Beds</span>
                          <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" /></svg>{p.bathrooms} Baths</span>
                          <span className="flex items-center gap-1"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>{formatNumber(p.squareFeet)} sqft</span>
                        </div>
                        <div className="mt-auto pt-2">
                          <span className="text-xs font-medium text-primary-800 hover:text-primary-700 transition-colors inline-flex items-center gap-1 group-hover:gap-2 transition-all duration-300">
                            View Details <span aria-hidden="true" className="transition-transform duration-300 group-hover:translate-x-0.5">→</span>
                          </span>
                        </div>
                        <div className="pt-2 border-t border-neutral-100 mt-2">
                          <div className="flex items-center justify-between">
                            <div><p className="text-lg font-bold text-neutral-900">{formatCurrency(p.price)}</p><p className="text-[10px] text-accent-600 font-medium">ROI: +{p.investmentScore?.roiProjections?.moderate || 0}%</p></div>
                            <div className="flex items-center gap-1 text-xs text-neutral-400"><svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>{p.views}</div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              /* List View */
              <div className="space-y-3">
                {paginated.map((p, idx) => (
                  <Link key={p._id} href={`/properties/${p._id}`} style={{ animationDelay: `${idx * 50}ms` }} className="block animate-fade-in-up opacity-0 [animation-fill-mode:forwards]">
                    <Card hover className="flex overflow-hidden border-neutral-200/50 group">
                      <div className="w-[160px] shrink-0 overflow-hidden">
                        {p.images?.[0] ? (
                          <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary-800/60 via-primary-700/50 to-primary-800/60 flex items-center justify-center">
                            <svg className="w-10 h-10 text-white/20" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                          </div>
                        )}
                      </div>
                      <div className="p-4 flex-1 flex items-center gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1"><h3 className="font-semibold text-neutral-900 text-sm group-hover:text-primary-800 transition-colors">{p.title}</h3><Badge variant="secondary" size="sm">{p.type}</Badge></div>
                          <p className="text-xs text-neutral-500 mb-1.5">{p.location.city}, {p.location.state} · {p.bedrooms} bed · {p.bathrooms} bath · {formatNumber(p.squareFeet)} sqft</p>
                          <p className="text-xs text-neutral-400 line-clamp-1">{p.shortDescription}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <p className="text-lg font-bold text-neutral-900">{formatCurrency(p.price)}</p>
                          <p className="text-xs text-accent-600 font-medium">ROI: +{p.investmentScore?.roiProjections?.moderate || 0}%</p>
                        </div>
                        <div className="shrink-0">
                          <div className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-xs text-white shadow-soft transition-all duration-300 group-hover:scale-110 group-hover:shadow-medium" style={{ backgroundColor: getScoreBgColor(p.investmentScore?.score || 0) }}>
                            {p.investmentScore?.score || '—'}
                          </div>
                        </div>
                      </div>
                    </Card>
                  </Link>
                ))}
              </div>
            )}

            {/* Empty */}
            {!loading && paginated.length === 0 && (
              <div className="text-center py-24">
                <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                </div>
                <h3 className="text-lg font-semibold text-neutral-800 mb-1">No properties match your filters</h3>
                <p className="text-sm text-neutral-500 mb-4">Try expanding your search criteria</p>
                <Button variant="outline" onClick={() => { setSearch(''); setSelectedLocations([]); setPriceRange([0, 2000000]); setScoreRange([0, 100]); setSelectedTypes([]); setRoiRange([0, 100]); }}>Clear All Filters</Button>
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && paginated.length > 0 && (
              <div className="flex items-center justify-center gap-2 mt-10">
                <button disabled={page === 1} onClick={() => setPage(page - 1)} className="h-9 px-3.5 rounded-[10px] text-sm border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white/80">← Previous</button>
                <div className="flex gap-1">
                  {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                    let p: number;
                    if (totalPages <= 5) p = i + 1;
                    else if (page <= 3) p = i + 1;
                    else if (page >= totalPages - 2) p = totalPages - 4 + i;
                    else p = page - 2 + i;
                    return (
                      <button key={p} onClick={() => setPage(p)}
                        className={`w-9 h-9 rounded-[10px] text-sm font-medium transition-all ${page === p ? 'bg-primary-800 text-white shadow-soft' : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50 bg-white/80'}`}>
                        {p}
                      </button>
                    );
                  })}
                </div>
                <button disabled={page === totalPages} onClick={() => setPage(page + 1)} className="h-9 px-3.5 rounded-[10px] text-sm border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors bg-white/80">Next →</button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
