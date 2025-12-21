"use client";

import CrudManager from "@/components/admin/CrudManager";
import type { CrudConfig } from "@/types/crud";

// Example User type - adjust based on your actual user schema
type User = {
  id: string;
  email: string;
  role: "admin" | "manager" | "viewer";
  createdAt: string;
  lastLogin: string | null;
};

const usersConfig: CrudConfig<User> = {
  entityName: "User",
  entityNamePlural: "Users",
  apiEndpoint: "/api/admin/users",
  fields: [
    {
      name: "email",
      label: "Email",
      type: "email",
      required: true,
      placeholder: "user@example.com",
    },
    {
      name: "role",
      label: "Role",
      type: "select",
      required: true,
      options: ["admin", "manager", "viewer"],
      defaultValue: "viewer",
    },
  ],
  displayFields: (user) => ({
    primary: user.email,
    secondary: `Role: ${user.role} · Last login: ${user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}`,
    badge: {
      text: user.role,
      color:
        user.role === "admin"
          ? "#dc2626"
          : user.role === "manager"
          ? "#f59e0b"
          : "#6b7280",
    },
  }),
  getItemId: (user) => user.id,
  palette: {
    primary: "#401268",
    secondary: "#c5a3ff",
    background: "#f8f6f0",
  },
  emptyState: {
    title: "No users yet",
    description: "Add users to manage your store",
  },
};

export default function AdminUsersPage() {
  return <CrudManager config={usersConfig} />;
}
