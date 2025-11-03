// Type definitions for the API

export interface ZohoToken {
  access_token: string;
  refresh_token?: string;
  expires_at?: number;
}

export interface FishbowlProduct {
  sku: string;
  name: string;
  qty: number;
}

export interface OrderRequest {
  items: Array<{
    sku: string;
    quantity: number;
    price?: number;
  }>;
  customer: {
    name: string;
    email?: string;
  };
}
