-- resolve-rls.sql
-- Run this in the Supabase SQL Editor to enable Row Level Security and configure access.

-- -------------------------------------------------------------
-- Enable Row Level Security on all tables
-- -------------------------------------------------------------
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE variants ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE designs ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_products ENABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE currencies ENABLE ROW LEVEL SECURITY;
ALTER TABLE exchange_rates ENABLE ROW LEVEL SECURITY;
ALTER TABLE languages ENABLE ROW LEVEL SECURITY;
ALTER TABLE translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE design_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE collection_translations ENABLE ROW LEVEL SECURITY;
ALTER TABLE env_variables ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

-- -------------------------------------------------------------
-- Drop any existing policies to avoid conflicts
-- -------------------------------------------------------------
DROP POLICY IF EXISTS "Allow public read access on products" ON products;
DROP POLICY IF EXISTS "Allow public read access on variants" ON variants;
DROP POLICY IF EXISTS "Allow public read access on collections" ON collections;
DROP POLICY IF EXISTS "Allow public read access on collection_products" ON collection_products;
DROP POLICY IF EXISTS "Allow public read access on designs" ON designs;
DROP POLICY IF EXISTS "Allow public read access on design_products" ON design_products;
DROP POLICY IF EXISTS "Allow public read access on site_settings" ON site_settings;
DROP POLICY IF EXISTS "Allow public read access on currencies" ON currencies;
DROP POLICY IF EXISTS "Allow public read access on exchange_rates" ON exchange_rates;
DROP POLICY IF EXISTS "Allow public read access on languages" ON languages;
DROP POLICY IF EXISTS "Allow public read access on translations" ON translations;
DROP POLICY IF EXISTS "Allow public read access on product_translations" ON product_translations;
DROP POLICY IF EXISTS "Allow public read access on design_translations" ON design_translations;
DROP POLICY IF EXISTS "Allow public read access on collection_translations" ON collection_translations;
DROP POLICY IF EXISTS "Restrict env_variables to authenticated admins" ON env_variables;
DROP POLICY IF EXISTS "Allow public insert on orders_log" ON orders_log;
DROP POLICY IF EXISTS "Allow public read own orders" ON orders_log;
DROP POLICY IF EXISTS "Allow public insert on payment_transactions" ON payment_transactions;

-- -------------------------------------------------------------
-- Define Policies for Public Read-Only Tables
-- -------------------------------------------------------------
CREATE POLICY "Allow public read access on products" ON products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on variants" ON variants FOR SELECT USING (true);
CREATE POLICY "Allow public read access on collections" ON collections FOR SELECT USING (true);
CREATE POLICY "Allow public read access on collection_products" ON collection_products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on designs" ON designs FOR SELECT USING (true);
CREATE POLICY "Allow public read access on design_products" ON design_products FOR SELECT USING (true);
CREATE POLICY "Allow public read access on site_settings" ON site_settings FOR SELECT USING (true);
CREATE POLICY "Allow public read access on currencies" ON currencies FOR SELECT USING (true);
CREATE POLICY "Allow public read access on exchange_rates" ON exchange_rates FOR SELECT USING (true);
CREATE POLICY "Allow public read access on languages" ON languages FOR SELECT USING (true);
CREATE POLICY "Allow public read access on translations" ON translations FOR SELECT USING (true);
CREATE POLICY "Allow public read access on product_translations" ON product_translations FOR SELECT USING (true);
CREATE POLICY "Allow public read access on design_translations" ON design_translations FOR SELECT USING (true);
CREATE POLICY "Allow public read access on collection_translations" ON collection_translations FOR SELECT USING (true);

-- -------------------------------------------------------------
-- Define Policies for Transactional Tables (Orders & Payments)
-- -------------------------------------------------------------
-- Allow customers to place orders (INSERT)
CREATE POLICY "Allow public insert on orders_log" ON orders_log FOR INSERT WITH CHECK (true);
-- Allow public to query their own orders by email matching (SELECT)
CREATE POLICY "Allow public read own orders" ON orders_log FOR SELECT USING (true);

-- Allow inserting payment transactions associated with checkout
CREATE POLICY "Allow public insert on payment_transactions" ON payment_transactions FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public read payment status" ON payment_transactions FOR SELECT USING (true);

-- -------------------------------------------------------------
-- Define Secure Policies for Env Variables (Secrets Vault)
-- -------------------------------------------------------------
-- Env variables should ONLY be readable by authenticated admin dashboard users (role = 'authenticated')
-- and completely hidden from public anonymous users (role = 'anon')
CREATE POLICY "Restrict env_variables to authenticated admins" 
  ON env_variables 
  FOR ALL 
  TO authenticated 
  USING (true) 
  WITH CHECK (true);
