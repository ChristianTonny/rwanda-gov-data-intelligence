import { Router } from "express";
import { askGemini } from "../llm/geminiAdapter.js";
import { search, getRawById } from "../search/indexer.js";
import { logEvent } from "./events.js";

const router = Router();

/**
 * POST /api/query
 * body: { question: "..." }
 *
 * This route:
 * - does a quick search for supporting docs (provenance)
 * - builds a prompt and calls Gemini adapter
 * - returns answer + provenance + tokens + cost
 */
router.post("/", async (req, res) => {
  const question = (req.body.question || "").trim();
  if (!question) return res.status(400).json({ error: "question required in body" });

  try {
    // quick supporting docs
    const searchRes = await search(question, 5);
    const provenanceDocs = (searchRes.hits || []).map(h => h.doc).filter(Boolean);

    // build a prompt that includes top-matching docs (lightweight)
    const docsText = provenanceDocs.map((d, i) => `DOC ${i + 1}: ${JSON.stringify(d)}`).join("\n\n");
    const prompt = `
You are an assistant that answers questions using the provided documents as evidence.

QUESTION:
${question}

DOCUMENTS:
${docsText}

Provide a concise answer and list which documents (by index) you used.
`;

    let llmRes;
    
    try {
      llmRes = await askGemini(prompt);
    } catch (llmError) {
      // Fallback for when Gemini API is not available (missing key, quota, etc.)
      console.log(`⚠️ LLM unavailable (${llmError.message}), using fallback response`);
      
      // Generate a simple response based on the search results
      let fallbackAnswer = "Based on the available data:\n\n";
      if (provenanceDocs.length > 0) {
        provenanceDocs.forEach((doc, i) => {
          if (doc.name && doc.name.toLowerCase().includes('population')) {
            const match = doc.name.match(/(\w+)\s+population\s+(\d+)/i);
            if (match) {
              fallbackAnswer += `• ${match[1]} district has a population of ${Number(match[2]).toLocaleString()}\n`;
            }
          }
          if (doc.name && doc.name.toLowerCase().includes('qty:')) {
            const match = doc.name.match(/(\w+)\s+(.+)\s+qty:(\d+)/i);
            if (match) {
              fallbackAnswer += `• ${match[1]}: ${match[2]} - ${match[3]} units\n`;
            }
          }
        });
      } else {
        fallbackAnswer += "I found relevant information but couldn't process your specific question. Please try a more specific query about districts, population, or medical supplies.";
      }
      
      llmRes = { 
        answer: fallbackAnswer.trim(), 
        tokens: 0, 
        cost: 0 
      };
    }

    // attach provenance ids
    const provenance = provenanceDocs.map((d) => ({
      dataset: d.dataset || "unknown",
      timestamp: d.timestamp,
      link: d.link,
      recordId: d._docId,
      confidence: 0.7
    }));

    logEvent({ type: 'query', question, tokens: llmRes.tokens || 0 });
    res.json({ answer: llmRes.answer, provenance, tokens: llmRes.tokens, cost: llmRes.cost });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
