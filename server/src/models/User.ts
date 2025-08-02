import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  location: {
    type: {
      type: String,
      enum: ['Point'],
    },
    coordinates: {
      type: [Number],
    }
  },
  is_verified: { type: Boolean, default: false },
  verification_level: { type: String, enum: ['email', 'phone', 'id_document', 'biometric'], default: 'email' },
  role: { type: String, enum: ['citizen', 'admin', 'municipal_worker'], default: 'citizen' },
}, { timestamps: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

export interface IUser extends Document {
  _id: string;
  username: string;
  email: string;
  password?: string;
  location?: {
    type: string;
    coordinates: number[];
  };
  is_verified: boolean;
  verification_level: string;
  role: string;
  createdAt: Date;
  updatedAt: Date;
}

export default mongoose.model<IUser>('User', UserSchema);
