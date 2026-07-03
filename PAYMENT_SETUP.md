# Payment and Fulfillment Setup Guide

This guide covers setting up payment gateways, POD (Print on Demand) providers, and email notifications for the Geek Creations e-commerce platform.

## Required Environment Variables

### 1. Base Configuration

```bash
# Site Configuration
NEXT_PUBLIC_SITE_NAME="Geek Creations"
NEXT_PUBLIC_SITE_LOGO="https://yoursite.com/logo.png"
NEXT_PUBLIC_BASE_URL="https://yoursite.com"

# Shopify Configuration
SHOPIFY_STORE_DOMAIN="your-store.myshopify.com"
SHOPIFY_ACCESS_TOKEN="shpat_xxxxxxxxxxxxx"
SHOPIFY_CURRENCY_CODE="NGN"  # or USD, GBP, etc.
```

### 2. Payment Gateway Configuration

Choose your primary payment provider by setting:

```bash
# Payment Provider Selection (optional - defaults to Paystack)
PAYMENT_PROVIDER="paystack"  # or "flutterwave"
```

#### Paystack (Recommended for Nigerian merchants)

```bash
# Paystack API Keys (Get from: https://dashboard.paystack.com/#/settings/developer)
PAYSTACK_SECRET_KEY="sk_test_xxxxxxxxxxxxx"  # Use sk_live_ for production
NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY="pk_test_xxxxxxxxxxxxx"  # Use pk_live_ for production
```

**Setup Steps:**
1. Sign up at https://paystack.com
2. Complete KYC verification
3. Go to Settings > API Keys & Webhooks
4. Copy your test keys (or live keys for production)
5. Add webhook URL: `https://yoursite.com/api/webhooks/paystack`

**Supported Methods:**
- Card payments
- Bank transfer
- USSD
- Mobile money (MTN, Airtel, etc.)

#### Flutterwave (Multi-currency support)

```bash
# Flutterwave API Keys (Get from: https://dashboard.flutterwave.com/settings/apis)
FLUTTERWAVE_SECRET_KEY="FLWSECK_TEST-xxxxxxxxxxxxx"  # Use FLWSECK- for production
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY="FLWPUBK_TEST-xxxxxxxxxxxxx"  # Use FLWPUBK- for production
FLUTTERWAVE_SECRET_HASH="your_webhook_secret_hash"
```

**Setup Steps:**
1. Sign up at https://flutterwave.com
2. Complete business verification
3. Go to Settings > API
4. Copy your test keys (or live keys for production)
5. Add webhook URL: `https://yoursite.com/api/webhooks/flutterwave`

**Supported Methods:**
- Card payments (international)
- Bank transfer
- USSD
- Mobile money (Ghana, Kenya, Uganda, etc.)
- PayPal (via Flutterwave)

### 3. Crypto Payment (Optional)

```bash
# Solana Pay Configuration
NEXT_PUBLIC_SOLANA_NETWORK="devnet"  # or "mainnet-beta" for production
SOLANA_MERCHANT_WALLET="your_solana_wallet_address"
```

### 4. Print on Demand (POD) Providers

#### Printful

```bash
# Printful API (Get from: https://www.printful.com/dashboard/settings)
PRINTFUL_API_KEY="your_printful_api_key"
```

**Setup Steps:**
1. Create account at https://printful.com
2. Go to Settings > API
3. Generate API access key
4. Tag products in Shopify with "printful" for automatic fulfillment

#### Printify

```bash
# Printify API (Get from: https://printify.com/app/account/api)
PRINTIFY_API_KEY="your_printify_api_token"
PRINTIFY_SHOP_ID="your_shop_id"
```

**Setup Steps:**
1. Create account at https://printify.com
2. Go to My Account > Connections > API
3. Generate API token
4. Find your Shop ID in the API documentation
5. Tag products in Shopify with "printify" for automatic fulfillment

### 5. Email Notifications (EmailJS)

```bash
# EmailJS Configuration (Get from: https://dashboard.emailjs.com)
NEXT_PUBLIC_EMAILJS_SERVICE_ID="service_xxxxxxx"
NEXT_PUBLIC_EMAILJS_TEMPLATE_ID="template_xxxxxxx"
NEXT_PUBLIC_EMAILJS_PUBLIC_KEY="your_public_key"
```

**Setup Steps:**
1. Sign up at https://www.emailjs.com (free tier: 200 emails/month)
2. Create an Email Service (Gmail, Outlook, SendGrid, etc.)
3. Create an Email Template with these variables:
   - `{{to_email}}` - Customer email
   - `{{order_number}}` - Order number
   - `{{order_id}}` - Internal order ID
   - `{{site_name}}` - Your site name
4. Copy Service ID, Template ID, and Public Key

