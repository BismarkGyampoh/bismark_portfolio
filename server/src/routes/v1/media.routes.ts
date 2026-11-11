import { Router, type Request, type Response } from "express";
import multer from "multer";
import { randomUUID } from "node:crypto";
import { mkdirSync } from "node:fs";
import { readFile, rename, unlink } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { z } from "zod";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import {
  createArtwork,
  deleteArtwork,
  getAllArtwork,
  getPublishedArtwork,
  updateArtwork,
} from "../../services/media.service.js";

const router = Router();
const uploadDirectory = fileURLToPath(new URL("../../../uploads/media/", import.meta.url));
const maxFileSize = 10 * 1024 * 1024;
const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, callback) => {
      mkdirSync(uploadDirectory, { recursive: true });
      callback(null, uploadDirectory);
    },
    filename: (_req, _file, callback) => callback(null, randomUUID()),
  }),
  limits: { fileSize: maxFileSize, files: 1 },
  fileFilter: (_req, file, callback) => {
    const acceptedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!acceptedTypes.includes(file.mimetype)) {
      callback(new Error("Upload a JPG, PNG, or WebP image."));
      return;
    }
    callback(null, true);
  },
});

function parseArtworkUpload(req: Request, res: Response, next: () => void) {
  upload.single("file")(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const status = error.code === "LIMIT_FILE_SIZE" ? 413 : 400;
      res.status(status).json({
        success: false,
        error: error.code === "LIMIT_FILE_SIZE" ? "Image files must be 10 MB or smaller." : error.message,
      });
      return;
    }
    if (error) {
      res.status(400).json({ success: false, error: error instanceof Error ? error.message : "Invalid image upload." });
      return;
    }
    next();
  });
}

async function validateAndNameUpload(req: Request) {
  if (!req.file) return null;

  const filePath = req.file.path;
  try {
    const signature = await readFile(filePath).then((content) => content.subarray(0, 12));
    let extension: string;
    if (signature.length >= 8 && signature.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]))) {
      extension = "png";
    } else if (signature[0] === 0xff && signature[1] === 0xd8 && signature[2] === 0xff) {
      extension = "jpg";
    } else if (
      signature.length >= 12 &&
      signature.toString("ascii", 0, 4) === "RIFF" &&
      signature.toString("ascii", 8, 12) === "WEBP"
    ) {
      extension = "webp";
    } else {
      throw new Error("The uploaded file is not a valid JPG, PNG, or WebP image.");
    }

    const filename = `${req.file.filename}.${extension}`;
    await rename(filePath, `${uploadDirectory}${filename}`);
    req.file.filename = filename;
    req.file.path = `${uploadDirectory}${filename}`;
    return `/uploads/media/${filename}`;
  } catch (error) {
    await unlink(filePath).catch(() => undefined);
    throw error;
  }
}

async function removeFailedUpload(req: Request) {
  if (req.file?.path) await unlink(req.file.path).catch((error: NodeJS.ErrnoException) => {
    if (error.code !== "ENOENT") console.error("Unable to remove failed media upload:", error);
  });
}

function artworkInput(req: Request, uploadedImageUrl: string | null) {
  const body = req.body as Record<string, unknown>;
  const published = typeof body.published === "string" && ["true", "false"].includes(body.published)
    ? body.published === "true"
    : body.published;
  return {
    ...body,
    imageUrl: uploadedImageUrl || body.imageUrl,
    displayOrder: body.displayOrder === undefined ? 0 : Number(body.displayOrder),
    published,
  };
}

function respondWithError(res: Response, error: unknown) {
  if (error instanceof z.ZodError) {
    res.status(400).json({ success: false, error: error.issues[0]?.message || "Invalid artwork data." });
    return;
  }

  if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
    res.status(404).json({ success: false, error: "Artwork not found." });
    return;
  }

  console.error("Media operation failed:", error);
  res.status(500).json({ success: false, error: "Media request failed." });
}

router.get("/", async (_req: Request, res: Response) => {
  try {
    res.json({ success: true, data: await getPublishedArtwork() });
  } catch (error) {
    respondWithError(res, error);
  }
});

router.get("/admin", authenticate, authorize("ADMIN"), async (_req: Request, res: Response) => {
  try {
    res.json({ success: true, data: await getAllArtwork() });
  } catch (error) {
    respondWithError(res, error);
  }
});

router.post("/", authenticate, authorize("ADMIN"), parseArtworkUpload, async (req: Request, res: Response) => {
  let uploadedImageUrl: string | null = null;
  try {
    uploadedImageUrl = await validateAndNameUpload(req);
    res.status(201).json({ success: true, data: await createArtwork(artworkInput(req, uploadedImageUrl)) });
  } catch (error) {
    await removeFailedUpload(req);
    respondWithError(res, error);
  }
});

router.put("/:id", authenticate, authorize("ADMIN"), parseArtworkUpload, async (req: Request, res: Response) => {
  let uploadedImageUrl: string | null = null;
  try {
    uploadedImageUrl = await validateAndNameUpload(req);
    res.json({ success: true, data: await updateArtwork(String(req.params.id), artworkInput(req, uploadedImageUrl)) });
  } catch (error) {
    await removeFailedUpload(req);
    respondWithError(res, error);
  }
});

router.delete("/:id", authenticate, authorize("ADMIN"), async (req: Request, res: Response) => {
  try {
    await deleteArtwork(String(req.params.id));
    res.json({ success: true, data: {} });
  } catch (error) {
    respondWithError(res, error);
  }
});

export { router as mediaRouter };
