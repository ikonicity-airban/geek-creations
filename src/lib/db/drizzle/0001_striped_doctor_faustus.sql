ALTER TABLE "analytics_events" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
ALTER TABLE "custom_designs" DISABLE ROW LEVEL SECURITY;--> statement-breakpoint
DROP TABLE "analytics_events" CASCADE;--> statement-breakpoint
DROP TABLE "custom_designs" CASCADE;--> statement-breakpoint
ALTER TABLE "collection_products" ALTER COLUMN "collection_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "collection_products" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "design_products" ALTER COLUMN "design_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "design_products" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "orders_log" ALTER COLUMN "profit_margin" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "orders_log" ALTER COLUMN "retail_price" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "orders_log" ALTER COLUMN "pod_cost" SET DEFAULT '0.00';--> statement-breakpoint
ALTER TABLE "variants" ALTER COLUMN "product_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "design_products" ADD COLUMN "is_primary" boolean DEFAULT false;--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "total_price" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "products" ADD COLUMN "featured_image" text;--> statement-breakpoint
CREATE INDEX "idx_design_products_product" ON "design_products" USING btree ("product_id");--> statement-breakpoint
CREATE INDEX "idx_orders_log_provider" ON "orders_log" USING btree ("fulfillment_provider");--> statement-breakpoint
CREATE INDEX "idx_payment_transactions_order" ON "payment_transactions" USING btree ("order_id");--> statement-breakpoint
CREATE INDEX "idx_products_provider" ON "products" USING btree ("fulfillment_provider");--> statement-breakpoint
ALTER TABLE "design_products" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "orders_log" ADD CONSTRAINT "orders_log_shopify_order_id_unique" UNIQUE("shopify_order_id");