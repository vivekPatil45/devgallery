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
