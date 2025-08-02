import mongoose, { Document, Schema } from 'mongoose';

const IssueSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true, enum: ["Roads", "Lighting", "Water Supply", "Cleanliness", "Public Safety", "Obstructions"] },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  images: [{ type: String }],
  status: { type: String, enum: ['Reported', 'In Progress', 'Resolved'], default: 'Reported' },
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  is_anonymous: { type: Boolean, default: false },
  upvotes: [{ type: Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

IssueSchema.index({ location: '2dsphere' });

export interface IIssue extends Document {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: {
    type: string;
    coordinates: number[];
  };
  images: string[];
  status: string;
  user: mongoose.Types.ObjectId;
  is_anonymous: boolean;
  upvotes: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.model<IIssue>('Issue', IssueSchema);
