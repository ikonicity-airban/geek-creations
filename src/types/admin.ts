// types/admin.ts - Admin dashboard types

import { Order, ShippingAddress } from "./index";

export interface ExtendedOrder extends Order {
  shipping_city?: string;
  shipping_country?: string;
  shipping_address?: ShippingAddress;
  items?: OrderItem[];
  pod_provider?: string;
}

export interface OrderItem {
  id: string;
  title: string;
  quantity: number;
  price: string | number;
  sku?: string;
  variant_id?: number;
  product_id?: number;
  design_preview_url?: string;
  mockup_url?: string;
}

export interface OrderStats {
  totalOrders: number;
  pendingOrders: number;
  revenueToday: number;
}

export type FulfillmentProvider = "printify" | "printful" | "local_print";

export interface FulfillmentResult {
  success: boolean;
  orderId: number;
  provider: FulfillmentProvider;
  trackingNumber?: string;
  error?: string;
}
