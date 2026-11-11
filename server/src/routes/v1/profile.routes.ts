import { Router, type Request, type Response } from "express";
import { z } from "zod";
import { authenticate, authorize } from "../../middleware/auth.middleware.js";
import { getSiteProfile, updateSiteProfile } from "../../services/profile.service.js";

const router = Router();

router.get("/", async (_req: Request, res: Response) => {
  try {
    const profile = await getSiteProfile();
    if (!profile) {
      res.status(404).json({ success: false, error: "Profile content has not been configured." });
      return;
    }
    res.json({ success: true, data: profile });
  } catch (error) {
    console.error("[profile] Profile load failed:", error);
    res.status(500).json({ success: false, error: "Unable to load profile content." });
  }
});

router.put("/", authenticate, authorize("ADMIN"), async (req: Request, res: Response) => {
  try {
    const profile = await updateSiteProfile(req.body);
    res.json({ success: true, data: profile });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ success: false, error: error.issues[0]?.message || "Invalid profile content." });
      return;
    }
    console.error("[profile] Profile update failed:", error);
    res.status(500).json({ success: false, error: "Unable to update profile content." });
  }
});

export { router as profileRouter };
