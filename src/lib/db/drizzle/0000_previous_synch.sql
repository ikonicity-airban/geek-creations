CREATE TABLE IF NOT EXISTS "analytics_events" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"event_type" varchar(100) NOT NULL,
	"user_id" varchar(255),
	"session_id" varchar(255),
	"product_id" uuid,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collection_products" (
	"collection_id" uuid,
	"product_id" uuid,
	"position" integer DEFAULT 0,
	CONSTRAINT "collection_products_collection_id_product_id_pk" PRIMARY KEY("collection_id","product_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "collections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shopify_collection_id" bigint,
	"title" varchar(500) NOT NULL,
	"handle" varchar(255) NOT NULL,
	"description" text,
	"image_url" text,
	"sort_order" varchar(50) DEFAULT 'manual',
	"published" boolean DEFAULT true,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "collections_shopify_collection_id_unique" UNIQUE("shopify_collection_id"),
	CONSTRAINT "collections_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "custom_designs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_email" varchar(255),
	"design_data" jsonb NOT NULL,
	"product_type" varchar(100) NOT NULL,
	"preview_url" text,
	"status" varchar(50) DEFAULT 'draft',
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "design_products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"design_id" uuid,
	"product_id" uuid,
	"mockup_url" text,
	"printful_sync_variant_id" bigint,
	"printify_blueprint_id" varchar(255),
	"ikonshop_product_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "design_products_design_id_product_id_pk" PRIMARY KEY("design_id","product_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "designs" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"title" varchar(255) NOT NULL,
	"description" text,
	"image_url" text NOT NULL,
	"thumbnail_url" text,
	"category" varchar(100),
	"tags" text[],
	"is_active" boolean DEFAULT true,
	"sort_order" integer DEFAULT 0,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders_log" (
	"id" bigserial PRIMARY KEY NOT NULL,
	"shopify_order_id" bigint NOT NULL,
	"order_number" varchar(255),
	"customer_email" varchar(255),
	"fulfillment_provider" varchar(50) NOT NULL,
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"profit_margin" numeric(10, 2) DEFAULT '0',
	"retail_price" numeric(10, 2) DEFAULT '0',
	"pod_cost" numeric(10, 2) DEFAULT '0',
	"tracking_number" varchar(255),
	"shipped_at" timestamp with time zone,
	"pod_response" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "payment_transactions" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"order_id" bigint,
	"payment_method" varchar(50) NOT NULL,
	"payment_provider" varchar(50),
	"transaction_reference" varchar(255) NOT NULL,
	"amount" numeric(10, 2) NOT NULL,
	"currency" varchar(10) NOT NULL,
	"status" varchar(50) NOT NULL,
	"metadata" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"shopify_product_id" bigint NOT NULL,
	"title" varchar(500) NOT NULL,
	"handle" varchar(255) NOT NULL,
	"description" text,
	"vendor" varchar(255),
	"product_type" varchar(255),
	"tags" text[],
	"status" varchar(50) DEFAULT 'active',
	"fulfillment_provider" varchar(50) NOT NULL,
	"images" jsonb,
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "products_shopify_product_id_unique" UNIQUE("shopify_product_id"),
	CONSTRAINT "products_handle_unique" UNIQUE("handle")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "variants" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"shopify_variant_id" bigint NOT NULL,
	"title" varchar(255),
	"price" numeric(10, 2) NOT NULL,
	"compare_at_price" numeric(10, 2),
	"sku" varchar(255),
	"inventory_quantity" integer DEFAULT 0,
	"weight" numeric(10, 2),
	"weight_unit" varchar(10),
	"option1" varchar(255),
	"option2" varchar(255),
	"option3" varchar(255),
	"image_id" varchar(255),
	"created_at" timestamp with time zone DEFAULT now(),
	"updated_at" timestamp with time zone DEFAULT now(),
	CONSTRAINT "variants_shopify_variant_id_unique" UNIQUE("shopify_variant_id")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_collection_id_collections_id_fk" FOREIGN KEY ("collection_id") REFERENCES "public"."collections"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "collection_products" ADD CONSTRAINT "collection_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "design_products" ADD CONSTRAINT "design_products_design_id_designs_id_fk" FOREIGN KEY ("design_id") REFERENCES "public"."designs"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "design_products" ADD CONSTRAINT "design_products_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "payment_transactions" ADD CONSTRAINT "payment_transactions_order_id_orders_log_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders_log"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "variants" ADD CONSTRAINT "variants_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_analytics_events_type" ON "analytics_events" USING btree ("event_type");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_analytics_events_created_at" ON "analytics_events" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_collections_handle" ON "collections" USING btree ("handle");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_designs_category" ON "designs" USING btree ("category");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_designs_active" ON "designs" USING btree ("is_active");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_designs_sort_order" ON "designs" USING btree ("sort_order");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orders_log_shopify_id" ON "orders_log" USING btree ("shopify_order_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orders_log_status" ON "orders_log" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_orders_log_created_at" ON "orders_log" USING btree ("created_at");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_payment_transactions_reference" ON "payment_transactions" USING btree ("transaction_reference");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_payment_transactions_status" ON "payment_transactions" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_handle" ON "products" USING btree ("handle");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_products_status" ON "products" USING btree ("status");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "idx_variants_product_id" ON "variants" USING btree ("product_id");