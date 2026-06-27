import React, { useState } from "react";
import { useRelocationStore } from "../store.js";
import { UserProfile } from "../types/relocation.types.js";
import {
  Sparkles,
  Play,
  ArrowRight,
  MapPin,
  Users,
  Briefcase,
  DollarSign,
  Flag,
  Compass,
  Coins,
  ShieldAlert,
  ChevronRight,
  FileCheck
} from "lucide-react";

export default function LandingView() {
  const { analyzeRelocation, runDemo, loadingState } = useRelocationStore();

  const [nationality, setNationality] = useState("India");
  const [profession, setProfession] = useState("Software Engineer");
  const [salary, setSalary] = useState("8000000");
  const [destinationCity, setDestinationCity] = useState("Tokyo");
  const [familySize, setFamilySize] = useState(2);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const profile: UserProfile = {
      nationality,
      profession,
      salary: Number(salary),
      destinationCity,
      familySize: Number(familySize),
    };
    analyzeRelocation(profile);
  };

  const handlePreloadDemo = () => {
    runDemo();
  };

  return (
    <div className="flex-1 overflow-y-auto bg-transparent text-slate-600 flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-16 pb-12 px-8 max-w-5xl mx-auto w-full">
        {/* Subtle Background Glows */}
        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-[500px] h-[150px] bg-indigo-300/20 blur-[100px] rounded-full pointer-events-none"></div>
        <div className="absolute top-20 left-1/3 w-[300px] h-[100px] bg-purple-300/20 blur-[120px] rounded-full pointer-events-none"></div>

        <div className="text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/60 border border-slate-200/50 text-xs text-indigo-600 font-medium mb-6 animate-fade-in shadow-sm shadow-indigo-100/5 backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Japan Relocation Intelligence Engine</span>
          </div>

          <h1 className="text-5xl font-extrabold tracking-tight mb-4 text-slate-800 sm:text-6xl">
            Relocate to Japan <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent">
              With AI-Guided Intelligence
            </span>
          </h1>

          <p className="text-slate-500 text-lg max-w-2xl mx-auto mb-8">
            An advanced multi-agent system orchestrating specialized visa, housing, tax, and salary
            counselors to compile your optimal relocation roadmap.
          </p>

          <div className="flex items-center justify-center gap-4">
            <button
              onClick={() => {
                const formElement = document.getElementById("profile-form");
                formElement?.scrollIntoView({ behavior: "smooth" });
              }}
              className="px-6 py-3 rounded-lg bg-indigo-600 hover:bg-indigo-500 font-semibold text-sm transition-all shadow-lg shadow-indigo-600/15 text-white flex items-center gap-2 cursor-pointer group"
            >
              <span>Build Relocation Profile</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>

            <button
              onClick={handlePreloadDemo}
              disabled={loadingState.analyzing}
              className="px-6 py-3 rounded-lg bg-white/60 hover:bg-white/90 border border-slate-200/60 font-semibold text-sm transition-all flex items-center gap-2 cursor-pointer text-indigo-600 hover:text-indigo-700 shadow-sm shadow-slate-100"
            >
              <Play className="w-4 h-4 fill-indigo-600/10 text-indigo-600" />
              <span>Run Hackathon Demo</span>
            </button>
          </div>
        </div>
      </section>

      {/* Grid of Specialized Agents */}
      <section className="py-8 px-8 max-w-5xl mx-auto w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md shadow-xl shadow-slate-200/20 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shadow-sm">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-800">Visa & Eligibility Agent</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Analyzes points system, professional eligibility, and COE requirements specific to your
              nationality.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md shadow-xl shadow-slate-200/20 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
              <Coins className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-800">Taxes & Social Insurance</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Calculates direct estimates for Shakai Hoken, Pension, Income Tax, and Resident Tax bands
              precisely.
            </p>
          </div>

          <div className="p-6 rounded-2xl border border-white/60 bg-white/40 backdrop-blur-md shadow-xl shadow-slate-200/20 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 shadow-sm">
              <MapPin className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-800">Housing & Living Agent</h3>
            <p className="text-slate-500 text-xs leading-relaxed">
              Curates neighborhood recommendations based on income limits, family needs, and commute convenience.
            </p>
          </div>
        </div>
      </section>

      {/* Relocation Form Form */}
      <section id="profile-form" className="py-12 px-8 max-w-3xl mx-auto w-full">
        <div className="bg-white/50 border border-white/60 rounded-3xl p-8 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/5 blur-2xl rounded-full pointer-events-none"></div>

          <div className="flex items-center gap-3 mb-6">
            <div className="p-2.5 rounded-xl bg-indigo-50 border border-indigo-100 text-indigo-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Relocation Assessment Profile</h2>
              <p className="text-xs text-slate-500">
                Input your current or potential offer details to initialize parallel agent analysis.
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Nationality */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                  <Flag className="w-3.5 h-3.5 text-slate-400" />
                  <span>Nationality / Passport</span>
                </label>
                <input
                  type="text"
                  required
                  value={nationality}
                  onChange={(e) => setNationality(e.target.value)}
                  placeholder="e.g. India"
                  className="w-full bg-white/80 border border-slate-200/80 rounded-lg py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/10 transition-colors"
                />
              </div>

              {/* Profession */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                  <Briefcase className="w-3.5 h-3.5 text-slate-400" />
                  <span>Profession / Role</span>
                </label>
                <input
                  type="text"
                  required
                  value={profession}
                  onChange={(e) => setProfession(e.target.value)}
                  placeholder="e.g. Software Engineer"
                  className="w-full bg-white/80 border border-slate-200/80 rounded-lg py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/10 transition-colors"
                />
              </div>

              {/* Salary in JPY */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-slate-400" />
                  <span>Annual Offered Salary (JPY)</span>
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-slate-400 text-sm font-semibold">¥</span>
                  <input
                    type="number"
                    required
                    value={salary}
                    onChange={(e) => setSalary(e.target.value)}
                    placeholder="e.g. 8000000"
                    className="w-full bg-white/80 border border-slate-200/80 rounded-lg py-2.5 pl-7.5 pr-3.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/10 transition-colors"
                  />
                </div>
              </div>

              {/* Destination City */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Destination City</span>
                </label>
                <select
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  className="w-full bg-white/80 border border-slate-200/80 rounded-lg py-2.5 px-3.5 text-sm text-slate-800 focus:outline-none focus:border-indigo-500 focus:bg-white focus:ring-1 focus:ring-indigo-500/10 transition-colors"
                >
                  <option value="Tokyo">Tokyo</option>
                  <option value="Osaka">Osaka</option>
                  <option value="Kyoto">Kyoto</option>
                  <option value="Fukuoka">Fukuoka</option>
                  <option value="Nagoya">Nagoya</option>
                </select>
              </div>

              {/* Family Size */}
              <div className="space-y-2 sm:col-span-2">
                <label className="text-xs font-semibold text-slate-600 flex items-center gap-2">
                  <Users className="w-3.5 h-3.5 text-slate-400" />
                  <span>Family Size (Including yourself)</span>
                </label>
                <div className="flex gap-4">
                  {[1, 2, 3, 4, 5].map((size) => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setFamilySize(size)}
                      className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all cursor-pointer ${
                        familySize === size
                          ? "bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/25"
                          : "bg-white/50 border-slate-200 text-slate-500 hover:text-slate-800 hover:border-slate-300 hover:bg-white"
                      }`}
                    >
                      {size === 1 ? "1 (Single)" : size === 2 ? "2 (Couple)" : size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-200/60 flex flex-col sm:flex-row gap-4">
              <button
                type="submit"
                disabled={loadingState.analyzing}
                className="flex-1 py-3 px-6 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-200 disabled:text-slate-400 font-bold text-sm text-white transition-all shadow-lg shadow-indigo-600/15 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{loadingState.analyzing ? "Analyzing..." : "Start Parallel AI Analysis"}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                type="button"
                onClick={handlePreloadDemo}
                disabled={loadingState.analyzing}
                className="py-3 px-6 rounded-lg bg-white/60 hover:bg-white border border-slate-200 font-semibold text-sm text-indigo-600 hover:text-indigo-700 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Play className="w-3.5 h-3.5 fill-indigo-600/10 text-indigo-600" />
                <span>Demo Profile (Indian Dev)</span>
              </button>
            </div>
          </form>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-8 max-w-5xl mx-auto w-full border-t border-slate-200/60">
        <h2 className="text-center font-extrabold text-2xl text-slate-800 mb-10 tracking-tight">
          System Orchestration Blueprint
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-2 relative">
            <div className="text-3xl font-extrabold text-slate-300 font-mono">01</div>
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <span>Submit Profile</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Provide relocation targets, nationality, offered compensation, or scan job contracts.
            </p>
          </div>

          <div className="flex flex-col gap-2 relative">
            <div className="text-3xl font-extrabold text-slate-300 font-mono">02</div>
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <span>Parallel Querying</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Specialized LLM Agents query localized databases for specific Visas, Taxes, and Housing.
            </p>
          </div>

          <div className="flex flex-col gap-2 relative">
            <div className="text-3xl font-extrabold text-slate-300 font-mono">03</div>
            <h4 className="font-bold text-sm text-slate-800 flex items-center gap-1.5">
              <span>Coordination Synthesis</span>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 hidden md:block" />
            </h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Coordinator model evaluates all reports to structure a composite Relocation Score.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <div className="text-3xl font-extrabold text-slate-300 font-mono">04</div>
            <h4 className="font-bold text-sm text-slate-800">Generate Roadmap</h4>
            <p className="text-xs text-slate-500 leading-relaxed">
              Obtain interactive tax calculations, living budgets, action checklists, and area advice.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