**Template Example:**
```html
Subject: Order Confirmation - {{order_number}}

Hello,

Thank you for your order at {{site_name}}!

Order Number: {{order_number}}
Order ID: {{order_id}}

We're processing your order and will send you shipping updates via email.

Best regards,
{{site_name}} Team
```

### 6. Supabase (Database)

```bash
# Supabase Configuration (Get from: https://app.supabase.com/project/_/settings/api)
NEXT_PUBLIC_SUPABASE_URL="https://xxxxxxxxxxxxx.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
```

## Database Schema Requirements

Ensure your Supabase database has these tables:

### `orders` table
- `id` (uuid, primary key)
- `shopify_draft_order_id` (text)
- `shopify_order_id` (text, nullable)
- `shopify_order_number` (text, nullable)
- `draft_order_name` (text)
- `customer_email` (text)
- `shipping_address` (jsonb)
- `billing_address` (jsonb)
- `total` (text)
- `subtotal` (text)
- `tax` (text)
- `shipping_cost` (text)
- `currency` (text)
- `payment_method` (text)
- `payment_provider` (text, nullable)
- `payment_reference` (text, nullable)
- `payment_status` (text) - values: 'pending', 'paid', 'failed', 'refunded'
- `status` (text) - values: 'pending_payment', 'paid', 'processing', 'fulfilled', 'cancelled'
- `fulfillment_status` (text, nullable)
- `pod_provider` (text, nullable)
- `pod_order_id` (text, nullable)
- `paid_at` (timestamp, nullable)
- `created_at` (timestamp)
- `updated_at` (timestamp)

### `order_items` table
- `id` (uuid, primary key)
- `order_id` (uuid, foreign key to orders)
- `product_id` (text)
- `variant_id` (text)
- `product_name` (text)
- `quantity` (integer)
- `price` (text)
- `product_tags` (text[])
- `product_metafields` (jsonb)
- `design_url` (text, nullable)
- `created_at` (timestamp)

### `payment_transactions` table
- `id` (uuid, primary key)
- `order_id` (uuid, foreign key to orders)
- `payment_method` (text)
- `payment_provider` (text)
- `transaction_reference` (text, unique)
- `amount` (text)
- `currency` (text)
- `status` (text) - values: 'pending', 'success', 'failed', 'cancelled'
- `metadata` (jsonb)
- `created_at` (timestamp)
- `updated_at` (timestamp)

## Payment Flow

### 1. User completes checkout
- Fills shipping/billing information
- Selects payment method (card, bank_transfer, crypto)

### 2. Draft order creation
- POST to `/api/checkout`
- Creates draft order in Shopify
- Saves order to Supabase
- Initializes payment with provider

### 3. Payment processing
- User redirected to payment gateway
- Completes payment
- Gateway redirects to `/api/payment/verify`

### 4. Payment verification
- Verifies payment with provider API
- Completes Shopify draft order
- Marks order as paid
- Triggers fulfillment

### 5. Fulfillment
- Checks product tags/metafields for POD provider
- If POD: Creates order with Printful/Printify
- If manual: Flags for manual processing
- Updates Shopify fulfillment status

### 6. Notification
- Sends order confirmation email via EmailJS
- User sees success page with order details

## Testing

### Test Mode
1. Use test API keys for all services
2. Test cards for Paystack:
   - Success: 5060666666666666666 (CVV: 123, Expiry: any future date)
   - Declined: 5123450000000008
3. Test cards for Flutterwave:
   - Success: 5531886652142950 (CVV: 564, Expiry: 09/32, OTP: 12345)

### Production Checklist
- [ ] Replace all test keys with live keys
- [ ] Complete KYC for payment providers
- [ ] Set up webhook endpoints
- [ ] Test end-to-end flow with small amount
- [ ] Configure email templates
- [ ] Set up POD accounts and verify integration
- [ ] Enable error monitoring (Sentry, LogRocket, etc.)

## Webhook Configuration

### Paystack Webhook
**URL:** `https://yoursite.com/api/webhooks/paystack`
**Events to subscribe:**
- `charge.success`
- `charge.failed`
- `transfer.success`
- `transfer.failed`

### Flutterwave Webhook
**URL:** `https://yoursite.com/api/webhooks/flutterwave`
**Events to subscribe:**
- `charge.completed`
- `transfer.completed`

## Troubleshooting

### Payment initialization fails
- Check API keys are correct and not expired
- Verify `NEXT_PUBLIC_BASE_URL` is set correctly
- Check console logs for specific error messages

### Payment verification fails
- Ensure webhooks are properly configured
- Verify signature validation in webhook handlers
- Check that callback URLs match configured domains

### Fulfillment fails
- Verify POD API keys are valid
- Check product has correct tags ("printful" or "printify")
- Ensure shipping address format is correct
- Check POD account has sufficient balance/credits

### Email not sending
- Verify EmailJS credentials are correct
- Check email template has required variables
- Ensure you haven't exceeded free tier limits (200/month)
- Check browser console for EmailJS errors

## Support

-