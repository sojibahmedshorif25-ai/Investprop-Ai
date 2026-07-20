import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';
import { config } from '../config';
import { ApiError } from '../utils/apiError';
import { AuthRequest } from '../middleware/auth';

const generateTokens = (userId: string) => {
  const accessToken = jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: '1h',
  });
  const refreshToken = jwt.sign({ userId }, config.jwt.refreshSecret, {
    expiresIn: '7d',
  });
  return { accessToken, refreshToken };
};

export const register = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { name, email, password, investmentGoals } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw ApiError.conflict('Email already registered');
    }

    const user = await User.create({ name, email, password, investmentGoals });
    const tokens = generateTokens(user._id.toString());

    const userObj = user.toObject();
    delete userObj.password;

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: { user: userObj, ...tokens },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      throw ApiError.unauthorized('Invalid email or password');
    }

    await User.findByIdAndUpdate(user._id, { lastLogin: new Date() });

    const tokens = generateTokens(user._id.toString());

    const userObj = user.toObject();
    delete userObj.password;

    res.json({
      success: true,
      message: 'Signed in successfully',
      data: { user: userObj, ...tokens },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({ success: true, message: 'Logged out successfully' });
};

export const refreshToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      throw ApiError.badRequest('Refresh token required');
    }

    const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret) as { userId: string };
    const user = await User.findById(decoded.userId);
    if (!user) {
      throw ApiError.unauthorized('User not found');
    }

    const tokens = generateTokens(user._id.toString());
    res.json({ success: true, data: tokens });
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      next(ApiError.unauthorized('Invalid refresh token'));
    } else {
      next(error);
    }
  }
};

export const getProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const user = await User.findById((req as AuthRequest).user!._id);
    if (!user) {
      throw ApiError.notFound('User not found');
    }
    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};

export const updateProfile = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const allowedFields = ['name', 'phoneNumber', 'company', 'bio', 'investmentGoals', 'preferredLocations', 'budgetRange', 'socialLinks'];
    const updates: Record<string, unknown> = {};
    for (const field of allowedFields) {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    }

    const user = await User.findByIdAndUpdate((req as AuthRequest).user!._id, updates, { new: true, runValidators: true });
    if (!user) {
      throw ApiError.notFound('User not found');
    }

    res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
};
