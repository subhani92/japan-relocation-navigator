import { useEffect } from "react";
import { useRelocationStore } from "./store.js";
import Sidebar from "./components/Sidebar.js";
import LandingView from "./components/LandingView.js";
import UploadView from "./components/UploadView.js";
import AgentsView from "./components/AgentsView.js";
import ReportView from "./components/ReportView.js";

export default function App() {
  const { activeTab, fetchReportsHistory } = useRelocationStore();

  // Load analysis history on mount
  useEffect(() => {
    fetchReportsHistory();
  }, []);

  const renderActiveView = () => {
    switch (activeTab) {
      case "dashboard":
        return <LandingView />;
      case "documents":
        return <UploadView />;
      case "agents":
        return <AgentsView />;
      case "reports":
        return <ReportView />;
      default:
        return <LandingView />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-slate-50 font-sans text-slate-800 relative">
      {/* Premium Background Ambient Glows */}
      <div className="absolute -top-[10%] -right-[5%] w-[500px] h-[500px] bg-indigo-200/40 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute -bottom-[10%] -left-[5%] w-[500px] h-[500px] bg-pink-200/30 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute top-[30%] left-[20%] w-[400px] h-[400px] bg-blue-200/20 rounded-full blur-[100px] pointer-events-none"></div>

      {/* Left Sidebar Menu */}
      <Sidebar />

      {/* Main Screen Panel */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden relative z-10">
        {renderActiveView()}
      </main>
    </div>
  );
}
