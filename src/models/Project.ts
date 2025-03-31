import mongoose, { Schema, Document, Model } from 'mongoose';

// Define Project document interface
export interface IProject extends Document {
  title: string;
  description: string;
  category: string;
  image: string;
  slug: string;
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

// Define Project schema
const ProjectSchema = new Schema<IProject>(
  {
    title: {
      type: String,
      required: [true, 'Please provide a title for this project'],
      maxlength: [100, 'Title cannot be more than 100 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description for this project'],
      maxlength: [1000, 'Description cannot be more than 1000 characters'],
    },
    category: {
      type: String,
      required: [true, 'Please specify the category of this project'],
      maxlength: [50, 'Category cannot be more than 50 characters'],
    },
    image: {
      type: String,
      required: [true, 'Please provide an image URL for this project'],
      default: '/projects/placeholder.jpg',
    },
    slug: {
      type: String,
      unique: true,
      required: [true, 'Please provide a slug for this project'],
      trim: true,
      lowercase: true,
    },
    status: {
      type: String,
      enum: {
        values: ['draft', 'published'],
        message: '{VALUE} is not a supported status',
      },
      default: 'draft',
    },
  },
  {
    timestamps: true,
  }
);

// Custom middleware to generate a slug from the title if not provided
ProjectSchema.pre('validate', function(next) {
  if (!this.slug && this.title) {
    this.slug = this.title
      .toLowerCase()
      .replace(/\s+/g, '-') // Replace spaces with -
      .replace(/[^\w-]+/g, '') // Remove all non-word chars
      .replace(/--+/g, '-') // Replace multiple - with single -
      .trim(); // Trim - from start and end of string
  }
  next();
});

// Create and export the model
export const Project: Model<IProject> = mongoose.models.Project || mongoose.model<IProject>('Project', ProjectSchema);

export default Project; 