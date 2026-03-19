import { NextResponse } from "next/server";
import { PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { r2 } from "@/lib/r2";
import crypto from "crypto";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { MAX_UPLOAD_SIZE_BYTES, validateUploadRequest } from "@/lib/upload-policy";
import { checkRateLimit, rateLimitPolicies } from "@/lib/rate-limit";

function isAdminRole(role?: string | null) {
  return role === "admin" || role === "owner";
}

export async function POST(request: Request) {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });
    const role = (session?.user as { role?: string } | undefined)?.role;

    if (!session?.user || !isAdminRole(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = await checkRateLimit(rateLimitPolicies.adminUploadSign, {
      headers: requestHeaders,
      userId: session.user.id,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.message },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const { filename, contentType, size } = await request.json();

    const validation = validateUploadRequest({ filename, contentType, size });
    if (!validation.valid) {
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

    return NextResponse.json({
      uploadUrl: signedUrl,
      publicUrl,
      filename: uniqueFilename,
      maxSizeBytes: MAX_UPLOAD_SIZE_BYTES,
    });
  } catch (error) {
    console.error("Error generating pre-signed URL:", error);
    return NextResponse.json({ error: "Failed to generate upload URL" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const requestHeaders = await headers();
    const session = await auth.api.getSession({ headers: requestHeaders });
    const role = (session?.user as { role?: string } | undefined)?.role;

    if (!session?.user || !isAdminRole(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const rateLimit = await checkRateLimit(rateLimitPolicies.adminUploadDelete, {
      headers: requestHeaders,
      userId: session.user.id,
    });

    if (!rateLimit.allowed) {
      return NextResponse.json(
        { error: rateLimit.message },
        {
          status: 429,
          headers: {
            "Retry-After": String(rateLimit.retryAfterSeconds),
          },
        },
      );
    }

    const { filename } = await request.json();

    if (!filename) {
      return NextResponse.json({ error: "Filename is required" }, { status: 400 });
    }

    const bucketName = process.env.R2_BUCKET_NAME!;
    const command = new DeleteObjectCommand({ Bucket: bucketName, Key: filename });
    await r2.send(command);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting from R2:", error);
    return NextResponse.json({ error: "Failed to delete file" }, { status: 500 });
  }
}
