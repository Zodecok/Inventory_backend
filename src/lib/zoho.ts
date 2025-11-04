import axios from "axios";

const REGION = (process.env.ZOHO_REGION || "au").toLowerCase();
const ACCOUNTS_HOST = REGION === "au" ? "accounts.zoho.com.au" : "accounts.zoho.com";

const CLIENT_ID = process.env.ZOHO_CLIENT_ID!;
const CLIENT_SECRET = process.env.ZOHO_CLIENT_SECRET!;
const REDIRECT_URI = process.env.ZOHO_REDIRECT_URI!;

// In-memory token store
let token: { access_token: string; refresh_token?: string; expires_at?: number } | null = null;

export function authUrl(scopes: string[]) {
  const scope = scopes.join(",");
  const url = new URL(`https://${ACCOUNTS_HOST}/oauth/v2/auth`);
  url.searchParams.set("client_id", CLIENT_ID);
  url.searchParams.set("redirect_uri", REDIRECT_URI);
  url.searchParams.set("scope", scope);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("access_type", "offline");
  url.searchParams.set("prompt", "consent");
  return url.toString();
}

export async function exchangeCode(code: string) {
  const url = `https://${ACCOUNTS_HOST}/oauth/v2/token`;
  const body = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: CLIENT_ID,
    client_secret: CLIENT_SECRET,
    redirect_uri: REDIRECT_URI,
    code
  });
  const { data } = await axios.post(url, body);
  token = {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: Date.now() + (data.expires_in || 3600) * 1000
  };
  return token;
}

export async function getAccessToken() {
  if (token && token.expires_at && Date.now() < token.expires_at - 30000) {
    return token.access_token;
  }
  if (token?.refresh_token) {
    const url = `https://${ACCOUNTS_HOST}/oauth/v2/token`;
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: token.refresh_token
    });
    const { data } = await axios.post(url, body);
    token.access_token = data.access_token;
    token.expires_at = Date.now() + (data.expires_in || 3600) * 1000;
    return token.access_token;
  }
  throw new Error("No Zoho token. Visit /oauth/zoho/login first.");
}

export function booksBase() {
  return REGION === "au"
    ? "https://books.zoho.com.au/api/v3"
    : "https://books.zoho.com/api/v3";
}

export async function getOrgId() {
  if (process.env.ZOHO_BOOKS_ORG_ID) {
    return process.env.ZOHO_BOOKS_ORG_ID;
  }
  const at = await getAccessToken();
  const { data } = await axios.get(`${booksBase()}/organizations`, {
    headers: { Authorization: `Zoho-oauthtoken ${at}` }
  });
  if (data.organizations && data.organizations.length > 0) {
    return data.organizations[0].organization_id;
  }
  throw new Error("No Zoho Books organization found");
}

export async function listBooksItems(orgId: string) {
  const at = await getAccessToken();
  const { data } = await axios.get(`${booksBase()}/items`, {
    headers: {
      Authorization: `Zoho-oauthtoken ${at}`,
      "X-com-zoho-books-organizationid": orgId
    },
    params: { page: 1, per_page: 50 }
  });
  return data;
}

export async function createBooksInvoice(orgId: string, payload: any) {
  const at = await getAccessToken();
  const { data } = await axios.post(`${booksBase()}/invoices`, payload, {
    headers: {
      Authorization: `Zoho-oauthtoken ${at}`,
      "X-com-zoho-books-organizationid": orgId,
      "Content-Type": "application/json"
    }
  });
  return data;
}

export function hasToken() {
  return token !== null && token.access_token !== undefined;
}
