import mongoose, { Document, Schema } from 'mongoose';

export interface IHospital extends Document {
    name: string;
    city: string;
    state: string;
    address?: string;
    rating?: number;
    website?: string;
    createdAt: Date;
}

const HospitalSchema: Schema = new Schema({
    name: { type: String, required: true, unique: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    address: { type: String },
    rating: { type: Number, default: 0 },
    website: { type: String },
}, {
    timestamps: true
});

// Text index for search
HospitalSchema.index({ name: 'text', city: 'text', state: 'text' });

export default mongoose.model<IHospital>('Hospital', HospitalSchema);
