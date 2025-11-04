import { Router } from "express";
import { hasToken, getOrgId, createBooksInvoice } from "../lib/zoho.js";

const r = Router();

r.post("/", async (req, res) => {
  try {
    const { customer, items } = req.body || {};

    // Validate at least one item with quantity > 0
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ ok: false, error: "No items provided" });
    }
    const hasValidItem = items.some((i: any) => (i.quantity || 0) > 0);
    if (!hasValidItem) {
      return res.status(400).json({ ok: false, error: "No items with quantity > 0" });
    }

    // Ensure Zoho token available
    if (!hasToken()) {
      return res.status(400).json({ ok: false, error: "Zoho not connected" });
    }

    const orgId = await getOrgId();

    // Build Zoho Books invoice payload
    const payload = {
      customer_name: customer?.display_name || "Demo Customer",
      email: customer?.email,
      line_items: items.map((i: any, idx: number) => ({
        item_name: i.name,
        rate: i.rate,
        quantity: i.quantity,
        item_order: idx + 1
      }))
    };

    const data = await createBooksInvoice(orgId, payload);

    res.json({ ok: true, zohoInvoiceId: data.invoice.invoice_id });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default r;
