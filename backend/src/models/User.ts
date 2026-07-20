import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  googleId?: string;
  investmentGoals: string[];
  preferredLocations: string[];
  budgetRange: { min: number; max: number };
  phoneNumber?: string;
  company?: string;
  bio?: string;
  socialLinks: { linkedin?: string; twitter?: string };
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 8, select: false },
    avatar: { type: String },
    googleId: { type: String, sparse: true },
    investmentGoals: [{ type: String }],
    preferredLocations: [{ type: String }],
    budgetRange: {
      min: { type: Number, default: 0 },
      max: { type: Number, default: 10000000 },
    },
    phoneNumber: { type: String },
    company: { type: String },
    bio: { type: String },
    socialLinks: {
      linkedin: { type: String },
      twitter: { type: String },
    },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    lastLogin: { type: Date },
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

export const User = mongoose.model<IUser>('User', userSchema);
