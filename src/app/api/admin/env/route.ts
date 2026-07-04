import { cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

// Verify if the user is an admin authenticated in Supabase
async function verifyAdmin(): Promise<
  | { supabase: ReturnType<typeof createClient>; user: any; error?: never; status?: never }
  | { error: string; status: number; supabase?: never; user?: never }
> {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);
  
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) {
    return { error: "Unauthorized", status: 401 };
  }

  const email = user.email || "";
  const isAdmin =
    email.endsWith("@geekcreations.com") ||
    email.endsWith("@codeoven.tech") ||
    email === "admin@geekscreation.com";

  if (!isAdmin) {
    return { error: "Forbidden", status: 403 };
  }

  return { supabase, user };
}

export async function GET() {
  try {
    const auth = await verifyAdmin();
    if (!auth.supabase) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const supabase = auth.supabase;

    // 1. Read from local .env.local file if it exists
    const envLocalPath = path.resolve(process.cwd(), ".env.local");
    const localEnv: Record<string, string> = {};
    if (fs.existsSync(envLocalPath)) {
      const content = fs.readFileSync(envLocalPath, "utf-8");
      content.split("\n").forEach((line) => {
        const trimmed = line.trim();
        if (!trimmed || trimmed.startsWith("#")) return;
        const index = trimmed.indexOf("=");
        if (index > 0) {
          const key = trimmed.substring(0, index).trim();
          const value = trimmed.substring(index + 1).trim().replace(/^['"]|['"]$/g, "");
          localEnv[key] = value;
        }
      });
    }

    // 2. Read from database using Supabase client (bypasses Drizzle server connection issue if DATABASE_URL is missing)
    const { data: dbVars, error: dbError } = await supabase
      .from("env_variables")
      .select("*");

    if (dbError) {
      console.error("Error fetching db variables:", dbError);
    }

    // Standard list of environment variables used in the system
    const standardKeys = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
      "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY",
      "DATABASE_URL",
      "SUPABASE_SERVICE_ROLE_KEY",
      "SHOPIFY_STORE_DOMAIN",
      "SHOPIFY_ACCESS_TOKEN",
      "SHOPIFY_WEBHOOK_SECRET",
      "PRINTFUL_API_KEY",
      "PRINTIFY_API_KEY",
      "IKONSHOP_API_KEY",
      "NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY",
      "PAYSTACK_SECRET_KEY",
      "NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY",
      "FLUTTERWAVE_SECRET_KEY",
      "NEXT_PUBLIC_MONNIFY_API_KEY",
      "MONNIFY_SECRET_KEY",
    ];

    const merged: Record<string, { value: string; isSecret: boolean; description: string; source: "local" | "db" | "both" | "missing" }> = {};

    // Initialize standard keys
    standardKeys.forEach((key) => {
      merged[key] = {
        value: "",
        isSecret: !key.startsWith("NEXT_PUBLIC_"),
        description: `System environment variable: ${key}`,
        source: "missing",
      };
    });

    // Populate with database entries
    if (dbVars) {
      dbVars.forEach((row: any) => {
        merged[row.key] = {
          value: row.value || "",
          isSecret: row.is_secret ?? !row.key.startsWith("NEXT_PUBLIC_"),
          description: row.description || `System environment variable: ${row.key}`,
          source: "db",
        };
      });
    }

    // Merge in/override with local env variables
    Object.entries(localEnv).forEach(([key, value]) => {
      const isSecret = !key.startsWith("NEXT_PUBLIC_");
      const existing = merged[key];
      merged[key] = {
        value,
        isSecret: existing ? existing.isSecret : isSecret,
        description: existing ? existing.description : `System environment variable: ${key}`,
        source: existing && existing.source === "db" ? "both" : "local",
      };
    });

    const variables = Object.entries(merged).map(([key, data]) => ({
      key,
      ...data,
    }));

    return NextResponse.json({ variables });
  } catch (error: any) {
    console.error("API GET env error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyAdmin();
    if (!auth.supabase) {
      return NextResponse.json({ error: auth.error }, { status: auth.status });
    }

    const supabase = auth.supabase;
    const body = await request.json();
    const { variables } = body;

    if (!Array.isArray(variables)) {
      return NextResponse.json({ error: "Invalid body format" }, { status: 400 });
    }

    // 1. Update database table via Supabase client
    const upsertRows = variables.map((v) => ({
      key: v.key,
      value: v.value || "",
      description: v.description || `System environment variable: ${v.key}`,
      is_secret: v.isSecret ?? !v.key.startsWith("NEXT_PUBLIC_"),
      updated_at: new Date().toISOString(),
    }));

    const { error: dbError } = await supabase
      .from("env_variables")
      .upsert(upsertRows, { onConflict: "key" });

    if (dbError) {
      console.error("Error upserting DB variables:", dbError);
      return NextResponse.json({ error: dbError.message }, { status: 500 });
    }

    // 2. Rewrite .env.local locally
    const envLocalPath = path.resolve(process.cwd(), ".env.local");
    let fileContent = `# Environment variables synced from Admin Panel\n# Last updated: ${new Date().toLocaleString()}\n\n`;

    variables.forEach((v) => {
      if (v.value !== undefined && v.value !== null) {
        const needsQuotes = /[\s#"'=$]/.test(v.value);
        const formattedValue = needsQuotes ? `"${v.value.replace(/"/g, '\\"')}"` : v.value;
        fileContent += `# ${v.description || v.key}\n${v.key}=${formattedValue}\n\n`;
      }
    });

    try {
      fs.writeFileSync(envLocalPath, fileContent, "utf-8");
    } catch (fsError: any) {
      console.error("Failed to write to .env.local:", fsError);
      return NextResponse.json({
        success: true,
        warning: "Database updated, but local .env.local file could not be updated: " + fsError.message
      });
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("API POST env error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
