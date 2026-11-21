import { randomUUID } from "node:crypto";
import { env } from "../config/env.js";

const extensionByMimeType: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "application/pdf": "pdf",
};

function requireStorageConfig() {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) {
    throw new Error("File uploads are not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.");
  }
}

function encodedPath(path: string) {
  return path.split("/").map(encodeURIComponent).join("/");
}

function storageObjectUrl(path: string) {
  return new URL(`/storage/v1/object/${path}`, env.supabaseUrl).toString();
}

export function detectFileMimeType(buffer: Buffer): string | null {
  if (
    buffer.length >= 8 &&
    buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))
  ) return "image/png";
  if (buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) return "image/jpeg";
  if (
    buffer.length >= 12 &&
    buffer.toString("ascii", 0, 4) === "RIFF" &&
    buffer.toString("ascii", 8, 12) === "WEBP"
  ) return "image/webp";
  if (buffer.toString("ascii", 0, 5) === "%PDF-") return "application/pdf";
  return null;
}

export async function uploadPublicAsset(buffer: Buffer, contentType: string, folder: string) {
  requireStorageConfig();
  const extension = extensionByMimeType[contentType];
  if (!extension) throw new Error("This file type is not supported.");

  const objectPath = `${folder}/${randomUUID()}.${extension}`;
  const bucketPath = encodeURIComponent(env.supabaseStorageBucket);
  const encodedObjectPath = encodedPath(objectPath);
  const response = await fetch(
    storageObjectUrl(`${bucketPath}/${encodedObjectPath}`),
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
        apikey: env.supabaseServiceRoleKey,
        "Content-Type": contentType,
        "x-upsert": "false",
      },
      body: new Blob([new Uint8Array(buffer)], { type: contentType }),
    },
  );

  if (!response.ok) {
    console.error("[storage] Supabase upload failed:", response.status);
    throw new Error(`Storage upload failed (${response.status}). Check the bucket and server storage configuration.`);
  }

  return storageObjectUrl(`public/${bucketPath}/${encodedObjectPath}`);
}

export async function deletePublicAsset(publicUrl: string) {
  if (!env.supabaseUrl || !env.supabaseServiceRoleKey) return;
  const bucketPath = encodeURIComponent(env.supabaseStorageBucket);
  const publicPrefix = storageObjectUrl(`public/${bucketPath}/`);
  if (!publicUrl.startsWith(publicPrefix)) return;
  const objectPath = decodeURIComponent(publicUrl.slice(publicPrefix.length));
  if (!objectPath || objectPath.split("/").includes("..")) return;

  try {
    const response = await fetch(
      storageObjectUrl(bucketPath),
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${env.supabaseServiceRoleKey}`,
          apikey: env.supabaseServiceRoleKey,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prefixes: [objectPath] }),
      },
    );

    if (!response.ok) {
      console.error("[storage] Supabase file deletion failed:", response.status);
    }
  } catch (error) {
    console.error("[storage] Supabase file deletion request failed:", error);
  }
}
