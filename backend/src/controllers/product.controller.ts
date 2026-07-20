import { Request, Response, NextFunction } from 'express';
import { Product } from '../models/Product';

const FAKESTORE_API = 'https://fakestoreapi.com/products';

interface FakeStoreProduct {
  id: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

interface ProductDoc {
  _id: string;
  id?: number;
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: { rate: number; count: number };
}

let cachedProducts: (FakeStoreProduct & { _id: string })[] | null = null;
let lastFetch = 0;
const CACHE_TTL = 10 * 60 * 1000;

async function fetchFromFakeStore(): Promise<(FakeStoreProduct & { _id: string })[]> {
  const now = Date.now();
  if (cachedProducts && now - lastFetch < CACHE_TTL) return cachedProducts;
  try {
    const res = await fetch(FAKESTORE_API, {
      headers: { 'User-Agent': 'InvestProp-AI/1.0', 'Accept': 'application/json' },
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json() as FakeStoreProduct[];
    cachedProducts = data.map(p => ({ ...p, _id: String(p.id) }));
    lastFetch = now;
    return cachedProducts;
  } catch {
    return cachedProducts || [];
  }
}

async function getProductsFromDB(
  filter: Record<string, unknown>,
  sortOption: Record<string, 1 | -1>,
  skip: number,
  limitNum: number
): Promise<{ products: ProductDoc[]; total: number } | null> {
  try {
    const [docs, total] = await Promise.all([
      Product.find(filter).sort(sortOption).skip(skip).limit(limitNum),
      Product.countDocuments(filter),
    ]);
    if (docs.length > 0) {
      const products: ProductDoc[] = docs.map(d => ({ ...d.toObject(), _id: d._id.toString() }));
      return { products, total };
    }
    return null;
  } catch {
    return null;
  }
}

async function getApiProducts(
  category?: string,
  search?: string,
  minPrice?: string,
  maxPrice?: string,
  sort?: string,
  pageNum: number = 1,
  limitNum: number = 12
) {
  const apiProducts = await fetchFromFakeStore();
  let filtered: (FakeStoreProduct & { _id: string })[] = [...apiProducts];

  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q));
  }
  if (category) filtered = filtered.filter(p => p.category === category);
  if (minPrice) filtered = filtered.filter(p => p.price >= Number(minPrice));
  if (maxPrice) filtered = filtered.filter(p => p.price <= Number(maxPrice));

  switch (sort) {
    case 'priceLow': filtered.sort((a, b) => a.price - b.price); break;
    case 'priceHigh': filtered.sort((a, b) => b.price - a.price); break;
    case 'rating': filtered.sort((a, b) => b.rating.rate - a.rating.rate); break;
    case 'popular': filtered.sort((a, b) => b.rating.count - a.rating.count); break;
    default: break;
  }

  const total = filtered.length;
  const start = (pageNum - 1) * limitNum;
  const paginated = filtered.slice(start, start + limitNum);

  return { products: paginated, total };
}

async function getSingleApiProduct(id: string): Promise<ProductDoc | undefined> {
  const numId = Number(id);
  const products = await fetchFromFakeStore();
  const p = products.find(x => x.id === numId);
  return p ? { ...p, _id: p._id } : undefined;
}

export const getProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { category, sort, search, page = '1', limit = '12', minPrice, maxPrice } = req.query;

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    // Try MongoDB first
    const filter: Record<string, unknown> = {};
    if (search) {
      filter.$or = [
        { title: { $regex: search as string, $options: 'i' } },
        { description: { $regex: search as string, $options: 'i' } },
      ];
    }
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) (filter.price as Record<string, number>).$gte = Number(minPrice);
      if (maxPrice) (filter.price as Record<string, number>).$lte = Number(maxPrice);
    }

    let sortOption: Record<string, 1 | -1> = { _id: 1 };
    switch (sort) {
      case 'priceLow': sortOption = { price: 1 }; break;
      case 'priceHigh': sortOption = { price: -1 }; break;
      case 'rating': sortOption = { 'rating.rate': -1 }; break;
      case 'popular': sortOption = { 'rating.count': -1 }; break;
      default: break;
    }

    const dbResult = await getProductsFromDB(filter, sortOption, skip, limitNum);

    if (dbResult) {
      res.json({
        success: true,
        data: {
          products: dbResult.products,
          pagination: { total: dbResult.total, page: pageNum, limit: limitNum, totalPages: Math.ceil(dbResult.total / limitNum) },
        },
      });
      return;
    }

    // Fall back to live FakeStore API
    const apiResult = await getApiProducts(
      category as string | undefined,
      search as string | undefined,
      minPrice as string | undefined,
      maxPrice as string | undefined,
      sort as string | undefined,
      pageNum,
      limitNum
    );

    res.json({
      success: true,
      data: {
        products: apiResult.products,
        pagination: {
          total: apiResult.total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(apiResult.total / limitNum),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Try MongoDB first
    try {
      const doc = await Product.findById(req.params.id);
      if (doc) {
        const product: ProductDoc = { ...doc.toObject(), _id: doc._id.toString() };
        res.json({ success: true, data: product });
        return;
      }
    } catch {
      // MongoDB failed, fall through
    }

    // Fall back to live FakeStore API
    const p = await getSingleApiProduct(req.params.id);
    if (p) {
      res.json({ success: true, data: p });
      return;
    }

    res.status(404).json({ success: false, message: 'Product not found' });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    try {
      const categories = await Product.distinct('category');
      if (categories.length > 0) {
        res.json({ success: true, data: categories });
        return;
      }
    } catch {
      // MongoDB failed, fall through
    }

    // Fall back to live FakeStore API
    const apiProducts = await fetchFromFakeStore();
    const cats = [...new Set(apiProducts.map(p => p.category))];
    res.json({ success: true, data: cats });
  } catch (error) {
    next(error);
  }
};
