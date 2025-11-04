import { Router } from "express";
import { loadCustomers } from "../lib/customers.js";

const r = Router();

r.get("/", async (req, res) => {
  try {
    const q = String(req.query.q || "").toLowerCase().trim();
    let customers = await loadCustomers();

    if (q) {
      customers = customers.filter(c =>
        c.display_name.toLowerCase().includes(q) ||
        (c.email && c.email.toLowerCase().includes(q))
      );
    }

    res.json({ customers });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default r;
