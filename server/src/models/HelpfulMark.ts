import mongoose, { Document, Schema } from 'mongoose';

export interface IHelpfulMark extends Document {
    userId: mongoose.Schema.Types.ObjectId;
    experienceId: mongoose.Schema.Types.ObjectId;
    createdAt: Date;
}

const HelpfulMarkSchema: Schema = new Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience', required: true },
}, {
    timestamps: true
});

// Each user can mark each experience as helpful only once
HelpfulMarkSchema.index({ userId: 1, experienceId: 1 }, { unique: true });

export default mongoose.model<IHelpfulMark>('HelpfulMark', HelpfulMarkSchema);
