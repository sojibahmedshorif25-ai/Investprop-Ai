import mongoose, { Document, Schema } from 'mongoose';

export interface IPortfolio extends Document {
  user: mongoose.Types.ObjectId;
  properties: mongoose.Types.ObjectId[];
  totalValue: number;
  totalMonthlyIncome: number;
  averageROI: number;
  lastUpdated: Date;
}

const portfolioSchema = new Schema<IPortfolio>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    properties: [{ type: Schema.Types.ObjectId, ref: 'Property' }],
    totalValue: { type: Number, default: 0 },
    totalMonthlyIncome: { type: Number, default: 0 },
    averageROI: { type: Number, default: 0 },
    lastUpdated: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

export const Portfolio = mongoose.model<IPortfolio>('Portfolio', portfolioSchema);
