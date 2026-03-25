import { useState } from "react";

interface ProspectingOutput {
  companyOverview: string;
  painPoints: string[];
  buyingSignals: string[];
  approachStrategy: string;
  suggestedSubjectLines: string[];
  keyQuestions: string[];
}

export default function ProspectingTab() {
  const [form, setForm] = useState({
    companyName: "",
    industry: "",
    targetRole: "",
    yourProduct: "",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ProspectingOutput | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch("/api/agents/prospecting", {
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
          <h2 className="text-xl font-semibold text-foreground">🎯 Prospecting Agent</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Generate a research brief for any target prospect. Get pain points, buying signals, and outreach strategy.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Company Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Salesforce, Acme Corp"
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Industry *</label>
            <input
              type="text"
              required
              placeholder="e.g. B2B SaaS, Healthcare, Financial Services"
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
              value={form.industry}
              onChange={(e) => setForm({ ...form, industry: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Target Role *</label>
            <input
              type="text"
              required
              placeholder="e.g. VP of Sales, CTO, Head of Operations"
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm"
              value={form.targetRole}
              onChange={(e) => setForm({ ...form, targetRole: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-foreground mb-1.5">Your Product *</label>
            <textarea
              required
              rows={3}
              placeholder="e.g. AI-powered revenue intelligence platform that helps sales teams close more deals"
              className="w-full px-3 py-2 rounded-md bg-card border border-border text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary text-sm resize-none"
              value={form.yourProduct}
              onChange={(e) => setForm({ ...form, yourProduct: e.target.value })}
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
                Running Agent...
              </>
            ) : (
              "Run Prospecting Agent"
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
            <span className="text-4xl mb-3">🎯</span>
            <p className="text-sm">Fill in the form and run the agent to generate a research brief</p>
          </div>
        )}

        {loading && (
          <div className="flex flex-col items-center justify-center h-64 text-center text-muted-foreground">
            <svg className="animate-spin h-8 w-8 text-primary mb-3" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <p className="text-sm">Claude is researching your prospect...</p>
          </div>
        )}

        {result && (
          <div className="space-y-4">
            <Section title="Company Overview" icon="🏢">
              <p className="text-sm text-foreground/90 leading-relaxed">{result.companyOverview}</p>
            </Section>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Section title="Pain Points" icon="⚡">
                <List items={result.painPoints} color="red" />
              </Section>
              <Section title="Buying Signals" icon="📈">
                <List items={result.buyingSignals} color="green" />
              </Section>
            </div>

            <Section title="Approach Strategy" icon="🗺️">
              <p className="text-sm text-foreground/90 leading-relaxed">{result.approachStrategy}</p>
            </Section>

            <Section title="Suggested Subject Lines" icon="✉️">
              <div className="space-y-2">
                {result.suggestedSubjectLines.map((line, i) => (
                  <div key={i} className="flex items-start gap-2 p-2.5 rounded bg-muted/50 text-sm">
                    <span className="text-muted-foreground shrink-0">{i + 1}.</span>
                    <span className="text-foreground">{line}</span>
                  </div>
                ))}
              </div>
            </Section>

            <Section title="Key Discovery Questions" icon="❓">
              <List items={result.keyQuestions} color="blue" />
            </Section>
          </div>
        )}
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg bg-card border border-border p-4">
      <h3 className="text-sm font-semibold text-foreground mb-3 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      {children}
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
