export interface UserProfile {
  nationality: string;
  profession: string;
  salary: number; // in JPY
  destinationCity: string;
  familySize: number;
}

export interface VisaResult {
  visaType: string;
  eligibility: string;
  requiredDocuments: string[];
  processingTime: string;
}

export interface HousingResult {
  recommendedAreas: string[];
  averageRent: number; // in JPY
  notes: string;
}

export interface SalaryResult {
  marketAverage: number; // in JPY
  salaryRating: string;
  recommendation: string;
}

export interface TaxResult {
  incomeTax: number; // in JPY
  residentTax: number; // in JPY
  healthInsurance: number; // in JPY
  pension: number; // in JPY
  monthlyTakeHome: number; // in JPY
}

export interface CostOfLivingResult {
  housing: number; // in JPY
  food: number; // in JPY
  transport: number; // in JPY
  utilities: number; // in JPY
  monthlyTotal: number; // in JPY
}

export interface RecommendationResult {
  relocationScore: number;
  recommendedArea: string;
  estimatedMonthlySavings: number; // in JPY
  risks: string[];
  nextSteps: string[];
}

export interface RelocationReport {
  reportId: string;
  createdAt: string;
  profile: UserProfile;
  results: {
    visa: VisaResult;
    housing: HousingResult;
    salary: SalaryResult;
    tax: TaxResult;
    cost: CostOfLivingResult;
    recommendation: RecommendationResult;
  };
  relocationScore: number;
}

export interface ExtractedJobProfile {
  companyName: string;
  jobTitle: string;
  salary: string;
  location: string;
}

export interface UploadRecord {
  uploadId: string;
  fileUrl: string;
  extractedData: ExtractedJobProfile;
}
