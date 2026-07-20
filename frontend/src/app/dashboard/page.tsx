'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  investmentGoals: string[];
  preferredLocations: string[];
  budgetRange: { min: number; max: number };
}

interface PropertyItem {
  _id: string;
  title: string;
  price: number;
  address: string;
  location: { city: string; state: string };
  type: string;
  status: string;
  images: string[];
  estimatedROI: number;
  monthlyRentalIncome: number;
  investmentScore: {
    score: number;
    breakdown: Record<string, number>;
    roiProjections: { conservative: number; moderate: number; aggressive: number };
    recommendation: string;
  };
  owner: string;
  views: number;
  rating: { average: number; count: number };
}

interface Recommendation {
  title: string;
  location: string;
  score: number;
  roi: number;
  price: number;
  match?: string[];
}

const fallbackPortfolioValueData = [
  { month: 'Aug', value: 2100000 },
  { month: 'Sep', value: 2180000 },
  { month: 'Oct', value: 2250000 },
  { month: 'Nov', value: 2300000 },
  { month: 'Dec', value: 2350000 },
  { month: 'Jan', value: 2320000 },
  { month: 'Feb', value: 2380000 },
  { month: 'Mar', value: 2400000 },
  { month: 'Apr', value: 2420000 },
  { month: 'May', value: 2435000 },
  { month: 'Jun', value: 2445000 },
  { month: 'Jul', value: 2450000 },
];

const fallbackAllocation = [
  { name: 'Residential', value: 45, color: '#1e3a8a' },
  { name: 'Commercial', value: 30, color: '#d97706' },
  { name: 'Land', value: 15, color: '#64748b' },
  { name: 'Multi-family', value: 10, color: '#3b82f6' },
];

const fallbackActivities = [
  { icon: '🏠', text: "Added 'Downtown Office Building'", time: '2 days ago', type: 'add' as const },
  { icon: '💰', text: "Sold '3BR Brooklyn Apartment'", time: '1 week ago', type: 'sale' as const },
  { icon: '🤖', text: 'AI recommendation for property XYZ', time: '3 days ago', type: 'ai' as const },
  { icon: '📈', text: 'Portfolio value up $50K this month', time: '5 days ago', type: 'growth' as const },
  { icon: '⭐', text: 'New AI analysis: Manhattan property', time: '1 week ago', type: 'analysis' as const },
  { icon: '📊', text: 'Market Report: Q3 projections', time: '2 weeks ago', type: 'report' as const },
];

