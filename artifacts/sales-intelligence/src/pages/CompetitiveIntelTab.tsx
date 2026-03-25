import { useState } from "react";

interface ObjectionHandler {
  objection: string;
  response: string;
}

interface CompetitiveOutput {
  competitorOverview: string;
  theirStrengths: string[];
  theirWeaknesses: string[];
  ourAdvantages: string[];
  ourVulnerabilities: string[];
  winThemes: string[];
  objectionHandlers: ObjectionHandler[];
  landmines: string[];
}

export default function CompetitiveIntelTab() {
  const [form, setForm] = useState({
    competitor: "",
    ourProduct: "",
    dealContext: "",
    customerPriorities: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CompetitiveOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/agents/competitive-intel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
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
          <h2 className="text-xl font-semibold text-foreground">⚔️ Competitive Intel Agent</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Generate a live battlecard against any competitor with objection handlers and landmines.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Competitor *</label>
            <input
              type="text"
              required
              placeholder="e.g. Gong, Clari, Outreach"
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
              value={form.competitor}
              onChange={(e) => setForm({ ...form, competitor: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Our Product *</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. AI revenue intelligence platform that combines conversation analytics, deal forecasting, and coaching"
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm resize-none"
              value={form.ourProduct}
              onChange={(e) => setForm({ ...form, ourProduct: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Deal Context (optional)</label>
            <input
              type="text"
              placeholder="e.g. Mid-market SaaS company, 200 seat deal, currently trialing competitor"
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
              value={form.dealContext}
              onChange={(e) => setForm({ ...form, dealContext: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Customer Priorities *</label>
            <textarea
              required
              rows={2}
              placeholder="e.g. Fast time-to-value, easy CRM integration, ROI within 90 days, strong forecasting accuracy"
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm resize-none"
              value={form.customerPriorities}
              onChange={(e) => setForm({ ...form, customerPriorities: e.target.value })}
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
                Generating Battlecard...
              </>
            ) : (
              "Generate Battlecard"
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
            <span className="text-4xl mb-3">⚔️</span>
            <p className="text-sm">Enter competitor info to generate a battlecard with objection handlers</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
            <svg className="animate-spin h-8 w-8 text-primary mb-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm">Claude is building your battlecard...</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <div className="rounded-lg bg-card border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-2">🏢 Competitor Overview</h3>
              <p className="text-sm text-foreground/90 leading-relaxed">{result.competitorOverview}</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-card border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">💪 Their Strengths</h3>
                <List items={result.theirStrengths} color="red" />
              </div>
              <div className="rounded-lg bg-card border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">🎯 Their Weaknesses</h3>
                <List items={result.theirWeaknesses} color="green" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="rounded-lg bg-card border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">✅ Our Advantages</h3>
                <List items={result.ourAdvantages} color="green" />
              </div>
              <div className="rounded-lg bg-card border border-border p-4">
                <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">⚡ Our Vulnerabilities</h3>
                <List items={result.ourVulnerabilities} color="yellow" />
              </div>
            </div>

            <div className="rounded-lg bg-card border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">🏆 Win Themes</h3>
              <div className="flex flex-wrap gap-2">
                {result.winThemes.map((theme, i) => (
                  <span key={i} className="px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                    {theme}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-card border border-border p-4">
              <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">🗣️ Objection Handlers</h3>
              <div className="space-y-3">
                {result.objectionHandlers.map((oh, i) => (
                  <div key={i} className="p-3 rounded bg-muted/50">
                    <p className="text-xs font-semibold text-muted-foreground mb-1">Objection: <span className="text-foreground">{oh.objection}</span></p>
                    <p className="text-xs text-foreground/90">↳ {oh.response}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-lg bg-card border border-destructive/20 bg-destructive/5 p-4">
              <h3 className="text-sm font-semibold text-destructive mb-3 flex items-center gap-2">💣 Landmines (Avoid These)</h3>
              <ul className="space-y-1.5">
                {result.landmines.map((lm, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
                    <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 bg-destructive" />
                    {lm}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function List({ items, color }: { items: string[]; color: "red" | "green" | "blue" | "yellow" }) {
  const dotColors = {
    red: "bg-red-400",
    green: "bg-green-400",
    blue: "bg-blue-400",
    yellow: "bg-yellow-400",
  };
  return (
    <ul className="space-y-1.5">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-foreground/90">
          <span className={`mt-1.5 w-1.5 h-1.5 rounded-full shrink-0 ${dotColors[color]}`} />
          {item}
        </li>
      ))}
    </ul>
  );
}
