import "@/model/Like.model"; 
import "@/model/Comment.model"; 

import dbConfig from "@/middlewares/db.config";
import Project from "@/model/Project.model";
import { NextResponse } from "next/server";
dbConfig();


// GET : Fetches all projects with populated author details and likes data
export async function GET(){
    try {
        const projects = await Project.find({})
            .populate('authorId', 'name profileImage') // populate author name
            .populate('likes',"userId")
            .sort({ createdAt: -1 });
        // console.log(projects);
        
        return NextResponse.json({ message: "Projects fetched successfully", projects }, { status: 200 });

    } catch (error) {
        console.error("Fetch user projects error:", error);
        return NextResponse.json({ message: "Server error" }, { status: 500 });
    }
}