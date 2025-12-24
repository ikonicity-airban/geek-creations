"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { X, Plus, Edit2, Trash2, Search } from "lucide-react";
import type { CrudConfig, Field } from "@/types/crud";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface CrudManagerProps<T extends Record<string, unknown>> {
  config: CrudConfig<T>;
}

export default function CrudManager<T extends Record<string, unknown>>({
  config,
}: CrudManagerProps<T>) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<T | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  // Build dynamic zod schema from fields
  const schema = useMemo(() => {
    const shape: Record<string, z.ZodTypeAny> = {};
    config.fields.forEach((field) => {
      let fieldSchema: z.ZodTypeAny;

      if (field.type === "number") {
        fieldSchema = z.coerce.number();
      } else if (field.type === "checkbox") {
        fieldSchema = z.boolean();
      } else if (field.type === "email") {
        fieldSchema = z.string().email();
      } else if (field.type === "url") {
        fieldSchema = z.string().url();
      } else if (field.type === "tags") {
        fieldSchema = z.string();
      } else {
        fieldSchema = z.string();
      }

      if (field.required) {
        if (field.type === "checkbox" || field.type === "number") {
          // Checkboxes and numbers don't need min validation
          shape[field.name] = fieldSchema;
        } else {
          // For string types, add min validation
          shape[field.name] = (fieldSchema as z.ZodString).min(
            1,
            `${field.label} is required`
          );
        }
      } else {
        shape[field.name] = fieldSchema.optional();
      }
    });
    return z.object(shape);
  }, [config.fields]);

  type FormData = z.infer<typeof schema>;

  const form = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: (() => {
      const defaults: Record<string, unknown> = {};
      config.fields.forEach((field) => {
        defaults[field.name] =
          field.defaultValue ?? (field.type === "checkbox" ? false : "");
      });
      return defaults as FormData;
    })(),
  });

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${config.apiEndpoint}?limit=100`, {
        cache: "no-store",
      });
      const json = await res.json();
      setItems(json.data || []);
    } catch (error) {
      console.error(`Failed to load ${config.entityNamePlural}`, error);
      toast.error(`Failed to load ${config.entityNamePlural}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openCreateModal = () => {
    setEditingItem(null);
    const initialData: Record<string, unknown> = {};
    config.fields.forEach((field) => {
      initialData[field.name] =
        field.defaultValue ?? (field.type === "checkbox" ? false : "");
    });
    form.reset(initialData as FormData);
    setIsModalOpen(true);
  };

  const openEditModal = (item: T) => {
    setEditingItem(item);
    const editData: Record<string, unknown> = {};
    config.fields.forEach((field) => {
      const value = item[field.name];
      if (field.type === "tags" && Array.isArray(value)) {
        editData[field.name] = value.join(", ");
      } else if (field.type === "checkbox") {
        editData[field.name] = value ?? false;
      } else {
        editData[field.name] = value || "";
      }
    });
    form.reset(editData as FormData);
    setIsModalOpen(true);
  };

  const handleSubmit = async (values: FormData) => {
    try {
      const payload: Record<string, unknown> = {};
      config.fields.forEach((field) => {
        const value = values[field.name];
        if (field.type === "tags" && typeof value === "string") {
          payload[field.name] = value
            ? value
                .split(",")
                .map((t: string) => t.trim())
                .filter(Boolean)
            : [];
        } else if (field.type === "number") {
          payload[field.name] = value !== undefined ? Number(value) : undefined;
        } else if (field.type === "checkbox") {
          payload[field.name] = Boolean(value);
        } else {
          payload[field.name] = value || undefined;
        }
      });

      const url = editingItem
        ? `${config.apiEndpoint}/${config.getItemId(editingItem)}`
        : config.apiEndpoint;

      const res = await fetch(url, {
        method: editingItem ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const error = await res
          .json()
          .catch(() => ({ error: "Operation failed" }));
        throw new Error(error.error || "Operation failed");
      }

      toast.success(
        `${config.entityName} ${
          editingItem ? "updated" : "created"
        } successfully`
      );
      setIsModalOpen(false);
      await fetchItems();
    } catch (error) {
      console.error("Operation failed", error);
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      toast.error(
        `Failed to ${
          editingItem ? "update" : "create"
        } ${config.entityName.toLowerCase()}: ${errorMessage}`
      );
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`${config.apiEndpoint}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Delete failed");

      toast.success(`${config.entityName} deleted successfully`);
      setDeleteConfirm(null);
      await fetchItems();
    } catch (error) {
      console.error("Delete failed", error);
      toast.error(`Failed to delete ${config.entityName.toLowerCase()}`);
    }
  };

  const filteredItems = items.filter((item) => {
    if (!searchQuery) return true;
    const searchLower = searchQuery.toLowerCase();

    // Use custom search fields if provided, otherwise use display fields
    if (config.searchFields) {
      const searchableText = config.searchFields(item).join(" ").toLowerCase();
      return searchableText.includes(searchLower);
    }

    const display = config.displayFields(item);
    return (
      display.primary.toLowerCase().includes(searchLower) ||
      display.secondary.toLowerCase().includes(searchLower)
    );
  });

  const renderField = (field: Field) => {
    const isTextarea = field.type === "textarea";
    const isSelect = field.type === "select";
    const isCheckbox = field.type === "checkbox";
    const colSpan = field.span === 2 ? "md:col-span-2" : "";

    return (
      <FormField
        key={field.name}
        control={form.control}
        name={field.name}
        render={({ field: formField }) => (
          <FormItem className={colSpan}>
            {isCheckbox ? (
              <div className="flex items-center gap-2">
                <FormControl>
                  <input
                    type="checkbox"
                    checked={Boolean(formField.value)}
                    onChange={(e) => formField.onChange(e.target.checked)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: config.palette.primary }}
                  />
                </FormControl>
                <FormLabel
                  className="cursor-pointer"
                  style={{ color: config.palette.primary }}
                >
                  {field.label}
                  {field.required && (
                    <span style={{ color: "#dc2626" }}> *</span>
                  )}
                </FormLabel>
              </div>
            ) : (
              <>
                <FormLabel style={{ color: config.palette.primary }}>
                  {field.label}
                  {field.required && (
                    <span style={{ color: "#dc2626" }}> *</span>
                  )}
                </FormLabel>
                {isSelect ? (
                  <FormControl>
                    <select
                      className="w-full px-4 py-3 rounded-lg border dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      style={{ borderColor: "#e0e0e0" }}
                      value={String(formField.value ?? "")}
                      onChange={(e) => formField.onChange(e.target.value)}
                      onBlur={formField.onBlur}
                      name={formField.name}
                    >
                      <option value="">Select {field.label}</option>
                      {field.options?.map((opt) => (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ))}
                    </select>
                  </FormControl>
                ) : isTextarea ? (
                  <FormControl>
                    <textarea
                      placeholder={field.placeholder}
                      rows={4}
                      className="w-full px-4 py-3 rounded-lg border resize-none dark:border-gray-700 dark:bg-gray-800 dark:text-white"
                      style={{ borderColor: "#e0e0e0" }}
                      value={String(formField.value ?? "")}
                      onChange={(e) => formField.onChange(e.target.value)}
                      onBlur={formField.onBlur}
                      name={formField.name}
                    />
                  </FormControl>
                ) : (
                  <FormControl>
                    <Input
                      type={
                        field.type === "tags"
                          ? "text"
                          : field.type === "number"
                          ? "number"
                          : field.type
                      }
                      placeholder={field.placeholder}
                      value={String(formField.value ?? "")}
                      onChange={(e) => formField.onChange(e.target.value)}
                      onBlur={formField.onBlur}
                      name={formField.name}
                    />
                  </FormControl>
                )}
                <FormMessage />
              </>
            )}
          </FormItem>
        )}
      />
    );
  };

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto w-full p-4 md:p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h4 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
              {config.entityNamePlural} Manager
            </h4>
            <p className="text-gray-600 dark:text-gray-400">
              Manage your {config.entityNamePlural.toLowerCase()}
            </p>
          </div>
          <button
            onClick={openCreateModal}
            className="px-6 py-3 rounded-lg font-bold flex items-center gap-2 transition hover:opacity-90 bg-indigo-600 text-white"
          >
            <Plus size={20} />
            Add {config.entityName}
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder={`Search ${config.entityNamePlural.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>

        {/* Items List */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 font-semibold bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 border-b border-gray-200 dark:border-gray-700">
            {config.entityNamePlural} ({filteredItems.length})
          </div>
          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {loading ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400">
                Loading...
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="p-8 text-center">
                {config.emptyState ? (
                  <>
                    {config.emptyState.icon}
                    <h5 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
                      {config.emptyState.title}
                    </h5>
                    <p className="text-gray-500 dark:text-gray-400 mt-2">
                      {config.emptyState.description}
                    </p>
                  </>
                ) : (
                  <p className="text-gray-500 dark:text-gray-400">
                    {searchQuery
                      ? "No results found"
                      : `No ${config.entityNamePlural.toLowerCase()} yet.`}
                  </p>
                )}
              </div>
            ) : (
              filteredItems.map((item) => {
                const display = config.displayFields(item);
                const itemId = config.getItemId(item);
                return (
                  <div
                    key={itemId}
                    className="p-4 flex items-center gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors cursor-pointer"
                    onClick={() => config.onItemClick?.(item)}
                  >
                    {display.imageUrl && (
                      <div className="w-16 h-16 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700 shrink-0">
                        <Image
                          fill
                          src={display.imageUrl}
                          alt={display.primary}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-gray-900 dark:text-white truncate flex items-center gap-2">
                        {display.primary}
                        {display.badge && (
                          <span
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              backgroundColor:
                                display.badge.color || config.palette.secondary,
                              color: "#ffffff",
                            }}
                          >
                            {display.badge.text}
                          </span>
                        )}
                      </div>
                      <div className="text-sm text-gray-600 dark:text-gray-400 truncate">
                        {display.secondary}
                      </div>
                    </div>
                    <div
                      className="flex items-center gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {config.customActions?.(item)}
                      <button
                        onClick={() => openEditModal(item)}
                        className="p-2 rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900/30 transition text-indigo-600 dark:text-indigo-400"
                        title="Edit"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(itemId)}
                        className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition text-red-600 dark:text-red-400"
                        title="Delete"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {editingItem ? "Edit" : "Create"} {config.entityName}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded text-gray-500 dark:text-gray-400"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleSubmit)}
                  className="space-y-4"
                >
                  <div className="grid md:grid-cols-2 gap-4">
                    {config.fields.map(renderField)}
                  </div>

                  <div className="flex gap-3 mt-6">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsModalOpen(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={form.formState.isSubmitting}
                      className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                    >
                      {form.formState.isSubmitting
                        ? "Saving..."
                        : editingItem
                        ? "Update"
                        : "Create"}
                    </Button>
                  </div>
                </form>
              </Form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation */}
      {deleteConfirm && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setDeleteConfirm(null)}
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-2xl max-w-md w-full p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              Confirm Delete
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Are you sure you want to delete this{" "}
              {config.entityName.toLowerCase()}? This action cannot be undone.
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 px-6 py-3 rounded-lg font-bold border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 transition hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 px-6 py-3 rounded-lg font-bold bg-red-600 text-white transition hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
