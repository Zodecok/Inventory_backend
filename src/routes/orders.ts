import { Router } from "express";
import { hasToken, getOrgId, createBooksInvoice } from "../lib/zoho.js";
import { loadCatalog, findInCatalog } from "../lib/catalog.js";
import { loadCustomers } from "../lib/customers.js";

const r = Router();

r.post("/", async (req, res) => {
  try {
    const body = req.body || {};
    console.log("Order request received:", body);

    // Validate at least one item
    if (!Array.isArray(body.items) || body.items.length === 0) {
      return res.status(400).json({ ok: false, error: "No items provided" });
    }

    // Ensure Zoho token available
    if (!hasToken()) {
      return res.status(400).json({ ok: false, error: "Zoho not connected" });
    }

    const orgId = await getOrgId();
    console.log("Using Zoho org ID:", orgId);

    // Load catalog and customers
    const catalog = await loadCatalog();
    const customers = await loadCustomers();

    // Normalize items
    const normItems = body.items.map((raw: any, idx: number) => {
      const sku = String(raw.sku || "").trim();
      const fromCat = sku ? findInCatalog(catalog, sku) : undefined;
      return {
        sku,
        name: raw.name || fromCat?.name || `Item ${idx + 1}`,
        rate: Number(raw.rate ?? fromCat?.rate ?? 0),
        quantity: Number(raw.quantity ?? 1),
        item_order: idx + 1
      };
    });

    // Validate at least one item with quantity > 0
    const hasValidItem = normItems.some((i: any) => i.quantity > 0);
    if (!hasValidItem) {
      return res.status(400).json({ ok: false, error: "No items with quantity > 0" });
    }

    // Resolve customer
    let customer_id: string | undefined;
    let customer_name = body?.customer?.display_name || "Demo Customer";
    let customer_email = body?.customer?.email;

    if (body.customer_id) {
      const found = customers.find(c => c.id === body.customer_id);
      if (found) {
        // Only use customer_id if it's numeric (real Zoho ID), otherwise use name
        const isNumericId = /^\d+$/.test(found.id);
        if (isNumericId) {
          customer_id = found.id;
        }
        customer_name = found.display_name || customer_name;
        customer_email = found.email || customer_email;
      }
    }

    // Build Zoho Books invoice payload
    const payload: any = {
      line_items: normItems.map((i: any) => ({
        item_name: i.name,
        rate: i.rate,
        quantity: i.quantity,
        item_order: i.item_order
      }))
    };

    if (customer_id) {
      payload.customer_id = customer_id;
    } else {
      payload.customer_name = customer_name;
      if (customer_email) payload.email = customer_email;
    }

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
