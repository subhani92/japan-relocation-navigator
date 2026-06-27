import { FormEvent, useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";
import { useRelocationStore } from "../store.js";
import {
  Sparkles,
  Shield,
  Home,
  Briefcase,
  Coins,
  MapPin,
  CheckCircle2,
  ListTodo,
  Download,
  Calendar,
  Building,
  ArrowUpRight,
  TrendingUp,
  AlertTriangle,
  FileCheck2,
  Plus
} from "lucide-react";

export default function ReportView() {
  const { report, agentResults, userProfile } = useRelocationStore();

  const [checkedSteps, setCheckedSteps] = useState<Record<string, boolean>>({
    "Confirm COE support with your employer": false,
    "Prepare visa and relocation documents": false,
    "Secure a guarantor service and submit rental application": false,
    "Register address at ward office within 14 days of arrival": false,
    "Open bank account (Japan Post or Sony Bank)": false,
  });

  if (!report || !agentResults || !userProfile) {
    return (
      <div className="flex-1 bg-transparent text-slate-500 flex flex-col items-center justify-center p-8 text-center min-h-screen">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-4 text-indigo-600 shadow-sm shadow-indigo-100/10 animate-pulse">
          <FileCheck2 className="w-8 h-8" />
        </div>
        <h3 className="text-slate-800 font-bold text-lg">No Active Relocation Report</h3>
        <p className="text-xs text-slate-500 max-w-sm mt-1 leading-relaxed">
          Complete your profile on the Dashboard tab or load a demo to generate a comprehensive relocation score and guide.
        </p>
      </div>
    );
  }

  const { visa, housing, salary, tax, cost, recommendation } = agentResults;
  const reportRef = useRef<HTMLDivElement | null>(null);
  const [showGuarantorBanner, setShowGuarantorBanner] = useState(true);
  const [followupQuestion, setFollowupQuestion] = useState("");
  const [followupAnswer, setFollowupAnswer] = useState("");
  const [followupStatus, setFollowupStatus] = useState("idle");
  const [followupError, setFollowupError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  const toggleStep = (step: string) => {
    setCheckedSteps((prev) => ({
      ...prev,
      [step]: !prev[step],
    }));
  };

  const formatJPY = (val: number) => {
    return new Intl.NumberFormat("ja-JP", {
      style: "currency",
      currency: "JPY",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // Prepare salary comparison bar data
  const offeredSalary = userProfile.salary;
  const marketAverage = salary?.marketAverage || 7200000;
  const salaryPercent = Math.round((offeredSalary / (offeredSalary + marketAverage)) * 100);

  // Prepare tax breakdown values
  const incomeTaxVal = tax?.incomeTax || 450000;
  const residentTaxVal = tax?.residentTax || 520000;
  const pensionVal = tax?.pension || 580000;
  const healthInsuranceVal = tax?.healthInsurance || 380000;
  const takeHomeVal = tax?.monthlyTakeHome ? tax.monthlyTakeHome * 12 : offeredSalary - (incomeTaxVal + residentTaxVal + pensionVal + healthInsuranceVal);

  const taxTotal = incomeTaxVal + residentTaxVal + pensionVal + healthInsuranceVal;
  const takeHomePercent = Math.round((takeHomeVal / offeredSalary) * 100);
  const taxPercent = Math.round((taxTotal / offeredSalary) * 100);

  // Budget details
  const budgetRent = cost?.housing || 180000;
  const budgetFood = cost?.food || 80000;
  const budgetUtilities = cost?.utilities || 25000;
  const budgetTransport = cost?.transport || 15000;
  const budgetTotal = cost?.monthlyTotal || (budgetRent + budgetFood + budgetUtilities + budgetTransport);

  const monthlyTakeHome = tax?.monthlyTakeHome || Math.round(takeHomeVal / 12);
  const monthlySavings = monthlyTakeHome - budgetTotal;

  const scoreValue = report.relocationScore != null ? report.relocationScore : recommendation?.relocationScore;
  const scoreDisplay = scoreValue != null ? `${scoreValue} / 100` : "— / 100";

  const rentRangeLabel = (area: string) => {
    const normalized = area.toLowerCase();
    if (normalized.includes("setagaya")) return "¥160,000–200,000/mo";
    if (normalized.includes("koto")) return "¥150,000–180,000/mo";
    if (normalized.includes("nakano")) return "¥130,000–160,000/mo";
    return housing?.averageRent ? `${formatJPY(housing.averageRent)}/mo` : "Estimate unavailable";
  };

  const genericRisks = (recommendation?.risks || []).filter((risk: string) => !/guarantor/i.test(risk));
  const displayRisks = genericRisks.length > 0 ? genericRisks : [
    "High initial key money (Shikikin/Reikin) requiring several months of rent upfront.",
    "Tax bracket updates on year 2 onwards when resident taxes begin calculation based on Year 1 earnings.",
    "Less flexible lease renewal terms for expats in central Tokyo neighborhoods.",
  ];

  const roadmapSteps = [
    {
      title: "Confirm COE support with your employer",
      timeframe: "Week 1",
      note: "must be completed first",
    },
    {
      title: "Prepare visa and relocation documents",
      timeframe: "Week 1–2",
      note: "supports the COE application",
    },
    {
      title: "Secure a guarantor service and submit rental application",
      timeframe: "Week 2–3",
      note: "requires employer documentation and your lease choice",
    },
    {
      title: "Register address at ward office within 14 days of arrival",
      timeframe: "Day 1–14",
      note: "must be completed soon after moving into your new home",
    },
    {
      title: "Open bank account (Japan Post or Sony Bank)",
      timeframe: "Week 3–4",
      note: "requires address registration first",
    },
  ];

  const exportPdf = async () => {
    if (!reportRef.current) return;
    setIsExporting(true);

    try {
      const canvas = await html2canvas(reportRef.current, { scale: 2, useCORS: true });
      const imageData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({ unit: "px", format: "a4" });
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
      pdf.addImage(imageData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Japan-Relocation-Plan-${report.reportId}.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Unable to generate PDF at this time. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  const submitFollowup = async (event: FormEvent) => {
    event.preventDefault();
    if (!followupQuestion.trim()) return;

    setFollowupStatus("loading");
    setFollowupAnswer("");
    setFollowupError(null);

    try {
      const response = await fetch("/api/report/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reportId: report.reportId, question: followupQuestion, report }),
      });

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text || response.statusText);
      }

      const data = await response.json();
      setFollowupAnswer(data.answer || "No response returned.");
      setFollowupStatus("idle");
    } catch (error) {
      setFollowupStatus("error");
      setFollowupError(error instanceof Error ? error.message : String(error));
    }
  };

  return (
    <div className="flex-1 overflow-y-auto bg-transparent text-slate-700 p-8 flex flex-col min-h-screen">
      <div ref={reportRef} className="max-w-5xl mx-auto w-full flex-1 flex flex-col gap-8">
        {showGuarantorBanner && (
          <div className="rounded-3xl border border-amber-200 bg-amber-50 p-5 shadow-sm text-amber-900 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-amber-900 shrink-0" />
              <div className="text-sm leading-relaxed">
                <span className="font-semibold">Key Risk:</span> Most Tokyo landlords require a Japanese guarantor. Budget ¥50,000–100,000 for a guarantor service such as Global Trust Networks or Roombanker.
              </div>
            </div>
            <button
              onClick={() => setShowGuarantorBanner(false)}
              className="text-amber-900/80 hover:text-amber-900 text-xs font-semibold"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Header Summary */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <div className="flex items-center gap-2 text-slate-600 text-xs font-semibold uppercase tracking-wider mb-1.5 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Your Japan Relocation Plan is Ready</span>
            </div>
            <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
              Japan Relocation Plan for {userProfile.profession}
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
              Built for <span className="text-slate-800 font-semibold">{userProfile.destinationCity}</span> with a family of <span className="text-slate-800 font-semibold">{userProfile.familySize}</span>. Based on your salary of {formatJPY(userProfile.salary)}/yr.
            </p>
          </div>

          <button
            onClick={exportPdf}
            className="px-4 py-2 rounded-lg bg-white/60 hover:bg-white border border-slate-200/60 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-all flex items-center gap-1.5 cursor-pointer shadow-sm shadow-slate-100"
          >
            <Download className="w-4 h-4" />
            <span>{isExporting ? "Generating PDF..." : "Download Plan PDF"}</span>
          </button>
        </div>

        <div className="rounded-3xl border border-amber-200 bg-amber-50 p-4 shadow-sm text-amber-900">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-sm font-bold">Key Relocation Risk</h3>
              <p className="text-xs text-amber-900/90 leading-relaxed">
                Most Tokyo landlords require a Japanese guarantor. Budget ¥50,000–100,000 for a guarantor service such as Global Trust Networks or Roombanker.
              </p>
            </div>
            <div className="rounded-full bg-amber-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-amber-900 inline-flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" /> Guarantor Requirement
            </div>
          </div>
        </div>

        {/* Bento Grid Top Level: Score and Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Relocation Score - Large Circular component */}
          <div className="bg-white/50 border border-white/60 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col items-center justify-center text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none"></div>

            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
              Relocation Feasibility Score
            </h3>

            {/* Circular Gauge */}
            <div className="relative w-36 h-36 flex items-center justify-center mb-3">
              {/* Outer track */}
              <svg className="absolute w-full h-full transform -rotate-90">
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  className="text-slate-100"
                />
                <circle
                  cx="72"
                  cy="72"
                  r="62"
                  stroke="currentColor"
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={2 * Math.PI * 62}
                  strokeDashoffset={2 * Math.PI * 62 * (1 - (scoreValue || 0) / 100)}
                  className="text-indigo-600 transition-all duration-1000"
                />
              </svg>
              <div className="text-center">
                <span className="text-4xl font-extrabold text-slate-800 block leading-none">
                  {scoreDisplay}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-bold tracking-widest mt-1.5 block">
                  Feasibility Score
                </span>
              </div>
            </div>

            <span className="text-xs font-bold text-indigo-600 flex items-center gap-1 bg-indigo-50 border border-indigo-100 px-2.5 py-1 rounded-full shadow-sm shadow-indigo-100/10">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{recommendation?.recommendedArea || "High feasibility profile"}</span>
            </span>
          </div>

          {/* Savings & Budget Metrics Card */}
          <div className="bg-white/50 border border-white/60 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between md:col-span-2 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/5 blur-3xl rounded-full pointer-events-none"></div>

            <div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100 inline-block mb-3 uppercase tracking-wider">
                Financial Summary
              </span>
              <h4 className="text-xl font-bold text-slate-800 mb-2">
                Monthly Savings Potential
              </h4>
              <p className="text-xs text-slate-500 leading-relaxed mb-4">
                After accounting for all Japanese tax bands, national pension, social healthcare contributions, and standard cost of living expenses for a household of {userProfile.familySize}.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4 border-t border-slate-100 pt-4">
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Net Monthly Income</span>
                <span className="text-base font-extrabold text-slate-800 mt-1 block">
                  {formatJPY(monthlyTakeHome)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider">Estimated Outflow</span>
                <span className="text-base font-extrabold text-slate-600 mt-1 block">
                  {formatJPY(budgetTotal)}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-semibold block uppercase tracking-wider font-bold">Net Monthly Savings</span>
                <span className="text-base font-extrabold text-emerald-600 mt-1 block">
                  {formatJPY(monthlySavings)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Visa Summary */}
          <div className="bg-white/50 border border-white/60 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/5 blur-2xl rounded-full pointer-events-none"></div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
                  <Shield className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Visa & Eligibility Analysis</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Visa guidance and eligibility summary</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Visa Type Recommended</span>
                  <span className="text-sm font-semibold text-slate-800 block mt-1">
                    {visa?.visaType || "Engineer/Specialist in Humanities Visa"}
                  </span>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Eligibility Basis</span>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {visa?.eligibility || "Eligible under specialized engineering criteria."}
                  </p>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Required Core Documents</span>
                  <ul className="space-y-1.5">
                    {(visa?.requiredDocuments || []).map((doc: string, idx: number) => (
                      <li key={idx} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0"></span>
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                <span>Processing Time:</span>
              </span>
              <span className="font-semibold text-blue-600">{visa?.processingTime || "1 to 2 months"}</span>
            </div>
          </div>

          {/* Housing Recommendations */}
          <div className="bg-white/50 border border-white/60 rounded-3xl p-6 shadow-xl backdrop-blur-md flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none"></div>

            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <Home className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Residential Housing Advice</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Housing and neighborhood recommendations</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block mb-2">Recommended Neighborhoods</span>
                  <div className="space-y-2">
                    {(housing?.recommendedAreas || []).map((area: string, idx: number) => (
                      <div key={idx} className="p-2.5 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-2 shadow-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-indigo-500 flex-shrink-0" />
                          <span className="text-xs text-slate-700 font-semibold leading-relaxed">{area}</span>
                        </div>
                        <span className="text-[10px] text-slate-500">Estimated rent range: {rentRangeLabel(area)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Housing Search Insights</span>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                    {housing?.notes || "Japanese landlords typically require a guarantor and upfront move-in key fees."}
                  </p>
                </div>
              </div>
            </div>

            <div className="border-t border-slate-100 pt-4 mt-6 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Coins className="w-4 h-4 text-slate-400" />
                <span>Est. Mid-Range Rent:</span>
              </span>
              <span className="font-semibold text-emerald-600">{formatJPY(budgetRent)}/mo</span>
            </div>
          </div>

          {/* Salary Analysis */}
          <div className="bg-white/50 border border-white/60 rounded-3xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
                <Briefcase className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800">Salary Competitiveness</h3>
                <p className="text-[10px] text-slate-400 font-medium">Salary market comparison summary</p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Offered Salary Status</span>
                <span className="text-sm font-semibold text-purple-600 block mt-1">
                  {salary?.salaryRating || "Well Above Market Standard"}
                </span>
              </div>

              {/* Custom bar chart representation */}
              <div className="space-y-3 pt-2">
                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span>Your Offered Salary</span>
                    <span className="font-bold text-slate-800">{formatJPY(offeredSalary)}/yr</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-500 rounded-full" style={{ width: "90%" }}></div>
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                    <span>Tokyo Market Baseline Standard</span>
                    <span className="font-semibold text-slate-700">{formatJPY(marketAverage)}/yr</span>
                  </div>
                  <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-slate-400 rounded-full" style={{ width: "75%" }}></div>
                  </div>
                </div>
              </div>

              <p className="text-xs text-slate-500 leading-relaxed pt-2 border-t border-slate-100">
                {salary?.recommendation || "Your compensation provides excellent budget headroom."}
              </p>
            </div>
          </div>

          {/* Tax Breakdown */}
          <div className="bg-white/50 border border-white/60 rounded-3xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                <Coins className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800">Annual Tax & Pension Outflow</h3>
                <p className="text-[10px] text-slate-400 font-medium">Estimate of national taxes, insurance, and pensions</p>
              </div>
            </div>

            <div className="space-y-4">
              {/* Visual Split */}
              <div>
                <div className="h-3 w-full rounded-full overflow-hidden flex mb-2">
                  <div className="h-full bg-emerald-500" style={{ width: `${takeHomePercent}%` }}></div>
                  <div className="h-full bg-amber-500" style={{ width: `${taxPercent}%` }}></div>
                </div>
                <div className="flex items-center gap-4 text-[10px] text-slate-500">
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-emerald-500"></span>
                    <span>Take-Home Pay ({takeHomePercent}%)</span>
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-2.5 h-2.5 rounded bg-amber-500"></span>
                    <span>Taxes & Insurance ({taxPercent}%)</span>
                  </span>
                </div>
              </div>

              {/* Numbers */}
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Annual Income Tax</span>
                  <span className="font-semibold text-slate-800">{formatJPY(incomeTaxVal)}</span>
                </div>
                <div className="space-y-1 py-1 border-b border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-500">Annual Resident Tax (Year 2 onwards)</span>
                    <span className="font-semibold text-slate-800">{formatJPY(residentTaxVal)}</span>
                  </div>
                  <p className="text-[10px] text-slate-500 leading-relaxed">
                    Note: Resident Tax is not charged in Year 1. From Month 13 onwards, expect an additional ¥43,000/mo outflow based on your Year 1 earnings.
                  </p>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">Health Insurance (Shakai Hoken)</span>
                  <span className="font-semibold text-slate-800">{formatJPY(healthInsuranceVal)}</span>
                </div>
                <div className="flex items-center justify-between py-1 border-b border-slate-100">
                  <span className="text-slate-500">National Employee Pension Contribution</span>
                  <span className="font-semibold text-slate-800">{formatJPY(pensionVal)}</span>
                </div>
                <div className="flex items-center justify-between py-1 pt-2">
                  <span className="font-bold text-slate-700">Total Outflow Deductions</span>
                  <span className="font-bold text-amber-600">{formatJPY(taxTotal)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Budget Outflows */}
          <div className="bg-white/50 border border-white/60 rounded-3xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-pink-50 text-pink-600 border border-pink-100">
                  <TrendingUp className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-slate-800">Monthly Cost of Living Budget</h3>
                  <p className="text-[10px] text-slate-400 font-medium">Living expense projections for household size of {userProfile.familySize}</p>
                </div>
              </div>
              <span className="text-xs font-bold text-pink-600 bg-pink-50 border border-pink-100 px-2.5 py-1 rounded-full">{formatJPY(budgetTotal)}/mo Total</span>
            </div>

            {/* Custom Bar Chart representing Rent, Food, Utilities, Transport */}
            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Housing Rent</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block">{formatJPY(budgetRent)}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-pink-500" style={{ width: "65%" }}></div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Food / Groceries</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block">{formatJPY(budgetFood)}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-pink-500" style={{ width: "40%" }}></div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Utilities / Telco</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block">{formatJPY(budgetUtilities)}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-pink-500" style={{ width: "20%" }}></div>
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex flex-col justify-between shadow-sm">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Transportation</span>
                  <span className="text-sm font-bold text-slate-800 mt-1 block">{formatJPY(budgetTransport)}</span>
                </div>
                <div className="w-full bg-slate-200 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="h-full bg-pink-500" style={{ width: "10%" }}></div>
                </div>
              </div>
            </div>
          </div>

          {/* Risks & Warning Card */}
          <div className="bg-white/50 border border-white/60 rounded-3xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-rose-50 text-rose-600 border border-rose-100">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800">Financial Risk Summary</h3>
                <p className="text-[10px] text-slate-400 font-medium">Keep these priority risks top of mind.</p>
              </div>
            </div>

            <ul className="space-y-3">
              {displayRisks.map((risk: string, idx: number) => (
                <li key={idx} className="text-xs text-slate-600 flex items-start gap-3 bg-rose-50/30 p-3 rounded-xl border border-rose-100">
                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mt-1.5 flex-shrink-0"></span>
                  <span className="leading-relaxed">{risk}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Action Plan Checklist */}
          <div className="bg-white/50 border border-white/60 rounded-3xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600 border border-indigo-100">
                <ListTodo className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800">Relocation Action Roadmap</h3>
                <p className="text-[10px] text-slate-400 font-medium">Toggle steps as you make progress on relocation</p>
              </div>
            </div>

            <div className="space-y-2.5">
              {roadmapSteps.map((step, idx) => {
                const isChecked = !!checkedSteps[step.title];
                return (
                  <button
                    key={idx}
                    onClick={() => toggleStep(step.title)}
                    className={`w-full text-left p-3 rounded-2xl border flex flex-col gap-3 transition-all cursor-pointer shadow-sm ${
                      isChecked
                        ? "bg-indigo-50 border-indigo-200 text-slate-800"
                        : "bg-white/30 border-slate-200/80 text-slate-600 hover:border-slate-300 hover:bg-white"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-xs leading-normal font-semibold">{step.title}</span>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">{step.timeframe}</span>
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <span className="text-[10px] text-slate-500">{step.note}</span>
                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center transition-all flex-shrink-0 ${
                          isChecked
                            ? "bg-indigo-600 border-indigo-500 text-white shadow-md shadow-indigo-600/10"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && <span className="text-xs font-bold">✓</span>}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Follow-up Question Input */}
          <div className="bg-white/50 border border-white/60 rounded-3xl p-6 shadow-xl backdrop-blur-md relative overflow-hidden lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-2 rounded-xl bg-slate-100 text-slate-700 border border-slate-200">
                <Plus className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800">Ask a follow-up question about your plan</h3>
                <p className="text-[10px] text-slate-400 font-medium">Your question will be answered using your full report context.</p>
              </div>
            </div>

            <form onSubmit={submitFollowup} className="space-y-4">
              <div>
                <label htmlFor="followupQuestion" className="text-[10px] uppercase tracking-widest text-slate-500 font-semibold">Question</label>
                <textarea
                  id="followupQuestion"
                  value={followupQuestion}
                  onChange={(event) => setFollowupQuestion(event.target.value)}
                  placeholder="What if my salary was ¥6,000,000 instead?"
                  className="mt-2 w-full min-h-[104px] rounded-3xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100"
                />
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <button
                  type="submit"
                  disabled={followupStatus === "loading"}
                  className="inline-flex items-center justify-center rounded-2xl bg-indigo-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-300"
                >
                  {followupStatus === "loading" ? "Getting answer..." : "Submit Question"}
                </button>
                {followupStatus === "error" && followupError && (
                  <span className="text-xs text-rose-600">{followupError}</span>
                )}
              </div>

              {followupAnswer && (
                <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                  <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500 mb-2">Answer</h4>
                  <p className="whitespace-pre-line leading-relaxed">{followupAnswer}</p>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
