import mongoose, { Document as MongoDocument, Schema } from 'mongoose';

export interface IDocumentAnalysis {
  documentType?: string;
  keyDates?: Record<string, string>;
  partiesInvolved?: string[];
  propertyDetails?: { address?: string; price?: number };
  keyTerms?: string[];
  redFlags?: string[];
  actionItems?: string[];
  recommendations?: string;
  summary?: string;
  generatedAt?: Date;
}

export interface IDocument extends MongoDocument {
  user: mongoose.Types.ObjectId;
  property?: mongoose.Types.ObjectId;
  filename: string;
  fileUrl: string;
  fileType: string;
  analysis?: IDocumentAnalysis;
  uploadedAt: Date;
}

const documentSchema = new Schema<IDocument>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    property: { type: Schema.Types.ObjectId, ref: 'Property' },
    filename: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    analysis: {
      documentType: { type: String },
      keyDates: { type: Schema.Types.Mixed },
      partiesInvolved: [{ type: String }],
      propertyDetails: {
        address: { type: String },
        price: { type: Number },
      },
      keyTerms: [{ type: String }],
      redFlags: [{ type: String }],
      actionItems: [{ type: String }],
      recommendations: { type: String },
      summary: { type: String },
      generatedAt: { type: Date },
    },
  },
  { timestamps: true }
);

documentSchema.index({ user: 1 });
documentSchema.index({ property: 1 });

export const DocumentModel = mongoose.model<IDocument>('Document', documentSchema);
