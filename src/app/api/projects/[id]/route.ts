import "@/model/Like.model"; // <-- Ensures Like schema is registered
import "@/model/Comment.model"; // ✅ This ensures the Comment schema is registered
import dbConfig from "@/middlewares/db.config";
import Project from "@/model/Project.model";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

// DELETE: Delete a specific project by ID
export async function DELETE(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;

        const deletedProject = await Project.findByIdAndDelete(id);

        if (!deletedProject) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
    } catch (error) {
        console.error("Delete project error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}


export async function GET(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        // Await the params if required by Next.js (this may depend on your Next.js version)
        const { id } = await params;

        console.log("Fetching project with id:", id);

        const project = await Project.findById(id)
            .populate({
                path: 'authorId',
                model: 'User',
                select: 'name profileImage',
            })
            .populate({
                path: 'likes',
                model: 'Like',
                select: 'userId', // Only userId field from Like
            
            })
            .populate({
                path: 'comments',
                model: 'Comment',
                select: 'text authorId createdAt', // Only text and authorId from Comment
                populate: {
                    path: 'authorId',
                    model: 'User',
                    select: 'name profileImage',
                },
            });

        // console.log(project);
        

    

        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }
    
        return NextResponse.json({ project }, { status: 200 });
    } catch (error) {
        console.error("Fetch project error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}




// PUT: Update a specific project by ID
export async function PUT(
    request: NextRequest,
    { params }: { params: { id: string } }
) {
    try {
        const id = params.id;
        const { title, description, githubUrl, liveUrl, techStack, image } = await request.json();

        // Find the project by ID
        const project = await Project.findById(id);

        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }

        // Update the project with new data
        project.title = title || project.title;
        project.description = description || project.description;
        project.githubUrl = githubUrl || project.githubUrl;
        project.liveUrl = liveUrl || project.liveUrl;
        project.techStack = techStack || project.techStack;
        project.image = image || project.image;

        // Save the updated project
        const updatedProject = await project.save();

        return NextResponse.json({ message: "Project updated successfully", project: updatedProject }, { status: 200 });
    } catch (error) {
        console.error("Update project error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}