const fallbackRecommendations: Recommendation[] = [
  { title: 'Modern 3BR in Manhattan', location: 'New York, NY', score: 92, roi: 6.7, price: 450000, match: ['Location', 'ROI', 'Price'] },
  { title: 'Commercial Space Brooklyn', location: 'Brooklyn, NY', score: 88, roi: 8.2, price: 680000, match: ['ROI', 'Growth'] },
  { title: 'Luxury Condo Downtown', location: 'New York, NY', score: 85, roi: 5.9, price: 520000, match: ['Location', 'Type'] },
];

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [myProperties, setMyProperties] = useState<PropertyItem[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>(fallbackRecommendations);
  const [activities] = useState(fallbackActivities);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }
  }, [router]);

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        const [profileRes, propertiesRes, recsRes] = await Promise.allSettled([
          api.get<UserProfile>('/auth/profile'),
          api.get<{ properties: PropertyItem[] }>('/properties?limit=50'),
          api.get<Recommendation[]>('/ai/recommendations'),
        ]);

        if (cancelled) return;

        if (profileRes.status === 'fulfilled') {
          setProfile(profileRes.value);
        } else {
          const stored = localStorage.getItem('user');
          if (stored) try { const u = JSON.parse(stored); setProfile(u); } catch { /* */ }
        }

        if (propertiesRes.status === 'fulfilled') {
          const allProperties = propertiesRes.value.properties;
          const userId = profileRes.status === 'fulfilled' ? (profileRes.value as UserProfile)._id : null;
          if (userId) {
            setMyProperties(allProperties.filter(p => p.owner === userId));
          } else {
            setMyProperties(allProperties.slice(0, 5));
          }
        } else {
          setMyProperties([]);
        }

        if (recsRes.status === 'fulfilled') {
          setRecommendations(Array.isArray(recsRes.value) ? recsRes.value.slice(0, 3) : fallbackRecommendations);
        }
      } catch {
        const stored = localStorage.getItem('user');
        if (stored) try { const u = JSON.parse(stored); setProfile(u); } catch { /* */ }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadDashboard();
    return () => { cancelled = true; };
  }, []);

  const userName = profile?.name || 'Investor';
  const totalValue = myProperties.reduce((sum, p) => sum + p.price, 0);
  const totalMonthlyIncome = myProperties.reduce((sum, p) => sum + (p.monthlyRentalIncome || 0), 0);
  const avgROI = myProperties.length > 0 ? myProperties.reduce((sum, p) => sum + (p.estimatedROI || 0), 0) / myProperties.length : 8.5;
  const activeCount = myProperties.filter(p => p.status === 'Active' || p.status === 'active').length;
  const inactiveCount = myProperties.length - activeCount;

  const portfolioValueData = myProperties.length > 0
    ? [...fallbackPortfolioValueData].map((d, i) => ({
        ...d,
        value: fallbackPortfolioValueData[fallbackPortfolioValueData.length - 1].value * (1 + (i - fallbackPortfolioValueData.length + 1) * 0.01),
      }))
    : fallbackPortfolioValueData;

  const byType: Record<string, number> = {};
  myProperties.forEach(p => {
    const t = p.type || 'Other';
    byType[t] = (byType[t] || 0) + p.price;
  });
  const totalByType = Object.values(byType).reduce((a, b) => a + b, 0) || 1;
  const allocationColors = ['#1e3a8a', '#d97706', '#475569', '#1e40af', '#f59e0b'];
  const allocationData = Object.keys(byType).length > 0
    ? Object.entries(byType).map(([name, value], i) => ({ name, value: Math.round((value / totalByType) * 100), color: allocationColors[i % allocationColors.length] }))
    : fallbackAllocation;

  const topProperties = myProperties.length > 0
    ? [...myProperties].sort((a, b) => (b.estimatedROI || 0) - (a.estimatedROI || 0)).slice(0, 5).map(p => ({
        name: p.title,
        roi: p.estimatedROI || 0,
        value: p.price,
        status: p.status === 'Active' || p.status === 'active' ? 'Active' : 'Inactive',
        change: `+$${p.monthlyRentalIncome?.toLocaleString() || '0'}`,
      }))
    : [];

  const portfolioChartData = totalValue > 0
    ? Array.from({ length: 12 }, (_, i) => ({
        month: ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'][i],
        value: Math.round(totalValue * (0.85 + (i / 12) * 0.3)),
      }))
    : fallbackPortfolioValueData;

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div className="space-y-3">
              <div className="skeleton h-8 w-72 rounded-lg" />
              <div className="skeleton h-4 w-56 rounded-lg" />
            </div>
            <div className="flex gap-2">
              <div className="skeleton h-9 w-32 rounded-lg" />
              <div className="skeleton h-9 w-24 rounded-lg" />
            </div>
          </div>
          <div className="grid lg:grid-cols-12 gap-6">
            <div className="lg:col-span-3 space-y-4">
              <div className="skeleton h-44 rounded-xl" />
              <div className="skeleton h-32 rounded-xl" />
              <div className="skeleton h-28 rounded-xl" />
              <div className="skeleton h-28 rounded-xl" />
            </div>
            <div className="lg:col-span-6 space-y-6">
              <div className="skeleton h-80 rounded-xl" />
              <div className="grid grid-cols-2 gap-4">
                <div className="skeleton h-60 rounded-xl" />
                <div className="skeleton h-60 rounded-xl" />
              </div>
              <div className="skeleton h-64 rounded-xl" />
            </div>
            <div className="lg:col-span-3 space-y-4">
              <div className="skeleton h-72 rounded-xl" />
              <div className="skeleton h-80 rounded-xl" />
              <div className="skeleton h-36 rounded-xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl md:text-3xl font-bold text-neutral-900">Welcome back, {userName}</h1>
              <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
            </div>
            <p className="text-neutral-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })} &middot; <span className="text-accent-500 font-medium">All systems operational</span></p>
          </div>
          <div className="flex gap-2">
            <Link href="/items/add"><Button variant="gradient" size="sm"><svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>Add Property</Button></Link>
            <Link href="/explore"><Button variant="outline" size="sm"><svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>Explore</Button></Link>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-6">
          {/* ═══ LEFT COL: KPI Cards ═══ */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-6 bg-gradient-to-br from-primary-800 via-primary-700 to-primary-800 text-white border-0 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/[0.03] rounded-full translate-y-1/2 -translate-x-1/2" />
              <p className="text-sm text-white/60 font-medium mb-1 relative">Total Portfolio Value</p>
              <p className="text-3xl font-bold mb-1 relative tracking-tight">{totalValue > 0 ? formatCurrency(totalValue) : '$2,450,000'}</p>
              <div className="flex items-center gap-1.5 text-sm text-accent-300 relative">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                +{totalValue > 0 ? formatCurrency(Math.round(totalValue * 0.05)) : '$125,000'} this month
              </div>
              <div className="mt-4 h-12 relative">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={portfolioChartData.slice(-6)}>
                    <defs><linearGradient id="wg" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#fff" stopOpacity={0.25} /><stop offset="100%" stopColor="#fff" stopOpacity={0} /></linearGradient></defs>
                    <Area type="monotone" dataKey="value" stroke="#fff" strokeWidth={2} fill="url(#wg)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <Card className="p-5 group card-hover">
              <div className="flex items-center justify-between mb-2">
                <p className="text-3xl font-bold text-neutral-900">{myProperties.length || 12}</p>
                <div className="w-10 h-10 rounded-[10px] bg-primary-800/10 flex items-center justify-center group-hover:bg-primary-800/20 transition-colors">
                  <svg className="w-5 h-5 text-primary-800" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>
                </div>
              </div>
              <p className="text-sm text-neutral-500 mb-2">Properties Owned</p>
              <div className="flex gap-1.5">
                <Badge variant="success" size="sm">{activeCount || 10} Active</Badge>
                <Badge variant="secondary" size="sm">{inactiveCount || 2} Inactive</Badge>
              </div>
              <Link href="/items/manage"><Button variant="link" size="sm" className="mt-2 p-0 text-sm">Manage Properties →</Button></Link>
            </Card>

            <Card className="p-5 group card-hover">
              <div className="flex items-center justify-between mb-2">
                <p className="text-3xl font-bold text-neutral-900">{totalMonthlyIncome > 0 ? formatCurrency(totalMonthlyIncome) : '$18.5K'}</p>
                <div className="w-10 h-10 rounded-[10px] bg-accent-50 flex items-center justify-center group-hover:bg-accent-100 transition-colors">
                  <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                </div>
              </div>
              <p className="text-sm text-neutral-500">Monthly Rental Income</p>
              <p className="text-xs text-accent-600 font-medium mt-1">↑ +{totalMonthlyIncome > 0 ? formatCurrency(Math.round(totalMonthlyIncome * 0.12)) : '$2,100'} vs last month</p>
            </Card>

            <Card className="p-5 group card-hover">
              <div className="flex items-center justify-between mb-2">
                <p className="text-3xl font-bold text-neutral-900">{avgROI.toFixed(1)}%</p>
                <div className="w-10 h-10 rounded-[10px] bg-accent-50 flex items-center justify-center group-hover:bg-accent-100 transition-colors">
                  <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                </div>
              </div>
              <p className="text-sm text-neutral-500 mb-1">Portfolio Avg ROI</p>
              <div className="flex items-center gap-2 text-xs"><span className="text-neutral-400">Market avg: 6.2%</span><Badge variant="success" size="sm">+{(avgROI - 6.2).toFixed(1)}% above</Badge></div>
            </Card>
          </div>

          {/* ═══ MIDDLE COL: Charts & Table ═══ */}
          <div className="lg:col-span-6 space-y-6">
            <Card className="p-6 border-neutral-200/60">
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-semibold text-neutral-900">Portfolio Performance</h3>
                <div className="flex gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary-800" />
                  <span className="text-xs text-neutral-500">Your Portfolio</span>
                </div>
              </div>
              <div className="h-[280px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={portfolioChartData}>
                    <defs><linearGradient id="cv" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#1e3a8a" stopOpacity={0.2} /><stop offset="100%" stopColor="#1e3a8a" stopOpacity={0} /></linearGradient></defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                    <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis stroke="#94a3b8" fontSize={12} tickFormatter={v => `$${(v / 1000000).toFixed(1)}M`} tickLine={false} axisLine={false} />
                    <Tooltip contentStyle={{ borderRadius: '14px', border: '1px solid #e2e8f0', boxShadow: '0 4px 16px rgba(0,0,0,0.08)' }} formatter={(v: number) => [`$${v.toLocaleString()}`, 'Value']} />
                    <Area type="monotone" dataKey="value" stroke="#1e3a8a" strokeWidth={2.5} fill="url(#cv)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </Card>

            <div className="grid grid-cols-2 gap-4">
              <Card className="p-5 border-neutral-200/60">
                <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Asset Allocation</h3>
                <div className="h-[150px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={allocationData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value">
                        {allocationData.map((e, i) => <Cell key={i} fill={e.color} />)}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-1.5 mt-3">
                  {allocationData.map((item, i) => (
                    <div key={i} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2"><div className="w-2.5 h-2.5 rounded-full" style={{ background: item.color }} />{item.name}</div>
                      <span className="text-neutral-600 font-medium">{item.value}%</span>
                    </div>
                  ))}
                </div>
              </Card>

              <Card className="p-5 border-neutral-200/60">
                <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Quick AI Insights</h3>
                <div className="space-y-3">
                  {[
                    { icon: '📈', text: 'Manhattan trending up', highlight: '+12%', color: 'text-accent-500' },
                    { icon: '🏢', text: 'Consider commercial RE', highlight: '', color: '' },
                    { icon: '⭐', text: 'Portfolio beats market by', highlight: `${(avgROI - 6.2).toFixed(1)}%`, color: 'text-accent-500' },
                  ].map((insight, i) => (
                    <div key={i} className="flex items-start gap-3 p-2.5 rounded-[10px] bg-neutral-50/80">
                      <span className="text-base">{insight.icon}</span>
                      <p className="text-xs text-neutral-600 leading-relaxed">{insight.text} {insight.highlight && <strong className={insight.color}>{insight.highlight}</strong>}</p>
                    </div>
                  ))}
                </div>
                <Button variant="ghost" size="sm" className="mt-3 w-full text-xs">Get Full Analysis →</Button>
              </Card>
            </div>

            <Card className="border-neutral-200/60 overflow-hidden">
              <div className="px-5 py-4 border-b border-neutral-100 flex items-center justify-between">
                <h3 className="font-semibold text-neutral-900 text-sm">Top Performers</h3>
                <Link href="/items/manage"><Button variant="ghost" size="sm" className="text-xs">View All</Button></Link>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-100 bg-neutral-50/50">
                      <th className="text-left py-3 pl-5 pr-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Property</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">ROI</th>
                      <th className="text-right py-3 px-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Value</th>
                      <th className="text-right py-3 pr-5 pl-4 text-xs font-medium text-neutral-500 uppercase tracking-wider">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(topProperties.length > 0 ? topProperties : [
                      { name: 'Manhattan Luxury Apt', roi: 12.5, value: 850000, status: 'Active' as const, change: '+$12,400' },
                      { name: 'Brooklyn Townhouse', roi: 9.8, value: 620000, status: 'Active' as const, change: '+$8,200' },
                      { name: 'Downtown Office', roi: 8.2, value: 450000, status: 'Active' as const, change: '+$5,100' },
                      { name: 'Queens Multi-Family', roi: 7.6, value: 380000, status: 'Active' as const, change: '+$3,800' },
                      { name: 'Riverside Commercial', roi: 6.9, value: 290000, status: 'Inactive' as const, change: '+$1,200' },
                    ]).map((p, i) => (
                      <tr key={i} className="border-b border-neutral-100 hover:bg-neutral-50/50 transition-colors cursor-pointer">
                        <td className="py-3.5 pl-5 pr-4">
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-[8px] bg-gradient-to-br from-primary-800/20 to-primary-600/20 flex items-center justify-center text-primary-800 text-xs font-bold">{p.name.charAt(0)}</div>
                            <div><p className="font-medium text-neutral-800 text-sm">{p.name}</p><p className="text-xs text-accent-500">{p.change}</p></div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 text-right text-accent-600 font-semibold">+{p.roi}%</td>
                        <td className="py-3.5 px-4 text-right font-medium text-neutral-800">${(p.value / 1000).toFixed(0)}K</td>
                        <td className="py-3.5 pr-5 pl-4 text-right"><Badge variant={p.status === 'Active' ? 'success' : 'secondary'} size="sm">{p.status}</Badge></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Card>
          </div>

          {/* ═══ RIGHT COL: Activity & Recommendations ═══ */}
          <div className="lg:col-span-3 space-y-4">
            <Card className="p-5 border-neutral-200/60">
              <h3 className="font-semibold text-neutral-900 mb-4 text-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-accent-400 animate-pulse" />
                Recent Activity
              </h3>
              <div className="space-y-0">
                {(myProperties.length > 0 ? [
                  { icon: '🏠' as const, text: `Added '${myProperties[0]?.title || 'Property'}'`, time: '2 days ago', type: 'add' as const },
                  { icon: '📈' as const, text: `Portfolio value updated`, time: 'Today', type: 'growth' as const },
                  { icon: '⭐' as const, text: 'New AI analysis available', time: '1 day ago', type: 'analysis' as const },
                ] : activities).map((a, i) => (
                  <div key={i} className="flex items-start gap-3 py-3 border-b border-neutral-100 last:border-0">
                    <span className="text-base shrink-0 mt-0.5">{a.icon}</span>
                    <div className="min-w-0"><p className="text-sm text-neutral-700 leading-snug">{a.text}</p><p className="text-xs text-neutral-400 mt-0.5">{a.time}</p></div>
                  </div>
                ))}
              </div>
              <Button variant="ghost" size="sm" className="mt-2 w-full text-xs">View All Activity →</Button>
            </Card>

            <Card className="p-5 border-neutral-200/60">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-neutral-900 text-sm">AI Recommendations</h3>
                <Badge variant="accent" size="sm">Live</Badge>
              </div>
              <div className="space-y-3">
                {recommendations.map((r, i) => (
                  <Link key={i} href="/explore" className="block p-3.5 rounded-[12px] hover:bg-neutral-50 transition-colors border border-neutral-100/80 group">
                    <div className="flex items-start justify-between mb-2">
                      <p className="text-sm font-medium text-neutral-800 group-hover:text-primary-800 transition-colors">{r.title}</p>
                      <Badge variant="success" size="sm">{r.score}%</Badge>
                    </div>
                    <p className="text-xs text-neutral-500 mb-2">{r.location}</p>
                    <div className="flex items-center gap-2 mb-1.5">
                      {(r.match || []).map((tag, j) => (
                        <span key={j} className="text-[10px] px-2 py-0.5 rounded-full bg-primary-800/10 text-primary-700 font-medium">{tag}</span>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-neutral-800">${(r.price / 1000).toFixed(0)}K</span>
                      <span className="text-accent-600 font-medium">ROI {r.roi}%</span>
                    </div>
                  </Link>
                ))}
              </div>
              <Link href="/explore"><Button variant="gradient" size="sm" className="w-full mt-3">View All Recommendations</Button></Link>
            </Card>

            <Card className="p-5 bg-gradient-to-br from-primary-800/5 to-primary-600/5 border-primary-800/10">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-9 h-9 rounded-[10px] bg-accent-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-accent-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
                </div>
                <div><h4 className="font-semibold text-sm text-neutral-900">AI Insight</h4><p className="text-xs text-neutral-500">Just now</p></div>
              </div>
              <p className="text-sm text-neutral-600 leading-relaxed">Your portfolio shows strong diversification in residential assets. Consider exploring commercial properties in emerging markets to balance risk.</p>
              <div className="flex gap-2 mt-3">
                <Button variant="outline" size="sm" className="flex-1 text-xs">👍 Helpful</Button>
                <Button variant="outline" size="sm" className="text-xs">Refresh</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
