import { Router } from "express";
import { getMockProducts } from "../lib/fishbowl-mock.js";
// (Later) import { listZohoItems } from "../lib/zoho.js";

const r = Router();

r.get("/", async (_req, res) => {
  // For demo day: just return mock Fishbowl list now
  const fishbowl = getMockProducts();

  // You can also fetch Zoho Books items if you have ORG_ID + API base:
  // const books = await listZohoItems("https://books.zoho.com/api/v3", process.env.ZOHO_BOOKS_ORG_ID!);

  res.json({ fishbowl, zoho: { items: [] } });
});

export default r;
