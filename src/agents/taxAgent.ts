import { UserProfile, TaxResult } from "../types/relocation.types.js";
import { getTaxPrompt } from "../prompts/tax.prompt.js";
import { callGemini } from "../services/gemini.service.js";
import { Type } from "@google/genai";

const taxSchema = {
  type: Type.OBJECT,
  properties: {
    incomeTax: { type: Type.INTEGER },
    residentTax: { type: Type.INTEGER },
    healthInsurance: { type: Type.INTEGER },
    pension: { type: Type.INTEGER },
    monthlyTakeHome: { type: Type.INTEGER }
  },
  required: ["incomeTax", "residentTax", "healthInsurance", "pension", "monthlyTakeHome"]
};

export async function runTaxAgent(profile: UserProfile): Promise<TaxResult> {
  const prompt = getTaxPrompt(profile);
  return callGemini<TaxResult>(prompt, taxSchema);
}
