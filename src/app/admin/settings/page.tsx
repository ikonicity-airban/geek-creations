"use client";

import { useState, useEffect } from "react";
import { Tabs } from "@/components/ui/tabs";
import { Store, Mail, CreditCard, Shield, Save, RefreshCw, Key, Eye, EyeOff, Search, Plus } from "lucide-react";
import { motion } from "framer-motion";
import { CONFIG } from "@/lib/config";
import { EmailDebug } from "@/components/debug/EmailDebug";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

export default function AdminSettingsPage() {
  // Store Settings State
  const [storeSettings, setStoreSettings] = useState({
    storeName: CONFIG.SITE.name,
    storeEmail: CONFIG.CONTACT.email,
    storePhone: CONFIG.CONTACT.phone,
    storeAddress: `${CONFIG.BUSINESS.address}, ${CONFIG.BUSINESS.city}, ${CONFIG.BUSINESS.country}`,
    currency: CONFIG.SHOPIFY.currencyCode,
    timezone: "Africa/Lagos",
    taxRate: "7.5",
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: CONFIG.SITE.email,
    smtpPassword: "••••••••",
    fromName: CONFIG.SITE.name,
    fromEmail: CONFIG.SITE.email,
    enableOrderConfirmation: true,
    enableShippingNotification: true,
    enableMarketingEmails: CONFIG.FEATURES.newsletter,
  });

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState({
    enablePaystack: !!CONFIG.PAYMENT.paystack.publicKey,
    paystackPublicKey: CONFIG.PAYMENT.paystack.publicKey || "pk_test_••••••••",
    paystackSecretKey: CONFIG.PAYMENT.paystack.secretKey
      ? "sk_test_••••••••"
      : "",
    enableFlutterwave: !!CONFIG.PAYMENT.flutterwave.publicKey,
    flutterwavePublicKey: CONFIG.PAYMENT.flutterwave.publicKey || "",
    flutterwaveSecretKey: CONFIG.PAYMENT.flutterwave.secretKey
      ? "••••••••"
      : "",
    enableCrypto: !!CONFIG.CRYPTO.solana.rpcUrl,
    cryptoWalletAddress: "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  });

  // Security Settings State
  const [securitySettings, setSecuritySettings] = useState({
    requireTwoFactor: false,
    sessionTimeout: "60",
    maxLoginAttempts: "5",
    enableApiAccess: true,
    apiKey: "gk_••••••••••••••••",
    allowedIpAddresses: "",
  });

  // Design Settings State
  const [designSettings, setDesignSettings] = useState({
    primaryColor: CONFIG.THEME.primaryColor,
    secondaryColor: CONFIG.THEME.secondaryColor,
    accentColor: CONFIG.THEME.accentColor,
    logoUrl: CONFIG.SITE.logoUrl,
    faviconUrl: CONFIG.SITE.faviconUrl,
    enableDarkMode: true,
  });

  // Shipping Settings State
  const [shippingSettings, setShippingSettings] = useState({
    enableLocalShipping: true,
    localShippingFee: "2000",
    enableInternationalShipping: true,
    internationalShippingFee: "15000",
    freeShippingThreshold: "50000",
    estimatedDeliveryDays: "3-7",
  });

  // Env Variables State
  const [envVars, setEnvVars] = useState<{ key: string; value: string; isSecret: boolean; description: string; source: string }[]>([]);
  // console.log("🚀 ~ AdminSettingsPage ~ envVars:", envVars)
  const [searchQuery, setSearchQuery] = useState("");
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [isLoadingEnv, setIsLoadingEnv] = useState(false);
  const [isSavingEnv, setIsSavingEnv] = useState(false);

  // New Env Variable State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newKey, setNewKey] = useState("");
  const [newValue, setNewValue] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newIsSecret, setNewIsSecret] = useState(false);

  const SUGGESTED_SITE_KEYS = [
    {
      key: "NEXT_PUBLIC_SITE_NAME",
      description: "The display name of the storefront website.",
      isSecret: false,
    },
    {
      key: "NEXT_PUBLIC_SITE_SLOGAN",
      description: "The primary marketing tagline/slogan for the storefront.",
      isSecret: false,
    },
    {
      key: "NEXT_PUBLIC_SITE_DESCRIPTION",
      description: "The default SEO meta description text for search engines.",
      isSecret: false,
    },
    {
      key: "NEXT_PUBLIC_SITE_URL",
      description: "The primary URL address of the live storefront deployment.",
      isSecret: false,
    },
    {
      key: "NEXT_PUBLIC_LOGO_URL",
      description: "The URL of the site logo image asset.",
      isSecret: false,
    },
    {
      key: "NEXT_PUBLIC_FAVICON_URL",
      description: "The URL of the browser tab shortcut favicon asset.",
      isSecret: false,
    },
    {
      key: "NEXT_PUBLIC_PRIMARY_COLOR",
      description: "Main branding color in HEX code format (e.g. #401268).",
      isSecret: false,
    },
    {
      key: "NEXT_PUBLIC_SECONDARY_COLOR",
      description: "Secondary accent theme color in HEX code format.",
      isSecret: false,
    },
    {
      key: "NEXT_PUBLIC_ACCENT_COLOR",
      description: "Highlight accent color in HEX code format.",
      isSecret: false,
    },
    {
      key: "NEXT_PUBLIC_CONTACT_EMAIL",
      description: "Default contact email address for user queries.",
      isSecret: false,
    },
    {
      key: "NEXT_PUBLIC_CONTACT_PHONE",
      description: "Default contact telephone number for business operations.",
      isSecret: false,
    },
    {
      key: "NEXT_PUBLIC_SUPPORT_EMAIL",
      description: "Dedicated support email address for processing customer issues.",
      isSecret: false,
    },
  ];

  const handleSelectSuggestedKey = (item: typeof SUGGESTED_SITE_KEYS[0]) => {
    setNewKey(item.key);
    setNewDescription(item.description);
    setNewIsSecret(item.isSecret);
  };

  const handleKeyChange = (val: string) => {
    setNewKey(val);
    setNewIsSecret(!val.toUpperCase().startsWith("NEXT_PUBLIC_"));
  };

  const handleAddEnvVariable = () => {
    if (!newKey.trim()) {
      toast.error("Please enter a variable key name.");
      return;
    }
    const cleanKey = newKey.trim().toUpperCase().replace(/\s+/g, "_");
    
    if (envVars.some((item) => item.key === cleanKey)) {
      toast.error(`The key "${cleanKey}" already exists.`);
      return;
    }

    const newVar = {
      key: cleanKey,
      value: newValue.trim(),
      description: newDescription.trim() || `Custom environment variable: ${cleanKey}`,
      isSecret: newIsSecret,
      source: "local",
    };

    setEnvVars((prev) => [newVar, ...prev]);
    toast.success(`Added ${cleanKey} to local list. Remember to save changes!`);
    
    setNewKey("");
    setNewValue("");
    setNewDescription("");
    setNewIsSecret(false);
    setShowAddForm(false);
  };

  // Fetch Env Variables
  const fetchEnvVars = async () => {
    setIsLoadingEnv(true);
    try {
      const res = await fetch("/api/admin/env");
      const data = await res.json();
      if (data.variables) {
        setEnvVars(data.variables);
      } else {
        toast.error("Failed to load environment variables: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      toast.error("Error loading environment variables: " + err.message);
    } finally {
      setIsLoadingEnv(false);
    }
  };

  useEffect(() => {
    fetchEnvVars();
  }, []);

  const handleSaveEnv = async () => {
    setIsSavingEnv(true);
    try {
      const res = await fetch("/api/admin/env", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ variables: envVars }),
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Environment variables updated successfully!");
        if (data.warning) {
          toast.error(data.warning);
        }
        fetchEnvVars(); // Refresh state
      } else {
        toast.error("Failed to save environment variables: " + (data.error || "Unknown error"));
      }
    } catch (err: any) {
      toast.error("Error saving environment variables: " + err.message);
    } finally {
      setIsSavingEnv(false);
    }
  };

  const toggleKeyVisibility = (key: string) => {
    setVisibleKeys((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleEnvValueChange = (key: string, value: string) => {
    setEnvVars((prev) =>
      prev.map((item) => (item.key === key ? { ...item, value } : item))
    );
  };

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle",
  );

  const handleSave = (settingType: string) => {
    setSaveStatus("saving");
    // Simulate API call
    setTimeout(() => {
      setSaveStatus("saved");
      setTimeout(() => setSaveStatus("idle"), 2000);
    }, 1000);
  };

  const tabs = [
    {
      title: "Store",
      value: "store",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 sm:p-10 text-xl md:text-4xl font-bold text-white bg-linear-to-br from-purple-700 to-violet-900">
          <Store className="absolute top-4 right-4 w-8 h-8 sm:w-12 sm:h-12 opacity-20" />
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2">
                Store Settings
              </h3>
              <p className="text-sm sm:text-base text-white/80 font-normal">
                Manage your store information and preferences
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  Store Name
                </label>
                <input
                  type="text"
                  value={storeSettings.storeName}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      storeName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  Store Email
                </label>
                <input
                  type="email"
                  value={storeSettings.storeEmail}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      storeEmail: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  Store Phone
                </label>
                <input
                  type="tel"
                  value={storeSettings.storePhone}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      storePhone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  Currency
                </label>
                <select
                  value={storeSettings.currency}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      currency: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                >
                  <option value="NGN" className="bg-white text-gray-900 dark:bg-purple-900 dark:text-white">
                    NGN - Nigerian Naira
                  </option>
                  <option value="USD" className="bg-white text-gray-900 dark:bg-purple-900 dark:text-white">
                    USD - US Dollar
                  </option>
                  <option value="EUR" className="bg-white text-gray-900 dark:bg-purple-900 dark:text-white">
                    EUR - Euro
                  </option>
                  <option value="GBP" className="bg-white text-gray-900 dark:bg-purple-900 dark:text-white">
                    GBP - British Pound
                  </option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  Store Address
                </label>
                <textarea
                  value={storeSettings.storeAddress}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      storeAddress: e.target.value,
                    })
                  }
                  rows={3}
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  Timezone
                </label>
                <select
                  value={storeSettings.timezone}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      timezone: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                >
                  <option value="Africa/Lagos" className="bg-white text-gray-900 dark:bg-purple-900 dark:text-white">
                    Africa/Lagos (WAT)
                  </option>
                  <option value="Europe/London" className="bg-white text-gray-900 dark:bg-purple-900 dark:text-white">
                    Europe/London (GMT)
                  </option>
                  <option value="America/New_York" className="bg-white text-gray-900 dark:bg-purple-900 dark:text-white">
                    America/New_York (EST)
                  </option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  Tax Rate (%)
                </label>
                <input
                  type="number"
                  value={storeSettings.taxRate}
                  onChange={(e) =>
                    setStoreSettings({
                      ...storeSettings,
                      taxRate: e.target.value,
                    })
                  }
                  step="0.1"
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSave("store")}
              disabled={saveStatus === "saving"}
              className="px-6 py-3 rounded-btn bg-white text-purple-900 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-smooth disabled:opacity-50 flex items-center gap-2"
            >
              {saveStatus === "saving" ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : saveStatus === "saved" ? (
                <>
                  <Save className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        </div>
      ),
    },
    {
      title: "Email",
      value: "email",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 sm:p-10 text-xl md:text-4xl font-bold text-white bg-linear-to-br from-blue-600 to-cyan-600">
          <Mail className="absolute top-4 right-4 w-8 h-8 sm:w-12 sm:h-12 opacity-20" />
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2">
                Email Settings
              </h3>
              <p className="text-sm sm:text-base text-white/80 font-normal">
                Configure email notifications and SMTP
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              <div>
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  SMTP Host
                </label>
                <input
                  type="text"
                  value={emailSettings.smtpHost}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      smtpHost: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  SMTP Port
                </label>
                <input
                  type="text"
                  value={emailSettings.smtpPort}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      smtpPort: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  SMTP Username
                </label>
                <input
                  type="text"
                  value={emailSettings.smtpUser}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      smtpUser: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  SMTP Password
                </label>
                <input
                  type="password"
                  value={emailSettings.smtpPassword}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      smtpPassword: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  From Name
                </label>
                <input
                  type="text"
                  value={emailSettings.fromName}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      fromName: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  From Email
                </label>
                <input
                  type="email"
                  value={emailSettings.fromEmail}
                  onChange={(e) =>
                    setEmailSettings({
                      ...emailSettings,
                      fromEmail: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-bold text-white/90">
                Email Notifications
              </h4>
              <div className="space-y-3">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailSettings.enableOrderConfirmation}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        enableOrderConfirmation: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-2 border-white/30 bg-white/10 checked:bg-white checked:border-white transition-smooth cursor-pointer"
                  />
                  <span className="text-sm sm:text-base font-normal">
                    Order Confirmation Emails
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailSettings.enableShippingNotification}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        enableShippingNotification: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-2 border-white/30 bg-white/10 checked:bg-white checked:border-white transition-smooth cursor-pointer"
                  />
                  <span className="text-sm sm:text-base font-normal">
                    Shipping Notification Emails
                  </span>
                </label>

                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={emailSettings.enableMarketingEmails}
                    onChange={(e) =>
                      setEmailSettings({
                        ...emailSettings,
                        enableMarketingEmails: e.target.checked,
                      })
                    }
                    className="w-5 h-5 rounded border-2 border-white/30 bg-white/10 checked:bg-white checked:border-white transition-smooth cursor-pointer"
                  />
                  <span className="text-sm sm:text-base font-normal">
                    Marketing Emails
                  </span>
                </label>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSave("email")}
              disabled={saveStatus === "saving"}
              className="px-6 py-3 rounded-btn bg-white text-blue-900 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-smooth disabled:opacity-50 flex items-center gap-2"
            >
              {saveStatus === "saving" ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : saveStatus === "saved" ? (
                <>
                  <Save className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </motion.button>

            {/* EmailJS Debug Panel */}
            <div className="mt-8">
              <EmailDebug />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Payments",
      value: "payments",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 sm:p-10 text-xl md:text-4xl font-bold text-white bg-linear-to-br from-green-600 to-emerald-600">
          <CreditCard className="absolute top-4 right-4 w-8 h-8 sm:w-12 sm:h-12 opacity-20" />
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2">
                Payment Settings
              </h3>
              <p className="text-sm sm:text-base text-white/80 font-normal">
                Manage payment gateways and methods
              </p>
            </div>

            <div className="space-y-6">
              {/* Paystack */}
              <div className="bg-white/10 rounded-card p-4 sm:p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg sm:text-xl font-bold">Paystack</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.enablePaystack}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          enablePaystack: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
                  </label>
                </div>
                {paymentSettings.enablePaystack && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-white/90">
                        Public Key
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.paystackPublicKey}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            paystackPublicKey: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-btn text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-white/90">
                        Secret Key
                      </label>
                      <input
                        type="password"
                        value={paymentSettings.paystackSecretKey}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            paystackSecretKey: e.target.value,
                          })
                        }
                        className="w-full px-4 py-2.5 rounded-btn text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Flutterwave */}
              <div className="bg-white/10 rounded-card p-4 sm:p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg sm:text-xl font-bold">Flutterwave</h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.enableFlutterwave}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          enableFlutterwave: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
                  </label>
                </div>
                {paymentSettings.enableFlutterwave && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-white/90">
                        Public Key
                      </label>
                      <input
                        type="text"
                        value={paymentSettings.flutterwavePublicKey}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            flutterwavePublicKey: e.target.value,
                          })
                        }
                        placeholder="FLWPUBK-..."
                        className="w-full px-4 py-2.5 rounded-btn text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-white/90">
                        Secret Key
                      </label>
                      <input
                        type="password"
                        value={paymentSettings.flutterwaveSecretKey}
                        onChange={(e) =>
                          setPaymentSettings({
                            ...paymentSettings,
                            flutterwaveSecretKey: e.target.value,
                          })
                        }
                        placeholder="FLWSECK-..."
                        className="w-full px-4 py-2.5 rounded-btn text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Crypto */}
              <div className="bg-white/10 rounded-card p-4 sm:p-6 border border-white/20">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-lg sm:text-xl font-bold">
                    Cryptocurrency
                  </h4>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={paymentSettings.enableCrypto}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          enableCrypto: e.target.checked,
                        })
                      }
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
                  </label>
                </div>
                {paymentSettings.enableCrypto && (
                  <div>
                    <label className="block text-sm font-semibold mb-2 text-white/90">
                      Wallet Address (USDC/SOL)
                    </label>
                    <input
                      type="text"
                      value={paymentSettings.cryptoWalletAddress}
                      onChange={(e) =>
                        setPaymentSettings({
                          ...paymentSettings,
                          cryptoWalletAddress: e.target.value,
                        })
                      }
                      className="w-full px-4 py-2.5 rounded-btn text-sm bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                    />
                  </div>
                )}
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSave("payments")}
              disabled={saveStatus === "saving"}
              className="px-6 py-3 rounded-btn bg-white text-green-900 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-smooth disabled:opacity-50 flex items-center gap-2"
            >
              {saveStatus === "saving" ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : saveStatus === "saved" ? (
                <>
                  <Save className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        </div>
      ),
    },
    {
      title: "Security",
      value: "security",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 sm:p-10 text-xl md:text-4xl font-bold text-white bg-linear-to-br from-red-600 to-orange-600">
          <Shield className="absolute top-4 right-4 w-8 h-8 sm:w-12 sm:h-12 opacity-20" />
          <div className="space-y-6">
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2">
                Security Settings
              </h3>
              <p className="text-sm sm:text-base text-white/80 font-normal">
                Manage security and access controls
              </p>
            </div>

            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-normal">
                  Require Two-Factor Authentication
                </span>
                <input
                  type="checkbox"
                  checked={securitySettings.requireTwoFactor}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      requireTwoFactor: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-2 border-white/30 bg-white/10 checked:bg-white checked:border-white transition-smooth cursor-pointer"
                />
              </label>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  Session Timeout (minutes)
                </label>
                <input
                  type="number"
                  value={securitySettings.sessionTimeout}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      sessionTimeout: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  Max Login Attempts
                </label>
                <input
                  type="number"
                  value={securitySettings.maxLoginAttempts}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      maxLoginAttempts: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                />
              </div>

              <label className="flex items-center justify-between">
                <span className="text-sm sm:text-base font-normal">
                  Enable API Access
                </span>
                <input
                  type="checkbox"
                  checked={securitySettings.enableApiAccess}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      enableApiAccess: e.target.checked,
                    })
                  }
                  className="w-5 h-5 rounded border-2 border-white/30 bg-white/10 checked:bg-white checked:border-white transition-smooth cursor-pointer"
                />
              </label>

              {securitySettings.enableApiAccess && (
                <div>
                  <label className="block text-sm font-semibold mb-2 text-white/90">
                    API Key
                  </label>
                  <input
                    type="password"
                    value={securitySettings.apiKey}
                    readOnly
                    className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2 text-white/90">
                  Allowed IP Addresses (comma-separated)
                </label>
                <textarea
                  value={securitySettings.allowedIpAddresses}
                  onChange={(e) =>
                    setSecuritySettings({
                      ...securitySettings,
                      allowedIpAddresses: e.target.value,
                    })
                  }
                  rows={3}
                  placeholder="192.168.1.1, 10.0.0.1"
                  className="w-full px-4 py-2.5 sm:py-3 rounded-btn text-sm sm:text-base bg-white/10 border border-white/20 text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/30 transition-smooth resize-none"
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleSave("security")}
              disabled={saveStatus === "saving"}
              className="px-6 py-3 rounded-btn bg-white text-red-900 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl transition-smooth disabled:opacity-50 flex items-center gap-2"
            >
              {saveStatus === "saving" ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : saveStatus === "saved" ? (
                <>
                  <Save className="w-4 h-4" />
                  Saved!
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Changes
                </>
              )}
            </motion.button>
          </div>
        </div>
      ),
    },
    {
      title: "Env Keys",
      value: "env",
      content: (
        <div className="w-full overflow-hidden relative h-full rounded-2xl p-6 sm:p-10 text-xl md:text-4xl font-bold text-white bg-linear-to-br from-indigo-700 to-slate-900">
          <Key className="absolute top-4 right-4 w-8 h-8 sm:w-12 sm:h-12 opacity-20" />
          <div className="space-y-6 flex flex-col h-full">
            <div>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-2">
                Environment Variables
              </h3>
              <p className="text-sm sm:text-base text-white/80 font-normal">
                Manage your system settings and API integrations. Local updates sync to `.env.local`.
              </p>
            </div>

            {/* Search filter and Add Variable button */}
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between w-full">
              <div className="relative w-full max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50 z-10" />
                <Input
                  type="text"
                  placeholder="Search variables..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 h-10 border border-white/20 bg-white/10 dark:bg-white/10 text-white placeholder-white/50"
                />
              </div>

              {!showAddForm && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddForm(true)}
                  className="border border-white/20 text-white hover:bg-white/10 flex items-center gap-1.5 h-10"
                >
                  <Plus className="w-4 h-4" />
                  Add Variable
                </Button>
              )}
            </div>

            {/* Add New Variable Form */}
            {showAddForm && (
              <div className="bg-white/10 border border-white/20 p-4 sm:p-6 rounded-xl space-y-4 w-full">
                <div className="flex items-center justify-between border-b border-white/10 pb-2">
                  <h4 className="text-sm font-black uppercase tracking-wider text-white">
                    Add New Environment Variable
                  </h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold mb-1 text-white/90">
                      Quick Fill (Suggested Site Details)
                    </label>
                    <select
                      onChange={(e) => {
                        const selected = SUGGESTED_SITE_KEYS.find(k => k.key === e.target.value);
                        if (selected) handleSelectSuggestedKey(selected);
                      }}
                      className="w-full px-3 py-2 rounded-btn text-xs bg-white/10 dark:bg-white/15 border border-white/20 text-white focus:outline-none focus:ring-1 focus:ring-white/30 transition-smooth"
                    >
                      <option value="" className="bg-white text-gray-900 dark:bg-slate-900 dark:text-white">-- Select a site detail key (Optional) --</option>
                      {SUGGESTED_SITE_KEYS.map((item) => (
                        <option key={item.key} value={item.key} className="bg-white text-gray-900 dark:bg-slate-900 dark:text-white">
                          {item.key.replace("NEXT_PUBLIC_", "").toLowerCase().replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-white/90">Key Name</label>
                    <Input
                      type="text"
                      value={newKey}
                      onChange={(e) => handleKeyChange(e.target.value)}
                      placeholder="e.g. NEXT_PUBLIC_SITE_NAME"
                      className="w-full px-3 py-2 h-9 border border-white/20 bg-white/15 dark:bg-white/15 text-white font-mono uppercase"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-white/90">Value</label>
                    <Input
                      type="text"
                      value={newValue}
                      onChange={(e) => setNewValue(e.target.value)}
                      placeholder="Enter value"
                      className="w-full px-3 py-2 h-9 border border-white/20 bg-white/15 dark:bg-white/15 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold mb-1 text-white/90">Description</label>
                    <Input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Enter short description"
                      className="w-full px-3 py-2 h-9 border border-white/20 bg-white/15 dark:bg-white/15 text-white"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between flex-wrap gap-4 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer w-fit select-none">
                    <Checkbox
                      checked={newIsSecret}
                      onCheckedChange={(checked) => setNewIsSecret(!!checked)}
                      className="border-white/30 data-[state=checked]:bg-white data-[state=checked]:text-indigo-900"
                    />
                    <span className="text-xs font-medium text-white/90">Is Secret (Encrypts/masks input value)</span>
                  </label>

                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        setShowAddForm(false);
                        setNewKey("");
                        setNewValue("");
                        setNewDescription("");
                      }}
                      className="px-3 py-1.5 h-8 text-white hover:bg-white/10 hover:text-white"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      variant="default"
                      onClick={handleAddEnvVariable}
                      className="px-3 py-1.5 h-8 bg-white text-indigo-900 hover:bg-white/90 font-bold"
                    >
                      Add to List
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* Variables List */}
            <div className="flex-1 overflow-y-auto space-y-4 max-h-[450px] pr-2 scrollbar-thin scrollbar-thumb-white/20">
              {isLoadingEnv ? (
                <div className="flex items-center justify-center py-12">
                  <RefreshCw className="w-8 h-8 animate-spin text-white/80" />
                </div>
              ) : envVars.filter(item =>
                item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                item.description.toLowerCase().includes(searchQuery.toLowerCase())
              ).length === 0 ? (
                <p className="text-sm font-normal text-white/60 py-8 text-center">
                  No environment variables found matching search term.
                </p>
              ) : (
                envVars
                  .filter(item =>
                    item.key.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    item.description.toLowerCase().includes(searchQuery.toLowerCase())
                  )
                  .map((item) => (
                    <div key={item.key} className="bg-white/5 rounded-card p-4 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-mono text-sm sm:text-base tracking-tight text-white font-bold select-all truncate max-w-full">
                            {item.key}
                          </span>
                          <span className={cn(
                            "text-[10px] font-semibold px-2 py-0.5 rounded-full uppercase tracking-wider",
                            item.source === "both" ? "bg-green-500/20 text-green-300 border border-green-500/30" :
                              item.source === "local" ? "bg-blue-500/20 text-blue-300 border border-blue-500/30" :
                                item.source === "db" ? "bg-purple-500/20 text-purple-300 border border-purple-500/30" :
                                  "bg-yellow-500/20 text-yellow-300 border border-yellow-500/30"
                          )}>
                            {item.source}
                          </span>
                        </div>
                        <p className="text-xs text-white/70 font-normal">
                          {item.description}
                        </p>
                      </div>

                      <div className="relative flex items-center w-full md:w-80 shrink-0">
                        <Input
                          type={item.isSecret && !visibleKeys[item.key] ? "password" : "text"}
                          value={item.value}
                          onChange={(e) => handleEnvValueChange(item.key, e.target.value)}
                          placeholder={item.isSecret ? "••••••••••••••••" : "Empty"}
                          className="w-full pr-10 pl-3 h-10 border border-white/20 bg-white/10 dark:bg-white/10 text-white font-mono"
                        />
                        {item.isSecret && (
                          <button
                            type="button"
                            onClick={() => toggleKeyVisibility(item.key)}
                            className="absolute z-10 right-3 text-white/60 hover:text-white transition-colors"
                          >
                            {visibleKeys[item.key] ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  ))
              )}
            </div>

            <Button
              variant="default"
              onClick={handleSaveEnv}
              disabled={isSavingEnv || isLoadingEnv}
              className="px-6 py-3 bg-white text-indigo-900 hover:bg-white/90 font-bold text-sm sm:text-base shadow-lg hover:shadow-xl w-fit mt-4 h-12 flex items-center gap-2"
            >
              {isSavingEnv ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  Save Env Keys
                </>
              )}
            </Button>
          </div>
        </div>
      ),
    },
  ];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto h-[calc(100vh-4rem)] bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8">
        <div className="mb-6 sm:mb-8 md:mb-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-gray-900 dark:text-white mb-2">
            Settings
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Configure your store settings and preferences
          </p>
        </div>

        <Tabs
          tabs={tabs}
          containerClassName="mb-8 border-b border-gray-200 dark:border-gray-700"
          activeTabClassName="bg-gradient-to-r from-purple-600 to-blue-600"
          tabClassName="text-sm sm:text-base font-semibold"
          contentClassName="mt-8"
        />
      </div>
    </div>
  );
}
