import mongoose, { Document, Schema } from 'mongoose';

export interface IExperience extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    hospital: string;
    condition: string;
    symptoms: string[];
    treatment: string;
    outcome: 'success' | 'improvement' | 'ongoing' | 'no improvement' | 'complication';
    recoveryTime: string;
    description?: string;
    city?: string;
    costRange?: string;
    helpfulCount: number;
    isAnonymous: boolean;
    createdAt: Date;
}

const ExperienceSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    hospital: { type: String, required: true },
    condition: { type: String, required: true },
    symptoms: { type: [String], required: true },
    treatment: { type: String, required: true },
    outcome: {
        type: String,
        enum: ['success', 'improvement', 'ongoing', 'no improvement', 'complication'],
        required: true
    },
    recoveryTime: { type: String, required: true },
    description: { type: String },
    city: { type: String },
    costRange: { type: String },
    helpfulCount: { type: Number, default: 0 },
    isAnonymous: { type: Boolean, default: false },
}, {
    timestamps: true
});

ExperienceSchema.index({ hospital: 'text', condition: 'text', symptoms: 'text', treatment: 'text' });
ExperienceSchema.index({ hospital: 1, condition: 1 });
ExperienceSchema.index({ hospital: 1, outcome: 1 });
ExperienceSchema.index({ createdAt: -1 });

export default mongoose.model<IExperience>('Experience', ExperienceSchema);
