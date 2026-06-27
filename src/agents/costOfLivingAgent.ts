import { UserProfile, CostOfLivingResult } from "../types/relocation.types.js";
import { getCostPrompt } from "../prompts/cost.prompt.js";
import { callGemini } from "../services/gemini.service.js";
import { Type } from "@google/genai";

const costSchema = {
  type: Type.OBJECT,
  properties: {
    housing: { type: Type.INTEGER },
    food: { type: Type.INTEGER },
    transport: { type: Type.INTEGER },
    utilities: { type: Type.INTEGER },
    monthlyTotal: { type: Type.INTEGER }
  },
  required: ["housing", "food", "transport", "utilities", "monthlyTotal"]
};

export async function runCostOfLivingAgent(profile: UserProfile): Promise<CostOfLivingResult> {
  const prompt = getCostPrompt(profile);
  return callGemini<CostOfLivingResult>(prompt, costSchema);
}
