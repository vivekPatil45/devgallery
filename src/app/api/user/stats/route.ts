import User from "@/model/User.model";
import dbConfig from "@/middlewares/db.config";
import { NextRequest, NextResponse } from "next/server";
import Project from "@/model/Project.model";
dbConfig();
export async function GET(req: NextRequest) {

    const userId = req.nextUrl.searchParams.get("id");

    if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    try {
      const user = await User.findById(userId).lean();
      if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

      console.log(user);
      
      const userProjects = await Project.find({ authorId: userId }).lean();
      const totalProjects = userProjects.length;
      const totalLikes = userProjects.reduce((acc, project) => acc + (project.likes?.length || 0), 0);

      const stats = {
        totalProjects,
        totalLikes,
        joinedAt: user.createdAt,
      };

      return NextResponse.json(stats);
    } catch (err) {
      console.error(err);
      return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}
