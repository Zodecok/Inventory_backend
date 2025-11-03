import { Router } from "express";
const r = Router();

// Demo stub — later we'll create a Zoho Books invoice (and Fishbowl SO)
r.post("/", async (req, res) => {
  const { items, customer } = req.body || {};
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: "No items" });
  }
  // TODO: create Zoho invoice here
  res.json({ ok: true, zohoInvoiceId: "TBD", fishbowlSalesOrderId: "TBD" });
});

export default r;
