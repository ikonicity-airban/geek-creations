import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { db } from "@/lib/db";
import { ordersLog } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";

export async function GET() {
  try {
    const cookieStore = await cookies();
    const supabase = createClient(cookieStore);

    // Get user session securely on the server
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user || !user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Query Drizzle DB for orders matching this user's email address
    const orders = await db
      .select()
      .from(ordersLog)
      .where(eq(ordersLog.customerEmail, user.email))
      .orderBy(desc(ordersLog.createdAt));

    return NextResponse.json({ orders });
  } catch (error: any) {
    console.error("[GET /api/account/orders] Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch orders" },
      { status: 500 }
    );
  }
}
