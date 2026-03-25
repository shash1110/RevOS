import { Router, type IRouter } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { RunCompetitiveIntelBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/competitive-intel", async (req, res) => {
  const parsed = RunCompetitiveIntelBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }

  const { competitor, ourProduct, dealContext, customerPriorities } = parsed.data;

  const prompt = `You are an expert competitive intelligence analyst and sales strategist. Generate a comprehensive battle card.

Competitor: ${competitor}
Our Product: ${ourProduct}
Deal Context: ${dealContext || "General competitive scenario"}
Customer Priorities: ${customerPriorities}

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "competitorOverview": "2-3 sentence overview of the competitor, their positioning, and typical customer profile",
  "theirStrengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
  "theirWeaknesses": ["weakness 1", "weakness 2", "weakness 3"],
  "ourAdvantages": ["advantage 1", "advantage 2", "advantage 3", "advantage 4"],
  "ourVulnerabilities": ["vulnerability 1", "vulnerability 2"],
  "winThemes": ["win theme 1", "win theme 2", "win theme 3"],
  "objectionHandlers": [
    {"objection": "common objection 1", "response": "how to respond"},
    {"objection": "common objection 2", "response": "how to respond"},
    {"objection": "common objection 3", "response": "how to respond"}
  ],
  "landmines": ["thing to avoid saying/doing 1", "thing to avoid saying/doing 2", "thing to avoid saying/doing 3"]
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
    req.log.error({ err }, "Competitive intel agent error");
    res.status(500).json({ error: "Agent failed to process request" });
  }
});

export default router;
