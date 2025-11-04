import { Router } from "express";
import { loadCatalog } from "../lib/catalog.js";

const r = Router();

r.get("/", async (req, res) => {
  try {
    const q = String(req.query.q || "").toLowerCase().trim();
    let items = await loadCatalog();

    if (q) {
      items = items.filter(item =>
        item.sku.toLowerCase().includes(q) ||
        item.name.toLowerCase().includes(q)
      );
    }

    res.json({ items });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default r;
