import { Router, type NextFunction, type Request, type Response } from "express";
import multer from "multer";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { detectFileMimeType, uploadPublicAsset } from "../../services/storage.service.js";

const router = Router();
const maxFileSize = 10 * 1024 * 1024;
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: maxFileSize, files: 1 },
});

function receiveFile(req: Request, res: Response, next: NextFunction) {
  upload.single("file")(req, res, (error: unknown) => {
    if (error instanceof multer.MulterError) {
      const tooLarge = error.code === "LIMIT_FILE_SIZE";
      res.status(tooLarge ? 413 : 400).json({
        success: false,
        error: tooLarge ? "Files must be 10 MB or smaller." : error.message,
      });
      return;
    }
    if (error) {
      res.status(400).json({ success: false, error: "Unable to receive uploaded file." });
      return;
    }
    next();
  });
}

function uploadHandler(folder: string, allowedTypes: string[]) {
  return async (req: Request, res: Response) => {
    const file = req.file;
    if (!file) {
      res.status(400).json({ success: false, error: "Choose a file to upload." });
      return;
    }

    const actualType = detectFileMimeType(file.buffer);
    if (!actualType || actualType !== file.mimetype || !allowedTypes.includes(actualType)) {
      res.status(400).json({ success: false, error: "File content does not match an allowed file type." });
      return;
    }

    try {
      const url = await uploadPublicAsset(file.buffer, actualType, folder);
      res.status(201).json({ success: true, data: { url, contentType: actualType, originalName: file.originalname } });
    } catch (error) {
      if (error instanceof Error && error.message.startsWith("File uploads are not configured.")) {
        res.status(503).json({ success: false, error: error.message });
        return;
      }
      console.error("[uploads] Asset upload failed:", error);
      res.status(502).json({ success: false, error: error instanceof Error ? error.message : "Asset upload failed." });
    }
  };
}

router.post(
  "/image",
  authenticate,
  authorize("ADMIN"),
  receiveFile,
  uploadHandler("images", ["image/jpeg", "image/png", "image/webp"]),
);

router.post(
  "/document",
  authenticate,
  authorize("ADMIN"),
  receiveFile,
  uploadHandler("documents", ["application/pdf"]),
);

export { router as uploadsRouter };
