import { cloudinaryUpload } from "@/hooks/useCloudinaryUpload";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const request = await req.formData();
    const file = request.get("file");

    if (file instanceof Blob) {
      const fileStream = Buffer.from(await file.arrayBuffer());
      const response = await cloudinaryUpload(
        fileStream,
        "devgallery",
        file.name
      );

      if (response) {
        return NextResponse.json({ success: true, data: response });
      } else {
        return NextResponse.json(
          { success: false, error: "Unknown error occurred during upload." },
          { status: 500 }
        );
      }
    } else {
      return NextResponse.json(
        { success: false, error: "Uploaded file is not a valid Blob" },
        { status: 400 }
      );
    }
  } catch (error: unknown) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: "Unknown error occurred during upload." },
      { status: 500 }
    );
  }
}
