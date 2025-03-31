import mongoose, { Schema, Document, Model } from 'mongoose';

// Define Service document interface
export interface IService extends Document {
  title: string;
  description: string;
  price: string;
  featured: boolean;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

// Define Service schema
const ServiceSchema = new Schema<IService>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this service'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for this service'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    price: {
      type: String,
      required: [true, 'Please provide a price for this service'],
      maxlength: [50, 'Price cannot be more than 50 characters'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: '{VALUE} is not a supported status',
      },
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
export const Service: Model<IService> = mongoose.models.Service || mongoose.model<IService>('Service', ServiceSchema);

export default Service; 