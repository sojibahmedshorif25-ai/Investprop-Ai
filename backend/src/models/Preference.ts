import mongoose, { Document, Schema } from 'mongoose';

export interface IPreference extends Document {
  user: mongoose.Types.ObjectId;
  investmentGoals: string[];
  budgetRange: { min: number; max: number };
  preferredLocations: string[];
  propertyTypes: string[];
  desiredROI: number;
  riskTolerance: 'low' | 'medium' | 'high';
  investmentHorizon: 'shortTerm' | 'mediumTerm' | 'longTerm';
  updatedAt: Date;
}

const preferenceSchema = new Schema<IPreference>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    investmentGoals: [{ type: String }],
    budgetRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 10000000 },
    },
    preferredLocations: [{ type: String }],
    propertyTypes: [{ type: String }],
    desiredROI: { type: Number, default: 10 },
    riskTolerance: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    investmentHorizon: {
      type: String,
      enum: ['shortTerm', 'mediumTerm', 'longTerm'],
      default: 'mediumTerm',
    },
  },
  { timestamps: true }
);

export const Preference = mongoose.model<IPreference>('Preference', preferenceSchema);
