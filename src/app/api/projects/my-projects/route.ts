import Project from "@/model/Project.model";
import { NextRequest, NextResponse } from "next/server";



export async function GET(req: NextRequest){
    try {
        const userId = req.nextUrl.searchParams.get('userId');
        if(!userId){
            return NextResponse.json({message: "User ID is required" }, { status: 400})
        }
        // Fetch user-specific projects from the database
        const projects = await Project.find({ authorId: userId }).exec();

        if (projects.length === 0) {
            return NextResponse.json({ message: "No projects found for this user" }, { status: 404 });
        }
        console.log(projects);
        
        return NextResponse.json({ message: "Projects fetched successfully", projects }, { status: 200 });

    } catch (error) {
        console.error("Fetch user projects error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}