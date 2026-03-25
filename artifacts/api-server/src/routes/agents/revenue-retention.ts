import { Router, type IRouter } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { RunRevenueRetentionBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/revenue-retention", async (req, res) => {
  const parsed = RunRevenueRetentionBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }

  const { customerName, contractValue, renewalDate, healthScore, usagePattern, recentIssues, npsScore } = parsed.data;

  const prompt = `You are an expert customer success and revenue retention strategist. Analyze this customer's churn risk and generate recovery plays.

Customer: ${customerName}
Contract Value: $${contractValue.toLocaleString()}
Renewal Date: ${renewalDate}
Health Score: ${healthScore}/100
Usage Pattern: ${usagePattern}
Recent Issues: ${recentIssues || "None reported"}
NPS Score: ${npsScore !== undefined ? `${npsScore}/10` : "Not available"}

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "churnRisk": "<Low|Medium|High|Critical>",
  "churnProbability": <number 0-100>,
  "riskIndicators": ["indicator 1", "indicator 2", "indicator 3"],
  "recoveryPlays": [
    {"play": "play name", "rationale": "why this works", "priority": "<High|Medium|Low>"},
    {"play": "play name", "rationale": "why this works", "priority": "<High|Medium|Low>"},
    {"play": "play name", "rationale": "why this works", "priority": "<High|Medium|Low>"}
  ],
  "expansionOpportunities": ["opportunity 1", "opportunity 2"],
  "recommendedTalkingPoints": ["talking point 1", "talking point 2", "talking point 3", "talking point 4"]
}`;

  try {
    const message = await anthropic.messages.create({
      model: "claude-sonnet-4-6",
      max_tokens: 8192,
      messages: [{ role: "user", content: prompt }],
    });

    const content = message.content[0];
    if (content.type !== "text") {
      res.status(500).json({ error: "Unexpected response type from AI" });
      return;
    }

    const jsonText = content.text.trim().replace(/^```json\n?/, "").replace(/\n?```$/, "");
    const result = JSON.parse(jsonText);
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Revenue retention agent error");
    res.status(500).json({ error: "Agent failed to process request" });
  }
});

export default router;
