import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
    name?: string;
    email?: string;
    phone?: string;
    password?: string;
    role: 'user' | 'admin';
    isAnonymous: boolean;
    contributorBadge: 'new' | 'contributor' | 'verified';
    createdAt: Date;
}

const UserSchema: Schema = new Schema({
    name: { type: String },
    email: { type: String, unique: true, sparse: true },
    phone: { type: String, unique: true, sparse: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    isAnonymous: { type: Boolean, default: false },
    contributorBadge: { type: String, enum: ['new', 'contributor', 'verified'], default: 'new' },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<IUser>('User', UserSchema);
