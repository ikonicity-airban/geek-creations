"use client";

import { useState } from "react";
import { Tabs } from "@/components/ui/tabs";
import {
  Store,
  Mail,
  CreditCard,
  Shield,
  Palette,
  Bell,
  Globe,
  Truck,
  Save,
  RefreshCw,
} from "lucide-react";
import { motion } from "framer-motion";

export default function AdminSettingsPage() {
  // Store Settings State
  const [storeSettings, setStoreSettings] = useState({
    storeName: "Geek Creations",
    storeEmail: "contact@geekcreations.com",
    storePhone: "+234 800 000 0000",
    storeAddress: "123 Tech Street, Lagos, Nigeria",
    currency: "NGN",
    timezone: "Africa/Lagos",
    taxRate: "7.5",
  });

  // Email Settings State
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: "smtp.gmail.com",
    smtpPort: "587",
    smtpUser: "noreply@geekcreations.com",
    smtpPassword: "••••••••",
    fromName: "Geek Creations",
    fromEmail: "noreply@geekcreations.com",
    enableOrderConfirmation: true,
    enableShippingNotification: true,
    enableMarketingEmails: false,
  });

  // Payment Settings State
  const [paymentSettings, setPaymentSettings] = useState({
    enablePaystack: true,
    paystackPublicKey: "pk_test_••••••••",
    paystackSecretKey: "sk_test_••••••••",
    enableFlutterwave: false,
    flutterwavePublicKey: "",
    flutterwaveSecretKey: "",
    enableCrypto: true,
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
    primaryColor: "#401268",
    secondaryColor: "#c5a3ff",
    accentColor: "#e2ae3d",
    logoUrl: "/logo.png",
    faviconUrl: "/favicon.ico",
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

  const [saveStatus, setSaveStatus] = useState<"idle" | "saving" | "saved">(
    "idle"
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
                  <option value="NGN" className="bg-purple-900">
                    NGN - Nigerian Naira
                  </option>
                  <option value="USD" className="bg-purple-900">
                    USD - US Dollar
                  </option>
                  <option value="EUR" className="bg-purple-900">
                    EUR - Euro
                  </option>
                  <option value="GBP" className="bg-purple-900">
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
                  <option value="Africa/Lagos" className="bg-purple-900">
                    Africa/Lagos (WAT)
                  </option>
                  <option value="Europe/London" className="bg-purple-900">
                    Europe/London (GMT)
                  </option>
                  <option value="America/New_York" className="bg-purple-900">
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
                    <div className="w-11 h-6 bg-white/20 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-white/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-400"></div>
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
  ];

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900">
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
