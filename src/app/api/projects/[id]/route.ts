import "@/model/Like.model"; // Ensure Like schema is registered
import "@/model/Comment.model"; // Ensure Comment schema is registered
import dbConfig from "@/middlewares/db.config";
import Project from "@/model/Project.model";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

// GET: Fetch project by ID
export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

    const project = await Project.findById(id)
      .populate({
        path: "authorId",
        model: "User",
        select: "name profileImage",
      })
      .populate({
        path: "likes",
        model: "Like",
        select: "userId",
      })
      .populate({
        path: "comments",
        model: "Comment",
        select: "text authorId createdAt",
        populate: {
          path: "authorId",
          model: "User",
          select: "name profileImage",
        },
      });

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
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;
    const { title, description, githubUrl, liveUrl, techStack, image } = await request.json();

    const project = await Project.findById(id);

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    project.title = title || project.title;
    project.description = description || project.description;
    project.githubUrl = githubUrl || project.githubUrl;
    project.liveUrl = liveUrl || project.liveUrl;
    project.techStack = techStack || project.techStack;
    project.image = image || project.image;

    const updatedProject = await project.save();

    return NextResponse.json(
      { message: "Project updated successfully", project: updatedProject },
      { status: 200 }
    );
  } catch (error) {
    console.error("Update project error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE: Delete a specific project by ID
export async function DELETE(
  request: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params;

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
