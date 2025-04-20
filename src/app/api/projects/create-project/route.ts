import dbConfig from "@/middlewares/db.config";
import Project from "@/model/Project.model";

import { NextRequest,NextResponse } from "next/server";

dbConfig();

export async function POST(req: NextRequest) {

    try {
        const body = await req.json();
        console.log(body);
        const { title, description, githubUrl, liveUrl, techStack, image, authorId } = body;
    
        if (!title || !description || !authorId) {
            return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
        }

        const newProject = await Project.create({
            title,
            description: JSON.parse(description), // stringified raw JSON from Draft.js
            githubUrl,
            liveUrl,
            techStack,
            image,
            authorId,
        });
       
        return NextResponse.json(
            { message: "Project created successfully", project: newProject },
            { status: 201 }
        );

        
    } catch (error) {
        console.error("Create project error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}




