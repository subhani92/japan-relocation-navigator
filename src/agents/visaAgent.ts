import { UserProfile, VisaResult } from "../types/relocation.types.js";
import { getVisaPrompt } from "../prompts/visa.prompt.js";
import { callGemini } from "../services/gemini.service.js";
import { Type } from "@google/genai";

const visaSchema = {
  type: Type.OBJECT,
  properties: {
    visaType: { type: Type.STRING },
    eligibility: { type: Type.STRING },
    requiredDocuments: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    processingTime: { type: Type.STRING }
  },
  required: ["visaType", "eligibility", "requiredDocuments", "processingTime"]
};

export async function runVisaAgent(profile: UserProfile): Promise<VisaResult> {
  const prompt = getVisaPrompt(profile);
  return callGemini<VisaResult>(prompt, visaSchema);
}
