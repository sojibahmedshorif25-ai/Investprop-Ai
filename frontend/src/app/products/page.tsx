'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { api } from '@/lib/api';
import { ImageWithFallback } from '@/components/ImageWithFallback';

interface Product {
  _id: string;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

interface ProductsData {
  products: Product[];
  pagination: { total: number; page: number; limit: number; totalPages: number };
}

const categories = ['all', "men's clothing", "women's clothing", 'jewelery', 'electronics'];

const mockProducts: Product[] = [
  { _id: 'mock-1', title: 'Slim Fit Cotton T-Shirt', price: 29.99, description: 'Premium cotton slim fit t-shirt', category: "men's clothing", image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg', rating: { rate: 4.5, count: 120 } },
  { _id: 'mock-2', title: 'Casual Denim Jacket', price: 89.99, description: 'Classic denim jacket for everyday wear', category: "men's clothing", image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg', rating: { rate: 4.3, count: 85 } },
  { _id: 'mock-3', title: 'Women Printed Summer Dress', price: 49.99, description: 'Lightweight floral summer dress', category: "women's clothing", image: 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg', rating: { rate: 4.6, count: 210 } },
  { _id: 'mock-4', title: 'Gold Plated Necklace Set', price: 159.99, description: 'Elegant gold plated jewelry set', category: 'jewelery', image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg', rating: { rate: 4.8, count: 56 } },
  { _id: 'mock-5', title: 'Wireless Bluetooth Headphones', price: 79.99, description: 'Noise cancelling Bluetooth 5.0 headphones', category: 'electronics', image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg', rating: { rate: 4.4, count: 340 } },
  { _id: 'mock-6', title: 'Running Shoes Ultra Light', price: 119.99, description: 'Lightweight mesh running shoes', category: "men's clothing", image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg', rating: { rate: 4.2, count: 190 } },
  { _id: 'mock-7', title: 'Leather Crossbody Bag', price: 69.99, description: 'Genuine leather crossbody handbag', category: "women's clothing", image: 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg', rating: { rate: 4.7, count: 98 } },
  { _id: 'mock-8', title: 'Smart Watch Pro Series', price: 249.99, description: 'Fitness tracker with heart rate monitor', category: 'electronics', image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg', rating: { rate: 4.1, count: 430 } },
  { _id: 'mock-9', title: 'Silver Ring with Cubic Zirconia', price: 39.99, description: 'Sterling silver ring with clear stone', category: 'jewelery', image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg', rating: { rate: 4.5, count: 72 } },
  { _id: 'mock-10', title: 'Laptop Stand Adjustable', price: 34.99, description: 'Ergonomic aluminum laptop stand', category: 'electronics', image: 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg', rating: { rate: 4.3, count: 210 } },
];

function StarRating({ rate }: { rate: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg key={star} className={`w-3.5 h-3.5 ${star <= Math.round(rate) ? 'text-accent-500 fill-accent-500' : 'text-neutral-300 fill-neutral-300'}`} viewBox="0 0 20 20">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-xs text-neutral-500">({rate})</span>
    </div>
  );
}

export default function ProductsPage() {
  const [data, setData] = useState<ProductsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const perPage = 8;
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    setLoading(true);
    const params: Record<string, string | number> = { limit: perPage, page };
    if (search) params.search = search;
    if (category !== 'all') params.category = category;
    if (sort) params.sort = sort;
    api.get<ProductsData>('/products', params)
      .then(setData)
      .catch(() => {
        const filtered = mockProducts.filter(p => {
          if (search && !p.title.toLowerCase().includes(search.toLowerCase())) return false;
          if (category !== 'all' && p.category !== category) return false;
          return true;
        }).sort((a, b) => {
          if (sort === 'priceLow') return a.price - b.price;
          if (sort === 'priceHigh') return b.price - a.price;
          if (sort === 'rating') return b.rating.rate - a.rating.rate;
          if (sort === 'popular') return b.rating.count - a.rating.count;
          return 0;
        });
        const start = (page - 1) * perPage;
        setData({
          products: filtered.slice(start, start + perPage),
          pagination: { total: filtered.length, page, limit: perPage, totalPages: Math.ceil(filtered.length / perPage) },
        });
      })
      .finally(() => setLoading(false));
  }, [mounted, search, category, sort, page]);

  return (
    <div className="pt-20 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary-800/5 border border-primary-800/10 mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-800" />
            <span className="text-xs font-semibold text-primary-800 uppercase tracking-wider">Product Catalog</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-3 tracking-tight">Browse Our <span className="text-gradient">Products</span></h1>
          <p className="text-neutral-500 max-w-xl mx-auto">{data ? data.pagination.total : '...'} products available</p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            <input value={search} onChange={e => { setSearch(e.target.value); setPage(1); }} placeholder="Search products..." className="w-full h-11 pl-10 pr-4 rounded-[12px] border border-neutral-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary-800/20 focus:border-primary-800/50 transition-all" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {categories.map(cat => (
              <button key={cat} onClick={() => { setCategory(cat); setPage(1); }}
                className={`px-4 py-2 rounded-[10px] text-sm font-medium transition-all ${category === cat ? 'bg-primary-800 text-white shadow-soft' : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'}`}>
                {cat === 'all' ? 'All' : cat.replace("'", "'")}
              </button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} className="h-11 px-3 rounded-[12px] border border-neutral-200 bg-white/80 text-sm focus:outline-none focus:ring-2 focus:ring-primary-800/20">
            <option value="">Default</option>
            <option value="priceLow">Price: Low → High</option>
            <option value="priceHigh">Price: High → Low</option>
            <option value="rating">Highest Rated</option>
            <option value="popular">Most Popular</option>
          </select>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-[16px] border border-neutral-200/50 overflow-hidden">
                <div className="h-[220px] skeleton" />
                <div className="p-4 space-y-3">
                  <div className="h-4 skeleton rounded w-3/4" />
                  <div className="h-3 skeleton rounded w-1/2" />
                  <div className="h-6 skeleton rounded w-1/3" />
                </div>
              </div>
            ))}
          </div>
        ) : data && data.products.length === 0 ? (
          <div className="text-center py-24">
            <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-800 mb-1">No products found</h3>
            <p className="text-sm text-neutral-500">Try a different search or category</p>
          </div>
        ) : data ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {data.products.map((product, idx) => (
              <Link key={product._id} href={`/products/${product._id}`} style={{ animationDelay: `${idx * 50}ms` }} className="animate-fade-in-up opacity-0 [animation-fill-mode:forwards]">
                <Card hover className="group h-full flex flex-col border-neutral-200/50 overflow-hidden relative z-10">
                  <div className="h-[240px] bg-white flex items-center justify-center p-6 relative overflow-hidden">
                    <ImageWithFallback src={product.image} alt={product.title} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    <Badge variant="premium" size="sm" className="absolute top-3 left-3">{product.category}</Badge>
                  </div>
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="text-sm font-semibold text-neutral-900 leading-snug mb-1.5 line-clamp-2 group-hover:text-primary-800 transition-colors">{product.title}</h3>
                    <StarRating rate={product.rating.rate} />
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <span className="text-xl font-bold text-primary-800 group-hover:scale-105 transition-transform inline-block">${product.price.toFixed(2)}</span>
                      <span className="text-xs text-neutral-400">({product.rating.count} reviews)</span>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        ) : null}

        {data && data.pagination.totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="h-9 px-3.5 rounded-[10px] text-sm border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 transition-colors bg-white/80">← Prev</button>
            {Array.from({ length: Math.min(data.pagination.totalPages, 5) }, (_, i) => {
              let p = data.pagination.totalPages <= 5 ? i + 1 : page <= 3 ? i + 1 : page >= data.pagination.totalPages - 2 ? data.pagination.totalPages - 4 + i : page - 2 + i;
              return <button key={p} onClick={() => setPage(p)} className={`w-9 h-9 rounded-[10px] text-sm font-medium transition-all ${page === p ? 'bg-primary-800 text-white shadow-soft' : 'border border-neutral-200 text-neutral-600 hover:bg-neutral-50 bg-white/80'}`}>{p}</button>;
            })}
            <button disabled={page === data.pagination.totalPages} onClick={() => setPage(page + 1)} className="h-9 px-3.5 rounded-[10px] text-sm border border-neutral-200 hover:bg-neutral-50 disabled:opacity-50 transition-colors bg-white/80">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
