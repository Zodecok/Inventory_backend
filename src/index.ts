import "dotenv/config";
import express from "express";
import morgan from "morgan";
import cors from "cors";
import health from "./routes/health.js";
import zohoOAuth from "./routes/zoho-oauth.js";
import catalog from "./routes/catalog.js";
import customers from "./routes/customers.js";
import products from "./routes/products.js";
import orders from "./routes/orders.js";
import zohoWebhooks from "./routes/zoho-webhooks.js";

const app = express();
app.use(morgan("dev"));
app.use(express.json({ limit: "1mb" }));

app.use(cors());
app.options("*", cors());

app.use("/health", health);
app.use("/oauth/zoho", zohoOAuth);
app.use("/catalog", catalog);
app.use("/customers", customers);
app.use("/products", products);
app.use("/order", orders);
app.use("/webhooks/zoho", zohoWebhooks);

const port = Number(process.env.PORT) || 8080;
app.listen(port, () => console.log(`API listening on :${port}`));
