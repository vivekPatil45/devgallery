import mongoose, { Schema, model, Document } from 'mongoose';


export interface ILike extends Document {
    userId: mongoose.Types.ObjectId; // Reference to the User who liked the project
    projectId: mongoose.Types.ObjectId; // Reference to the Project that was liked
    createdAt: Date;
}


const LikeSchema = new Schema<ILike>({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.Like || model<ILike>('Like', LikeSchema);
