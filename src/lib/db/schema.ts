// lib/db/schema.ts - Optimized Drizzle Schema for Geek Creations POD Store
import {
  pgTable,
  bigserial,
  bigint,
  varchar,
  text,
  decimal,
  timestamp,
  jsonb,
  boolean,
  integer,
  uuid,
  primaryKey,
  index,
} from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Orders Log
export const ordersLog = pgTable(
  "orders_log",
  {
    id: bigserial("id", { mode: "number" }).primaryKey(),
    shopifyOrderId: bigint("shopify_order_id", { mode: "number" }),
    shopifyDraftOrderId: varchar("shopify_draft_order_id", { length: 255 }),
    orderNumber: varchar("order_number", { length: 255 }),
    customerEmail: varchar("customer_email", { length: 255 }),
    customerPhone: varchar("customer_phone", { length: 50 }),

    // Pricing fields
    totalPrice: decimal("total_price", { precision: 10, scale: 2 }),
    subtotal: decimal("subtotal", { precision: 10, scale: 2 }),
    tax: decimal("tax", { precision: 10, scale: 2 }),
    shippingCost: decimal("shipping_cost", { precision: 10, scale: 2 }),
    currency: varchar("currency", { length: 10 }).default("NGN"),

    // Payment tracking fields
    paymentMethod: varchar("payment_method", { length: 50 }),
    paymentProvider: varchar("payment_provider", { length: 50 }),
    paymentReference: varchar("payment_reference", { length: 255 }),
    paymentStatus: varchar("payment_status", { length: 50 }).default("pending"),
    paidAt: timestamp("paid_at", { withTimezone: true }),

    // Address fields (JSONB for flexibility)
    shippingAddress: jsonb("shipping_address"),
    billingAddress: jsonb("billing_address"),

    // Order line items
    lineItems: jsonb("line_items"),

    // Fulfillment fields
    fulfillmentProvider: varchar("fulfillment_provider", {
      length: 50,
    }).default("manual"),
    status: varchar("status", { length: 50 })
      .notNull()
      .default("pending_payment"),
    profitMargin: decimal("profit_margin", { precision: 10, scale: 2 }).default(
      "0.00",
    ),
    retailPrice: decimal("retail_price", { precision: 10, scale: 2 }).default(
      "0.00",
    ),
    podCost: decimal("pod_cost", { precision: 10, scale: 2 }).default("0.00"),
    trackingNumber: varchar("tracking_number", { length: 255 }),
    shippedAt: timestamp("shipped_at", { withTimezone: true }),
    podResponse: jsonb("pod_response"),

    // Admin notes
    notes: text("notes"),

    // Timestamps
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    shopifyOrderIdIdx: index("idx_orders_log_shopify_id").on(
      table.shopifyOrderId,
    ),
    paymentRefIdx: index("idx_orders_log_payment_ref").on(
      table.paymentReference,
    ),
    paymentStatusIdx: index("idx_orders_log_payment_status").on(
      table.paymentStatus,
    ),
    statusIdx: index("idx_orders_log_status").on(table.status),
    createdAtIdx: index("idx_orders_log_created_at").on(table.createdAt),
    providerIdx: index("idx_orders_log_provider").on(table.fulfillmentProvider),
    emailIdx: index("idx_orders_log_email").on(table.customerEmail),
  }),
);

// Products
export const products = pgTable(
  "products",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    shopifyProductId: bigint("shopify_product_id", { mode: "number" })
      .notNull()
      .unique(),
    title: varchar("title", { length: 500 }).notNull(),
    handle: varchar("handle", { length: 255 }).notNull().unique(),
    description: text("description"),
    featuredImage: text("featured_image"),
    vendor: varchar("vendor", { length: 255 }),
    productType: varchar("product_type", { length: 255 }),
    tags: text("tags").array(),
    status: varchar("status", { length: 50 }).default("active"),
    fulfillmentProvider: varchar("fulfillment_provider", {
      length: 50,
    }).notNull(),
    images: jsonb("images"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    handleIdx: index("idx_products_handle").on(table.handle),
    statusIdx: index("idx_products_status").on(table.status),
    providerIdx: index("idx_products_provider").on(table.fulfillmentProvider),
  }),
);

