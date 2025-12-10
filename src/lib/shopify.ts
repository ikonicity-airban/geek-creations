// lib/shopify.ts - Shopify API utilities
const shopifyDomain = process.env.SHOPIFY_STORE_DOMAIN!;
const accessToken = process.env.SHOPIFY_ACCESS_TOKEN!;

export async function shopifyFetch<T>({
  query,
  variables = {},
}: {
  query: string;
  variables?: Record<string, any>;
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

  const json = await response.json();

  if (json.errors) {
    throw new Error(json.errors[0].message);
  }

  return json.data;
}

// Sync products from Shopify to local database
export async function syncProducts() {
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

  const data = await shopifyFetch<any>({
    query,
    variables: { first: 250 },
  });

  return data.products.edges.map((edge: any) => edge.node);
}

// Sync collections from Shopify
export async function syncCollections() {
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

  const data = await shopifyFetch<any>({
    query,
    variables: { first: 50 },
  });

  return data.collections.edges.map((edge: any) => edge.node);
}

// Create checkout session
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

  const data = await shopifyFetch<any>({
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

// Get product by handle
export async function getProductByHandle(handle: string) {
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

  const data = await shopifyFetch<any>({
    query,
    variables: { handle },
  });

  return data.product;
}

// Get collection by handle with products
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

  const data = await shopifyFetch<any>({
    query,
    variables: { handle },
  });

  return data.collection;
}