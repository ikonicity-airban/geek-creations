// scripts/apply-rls.ts - Apply resolve-rls.sql query using Drizzle
import { db } from "../src/lib/db";
import { sql } from "drizzle-orm";
import * as fs from "fs";
import * as path from "path";

// Load environment variables manually from .env.local
const envLocalPath = path.resolve(process.cwd(), ".env.local");
if (fs.existsSync(envLocalPath)) {
  console.log("📝 Loading variables from .env.local...");
  const envContent = fs.readFileSync(envLocalPath, "utf-8");
  envContent.split("\n").forEach((line) => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) return;
    const parts = trimmed.split("=");
    if (parts.length >= 2) {
      const key = parts[0].trim();
      const value = parts.slice(1).join("=").trim().replace(/^['"]|['"]$/g, "");
      process.env[key] = value;
    }
  });
}

async function applyRLS() {
  console.log("🚀 Executing RLS policies SQL on the database...");

  const sqlFilePath = path.resolve(process.cwd(), "scripts/resolve-rls.sql");
  if (!fs.existsSync(sqlFilePath)) {
    console.error("❌ resolve-rls.sql script not found!");
    process.exit(1);
  }

  const sqlContent = fs.readFileSync(sqlFilePath, "utf-8");

  try {
    // Run the raw SQL queries
    await db.execute(sql.raw(sqlContent));
    console.log("✅ RLS policies applied successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Failed to apply RLS policies:", error);
    process.exit(1);
  }
}

applyRLS();
