import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  price: number;
  description: string;
  category: string;
  image: string;
  rating: {
    rate: number;
    count: number;
  };
}

const productSchema = new Schema<IProduct>(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true, index: true },
    image: { type: String, required: true },
    rating: {
      rate: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

productSchema.index({ title: 'text', description: 'text' });

export const Product = mongoose.model<IProduct>('Product', productSchema);
