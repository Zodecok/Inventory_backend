import { Router } from "express";
import { hasToken, getOrgId, createBooksInvoice } from "../lib/zoho.js";

const r = Router();

r.post("/", async (req, res) => {
  try {
    const { customer, items } = req.body || {};
    console.log("Order request received:", { customer, items });

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
    console.log("Using Zoho org ID:", orgId);

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
    console.log("Zoho invoice payload:", JSON.stringify(payload, null, 2));

    const data = await createBooksInvoice(orgId, payload);
    console.log("Zoho invoice created successfully:", data.invoice.invoice_id);

    res.json({ ok: true, zohoInvoiceId: data.invoice.invoice_id });
  } catch (err: any) {
    console.error("Order creation error:", err.response?.data || err.message);
    const errorMsg = err.response?.data?.message || err.message || "Unknown error";
    const statusCode = err.response?.status || 500;
    res.status(statusCode).json({
      ok: false,
      error: errorMsg,
      details: err.response?.data
    });
  }
});

export default r;
