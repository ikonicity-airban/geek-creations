// lib/fetchProduct.ts - Shopify Storefront API query by handle
import { Product } from '@/types';

const SHOPIFY_STOREFRONT_DOMAIN = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN || process.env.SHOPIFY_STORE_DOMAIN!;
const SHOPIFY_STOREFRONT_TOKEN = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN || process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN!;

interface ShopifyStorefrontResponse<T> {
  data: T;
  errors?: { message: string }[];
}

interface ShopifyStorefrontImage {
  id: string;
  url: string;
  altText: string | null;
  width: number;
  height: number;
}

interface ShopifyStorefrontVariant {
  id: string;
  title: string;
  price: {
    amount: string;
    currencyCode: string;
  };
  compareAtPrice: {
    amount: string;
    currencyCode: string;
  } | null;
  sku: string | null;
  availableForSale: boolean;
  selectedOptions: {
    name: string;
    value: string;
  }[];
  image: ShopifyStorefrontImage | null;
  inventoryQuantity?: number;
}

interface ShopifyStorefrontProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  images: {
    edges: {
      node: ShopifyStorefrontImage;
    }[];
  };
  variants: {
    edges: {
      node: ShopifyStorefrontVariant;
    }[];
  };
  priceRange: {
    minVariantPrice: {
      amount: string;
      currencyCode: string;
    };
    maxVariantPrice: {
      amount: string;
      currencyCode: string;
    };
  };
}

interface GetProductByHandleResponse {
  product: ShopifyStorefrontProduct | null;
}

/**
 * Fetch product by handle using Shopify Storefront API
 */
export async function fetchProduct(handle: string): Promise<Product | null> {
  if (!SHOPIFY_STOREFRONT_DOMAIN || !SHOPIFY_STOREFRONT_TOKEN) {
    console.error('Shopify Storefront API credentials not configured');
    return null;
  }

  const query = `
    query GetProduct($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        vendor
        productType
        tags
        images(first: 20) {
          edges {
            node {
              id
              url
              altText
              width
              height
            }
          }
        }
        variants(first: 100) {
          edges {
            node {
              id
              title
              price {
                amount
                currencyCode
              }
              compareAtPrice {
                amount
                currencyCode
              }
              sku
              availableForSale
              selectedOptions {
                name
                value
              }
              image {
                id
                url
                altText
                width
                height
              }
              inventoryQuantity
            }
          }
        }
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
      }
    }
  `;

  try {
    const response = await fetch(
      `https://${SHOPIFY_STOREFRONT_DOMAIN}/api/2024-10/graphql.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Storefront-Access-Token': SHOPIFY_STOREFRONT_TOKEN,
        },
        body: JSON.stringify({
          query,
          variables: { handle },
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Shopify API error: ${response.statusText}`);
    }

    const json = (await response.json()) as ShopifyStorefrontResponse<GetProductByHandleResponse>;

    if (json.errors && json.errors.length > 0) {
      console.error('Shopify GraphQL errors:', json.errors);
      throw new Error(json.errors[0].message);
    }

    if (!json.data?.product) {
      return null;
    }

    const shopifyProduct = json.data.product;

    // Transform Shopify Storefront API response to our Product type
    const product: Product = {
      id: shopifyProduct.id.split('/').pop() || '',
      shopify_product_id: parseInt(shopifyProduct.id.split('/').pop() || '0', 10),
      title: shopifyProduct.title,
      handle: shopifyProduct.handle,
      description: shopifyProduct.description,
      vendor: shopifyProduct.vendor,
      product_type: shopifyProduct.productType,
      tags: shopifyProduct.tags,
      status: 'active',
      fulfillment_provider: 'printful', // Default, can be enhanced with metafields
      images: shopifyProduct.images.edges.map((edge, index) => ({
        id: edge.node.id.split('/').pop() || `img-${index}`,
        src: edge.node.url,
        alt: edge.node.altText || undefined,
        position: index,
        width: edge.node.width,
        height: edge.node.height,
      })),
      variants: shopifyProduct.variants.edges.map((edge) => {
        const variant = edge.node;
        const sizeOption = variant.selectedOptions.find((opt) => 
          opt.name.toLowerCase() === 'size'
        );
        const colorOption = variant.selectedOptions.find((opt) => 
          opt.name.toLowerCase() === 'color'
        );
        const styleOption = variant.selectedOptions.find((opt) => 
          opt.name.toLowerCase() === 'style'
        );

        return {
          id: variant.id.split('/').pop() || '',
          product_id: shopifyProduct.id.split('/').pop() || '',
          shopify_variant_id: parseInt(variant.id.split('/').pop() || '0', 10),
          title: variant.title,
          price: parseFloat(variant.price.amount),
          compare_at_price: variant.compareAtPrice
            ? parseFloat(variant.compareAtPrice.amount)
            : undefined,
          sku: variant.sku || '',
          inventory_quantity: variant.inventoryQuantity || 0,
          option1: sizeOption?.value,
          option2: colorOption?.value,
          option3: styleOption?.value,
          image_id: variant.image?.id.split('/').pop(),
          available: variant.availableForSale && (variant.inventoryQuantity || 0) > 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      }),
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    return product;
  } catch (error) {
    console.error('Error fetching product:', error);
    return null;
  }
}

