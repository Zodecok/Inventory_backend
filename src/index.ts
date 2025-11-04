import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import health from "./routes/health.js";
import zohoOAuth from "./routes/zoho-oauth.js";
import products from "./routes/products.js";
import orders from "./routes/orders.js";
import zohoWebhooks from "./routes/zoho-webhooks.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

const FRONTEND = process.env.FRONTEND_ORIGIN || "http://localhost:3000";
app.use(cors({ origin: FRONTEND, credentials: false }));

app.use("/health", health);
app.use("/oauth/zoho", zohoOAuth);
app.use("/products", products);
app.use("/order", orders);
app.use("/webhooks/zoho", zohoWebhooks);

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => console.log(`API listening on :${port}`));
