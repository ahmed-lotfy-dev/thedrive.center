import { NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MAX_UPLOAD_SIZE_BYTES, validateUploadRequest } from "@/lib/upload-policy";
import { logger } from "@/lib/logger";

function isAdminRole(role?: string | null) {
  return role === "admin" || role === "owner";
}

export async function POST(request: Request) {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });
    const role = (session?.user as { role?: string } | undefined)?.role;

    if (!session?.user || !isAdminRole(role)) {
      logger.warn("upload.sign_unauthorized", {
        action: "upload_sign",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { filename, contentType, size } = await request.json();

    const validation = validateUploadRequest({ filename, contentType, size });
    if (!validation.valid) {
      logger.warn("upload.sign_invalid_request", {
        userId: session.user.id,
        filename,
        contentType,
        size,
      });
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    const ext = filename.split(".").pop()?.toLowerCase();
    const uniqueFilename = `${crypto.randomUUID()}.${ext}`;
    const bucketName = process.env.R2_BUCKET_NAME!;

    const command = new PutObjectCommand({
      Bucket: bucketName,
      Key: uniqueFilename,
      ContentType: contentType,
      ContentLength: size,
    });

    const signedUrl = await getSignedUrl(r2, command, { expiresIn: 300 });
    const publicUrl = `${process.env.NEXT_PUBLIC_R2_PUBLIC_URL}/${uniqueFilename}`;

    logger.info("upload.sign_generated", {
      userId: session.user.id,
      filename: uniqueFilename,
      contentType,
      size,
    });

    return NextResponse.json({
      uploadUrl: signedUrl,
      publicUrl,
      filename: uniqueFilename,
      maxSizeBytes: MAX_UPLOAD_SIZE_BYTES,
    });
  } catch (error) {
    logger.error("upload.sign_failed", {
      error,
      action: "upload_sign",
    });
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });
    const role = (session?.user as { role?: string } | undefined)?.role;

    if (!session?.user || !isAdminRole(role)) {
      logger.warn("upload.delete_unauthorized", {
        action: "upload_delete",
      });
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { filename } = await request.json();

    if (!filename) {
      logger.warn("upload.delete_invalid_request", {
        userId: session.user.id,
      });
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const bucketName = process.env.R2_BUCKET_NAME!;
    const command = new DeleteObjectCommand({ Bucket: bucketName, Key: filename });
    await r2.send(command);

    logger.info("upload.deleted", {
      userId: session.user.id,
      filename,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error("upload.delete_failed", {
      error,
      action: "upload_delete",
    });
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
