import "@/model/Like.model";
import "@/model/Comment.model";
import dbConfig from "@/middlewares/db.config";
import Project from "@/model/Project.model";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

function getIdFromUrl(url: string) {
  const parts = url.split("/");
  return parts[parts.length - 1];
}

// GET
export async function GET(request: NextRequest) {
  try {
    const id = getIdFromUrl(request.nextUrl.pathname);

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
    console.error("GET Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// PUT
export async function PUT(request: NextRequest) {
  try {
    const id = getIdFromUrl(request.nextUrl.pathname);
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
    console.error("PUT Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}

// DELETE
export async function DELETE(request: NextRequest) {
  try {
    const id = getIdFromUrl(request.nextUrl.pathname);

    const deletedProject = await Project.findByIdAndDelete(id);

    if (!deletedProject) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json({ message: "Server error" }, { status: 500 });
  }
}
