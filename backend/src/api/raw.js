import { Router } from "express";
import { getRawById } from "../search/indexer.js";

const router = Router();

router.get('/:id', (req, res) => {
  const id = String(req.params.id || '');
  if (!id) return res.status(400).json({ error: 'Missing id' });
  const raw = getRawById(id);
  if (!raw) return res.status(404).json({ error: 'Not found' });
  return res.json({ id, record: raw });
});

export default router;


