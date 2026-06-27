import { UserProfile } from "../types/relocation.types.js";

export function getTaxPrompt(profile: UserProfile): string {
  return `You are an expert Japanese Tax Advisor.
Calculate an estimate of annual Income Tax, Resident Tax (second-year estimate), National Health Insurance, and Employees Pension (Shakai Hoken) for the user's income in Japan.

User Profile:
- Offered Salary: ${profile.salary} JPY/year
- Destination City: ${profile.destinationCity}
- Family Size: ${profile.familySize} (number of dependents impacts tax deductions)

Use Japanese standard tax bands and insurance rates:
- Income tax: progressive from 5% to 45% with basic deduction
- Resident tax: roughly flat 10% of taxable income (waived in the 1st year, begins in the 2nd year)
- Health Insurance & Pension: roughly 14-15% of annual income combined

Provide a structured, highly accurate response in JSON format matching this schema:
{
  "incomeTax": 450000, // Estimated annual income tax in JPY
  "residentTax": 520000, // Estimated annual resident tax in JPY (second year onwards)
  "healthInsurance": 380000, // Estimated annual health insurance premium in JPY
  "pension": 580000, // Estimated annual pension contribution in JPY
  "monthlyTakeHome": 505800 // Calculated monthly take-home salary after all annual taxes/insurance divided by 12
}

Do not include any commentary outside the JSON object.`;
}
