import { UserProfile } from "../types/relocation.types.js";

export function getRecommendationPrompt(
  profile: UserProfile,
  visaResult: any,
  housingResult: any,
  salaryResult: any,
  taxResult: any,
  costResult: any
): string {
  return `You are the Lead Coordinator for Japan Relocation Navigator.
Review the user profile and the compiled reports from all specialized agents to produce a final, comprehensive Relocation Report and action plan.

User Profile:
- Nationality: ${profile.nationality}
- Profession: ${profile.profession}
- Offered Salary: ${profile.salary} JPY/year
- Destination City: ${profile.destinationCity}
- Family Size: ${profile.familySize}

Agent Reports:
1. Visa Agent Report: ${JSON.stringify(visaResult)}
2. Housing Agent Report: ${JSON.stringify(housingResult)}
3. Salary Agent Report: ${JSON.stringify(salaryResult)}
4. Tax Agent Report: ${JSON.stringify(taxResult)}
5. Cost of Living Agent Report: ${JSON.stringify(costResult)}

Synthesize the findings and calculate a final "Relocation Score" (out of 100), taking into account financial feasibility, career growth, visa path ease, and quality of life for the family size.

Provide a structured, highly accurate response in JSON format matching this schema:
{
  "relocationScore": 92, // An integer score between 0 and 100
  "recommendedArea": "The single best ward/suburb (e.g., 'Setagaya-ku, Tokyo')",
  "estimatedMonthlySavings": 205000, // Calculated as Take-Home Pay minus Cost of Living Total (can be negative if CoL exceeds pay)
  "risks": [
    "Risk 1 (e.g. 'High initial move-in cost of around 800,000 JPY')",
    "Risk 2 (e.g. 'Finding public schools for kids with limited Japanese')",
    "etc."
  ],
  "nextSteps": [
    "Step 1 (e.g., 'Submit point sheet to HR for COE application')",
    "Step 2 (e.g., 'Request corporate guarantor letter')",
    "etc."
  ]
}

Do not include any commentary outside the JSON object.`;
}
