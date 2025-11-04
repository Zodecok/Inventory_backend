import axios from "axios";

const BASE = process.env.FISHBOWL_BASE_URL;

export async function fbLogin(u: string, p: string) {
  if (!BASE) throw new Error("FISHBOWL_BASE_URL not set");
  const { data } = await axios.post(`${BASE}/login`, { username: u, password: p });
  if (!data.token) throw new Error("Fishbowl login failed: no token");
  return data.token;
}

export async function fbListProducts(token: string) {
  if (!BASE) throw new Error("FISHBOWL_BASE_URL not set");
  const { data } = await axios.get(`${BASE}/products`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  // Normalize output to [{ sku, name, qty }]; if shape unknown, pass through
  if (Array.isArray(data)) {
    return data.map((item: any) => ({
      sku: item.sku || item.id || "",
      name: item.name || "",
      qty: item.qty || item.quantity || 0
    }));
  }
  return data;
}
