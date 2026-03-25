import { useState } from "react";

interface DealOutput {
  riskScore: number;
  riskLevel: string;
  riskFactors: string[];
  positiveSignals: string[];
  nextBestActions: string[];
  forecastCategory: string;
  summary: string;
}

const stages = ["Discovery", "Demo", "Proposal", "Negotiation", "Closed Won", "Closed Lost"];

export default function DealIntelligenceTab() {
  const [form, setForm] = useState({
    dealName: "",
    stage: "Discovery",
    dealValue: "",
    daysInStage: "",
    stakeholders: "",
    lastActivity: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DealOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/agents/deal-intelligence", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          dealValue: parseFloat(form.dealValue),
          daysInStage: parseInt(form.daysInStage, 10),
        }),
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Request failed");
      }
      const data = await res.json();
      setResult(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <div>
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground">📊 Deal Intelligence Agent</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Get a risk score, forecast category, and next best actions for any open deal.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Deal Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Acme Corp Enterprise Deal"
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
              value={form.dealName}
              onChange={(e) => setForm({ ...form, dealName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Stage *</label>
              <select
                required
                className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                value={form.stage}
                onChange={(e) => setForm({ ...form, stage: e.target.value })}
              >
                {stages.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Deal Value ($) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 50000"
                className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                value={form.dealValue}
                onChange={(e) => setForm({ ...form, dealValue: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Days in Current Stage *</label>
            <input
              type="number"
              required
              placeholder="e.g. 21"
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
              value={form.daysInStage}
              onChange={(e) => setForm({ ...form, daysInStage: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Stakeholders *</label>
            <input
              type="text"
              required
              placeholder="e.g. VP Sales (champion), CFO (economic buyer), IT Director (blocker)"
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
              value={form.stakeholders}
              onChange={(e) => setForm({ ...form, stakeholders: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Last Activity *</label>
            <input
              type="text"
              required
              placeholder="e.g. Demo call 3 weeks ago, no follow up since"
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
              value={form.lastActivity}
              onChange={(e) => setForm({ ...form, lastActivity: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Notes (optional)</label>
            <textarea
              rows={2}
              placeholder="Any additional context, objections, or deal notes..."
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm resize-none"
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-md bg-primary text-primary-foreground font-medium text-sm hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {loading ? (
              <>
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Analyzing Deal...
              </>
            ) : (
              "Run Deal Intelligence Agent"
            )}
          </button>
        </form>
      </div>

      <div>
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 text-destructive text-sm">
            {error}
          </div>
        )}

        {!result && !error && !loading && (
          <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
            <span className="text-4xl mb-3">📊</span>
            <p className="text-sm">Fill in deal details to get a risk assessment and recommended actions</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
            <svg className="animate-spin h-8 w-8 text-primary mb-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm">Claude is analyzing your deal...</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg bg-card border border-border p-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-1">Risk Score</p>
                  <RiskBadge level={result.riskLevel} />
                </div>
                <div className="text-right">
                  <div className={`text-5xl font-bold ${getRiskColor(result.riskScore)}`}>{result.riskScore}</div>
                  <p className="text-xs text-muted-foreground">/ 100</p>
                </div>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div
                  className={`h-2 rounded-full transition-all ${getRiskBarColor(result.riskScore)}`}
                  style={{ width: `${result.riskScore}%` }}
                />
              </div>
              <div className="mt-3 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Forecast:</span>
                <span className="text-xs font-medium text-foreground bg-muted px-2 py-0.5 rounded">{result.forecastCategory}</span>
              </div>
            </div>

            <div className="rounded-lg bg-card border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">Summary</h3>
              <p className="text-sm text-foreground/90 leading-relaxed">{result.summary}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-card border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">⚠️ Risk Factors</h3>
                <ul className="space-y-1.5">
                  {result.riskFactors.map((f, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-red-400" />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-card border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">✅ Positive Signals</h3>
                <ul className="space-y-1.5">
                  {result.positiveSignals.map((s, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-green-400" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="rounded-lg bg-card border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">🚀 Next Best Actions</h3>
              <div className="space-y-2">
                {result.nextBestActions.map((action, i) => (
                  <div key={i} className="flex items-start gap-3 p-2.5 rounded bg-muted/50 text-sm">
                    <span className="text-xs font-bold text-primary bg-primary/10 rounded w-5 h-5 flex items-center justify-center shrink-0 mt-0.5">{i + 1}</span>
                    <span className="text-foreground/90">{action}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getRiskColor(score: number) {
  if (score >= 75) return "text-red-400";
  if (score >= 50) return "text-orange-400";
  if (score >= 25) return "text-yellow-400";
  return "text-green-400";
}

function getRiskBarColor(score: number) {
  if (score >= 75) return "bg-red-500";
  if (score >= 50) return "bg-orange-500";
  if (score >= 25) return "bg-yellow-500";
  return "bg-green-500";
}

function RiskBadge({ level }: { level: string }) {
  const colors: Record<string, string> = {
    Low: "bg-green-500/10 text-green-400 border-green-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Critical: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[level] || colors.Medium}`}>
      {level} Risk
    </span>
  );
}
