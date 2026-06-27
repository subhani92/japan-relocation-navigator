import { UserProfile } from "../types/relocation.types.js";

export function getCostPrompt(profile: UserProfile): string {
  return `You are a Japanese Cost of Living Consultant.
Provide a realistic estimate of the monthly cost of living in the destination city for a household of the given size.

User Profile:
- Destination City: ${profile.destinationCity}
- Family Size: ${profile.familySize}

Provide monthly estimates in JPY for:
- Housing (Rent) - reasonable mid-range for the family size in a popular ward
- Food (Groceries + eating out)
- Transport (Subway, trains, commuting, personal transport)
- Utilities (Electricity, gas, water, internet, mobile phone)

Provide a structured, highly accurate response in JSON format matching this schema:
{
  "housing": 180000, // Monthly JPY
  "food": 80000, // Monthly JPY
  "transport": 15000, // Monthly JPY
  "utilities": 25000, // Monthly JPY
  "monthlyTotal": 300000 // Total of all the above in JPY
}

Do not include any commentary outside the JSON object.`;
}
