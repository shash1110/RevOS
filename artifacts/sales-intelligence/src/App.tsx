import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import ProspectingTab from "@/pages/ProspectingTab";
import DealIntelligenceTab from "@/pages/DealIntelligenceTab";
import RevenueRetentionTab from "@/pages/RevenueRetentionTab";
import CompetitiveIntelTab from "@/pages/CompetitiveIntelTab";

const queryClient = new QueryClient();

const tabs = [
  { id: "prospecting", label: "Prospecting", icon: "🎯" },
  { id: "deal-intelligence", label: "Deal Intelligence", icon: "📊" },
  { id: "revenue-retention", label: "Revenue Retention", icon: "🔒" },
  { id: "competitive-intel", label: "Competitive Intel", icon: "⚔️" },
];

function App() {
  const [activeTab, setActiveTab] = useState("prospecting");

  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="border-b border-border bg-card px-6 py-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-sm">SI</div>
              <div>
                <h1 className="text-lg font-semibold text-foreground">Sales Intelligence</h1>
                <p className="text-xs text-muted-foreground">Claude-Powered AI Agents</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse"></span>
                Live Demo
              </span>
            </div>
          </div>
        </header>

        <div className="border-b border-border bg-card">
          <div className="max-w-7xl mx-auto px-6">
            <nav className="flex gap-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? "border-primary text-primary"
                      : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                  }`}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
          {activeTab === "prospecting" && <ProspectingTab />}
          {activeTab === "deal-intelligence" && <DealIntelligenceTab />}
          {activeTab === "revenue-retention" && <RevenueRetentionTab />}
          {activeTab === "competitive-intel" && <CompetitiveIntelTab />}
        </main>
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
