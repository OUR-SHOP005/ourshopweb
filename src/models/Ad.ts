import mongoose, { Schema, Document, Model } from 'mongoose';

// Define Ad document interface
export interface IAd extends Document {
  title: string;
  content: string;
  position: 'top' | 'sidebar' | 'bottom' | 'banner';
  status: 'active' | 'inactive';
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define Ad schema
const AdSchema = new Schema<IAd>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this advertisement'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    content: {
      type: String,
      required: [true, 'Please provide content for this advertisement'],
      maxlength: [500, 'Content cannot be more than 500 characters'],
    },
    position: {
      type: String,
      enum: {
        values: ['top', 'sidebar', 'bottom', 'banner'],
        message: '{VALUE} is not a supported position',
      },
      required: [true, 'Please specify the position of this advertisement'],
    },
    status: {
      type: String,
      enum: {
        values: ['active', 'inactive'],
        message: '{VALUE} is not a supported status',
      },
      default: 'active',
    },
    startDate: {
      type: Date,
      required: [true, 'Please specify when this advertisement should start'],
      default: Date.now,
    },
    endDate: {
      type: Date,
      required: [true, 'Please specify when this advertisement should end'],
      validate: {
        validator: function(this: IAd, endDate: Date) {
          return endDate > this.startDate;
        },
        message: 'End date must be after start date',
      },
    },
  },
  {
    timestamps: true,
  }
);

// Create and export the model
export const Ad: Model<IAd> = mongoose.models.Ad || mongoose.model<IAd>('Ad', AdSchema);

export default Ad; 