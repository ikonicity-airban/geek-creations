import postgres from "postgres";

async function testConnection() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    console.error("❌ DATABASE_URL environment variable is not set");
    process.exit(1);
  }

  console.log("🔍 Testing database connection...");
  console.log(
    "📍 Connection string:",
    connectionString.replace(/:[^:@]+@/, ":****@")
  ); // Hide password

  try {
    // Parse the connection string to extract hostname
    const url = new URL(connectionString.replace("postgresql://", "https://"));
    const hostname = url.hostname;

    console.log("🌐 Hostname:", hostname);

    // Try to create a connection
    const sql = postgres(connectionString, {
      max: 1,
      connect_timeout: 10,
    });

    console.log("⏳ Attempting to connect...");
    const result =
      await sql`SELECT version() as version, current_database() as database`;

    console.log("✅ Connection successful!");
    console.log("📊 Database:", result[0].database);
    console.log("🔢 PostgreSQL version:", result[0].version);

    await sql.end();
    process.exit(0);
  } catch (error) {
    const err = error as { message?: string; code?: string };
    console.error("❌ Connection failed:");
    console.error("   Error:", err.message || String(error));
    console.error("   Code:", err.code);

    if (err.code === "ENOTFOUND") {
      console.error("\n💡 DNS resolution failed. Possible issues:");
      console.error(
        "   1. The hostname in your connection string is incorrect"
      );
      console.error("   2. Your Supabase project might be paused or deleted");
      console.error(
        "   3. You might need to use the connection pooler URL instead"
      );
      console.error("\n📝 To fix:");
      console.error("   - Go to your Supabase dashboard");
      console.error("   - Settings → Database → Connection Pooling");
      console.error('   - Copy the "Connection string" (URI format)');
      console.error("   - Update your .env file with the new DATABASE_URL");
    }

    process.exit(1);
  }
}

testConnection();
