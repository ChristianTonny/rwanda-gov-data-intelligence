import { Router } from "express";
import { search } from "../search/indexer.js";
import { logEvent } from "./events.js";

const router = Router();

/**
 * Query param: q (string)
 * optional: limit
 */
router.get("/", async (req, res) => {
  const q = req.query.q || "";
  const limit = parseInt(req.query.limit || "5", 10);
  try {
    const result = await search(q, limit);
    // Map to the frontend SearchResponse shape
    const results = (result.hits || []).map(h => ({
      id: String(h.id),
      text: h.doc?.name || h.doc?.__raw || JSON.stringify(h.doc || {}),
      dataset: h.doc?.dataset,
      timestamp: h.doc?.timestamp
    }));
    logEvent({ type: 'search', q: String(q), results: results.length });
    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
