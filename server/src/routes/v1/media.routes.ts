import { Router, type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import { z } from "zod";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import {
  createArtwork,
  deleteArtwork,
  getAllArtwork,
  getPublishedArtwork,
  updateArtwork,
} from "../../services/media.service.js";
import { deletePublicAsset, detectFileMimeType, uploadPublicAsset } from "../../services/storage.service.js";

const router = Router();
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024, files: 1 },
});

function parseArtworkUpload(req: Request, res: Response, next: NextFunction) {
  upload.single("file")(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const tooLarge = error.code === "LIMIT_FILE_SIZE";
      res.status(tooLarge ? 413 : 400).json({
        success: false,
        error: tooLarge ? "Image files must be 10 MB or smaller." : error.message,
      });
      return;
    }
    if (error) {
      res.status(400).json({ success: false, error: "Unable to receive image upload." });
      return;
    }
    next();
  });
}

async function storeArtworkUpload(req: Request) {
  const file = req.file;
  if (!file) return null;

  const actualType = detectFileMimeType(file.buffer);
  if (!actualType || actualType !== file.mimetype || !["image/jpeg", "image/png", "image/webp"].includes(actualType)) {
    throw new Error("The uploaded file is not a valid JPG, PNG, or WebP image.");
  }
  return uploadPublicAsset(file.buffer, actualType, "media");
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
  if (error instanceof Error && error.message.startsWith("File uploads are not configured.")) {
    res.status(503).json({ success: false, error: error.message });
    return;
  }
  if (error instanceof Error && error.message.startsWith("The uploaded file")) {
    res.status(400).json({ success: false, error: error.message });
    return;
  }
  if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
    res.status(404).json({ success: false, error: "Artwork not found." });
    return;
  }

  console.error("[media] Media operation failed:", error);
  const status = error instanceof Error && error.message.startsWith("Storage upload failed") ? 502 : 500;
  res.status(status).json({ success: false, error: error instanceof Error ? error.message : "Media request failed." });
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
    uploadedImageUrl = await storeArtworkUpload(req);
    res.status(201).json({ success: true, data: await createArtwork(artworkInput(req, uploadedImageUrl)) });
  } catch (error) {
    if (uploadedImageUrl) await deletePublicAsset(uploadedImageUrl);
    respondWithError(res, error);
  }
});

router.put("/:id", authenticate, authorize("ADMIN"), parseArtworkUpload, async (req: Request, res: Response) => {
  let uploadedImageUrl: string | null = null;
  try {
    uploadedImageUrl = await storeArtworkUpload(req);
    res.json({ success: true, data: await updateArtwork(String(req.params.id), artworkInput(req, uploadedImageUrl)) });
  } catch (error) {
    if (uploadedImageUrl) await deletePublicAsset(uploadedImageUrl);
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
