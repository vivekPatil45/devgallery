import dbConfig from "@/middlewares/db.config";
import Project from "@/model/Project.model";
import Comment from "@/model/Comment.model";
import User from "@/model/User.model";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

// POST: Add a new comment to a project
export async function POST(req: NextRequest) {
    try {
        const { projectId, userId, text } = await req.json();

        if (!projectId || !userId || !text) {
            return NextResponse.json(
                { message: "Project ID, User ID, and text are required" },
                { status: 400 }
            );
        }

        const project = await Project.findById(projectId);
        const user = await User.findById(userId);

        if (!project || !user) {
            return NextResponse.json(
                { message: "Project or user not found" },
                { status: 404 }
            );
        }

        // Create and save the comment
        const newComment = new Comment({
            authorId: userId,
            projectId,
            text,
        });

        await newComment.save();

        // Add comment reference to project
        project.comments.push(newComment._id);
        await project.save();

        // Populate author for response
        await newComment.populate("authorId", "name profileImage");

        return NextResponse.json({ comment: newComment }, { status: 201 });
    } catch (error: any) {
        console.error("Error posting comment:", error.message || error);
        return NextResponse.json(
            { message: "Server error", error: error.message || error },
            { status: 500 }
        );
    }
}

// GET: Fetch all comments for a specific project
export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const projectId = searchParams.get("projectId");

        if (!projectId) {
            return NextResponse.json(
                { message: "Project ID is required" },
                { status: 400 }
            );
        }

        // Find comments related to the project and populate author info
        const comments = await Comment.find({ projectId })
            .populate("authorId", "name profileImage")
            .sort({ createdAt: -1 });

        return NextResponse.json({ comments }, { status: 200 });
    } catch (error: any) {
        console.error("Error fetching comments:", error.message || error);
        return NextResponse.json(
            { message: "Server error", error: error.message || error },
            { status: 500 }
        );
    }
}
