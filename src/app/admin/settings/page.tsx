"use client";

import { Settings, Store, Mail, CreditCard, Shield } from "lucide-react";

export default function AdminSettingsPage() {
  const settingsSections = [
    {
      title: "Store Settings",
      icon: <Store className="w-6 h-6" />,
      description: "Configure your store details",
      href: "/admin/settings/store",
    },
    {
      title: "Payment Settings",
      icon: <CreditCard className="w-6 h-6" />,
      description: "Manage payment providers",
      href: "/admin/settings/payments",
    },
    {
      title: "Email Settings",
      icon: <Mail className="w-6 h-6" />,
      description: "Configure email notifications",
      href: "/admin/settings/email",
    },
    {
      title: "Security",
      icon: <Shield className="w-6 h-6" />,
      description: "Security and access control",
      href: "/admin/settings/security",
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto w-full p-4 md:p-6">
        <div className="mb-6 md:mb-8">
          <h4 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
            Settings
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Configure your store settings
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {settingsSections.map((section) => (
            <div
              key={section.title}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow cursor-pointer"
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400">
                  {section.icon}
                </div>
                <div className="flex-1">
                  <h5 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                    {section.title}
                  </h5>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {section.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
