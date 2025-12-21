"use client";

import React, { useState } from "react";
import { Sidebar, SidebarBody, SidebarLink } from "@/components/ui/sidebar";
import {
  IconPackage,
  IconPalette,
  IconLogout,
  IconShield,
  IconBox,
  IconFolders,
  IconSettings,
  IconUsers,
} from "@tabler/icons-react";
import { motion } from "framer-motion";
import { usePathname, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

interface AdminSidebarProps {
  email: string;
}

export function AdminSidebar({ email }: AdminSidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = createClient();
  const [open, setOpen] = useState(false);

  const links = [
    {
      label: "Orders",
      href: "/admin/orders",
      icon: (
        <IconPackage className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Products",
      href: "/admin/products",
      icon: (
        <IconBox className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Collections",
      href: "/admin/collections",
      icon: (
        <IconFolders className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Designs",
      href: "/admin/designs",
      icon: (
        <IconPalette className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Users",
      href: "/admin/users",
      icon: (
        <IconUsers className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
    {
      label: "Settings",
      href: "/admin/settings",
      icon: (
        <IconSettings className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
      ),
    },
  ];

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    router.push("/admin/login");
  };

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <AdminLogo /> : <AdminLogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => (
              <SidebarLink
                key={idx}
                link={link}
                className={cn(
                  "rounded-lg px-3 py-2 hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors",
                  pathname === link.href &&
                    "bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300"
                )}
              />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="px-3 py-2 rounded-lg bg-neutral-200 dark:bg-neutral-700/50">
            <SidebarLink
              link={{
                label: email.split("@")[0] || "Admin",
                href: "#",
                icon: (
                  <IconShield className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
                ),
              }}
            />
          </div>
          <SidebarLink
            link={{
              label: "Sign Out",
              href: "#",
              icon: (
                <IconLogout className="h-5 w-5 shrink-0 text-neutral-700 dark:text-neutral-200" />
              ),
            }}
            onClick={handleSignOut}
            className="rounded-lg px-3 py-2 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-600 dark:text-red-400 transition-colors"
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
}

export const AdminLogo = () => {
  return (
    <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-bold whitespace-pre text-black dark:text-white"
      >
        GEEKS ADMIN
      </motion.span>
    </div>
  );
};

export const AdminLogoIcon = () => {
  return (
    <div className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal">
      <div className="h-5 w-6 shrink-0 rounded-tl-lg rounded-tr-sm rounded-br-lg rounded-bl-sm bg-gradient-to-br from-indigo-600 to-purple-600 dark:from-indigo-400 dark:to-purple-400" />
    </div>
  );
};
