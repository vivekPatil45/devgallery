import dbConfig from "@/middlewares/db.config";
import Project from "@/model/Project.model";
import { convertFromRaw } from "draft-js";
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
        // const project = await Project.findById(id)
        //     .populate({
        //         path: 'authorId',
        //         select: 'name profileImage',
        //     })
        //     .populate({
        //         path: 'likes',
        //         select: 'userId', // only include userId from Like document
        //     })
        //     .populate({
        //         path: 'comments',
        //         select: 'text authorId', // include only text and authorId
        //         populate: {
        //             path: 'authorId',
        //             select: 'name profileImage', // include name and profileImage of user
        //         },
        //     });'


        const project = await Project.findById(id)
            .populate('authorId','name  profileImage')
            // .populate('likes',)

//         const project = await Project.findById(id)
//   .populate({
//     path: 'authorId',
//     model: 'User',
//     select: 'name profileImage',
//   })
//   .populate({
//     path: 'likes',
//     model: 'Like',
//     select: 'userId', // Only userId field from Like
//     populate: {
//       path: 'userId',
//       model: 'User',
//       select: 'name profileImage',
//     },
//   })
//   .populate({
//     path: 'comments',
//     model: 'Comment',
//     select: 'text authorId', // Only text and authorId from Comment
//     populate: {
//       path: 'authorId',
//       model: 'User',
//       select: 'name profileImage',
//     },
//   });





        //     const project = await Project.findById(id)
        // .populate({
        //     path: 'authorId',
        //     select: 'name _id profileImage',
        //     model: 'User'
        // })
        // .populate({
        //     path: 'likes',
        //     populate: {
        //     path: 'userId',
        //     select: 'name _id profileImage',
        //     model: 'User'
        //     }
        // })
        // .populate({
        //     path: 'comments',
        //     populate: {
        //     path: 'authorId',
        //     select: 'name _id profileImage',
        //     model: 'User'
        //     }
        // });
        
            
        

        if (!project) {
            return NextResponse.json({ message: "Project not found" }, { status: 404 });
        }
        // project.description = convertFromRaw( project.description);
    
        return NextResponse.json({ project }, { status: 200 });
        // Ensure description is sent as raw Draft.js content
        // return NextResponse.json({ project: { ...project.toObject(), description: project.description } }, { status: 200 });   
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

