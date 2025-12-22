"use client";

import Link from "next/link";
import {
  ChevronRight,
  Home,
  Grid3x3,
  ShoppingBag,
  Package,
  User,
  Settings,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type BreadcrumbItem = {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
};

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const defaultIcons: Record<
  string,
  React.ComponentType<{ className?: string }>
> = {
  Home: Home,
  Designs: Grid3x3,
  Products: ShoppingBag,
  Product: Package,
  Collections: ShoppingBag,
  Collection: Package,
  Cart: ShoppingBag,
  Checkout: ShoppingBag,
  Orders: Package,
  Profile: User,
  Settings: Settings,
  About: FileText,
  Contact: FileText,
  FAQ: FileText,
  Privacy: FileText,
};

export function Breadcrumb({ items, className }: BreadcrumbProps) {
  if (items.length === 0) return null;

  return (
    <nav className={cn("mb-6 text-sm", className)} aria-label="Breadcrumb">
      <ol className="flex items-center gap-2 flex-wrap">
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          const IconComponent = item.icon || defaultIcons[item.label];

          return (
            <li key={item.href} className="flex items-center gap-2">
              {index > 0 && (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
              {isLast ? (
                <span className="font-semibold text-accent flex items-center gap-1.5 truncate max-w-[200px] sm:max-w-none">
                  {IconComponent && (
                    <IconComponent className="w-4 h-4 shrink-0" />
                  )}
                  <span className="truncate">{item.label}</span>
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-1.5"
                >
                  {IconComponent && (
                    <IconComponent className="w-4 h-4 shrink-0" />
                  )}
                  <span className="truncate hidden md:block">{item.label}</span>
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
