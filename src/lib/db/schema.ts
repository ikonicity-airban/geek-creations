// lib/db/schema.ts - Drizzle ORM Schema for Geeks Creation
import { pgTable, bigserial, bigint, varchar, text, decimal, timestamp, jsonb, boolean, integer, uuid, primaryKey, index } from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

// Orders Log Table
export const ordersLog = pgTable('orders_log', {
  id: bigserial('id', { mode: 'number' }).primaryKey(),
  shopifyOrderId: bigint('shopify_order_id', { mode: 'number' }).notNull(),
  orderNumber: varchar('order_number', { length: 255 }),
  customerEmail: varchar('customer_email', { length: 255 }),
  fulfillmentProvider: varchar('fulfillment_provider', { length: 50 }).notNull(),
  status: varchar('status', { length: 50 }).notNull().default('pending'),
  profitMargin: decimal('profit_margin', { precision: 10, scale: 2 }).default('0'),
  retailPrice: decimal('retail_price', { precision: 10, scale: 2 }).default('0'),
  podCost: decimal('pod_cost', { precision: 10, scale: 2 }).default('0'),
  trackingNumber: varchar('tracking_number', { length: 255 }),
  shippedAt: timestamp('shipped_at', { withTimezone: true }),
  podResponse: jsonb('pod_response'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  shopifyOrderIdIdx: index('idx_orders_log_shopify_id').on(table.shopifyOrderId),
  statusIdx: index('idx_orders_log_status').on(table.status),
  createdAtIdx: index('idx_orders_log_created_at').on(table.createdAt),
}));

// Products Table
export const products = pgTable('products', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopifyProductId: bigint('shopify_product_id', { mode: 'number' }).notNull().unique(),
  title: varchar('title', { length: 500 }).notNull(),
  handle: varchar('handle', { length: 255 }).notNull().unique(),
  description: text('description'),
  vendor: varchar('vendor', { length: 255 }),
  productType: varchar('product_type', { length: 255 }),
  tags: text('tags').array(),
  status: varchar('status', { length: 50 }).default('active'),
  fulfillmentProvider: varchar('fulfillment_provider', { length: 50 }).notNull(),
  images: jsonb('images'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  handleIdx: index('idx_products_handle').on(table.handle),
  statusIdx: index('idx_products_status').on(table.status),
}));

// Variants Table
export const variants = pgTable('variants', {
  id: uuid('id').defaultRandom().primaryKey(),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }),
  shopifyVariantId: bigint('shopify_variant_id', { mode: 'number' }).notNull().unique(),
  title: varchar('title', { length: 255 }),
  price: decimal('price', { precision: 10, scale: 2 }).notNull(),
  compareAtPrice: decimal('compare_at_price', { precision: 10, scale: 2 }),
  sku: varchar('sku', { length: 255 }),
  inventoryQuantity: integer('inventory_quantity').default(0),
  weight: decimal('weight', { precision: 10, scale: 2 }),
  weightUnit: varchar('weight_unit', { length: 10 }),
  option1: varchar('option1', { length: 255 }),
  option2: varchar('option2', { length: 255 }),
  option3: varchar('option3', { length: 255 }),
  imageId: varchar('image_id', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  productIdIdx: index('idx_variants_product_id').on(table.productId),
}));

// Collections Table
export const collections = pgTable('collections', {
  id: uuid('id').defaultRandom().primaryKey(),
  shopifyCollectionId: bigint('shopify_collection_id', { mode: 'number' }).unique(),
  title: varchar('title', { length: 500 }).notNull(),
  handle: varchar('handle', { length: 255 }).notNull().unique(),
  description: text('description'),
  imageUrl: text('image_url'),
  sortOrder: varchar('sort_order', { length: 50 }).default('manual'),
  published: boolean('published').default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  handleIdx: index('idx_collections_handle').on(table.handle),
}));

// Collection Products Junction Table
export const collectionProducts = pgTable('collection_products', {
  collectionId: uuid('collection_id').references(() => collections.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }),
  position: integer('position').default(0),
}, (table) => ({
  pk: primaryKey({ columns: [table.collectionId, table.productId] }),
}));

