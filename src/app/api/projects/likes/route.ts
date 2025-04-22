import dbConfig from "@/middlewares/db.config";
import Project from "@/model/Project.model";
import Like from "@/model/Like.model";
import { NextRequest, NextResponse } from "next/server";

dbConfig();

//req for like the project by user
export async function POST(req: NextRequest) {
    try {
        const { projectId, userId } = await req.json();
        // const userId = req.userId; // Extracted userId from the token (should be handled in the middleware)

        if (!projectId || !userId) {
        return NextResponse.json(
            { message: "Project ID and User ID are required" },
            { status: 400 }
        );
        }

        // Connect to the database if not connected yet
        await dbConfig();

        // Find the project by projectId
        const project = await Project.findById(projectId);
        if (!project) {
        return NextResponse.json(
            { message: "Project not found" },
            { status: 404 }
        );
        }

        // Check if the user has already liked this project
        const existingLike = await Like.findOne({ userId, projectId });

        if (existingLike) {
            // If the like exists, remove it
            await Like.deleteOne({ _id: existingLike._id });

            // Remove the like reference from the project
            project.likes = project.likes.filter(
                (like) => like.toString() !== existingLike._id.toString()
            );
            await project.save();
            /*
            await Comment.create([
                {
                authorId: userId,
                projectId,
                text: "This project is really impressive! 🔥",
                },
                {
                authorId: userId,
                projectId,
                text: "Loved the tech stack and implementation 💡",
                },
            ]);
            */

            return NextResponse.json(
                { status: "unliked", likeCount: project.likes.length ,likedId:existingLike._id},
                { status: 200 }
            );
        } else {
            // If the like doesn't exist, add it
            const newLike = new Like({
                userId,
                projectId,
            });

            // Save the new like
            await newLike.save();

            // Add the new like reference to the project
            project.likes.push(newLike._id);
            await project.save();

            return NextResponse.json(
                { status: "liked", likeCount: project.likes.length,likedId:newLike._id },
                { status: 200 }
            );
        }
    } catch (error: any) {
        console.error("Error toggling like:", error.message || error);
        return NextResponse.json(
        { message: "Server error", error: error.message || error },
        { status: 500 }
        );
    }
}

//req for the get liked projects

export async function GET(req: NextRequest) {
    try {
        const { searchParams } = new URL(req.url);
        const userId = searchParams.get('id');
  
        if (!userId) {
            return NextResponse.json(
            { message: 'User ID is required' },
            { status: 400 }
            );
        }
  
  
  
        // Fetch all likes for this user and populate the project details
        const likedDocs = await Like.find({ userId }).populate('projectId');
    
        // Extract only valid (non-null) project objects
        const likedProjects = await Promise.all(
            likedDocs
              .map(async (doc) => {
                const project = doc.projectId;
                if (project !== null) {
                  // Populate the likes array in each project
                  const populatedProject = await Project.findById(project._id).populate('likes')
                        .populate('authorId','name profileImage');
                  return populatedProject;
                }
                return null;
              })
              .filter((project) => project !== null) // Ensure only valid projects are included
          );
        // console.log("like ",likedProjects);
        
    
        return NextResponse.json({ projects: likedProjects }, { status: 200 });
    } catch (error: any) {
        console.error('Error fetching liked projects:', error);
        return NextResponse.json(
            { message: 'Server error', error: error.message || error },
            { status: 500 }
        );
    }
}


