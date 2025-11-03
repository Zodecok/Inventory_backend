import { Router } from "express";
const r = Router();

r.post("/crm", async (req, res) => {
  // TODO: verify signature if you set one in Zoho
  console.log("Zoho CRM webhook:", JSON.stringify(req.body));
  res.status(200).json({ received: true });
});

export default r;
