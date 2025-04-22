import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import User from "@/model/User.model";

dbConfig();

export async function PUT(req: NextRequest) {
    try {
        const { updatedData } = await req.json();
        console.log("Updating User: ", updatedData);
        

        if (!updatedData.email) {
            return NextResponse.json(
                { message: "Email is required to update user data" },
                { status: 400 }
            );
        }

        // Find user by email
        const user = await User.findOne({ email: updatedData.email });
        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }


        // If profile image is updated, set new profile image URL
        if (updatedData.profileImage) {
            user.profileImage = updatedData.profileImage;
        }

        // Update simple fields
        user.name = updatedData.name ?? user.name;
        user.bio = updatedData.bio ?? user.bio;
        user.profileImage = updatedData.profileImage ?? user.profileImage;

        // Update social links if provided
        if (updatedData.socialLinks) {
            user.socialLinks.github = updatedData.socialLinks.github ?? user.socialLinks.github;
            user.socialLinks.linkedin = updatedData.socialLinks.linkedin ?? user.socialLinks.linkedin;
            user.socialLinks.portfolio = updatedData.socialLinks.portfolio ?? user.socialLinks.portfolio;
            user.socialLinks.twitter = updatedData.socialLinks.twitter ?? user.socialLinks.twitter;
        }
        await user.save();

        return NextResponse.json(
            { message: "User profile updated successfully", user },
            { status: 200 }
        );
    } catch (error) {
        console.error("Error updating user:", error);
        return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
        );
    }
}
