import mongoose, { Schema, model, Document } from 'mongoose';

export interface IProject extends Document {
  title: string;
  description: object;
  githubUrl?: string;
  liveUrl?: string;
  techStack: string[];
  image?: string;
  authorId: mongoose.Types.ObjectId;
  likes: mongoose.Types.ObjectId[]; // Array of Like ObjectIds
  comments: mongoose.Types.ObjectId[]; // Array of Comment ObjectIds
  createdAt: Date;
  updatedAt: Date;
}

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true, trim: true },
    description: { type: Object, required: true }, // JSON format
    githubUrl: { type: String, default: '' },
    liveUrl: { type: String, default: '' },
    techStack: { type: [String], default: [] },
    image: {
      type: String,
      default: 'https://res.cloudinary.com/demo/image/upload/v1234567890/default_project_image.png',
    },
    authorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    likes: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Like' }, // Reference to the Like model (user who liked the project)
    ],
    comments: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }, // Reference to the Comment model (comments for the project)
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Project || model<IProject>('Project', ProjectSchema);
