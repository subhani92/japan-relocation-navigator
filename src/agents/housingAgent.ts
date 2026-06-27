import { UserProfile, HousingResult } from "../types/relocation.types.js";
import { getHousingPrompt } from "../prompts/housing.prompt.js";
import { callGemini } from "../services/gemini.service.js";
import { Type } from "@google/genai";

const housingSchema = {
  type: Type.OBJECT,
  properties: {
    recommendedAreas: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    averageRent: { type: Type.INTEGER },
    notes: { type: Type.STRING }
  },
  required: ["recommendedAreas", "averageRent", "notes"]
};

export async function runHousingAgent(profile: UserProfile): Promise<HousingResult> {
  const prompt = getHousingPrompt(profile);
  return callGemini<HousingResult>(prompt, housingSchema);
}
