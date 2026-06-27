import { useRelocationStore } from "../store.js";
import {
  LayoutDashboard,
  Cpu,
  FileText,
  FileUp,
  MapPin,
  Sparkles,
  History,
  TrendingUp
} from "lucide-react";

export default function Sidebar() {
  const { activeTab, setActiveTab, reportsList, fetchReportsHistory, loadReport, report } =
    useRelocationStore();

  const handleReportClick = async (reportId: string) => {
    await loadReport(reportId);
    setActiveTab("reports");
  };

  return (
    <aside className="w-80 bg-white/40 backdrop-blur-xl text-slate-700 flex flex-col border-r border-slate-200/50 h-screen select-none">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-200/50 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/10">
          <Sparkles className="w-5 h-5 text-white animate-pulse" />
        </div>
        <div>
          <h1 className="font-bold text-lg leading-tight tracking-tight text-slate-800">
            Japan Relocation
          </h1>
          <span className="text-[10px] font-mono tracking-widest text-indigo-600 font-bold uppercase">
            Navigator AI
          </span>
        </div>
      </div>

      {/* Main Navigation */}
      <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto">
        <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2">
          Core Navigation
        </span>

        <button
          onClick={() => setActiveTab("dashboard")}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "dashboard"
              ? "bg-indigo-600/10 text-indigo-700 font-semibold pl-3.5 border-l-2 border-indigo-500"
              : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
          }`}
        >
          <LayoutDashboard className="w-4 h-4" />
          <span>Dashboard</span>
        </button>

        <button
          onClick={() => setActiveTab("documents")}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "documents"
              ? "bg-indigo-600/10 text-indigo-700 font-semibold pl-3.5 border-l-2 border-indigo-500"
              : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
          }`}
        >
          <FileUp className="w-4 h-4" />
          <span>Offer Document</span>
        </button>

        <button
          onClick={() => setActiveTab("agents")}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "agents"
              ? "bg-indigo-600/10 text-indigo-700 font-semibold pl-3.5 border-l-2 border-indigo-500"
              : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Agent Activity</span>
        </button>

        <button
          onClick={() => setActiveTab("reports")}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
            activeTab === "reports"
              ? "bg-indigo-600/10 text-indigo-700 font-semibold pl-3.5 border-l-2 border-indigo-500"
              : "text-slate-500 hover:text-slate-800 hover:bg-white/50"
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>Active Report</span>
        </button>

        {/* History of Reports */}
        <div className="pt-6">
          <span className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-2 flex items-center gap-1.5">
            <History className="w-3 h-3 text-slate-400" />
            <span>Analysis History</span>
          </span>

          <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
            {reportsList.length === 0 ? (
              <div className="px-3 py-4 text-xs text-slate-400 italic border border-dashed border-slate-200 rounded-lg bg-white/20 text-center">
                No analyses run yet
              </div>
            ) : (
              reportsList.map((r) => (
                <button
                  key={r.reportId}
                  onClick={() => handleReportClick(r.reportId)}
                  className={`w-full text-left p-2.5 rounded-lg transition-all duration-150 border border-transparent ${
                    report?.reportId === r.reportId
                      ? "bg-white/80 text-slate-800 border-slate-200 shadow-sm"
                      : "text-slate-500 hover:bg-white/40 hover:text-slate-700"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold truncate block max-w-[150px]">
                      {r.profile.profession}
                    </span>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        r.relocationScore >= 80
                          ? "bg-emerald-500/10 text-emerald-600 border border-emerald-500/10"
                          : r.relocationScore >= 60
                          ? "bg-amber-500/10 text-amber-600 border border-amber-500/10"
                          : "bg-rose-500/10 text-rose-600 border border-rose-500/10"
                      }`}
                    >
                      Score {r.relocationScore}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-2.5 h-2.5" /> {r.profile.destinationCity}
                    </span>
                    <span>
                      {new Date(r.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </button>
              ))
            )}
          </div>
        </div>
      </nav>

      {/* Footer Info / Meta */}
      <div className="p-4 border-t border-slate-200/50 bg-white/30 text-[10px] text-slate-400 flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
          <span className="font-mono">GEMINI-3.5-FLASH ACTIVE</span>
        </div>
        <div className="flex items-center justify-between text-slate-400 font-mono mt-1">
          <span>PORT 3000</span>
          <span>© 2026</span>
        </div>
      </div>
    </aside>
  );
}
