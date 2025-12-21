# GEEK CREATIONS POD STORE — 50+ ORDER TEST PLAN

**Week 3 Final Testing | 10–13 Dec 2025**

## TEST COVERAGE REQUIREMENTS (Minimum 50 Orders)

### Payment Gateway Coverage (20 Orders)

- [ ] **Paystack Card Payment** (5 test orders)

  - [ ] Naira card (successful)
  - [ ] Naira card (declined)
  - [ ] International card (if supported)
  - [ ] Guest checkout
  - [ ] Logged-in checkout

- [ ] **Paystack Bank Transfer** (5 test orders)

  - [ ] Generate account number
  - [ ] Complete payment
  - [ ] Webhook verification
  - [ ] Order fulfillment triggered

- [ ] **Flutterwave** (5 test orders)

  - [ ] Card payment
  - [ ] USSD payment
  - [ ] Bank transfer
  - [ ] Mobile money

- [ ] **Monnify** (3 test orders)

  - [ ] Card payment
  - [ ] Bank transfer
  - [ ] Virtual account

- [ ] **Ikonshop Crypto** (2 test orders)
  - [ ] USDC on Solana
  - [ ] SOL payment

### Product Type Coverage (15 Orders)

- [ ] **Printful Products** (5 orders)

  - [ ] Basic T-shirt (S, M, L, XL, XXL)
  - [ ] Premium T-shirt
  - [ ] Tank top
  - [ ] Long sleeve
  - [ ] V-neck

- [ ] **Printify Products** (5 orders)

  - [ ] Mug
  - [ ] Poster (A3)
  - [ ] Canvas print
  - [ ] Sticker pack
  - [ ] Tote bag

- [ ] **Ikonshop Products** (5 orders)
  - [ ] Hoodie (M, L, XL)
  - [ ] Sweatshirt
  - [ ] Zip-up hoodie

### User Journey Coverage (10 Orders)

- [ ] Guest checkout (no login)
- [ ] Logged-in user checkout
- [ ] First-time customer
- [ ] Returning customer
- [ ] Multiple items in cart
- [ ] Single item checkout
- [ ] Apply discount code
- [ ] Free shipping threshold test
- [ ] International shipping
- [ ] Local (Nigeria) shipping

### Edge Cases & Error Handling (5 Orders)

- [ ] Invalid card details
- [ ] Expired payment session
- [ ] Out of stock product
- [ ] Webhook retry mechanism
- [ ] Duplicate order prevention

---

## RECORDING REQUIREMENTS

### For Each Test Order:

1. **Screen recording** (full flow from product page → payment → confirmation)
2. **Webhook log** (Supabase orders_log entry)
3. **POD API response** (Printful/Printify/Ikonshop confirmation)
4. **Email confirmation** (customer receipt)
5. **Admin dashboard** (order appears correctly)

### Video Proof Checklist:

- [ ] Record full screen (browser + terminal)
- [ ] Show timestamp in video
- [ ] Demonstrate real payment flow (not sandbox test cards)
- [ ] Show webhook firing in Vercel logs
- [ ] Show POD order creation
- [ ] Show admin dashboard update

---

## PERFORMANCE & LIGHTHOUSE TESTS

### Desktop Testing:

- [ ] Homepage Lighthouse score: 95+
- [ ] Product page Lighthouse score: 95+
- [ ] Checkout page Lighthouse score: 90+

### Mobile Testing:

- [ ] Homepage mobile score: 90+
- [ ] Product page mobile score: 90+
- [ ] Checkout mobile score: 85+
- [ ] PWA installable prompt works

### Load Testing:

- [ ] 10 concurrent users
- [ ] 50 concurrent users
- [ ] 100 concurrent users
- [ ] Stress test: 500 requests/min

---

## SEO & META TAGS

- [ ] Homepage meta title & description
- [ ] Product pages meta title & description
- [ ] Collection pages meta title & description
- [ ] Open Graph tags (Facebook/Instagram)
- [ ] Twitter Card tags
- [ ] Canonical URLs
- [ ] Structured data (JSON-LD)
- [ ] Sitemap.xml generated
- [ ] Robots.txt configured

---

## FINAL PRE-LAUNCH CHECKLIST

### Environment Variables:

- [ ] All production API keys added to Vercel
- [ ] Supabase RLS policies tested
- [ ] Webhook secrets verified
- [ ] Payment gateway live keys (not test keys)
- [ ] POD API keys active

### Domain & DNS:

- [ ] Namecheap domain purchased
- [ ] DNS pointed to Vercel
- [ ] SSL certificate issued
- [ ] WWW redirect configured
- [ ] Custom domain verified in Vercel

### Legal & Compliance:

- [ ] Privacy Policy page live
- [ ] Terms of Service page live
- [ ] Refund Policy page live
- [ ] Shipping Policy page live
- [ ] Contact Us page live

### Marketing & Analytics:

- [ ] Google Analytics 4 installed
- [ ] Facebook Pixel installed
- [ ] Instagram Shop integration
- [ ] Email marketing (Mailchimp/Brevo) connected

---

## HANDOVER DOCUMENTATION

### Files to Deliver:

- [ ] GitHub repo (transferred to client)
- [ ] Vercel project (transferred to client)
- [ ] Supabase project (transferred to client)
- [ ] Shopify store (admin access shared)
- [ ] All API credentials (1Password vault)
- [ ] Video training recording (1 hour)
- [ ] PDF documentation (this + tech brief)
- [ ] Signed acceptance certificate

---

## STATUS TRACKING

| Date   | Orders Completed | Payment Methods Tested | POD Providers Tested | Issues Found |
| ------ | ---------------- | ---------------------- | -------------------- | ------------ |
| 10 Dec | 0/50             | 0/4                    | 0/3                  | 0            |
| 11 Dec | 15/50            | 2/4                    | 1/3                  | 2            |
| 12 Dec | 35/50            | 4/4                    | 3/3                  | 1            |
| 13 Dec | 50/50            | 4/4                    | 3/3                  | 0            |

**Target Launch Date:** 14 December 2025 00:00 WAT

---

**Testing Lead:** CodeOven Technologies  
**Client Sign-off Required:** Yes (video call 13 Dec 2025)  
**Go/No-Go Decision:** 13 Dec 2025 18:00 WAT
