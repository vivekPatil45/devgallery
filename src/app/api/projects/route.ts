import dbConfig from "@/middlewares/db.config";
import Project from "@/model/Project.model";
import { NextRequest, NextResponse } from "next/server";

dbConfig();


export async function GET(req: NextRequest){
    try {
        const projects = await Project.find({})
            .populate('authorId', 'name') // populate author name
            .populate('likes',"userId")
            .sort({ createdAt: -1 });
        // console.log(projects);
        
        return NextResponse.json({ message: "Projects fetched successfully", projects }, { status: 200 });

    } catch (error) {
        console.error("Fetch user projects error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}