// Variants
export const variants = pgTable(
  "variants",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    productId: uuid("product_id")
      .references(() => products.id, { onDelete: "cascade" })
      .notNull(),
    shopifyVariantId: bigint("shopify_variant_id", { mode: "number" })
      .notNull()
      .unique(),
    title: varchar("title", { length: 255 }),
    price: decimal("price", { precision: 10, scale: 2 }).notNull(),
    compareAtPrice: decimal("compare_at_price", { precision: 10, scale: 2 }),
    sku: varchar("sku", { length: 255 }),
    inventoryQuantity: integer("inventory_quantity").default(0),
    weight: decimal("weight", { precision: 10, scale: 2 }),
    weightUnit: varchar("weight_unit", { length: 10 }),
    option1: varchar("option1", { length: 255 }),
    option2: varchar("option2", { length: 255 }),
    option3: varchar("option3", { length: 255 }),
    imageId: varchar("image_id", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    productIdIdx: index("idx_variants_product_id").on(table.productId),
  }),
);

// Collections & Junction (FIXED: removed duplicate pk)
export const collections = pgTable(
  "collections",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    shopifyCollectionId: bigint("shopify_collection_id", {
      mode: "number",
    }).unique(),
    title: varchar("title", { length: 500 }).notNull(),
    handle: varchar("handle", { length: 255 }).notNull().unique(),
    description: text("description"),
    imageUrl: text("image_url"),
    sortOrder: varchar("sort_order", { length: 50 }).default("manual"),
    published: boolean("published").default(true),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    handleIdx: index("idx_collections_handle").on(table.handle),
  }),
);

export const collectionProducts = pgTable(
  "collection_products",
  {
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    position: integer("position").default(0),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.collectionId, table.productId] }),
  }),
);

// Custom Designs, Analytics, Designs (unchanged – good)

export const designs = pgTable(
  "designs",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    title: varchar("title", { length: 255 }).notNull(),
    description: text("description"),
    imageUrl: text("image_url").notNull(),
    thumbnailUrl: text("thumbnail_url"),
    category: varchar("category", { length: 100 }),
    tags: text("tags").array(),
    isActive: boolean("is_active").default(true),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    categoryIdx: index("idx_designs_category").on(table.category),
    activeIdx: index("idx_designs_active").on(table.isActive),
    sortIdx: index("idx_designs_sort_order").on(table.sortOrder),
  }),
);

// Design Products Junction (FIXED: removed duplicate pk)
export const designProducts = pgTable(
  "design_products",
  {
    designId: uuid("design_id")
      .notNull()
      .references(() => designs.id, { onDelete: "cascade" }),
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    mockupUrl: text("mockup_url"),
    isPrimary: boolean("is_primary").default(false),
    printfulSyncVariantId: bigint("printful_sync_variant_id", {
      mode: "number",
    }),
    printifyBlueprintId: varchar("printify_blueprint_id", { length: 255 }),
    ikonshopProductId: varchar("ikonshop_product_id", { length: 255 }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.designId, table.productId] }),
    productIdx: index("idx_design_products_product").on(table.productId),
  }),
);

// Payment Transactions (FIXED FK type)
export const paymentTransactions = pgTable(
  "payment_transactions",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    orderId: bigint("order_id", { mode: "number" }).references(
      () => ordersLog.id,
      { onDelete: "cascade" },
    ),
    paymentMethod: varchar("payment_method", { length: 50 }).notNull(), // paystack, solana
    paymentProvider: varchar("payment_provider", { length: 50 }),
    transactionReference: varchar("transaction_reference", {
      length: 255,
    }).notNull(),
    amount: decimal("amount", { precision: 10, scale: 2 }).notNull(),
    currency: varchar("currency", { length: 10 }).notNull(), // NGN, USDC, SOL
    status: varchar("status", { length: 50 }).notNull(), // pending, success, failed
    metadata: jsonb("metadata"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    orderIdx: index("idx_payment_transactions_order").on(table.orderId),
    referenceIdx: index("idx_payment_transactions_reference").on(
      table.transactionReference,
    ),
    statusIdx: index("idx_payment_transactions_status").on(table.status),
  }),
);

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

