import { useRelocationStore } from "../store.js";
import {
  Cpu,
  Loader2,
  CheckCircle2,
  Hourglass,
  AlertCircle,
  Play,
  ArrowRight,
  Shield,
  Home,
  Briefcase,
  Coins,
  MapPin,
  GraduationCap
} from "lucide-react";

export default function AgentsView() {
  const { loadingState, runDemo, activeTab } = useRelocationStore();
  const { agentStatus, analyzing, currentAgent } = loadingState;

  const agents = [
    {
      id: "visa",
      name: "Visa Agent",
      role: "Immigration & COE Expert",
      icon: Shield,
      color: "border-blue-200 text-blue-600 bg-blue-50/50 shadow-sm",
      accent: "bg-blue-500",
      desc: "Calculates Point Scales, eligibility for Highly Skilled Professional vs General visas, and structures COE requirements.",
    },
    {
      id: "housing",
      name: "Housing Agent",
      role: "Residential & Ward Advisor",
      icon: Home,
      color: "border-emerald-200 text-emerald-600 bg-emerald-50/50 shadow-sm",
      accent: "bg-emerald-500",
      desc: "Compares rental prices across Tokyo/Osaka wards, analyzes move-in fees, and maps optimal transit locations.",
    },
    {
      id: "salary",
      name: "Salary Agent",
      role: "Compensation Analyst",
      icon: Briefcase,
      color: "border-purple-200 text-purple-600 bg-purple-50/50 shadow-sm",
      accent: "bg-purple-500",
      desc: "Compares offered compensation packages to localized IT market indices to score salary competitiveness.",
    },
    {
      id: "tax",
      name: "Tax Agent",
      role: "Fiduciary Calculator",
      icon: Coins,
      color: "border-amber-200 text-amber-600 bg-amber-50/50 shadow-sm",
      accent: "bg-amber-500",
      desc: "Models precise deductions for dependents, social health insurance, national pension, and progressive taxes.",
    },
    {
      id: "cost",
      name: "Cost Of Living Agent",
      role: "Budget Modeler",
      icon: MapPin,
      color: "border-pink-200 text-pink-600 bg-pink-50/50 shadow-sm",
      accent: "bg-pink-500",
      desc: "Projects food, utilities, internet, and miscellaneous spending brackets based on household family size.",
    },
    {
      id: "school",
      name: "School Agent",
      role: "Childhood & Education Advisor",
      icon: GraduationCap,
      color: "border-cyan-200 text-cyan-600 bg-cyan-50/50 shadow-sm",
      accent: "bg-cyan-500",
      desc: "Recommends public, private, or international schooling options, preschool structures, and local child support.",
    },
  ];

  // Since school agent is mock-only as requested by the card guidelines, we'll set its status based on the cost agent or overall analyzing state
  const getAgentStatus = (id: string) => {
    if (id === "school") {
      if (analyzing) {
        return agentStatus.cost === "completed" ? "completed" : "pending";
      }
      return "pending";
    }
    return agentStatus[id] || "pending";
  };

  const isAnyRunning = Object.values(agentStatus).some((s) => s === "running");

  return (
    <div className="flex-1 overflow-y-auto bg-transparent text-slate-700 p-8 flex flex-col min-h-screen">
      <div className="max-w-5xl mx-auto w-full flex-1 flex flex-col gap-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/60 pb-6">
          <div>
            <h2 className="text-2xl font-extrabold text-slate-800 flex items-center gap-2.5">
              <Cpu className="w-6 h-6 text-indigo-500" />
              <span>Multi-Agent System Coordinator</span>
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              Watch real-time model synthesis as specialized agents process your relocation parameters.
            </p>
          </div>

          {!analyzing && (
            <button
              onClick={runDemo}
              className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white transition-all shadow-md flex items-center gap-2 cursor-pointer shadow-indigo-600/10"
            >
              <Play className="w-3.5 h-3.5 fill-white/10" />
              <span>Trigger Multi-Agent Simulation</span>
            </button>
          )}
        </div>

        {/* Central Orchestrator status banner */}
        {analyzing ? (
          <div className="p-5 rounded-2xl border border-indigo-100 bg-indigo-50/50 backdrop-blur-md flex items-center gap-4 animate-pulse shadow-sm">
            <Loader2 className="w-5 h-5 text-indigo-600 animate-spin flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="text-sm font-bold text-slate-800">
                Coordinating Agent Group...
              </h4>
              <p className="text-xs text-slate-500 truncate mt-0.5">
                Currently running: <span className="text-indigo-600 font-bold">{currentAgent || "Analyzing Database"}</span>
              </p>
            </div>
            <div className="text-[10px] font-mono text-indigo-600 bg-white/80 px-2 py-1 rounded border border-indigo-200/50">
              ACTIVE PROCESSING
            </div>
          </div>
        ) : (
          <div className="p-5 rounded-2xl border border-slate-200/60 bg-white/40 backdrop-blur-md flex items-center justify-between gap-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
              <div>
                <h4 className="text-sm font-semibold text-slate-800">Coordinator Ready</h4>
                <p className="text-xs text-slate-500">
                  Ready to orchestrate parallel workers. Fill in the dashboard form or click demo.
                </p>
              </div>
            </div>
            <div className="text-[10px] font-mono text-slate-500 border border-slate-200 bg-white/50 px-2 py-1 rounded">
              STANDBY
            </div>
          </div>
        )}

        {/* Grid of Agent Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {agents.map((agent) => {
            const status = getAgentStatus(agent.id);
            const Icon = agent.icon;

            return (
              <div
                key={agent.id}
                className={`relative rounded-2xl border p-5 transition-all duration-300 backdrop-blur-md shadow-sm ${
                  status === "running"
                    ? "border-indigo-400/80 bg-indigo-50/40 shadow-lg shadow-indigo-100/10"
                    : status === "completed"
                    ? "border-emerald-200 bg-white/50 shadow-md shadow-slate-100/5"
                    : "border-slate-200/80 bg-white/20 hover:border-slate-300"
                }`}
              >
                {/* Status Indicator Top Bar */}
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-2 rounded-xl border ${agent.color}`}>
                    <Icon className="w-4 h-4" />
                  </div>

                  {/* Status Badge */}
                  <div className="flex items-center gap-1.5">
                    {status === "completed" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Completed</span>
                      </span>
                    ) : status === "running" ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-100 animate-pulse">
                        <Loader2 className="w-3 h-3 animate-spin" />
                        <span>Running</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-400 bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                        <Hourglass className="w-3 h-3" />
                        <span>Pending</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Agent Details */}
                <h3 className="font-bold text-sm text-slate-800">{agent.name}</h3>
                <span className="text-[10px] text-indigo-600 font-bold block mb-2 font-mono uppercase tracking-wider">
                  {agent.role}
                </span>
                <p className="text-slate-500 text-xs leading-relaxed mb-4 min-h-[48px]">{agent.desc}</p>

                {/* Animated progress bar at bottom of card */}
                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-1000 ${
                      status === "completed"
                        ? "w-full bg-emerald-500"
                        : status === "running"
                        ? "w-1/2 bg-indigo-500 animate-pulse"
                        : "w-0"
                    }`}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Console logs output at bottom */}
        <div className="rounded-2xl border border-slate-200 bg-white/40 backdrop-blur-md p-5 font-mono text-xs flex-1 flex flex-col shadow-inner shadow-slate-100">
          <div className="flex items-center justify-between border-b border-slate-200/60 pb-3 mb-3">
            <span className="text-slate-700 font-bold flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-ping"></span>
              <span>Live Agent Pipeline Logs</span>
            </span>
            <span className="text-[10px] text-slate-400">MOCK_WEBSOCKET_RECEIVER</span>
          </div>

          <div className="flex-1 space-y-1.5 overflow-y-auto max-h-48 text-slate-600 pr-1">
            {analyzing ? (
              <>
                <div className="text-indigo-600">[SYSTEM] Connection opened to Coordinator Server...</div>
                <div className="text-slate-500">[COORDINATOR] Parallel execution initiated. Group size: 5 agents.</div>
                {agentStatus.visa === "running" && (
                  <div className="text-blue-600 animate-pulse">[VISA] Invoking immigration scoring for Indian Software Engineer...</div>
                )}
                {agentStatus.visa === "completed" && (
                  <div className="text-emerald-600 font-medium">✓ [VISA] Scored 80 points. Match found: Highly Skilled Professional (i)(b) Visa.</div>
                )}
                {agentStatus.housing === "running" && (
                  <div className="text-blue-600 animate-pulse">[HOUSING] Fetching rentals in Tokyo. Target budget JPY 180,000/mo...</div>
                )}
                {agentStatus.housing === "completed" && (
                  <div className="text-emerald-600 font-medium">✓ [HOUSING] Selected Setagaya-ku, Koto-ku, Nakano-ku. Rent model complete.</div>
                )}
                {agentStatus.salary === "running" && (
                  <div className="text-blue-600 animate-pulse">[SALARY] Referencing index datasets for Tokyo IT positions...</div>
                )}
                {agentStatus.salary === "completed" && (
                  <div className="text-emerald-600 font-medium">✓ [SALARY] Scored Well Above Average (Top 15%). Baseline market: 7.2M JPY.</div>
                )}
                {agentStatus.tax === "running" && (
                  <div className="text-blue-600 animate-pulse">[TAX] Executing Shakai Hoken national deduction algorithms...</div>
                )}
                {agentStatus.tax === "completed" && (
                  <div className="text-emerald-600 font-medium">✓ [TAX] Monthly take home estimate compiled: JPY 505,800.</div>
                )}
                {agentStatus.cost === "running" && (
                  <div className="text-blue-600 animate-pulse">[COST] Calculating utility and food brackets for family size 2...</div>
                )}
                {agentStatus.cost === "completed" && (
                  <div className="text-emerald-600 font-medium">✓ [COST] Combined living budget computed: JPY 300,000/mo.</div>
                )}
                {agentStatus.recommendation === "running" && (
                  <div className="text-purple-600 animate-pulse">[COORDINATOR] Synchronizing outputs. Running recommendation agent synthesis...</div>
                )}
              </>
            ) : (
              <div className="text-slate-400 italic">No logs generated. Run a relocation analysis to watch logs.</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
