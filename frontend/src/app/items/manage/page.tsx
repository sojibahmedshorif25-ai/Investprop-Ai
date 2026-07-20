'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { api } from '@/lib/api';

interface ManageProperty {
  _id: string;
  title: string;
  shortDescription: string;
  address: string;
  location: { city: string; state: string };
  price: number;
  status: string;
  views: number;
  type: string;
  images?: string[];
}

const mockProperties: ManageProperty[] = [
  { _id: '1', title: 'Modern 3BR Apartment in Manhattan', shortDescription: 'Newly renovated with premium finishes', address: '123 Broadway', location: { city: 'New York', state: 'NY' }, price: 450000, status: 'active', views: 234, type: 'apartment', images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&q=80'] },
  { _id: '2', title: 'Luxury Commercial Space Brooklyn', shortDescription: 'Prime commercial location', address: '456 Atlantic Ave', location: { city: 'Brooklyn', state: 'NY' }, price: 680000, status: 'active', views: 189, type: 'commercial', images: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=400&q=80'] },
  { _id: '3', title: 'Charming 2BR Townhouse', shortDescription: 'Historic with modern upgrades', address: '789 Elm St', location: { city: 'Austin', state: 'TX' }, price: 320000, status: 'active', views: 156, type: 'house', images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=400&q=80'] },
  { _id: '4', title: 'Waterfront Multi-Family', shortDescription: '4-unit with waterfront views', address: '101 Shore Dr', location: { city: 'Miami', state: 'FL' }, price: 890000, status: 'active', views: 312, type: 'multifamily', images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=400&q=80'] },
  { _id: '5', title: 'Vacant Land - Development', shortDescription: 'Prime development land', address: '2020 Oak Rd', location: { city: 'Denver', state: 'CO' }, price: 250000, status: 'active', views: 98, type: 'land', images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=400&q=80'] },
];

export default function ManagePropertiesPage() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (!token) { router.push('/login'); return; }
  }, [router]);

  const [properties, setProperties] = useState<ManageProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    api.get<{ properties: ManageProperty[] }>('/properties')
      .then(d => { if (d.properties?.length) setProperties(d.properties); })
      .catch(() => setProperties(mockProperties))
      .finally(() => setLoading(false));
  }, []);

  const filteredProperties = properties.filter(p => {
    if (filter !== 'all' && p.status !== filter) return false;
    if (search && !p.title.toLowerCase().includes(search.toLowerCase()) && !p.location.city.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = filteredProperties.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    try {
      await api.delete(`/properties/${deleteConfirm}`);
    } catch { /* keep going */ }
    setProperties(p => p.filter(prop => prop._id !== deleteConfirm));
    setDeleteConfirm(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active': return <Badge variant="success" size="sm">Active</Badge>;
      case 'inactive': return <Badge variant="secondary" size="sm">Inactive</Badge>;
      case 'sold': return <Badge variant="default" size="sm">Sold</Badge>;
      default: return <Badge size="sm">{status}</Badge>;
    }
  };

  if (loading) {
    return (
      <div className="pt-24 pb-12">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-8 skeleton rounded w-48 mb-2" />
          <div className="h-4 skeleton rounded w-72 mb-8" />
          <div className="rounded-[16px] border border-neutral-200/50 p-4 space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-12 h-12 skeleton rounded-[8px]" />
                <div className="flex-1 space-y-2"><div className="h-4 skeleton rounded w-3/4" /><div className="h-3 skeleton rounded w-1/3" /></div>
                <div className="h-4 skeleton rounded w-20" />
                <div className="h-5 skeleton rounded w-16" />
                <div className="h-4 skeleton rounded w-12" />
                <div className="flex gap-1"><div className="w-8 h-8 skeleton rounded-[8px]" /><div className="w-8 h-8 skeleton rounded-[8px]" /></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-12">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-primary-800 mb-1">My Properties</h1>
            <p className="text-sm text-neutral-500">Manage your listings and track performance</p>
          </div>
          <Link href="/items/add"><Button>+ Add New Property</Button></Link>
        </div>

        <Card className="mb-6">
          <div className="p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-200">
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by property name..." className="h-10 w-64 pl-9 pr-3 rounded-[12px] border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-800/20" />
              </div>
              <select value={filter} onChange={e => setFilter(e.target.value)} className="h-10 px-3 rounded-[12px] border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-800/20">
                <option value="all">All Properties</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="sold">Sold</option>
              </select>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex rounded-[12px] border border-neutral-300 overflow-hidden">
                <button onClick={() => setViewMode('table')} className={`p-2 ${viewMode === 'table' ? 'bg-primary-800 text-white' : 'text-neutral-400'}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 13h2v-2H3v2zm0 4h2v-2H3v2zm0-8h2V7H3v2zm4 4h14v-2H7v2zm0 4h14v-2H7v2zM7 7v2h14V7H7z" /></svg>
                </button>
                <button onClick={() => setViewMode('grid')} className={`p-2 ${viewMode === 'grid' ? 'bg-primary-800 text-white' : 'text-neutral-400'}`}>
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M3 3h7v7H3zm0 11h7v7H3zm11-11h7v7h-7zm0 11h7v7h-7z" /></svg>
                </button>
              </div>
            </div>
          </div>

          {viewMode === 'table' ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-neutral-200 bg-neutral-50">
                    <th className="text-left py-3 px-4 text-neutral-500 font-medium">Property</th>
                    <th className="text-left py-3 px-4 text-neutral-500 font-medium">Location</th>
                    <th className="text-right py-3 px-4 text-neutral-500 font-medium">Price</th>
                    <th className="text-center py-3 px-4 text-neutral-500 font-medium">Status</th>
                    <th className="text-center py-3 px-4 text-neutral-500 font-medium">Views</th>
                    <th className="text-right py-3 px-4 text-neutral-500 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProperties.map(p => (
                    <tr key={p._id} className="border-b border-neutral-100 hover:bg-neutral-50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-[8px] overflow-hidden shrink-0">
                            {p.images?.[0] ? (
                              <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                            ) : (
                              <div className="w-full h-full bg-gradient-to-br from-primary-800/40 to-primary-900/40 flex items-center justify-center">
                                <svg className="w-5 h-5 text-primary-800/50" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                              </div>
                            )}
                          </div>
                          <div><p className="font-medium text-neutral-800">{p.title}</p><p className="text-xs text-neutral-400">{p.shortDescription}</p></div>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-neutral-600">{p.location.city}, {p.location.state}</td>
                      <td className="py-3 px-4 text-right font-medium text-neutral-800">{formatCurrency(p.price)}</td>
                      <td className="py-3 px-4 text-center">{getStatusBadge(p.status)}</td>
                      <td className="py-3 px-4 text-center text-neutral-500">{p.views}</td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Link href={`/properties/${p._id}`}><button className="p-1.5 rounded-[8px] hover:bg-neutral-100 text-neutral-400 hover:text-primary-800 transition-colors" title="View">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 2v6h6" /></svg>
                          </button></Link>
                          <button onClick={() => setDeleteConfirm(p._id)} className="p-1.5 rounded-[8px] hover:bg-red-50 text-neutral-400 hover:text-red-500 transition-colors" title="Delete">
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {paginatedProperties.length === 0 && (
                <div className="text-center py-12">
                  <svg className="w-12 h-12 text-neutral-300 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  <p className="text-neutral-500 font-medium">No properties found</p>
                  <p className="text-sm text-neutral-400 mb-4">Try adjusting your search or filter</p>
                  <Link href="/items/add"><Button size="sm">+ Add Your First Property</Button></Link>
                </div>
              )}
            </div>
          ) : (
            <div className="p-4 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {paginatedProperties.map(p => (
                <Card key={p._id} className="overflow-hidden">
                  <div className="h-[140px] overflow-hidden relative">
                    {p.images?.[0] ? (
                      <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-800/40 to-primary-900/40 flex items-center justify-center">
                        <svg className="w-10 h-10 text-white/30" fill="currentColor" viewBox="0 0 24 24"><path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" /></svg>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">{getStatusBadge(p.status)}</div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-neutral-800 text-sm mb-1">{p.title}</h3>
                    <p className="text-xs text-neutral-500 mb-2">{p.location.city}, {p.location.state}</p>
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-bold text-primary-800">{formatCurrency(p.price)}</span>
                      <span className="text-xs text-neutral-500">{p.views} views</span>
                    </div>
                    <div className="flex gap-2">
                      <Link href={`/properties/${p._id}`} className="flex-1"><Button variant="outline" size="sm" className="w-full">View</Button></Link>
                      <Button variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50" onClick={() => setDeleteConfirm(p._id)}>Delete</Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <div className="p-4 border-t border-neutral-200 flex items-center justify-between">
            <p className="text-sm text-neutral-500">Showing {paginatedProperties.length} of {filteredProperties.length} properties</p>
            <div className="flex items-center gap-2">
              <button disabled={currentPage === 1} onClick={() => setCurrentPage(currentPage - 1)} className="px-3 py-1.5 rounded-[8px] text-sm border border-neutral-300 hover:bg-neutral-50 disabled:opacity-50">Previous</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)} className={`w-8 h-8 rounded-[8px] text-sm font-medium ${currentPage === p ? 'bg-primary-800 text-white' : 'border border-neutral-300 text-neutral-600 hover:bg-neutral-50'}`}>{p}</button>
              ))}
              <button disabled={currentPage === totalPages} onClick={() => setCurrentPage(currentPage + 1)} className="px-3 py-1.5 rounded-[8px] text-sm border border-neutral-300 hover:bg-neutral-50 disabled:opacity-50">Next</button>
            </div>
          </div>
        </Card>
      </div>

      {deleteConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <Card className="p-6 max-w-[420px] w-full mx-4">
            <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-center text-neutral-800 mb-2">Delete Property?</h3>
            <p className="text-sm text-center text-neutral-500 mb-6">Are you sure you want to delete this property? This action cannot be undone.</p>
            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancel</Button>
              <Button variant="destructive" className="flex-1" onClick={handleDelete}>Delete</Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  );
}
