ALTER TABLE "orders_log" DROP CONSTRAINT "orders_log_shopify_order_id_unique";--> statement-breakpoint
ALTER TABLE "orders_log" ALTER COLUMN "shopify_order_id" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders_log" ALTER COLUMN "fulfillment_provider" SET DEFAULT 'manual';--> statement-breakpoint
ALTER TABLE "orders_log" ALTER COLUMN "fulfillment_provider" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "orders_log" ALTER COLUMN "status" SET DEFAULT 'pending_payment';--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "shopify_draft_order_id" varchar(255);--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "customer_phone" varchar(50);--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "subtotal" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "tax" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "shipping_cost" numeric(10, 2);--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "currency" varchar(10) DEFAULT 'NGN';--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "payment_method" varchar(50);--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "payment_provider" varchar(50);--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "payment_reference" varchar(255);--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "payment_status" varchar(50) DEFAULT 'pending';--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "paid_at" timestamp with time zone;--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "shipping_address" jsonb;--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "billing_address" jsonb;--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "line_items" jsonb;--> statement-breakpoint
ALTER TABLE "orders_log" ADD COLUMN "notes" text;--> statement-breakpoint
CREATE INDEX "idx_orders_log_payment_ref" ON "orders_log" USING btree ("payment_reference");--> statement-breakpoint
CREATE INDEX "idx_orders_log_payment_status" ON "orders_log" USING btree ("payment_status");--> statement-breakpoint
CREATE INDEX "idx_orders_log_email" ON "orders_log" USING btree ("customer_email");--> statement-breakpoint
ALTER TABLE "collection_translations" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "design_translations" DROP COLUMN "id";--> statement-breakpoint
ALTER TABLE "product_translations" DROP COLUMN "id";