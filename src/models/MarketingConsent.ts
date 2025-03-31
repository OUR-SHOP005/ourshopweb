import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IMarketingConsent extends Document {
  userId: string;
  email: string;
  marketingConsent: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Define the schema
const MarketingConsentSchema = new Schema<IMarketingConsent>(
  {
    userId: {
      type: String,
      required: [true, 'User ID is required'],
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please provide a valid email address',
      ],
    },
    marketingConsent: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
export const MarketingConsent: Model<IMarketingConsent> = 
  mongoose.models.MarketingConsent || 
  mongoose.model<IMarketingConsent>('MarketingConsent', MarketingConsentSchema); 