-- Migration: Extend orders_log table with payment tracking and shipping details
-- Date: 2024-01-XX
-- Description: Add payment tracking, shipping addresses, and order details to orders_log

-- Add new columns to orders_log table
ALTER TABLE orders_log
  -- Make shopifyOrderId nullable (draft orders don't have Shopify order ID yet)
  ALTER COLUMN shopify_order_id DROP NOT NULL,
  ALTER COLUMN shopify_order_id DROP CONSTRAINT IF EXISTS orders_log_shopify_order_id_unique,

  -- Add Shopify draft order ID
  ADD COLUMN IF NOT EXISTS shopify_draft_order_id VARCHAR(255),

  -- Add customer phone
  ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(50),

  -- Add pricing fields
  ADD COLUMN IF NOT EXISTS subtotal DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS tax DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS shipping_cost DECIMAL(10, 2),
  ADD COLUMN IF NOT EXISTS currency VARCHAR(10) DEFAULT 'NGN',

  -- Add payment tracking fields
  ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50),
  ADD COLUMN IF NOT EXISTS payment_provider VARCHAR(50),
  ADD COLUMN IF NOT EXISTS payment_reference VARCHAR(255),
  ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'pending',
  ADD COLUMN IF NOT EXISTS paid_at TIMESTAMPTZ,

  -- Add address fields (JSONB)
  ADD COLUMN IF NOT EXISTS shipping_address JSONB,
  ADD COLUMN IF NOT EXISTS billing_address JSONB,

  -- Add line items
  ADD COLUMN IF NOT EXISTS line_items JSONB,

  -- Add admin notes
  ADD COLUMN IF NOT EXISTS notes TEXT,

  -- Update fulfillment_provider to allow NULL and set default
  ALTER COLUMN fulfillment_provider DROP NOT NULL,
  ALTER COLUMN fulfillment_provider SET DEFAULT 'manual',

  -- Update status default
  ALTER COLUMN status SET DEFAULT 'pending_payment';

-- Create indexes for new columns
CREATE INDEX IF NOT EXISTS idx_orders_log_payment_ref ON orders_log(payment_reference);
CREATE INDEX IF NOT EXISTS idx_orders_log_payment_status ON orders_log(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_log_email ON orders_log(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_log_draft_order ON orders_log(shopify_draft_order_id);

-- Add comments for documentation
COMMENT ON COLUMN orders_log.shopify_draft_order_id IS 'Shopify draft order ID (before payment completion)';
COMMENT ON COLUMN orders_log.payment_method IS 'Payment method: card, bank_transfer, crypto';
COMMENT ON COLUMN orders_log.payment_provider IS 'Payment provider: paystack, flutterwave, solana';
COMMENT ON COLUMN orders_log.payment_reference IS 'Unique payment transaction reference';
COMMENT ON COLUMN orders_log.payment_status IS 'Payment status: pending, paid, failed, abandoned';
COMMENT ON COLUMN orders_log.shipping_address IS 'Customer shipping address (JSON)';
COMMENT ON COLUMN orders_log.billing_address IS 'Customer billing address (JSON)';
COMMENT ON COLUMN orders_log.line_items IS 'Order line items with product details (JSON)';
COMMENT ON COLUMN orders_log.notes IS 'Admin notes for order processing';

-- Update existing records to set default values for new columns
UPDATE orders_log
SET
  payment_status = 'paid'
WHERE payment_status IS NULL AND status IN ('shipped', 'processing');

UPDATE orders_log
SET
  payment_status = 'pending'
WHERE payment_status IS NULL;

UPDATE orders_log
SET
  fulfillment_provider = 'manual'
WHERE fulfillment_provider IS NULL;

-- Add constraint to ensure payment_reference is unique when not null
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_log_payment_ref_unique
ON orders_log(payment_reference)
WHERE payment_reference IS NOT NULL;
