import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
    experienceId: mongoose.Schema.Types.ObjectId;
    reporterId: mongoose.Schema.Types.ObjectId;
    reason: string;
    details?: string;
    status: 'pending' | 'resolved' | 'dismissed';
    createdAt: Date;
}

const ReportSchema: Schema = new Schema({
    experienceId: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience', required: true },
    reporterId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    reason: { type: String, required: true },
    details: { type: String },
    status: { type: String, enum: ['pending', 'resolved', 'dismissed'], default: 'pending' },
}, {
    timestamps: true
});

export default mongoose.model<IReport>('Report', ReportSchema);
