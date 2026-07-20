import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  property: mongoose.Types.ObjectId;
  author: mongoose.Types.ObjectId;
  rating: number;
  title: string;
  content: string;
  helpful: number;
  createdAt: Date;
  updatedAt: Date;
}

const reviewSchema = new Schema<IReview>(
  {
    property: { type: Schema.Types.ObjectId, ref: 'Property', required: true },
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true, maxlength: 100 },
    content: { type: String, required: true, maxlength: 2000 },
    helpful: { type: Number, default: 0 },
  },
  { timestamps: true }
);

reviewSchema.index({ property: 1 });
reviewSchema.index({ author: 1 });

export const Review = mongoose.model<IReview>('Review', reviewSchema);
