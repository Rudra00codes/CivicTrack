import mongoose, { Document, Schema } from 'mongoose';

const FlagSchema: Schema = new Schema({
    issue: { type: Schema.Types.ObjectId, ref: 'Issue', required: true },
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true, enum: ['Spam', 'Irrelevant', 'False Information'] },
    is_reviewed: { type: Boolean, default: false },
    reviewed_by: { type: Schema.Types.ObjectId, ref: 'User' },
    review_outcome: { type: String, enum: ['Valid', 'Invalid'] }
}, { timestamps: true });

export interface IFlag extends Document {
    _id: string;
    issue: mongoose.Types.ObjectId;
    user: mongoose.Types.ObjectId;
    reason: string;
    is_reviewed: boolean;
    reviewed_by: mongoose.Types.ObjectId;
    review_outcome: string;
    createdAt: Date;
    updatedAt: Date;
}

export default mongoose.model<IFlag>('Flag', FlagSchema);
