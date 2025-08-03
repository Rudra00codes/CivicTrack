import mongoose, { Document, Schema } from 'mongoose';

const FlagSchema: Schema = new Schema({
    issue: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
    flagged_by: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true, enum: ['Spam', 'Inappropriate Content', 'False Information', 'Harassment', 'Other'] },
    description: { type: String },
    status: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
    reviewed_by: { type: Schema.Types.ObjectId, ref: 'User' },
    reviewed_at: { type: Date },
    review_notes: { type: String }
}, { timestamps: true });

export interface IFlag extends Document {
    _id: string;
    issue: mongoose.Types.ObjectId;
    flagged_by: mongoose.Types.ObjectId;
    reason: string;
    description?: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewed_by?: mongoose.Types.ObjectId;
    reviewed_at?: Date;
    review_notes?: string;
    createdAt: Date;
    updatedAt: Date;
}

export default mongoose.model<IFlag>('Flag', FlagSchema);
