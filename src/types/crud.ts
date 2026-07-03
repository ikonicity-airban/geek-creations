// types/crud.ts - Types for reusable CRUD manager component

export type FieldType =
  | "text"
  | "textarea"
  | "url"
  | "email"
  | "tags"
  | "select"
  | "number"
  | "checkbox";

export interface Field {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  options?: string[]; // for select type
  span?: 1 | 2; // column span in form grid
  defaultValue?: string | number | boolean | string[];
}

export interface DisplayFields {
  primary: string;
  secondary: string;
  imageUrl?: string;
  badge?: {
    text: string;
    color?: string;
  };
}

export interface CrudConfig<T extends Record<string, unknown>> {
  entityName: string;
  entityNamePlural: string;
  apiEndpoint: string;
  fields: Field[];
  displayFields: (item: T) => DisplayFields;
  getItemId: (item: T) => string;
  palette: {
    primary: string;
    secondary: string;
    background: string;
  };
  // Optional customizations
  customActions?: (item: T) => React.ReactNode;
  onItemClick?: (item: T) => void;
  searchFields?: (item: T) => string[]; // Custom search fields
  emptyState?: {
    title: string;
    description: string;
    icon?: React.ReactNode;
  };
}
