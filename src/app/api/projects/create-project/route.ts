import dbConfig from "@/middlewares/db.config";
import Project from "@/model/Project.model";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      title,
      description,
      githubUrl,
      liveUrl,
      techStack,
      image,
      authorId,
    } = body;

    if (!title || !description || !authorId) {
      return NextResponse.json(
        { message: "Missing required fields" },
        { status: 400 }
      );
    }
    

    // No parsing needed
    const newProject = await Project.create({
      title,
      description, // it's already an object
      githubUrl,
      liveUrl,
      techStack,
      image,
      authorId,
      createdAt: new Date(),
    });

    return NextResponse.json(
      { message: "Project created successfully", project: newProject },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Create project error:", error.message || error);
    return NextResponse.json(
      { message: "Server error", error: error.message || error },
      { status: 500 }
    );
  }
}
