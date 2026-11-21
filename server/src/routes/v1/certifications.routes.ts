import { Router, type Request, type Response } from "express";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import {
  createCertification,
  deleteCertification,
  getCertifications,
  updateCertification,
} from "../../services/certification.service.js";
import { z } from "zod";

const router = Router();

function respondError(res: Response, error: unknown) {
  if (error instanceof z.ZodError) {
    res.status(400).json({ success: false, error: error.issues[0]?.message || "Invalid certification data." });
    return;
  }
  if (typeof error === "object" && error !== null && "code" in error && error.code === "P2025") {
    res.status(404).json({ success: false, error: "Certification not found." });
    return;
  }
  console.error("[certifications] Request failed:", error);
  res.status(500).json({ success: false, error: "Certification request failed." });
}

router.get("/", async (_req: Request, res: Response) => {
  try {
    res.json({ success: true, data: await getCertifications() });
  } catch (error) {
    respondError(res, error);
  }
});

router.post("/", authenticate, authorize("ADMIN"), async (req: Request, res: Response) => {
  try {
    res.status(201).json({ success: true, data: await createCertification(req.body) });
  } catch (error) {
    respondError(res, error);
  }
});

router.put("/:id", authenticate, authorize("ADMIN"), async (req: Request, res: Response) => {
  try {
    res.json({ success: true, data: await updateCertification(String(req.params.id), req.body) });
  } catch (error) {
    respondError(res, error);
  }
});

router.delete("/:id", authenticate, authorize("ADMIN"), async (req: Request, res: Response) => {
  try {
    await deleteCertification(String(req.params.id));
    res.json({ success: true, data: {} });
  } catch (error) {
    respondError(res, error);
  }
});

export { router as certificationsRouter };
