import { create } from "zustand";
import { UserProfile, RelocationReport, ExtractedJobProfile } from "./types/relocation.types.js";

interface LoadingState {
  analyzing: boolean;
  uploading: boolean;
  uploadProgress: number;
  currentAgent: string | null;
  agentStatus: Record<string, "pending" | "running" | "completed">;
}

interface RelocationStore {
  userProfile: UserProfile | null;
  agentResults: {
    visa: any;
    housing: any;
    salary: any;
    tax: any;
    cost: any;
    recommendation: any;
  } | null;
  report: RelocationReport | null;
  reportsList: RelocationReport[];
  loadingState: LoadingState;
  activeTab: "dashboard" | "agents" | "reports" | "documents";
  extractedProfile: ExtractedJobProfile | null;

  // Actions
  setUserProfile: (profile: UserProfile | null) => void;
  setExtractedProfile: (profile: ExtractedJobProfile | null) => void;
  setActiveTab: (tab: "dashboard" | "agents" | "reports" | "documents") => void;
  runDemo: () => Promise<void>;
  analyzeRelocation: (profile: UserProfile) => Promise<void>;
  uploadDocument: (file: File) => Promise<void>;
  fetchReportsHistory: () => Promise<void>;
  loadReport: (reportId: string) => Promise<void>;
}

const initialLoadingState: LoadingState = {
  analyzing: false,
  uploading: false,
  uploadProgress: 0,
  currentAgent: null,
  agentStatus: {
    visa: "pending",
    housing: "pending",
    salary: "pending",
    tax: "pending",
    cost: "pending",
    recommendation: "pending",
  },
};

export const useRelocationStore = create<RelocationStore>((set, get) => ({
  userProfile: null,
  agentResults: null,
  report: null,
  reportsList: [],
  loadingState: initialLoadingState,
  activeTab: "dashboard",
  extractedProfile: null,

  setUserProfile: (profile) => set({ userProfile: profile }),
  setExtractedProfile: (profile) => set({ extractedProfile: profile }),
  setActiveTab: (tab) => set({ activeTab: tab }),

  runDemo: async () => {
    const demoProfile: UserProfile = {
      nationality: "Indian",
      profession: "Software Engineer",
      salary: 8000000,
      destinationCity: "Tokyo",
      familySize: 2,
    };

    set({ userProfile: demoProfile, activeTab: "agents" });
    await get().analyzeRelocation(demoProfile);
  },

  analyzeRelocation: async (profile: UserProfile) => {
    set({
      userProfile: profile,
      activeTab: "agents",
      loadingState: {
        ...initialLoadingState,
        analyzing: true,
        agentStatus: {
          visa: "running",
          housing: "pending",
          salary: "pending",
          tax: "pending",
          cost: "pending",
          recommendation: "pending",
        },
        currentAgent: "Visa Agent",
      },
    });

    try {
      // Simulate real-time agent execution visual transitions over 5 seconds (each takes ~800ms)
      const agentsList = [
        { key: "visa", label: "Visa Agent", nextKey: "housing", nextLabel: "Housing Agent" },
        { key: "housing", label: "Housing Agent", nextKey: "salary", nextLabel: "Salary Agent" },
        { key: "salary", label: "Salary Agent", nextKey: "tax", nextLabel: "Tax Agent" },
        { key: "tax", label: "Tax Agent", nextKey: "cost", nextLabel: "Cost Of Living Agent" },
        { key: "cost", label: "Cost Of Living Agent", nextKey: "recommendation", nextLabel: "Recommendation Agent" },
      ];

      for (const agent of agentsList) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
        set((state) => {
          const updatedStatus = { ...state.loadingState.agentStatus };
          updatedStatus[agent.key] = "completed";
          if (agent.nextKey) {
            updatedStatus[agent.nextKey] = "running";
          }
          return {
            loadingState: {
              ...state.loadingState,
              agentStatus: updatedStatus,
              currentAgent: agent.nextLabel,
            },
          };
        });
      }

      // Now call the real backend endpoint to perform analysis
      const response = await fetch("/api/relocation/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (!response.ok) {
        throw new Error(`Analysis request failed: ${response.statusText}`);
      }

      const { reportId } = await response.json();

      // Fetch the generated full report
      await get().loadReport(reportId);

      // Complete recommendation agent status
      set((state) => ({
        loadingState: {
          ...state.loadingState,
          analyzing: false,
          currentAgent: null,
          agentStatus: {
            visa: "completed",
            housing: "completed",
            salary: "completed",
            tax: "completed",
            cost: "completed",
            recommendation: "completed",
          },
        },
        activeTab: "reports",
      }));

      // Refresh list history
      await get().fetchReportsHistory();
    } catch (error) {
      console.error("Error analyzing relocation:", error);
      set((state) => ({
        loadingState: {
          ...state.loadingState,
          analyzing: false,
          currentAgent: "Error during analysis",
        },
      }));
    }
  },

  uploadDocument: async (file: File) => {
    set((state) => ({
      loadingState: {
        ...state.loadingState,
        uploading: true,
        uploadProgress: 10,
      },
      extractedProfile: null,
    }));

    try {
      // Create Form Data
      const formData = new FormData();
      formData.append("file", file);

      // Simulate progress bar updates
      const progressInterval = setInterval(() => {
        set((state) => {
          if (state.loadingState.uploadProgress >= 85) {
            clearInterval(progressInterval);
            return state;
          }
          return {
            loadingState: {
              ...state.loadingState,
              uploadProgress: state.loadingState.uploadProgress + 15,
            },
          };
        });
      }, 300);

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      clearInterval(progressInterval);
      set((state) => ({
        loadingState: {
          ...state.loadingState,
          uploadProgress: 100,
        },
      }));

      if (!response.ok) {
        throw new Error("Failed to upload document.");
      }

      const uploadResult = await response.json();

      set({
        extractedProfile: uploadResult.extractedData,
        loadingState: {
          ...initialLoadingState,
          uploading: false,
        },
        activeTab: "documents",
      });
    } catch (error) {
      console.error("Error uploading document:", error);
      set({
        loadingState: {
          ...initialLoadingState,
          uploading: false,
        },
      });
    }
  },

  fetchReportsHistory: async () => {
    try {
      const response = await fetch("/api/report");
      if (response.ok) {
        const list = await response.json();
        set({ reportsList: list });
      }
    } catch (e) {
      console.error("Error fetching reports history:", e);
    }
  },

  loadReport: async (reportId: string) => {
    try {
      const response = await fetch(`/api/report/${reportId}`);
      if (response.ok) {
        const report = await response.json();
        set({
          report,
          agentResults: report.results,
          userProfile: report.profile,
          activeTab: "reports",
        });
      }
    } catch (e) {
      console.error("Error loading report:", e);
    }
  },
}));
