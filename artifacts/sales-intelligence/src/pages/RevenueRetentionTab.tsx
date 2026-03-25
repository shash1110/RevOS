import { useState } from "react";

interface RecoveryPlay {
  play: string;
  rationale: string;
  priority: string;
}

interface RetentionOutput {
  churnRisk: string;
  churnProbability: number;
  riskIndicators: string[];
  recoveryPlays: RecoveryPlay[];
  expansionOpportunities: string[];
  recommendedTalkingPoints: string[];
}

export default function RevenueRetentionTab() {
  const [form, setForm] = useState({
    customerName: "",
    contractValue: "",
    renewalDate: "",
    healthScore: "",
    usagePattern: "",
    recentIssues: "",
    npsScore: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<RetentionOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const body: Record<string, unknown> = {
        customerName: form.customerName,
        contractValue: parseFloat(form.contractValue),
        renewalDate: form.renewalDate,
        healthScore: parseInt(form.healthScore, 10),
        usagePattern: form.usagePattern,
      };
      if (form.recentIssues) body.recentIssues = form.recentIssues;
      if (form.npsScore) body.npsScore = parseFloat(form.npsScore);

      const res = await fetch("/api/agents/revenue-retention", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
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
          <h2 className="text-xl font-semibold text-foreground">🔒 Revenue Retention Agent</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Analyze churn risk and generate targeted recovery plays for at-risk customers.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Customer Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. TechCorp Inc"
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
              value={form.customerName}
              onChange={(e) => setForm({ ...form, customerName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Contract Value ($) *</label>
              <input
                type="number"
                required
                placeholder="e.g. 120000"
                className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                value={form.contractValue}
                onChange={(e) => setForm({ ...form, contractValue: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Renewal Date *</label>
              <input
                type="text"
                required
                placeholder="e.g. March 2026"
                className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                value={form.renewalDate}
                onChange={(e) => setForm({ ...form, renewalDate: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">Health Score (0-100) *</label>
              <input
                type="number"
                required
                min="0"
                max="100"
                placeholder="e.g. 45"
                className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                value={form.healthScore}
                onChange={(e) => setForm({ ...form, healthScore: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-foreground mb-1.5">NPS Score (0-10)</label>
              <input
                type="number"
                min="0"
                max="10"
                placeholder="e.g. 6"
                className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
                value={form.npsScore}
                onChange={(e) => setForm({ ...form, npsScore: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Usage Pattern *</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Login frequency dropped 60% in last 30 days, only 2 of 10 seats active"
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm resize-none"
              value={form.usagePattern}
              onChange={(e) => setForm({ ...form, usagePattern: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Recent Issues (optional)</label>
            <textarea
              rows={2}
              placeholder="e.g. Support tickets about slow performance, champion left company"
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm resize-none"
              value={form.recentIssues}
              onChange={(e) => setForm({ ...form, recentIssues: e.target.value })}
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
                Analyzing Retention Risk...
              </>
            ) : (
              "Run Retention Agent"
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
            <span className="text-4xl mb-3">🔒</span>
            <p className="text-sm">Enter customer data to analyze churn risk and get recovery plays</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
            <svg className="animate-spin h-8 w-8 text-primary mb-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm">Claude is analyzing retention risk...</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg bg-card border border-border p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide font-medium mb-2">Churn Risk</p>
                  <ChurnBadge risk={result.churnRisk} />
                </div>
                <div className="text-right">
                  <div className={`text-4xl font-bold ${getChurnColor(result.churnProbability)}`}>{result.churnProbability}%</div>
                  <p className="text-xs text-muted-foreground">probability</p>
                </div>
              </div>
            </div>

            <div className="rounded-lg bg-card border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">⚠️ Risk Indicators</h3>
              <ul className="space-y-1.5">
                {result.riskIndicators.map((r, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-red-400" />
                    {r}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-lg bg-card border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">🎯 Recovery Plays</h3>
              <div className="space-y-3">
                {result.recoveryPlays.map((play, i) => (
                  <div key={i} className="p-3 rounded bg-muted/50">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium text-foreground">{play.play}</span>
                      <PriorityBadge priority={play.priority} />
                    </div>
                    <p className="text-xs text-muted-foreground">{play.rationale}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-card border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">📈 Expansion Opportunities</h3>
                <ul className="space-y-1.5">
                  {result.expansionOpportunities.map((o, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-green-400" />
                      {o}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="rounded-lg bg-card border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">💬 Talking Points</h3>
                <ul className="space-y-1.5">
                  {result.recommendedTalkingPoints.map((tp, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-blue-400" />
                      {tp}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getChurnColor(prob: number) {
  if (prob >= 75) return "text-red-400";
  if (prob >= 50) return "text-orange-400";
  if (prob >= 25) return "text-yellow-400";
  return "text-green-400";
}

function ChurnBadge({ risk }: { risk: string }) {
  const colors: Record<string, string> = {
    Low: "bg-green-500/10 text-green-400 border-green-500/20",
    Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    High: "bg-orange-500/10 text-orange-400 border-orange-500/20",
    Critical: "bg-red-500/10 text-red-400 border-red-500/20",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${colors[risk] || colors.Medium}`}>
      {risk} Churn Risk
    </span>
  );
}

function PriorityBadge({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    High: "bg-red-500/10 text-red-400",
    Medium: "bg-yellow-500/10 text-yellow-400",
    Low: "bg-muted text-muted-foreground",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded font-medium ${colors[priority] || colors.Low}`}>
      {priority}
    </span>
  );
}
