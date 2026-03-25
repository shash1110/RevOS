import { Router, type IRouter } from "express";
import { anthropic } from "@workspace/integrations-anthropic-ai";
import { RunProspectingBody } from "@workspace/api-zod";

const router: IRouter = Router();

router.post("/prospecting", async (req, res) => {
  const parsed = RunProspectingBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: "Invalid input", details: parsed.error.issues });
    return;
  }

  const { companyName, industry, targetRole, yourProduct } = parsed.data;

  const prompt = `You are an expert B2B sales researcher. Generate a detailed prospecting research brief.

Company: ${companyName}
Industry: ${industry}
Target Role: ${targetRole}
Our Product: ${yourProduct}

Return ONLY valid JSON matching this exact structure (no markdown, no explanation):
{
  "companyOverview": "2-3 sentence overview of the company, their market position, and recent developments",
  "painPoints": ["pain point 1", "pain point 2", "pain point 3", "pain point 4"],
  "buyingSignals": ["signal 1", "signal 2", "signal 3"],
  "approachStrategy": "2-3 sentence recommended outreach strategy tailored to this prospect",
  "suggestedSubjectLines": ["subject line 1", "subject line 2", "subject line 3"],
  "keyQuestions": ["discovery question 1", "discovery question 2", "discovery question 3", "discovery question 4"]
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
    req.log.error({ err }, "Prospecting agent error");
    res.status(500).json({ error: "Agent failed to process request" });
  }
});

export default router;
