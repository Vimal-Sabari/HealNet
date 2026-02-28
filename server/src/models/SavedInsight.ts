import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedInsight extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    experienceId: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
}

const SavedInsightSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience', required: true },
}, {
    timestamps: true
});

// Each user can save each experience only once
SavedInsightSchema.index({ userId: 1, experienceId: 1 }, { unique: true });

export default mongoose.model<ISavedInsight>('SavedInsight', SavedInsightSchema);
