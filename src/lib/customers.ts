import { hasToken, getOrgId, listBooksContacts } from "./zoho.js";

export type Customer = { id: string; display_name: string; email?: string };

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

let _cache: { items: Customer[]; fetchedAt: number } | null = null;

export async function loadCustomers(): Promise<Customer[]> {
  // Check cache
  if (_cache && Date.now() - _cache.fetchedAt < CACHE_TTL) {
    return _cache.items;
  }

  let items: Customer[];

  if (hasToken()) {
    try {
      const orgId = await getOrgId();
      const data = await listBooksContacts(orgId);
      const contacts = data.contacts || [];
      items = contacts.map((contact: any) => ({
        id: String(contact.contact_id || ""),
        display_name: contact.contact_name || contact.display_name || contact.company_name || "Unknown",
        email: contact.email || contact.primary_email
      }));
    } catch (err) {
      console.error("Failed to load Zoho customers, using mock:", err);
      items = getMockCustomers();
    }
  } else {
    items = getMockCustomers();
  }

  _cache = { items, fetchedAt: Date.now() };
  return items;
}

function getMockCustomers(): Customer[] {
  return [
    { id: "CUST-001", display_name: "Demo Customer", email: "demo@example.com" },
    { id: "CUST-002", display_name: "Walk-in Customer", email: "walkin@example.com" }
  ];
}
