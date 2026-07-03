// lib/shopify.ts - Shopify API utilities
import { CONFIG } from "./config";

const shopifyDomain = CONFIG.SHOPIFY.storeDomain;
const accessToken = CONFIG.SHOPIFY.accessToken;

if (!shopifyDomain || !accessToken) {
  console.error(
    "Missing Shopify environment variables. Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN"
  );
}

type ShopifyGraphQLResponse<T> = {
  data: T;
  errors?: { message: string; extensions?: { code: string } }[];
};

export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  if (!shopifyDomain || !accessToken) {
    throw new Error(
      "Shopify API credentials are not configured. Please set SHOPIFY_STORE_DOMAIN and SHOPIFY_ACCESS_TOKEN environment variables."
    );
  }

  const url = `https://${shopifyDomain}/admin/api/2024-10/graphql.json`;

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Access-Token": accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  // Try to parse response body even if status is not OK
  let json: ShopifyGraphQLResponse<T> | null = null;
  try {
    json = (await response.json()) as ShopifyGraphQLResponse<T>;
  } catch {
    // If JSON parsing fails, throw with status text
    if (!response.ok) {
      throw new Error(
        `Shopify API error: ${response.status} ${response.statusText}`
      );
    }
    throw new Error("Failed to parse Shopify API response");
  }

  // Check for GraphQL errors first (these can occur even with 200 status)
  if (json.errors && json.errors.length > 0) {
    const error = json.errors[0];
    const errorCode = error.extensions?.code || "UNKNOWN";
    throw new Error(`Shopify GraphQL error [${errorCode}]: ${error.message}`);
  }

  // Check HTTP status after parsing JSON
  if (!response.ok) {
    const errorMessage = json?.errors?.[0]?.message || response.statusText;
    throw new Error(`Shopify API error [${response.status}]: ${errorMessage}`);
  }

  return json.data;
}

export interface ShopifySelectedOption {
  name: string;
  value: string;
}

export interface ShopifyImage {
  id: string;
  src: string;
  altText: string | null;
}

export interface ShopifyImageEdge {
  node: ShopifyImage;
}

export interface ShopifyVariant {
  id: string;
  title: string;
  price: string;
  compareAtPrice?: string | null;
  sku: string | null;
  inventoryQuantity: number | null;
  selectedOptions: ShopifySelectedOption[];
}

export interface ShopifyVariantEdge {
  node: ShopifyVariant;
}

export interface ShopifyMetafield {
  namespace: string;
  key: string;
  value: string;
}

export interface ShopifyMetafieldEdge {
  node: ShopifyMetafield;
}

export interface ShopifyProduct {
  id: string;
  title: string;
  handle: string;
  description: string;
  vendor: string;
  productType: string;
  tags: string[];
  status: string;
  images: {
    edges: ShopifyImageEdge[];
  };
  variants: {
    edges: ShopifyVariantEdge[];
  };
  metafields: {
    edges: ShopifyMetafieldEdge[];
  };
}

export interface ShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: {
    src: string;
    altText: string | null;
  } | null;
  productsCount: number;
}

// Sync products from Shopify to local database
interface SyncProductsResponse {
  products: {
    edges: {
      node: ShopifyProduct;
    }[];
  };
}

