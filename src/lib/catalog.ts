import { hasToken, getOrgId, listBooksItems } from "./zoho.js";

export type CatalogItem = { sku: string; name: string; rate: number };

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

let _cache: { items: CatalogItem[]; fetchedAt: number } | null = null;

export async function loadCatalog(): Promise<CatalogItem[]> {
  // Check cache
  if (_cache && Date.now() - _cache.fetchedAt < CACHE_TTL) {
    return _cache.items;
  }

  let items: CatalogItem[];

  if (hasToken()) {
    try {
      const orgId = await getOrgId();
      const data = await listBooksItems(orgId);
      const zohoItems = data.items || [];
      items = zohoItems.map((item: any) => ({
        sku: item.sku || String(item.item_id || ""),
        name: item.name || "",
        rate: Number(item.rate || 0)
      }));
    } catch (err) {
      console.error("Failed to load Zoho catalog, using mock:", err);
      items = getMockCatalog();
    }
  } else {
    items = getMockCatalog();
  }

  _cache = { items, fetchedAt: Date.now() };
  return items;
}

function getMockCatalog(): CatalogItem[] {
  return [
    { sku: "SKU-001", name: "Demo Widget", rate: 25 },
    { sku: "SKU-002", name: "Gizmo", rate: 49 },
    { sku: "SKU-003", name: "Cable Set", rate: 15 },
    { sku: "SKU-004", name: "Sensor Pack", rate: 89 }
  ];
}

export function findInCatalog(list: CatalogItem[], sku: string): CatalogItem | undefined {
  const skuLower = sku.toLowerCase().trim();
  return list.find(item => item.sku.toLowerCase() === skuLower);
}
