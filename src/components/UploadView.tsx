import React, { useState, useRef } from "react";
import { useRelocationStore } from "../store.js";
import {
  FileUp,
  FileText,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Briefcase,
  DollarSign,
  MapPin,
  Building,
  Sparkles,
  Play,
  ArrowRight
} from "lucide-react";
import { UserProfile } from "../types/relocation.types.js";

export default function UploadView() {
  const { uploadDocument, loadingState, extractedProfile, setExtractedProfile, analyzeRelocation } =
    useRelocationStore();

  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Editable fields for extracted job profile
  const [companyName, setCompanyName] = useState("");
  const [jobTitle, setJobTitle] = useState("");
  const [salaryText, setSalaryText] = useState("");
  const [locationText, setLocationText] = useState("");

  // Sync state when extractedProfile updates from store
  useState(() => {
    if (extractedProfile) {
      setCompanyName(extractedProfile.companyName || "");
      setJobTitle(extractedProfile.jobTitle || "");
      setSalaryText(extractedProfile.salary || "");
      setLocationText(extractedProfile.location || "");
    }
  });

  // Since React 19 or standard useState doesn't trigger side-effects directly during render, we check inside render or use standard synchronization
  const handleUpdateEditableFields = () => {
    if (extractedProfile && companyName === "" && jobTitle === "") {
      setCompanyName(extractedProfile.companyName || "");
      setJobTitle(extractedProfile.jobTitle || "");
      setSalaryText(extractedProfile.salary || "");
      setLocationText(extractedProfile.location || "");
    }
  };

  handleUpdateEditableFields();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      await processFile(files[0]);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFile(files[0]);
    }
  };

  const processFile = async (file: File) => {
    const allowedTypes = ["application/pdf", "image/png", "image/jpeg", "image/jpg"];
    if (!allowedTypes.includes(file.type)) {
      alert("Invalid file format. Please upload PDF, PNG or JPG files.");
      return;
    }
    // Perform upload
    await uploadDocument(file);
  };

  const handleTriggerAnalysis = () => {
    // Attempt to parse out a clean salary number from text (e.g. 8M, 8,000,000, etc.)
    const cleanSalaryText = salaryText.replace(/,/g, "");
    const match = cleanSalaryText.match(/\d+/);
    let parsedSalary = 8000000; // default fallback JPY
    if (match) {
      const parsedVal = Number(match[0]);
      if (parsedVal > 100000) {
        parsedSalary = parsedVal;
      } else if (parsedVal > 0) {
        // Assume e.g. "8" or "8M" means 8 million JPY
        parsedSalary = parsedVal * 1000000;
      }
    }

    // Attempt to extract city
    let city = "Tokyo";
    if (locationText.toLowerCase().includes("osaka")) city = "Osaka";
    else if (locationText.toLowerCase().includes("kyoto")) city = "Kyoto";
    else if (locationText.toLowerCase().includes("fukuoka")) city = "Fukuoka";
    else if (locationText.toLowerCase().includes("nagoya")) city = "Nagoya";

    const profile: UserProfile = {
      nationality: "India", // default
      profession: jobTitle || "Software Engineer",
      salary: parsedSalary,
      destinationCity: city,
      familySize: 2, // default standard couple
    };

    // Trigger analysis - this will set activeTab to "agents" to show running agents
    analyzeRelocation(profile);
  };

  return (
    <div className="flex-1 overflow-y-auto bg-transparent text-slate-700 p-8 flex flex-col min-h-screen">
      <div className="max-w-3xl mx-auto w-full flex-1 flex flex-col gap-8 justify-center">
        {/* Title */}
        <div className="text-center animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-100/50 flex items-center justify-center mx-auto mb-4 text-indigo-600 shadow-md shadow-indigo-100/10">
            <FileText className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-extrabold text-slate-800 tracking-tight">
            Scan Your Japan Job Offer
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto leading-relaxed">
            Upload your Japanese job contract, employment offer PDF or image.
            Gemini Vision will extract profile data automatically.
          </p>
        </div>

        {/* Drag & Drop Area */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={`border-2 border-dashed rounded-3xl p-10 flex flex-col items-center justify-center gap-4 text-center cursor-pointer transition-all ${
            isDragOver
              ? "border-indigo-500 bg-indigo-50/50 shadow-lg shadow-indigo-100/10"
              : "border-slate-200 hover:border-indigo-400 bg-white/40 shadow-xl shadow-slate-200/10 backdrop-blur-md"
          }`}
        >
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept=".pdf,.png,.jpg,.jpeg"
            className="hidden"
          />

          <div className="w-14 h-14 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-500 shadow-sm">
            {loadingState.uploading ? (
              <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
            ) : (
              <FileUp className="w-6 h-6 text-indigo-500" />
            )}
          </div>

          <div>
            <span className="font-semibold text-sm text-slate-800 block">
              {loadingState.uploading ? "Analyzing document..." : "Drag and drop your file here"}
            </span>
            <span className="text-xs text-slate-400 block mt-1">
              Supports PDF, PNG, and JPG (Max 10MB)
            </span>
          </div>

          {loadingState.uploading && (
            <div className="w-full max-w-xs mt-2">
              <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all duration-300"
                  style={{ width: `${loadingState.uploadProgress}%` }}
                ></div>
              </div>
              <span className="text-[10px] text-indigo-600 mt-1.5 font-mono block font-bold">
                GEMINI VISION PROCESSING ({loadingState.uploadProgress}%)
              </span>
            </div>
          )}
        </div>

        {/* Extracted Profile Editor */}
        {extractedProfile && (
          <div className="bg-white/50 border border-white/60 rounded-3xl p-8 backdrop-blur-xl shadow-2xl animate-fade-in relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/5 blur-2xl rounded-full pointer-events-none"></div>

            <div className="flex items-center gap-2.5 mb-6 border-b border-slate-100 pb-4">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600 border border-emerald-100 shadow-sm">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-bold text-sm text-slate-800">Gemini Extraction Complete</h3>
                <p className="text-[10px] text-slate-500">
                  Verify or edit values before triggering multi-agent scoring.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Company Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Building className="w-3.5 h-3.5 text-slate-400" />
                  <span>Company Name</span>
                </label>
                <input
                  type="text"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>

              {/* Job Title */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Job Title</span>
                </label>
                <input
                  type="text"
                  value={jobTitle}
                  onChange={(e) => setJobTitle(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>

              {/* Salary */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  <span>Extracted Salary</span>
                </label>
                <input
                  type="text"
                  value={salaryText}
                  onChange={(e) => setSalaryText(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>

              {/* Location */}
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Extracted Location</span>
                </label>
                <input
                  type="text"
                  value={locationText}
                  onChange={(e) => setLocationText(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200 rounded-lg py-2 px-3 text-xs text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white transition-colors"
                />
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-end gap-3">
              <button
                onClick={() => setExtractedProfile(null)}
                className="py-2 px-4 rounded-lg bg-white hover:bg-slate-50 text-xs text-slate-500 hover:text-slate-700 transition-colors cursor-pointer border border-slate-200 shadow-sm"
              >
                Clear
              </button>
              <button
                onClick={handleTriggerAnalysis}
                className="py-2 px-5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
              >
                <span>Trigger Multi-Agent Scoring</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
