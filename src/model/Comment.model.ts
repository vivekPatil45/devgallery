import mongoose, { Schema, model, Document } from 'mongoose';

export interface IComment extends Document {
  projectId: mongoose.Types.ObjectId; // Reference to the Project that the comment is for
  authorId: mongoose.Types.ObjectId; // Reference to the User who wrote the comment
  text: string; // The text content of the comment
  createdAt: Date;
}


const CommentSchema = new Schema<IComment>({
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  authorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text: { type: String, required: true, maxlength: 1000 },
  createdAt: { type: Date, default: Date.now },
});


export default mongoose.models.Comment || model<IComment>('Comment', CommentSchema);
