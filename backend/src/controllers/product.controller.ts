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

const FALLBACK_PRODUCTS: FakeStoreProduct[] = [
  { id: 1, title: 'Fjallraven Foldsack Backpack', price: 109.95, description: 'Your perfect pack for everyday use and walks in the forest.', category: "men's clothing", image: 'https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg', rating: { rate: 3.9, count: 120 } },
  { id: 2, title: 'Mens Casual Premium Slim Fit T-Shirts', price: 22.3, description: 'Slim-fitting style, contrast raglan long sleeve henley placket.', category: "men's clothing", image: 'https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg', rating: { rate: 4.1, count: 259 } },
  { id: 3, title: 'Mens Cotton Jacket', price: 55.99, description: 'Great outerwear jackets for Spring/Autumn/Winter.', category: "men's clothing", image: 'https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg', rating: { rate: 4.7, count: 500 } },
  { id: 4, title: 'Mens Casual Slim Fit', price: 15.99, description: 'The color could be slightly different between on the screen and in practice.', category: "men's clothing", image: 'https://fakestoreapi.com/img/71YXzeOuslL._AC_UY879_.jpg', rating: { rate: 2.1, count: 430 } },
  { id: 5, title: 'John Hardy Women\'s Legends Naga Bracelet', price: 695, description: 'From our Legends Collection, the Naga was inspired by the mythical water dragon.', category: 'jewelery', image: 'https://fakestoreapi.com/img/71pWzhdJNwL._AC_UL640_QL65_ML3_.jpg', rating: { rate: 4.6, count: 400 } },
  { id: 6, title: 'Solid Gold Petite Micropave', price: 168, description: 'Satisfaction Guaranteed. Return or exchange any order within 30 days.', category: 'jewelery', image: 'https://fakestoreapi.com/img/61sbMiUnoGL._AC_UL640_QL65_ML3_.jpg', rating: { rate: 3.9, count: 70 } },
  { id: 7, title: 'White Gold Plated Princess Ring', price: 9.99, description: 'Classic Created Wedding Engagement Solitaire Diamond Promise Ring.', category: 'jewelery', image: 'https://fakestoreapi.com/img/71YAIFU48IL._AC_UL640_QL65_ML3_.jpg', rating: { rate: 3.0, count: 400 } },
  { id: 8, title: 'Pierced Owl Rose Gold Plated Earrings', price: 10.99, description: 'Rose Gold Plated Double Flared Tunnel Plug Earrings.', category: 'jewelery', image: 'https://fakestoreapi.com/img/51UDEzMJVpL._AC_UL640_QL65_ML3_.jpg', rating: { rate: 1.9, count: 100 } },
  { id: 9, title: 'WD 2TB Elements External Hard Drive', price: 64, description: 'USB 3.0 and USB 2.0 Compatibility Fast data transfers.', category: 'electronics', image: 'https://fakestoreapi.com/img/61IBBVJvSDL._AC_SY879_.jpg', rating: { rate: 3.3, count: 203 } },
  { id: 10, title: 'SanDisk SSD PLUS 1TB Internal SSD', price: 109, description: 'Easy upgrade for faster boot up, shutdown, application load.', category: 'electronics', image: 'https://fakestoreapi.com/img/61U7T1koQqL._AC_SX679_.jpg', rating: { rate: 2.9, count: 470 } },
  { id: 11, title: 'Silicon Power 256GB SSD 3D NAND', price: 109, description: '3D NAND flash for high transfer speeds.', category: 'electronics', image: 'https://fakestoreapi.com/img/71kWymZ+c+L._AC_SX679_.jpg', rating: { rate: 4.8, count: 319 } },
  { id: 12, title: 'WD 4TB Gaming Drive for PS4', price: 114, description: 'Expand your PS4 gaming experience.', category: 'electronics', image: 'https://fakestoreapi.com/img/61mtL65D4cL._AC_SX679_.jpg', rating: { rate: 4.8, count: 400 } },
  { id: 13, title: 'Acer SB220Q bi 21.5" Full HD IPS Monitor', price: 599, description: '21.5 inches Full HD widescreen IPS display.', category: 'electronics', image: 'https://fakestoreapi.com/img/81QpkIctqPL._AC_SX679_.jpg', rating: { rate: 2.9, count: 250 } },
  { id: 14, title: 'Samsung 49-Inch CHG90 Curved Monitor', price: 999.99, description: '49 INCH SUPER ULTRAWIDE 32:9 CURVED GAMING MONITOR.', category: 'electronics', image: 'https://fakestoreapi.com/img/81Zt42ioCgL._AC_SX679_.jpg', rating: { rate: 2.2, count: 140 } },
  { id: 15, title: 'BIYLACLESEN Women\'s Snowboard Jacket', price: 56.99, description: '3-in-1 Snowboard Jacket Winter Coats.', category: "women's clothing", image: 'https://fakestoreapi.com/img/51Y5NI-I5jL._AC_UX679_.jpg', rating: { rate: 2.6, count: 235 } },
  { id: 16, title: 'Lock and Love Women\'s Moto Jacket', price: 29.95, description: 'Removable Hooded Faux Leather Moto Biker Jacket.', category: "women's clothing", image: 'https://fakestoreapi.com/img/81XH0e8fefL._AC_UY879_.jpg', rating: { rate: 2.9, count: 340 } },
  { id: 17, title: 'Rain Jacket Women Windbreaker', price: 39.99, description: 'Lightweight perfet for trip or casual wear.', category: "women's clothing", image: 'https://fakestoreapi.com/img/71HblAHs5xL._AC_UY879_-2.jpg', rating: { rate: 3.8, count: 679 } },
  { id: 18, title: 'MBJ Women\'s Solid Short Sleeve Boat Neck V', price: 9.85, description: '95% Rayon 5% Spandex, Made in USA.', category: "women's clothing", image: 'https://fakestoreapi.com/img/71z3kpMAYsL._AC_UY879_.jpg', rating: { rate: 4.7, count: 130 } },
  { id: 19, title: 'Opna Women\'s Short Sleeve Moisture Shirt', price: 7.95, description: '100% Polyester, Machine wash.', category: "women's clothing", image: 'https://fakestoreapi.com/img/51eg55uWmdL._AC_UX679_.jpg', rating: { rate: 4.5, count: 146 } },
  { id: 20, title: 'DANVOUY Women\'s Casual Cotton T Shirt', price: 12.99, description: '95%Cotton,5%Spandex, Features: Casual.', category: "women's clothing", image: 'https://fakestoreapi.com/img/61pHAEJ4NML._AC_UX679_.jpg', rating: { rate: 3.6, count: 145 } },
];

let cachedProducts: (FakeStoreProduct & { _id: string })[] | null = null;
let lastFetch = 0;
const CACHE_TTL = 5 * 60 * 1000;

async function fetchFromFakeStore(): Promise<(FakeStoreProduct & { _id: string })[]> {
  const now = Date.now();
  if (cachedProducts && now - lastFetch < CACHE_TTL) return cachedProducts;
  try {
    const res = await fetch(FAKESTORE_API);
    const data = await res.json() as FakeStoreProduct[];
    cachedProducts = data.map(p => ({ ...p, _id: String(p.id) }));
    lastFetch = now;
    return cachedProducts;
  } catch {
    if (cachedProducts) return cachedProducts;
    cachedProducts = FALLBACK_PRODUCTS.map(p => ({ ...p, _id: String(p.id) }));
    lastFetch = now;
    return cachedProducts;
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
