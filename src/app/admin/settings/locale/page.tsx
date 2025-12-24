"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Globe,
  DollarSign,
  Plus,
  Trash2,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

interface Currency {
  id?: string;
  code: string;
  name: string;
  symbol: string;
  symbolPosition: "before" | "after";
  decimalPlaces: number;
  isActive: boolean;
  isDefault: boolean;
  sortOrder: number;
}

interface Language {
  id?: string;
  code: string;
  name: string;
  nativeName: string;
  flag: string;
  isActive: boolean;
  isDefault: boolean;
  isRTL: boolean;
  sortOrder: number;
}

interface ExchangeRate {
  id?: string;
  baseCurrency: string;
  targetCurrency: string;
  rate: string;
  source: string;
  lastFetchedAt?: Date;
  updatedAt?: Date;
}

export default function LocaleSettingsPage() {
  // State for currencies
  const [currencies, setCurrencies] = useState<Currency[]>([]);
  const [editingCurrency, setEditingCurrency] = useState<string | null>(null);
  const [newCurrency, setNewCurrency] = useState<Partial<Currency>>({
    code: "",
    name: "",
    symbol: "",
    symbolPosition: "before",
    decimalPlaces: 2,
    isActive: true,
    isDefault: false,
    sortOrder: 0,
  });
  const [showAddCurrency, setShowAddCurrency] = useState(false);

  // State for languages
  const [languages, setLanguages] = useState<Language[]>([]);
  const [editingLanguage, setEditingLanguage] = useState<string | null>(null);
  const [newLanguage, setNewLanguage] = useState<Partial<Language>>({
    code: "",
    name: "",
    nativeName: "",
    flag: "",
    isActive: true,
    isDefault: false,
    isRTL: false,
    sortOrder: 0,
  });
  const [showAddLanguage, setShowAddLanguage] = useState(false);

  // State for exchange rates
  const [exchangeRates, setExchangeRates] = useState<ExchangeRate[]>([]);
  const [newRate, setNewRate] = useState<Partial<ExchangeRate>>({
    baseCurrency: "",
    targetCurrency: "",
    rate: "",
  });
  const [showAddRate, setShowAddRate] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [fetching, setFetching] = useState(false);

  // Load data on mount
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [currenciesRes, languagesRes, ratesRes] = await Promise.all([
        fetch("/api/admin/locale/currencies"),
        fetch("/api/admin/locale/languages"),
        fetch("/api/admin/locale/exchange-rates"),
      ]);

      if (currenciesRes.ok) {
        const data = await currenciesRes.json();
        setCurrencies(data.currencies || []);
      }

      if (languagesRes.ok) {
        const data = await languagesRes.json();
        setLanguages(data.languages || []);
      }

      if (ratesRes.ok) {
        const data = await ratesRes.json();
        setExchangeRates(data.rates || []);
      }
    } catch (error) {
      console.error("Failed to load locale data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Currency operations
  const handleAddCurrency = async () => {
    if (!newCurrency.code || !newCurrency.name || !newCurrency.symbol) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/locale/currencies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newCurrency),
      });

      if (res.ok) {
        await loadData();
        setNewCurrency({
          code: "",
          name: "",
          symbol: "",
          symbolPosition: "before",
          decimalPlaces: 2,
          isActive: true,
          isDefault: false,
          sortOrder: 0,
        });
        setShowAddCurrency(false);
      }
    } catch (error) {
      console.error("Failed to add currency:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteCurrency = async (code: string) => {
    if (!confirm("Are you sure you want to delete this currency?")) return;

    try {
      const res = await fetch(`/api/admin/locale/currencies/${code}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Failed to delete currency:", error);
    }
  };

  const handleUpdateCurrency = async (currency: Currency) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/locale/currencies/${currency.code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currency),
      });

      if (res.ok) {
        await loadData();
        setEditingCurrency(null);
      }
    } catch (error) {
      console.error("Failed to update currency:", error);
    } finally {
      setSaving(false);
    }
  };

  // Language operations
  const handleAddLanguage = async () => {
    if (!newLanguage.code || !newLanguage.name || !newLanguage.nativeName) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/admin/locale/languages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newLanguage),
      });

      if (res.ok) {
        await loadData();
        setNewLanguage({
          code: "",
          name: "",
          nativeName: "",
          flag: "",
          isActive: true,
          isDefault: false,
          isRTL: false,
          sortOrder: 0,
        });
        setShowAddLanguage(false);
      }
    } catch (error) {
      console.error("Failed to add language:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLanguage = async (code: string) => {
    if (!confirm("Are you sure you want to delete this language?")) return;

    try {
      const res = await fetch(`/api/admin/locale/languages/${code}`, {
        method: "DELETE",
      });

      if (res.ok) {
        await loadData();
      }
    } catch (error) {
      console.error("Failed to delete language:", error);
    }
  };

  const handleUpdateLanguage = async (language: Language) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/locale/languages/${language.code}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(language),
      });

      if (res.ok) {
        await loadData();
        setEditingLanguage(null);
      }
    } catch (error) {
      console.error("Failed to update language:", error);
    } finally {
      setSaving(false);
    }
  };

  // Exchange rate operations
  const handleAddRate = async () => {
    if (!newRate.baseCurrency || !newRate.targetCurrency || !newRate.rate) {
      alert("Please fill in all required fields");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/locale/exchange-rates", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRate),
      });

      if (res.ok) {
        await loadData();
        setNewRate({
          baseCurrency: "",
          targetCurrency: "",
          rate: "",
        });
        setShowAddRate(false);
      }
    } catch (error) {
      console.error("Failed to add exchange rate:", error);
    } finally {
      setSaving(false);
    }
  };

  const handleFetchLiveRates = async () => {
    setFetching(true);
    try {
      const res = await fetch("/api/admin/locale/exchange-rates/sync", {
        method: "POST",
      });

      if (res.ok) {
        await loadData();
        alert("Exchange rates updated successfully!");
      }
    } catch (error) {
      console.error("Failed to fetch live rates:", error);
      alert("Failed to fetch live rates");
    } finally {
      setFetching(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-1 items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-purple-600" />
          <p className="text-gray-600 dark:text-gray-400">
            Loading locale settings...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto w-full p-4 sm:p-6 md:p-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Globe className="w-8 h-8 text-purple-600" />
            <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white">
              Internationalization
            </h1>
          </div>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Manage currencies, languages, and exchange rates
          </p>
        </div>

        <div className="space-y-8">
          {/* Currencies Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <DollarSign className="w-6 h-6 text-green-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Currencies
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddCurrency(!showAddCurrency)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Currency
              </motion.button>
            </div>

            {/* Add Currency Form */}
            {showAddCurrency && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <Input
                    placeholder="Code (e.g., USD)"
                    value={newCurrency.code}
                    onChange={(e) =>
                      setNewCurrency({
                        ...newCurrency,
                        code: e.target.value.toUpperCase(),
                      })
                    }
                    maxLength={3}
                  />
                  <Input
                    placeholder="Name (e.g., US Dollar)"
                    value={newCurrency.name}
                    onChange={(e) =>
                      setNewCurrency({ ...newCurrency, name: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Symbol (e.g., $)"
                    value={newCurrency.symbol}
                    onChange={(e) =>
                      setNewCurrency({ ...newCurrency, symbol: e.target.value })
                    }
                  />
                  <select
                    value={newCurrency.symbolPosition}
                    onChange={(e) =>
                      setNewCurrency({
                        ...newCurrency,
                        symbolPosition: e.target.value as "before" | "after",
                      })
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="before">Symbol Before</option>
                    <option value="after">Symbol After</option>
                  </select>
                  <Input
                    type="number"
                    placeholder="Decimal Places"
                    value={newCurrency.decimalPlaces}
                    onChange={(e) =>
                      setNewCurrency({
                        ...newCurrency,
                        decimalPlaces: parseInt(e.target.value),
                      })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sort Order"
                    value={newCurrency.sortOrder}
                    onChange={(e) =>
                      setNewCurrency({
                        ...newCurrency,
                        sortOrder: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCurrency.isActive}
                      onChange={(e) =>
                        setNewCurrency({
                          ...newCurrency,
                          isActive: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newCurrency.isDefault}
                      onChange={(e) =>
                        setNewCurrency({
                          ...newCurrency,
                          isDefault: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Default
                    </span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddCurrency}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Currency"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddCurrency(false)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Currencies List */}
            <div className="space-y-3">
              {currencies.map((currency) => (
                <div
                  key={currency.code}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-3xl">{currency.symbol}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                          {currency.code}
                        </span>
                        {currency.isDefault && (
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            Default
                          </Badge>
                        )}
                        {currency.isActive && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Active
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {currency.name} • {currency.decimalPlaces} decimals •
                        Symbol {currency.symbolPosition}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteCurrency(currency.code)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Languages Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Languages
                </h2>
              </div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowAddLanguage(!showAddLanguage)}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                Add Language
              </motion.button>
            </div>

            {/* Add Language Form */}
            {showAddLanguage && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <Input
                    placeholder="Code (e.g., en)"
                    value={newLanguage.code}
                    onChange={(e) =>
                      setNewLanguage({
                        ...newLanguage,
                        code: e.target.value.toLowerCase(),
                      })
                    }
                  />
                  <Input
                    placeholder="Name (e.g., English)"
                    value={newLanguage.name}
                    onChange={(e) =>
                      setNewLanguage({ ...newLanguage, name: e.target.value })
                    }
                  />
                  <Input
                    placeholder="Native Name (e.g., English)"
                    value={newLanguage.nativeName}
                    onChange={(e) =>
                      setNewLanguage({
                        ...newLanguage,
                        nativeName: e.target.value,
                      })
                    }
                  />
                  <Input
                    placeholder="Flag (e.g., 🇺🇸)"
                    value={newLanguage.flag}
                    onChange={(e) =>
                      setNewLanguage({ ...newLanguage, flag: e.target.value })
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Sort Order"
                    value={newLanguage.sortOrder}
                    onChange={(e) =>
                      setNewLanguage({
                        ...newLanguage,
                        sortOrder: parseInt(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newLanguage.isActive}
                      onChange={(e) =>
                        setNewLanguage({
                          ...newLanguage,
                          isActive: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Active
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newLanguage.isDefault}
                      onChange={(e) =>
                        setNewLanguage({
                          ...newLanguage,
                          isDefault: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      Default
                    </span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={newLanguage.isRTL}
                      onChange={(e) =>
                        setNewLanguage({
                          ...newLanguage,
                          isRTL: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-purple-600 rounded"
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">
                      RTL
                    </span>
                  </label>
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddLanguage}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Language"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddLanguage(false)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Languages List */}
            <div className="space-y-3">
              {languages.map((language) => (
                <div
                  key={language.code}
                  className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <span className="text-3xl">{language.flag}</span>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-lg text-gray-900 dark:text-white">
                          {language.name}
                        </span>
                        {language.isDefault && (
                          <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                            Default
                          </Badge>
                        )}
                        {language.isActive && (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                            Active
                          </Badge>
                        )}
                        {language.isRTL && (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                            RTL
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {language.nativeName} • {language.code.toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDeleteLanguage(language.code)}
                      className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30 rounded-lg transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </motion.button>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Exchange Rates Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <TrendingUp className="w-6 h-6 text-orange-600" />
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Exchange Rates
                </h2>
              </div>
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleFetchLiveRates}
                  disabled={fetching}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg font-semibold hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  <RefreshCw
                    className={`w-4 h-4 ${fetching ? "animate-spin" : ""}`}
                  />
                  {fetching ? "Fetching..." : "Fetch Live Rates"}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowAddRate(!showAddRate)}
                  className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg font-semibold hover:bg-purple-700 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Add Rate
                </motion.button>
              </div>
            </div>

            {/* Add Rate Form */}
            {showAddRate && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <select
                    value={newRate.baseCurrency}
                    onChange={(e) =>
                      setNewRate({ ...newRate, baseCurrency: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Base Currency</option>
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                  <select
                    value={newRate.targetCurrency}
                    onChange={(e) =>
                      setNewRate({ ...newRate, targetCurrency: e.target.value })
                    }
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
                  >
                    <option value="">Select Target Currency</option>
                    {currencies.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.code} - {c.name}
                      </option>
                    ))}
                  </select>
                  <Input
                    type="number"
                    step="0.0000000001"
                    placeholder="Exchange Rate"
                    value={newRate.rate}
                    onChange={(e) =>
                      setNewRate({ ...newRate, rate: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddRate}
                    disabled={saving}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Rate"}
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowAddRate(false)}
                    className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white rounded-lg font-semibold hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                  >
                    Cancel
                  </motion.button>
                </div>
              </motion.div>
            )}

            {/* Exchange Rates List */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {exchangeRates.map((rate, idx) => (
                <div
                  key={`${rate.baseCurrency}-${rate.targetCurrency}-${idx}`}
                  className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-lg text-gray-900 dark:text-white">
                        {rate.baseCurrency} → {rate.targetCurrency}
                      </span>
                    </div>
                    <Badge
                      className={
                        rate.source === "api"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200"
                      }
                    >
                      {rate.source}
                    </Badge>
                  </div>
                  <div className="text-2xl font-black text-purple-600 mb-2">
                    {parseFloat(rate.rate).toFixed(6)}
                  </div>
                  {rate.lastFetchedAt && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Updated:{" "}
                      {new Date(rate.lastFetchedAt).toLocaleDateString()}
                    </p>
                  )}
                </div>
              ))}
              {exchangeRates.length === 0 && (
                <div className="col-span-full text-center py-8 text-gray-500 dark:text-gray-400">
                  No exchange rates configured. Add rates manually or fetch live
                  rates.
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
