import { UserProfile, RelocationReport } from "../types/relocation.types.js";
import { runVisaAgent } from "../agents/visaAgent.js";
import { runHousingAgent } from "../agents/housingAgent.js";
import { runSalaryAgent } from "../agents/salaryAgent.js";
import { runTaxAgent } from "../agents/taxAgent.js";
import { runCostOfLivingAgent } from "../agents/costOfLivingAgent.js";
import { runRecommendationAgent } from "../agents/recommendationAgent.js";

export async function coordinateRelocationAnalysis(profile: UserProfile): Promise<RelocationReport> {
  console.log("Coordinating parallel multi-agent analysis for profile:", profile);

  // Parallel Execution of specialized agents
  const [visa, housing, salary, tax, cost] = await Promise.all([
    runVisaAgent(profile),
    runHousingAgent(profile),
    runSalaryAgent(profile),
    runTaxAgent(profile),
    runCostOfLivingAgent(profile),
  ]);

  console.log("All specialized agents finished, synthesizing recommendations...");

  // Synchronous pass to Recommendation Agent
  const recommendation = await runRecommendationAgent(profile, visa, housing, salary, tax, cost);

  const reportId = crypto.randomUUID();
  const report: RelocationReport = {
    reportId,
    createdAt: new Date().toISOString(),
    profile,
    results: {
      visa,
      housing,
      salary,
      tax,
      cost,
      recommendation,
    },
    relocationScore: recommendation.relocationScore,
  };

  return report;
}
