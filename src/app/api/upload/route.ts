import { NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import crypto from "crypto";
// import { auth } from "@/lib/auth"; // We should ideally protect this route

export async function POST(request: Request) {
  try {
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

export async function DELETE(request: Request) {
  try {
    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json(
        { error: "Filename is required" },
        { status: 400 }
      );
    }

    const bucketName = process.env.R2_BUCKET_NAME!;

    const command = new DeleteObjectCommand({
      Bucket: bucketName,
      Key: filename,
    });

    await r2.send(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting from R2:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
