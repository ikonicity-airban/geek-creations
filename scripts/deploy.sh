#!/bin/bash

# Geek Creations POD Store — Production Deployment Script
# Version: 1.0 | Date: 14 December 2025
# Run this script to deploy to Vercel production

set -e

echo "🚀 GEEK CREATIONS — PRODUCTION DEPLOYMENT"
echo "=========================================="

# 1. Pre-flight checks
echo "✅ Step 1: Pre-flight checks..."

# Check if we're on master branch
CURRENT_BRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENT_BRANCH" != "master" ]; then
  echo "❌ Error: Not on master branch. Current branch: $CURRENT_BRANCH"
  echo "Please switch to master branch: git checkout master"
  exit 1
fi

# Check for uncommitted changes
if ! git diff-index --quiet HEAD --; then
  echo "❌ Error: Uncommitted changes detected"
  echo "Please commit or stash changes before deploying"
  exit 1
fi

# 2. Run tests
echo "✅ Step 2: Running tests..."
npm run lint
echo "✓ Linting passed"

# 3. Build check
echo "✅ Step 3: Building project..."
npm run build
echo "✓ Build successful"

# 4. Environment variables check
echo "✅ Step 4: Checking environment variables..."

REQUIRED_VARS=(
  "NEXT_PUBLIC_SUPABASE_URL"
  "NEXT_PUBLIC_SUPABASE_ANON_KEY"
  "SUPABASE_SERVICE_ROLE_KEY"
  "SHOPIFY_STORE_DOMAIN"
  "SHOPIFY_ACCESS_TOKEN"
  "SHOPIFY_WEBHOOK_SECRET"
  "PRINTFUL_API_KEY"
  "PRINTIFY_API_KEY"
  "IKONSHOP_API_KEY"
  "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY"
  "PAYSTACK_SECRET_KEY"
  "NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY"
  "FLUTTERWAVE_SECRET_KEY"
  "NEXT_PUBLIC_MONNIFY_API_KEY"
  "MONNIFY_SECRET_KEY"
)

MISSING_VARS=()

for VAR in "${REQUIRED_VARS[@]}"; do
  if ! vercel env ls | grep -q "$VAR"; then
    MISSING_VARS+=("$VAR")
  fi
done

if [ ${#MISSING_VARS[@]} -ne 0 ]; then
  echo "❌ Error: Missing environment variables in Vercel:"
  printf '%s\n' "${MISSING_VARS[@]}"
  echo "Please add them using: vercel env add"
  exit 1
fi

echo "✓ All environment variables present"

# 5. Deploy to Vercel
echo "✅ Step 5: Deploying to Vercel production..."
vercel --prod --yes

# 6. Post-deployment checks
echo "✅ Step 6: Running post-deployment checks..."

# Wait for deployment to be ready
sleep 10

# Check if site is accessible
PROD_URL="https://geekcreations.com"
HTTP_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$PROD_URL")

if [ "$HTTP_STATUS" -eq 200 ]; then
  echo "✓ Production site is live and accessible"
else
  echo "⚠️  Warning: Production site returned HTTP $HTTP_STATUS"
fi

# 7. Verify webhook endpoint
WEBHOOK_URL="$PROD_URL/api/webhook/order"
WEBHOOK_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$WEBHOOK_URL" -X POST -H "Content-Type: application/json" -d '{}')

if [ "$WEBHOOK_STATUS" -eq 401 ]; then
  echo "✓ Webhook endpoint is protected (401 expected for test)"
else
  echo "⚠️  Warning: Webhook endpoint returned HTTP $WEBHOOK_STATUS (expected 401)"
fi

# 8. Final summary
echo ""
echo "=========================================="
echo "🎉 DEPLOYMENT COMPLETE!"
echo "=========================================="
echo ""
echo "Production URL: $PROD_URL"
echo "Admin Panel:    $PROD_URL/admin/orders"
echo "Webhook URL:    $WEBHOOK_URL"
echo ""
echo "Next steps:"
echo "1. Update Shopify webhook URL to: $WEBHOOK_URL"
echo "2. Run 50+ test orders (see TEST_PLAN.md)"
echo "3. Verify all payment gateways"
echo "4. Check admin dashboard"
echo "5. Monitor Vercel logs"
echo ""
echo "🔥 Launch ready for 14 December 2025!"
echo ""