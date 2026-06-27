import { UserProfile } from "../types/relocation.types.js";

export function getVisaPrompt(profile: UserProfile): string {
  return `You are a professional Japanese Immigration Attorney Agent.
Analyze the following user profile and recommend the best visa category to move to Japan.

User Profile:
- Nationality: ${profile.nationality}
- Profession: ${profile.profession}
- Offered/Target Salary: ${profile.salary} JPY/year
- Destination City: ${profile.destinationCity}
- Family Size: ${profile.familySize}

Provide a structured, highly accurate response in JSON format matching this schema:
{
  "visaType": "The specific Japanese Visa class (e.g. Highly Skilled Professional (HSP) i-b, Engineer/Specialist in Humanities/International Services, etc.)",
  "eligibility": "Clear analysis of the points or qualifications required (e.g., points calculation estimate, degree requirements, or years of experience)",
  "requiredDocuments": [
    "Document 1",
    "Document 2",
    "etc."
  ],
  "processingTime": "Estimated duration for Certificate of Eligibility (COE) and consular visa issuance (e.g., '1-3 months')"
}

Do not include any commentary outside the JSON object.`;
}