// Custom Designs Table
export const customDesigns = pgTable('custom_designs', {
  id: uuid('id').defaultRandom().primaryKey(),
  userEmail: varchar('user_email', { length: 255 }),
  designData: jsonb('design_data').notNull(),
  productType: varchar('product_type', { length: 100 }).notNull(),
  previewUrl: text('preview_url'),
  status: varchar('status', { length: 50 }).default('draft'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
});

// Analytics Events Table
export const analyticsEvents = pgTable('analytics_events', {
  id: uuid('id').defaultRandom().primaryKey(),
  eventType: varchar('event_type', { length: 100 }).notNull(),
  userId: varchar('user_id', { length: 255 }),
  sessionId: varchar('session_id', { length: 255 }),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'set null' }),
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  eventTypeIdx: index('idx_analytics_events_type').on(table.eventType),
  createdAtIdx: index('idx_analytics_events_created_at').on(table.createdAt),
}));

// Designs table (marketing/merch catalog)
export const designs = pgTable('designs', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  description: text('description'),
  imageUrl: text('image_url').notNull(),
  thumbnailUrl: text('thumbnail_url'),
  category: varchar('category', { length: 100 }),
  tags: text('tags').array(),
  isActive: boolean('is_active').default(true),
  sortOrder: integer('sort_order').default(0),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  categoryIdx: index('idx_designs_category').on(table.category),
  activeIdx: index('idx_designs_active').on(table.isActive),
  sortIdx: index('idx_designs_sort_order').on(table.sortOrder),
}));

// Design-to-Product mapping for POD sync
export const designProducts = pgTable('design_products', {
  id: uuid('id').defaultRandom().primaryKey(),
  designId: uuid('design_id').references(() => designs.id, { onDelete: 'cascade' }),
  productId: uuid('product_id').references(() => products.id, { onDelete: 'cascade' }),
  mockupUrl: text('mockup_url'),
  printfulSyncVariantId: bigint('printful_sync_variant_id', { mode: 'number' }),
  printifyBlueprintId: varchar('printify_blueprint_id', { length: 255 }),
  ikonshopProductId: varchar('ikonshop_product_id', { length: 255 }),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  pk: primaryKey({ columns: [table.designId, table.productId] }),
}));

// Payment transactions per order/payment provider
export const paymentTransactions = pgTable('payment_transactions', {
  id: uuid('id').defaultRandom().primaryKey(),
  orderId: bigint('order_id', { mode: 'number' }).references(() => ordersLog.id, { onDelete: 'cascade' }),
  paymentMethod: varchar('payment_method', { length: 50 }).notNull(), // paystack, solana
  paymentProvider: varchar('payment_provider', { length: 50 }),
  transactionReference: varchar('transaction_reference', { length: 255 }).notNull(),
  amount: decimal('amount', { precision: 10, scale: 2 }).notNull(),
  currency: varchar('currency', { length: 10 }).notNull(), // NGN, USDC, SOL
  status: varchar('status', { length: 50 }).notNull(), // pending, success, failed
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
}, (table) => ({
  referenceIdx: index('idx_payment_transactions_reference').on(table.transactionReference),
  statusIdx: index('idx_payment_transactions_status').on(table.status),
}));

// Relations
export const productsRelations = relations(products, ({ many }) => ({
  variants: many(variants),
  collectionProducts: many(collectionProducts),
}));

export const variantsRelations = relations(variants, ({ one }) => ({
  product: one(products, {
    fields: [variants.productId],
    references: [products.id],
  }),
}));

export const collectionsRelations = relations(collections, ({ many }) => ({
  collectionProducts: many(collectionProducts),
}));

export const collectionProductsRelations = relations(collectionProducts, ({ one }) => ({
  collection: one(collections, {
    fields: [collectionProducts.collectionId],
    references: [collections.id],
  }),
  product: one(products, {
    fields: [collectionProducts.productId],
    references: [products.id],
  }),
}));

export const designsRelations = relations(designs, ({ many }) => ({
  designProducts: many(designProducts),
}));

export const designProductsRelations = relations(designProducts, ({ one }) => ({
  design: one(designs, {
    fields: [designProducts.designId],
    references: [designs.id],
  }),
  product: one(products, {
    fields: [designProducts.productId],
    references: [products.id],
  }),
}));

export const ordersRelations = relations(ordersLog, ({ many }) => ({
  paymentTransactions: many(paymentTransactions),
}));

export const paymentTransactionsRelations = relations(paymentTransactions, ({ one }) => ({
  order: one(ordersLog, {
    fields: [paymentTransactions.orderId],
    references: [ordersLog.id],
  }),
}));