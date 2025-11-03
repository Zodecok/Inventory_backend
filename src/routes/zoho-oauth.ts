import { Router } from "express";
import { authUrl, exchangeCode } from "../lib/zoho.js";

const r = Router();

// ask for minimal scopes now; we can expand later
const SCOPES = [
  "ZohoBooks.items.READ",
  "ZohoBooks.invoices.CREATE"
];

r.get("/login", (_req, res) => {
  res.redirect(authUrl(SCOPES));
});

r.get("/callback", async (req, res) => {
  const code = String(req.query.code || "");
  if (!code) return res.status(400).send("Missing code");
  await exchangeCode(code);
  res.send("Zoho connected ✔️ — you can close this tab.");
});

export default r;
