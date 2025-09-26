import { Router } from "express";

const router = Router();

// naive in-memory events store
const EVENTS = [];

export function logEvent(evt) {
  EVENTS.unshift({
    id: `${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
    ts: new Date().toISOString(),
    ...evt
  });
  if (EVENTS.length > 200) EVENTS.pop();
}

router.get('/', (req, res) => {
  const limit = Math.min(parseInt(req.query.limit || '20', 10), 100);
  res.json({ items: EVENTS.slice(0, limit) });
});

export default router;


