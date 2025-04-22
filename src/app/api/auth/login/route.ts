import bcryptjs from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import dbConfig from "@/middlewares/db.config";
import jwt from "jsonwebtoken";
import User from "@/model/User.model";

dbConfig();

const generateToken = (data: object) => {
    return jwt.sign(data, process.env.JWT_SECRET!, { expiresIn: "1d" });
};

const setTokenCookie = (response: NextResponse, token: string) => {
    response.cookies.set("token", token, {
        httpOnly: true,
        maxAge: 60 * 60 * 24,
    });
};

export async function POST(req: NextRequest) {
    const { formData } = await req.json();

    if (!formData.email || !formData.password) {
        return NextResponse.json(
        { message: "Please fill all the fields", success: false },
        { status: 400 }
        );
    }
  // User login logic
    const user = await User.findOne({ email: formData.email });
    if (!user) {
        return NextResponse.json(
        { message: "User not found", success: false },
        { status: 400 }
        );
    }
    const isPasswordValid = await bcryptjs.compare(
        formData.password,
        user.password
    );

    if (isPasswordValid) {
        const data = {
            id: user._id,
            email: user.email,
            name: user.name,
            profilImage: user.profileImage,
            isVerified: user.isVerified,
        };
        const token = generateToken(data);
        const response = NextResponse.json({
            message: "Login Success",
            success: true,
            route: `/user/dashboard`,
            user,
        });
        setTokenCookie(response, token);
        return response;
    } else {
        return NextResponse.json(
        { message: "Invalid Credentials", success: false },
        { status: 400 }
        );
    }
}
