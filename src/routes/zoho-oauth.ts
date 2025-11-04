import { Router } from "express";
import { authUrl, exchangeCode, hasToken } from "../lib/zoho.js";

const r = Router();

const SCOPES = [
  "ZohoBooks.items.READ",
  "ZohoBooks.invoices.CREATE",
  "ZohoBooks.contacts.CREATE",
  "ZohoBooks.contacts.READ",
  "ZohoBooks.settings.READ"
];

r.get("/login", (_req, res) => {
  res.redirect(authUrl(SCOPES));
});

r.get("/callback", async (req, res) => {
  const code = String(req.query.code || "");
  if (!code) return res.status(400).send("Missing code");
  await exchangeCode(code);
  res.send("Zoho connected ✔️");
});

r.get("/status", (_req, res) => {
  res.json({ connected: hasToken() });
});

export default r;
