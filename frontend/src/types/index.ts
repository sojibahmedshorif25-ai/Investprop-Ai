export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
  investmentGoals: string[];
  preferredLocations: string[];
  budgetRange: { min: number; max: number };
  phoneNumber?: string;
  company?: string;
  bio?: string;
  socialLinks: { linkedin?: string; twitter?: string };
  role: 'user' | 'admin';
  createdAt: string;
  lastLogin?: string;
}

export interface InvestmentScore {
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
  generatedAt?: string;
  generatedBy?: string;
}

export interface Property {
  _id: string;
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
  owner: { _id: string; name: string; avatar?: string; email?: string; company?: string; phoneNumber?: string };
  estimatedROI?: number;
  monthlyRentalIncome?: number;
  investmentScore?: InvestmentScore;
  views: number;
  savedBy: string[];
  rating: { average: number; count: number };
  createdAt: string;
  listedDate: string;
}

export interface Review {
  _id: string;
  property: string;
  author: { _id: string; name: string; avatar?: string };
  rating: number;
  title: string;
  content: string;
  helpful: number;
  createdAt: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
  propertyContext?: string;
}

export interface ChatConversation {
  _id: string;
  user: string;
  messages: ChatMessage[];
  title: string;
  createdAt: string;
  updatedAt: string;
}

export interface AIRecommendation {
  propertyId: string;
  matchScore: number;
  reasoning: string;
  whyMatches: string;
  investmentScore: number;
  projectedROI: number;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  showing: number;
}