export async function syncProducts(): Promise<ShopifyProduct[]> {
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
            status
            images(first: 10) {
              edges {
                node {
                  id
                  src
                  altText
                }
              }
            }
            variants(first: 50) {
              edges {
                node {
                  id
                  title
                  price
                  compareAtPrice
                  sku
                  inventoryQuantity
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
            metafields(first: 10) {
              edges {
                node {
                  namespace
                  key
                  value
                }
              }
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const data = await shopifyFetch<SyncProductsResponse>({
    query,
    variables: { first: 250 },
  });

  return data.products.edges.map((edge) => edge.node);
}

// Sync collections from Shopify
interface RawShopifyCollection {
  id: string;
  title: string;
  handle: string;
  description: string;
  image: {
    src: string;
    altText: string | null;
  } | null;
  productsCount: {
    count: number;
  };
}

interface SyncCollectionsResponse {
  collections: {
    edges: {
      node: RawShopifyCollection;
    }[];
  };
}

export async function syncCollections(): Promise<ShopifyCollection[]> {
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
              src
              altText
            }
            productsCount {
              count
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<SyncCollectionsResponse>({
    query,
    variables: { first: 50 },
  });

  return data.collections.edges.map((edge) => ({
    ...edge.node,
    productsCount: edge.node.productsCount?.count ?? 0,
  }));
}

// Create checkout session
interface CreateCheckoutResponse {
  checkoutCreate: {
    checkout: {
      id: string;
      webUrl: string;
    };
    checkoutUserErrors: {
      code: string;
      field: string[] | null;
      message: string;
    }[];
  };
}

export async function createCheckout(
  lineItems: Array<{ variantId: string; quantity: number }>
) {
  const query = `
    mutation checkoutCreate($input: CheckoutCreateInput!) {
      checkoutCreate(input: $input) {
        checkout {
          id
          webUrl
        }
        checkoutUserErrors {
          code
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<CreateCheckoutResponse>({
    query,
    variables: {
      input: {
        lineItems: lineItems.map((item) => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      },
    },
  });

  return data.checkoutCreate.checkout;
}

// Create draft order in Shopify
interface MoneyInput {
  amount: string;
  currencyCode: string;
}

interface CreateOrderInput {
  email: string;
  lineItems: Array<{
    title?: string;
    quantity: number;
    variantId?: string;
    originalUnitPrice?: MoneyInput;
    customAttributes?: Array<{ key: string; value: string }>;
  }>;
  shippingAddress: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone: string;
  };
  billingAddress?: {
    firstName: string;
    lastName: string;
    address1: string;
    address2?: string;
    city: string;
    province: string;
    country: string;
    zip: string;
    phone: string;
  };
  financialStatus?: "PENDING" | "PAID" | "AUTHORIZED";
  note?: string;
  tags?: string[];
}

interface DraftOrderCreateResponse {
  draftOrderCreate: {
    draftOrder: {
      id: string;
      name: string;
      invoiceUrl: string | null;
    } | null;
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
}

interface DraftOrderCompleteResponse {
  draftOrderComplete: {
    draftOrder: {
      id: string;
      name: string;
      order?: {
        id: string;
        name: string;
      } | null;
    } | null;
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
}

export async function createDraftOrder(input: CreateOrderInput) {
  const mutation = `
    mutation draftOrderCreate($input: DraftOrderInput!) {
      draftOrderCreate(input: $input) {
        draftOrder {
          id
          name
          invoiceUrl
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  // Transform lineItems to ensure proper format for Shopify GraphQL
  // For custom line items without variantId, we need to use originalUnitPriceWithCurrency
  const formattedLineItems = input.lineItems.map((item) => {
    // If we have a variantId, use it directly
    if (item.variantId) {
      return {
        variantId: item.variantId,
        quantity: item.quantity,
        customAttributes: item.customAttributes || [],
      };
    }

    // For custom line items (no variant), use originalUnitPriceWithCurrency (Shopify 2024-10+)
    return {
      title: item.title || "Custom Item",
      quantity: item.quantity,
      requiresShipping: true,
      taxable: true,
      originalUnitPriceWithCurrency: item.originalUnitPrice
        ? {
            amount: item.originalUnitPrice.amount,
            currencyCode: item.originalUnitPrice.currencyCode,
          }
        : undefined,
      customAttributes: item.customAttributes || [],
    };
  });

  const draftInput = {
    email: input.email,
    lineItems: formattedLineItems,
    shippingAddress: {
      firstName: input.shippingAddress.firstName,
      lastName: input.shippingAddress.lastName,
      address1: input.shippingAddress.address1,
      address2: input.shippingAddress.address2 || "",
      city: input.shippingAddress.city,
      province: input.shippingAddress.province,
      country: input.shippingAddress.country,
      zip: input.shippingAddress.zip,
      phone: input.shippingAddress.phone,
    },
    billingAddress: input.billingAddress
      ? {
          firstName: input.billingAddress.firstName,
          lastName: input.billingAddress.lastName,
          address1: input.billingAddress.address1,
          address2: input.billingAddress.address2 || "",
          city: input.billingAddress.city,
          province: input.billingAddress.province,
          country: input.billingAddress.country,
          zip: input.billingAddress.zip,
          phone: input.billingAddress.phone,
        }
      : undefined,
    note: input.note || "MANUAL FULFILLMENT REQUIRED",
    tags: input.tags || ["manual-review"],
  };

  const data = await shopifyFetch<DraftOrderCreateResponse>({
    query: mutation,
    variables: { input: draftInput },
  });

  if (data.draftOrderCreate.userErrors?.length > 0) {
    throw new Error(data.draftOrderCreate.userErrors[0].message);
  }

  return data.draftOrderCreate.draftOrder;
}

export async function completeDraftOrder(draftOrderId: string) {
  const mutation = `
    mutation draftOrderComplete($id: ID!) {
      draftOrderComplete(id: $id) {
        draftOrder {
          id
          name
          order {
            id
            name
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<DraftOrderCompleteResponse>({
    query: mutation,
    variables: { id: draftOrderId },
  });

  if (data.draftOrderComplete.userErrors?.length > 0) {
    throw new Error(data.draftOrderComplete.userErrors[0].message);
  }

  return data.draftOrderComplete.draftOrder?.order;
}

/**
 * Complete a draft order and mark it as paid after payment verification
 */
export async function completePaidOrder(
  draftOrderId: string,
  paymentReference: string
): Promise<{ orderId: string; orderName: string }> {
  console.log("🚀 ~ completePaidOrder ~ paymentReference:", paymentReference);
  // First, complete the draft order to convert it to an actual order
  const order = await completeDraftOrder(draftOrderId);

  if (!order) {
    throw new Error("Failed to complete draft order");
  }

  // Mark order as paid using orderMarkAsPaid mutation
  const markAsPaidMutation = `
    mutation orderMarkAsPaid($input: OrderMarkAsPaidInput!) {
      orderMarkAsPaid(input: $input) {
        order {
          id
          name
          displayFinancialStatus
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const markAsPaidData = await shopifyFetch<{
    orderMarkAsPaid: {
      order: {
        id: string;
        name: string;
        displayFinancialStatus: string;
      } | null;
      userErrors: Array<{ field: string[]; message: string }>;
    };
  }>({
    query: markAsPaidMutation,
    variables: {
      input: {
        id: order.id,
      },
    },
  });

  if (markAsPaidData.orderMarkAsPaid.userErrors?.length > 0) {
    console.error(
      "Failed to mark order as paid:",
      markAsPaidData.orderMarkAsPaid.userErrors
    );
  }

  return {
    orderId: order.id,
    orderName: order.name,
  };
}

// Get product by handle
interface GetProductByHandleResponse {
  product: ShopifyProduct | null;
}

export async function getProductByHandle(
  handle: string
): Promise<ShopifyProduct | null> {
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
        images(first: 10) {
          edges {
            node {
              id
              src
              altText
            }
          }
        }
        variants(first: 50) {
          edges {
            node {
              id
              title
              price
              compareAtPrice
              sku
              inventoryQuantity
              selectedOptions {
                name
                value
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<GetProductByHandleResponse>({
    query,
    variables: { handle },
  });

  return data.product;
}

// Get collection by handle with products
interface CollectionProductEdge {
  node: {
    id: string;
    title: string;
    handle: string;
    description: string;
    images: {
      edges: {
        node: {
          src: string;
          altText: string | null;
        };
      }[];
    };
    variants: {
      edges: {
        node: {
          id: string;
          price: string;
          compareAtPrice?: string | null;
        };
      }[];
    };
  };
}

interface GetCollectionByHandleResponse {
  collection: {
    id: string;
    title: string;
    handle: string;
    description: string;
    image: {
      src: string;
      altText: string | null;
    } | null;
    products: {
      edges: CollectionProductEdge[];
    };
  } | null;
}

/**
 * getCollectionByHandle handleknaskljaklsdaksdkljda
 * @param handle
 * @returns nothing
 *
 * @example ajskdlajkljsdjakljkdaklsdjk
 */
export async function getCollectionByHandle(handle: string) {
  const query = `
    query GetCollection($handle: String!) {
      collection(handle: $handle) {
        id
        title
        handle
        description
        image {
          src
          altText
        }
        products(first: 50) {
          edges {
            node {
              id
              title
              handle
              description
              images(first: 1) {
                edges {
                  node {
                    src
                    altText
                  }
                }
              }
              variants(first: 1) {
                edges {
                  node {
                    id
                    price
                    compareAtPrice
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<GetCollectionByHandleResponse>({
    query,
    variables: { handle },
  });

  return data.collection;
}
