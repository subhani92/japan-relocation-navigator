import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { Type } from "@google/genai";
import { firestoreService } from "../services/firestore.service.js";
import { callGemini } from "../services/gemini.service.js";

const router = Router();

// POST /api/report/ask - Ask a follow-up question using the full report context
// This must come BEFORE the GET /:reportId route to prevent catching
router.post("/ask", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const schema = z.object({
      reportId: z.string().min(1),
      question: z.string().min(1),
      report: z.any(),
    });
    const { question, report } = schema.parse(req.body);

    const prompt = `You are an expert Japan relocation advisor. Do not use any internal agent or technical jargon. The user has this relocation report context:

${JSON.stringify(report, null, 2)}

Answer the user's follow-up question clearly and directly. Question: "${question}"

Return only a JSON object with the following schema:
{ "answer": string }
`;

    const answer = await callGemini<{ answer: string }>(prompt, {
      type: Type.OBJECT,
      properties: {
        answer: { type: Type.STRING },
      },
      required: ["answer"],
    });

    res.json(answer);
  } catch (error) {
    next(error);
  }
});

// GET /api/report - Get list of all reports (for the sidebar/dashboard history)
router.get("/", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const reports = await firestoreService.getAllReports();
    res.json(reports);
  } catch (error) {
    next(error);
  }
});

// GET /api/report/:reportId - Get a single detailed report
router.get("/:reportId", async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { reportId } = req.params;
    console.log(`Fetching report for ID: ${reportId}`);

    const report = await firestoreService.getReport(reportId);

    if (!report) {
      res.status(404).json({ error: `Report with ID ${reportId} not found.` });
      return;
    }

    res.json(report);
  } catch (error) {
    next(error);
  }
});

export const reportRoutes = router;
export default router;
