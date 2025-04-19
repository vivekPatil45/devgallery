import mongoose, { Schema, model, Document } from 'mongoose';

interface SocialLinks {
  github: string;
  linkedin: string;
  portfolio: string;
  twitter: string;
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    bio?: string;
    profileImage?: string;
    socialLinks: SocialLinks;
    isVerified: boolean;
    createdAt: Date;
}

const UserSchema = new Schema<IUser>({
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    bio: { type: String, default: '' },
    profileImage: {
        type: String,
        default: 'https://res.cloudinary.com/demo/image/upload/d_avatar.png/non_existing_id.png',
    },
    socialLinks: {
        github: { type: String, default: '' },
        linkedin: { type: String, default: '' },
        portfolio: { type: String, default: '' },
        twitter: { type: String, default: '' },
    },
    isVerified: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || model<IUser>('User', UserSchema);
