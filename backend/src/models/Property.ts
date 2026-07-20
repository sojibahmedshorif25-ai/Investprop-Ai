import mongoose, { Document, Schema } from 'mongoose';

export interface IInvestmentScore {
  score: number;
  breakdown: {
    marketAnalysis: number;
    locationQuality: number;
    financialPotential: number;
    legalRiskAssessment: number;
  };
  analysis: string;
  roiProjections: {
    conservative: number;
    moderate: number;
    optimistic: number;
  };
  recommendation: string;
  generatedAt?: Date;
  generatedBy?: string;
}

export interface IProperty extends Document {
  title: string;
  description: string;
  shortDescription: string;
  type: 'house' | 'apartment' | 'commercial' | 'land' | 'multifamily';
  price: number;
  address: string;
  location: {
    city: string;
    state: string;
    zip: string;
    coordinates: { lat: number; lng: number };
  };
  bedrooms: number;
  bathrooms: number;
  squareFeet: number;
  yearBuilt: number;
  status: 'forSale' | 'forRent' | 'foreclosure' | 'sold';
  amenities: string[];
  images: string[];
  owner: mongoose.Types.ObjectId;
  estimatedROI?: number;
  monthlyRentalIncome?: number;
  investmentScore?: IInvestmentScore;
  views: number;
  savedBy: mongoose.Types.ObjectId[];
  rating: { average: number; count: number };
  createdAt: Date;
  updatedAt: Date;
  listedDate: Date;
}

const propertySchema = new Schema<IProperty>(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    description: { type: String, required: true },
    shortDescription: { type: String, required: true, maxlength: 150 },
    type: {
      type: String,
      enum: ['house', 'apartment', 'commercial', 'land', 'multifamily'],
      required: true,
    },
    price: { type: Number, required: true, min: 1000, max: 100000000 },
    address: { type: String, required: true },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      zip: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    bedrooms: { type: Number, required: true, min: 0, max: 10 },
    bathrooms: { type: Number, required: true, min: 0, max: 10 },
    squareFeet: { type: Number, required: true },
    yearBuilt: { type: Number, required: true },
    status: {
      type: String,
      enum: ['forSale', 'forRent', 'foreclosure', 'sold'],
      default: 'forSale',
    },
    amenities: [{ type: String }],
    images: [{ type: String }],
    owner: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    estimatedROI: { type: Number },
    monthlyRentalIncome: { type: Number },
    investmentScore: {
      score: { type: Number, min: 0, max: 100 },
      breakdown: {
        marketAnalysis: { type: Number },
        locationQuality: { type: Number },
        financialPotential: { type: Number },
        legalRiskAssessment: { type: Number },
      },
      analysis: { type: String },
      roiProjections: {
        conservative: { type: Number },
        moderate: { type: Number },
        optimistic: { type: Number },
      },
      recommendation: { type: String },
      generatedAt: { type: Date },
      generatedBy: { type: String },
    },
    views: { type: Number, default: 0 },
    savedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
    },
    listedDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

propertySchema.index({ location: 'text', title: 'text' });
propertySchema.index({ price: 1 });
propertySchema.index({ type: 1 });
propertySchema.index({ 'investmentScore.score': 1 });
propertySchema.index({ owner: 1 });

export const Property = mongoose.model<IProperty>('Property', propertySchema);
