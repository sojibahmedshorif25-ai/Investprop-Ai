'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency, formatNumber } from '@/lib/utils';
import { api } from '@/lib/api';

const mockProperty = {
  _id: '1',
  title: 'Modern 3BR Apartment in Manhattan',
  description: 'Newly renovated apartment in prime Manhattan location.',
  shortDescription: 'Newly renovated with premium finishes in prime location',
  type: 'apartment',
  price: 450000,
  address: '123 Broadway, New York, NY 10001',
  location: { city: 'New York', state: 'NY', zip: '10001', coordinates: { lat: 40.7484, lng: -73.9967 } },
  bedrooms: 3,
  bathrooms: 2,
  squareFeet: 2000,
  yearBuilt: 2015,
  status: 'forSale',
  amenities: ['Hardwood floors', 'Modern kitchen', 'Central AC'],
  owner: { _id: '1', name: 'Sarah Johnson', avatar: '', email: 'sarah@realty.com', company: 'Premium Realty Group', phoneNumber: '+1 (212) 555-0142' },
  estimatedROI: 6.7,
  monthlyRentalIncome: 3200,
  investmentScore: {
    score: 78,
    breakdown: { marketAnalysis: 82, locationQuality: 76, financialPotential: 75, legalRiskAssessment: 77 },
    analysis: 'The property is located in a high-growth area.',
    roiProjections: { conservative: 5.2, moderate: 6.7, optimistic: 9.1 },
    recommendation: 'Strong Buy',
  },
  views: 234,
  rating: { average: 4.8, count: 124 },
  createdAt: '2025-06-15T00:00:00.000Z',
  listedDate: '2025-06-15T00:00:00.000Z',
  images: [],
};

const marketTrendData = Array.from({ length: 12 }, (_, i) => ({
  month: ['Aug','Sep','Oct','Nov','Dec','Jan','Feb','Mar','Apr','May','Jun','Jul'][i],
  property: 425000 + i * 2500,
  market: 410000 + i * 3000,
}));

const roiProjectionData = [
  { year: 'Year 1', conservative: 5.2, moderate: 6.7, optimistic: 9.1 },
  { year: 'Year 2', conservative: 5.5, moderate: 7.0, optimistic: 9.5 },
  { year: 'Year 3', conservative: 5.8, moderate: 7.3, optimistic: 10.0 },
  { year: 'Year 4', conservative: 6.0, moderate: 7.5, optimistic: 10.4 },
  { year: 'Year 5', conservative: 6.2, moderate: 7.8, optimistic: 10.8 },
];

const mockReviews = [
  { _id: 'r1', author: { _id: 'u1', name: 'Michael T.', avatar: '' }, rating: 5, title: 'Excellent investment', content: 'This property exceeded my expectations.', helpful: 23, createdAt: '2026-06-20' },
  { _id: 'r2', author: { _id: 'u2', name: 'Jessica L.', avatar: '' }, rating: 5, title: 'Great location', content: 'Perfect for rental income.', helpful: 18, createdAt: '2026-06-15' },
  { _id: 'r3', author: { _id: 'u3', name: 'Robert K.', avatar: '' }, rating: 4, title: 'Solid investment', content: 'Good property with strong fundamentals.', helpful: 12, createdAt: '2026-06-10' },
  { _id: 'r4', author: { _id: 'u4', name: 'Amanda P.', avatar: '' }, rating: 5, title: 'AI score accurate', content: 'The AI investment score reflected the potential.', helpful: 15, createdAt: '2026-06-05' },
];

const relatedProperties = [
  { _id: 'r1', title: 'Luxury 2BR in Upper East Side', price: 520000, location: 'New York, NY', roi: 6.2, score: 82 },
  { _id: 'r2', title: 'Studio in Financial District', price: 380000, location: 'New York, NY', roi: 5.8, score: 74 },
  { _id: 'r3', title: '4BR Brownstone in Brooklyn', price: 680000, location: 'Brooklyn, NY', roi: 7.1, score: 79 },
];

function Skeleton({ className }: { className?: string }) {
  return <div className={'animate-pulse bg-neutral-200 rounded ' + (className || '')} />;
}

