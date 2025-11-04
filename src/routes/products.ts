import { Router } from "express";
import { fbMockListProducts } from "../lib/fishbowl-mock.js";
import { fbLogin, fbListProducts } from "../lib/fishbowl.js";
import { hasToken, getOrgId, listBooksItems } from "../lib/zoho.js";

const r = Router();

r.get("/", async (_req, res) => {
  try {
    // Determine source
    const real = process.env.USE_FISHBOWL === "real"
                 && process.env.FISHBOWL_BASE_URL
                 && process.env.FISHBOWL_USERNAME
                 && process.env.FISHBOWL_PASSWORD;

    let fish: Array<{ sku: string; name: string; qty: number }>;

    if (real) {
      const token = await fbLogin(process.env.FISHBOWL_USERNAME!, process.env.FISHBOWL_PASSWORD!);
      fish = await fbListProducts(token);
    } else {
      fish = fbMockListProducts();
    }

    // Optionally include Zoho price (rate) if Zoho tokens exist
    const items = [];
    if (hasToken()) {
      try {
        const orgId = await getOrgId();
        const zohoData = await listBooksItems(orgId);
        const zohoItems = zohoData.items || [];

        for (const f of fish) {
          const zohoItem = zohoItems.find((z: any) => z.sku === f.sku);
          items.push({
            sku: f.sku,
            name: f.name,
            rate: zohoItem?.rate || 0,
            qty: f.qty
          });
        }
      } catch (err) {
        // If Zoho fetch fails, just return with rate = 0
        for (const f of fish) {
          items.push({ sku: f.sku, name: f.name, rate: 0, qty: f.qty });
        }
      }
    } else {
      for (const f of fish) {
        items.push({ sku: f.sku, name: f.name, rate: 0, qty: f.qty });
      }
    }

    res.json({ source: real ? "real" : "mock", items });
  } catch (err: any) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

export default r;
