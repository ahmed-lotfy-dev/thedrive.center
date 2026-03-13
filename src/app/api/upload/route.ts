import { NextResponse } from "next/server";
import { PutObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import crypto from "crypto";
// import { auth } from "@/lib/auth"; // We should ideally protect this route

export async function POST(request: Request) {
  try {
    // Basic auth check can go here to ensure only admins can upload
    // const session = await auth.api.getSession({
    //   headers: request.headers,
    // });
    // if (!session || session.user.role !== "admin") {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { filename, contentType } = await request.json();

    if (!filename || !contentType) {
      return NextResponse.json(
        { error: "Filename and contentType are required" },
        { status: 400 }
      );
    }

    const ext = filename.split(".").pop();
    const uniqueFilename = `${crypto.randomUUID()}.${ext}`;
    const bucketName = process.env.R2_BUCKET_NAME!;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFilename,
      ContentType: contentType,
    });

    // Signed URL valid for 5 minutes
    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 300 });

    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${uniqueFilename}`;

    return NextResponse.json({
      uploadUrl: signedUrl,
      publicUrl,
      filename: uniqueFilename,
    });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return NextResponse.json(
      { error: "Failed to generate upload URL" },
      { status: 500 }
    );
  }
}
