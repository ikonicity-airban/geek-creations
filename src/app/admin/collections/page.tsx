"use client";

import CrudManager from "@/components/admin/CrudManager";
import type { CrudConfig } from "@/types/crud";

// Example Collection type - adjust based on your actual collection schema
type Collection = {
  id: string;
  title: string;
  description: string | null;
  handle: string;
  imageUrl: string | null;
  published: boolean;
  sortOrder: string;
};

const collectionsConfig: CrudConfig<Collection> = {
  entityName: "Collection",
  entityNamePlural: "Collections",
  apiEndpoint: "/api/collections",
  fields: [
    {
      name: "title",
      label: "Title",
      type: "text",
      required: true,
      placeholder: "Enter collection title",
    },
    {
      name: "handle",
      label: "Handle (URL slug)",
      type: "text",
      required: true,
      placeholder: "collection-url-slug",
    },
    {
      name: "description",
      label: "Description",
      type: "textarea",
      placeholder: "Describe your collection...",
      span: 2,
    },
    {
      name: "imageUrl",
      label: "Image URL",
      type: "url",
      placeholder: "https://...",
    },
    {
      name: "sortOrder",
      label: "Sort Order",
      type: "select",
      options: ["manual", "best-selling", "title-ascending", "title-descending", "price-ascending", "price-descending", "created-ascending", "created-descending"],
      defaultValue: "manual",
    },
    {
      name: "published",
      label: "Published",
      type: "checkbox",
      defaultValue: true,
    },
  ],
  displayFields: (collection) => ({
    primary: collection.title,
    secondary: `${collection.handle} · Sort: ${collection.sortOrder}`,
    imageUrl: collection.imageUrl || undefined,
    badge: collection.published
      ? { text: "Published", color: "#10b981" }
      : { text: "Draft", color: "#6b7280" },
  }),
  getItemId: (collection) => collection.id,
  palette: {
    primary: "#401268",
    secondary: "#c5a3ff",
    background: "#f8f6f0",
  },
  emptyState: {
    title: "No collections yet",
    description: "Create a collection to organize your products",
  },
};

export default function AdminCollectionsPage() {
  return <CrudManager config={collectionsConfig} />;
}
