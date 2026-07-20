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

const mockProducts: Product[] = [
  { _id: 'mock-1', title: 'Slim Fit Cotton T-Shirt', price: 29.99, description: 'Premium cotton slim fit t-shirt. Features a classic crew neck, short sleeves, and a comfortable slim fit. Made from 100% premium ring-spun cotton for all-day comfort. Machine washable.', category: "men's clothing", image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg', rating: { rate: 4.5, count: 120 } },
  { _id: 'mock-2', title: 'Casual Denim Jacket', price: 89.99, description: 'Classic denim jacket for everyday wear. Features button front closure, chest pockets, and adjustable waist tabs. Made from durable 100% cotton denim.', category: "men's clothing", image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg', rating: { rate: 4.3, count: 85 } },
  { _id: 'mock-3', title: 'Women Printed Summer Dress', price: 49.99, description: 'Lightweight floral summer dress with a flattering A-line silhouette. Features adjustable spaghetti straps, a smocked elastic back, and a flowy hemline. Perfect for warm weather.', category: "women's clothing", image: 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg', rating: { rate: 4.6, count: 210 } },
  { _id: 'mock-4', title: 'Gold Plated Necklace Set', price: 159.99, description: 'Elegant gold plated jewelry set including a 18" necklace and matching earrings. Features a delicate chain with a sparkling cubic zirconia pendant. Hypoallergenic and tarnish-resistant.', category: 'jewelery', image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg', rating: { rate: 4.8, count: 56 } },
  { _id: 'mock-5', title: 'Wireless Bluetooth Headphones', price: 79.99, description: 'Premium noise cancelling Bluetooth 5.0 headphones with 30-hour battery life. Features comfortable over-ear design, built-in microphone, and foldable storage case. Compatible with all devices.', category: 'electronics', image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg', rating: { rate: 4.4, count: 340 } },
  { _id: 'mock-6', title: 'Running Shoes Ultra Light', price: 119.99, description: 'Lightweight mesh running shoes with responsive cushioning. Features breathable upper, shock-absorbing sole, and reflective details for visibility. Ideal for road running and gym workouts.', category: "men's clothing", image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg', rating: { rate: 4.2, count: 190 } },
  { _id: 'mock-7', title: 'Leather Crossbody Bag', price: 69.99, description: 'Genuine leather crossbody handbag with adjustable strap. Features multiple interior pockets, magnetic snap closure, and gold-tone hardware. Compact yet spacious enough for daily essentials.', category: "women's clothing", image: 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg', rating: { rate: 4.7, count: 98 } },
  { _id: 'mock-8', title: 'Smart Watch Pro Series', price: 249.99, description: 'Advanced fitness smartwatch with heart rate monitoring, GPS tracking, and sleep analysis. Features a vibrant AMOLED display, 7-day battery life, and water resistance to 50 meters.', category: 'electronics', image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg', rating: { rate: 4.1, count: 430 } },
  { _id: 'mock-9', title: 'Silver Ring with Cubic Zirconia', price: 39.99, description: 'Sterling silver ring featuring a brilliant round cubic zirconia stone. Crafted in 925 sterling silver with a high-polish finish. Comfort-fit band design for all-day wear.', category: 'jewelery', image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg', rating: { rate: 4.5, count: 72 } },
  { _id: 'mock-10', title: 'Laptop Stand Adjustable', price: 34.99, description: 'Ergonomic aluminum laptop stand with 6 adjustable height angles. Features ventilated design to prevent overheating, foldable for portability, and non-slip silicone pads. Supports laptops up to 17".', category: 'electronics', image: 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg', rating: { rate: 4.3, count: 210 } },
];

export default function ProductDetailsPage({ params }: { params: { id: string } }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [related, setRelated] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    api.get<Product>(`/products/${params.id}`)
      .then(async (p) => {
        setProduct(p);
        const rel = await api.get<ProductsData>('/products', { category: p.category, limit: 4 });
        setRelated(rel.products.filter(r => r._id !== p._id).slice(0, 4));
      })
      .catch(() => {
        const found = mockProducts.find(p => p._id === params.id);
        setProduct(found || null);
        if (found) {
          setRelated(mockProducts.filter(r => r._id !== found._id && r.category === found.category).slice(0, 4));
        }
      })
      .finally(() => setLoading(false));
  }, [params.id]);

  if (loading) {
    return (
      <div className="pt-24 pb-16">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10">
            <div className="aspect-square skeleton rounded-[20px]" />
            <div className="space-y-4">
              <div className="h-8 skeleton rounded w-3/4" />
              <div className="h-4 skeleton rounded w-1/4" />
              <div className="h-10 skeleton rounded w-1/3" />
              <div className="h-24 skeleton rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="pt-24 pb-12 text-center">
        <h2 className="text-2xl font-bold text-neutral-800">Product not found</h2>
        <Link href="/products"><Button variant="outline" className="mt-4">Back to Products</Button></Link>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 text-sm text-neutral-500 mb-8 animate-fade-in">
          <Link href="/" className="hover:text-primary-800 transition-colors">Home</Link>
          <span className="text-neutral-300">/</span>
          <Link href="/products" className="hover:text-primary-800 transition-colors">Products</Link>
          <span className="text-neutral-300">/</span>
          <span className="text-neutral-800 font-medium truncate max-w-[200px]">{product.title}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-10 animate-fade-in-up">
          <div className="relative">
            <div className="sticky top-24 aspect-square bg-white rounded-[20px] border border-neutral-200/60 flex items-center justify-center p-12 shadow-soft group hover:shadow-medium transition-shadow duration-300">
              <ImageWithFallback src={product.image} alt={product.title} className="max-h-full max-w-full object-contain transition-all duration-500 group-hover:scale-110" />
              <Badge variant="premium" size="sm" className="absolute top-4 left-4">{product.category}</Badge>
            </div>
          </div>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-4 leading-tight">{product.title}</h1>

            <div className="flex items-center gap-4 mb-6">
              <div className="flex">
                {[1, 2, 3, 4, 5].map(star => (
                  <svg key={star} className={`w-5 h-5 ${star <= Math.round(product.rating.rate) ? 'text-accent-500 fill-accent-500' : 'text-neutral-300 fill-neutral-300'}`} viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm text-neutral-500">{product.rating.rate} ({product.rating.count.toLocaleString()} reviews)</span>
            </div>

            <div className="text-4xl font-bold text-primary-800 mb-6 animate-fade-in-up">${product.price.toFixed(2)}</div>
            <p className="text-neutral-600 leading-relaxed mb-8 text-pretty">{product.description}</p>

            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <Button variant="gradient" size="xl" className="flex-1">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>
                Add to Cart
              </Button>
              <Button variant="outline" size="xl">
                <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                Wishlist
              </Button>
            </div>

            <Card className="p-5 border-neutral-200/60 hover:shadow-soft transition-shadow">
              <h3 className="font-semibold text-neutral-900 mb-4 text-sm">Product Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div><span className="text-neutral-500">Category</span><p className="font-medium text-neutral-800 capitalize">{product.category}</p></div>
                <div><span className="text-neutral-500">Rating</span><p className="font-medium text-neutral-800">{product.rating.rate} / 5.0</p></div>
                <div><span className="text-neutral-500">Total Reviews</span><p className="font-medium text-neutral-800">{product.rating.count.toLocaleString()}</p></div>
              </div>
            </Card>
          </div>
        </div>

        {related.length > 0 && (
          <div className="mt-16 animate-fade-in-up">
            <h2 className="text-xl font-bold text-neutral-900 mb-6">Related Products</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {related.map((rp, i) => (
                <Link key={rp._id} href={`/products/${rp._id}`} style={{ animationDelay: `${i * 80}ms` }} className="animate-fade-in-up opacity-0 [animation-fill-mode:forwards]">
                  <Card hover className="group border-neutral-200/50 overflow-hidden relative z-10">
                    <div className="h-[180px] bg-white flex items-center justify-center p-4">
                      <ImageWithFallback src={rp.image} alt={rp.title} className="max-h-full max-w-full object-contain group-hover:scale-110 transition-transform duration-500" />
                    </div>
                    <div className="p-3">
                      <h4 className="text-xs font-medium text-neutral-800 line-clamp-2 mb-1 group-hover:text-primary-800 transition-colors">{rp.title}</h4>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-primary-800 text-sm">${rp.price.toFixed(2)}</span>
                        <span className="text-xs text-neutral-400">★ {rp.rating.rate}</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
