import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { coordinateRelocationAnalysis } from "../coordinator/relocationCoordinator.js";
import { firestoreService } from "../services/firestore.service.js";

const router = Router();

// Zod Validation Schema for Relocation Request
const relocationAnalyzeSchema = z.object({
  nationality: z.string().min(1, "Nationality is required"),
  profession: z.string().min(1, "Profession is required"),
  salary: z.number().min(0, "Salary must be a non-negative number"),
  destinationCity: z.string().min(1, "Destination city is required"),
  familySize: z.number().int().min(1, "Family size must be at least 1"),
});

router.post("/analyze", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    // Validate payload
    const profile = relocationAnalyzeSchema.parse(req.body);

    console.log("Analyzing relocation for:", profile);
    // Execute multi-agent analysis
    const report = await coordinateRelocationAnalysis(profile);

    // Save report to database
    await firestoreService.saveReport(report);

    // Return the response as requested
    res.json({
      reportId: report.reportId,
      status: "completed",
      relocationScore: report.relocationScore,
    });
  } catch (error) {
    next(error);
  }
});

export const relocationRoutes = router;
export default router;