export const collectionProductsRelations = relations(
  collectionProducts,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionProducts.collectionId],
      references: [collections.id],
    }),
    product: one(products, {
      fields: [collectionProducts.productId],
      references: [products.id],
    }),
  }),
);

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

export const paymentTransactionsRelations = relations(
  paymentTransactions,
  ({ one }) => ({
    order: one(ordersLog, {
      fields: [paymentTransactions.orderId],
      references: [ordersLog.id],
    }),
  }),
);

// Site Settings
export const siteSettings = pgTable("site_settings", {
  id: uuid("id").defaultRandom().primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value"),
  type: varchar("type", { length: 50 }).notNull().default("string"), // string, number, boolean, json
  category: varchar("category", { length: 100 }), // general, locale, payment, shipping, etc.
  description: text("description"),
  isPublic: boolean("is_public").default(false), // whether to expose in public API
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

// Currencies
export const currencies = pgTable(
  "currencies",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 3 }).notNull().unique(), // NGN, USD, EUR, GBP, JPY
    name: varchar("name", { length: 100 }).notNull(), // Nigerian Naira, US Dollar, etc.
    symbol: varchar("symbol", { length: 10 }).notNull(), // ₦, $, €, £, ¥
    symbolPosition: varchar("symbol_position", { length: 10 })
      .notNull()
      .default("before"), // before, after
    decimalPlaces: integer("decimal_places").notNull().default(2),
    isActive: boolean("is_active").default(true),
    isDefault: boolean("is_default").default(false),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    codeIdx: index("idx_currencies_code").on(table.code),
    activeIdx: index("idx_currencies_active").on(table.isActive),
  }),
);

// Exchange Rates
export const exchangeRates = pgTable(
  "exchange_rates",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    baseCurrency: varchar("base_currency", { length: 3 })
      .notNull()
      .references(() => currencies.code, { onDelete: "cascade" }),
    targetCurrency: varchar("target_currency", { length: 3 })
      .notNull()
      .references(() => currencies.code, { onDelete: "cascade" }),
    rate: decimal("rate", { precision: 20, scale: 10 }).notNull(),
    source: varchar("source", { length: 50 }).default("manual"), // manual, api, cron
    lastFetchedAt: timestamp("last_fetched_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    rateIdx: index("idx_exchange_rates_currencies").on(
      table.baseCurrency,
      table.targetCurrency,
    ),
    updatedIdx: index("idx_exchange_rates_updated").on(table.updatedAt),
  }),
);

// Languages/Locales
export const languages = pgTable(
  "languages",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    code: varchar("code", { length: 10 }).notNull().unique(), // en, fr, yo, ig, ha
    name: varchar("name", { length: 100 }).notNull(), // English, French, Yoruba
    nativeName: varchar("native_name", { length: 100 }), // English, Français, Yorùbá
    flag: varchar("flag", { length: 10 }), // emoji flag or icon
    isActive: boolean("is_active").default(true),
    isDefault: boolean("is_default").default(false),
    isRTL: boolean("is_rtl").default(false), // right-to-left languages
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    codeIdx: index("idx_languages_code").on(table.code),
    activeIdx: index("idx_languages_active").on(table.isActive),
  }),
);

// Translations
export const translations = pgTable(
  "translations",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    languageCode: varchar("language_code", { length: 10 })
      .notNull()
      .references(() => languages.code, { onDelete: "cascade" }),
    namespace: varchar("namespace", { length: 100 }).notNull(), // common, products, checkout, etc.
    key: varchar("key", { length: 255 }).notNull(), // button.submit, header.title, etc.
    value: text("value").notNull(),
    pluralForm: varchar("plural_form", { length: 50 }), // zero, one, two, few, many, other
    context: text("context"), // additional context for translators
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    translationIdx: index("idx_translations_lookup").on(
      table.languageCode,
      table.namespace,
      table.key,
    ),
    namespaceIdx: index("idx_translations_namespace").on(table.namespace),
  }),
);

