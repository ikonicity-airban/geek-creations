// lib/shopify.ts - Shopify API utilities
const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN!;
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN!;

type ShopifyGraphQLResponse<T> = {
  data: T;
  errors?: { message: string }[];
};

export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const response = await fetch(`https://${shopifyDomain}/admin/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (!response.ok) {
    throw new Error(`Shopify API error: ${response.statusText}`);
  }

  const json = (await response.json()) as ShopifyGraphQLResponse<T>;

  if (json.errors && json.errors.length > 0) {
    throw new Error(json.errors[0].message);
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
  weight?: number | null;
  weightUnit?: string | null;
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
                  weight
                  weightUnit
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
interface SyncCollectionsResponse {
  collections: {
    edges: {
      node: ShopifyCollection;
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
            productsCount
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<SyncCollectionsResponse>({
    query,
    variables: { first: 50 },
  });

  return data.collections.edges.map((edge) => edge.node);
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

export async function createCheckout(lineItems: Array<{ variantId: string; quantity: number }>) {
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
        lineItems: lineItems.map(item => ({
          variantId: item.variantId,
          quantity: item.quantity,
        })),
      },
    },
  });

  return data.checkoutCreate.checkout;
}

// Create order in Shopify
interface CreateOrderInput {
  email: string;
  lineItems: Array<{
    variantId: string;
    quantity: number;
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
  financialStatus?: "pending" | "paid" | "authorized";
}

interface CreateOrderResponse {
  orderCreate: {
    order: {
      id: string;
      name: string;
      orderNumber: number;
    } | null;
    userErrors: Array<{
      field: string[];
      message: string;
    }>;
  };
}

export async function createOrder(input: CreateOrderInput) {
  const mutation = `
    mutation orderCreate($input: OrderInput!) {
      orderCreate(input: $input) {
        order {
          id
          name
          orderNumber
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const orderInput: any = {
    email: input.email,
    lineItems: input.lineItems.map(item => ({
      variantId: item.variantId,
      quantity: item.quantity,
    })),
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
    financialStatus: input.financialStatus || "pending",
  };

  if (input.billingAddress) {
    orderInput.billingAddress = {
      firstName: input.billingAddress.firstName,
      lastName: input.billingAddress.lastName,
      address1: input.billingAddress.address1,
      address2: input.billingAddress.address2 || "",
      city: input.billingAddress.city,
      province: input.billingAddress.province,
      country: input.billingAddress.country,
      zip: input.billingAddress.zip,
      phone: input.billingAddress.phone,
    };
  }

  const data = await shopifyFetch<CreateOrderResponse>({
    query: mutation,
    variables: {
      input: orderInput,
    },
  });

  if (data.orderCreate.userErrors && data.orderCreate.userErrors.length > 0) {
    throw new Error(data.orderCreate.userErrors[0].message);
  }

  if (!data.orderCreate.order) {
    throw new Error("Failed to create order");
  }

  return data.orderCreate.order;
}

// Get product by handle
interface GetProductByHandleResponse {
  product: ShopifyProduct | null;
}

export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
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