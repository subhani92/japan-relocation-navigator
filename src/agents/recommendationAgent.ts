import { UserProfile, RecommendationResult, VisaResult, HousingResult, SalaryResult, TaxResult, CostOfLivingResult } from "../types/relocation.types.js";
import { getRecommendationPrompt } from "../prompts/recommendation.prompt.js";
import { callGemini } from "../services/gemini.service.js";
import { Type } from "@google/genai";

const recommendationSchema = {
  type: Type.OBJECT,
  properties: {
    relocationScore: { type: Type.INTEGER },
    recommendedArea: { type: Type.STRING },
    estimatedMonthlySavings: { type: Type.INTEGER },
    risks: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    nextSteps: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ["relocationScore", "recommendedArea", "estimatedMonthlySavings", "risks", "nextSteps"]
};

export async function runRecommendationAgent(
  profile: UserProfile,
  visa: VisaResult,
  housing: HousingResult,
  salary: SalaryResult,
  tax: TaxResult,
  cost: CostOfLivingResult
): Promise<RecommendationResult> {
  const prompt = getRecommendationPrompt(profile, visa, housing, salary, tax, cost);
  return callGemini<RecommendationResult>(prompt, recommendationSchema);
}
