// lib/shopify-storefront.ts - Shopify Storefront API client
import { CONFIG } from "./config";
import type { Product, Collection, Variant } from "@/types";

const storefrontDomain = CONFIG.SHOPIFY.storeDomain;
const storefrontToken = CONFIG.SHOPIFY.storefrontToken;

if (!storefrontDomain || !storefrontToken) {
  console.warn(
    "Missing Shopify Storefront credentials. Please check your environment variables."
  );
}

interface ShopifyStorefrontResponse<T> {
  data: T;
  errors?: { message: string }[];
}

export async function storefrontFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  if (!storefrontDomain || !storefrontToken) {
    throw new Error("Shopify Storefront credentials are not configured.");
  }

  const url = `https://${storefrontDomain}/api/2024-10/graphql.json`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": storefrontToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify Storefront API error: ${response.status} ${response.statusText}`);
  }

  const json = (await response.json()) as ShopifyStorefrontResponse<T>;

  if (json.errors && json.errors.length > 0) {
    throw new Error(`Shopify Storefront GraphQL error: ${json.errors[0].message}`);
  }

  return json.data;
}

// Transform Shopify API product format to our internal type
function transformProduct(shopifyProduct: any): Product {
  const productId = shopifyProduct.id.split("/").pop() || "";
  
  return {
    id: productId,
    shopify_product_id: parseInt(productId, 10) || 0,
    title: shopifyProduct.title,
    handle: shopifyProduct.handle,
    description: shopifyProduct.description || "",
    vendor: shopifyProduct.vendor || "",
    product_type: shopifyProduct.productType || "",
    tags: shopifyProduct.tags || [],
    status: "active",
    fulfillment_provider: "printful", // Default, matches mock data
    images: (shopifyProduct.images?.edges || []).map((edge: any, index: number) => ({
      id: edge.node.id?.split("/").pop() || `img-${index}`,
      src: edge.node.url || edge.node.src,
      alt: edge.node.altText || undefined,
      position: index,
      width: edge.node.width || 800,
      height: edge.node.height || 800,
    })),
    featuredImage: shopifyProduct.images?.edges?.[0]?.node?.url || shopifyProduct.images?.edges?.[0]?.node?.src || undefined,
    variants: (shopifyProduct.variants?.edges || []).map((edge: any) => {
      const variant = edge.node;
      const variantId = variant.id.split("/").pop() || "";
      const sizeOption = variant.selectedOptions?.find(
        (opt: any) => opt.name.toLowerCase() === "size"
      );
      const colorOption = variant.selectedOptions?.find(
        (opt: any) => opt.name.toLowerCase() === "color"
      );
      const styleOption = variant.selectedOptions?.find(
        (opt: any) => opt.name.toLowerCase() === "style"
      );

      return {
        id: variantId,
        product_id: productId,
        shopify_variant_id: parseInt(variantId, 10) || 0,
        title: variant.title,
        price: parseFloat(variant.price?.amount || variant.price || "0"),
        compare_at_price: variant.compareAtPrice?.amount
          ? parseFloat(variant.compareAtPrice.amount)
          : variant.compareAtPrice
          ? parseFloat(variant.compareAtPrice)
          : undefined,
        sku: variant.sku || "",
        inventory_quantity: variant.inventoryQuantity ?? (variant.availableForSale ? 99 : 0),
        option1: sizeOption?.value,
        option2: colorOption?.value,
        option3: styleOption?.value,
        image_id: variant.image?.id?.split("/").pop(),
        available: variant.availableForSale ?? true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    }),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };
}

export async function getProducts(limit: number = 20): Promise<Product[]> {
  const query = `
    query GetProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            vendor
            productType
            tags
            images(first: 10) {
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
            variants(first: 50) {
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
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await storefrontFetch<{ products: { edges: any[] } }>({
      query,
      variables: { first: limit },
    });

    return (data.products?.edges || []).map((edge) => transformProduct(edge.node));
  } catch (error) {
    console.error("Error in getProducts:", error);
    return [];
  }
}

export async function getProductByHandle(handle: string): Promise<Product | null> {
  const query = `
    query GetProductByHandle($handle: String!) {
      product(handle: $handle) {
        id
        title
        handle
        description
        vendor
        productType
        tags
        images(first: 10) {
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
        variants(first: 50) {
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
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await storefrontFetch<{ product: any }>({
      query,
      variables: { handle },
    });

    if (!data.product) return null;
    return transformProduct(data.product);
  } catch (error) {
    console.error(`Error in getProductByHandle for handle ${handle}:`, error);
    return null;
  }
}

export async function getCollections(limit: number = 20): Promise<Collection[]> {
  const query = `
    query GetCollections($first: Int!) {
      collections(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            image {
              url
              altText
            }
          }
        }
      }
    }
  `;

  try {
    const data = await storefrontFetch<{ collections: { edges: any[] } }>({
      query,
      variables: { first: limit },
    });

    return (data.collections?.edges || []).map((edge) => {
      const col = edge.node;
      const collectionId = col.id.split("/").pop() || "";
      return {
        id: collectionId,
        shopify_collection_id: parseInt(collectionId, 10) || undefined,
        title: col.title,
        handle: col.handle,
        description: col.description || "",
        image_url: col.image?.url || undefined,
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
    });
  } catch (error) {
    console.error("Error in getCollections:", error);
    return [];
  }
}

export async function getCollectionWithProducts(
  handle: string,
  limit: number = 50
): Promise<Product[]> {
  const query = `
    query GetCollectionWithProducts($handle: String!, $first: Int!) {
      collection(handle: $handle) {
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              description
              vendor
              productType
              tags
              images(first: 10) {
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
              variants(first: 50) {
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
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await storefrontFetch<{ collection: { products: { edges: any[] } } | null }>({
      query,
      variables: { handle, first: limit },
    });

    if (!data.collection) return [];
    return (data.collection.products?.edges || []).map((edge) => transformProduct(edge.node));
  } catch (error) {
    console.error(`Error in getCollectionWithProducts for handle ${handle}:`, error);
    return [];
  }
}
