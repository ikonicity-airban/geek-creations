import { db } from "../";
import { currencies, languages, exchangeRates } from "../schema";
import { eq } from "drizzle-orm";

// Initial currencies
const initialCurrencies = [
  {
    code: "NGN",
    name: "Nigerian Naira",
    symbol: "₦",
    symbolPosition: "before" as const,
    decimalPlaces: 2,
    isActive: true,
    isDefault: true,
    sortOrder: 0,
  },
  {
    code: "USD",
    name: "US Dollar",
    symbol: "$",
    symbolPosition: "before" as const,
    decimalPlaces: 2,
    isActive: true,
    isDefault: false,
    sortOrder: 1,
  },
  {
    code: "GBP",
    name: "British Pound",
    symbol: "£",
    symbolPosition: "before" as const,
    decimalPlaces: 2,
    isActive: true,
    isDefault: false,
    sortOrder: 2,
  },
  {
    code: "EUR",
    name: "Euro",
    symbol: "€",
    symbolPosition: "before" as const,
    decimalPlaces: 2,
    isActive: true,
    isDefault: false,
    sortOrder: 3,
  },
  {
    code: "JPY",
    name: "Japanese Yen",
    symbol: "¥",
    symbolPosition: "before" as const,
    decimalPlaces: 0,
    isActive: true,
    isDefault: false,
    sortOrder: 4,
  },
];

// Initial languages
const initialLanguages = [
  {
    code: "en",
    name: "English",
    nativeName: "English",
    flag: "🇬🇧",
    isActive: true,
    isDefault: true,
    isRTL: false,
    sortOrder: 0,
  },
  {
    code: "fr",
    name: "French",
    nativeName: "Français",
    flag: "🇫🇷",
    isActive: true,
    isDefault: false,
    isRTL: false,
    sortOrder: 1,
  },
  {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    flag: "🇪🇸",
    isActive: true,
    isDefault: false,
    isRTL: false,
    sortOrder: 2,
  },
  {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    flag: "🇩🇪",
    isActive: true,
    isDefault: false,
    isRTL: false,
    sortOrder: 3,
  },
  {
    code: "yo",
    name: "Yoruba",
    nativeName: "Yorùbá",
    flag: "🇳🇬",
    isActive: true,
    isDefault: false,
    isRTL: false,
    sortOrder: 4,
  },
  {
    code: "ig",
    name: "Igbo",
    nativeName: "Igbo",
    flag: "🇳🇬",
    isActive: true,
    isDefault: false,
    isRTL: false,
    sortOrder: 5,
  },
  {
    code: "ha",
    name: "Hausa",
    nativeName: "Hausa",
    flag: "🇳🇬",
    isActive: true,
    isDefault: false,
    isRTL: false,
    sortOrder: 6,
  },
];

// Sample exchange rates (approximate values)
const initialExchangeRates = [
  // NGN conversions
  { baseCurrency: "NGN", targetCurrency: "USD", rate: "0.0012" },
  { baseCurrency: "NGN", targetCurrency: "GBP", rate: "0.00095" },
  { baseCurrency: "NGN", targetCurrency: "EUR", rate: "0.0011" },
  { baseCurrency: "NGN", targetCurrency: "JPY", rate: "0.18" },

  // USD conversions
  { baseCurrency: "USD", targetCurrency: "NGN", rate: "833.33" },
  { baseCurrency: "USD", targetCurrency: "GBP", rate: "0.79" },
  { baseCurrency: "USD", targetCurrency: "EUR", rate: "0.92" },
  { baseCurrency: "USD", targetCurrency: "JPY", rate: "149.50" },

  // GBP conversions
  { baseCurrency: "GBP", targetCurrency: "NGN", rate: "1054.00" },
  { baseCurrency: "GBP", targetCurrency: "USD", rate: "1.27" },
  { baseCurrency: "GBP", targetCurrency: "EUR", rate: "1.17" },
  { baseCurrency: "GBP", targetCurrency: "JPY", rate: "189.00" },

  // EUR conversions
  { baseCurrency: "EUR", targetCurrency: "NGN", rate: "909.00" },
  { baseCurrency: "EUR", targetCurrency: "USD", rate: "1.09" },
  { baseCurrency: "EUR", targetCurrency: "GBP", rate: "0.86" },
  { baseCurrency: "EUR", targetCurrency: "JPY", rate: "162.50" },

  // JPY conversions
  { baseCurrency: "JPY", targetCurrency: "NGN", rate: "5.57" },
  { baseCurrency: "JPY", targetCurrency: "USD", rate: "0.0067" },
  { baseCurrency: "JPY", targetCurrency: "GBP", rate: "0.0053" },
  { baseCurrency: "JPY", targetCurrency: "EUR", rate: "0.0062" },
];

export async function seedLocaleData() {
  console.log("🌍 Starting locale data seed...");

  try {
    // Seed currencies
    console.log("💰 Seeding currencies...");
    for (const currency of initialCurrencies) {
      const existing = await db
        .select()
        .from(currencies)
        .where(eq(currencies.code, currency.code))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(currencies).values(currency);
        console.log(`  ✓ Added currency: ${currency.code} - ${currency.name}`);
      } else {
        console.log(
          `  ⚠ Currency ${currency.code} already exists, skipping...`
        );
      }
    }

    // Seed languages
    console.log("\n🗣️  Seeding languages...");
    for (const language of initialLanguages) {
      const existing = await db
        .select()
        .from(languages)
        .where(eq(languages.code, language.code))
        .limit(1);

      if (existing.length === 0) {
        await db.insert(languages).values(language);
        console.log(`  ✓ Added language: ${language.code} - ${language.name}`);
      } else {
        console.log(
          `  ⚠ Language ${language.code} already exists, skipping...`
        );
      }
    }

    // Seed exchange rates
    console.log("\n💱 Seeding exchange rates...");
    for (const rate of initialExchangeRates) {
      const existing = await db
        .select()
        .from(exchangeRates)
        .where(
          eq(exchangeRates.baseCurrency, rate.baseCurrency) &&
            eq(exchangeRates.targetCurrency, rate.targetCurrency)
        )
        .limit(1);

      if (existing.length === 0) {
        await db.insert(exchangeRates).values({
          ...rate,
          source: "manual",
          lastFetchedAt: new Date(),
        });
        console.log(
          `  ✓ Added rate: ${rate.baseCurrency} → ${rate.targetCurrency} = ${rate.rate}`
        );
      } else {
        console.log(
          `  ⚠ Rate ${rate.baseCurrency}→${rate.targetCurrency} already exists, skipping...`
        );
      }
    }

    console.log("\n✅ Locale data seeding completed successfully!");
  } catch (error) {
    console.error("❌ Error seeding locale data:", error);
    throw error;
  }
}

// Run seed if executed directly
if (require.main === module) {
  seedLocaleData()
    .then(() => {
      console.log("\n🎉 All done!");
      process.exit(0);
    })
    .catch((error) => {
      console.error("\n💥 Seed failed:", error);
      process.exit(1);
    });
}