// Product Translations
export const productTranslations = pgTable(
  "product_translations",
  {
    productId: uuid("product_id")
      .notNull()
      .references(() => products.id, { onDelete: "cascade" }),
    languageCode: varchar("language_code", { length: 10 })
      .notNull()
      .references(() => languages.code, { onDelete: "cascade" }),
    title: varchar("title", { length: 500 }),
    description: text("description"),
    metaTitle: varchar("meta_title", { length: 255 }),
    metaDescription: text("meta_description"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.productId, table.languageCode] }),
    productIdx: index("idx_product_translations_product").on(table.productId),
  }),
);

// Design Translations
export const designTranslations = pgTable(
  "design_translations",
  {
    designId: uuid("design_id")
      .notNull()
      .references(() => designs.id, { onDelete: "cascade" }),
    languageCode: varchar("language_code", { length: 10 })
      .notNull()
      .references(() => languages.code, { onDelete: "cascade" }),
    title: varchar("title", { length: 255 }),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.designId, table.languageCode] }),
    designIdx: index("idx_design_translations_design").on(table.designId),
  }),
);

// Collection Translations
export const collectionTranslations = pgTable(
  "collection_translations",
  {
    collectionId: uuid("collection_id")
      .notNull()
      .references(() => collections.id, { onDelete: "cascade" }),
    languageCode: varchar("language_code", { length: 10 })
      .notNull()
      .references(() => languages.code, { onDelete: "cascade" }),
    title: varchar("title", { length: 500 }),
    description: text("description"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow(),
  },
  (table) => ({
    pk: primaryKey({ columns: [table.collectionId, table.languageCode] }),
    collectionIdx: index("idx_collection_translations_collection").on(
      table.collectionId,
    ),
  }),
);

// Relations for new tables
export const currenciesRelations = relations(currencies, ({ many }) => ({
  exchangeRatesAsBase: many(exchangeRates, {
    relationName: "baseCurrency",
  }),
  exchangeRatesAsTarget: many(exchangeRates, {
    relationName: "targetCurrency",
  }),
}));

export const exchangeRatesRelations = relations(exchangeRates, ({ one }) => ({
  baseCurrency: one(currencies, {
    fields: [exchangeRates.baseCurrency],
    references: [currencies.code],
    relationName: "baseCurrency",
  }),
  targetCurrency: one(currencies, {
    fields: [exchangeRates.targetCurrency],
    references: [currencies.code],
    relationName: "targetCurrency",
  }),
}));

export const languagesRelations = relations(languages, ({ many }) => ({
  translations: many(translations),
  productTranslations: many(productTranslations),
  designTranslations: many(designTranslations),
  collectionTranslations: many(collectionTranslations),
}));

export const translationsRelations = relations(translations, ({ one }) => ({
  language: one(languages, {
    fields: [translations.languageCode],
    references: [languages.code],
  }),
}));

export const productTranslationsRelations = relations(
  productTranslations,
  ({ one }) => ({
    product: one(products, {
      fields: [productTranslations.productId],
      references: [products.id],
    }),
    language: one(languages, {
      fields: [productTranslations.languageCode],
      references: [languages.code],
    }),
  }),
);

export const designTranslationsRelations = relations(
  designTranslations,
  ({ one }) => ({
    design: one(designs, {
      fields: [designTranslations.designId],
      references: [designs.id],
    }),
    language: one(languages, {
      fields: [designTranslations.languageCode],
      references: [languages.code],
    }),
  }),
);

export const collectionTranslationsRelations = relations(
  collectionTranslations,
  ({ one }) => ({
    collection: one(collections, {
      fields: [collectionTranslations.collectionId],
      references: [collections.id],
    }),
    language: one(languages, {
      fields: [collectionTranslations.languageCode],
      references: [languages.code],
    }),
  }),
);
