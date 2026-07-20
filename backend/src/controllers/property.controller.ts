import { Request, Response, NextFunction } from 'express';
import { Property } from '../models/Property';
import { Review } from '../models/Review';
import { Portfolio } from '../models/Portfolio';
import { ApiError } from '../utils/apiError';
import { AuthRequest } from '../middleware/auth';


export const getProperties = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const {
      search, location, priceMin, priceMax,
      scoreMin, scoreMax, propertyType,
      roiMin, roiMax, sort, page = '1', limit = '12',
    } = req.query;

    const filter: Record<string, unknown> = {};

    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.state': { $regex: search, $options: 'i' } },
      ];
    }

    if (location) {
      filter.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
      ];
    }

    if (priceMin || priceMax) {
      filter.price = {};
      if (priceMin) (filter.price as Record<string, number>).$gte = Number(priceMin);
      if (priceMax) (filter.price as Record<string, number>).$lte = Number(priceMax);
    }

    if (scoreMin || scoreMax) {
      filter['investmentScore.score'] = {};
      if (scoreMin) (filter['investmentScore.score'] as Record<string, number>).$gte = Number(scoreMin);
      if (scoreMax) (filter['investmentScore.score'] as Record<string, number>).$lte = Number(scoreMax);
    }

    if (propertyType) {
      filter.type = propertyType;
    }

    if (roiMin || roiMax) {
      filter['investmentScore.roiProjections.moderate'] = {};
      if (roiMin) (filter['investmentScore.roiProjections.moderate'] as Record<string, number>).$gte = Number(roiMin);
      if (roiMax) (filter['investmentScore.roiProjections.moderate'] as Record<string, number>).$lte = Number(roiMax);
    }

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    switch (sort) {
      case 'popular': sortOption = { views: -1 }; break;
      case 'roiHigh': sortOption = { 'investmentScore.roiProjections.moderate': -1 }; break;
      case 'priceLow': sortOption = { price: 1 }; break;
      case 'priceHigh': sortOption = { price: -1 }; break;
      case 'bestScore': sortOption = { 'investmentScore.score': -1 }; break;
      default: sortOption = { createdAt: -1 };
    }

    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit as string, 10)));
    const skip = (pageNum - 1) * limitNum;

    const [properties, total] = await Promise.all([
      Property.find(filter)
        .sort(sortOption)
        .skip(skip)
        .limit(limitNum)
        .populate('owner', 'name avatar'),
      Property.countDocuments(filter),
    ]);

    res.json({
      success: true,
      data: {
        properties,
        pagination: {
          total,
          page: pageNum,
          limit: limitNum,
          totalPages: Math.ceil(total / limitNum),
          showing: Math.min(skip + properties.length, total),
        },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const getProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { $inc: { views: 1 } },
      { new: true }
    ).populate('owner', 'name avatar email company phoneNumber');

    if (!property) {
      throw ApiError.notFound('Property not found');
    }

    res.json({ success: true, data: property });
  } catch (error) {
    next(error);
  }
};

export const createProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const propertyData = { ...req.body, owner: (req as AuthRequest).user!._id };
    const property = await Property.create(propertyData);

    await Portfolio.findOneAndUpdate(
      { user: (req as AuthRequest).user!._id },
      { $push: { properties: property._id }, lastUpdated: new Date() },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      message: 'Property listed successfully',
      data: property,
    });
  } catch (error) {
    next(error);
  }
};

export const updateProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const property = await Property.findOne({ _id: req.params.id, owner: (req as AuthRequest).user!._id });
    if (!property) {
      throw ApiError.notFound('Property not found or unauthorized');
    }

    Object.assign(property, req.body);
    await property.save();

    res.json({ success: true, message: 'Property updated', data: property });
  } catch (error) {
    next(error);
  }
};

export const deleteProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const property = await Property.findOneAndDelete({ _id: req.params.id, owner: (req as AuthRequest).user!._id });
    if (!property) {
      throw ApiError.notFound('Property not found or unauthorized');
    }

    await Portfolio.findOneAndUpdate(
      { user: (req as AuthRequest).user!._id },
      { $pull: { properties: property._id }, lastUpdated: new Date() }
    );

    await Review.deleteMany({ property: property._id });

    res.json({ success: true, message: 'Property deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const getPropertyReviews = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { page = '1', limit = '5', sort = 'recent' } = req.query;
    const pageNum = Math.max(1, parseInt(page as string, 10));
    const limitNum = Math.min(20, Math.max(1, parseInt(limit as string, 10)));

    let sortOption: Record<string, 1 | -1> = { createdAt: -1 };
    if (sort === 'highest') sortOption = { rating: -1 };
    else if (sort === 'lowest') sortOption = { rating: 1 };

    const [reviews, total] = await Promise.all([
      Review.find({ property: req.params.id })
        .sort(sortOption)
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum)
        .populate('author', 'name avatar'),
      Review.countDocuments({ property: req.params.id }),
    ]);

    res.json({
      success: true,
      data: {
        reviews,
        pagination: { total, page: pageNum, limit: limitNum, totalPages: Math.ceil(total / limitNum) },
      },
    });
  } catch (error) {
    next(error);
  }
};

export const addReview = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      throw ApiError.notFound('Property not found');
    }

    const review = await Review.create({
      ...req.body,
      property: req.params.id,
      author: (req as AuthRequest).user!._id,
    });

    const stats = await Review.aggregate([
      { $match: { property: property._id } },
      { $group: { _id: null, average: { $avg: '$rating' }, count: { $sum: 1 } } },
    ]);

    if (stats.length > 0) {
      property.rating = { average: Math.round(stats[0].average * 10) / 10, count: stats[0].count };
      await property.save();
    }

    res.status(201).json({ success: true, data: review });
  } catch (error) {
    next(error);
  }
};

export const saveProperty = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      throw ApiError.notFound('Property not found');
    }

    const index = property.savedBy.indexOf((req as AuthRequest).user!._id);
    if (index === -1) {
      property.savedBy.push((req as AuthRequest).user!._id);
    } else {
      property.savedBy.splice(index, 1);
    }
    await property.save();

    res.json({ success: true, data: { saved: index === -1 }, message: index === -1 ? 'Property saved' : 'Property unsaved' });
  } catch (error) {
    next(error);
  }
};
