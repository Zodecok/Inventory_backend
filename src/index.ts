import express from "express";
import morgan from "morgan";
import cors from "cors";
import health from "./routes/health.js";
import zohoOAuth from "./routes/zoho-oauth.js";
import zohoWebhooks from "./routes/zoho-webhooks.js";
import products from "./routes/products.js";
import orders from "./routes/orders.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

// CORS: allow your Vercel site to call the API
const FRONTEND_ORIGIN = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
app.use(cors({ origin: FRONTEND_ORIGIN, credentials: false }));

app.use("/health", health);
app.use("/oauth/zoho", zohoOAuth);
app.use("/webhooks/zoho", zohoWebhooks);
app.use("/products", products);
app.use("/order", orders);

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => console.log(`API listening on :${port}`));
