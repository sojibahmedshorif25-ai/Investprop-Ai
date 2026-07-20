import mongoose from 'mongoose';
import { config } from './index';
import { User } from '../models/User';
import { Property } from '../models/Property';
import { Portfolio } from '../models/Portfolio';
import { Preference } from '../models/Preference';
import { Product } from '../models/Product';

export async function seedData() {
  // Clear existing data
  await Promise.all([
    User.deleteMany({}),
    Property.deleteMany({}),
    Portfolio.deleteMany({}),
    Preference.deleteMany({}),
    Product.deleteMany({}),
  ]);

  // Create demo user
  const user = await User.create({
    name: 'John Investor',
    email: 'demo@investor.com',
    password: 'Demo@12345',
    investmentGoals: ['Long-term appreciation', 'Rental income'],
    preferredLocations: ['New York', 'Los Angeles', 'Miami'],
    budgetRange: { min: 100000, max: 2000000 },
  });

  // Create preferences
  await Preference.create({
    user: user._id,
    investmentGoals: ['Long-term appreciation', 'Rental income'],
    budgetRange: { min: 100000, max: 2000000 },
    preferredLocations: ['New York', 'Los Angeles', 'Miami'],
    propertyTypes: ['apartment', 'house', 'commercial'],
    desiredROI: 8,
    riskTolerance: 'medium',
    investmentHorizon: 'mediumTerm',
  });

  // Create sample properties
  const propertiesData = [
    {
      title: 'Modern 3BR Apartment in Manhattan',
      description: 'Discover this stunning, newly renovated 3-bedroom apartment in the heart of Manhattan. Featuring premium finishes throughout, floor-to-ceiling windows with breathtaking city views, and a gourmet chef\'s kitchen.',
      shortDescription: 'Newly renovated with premium finishes in prime location',
      type: 'apartment', price: 450000, address: '123 Broadway, New York, NY 10001',
      location: { city: 'New York', state: 'NY', zip: '10001', coordinates: { lat: 40.7484, lng: -73.9967 } },
      bedrooms: 3, bathrooms: 2, squareFeet: 2000, yearBuilt: 2015, status: 'forSale',
      amenities: ['Hardwood floors', 'Modern kitchen', 'Central AC', 'Parking included', 'Gym access'],
      owner: user._id, estimatedROI: 6.7, monthlyRentalIncome: 3200,
      investmentScore: {
        score: 78,
        breakdown: { marketAnalysis: 82, locationQuality: 76, financialPotential: 75, legalRiskAssessment: 77 },
        analysis: 'This property presents an excellent investment opportunity in a high-growth neighborhood.',
        roiProjections: { conservative: 5.2, moderate: 6.7, optimistic: 9.1 },
        recommendation: 'Strong Buy',
        generatedAt: new Date(), generatedBy: 'Claude 3.5 Sonnet',
      },
      rating: { average: 4.8, count: 124 }, views: 234,
      images: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
    },
    {
      title: 'Luxury Commercial Space Brooklyn',
      description: 'Prime commercial location in the heart of Brooklyn with high foot traffic and excellent visibility.',
      shortDescription: 'Prime commercial location with high foot traffic',
      type: 'commercial', price: 680000, address: '456 Atlantic Ave, Brooklyn, NY 11217',
      location: { city: 'Brooklyn', state: 'NY', zip: '11217', coordinates: { lat: 40.6844, lng: -73.9739 } },
      bedrooms: 0, bathrooms: 2, squareFeet: 3500, yearBuilt: 2018, status: 'forSale',
      amenities: ['Central AC', 'Security system', 'Loading dock', 'Elevator'],
      owner: user._id, estimatedROI: 8.2, monthlyRentalIncome: 5500,
      investmentScore: {
        score: 85,
        breakdown: { marketAnalysis: 88, locationQuality: 82, financialPotential: 84, legalRiskAssessment: 80 },
        analysis: 'Exceptional commercial investment with strong rental demand and appreciation potential.',
        roiProjections: { conservative: 6.8, moderate: 8.2, optimistic: 10.5 },
        recommendation: 'Strong Buy',
        generatedAt: new Date(), generatedBy: 'Claude 3.5 Sonnet',
      },
      rating: { average: 4.6, count: 89 }, views: 189,
      images: ['https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800&q=80'],
    },
    {
      title: 'Charming 2BR Townhouse in Austin',
      description: 'Historic townhouse with modern upgrades, beautiful garden, and prime location in Austin\'s trendiest neighborhood.',
      shortDescription: 'Historic townhouse with modern upgrades and garden',
      type: 'house', price: 320000, address: '789 Elm St, Austin, TX 78701',
      location: { city: 'Austin', state: 'TX', zip: '78701', coordinates: { lat: 30.2672, lng: -97.7431 } },
      bedrooms: 2, bathrooms: 1.5, squareFeet: 1500, yearBuilt: 1920, status: 'forSale',
      amenities: ['Hardwood floors', 'Garden/Outdoor space', 'Modern kitchen', 'Fireplace'],
      owner: user._id, estimatedROI: 5.8, monthlyRentalIncome: 2200,
      investmentScore: {
        score: 72,
        breakdown: { marketAnalysis: 75, locationQuality: 70, financialPotential: 68, legalRiskAssessment: 74 },
        analysis: 'Solid investment with strong rental demand in a rapidly growing Austin market.',
        roiProjections: { conservative: 4.5, moderate: 5.8, optimistic: 7.5 },
        recommendation: 'Buy',
        generatedAt: new Date(), generatedBy: 'Claude 3.5 Sonnet',
      },
      rating: { average: 4.5, count: 67 }, views: 156,
      images: ['https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?w=800&q=80'],
    },
    {
      title: 'Waterfront Multi-Family Property',
      description: 'Four-unit building with stunning waterfront views, each unit featuring 2 bedrooms and 1 bath.',
      shortDescription: '4-unit building with stunning waterfront views',
      type: 'multifamily', price: 890000, address: '101 Shore Dr, Miami, FL 33139',
      location: { city: 'Miami', state: 'FL', zip: '33139', coordinates: { lat: 25.7617, lng: -80.1918 } },
      bedrooms: 8, bathrooms: 4, squareFeet: 4200, yearBuilt: 2010, status: 'forSale',
      amenities: ['Pool', 'Parking included', 'Central AC', 'Garden/Outdoor space', 'Security system'],
      owner: user._id, estimatedROI: 9.4, monthlyRentalIncome: 7200,
      investmentScore: {
        score: 91,
        breakdown: { marketAnalysis: 93, locationQuality: 90, financialPotential: 92, legalRiskAssessment: 88 },
        analysis: 'Top-tier investment opportunity in Miami\'s booming waterfront market.',
        roiProjections: { conservative: 8.0, moderate: 9.4, optimistic: 11.8 },
        recommendation: 'Strong Buy',
        generatedAt: new Date(), generatedBy: 'Claude 3.5 Sonnet',
      },
      rating: { average: 4.9, count: 203 }, views: 312,
      images: ['https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80'],
    },
    {
      title: 'Prime Development Land Denver',
      description: 'Prime development land with permits ready. Zoned for mixed-use development with excellent growth potential.',
      shortDescription: 'Prime development land with permits ready',
      type: 'land', price: 250000, address: '2020 Oak Rd, Denver, CO 80201',
      location: { city: 'Denver', state: 'CO', zip: '80201', coordinates: { lat: 39.7392, lng: -104.9903 } },
      bedrooms: 0, bathrooms: 0, squareFeet: 15000, yearBuilt: 0, status: 'forSale',
      amenities: [],
      owner: user._id, estimatedROI: 12.1,
      investmentScore: {
        score: 65,
        breakdown: { marketAnalysis: 70, locationQuality: 65, financialPotential: 72, legalRiskAssessment: 55 },
        analysis: 'Good long-term development play in Denver\'s expanding market. Permits in place reduce timeline risk.',
        roiProjections: { conservative: 8.5, moderate: 12.1, optimistic: 15.0 },
        recommendation: 'Consider - Higher risk, higher reward',
        generatedAt: new Date(), generatedBy: 'Claude 3.5 Sonnet',
      },
      rating: { average: 4.2, count: 34 }, views: 98,
      images: ['https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800&q=80'],
    },
    {
      title: 'Downtown Luxury Condo Chicago',
      description: 'High-rise luxury condo with panoramic city views in the heart of downtown Chicago.',
      shortDescription: 'High-rise condo with panoramic city views',
      type: 'apartment', price: 550000, address: '555 Tower Blvd, Chicago, IL 60601',
      location: { city: 'Chicago', state: 'IL', zip: '60601', coordinates: { lat: 41.8827, lng: -87.6233 } },
      bedrooms: 2, bathrooms: 2, squareFeet: 1800, yearBuilt: 2021, status: 'forSale',
      amenities: ['Hardwood floors', 'Modern kitchen', 'Central AC', 'Gym access', 'Parking included', 'Doorman'],
      owner: user._id, estimatedROI: 7.1, monthlyRentalIncome: 3800,
      investmentScore: {
        score: 82,
        breakdown: { marketAnalysis: 85, locationQuality: 80, financialPotential: 79, legalRiskAssessment: 83 },
        analysis: 'Excellent luxury property in a prime Chicago location with strong appreciation potential.',
        roiProjections: { conservative: 5.8, moderate: 7.1, optimistic: 9.0 },
        recommendation: 'Strong Buy',
        generatedAt: new Date(), generatedBy: 'Claude 3.5 Sonnet',
      },
      rating: { average: 4.7, count: 156 }, views: 276,
      images: ['https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80'],
    },
  ];

  const properties = await Property.insertMany(propertiesData);

  // Create portfolio
  await Portfolio.create({
    user: user._id,
    properties: properties.map(p => p._id),
    totalValue: properties.reduce((sum, p) => sum + p.price, 0),
    totalMonthlyIncome: properties.reduce((sum, p) => sum + (p.monthlyRentalIncome || 0), 0),
    averageROI: properties.reduce((sum, p) => sum + (p.estimatedROI || 0), 0) / properties.length,
  });

  // Seed products from live FakeStore API
  let productsSeeded = 0;
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    const productsData = await res.json();
    if (Array.isArray(productsData) && productsData.length > 0) {
      await Product.insertMany(productsData);
      productsSeeded = productsData.length;
    }
  } catch (err) {
    console.warn('Failed to fetch from FakeStore API, skipping product seed:', (err as Error).message);
  }

  console.log('Seed data created successfully!');
  console.log(`Demo Account: demo@investor.com / Demo@12345`);
  console.log(`Properties seeded: ${properties.length}`);
  console.log(`Products seeded: ${productsSeeded}`);
}

// Run standalone when called via `npm run seed`
const isMainModule = require.main === module || process.argv[1]?.endsWith('seed.ts');
if (isMainModule) {
  (async () => {
    try {
      await mongoose.connect(config.mongodbUri);
      console.log('Connected to MongoDB');
      await seedData();
      await mongoose.disconnect();
      process.exit(0);
    } catch (err) {
      console.error('Seed error:', err);
      process.exit(1);
    }
  })();
}
