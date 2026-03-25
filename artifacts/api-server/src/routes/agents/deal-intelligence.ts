import { Router, type IRouter } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { RunDealIntelligenceBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/deal-intelligence", async (req, res) => {
  const parsed = RunDealIntelligenceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }

  const { dealName, stage, dealValue, daysInStage, stakeholders, lastActivity, notes } = parsed.data;

  const prompt = `You are an expert sales deal analyst. Analyze this deal and return a structured risk assessment.

Deal: ${dealName}
Stage: ${stage}
Value: $${dealValue.toLocaleString()}
Days in Stage: ${daysInStage}
Stakeholders: ${stakeholders}
Last Activity: ${lastActivity}
Notes: ${notes || "None provided"}

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "riskScore": <number 0-100, where 0 is no risk and 100 is extremely high risk>,
  "riskLevel": "<Low|Medium|High|Critical>",
  "riskFactors": ["risk factor 1", "risk factor 2", "risk factor 3"],
  "positiveSignals": ["positive signal 1", "positive signal 2"],
  "nextBestActions": ["action 1", "action 2", "action 3", "action 4"],
  "forecastCategory": "<Commit|Best Case|Pipeline|Omit>",
  "summary": "2-3 sentence deal assessment summary"
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
    req.log.error({ err }, "Deal intelligence agent error");
    res.status(500).json({ error: "Agent failed to process request" });
  }
});

export default router;
