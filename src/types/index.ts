// types/index.ts - Global TypeScript types for Geeks Creation

export interface Product {
  id: string;
  shopify_product_id: number;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  product_type: string;
  tags: string[];
  status: 'active' | 'draft' | 'archived';
  fulfillment_provider: 'printful' | 'printify' | 'ikonshop';
  images: ProductImage[];
  variants: Variant[];
  created_at: string;
  updated_at: string;
}

export interface ProductImage {
  id: string;
  src: string;
  alt?: string;
  position: number;
  width?: number;
  height?: number;
}

export interface Variant {
  id: string;
  product_id: string;
  shopify_variant_id: number;
  title: string;
  price: number;
  compare_at_price?: number;
  sku: string;
  inventory_quantity: number;
  weight?: number;
  weight_unit?: string;
  option1?: string; // Size
  option2?: string; // Color
  option3?: string; // Style
  image_id?: string;
  available: boolean;
  created_at: string;
  updated_at: string;
}

export interface Collection {
  id: string;
  shopify_collection_id?: number;
  title: string;
  handle: string;
  description: string;
  image_url?: string;
  products?: Product[];
  product_count?: number;
  published: boolean;
  created_at: string;
  updated_at: string;
}

export interface CartItem {
  variant_id: string;
  product_id: string;
  product_title: string;
  variant_title: string;
  price: number;
  quantity: number;
  image: string;
  sku: string;
  max_quantity: number;
}

export interface Cart {
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  item_count: number;
}

export interface Order {
  id: number;
  shopify_order_id: number;
  order_number: string;
  customer_email: string;
  fulfillment_provider: string;
  status: 'pending' | 'success' | 'shipped' | 'failed' | 'error';
  profit_margin: number;
  retail_price: number;
  pod_cost: number;
  tracking_number?: string;
  shipped_at?: string;
  created_at: string;
  updated_at: string;
}

export interface CustomDesign {
  id: string;
  user_email?: string;
  design_data: {
    layers: DesignLayer[];
    canvas_size: { width: number; height: number };
    background_color: string;
  };
  product_type: string;
  preview_url?: string;
  status: 'draft' | 'completed' | 'ordered';
  created_at: string;
  updated_at: string;
}

export interface DesignLayer {
  id: string;
  type: 'text' | 'image' | 'shape';
  content: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  opacity: number;
  z_index: number;
  styles?: {
    font_family?: string;
    font_size?: number;
    color?: string;
    bold?: boolean;
    italic?: boolean;
  };
}

export interface ShippingAddress {
  first_name: string;
  last_name: string;
  company?: string;
  address1: string;
  address2?: string;
  city: string;
  province: string;
  country: string;
  zip: string;
  phone: string;
}

export interface CheckoutData {
  email: string;
  shipping_address: ShippingAddress;
  billing_address?: ShippingAddress;
  payment_method: 'card' | 'crypto' | 'bank_transfer';
  crypto_currency?: 'USDC' | 'SOL';
}

export interface AnalyticsEvent {
  event_type: 'page_view' | 'product_view' | 'add_to_cart' | 'remove_from_cart' | 'checkout_start' | 'purchase';
  user_id?: string;
  session_id: string;
  product_id?: string;
  metadata?: Record<string, any>;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    per_page: number;
    total: number;
    total_pages: number;
  };
}

// Filter and sort types
export interface ProductFilters {
  collection?: string;
  product_type?: string;
  tags?: string[];
  min_price?: number;
  max_price?: number;
  in_stock?: boolean;
}

export interface ProductSort {
  field: 'title' | 'price' | 'created_at' | 'popularity';
  direction: 'asc' | 'desc';
}

// Webhook types
export interface ShopifyWebhookOrder {
  id: number;
  order_number: number;
  email: string;
  total_price: string;
  subtotal_price: string;
  total_tax: string;
  currency: string;
  financial_status: string;
  fulfillment_status: string;
  line_items: ShopifyLineItem[];
  shipping_address: ShippingAddress;
  customer: {
    id: number;
    email: string;
    first_name: string;
    last_name: string;
  };
  created_at: string;
  updated_at: string;
}

export interface ShopifyLineItem {
  id: number;
  variant_id: number;
  title: string;
  quantity: number;
  price: string;
  sku: string;
  vendor: string;
  product_id: number;
  fulfillment_service: string;
}