export default function PropertyDetailsPage({ params }: { params: { id: string } }) {
  const [property, setProperty] = useState<typeof mockProperty | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [saved, setSaved] = useState(false);
  const [reviewPage, setReviewPage] = useState(1);

  useEffect(() => {
    async function fetchProperty() {
      try {
        setLoading(true);
        const data = await api.get<typeof mockProperty>(`/properties/${params.id}`);
        setProperty(data);
      } catch (err: any) {
        if (err?.message?.toLowerCase().includes('not found')) {
          setProperty(null);
        } else {
          setProperty(mockProperty);
        }
      } finally {
        setLoading(false);
      }
    }
    fetchProperty();
  }, [params.id]);

  if (loading) {
    return (
      <div className="pt-24 pb-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-6">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-4" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-[400px] md:h-[500px] w-full mb-6" />
              <div className="flex gap-6 mb-6">
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-8 w-40" />
                <Skeleton className="h-8 w-20" />
                <Skeleton className="h-8 w-36" />
              </div>
              <Skeleton className="h-10 w-72 mb-4" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </div>
            <div>
              <Skeleton className="h-48 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="pt-24 pb-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center min-h-[60vh] text-center">
            <div className="w-20 h-20 rounded-full bg-neutral-100 flex items-center justify-center mb-6">
              <svg className="w-10 h-10 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-primary-800 mb-2">Property not found</h2>
            <p className="text-neutral-500 mb-6">The property you are looking for does not exist or has been removed.</p>
            <Link href="/explore">
              <Button size="lg">Back to Explore</Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const p = property;
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'ai-insights', label: 'AI Insights and Analysis' },
    { id: 'reviews', label: 'Reviews (' + p.rating.count + ')' },
    { id: 'related', label: 'Related Properties' },
  ];

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center justify-between mb-6 animate-fade-in">
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <Link href="/" className="hover:text-primary-800 transition-colors">Home</Link>
            <span className="text-neutral-300">/</span>
            <Link href="/explore" className="hover:text-primary-800 transition-colors">Explore</Link>
            <span className="text-neutral-300">/</span>
            <span className="text-neutral-800 font-medium truncate max-w-[200px]">{p.title}</span>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setSaved(!saved)} className="p-2.5 rounded-[12px] hover:bg-neutral-100 transition-all duration-200 hover:shadow-soft">
              <svg className={'w-5 h-5 transition-colors duration-200 ' + (saved ? 'text-red-500 fill-red-500' : 'text-neutral-400')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </button>
            <button className="p-2.5 rounded-[12px] hover:bg-neutral-100 transition-all duration-200 hover:shadow-soft">
              <svg className="w-5 h-5 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
            </button>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Image */}
            <div className="relative h-[400px] md:h-[500px] rounded-[16px] overflow-hidden group shadow-soft">
              {property.images?.[0] ? (
                <img src={property.images[0]} alt={property.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-primary-800/60 to-primary-900/60 flex items-center justify-center">
                  <svg className="w-24 h-24 text-white/20" fill="currentColor" viewBox="0 0 24 24"><path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-4 right-4 bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full">{property.images?.length || 1}/{property.images?.length || 8}</div>
              <Badge variant="premium" size="sm" className="absolute top-4 left-4">{p.status === 'forSale' ? 'For Sale' : 'For Rent'}</Badge>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-neutral-200 overflow-x-auto scrollbar-hide bg-white rounded-[12px] p-1 shadow-soft">
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                  className={'px-5 py-2.5 text-sm font-medium whitespace-nowrap rounded-[10px] transition-all duration-200 ' + (activeTab === tab.id ? 'bg-primary-800 text-white shadow-soft' : 'text-neutral-500 hover:text-neutral-700 hover:bg-neutral-50')}>
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            <div className="animate-fade-in">
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-primary-800 mb-3">{p.title}</h1>
                    <p className="text-neutral-600 leading-relaxed">{p.description}</p>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { label: 'Bedrooms', value: p.bedrooms, icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
                      { label: 'Bathrooms', value: p.bathrooms, icon: 'M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4' },
                      { label: 'Square Feet', value: formatNumber(p.squareFeet), icon: 'M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4' },
                      { label: 'Year Built', value: p.yearBuilt, icon: 'M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z' },
                    ].map((item, i) => (
                      <Card key={i} className="p-4 text-center">
                        <svg className="w-5 h-5 text-primary-800 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} /></svg>
                        <p className="text-lg font-bold text-neutral-900">{item.value}</p>
                        <p className="text-xs text-neutral-500">{item.label}</p>
                      </Card>
                    ))}
                  </div>
                  <div className="flex items-baseline gap-4 p-4 bg-neutral-50 rounded-[12px]">
                    <span className="text-3xl font-bold text-primary-800">{formatCurrency(p.price)}</span>
                    <span className="text-sm text-accent-600 font-medium">Projected Annual ROI: +{p.estimatedROI}%</span>
                  </div>
                  {p.amenities?.length > 0 && (
                    <div>
                      <h3 className="font-semibold text-neutral-900 mb-3">Amenities</h3>
                      <div className="flex flex-wrap gap-2">
                        {p.amenities.map((a, i) => (
                          <Badge key={i} variant="secondary" size="lg">{a}</Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'ai-insights' && (
                <div className="space-y-6">
                  <Card className="p-8 text-center relative overflow-hidden">
                    <div className="absolute inset-0 gradient-primary opacity-5" />
                    <div className="relative">
                      <div className="w-28 h-28 rounded-full flex items-center justify-center mx-auto mb-4 text-4xl font-bold text-white gradient-accent shadow-glow-accent">
                        {p.investmentScore.score}
                      </div>
                      <h3 className="text-xl font-bold text-primary-800 mb-2">{p.investmentScore.recommendation}</h3>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                        {Object.entries(p.investmentScore.breakdown).map(([key, val]) => (
                          <div key={key} className="text-center">
                            <div className="text-2xl font-bold text-accent-600">{val}</div>
                            <div className="text-xs text-neutral-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </Card>
                  <Card className="p-6">
                    <h3 className="font-semibold text-primary-800 mb-3">AI Summary</h3>
                    <p className="text-sm text-neutral-600 leading-relaxed">{p.investmentScore.analysis}</p>
                  </Card>
                </div>
              )}

              {activeTab === 'reviews' && (
                <div className="space-y-4">
                  {mockReviews.map(r => (
                    <Card key={r._id} className="p-5 hover:shadow-soft transition-shadow">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white text-xs font-bold">{r.author.name.charAt(0)}</div>
                        <div>
                          <p className="font-medium text-sm text-neutral-800">{r.author.name}</p>
                          <p className="text-xs text-neutral-400">{r.createdAt}</p>
                        </div>
                      </div>
                      <div className="flex gap-0.5 mb-2">
                        {Array.from({ length: r.rating }).map((_, s) => (
                          <svg key={s} className="w-3.5 h-3.5 text-accent-500 fill-accent-500" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        ))}
                      </div>
                      <p className="text-sm text-neutral-600 leading-relaxed">{r.content}</p>
                    </Card>
                  ))}
                  <Button variant="outline" className="w-full">Write a Review</Button>
                </div>
              )}

              {activeTab === 'related' && (
                <div className="grid sm:grid-cols-3 gap-4">
                  {relatedProperties.map((rp, i) => (
                    <Card key={rp._id} className="p-5 hover:shadow-medium transition-all duration-300 hover:-translate-y-0.5">
                      <h4 className="font-semibold text-neutral-800 text-sm mb-1">{rp.title}</h4>
                      <p className="text-xs text-neutral-500 mb-2">{rp.location}</p>
                      <p className="font-bold text-primary-800 text-lg">{formatCurrency(rp.price)}</p>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 animate-fade-in-up">
            <Card className="p-6 sticky top-24">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-neutral-100">
                <div className="w-12 h-12 rounded-full gradient-primary flex items-center justify-center text-white font-semibold text-lg shadow-soft">{p.owner.name.charAt(0)}</div>
                <div>
                  <p className="font-semibold text-sm text-neutral-900">{p.owner.name}</p>
                  <p className="text-xs text-neutral-500">{p.owner.company}</p>
                </div>
              </div>
              <div className="space-y-3 mb-6">
                <div className="flex items-center gap-3 text-sm"><svg className="w-4 h-4 text-primary-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg><span className="text-neutral-600">{p.owner.email}</span></div>
                <div className="flex items-center gap-3 text-sm"><svg className="w-4 h-4 text-primary-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg><span className="text-neutral-600">{p.owner.phoneNumber}</span></div>
              </div>
              <Button className="w-full" size="lg" variant="gradient">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                Contact Agent
              </Button>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
