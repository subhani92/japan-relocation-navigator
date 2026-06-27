import { UserProfile } from "../types/relocation.types.js";

export function getHousingPrompt(profile: UserProfile): string {
  return `You are a licensed Japanese Real Estate Housing Agent.
Recommend suitable residential areas/neighborhoods in the destination city based on the user's budget and family size.

User Profile:
- Destination City: ${profile.destinationCity}
- Offered Salary: ${profile.salary} JPY/year (Monthly gross: ${Math.round(profile.salary / 12)} JPY)
- Family Size: ${profile.familySize}

Rule of Thumb: Housing rent should ideally not exceed 25-30% of the gross monthly income.
- Family size of 1: Studio / 1K / 1LDK
- Family size of 2: 1LDK / 2DK / 2LDK
- Family size of 3+: 2LDK / 3DK / 3LDK

Provide a structured, highly accurate recommendation in JSON format matching this schema:
{
  "recommendedAreas": [
    "Area 1 (with a brief description of why, e.g., 'Kichijoji (Family friendly, parks)')",
    "Area 2 (with description)",
    "Area 3 (with description)"
  ],
  "averageRent": 180000, // Estimated monthly rent in JPY for a suitable unit size in these areas
  "notes": "Advice on upfront keys fees like Shikikin, Reikin, guarantor agency requirements, and search timelines."
}

Do not include any commentary outside the JSON object.`;
}
