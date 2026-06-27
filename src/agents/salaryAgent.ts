import { UserProfile, SalaryResult } from "../types/relocation.types.js";
import { getSalaryPrompt } from "../prompts/salary.prompt.js";
import { callGemini } from "../services/gemini.service.js";
import { Type } from "@google/genai";

const salarySchema = {
  type: Type.OBJECT,
  properties: {
    marketAverage: { type: Type.INTEGER },
    salaryRating: { type: Type.STRING },
    recommendation: { type: Type.STRING }
  },
  required: ["marketAverage", "salaryRating", "recommendation"]
};

export async function runSalaryAgent(profile: UserProfile): Promise<SalaryResult> {
  const prompt = getSalaryPrompt(profile);
  return callGemini<SalaryResult>(prompt, salarySchema);
}
