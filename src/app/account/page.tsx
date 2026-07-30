"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ShoppingBag,
  Sparkles,
  Calendar,
  ArrowRight,
  Clock,
  CheckCircle,
  CreditCard,
  AlertCircle,
  FileText,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/lib/theme-context";

interface Order {
  id: number;
  orderNumber: string;
  totalPrice: string;
  status: string;
  createdAt: string;
  paymentStatus: string;
  paymentMethod: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lineItems: any;
}

export default function AccountPage() {
  const { darkMode } = useTheme();
  const supabase = createClient();
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  useEffect(() => {
    async function loadData() {
      // Get user session
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        try {
          const res = await fetch("/api/account/orders");
          if (res.ok) {
            const data = await res.json();
            setOrders(data.orders || []);
          }
        } catch (err) {
          console.error("Failed to load orders:", err);
        } finally {
          setLoadingOrders(false);
        }
      }
    }
    loadData();
  }, [supabase]);

  if (!user) return null;

  const displayName = user.user_metadata?.display_name || user.email || "Geek User";
  const recentOrders = orders.slice(0, 2);

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  // Helper to format currency
  const formatPrice = (amount: string | number) => {
    const num = parseFloat(amount.toString());
    return `₦${num.toLocaleString()}`;
  };

  // Helper for order status styling
  const getStatusStyle = (status: string) => {
    switch (status.toLowerCase()) {
      case "fulfilled":
      case "shipped":
        return {
          bg: "bg-green-500/10 text-green-500 border-green-500/20",
          icon: CheckCircle,
        };
      case "pending":
      case "processing":
      case "pending_payment":
        return {
          bg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          icon: Clock,
        };
      default:
        return {
          bg: "bg-blue-500/10 text-blue-500 border-blue-500/20",
          icon: AlertCircle,
        };
    }
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className="space-y-8"
    >
      {/* Welcome Banner */}
      <motion.div
        variants={itemVariants}
        className="bg-card/50 backdrop-blur-md border border-border p-8 rounded-3xl flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-md"
      >
        <div>
          <h2 className="text-3xl font-black text-foreground mb-2">
            Welcome back, <span className="text-primary">{displayName}</span>!
          </h2>
          <p className="text-muted-foreground text-sm">
            Control your printing orders, custom mockups, and profile parameters.
          </p>
        </div>
        <Link href="/editor">
          <Button className="font-bold flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-md">
            <Sparkles className="w-4 h-4 fill-current" />
            Launch Designer
          </Button>
        </Link>
      </motion.div>

      {/* Grid Stats */}
      <motion.div
        variants={itemVariants}
        className="grid grid-cols-1 sm:grid-cols-3 gap-6"
      >
        {/* Stat 1 */}
        <div className="bg-card/45 backdrop-blur-md border border-border p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Total Orders
            </p>
            <h4 className="text-2xl font-black text-foreground">
              {loadingOrders ? "..." : orders.length}
            </h4>
          </div>
        </div>

        {/* Stat 2 */}
        <div className="bg-card/45 backdrop-blur-md border border-border p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-yellow-500/10 text-yellow-500 flex items-center justify-center">
            <Calendar className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Member Since
            </p>
            <h4 className="text-base font-bold text-foreground">
              {new Date(user.created_at).toLocaleDateString("en-US", {
                month: "short",
                year: "numeric",
              })}
            </h4>
          </div>
        </div>

        {/* Stat 3 */}
        <div className="bg-card/45 backdrop-blur-md border border-border p-6 rounded-2xl flex items-center gap-4 shadow-sm">
          <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">
              Default Currency
            </p>
            <h4 className="text-2xl font-black text-foreground">NGN (₦)</h4>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Recent Activity List */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-8 bg-card/45 backdrop-blur-md border border-border p-6 rounded-3xl shadow-sm"
        >
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-foreground">Recent Orders</h3>
            <Link
              href="/account/orders"
              className="text-xs font-bold text-primary hover:underline flex items-center gap-1"
            >
              View all orders
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loadingOrders ? (
            <div className="py-12 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="text-center py-12 px-4 border border-dashed border-border rounded-2xl bg-card/20">
              <ShoppingBag className="w-12 h-12 text-muted-foreground opacity-30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground mb-4">
                You haven&apos;t placed any orders yet.
              </p>
              <Link href="/collections/all">
                <Button variant="outline" size="sm" className="font-semibold">
                  Shop Best Sellers
                </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {recentOrders.map((order) => {
                const StatusStyle = getStatusStyle(order.status);
                const StatusIcon = StatusStyle.icon;
                const itemsCount =
                  order.lineItems && Array.isArray(order.lineItems)
                    ? order.lineItems.length
                    : 1;

                return (
                  <div
                    key={order.id}
                    className="p-4 rounded-xl border border-border/70 hover:border-border transition-colors flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-card/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-bold text-sm text-foreground">
                          Order #{order.orderNumber || order.id}
                        </p>
                        <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                          <span>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span>•</span>
                          <span>
                            {itemsCount} {itemsCount === 1 ? "item" : "items"}
                          </span>
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
                      <div className="text-left sm:text-right">
                        <p className="font-black text-foreground">
                          {formatPrice(order.totalPrice)}
                        </p>
                        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
                          {order.paymentMethod || "Crypto"}
                        </span>
                      </div>

                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${StatusStyle.bg}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {order.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Custom Editor launch widget */}
        <motion.div
          variants={itemVariants}
          className="lg:col-span-4 space-y-6"
        >
          <div className="bg-linear-to-br from-indigo-950 via-purple-950 to-purple-900 border border-purple-500/25 p-6 rounded-3xl text-white shadow-lg overflow-hidden relative group">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-2xl group-hover:bg-purple-500/20 transition-colors" />
            <h3 className="text-xl font-black mb-3 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              Customizer Panel
            </h3>
            <p className="text-purple-200 text-xs leading-relaxed mb-6">
              Create exclusive coding, tech, or anime tees, hoodies, bags, mugs, and phone cases. Design on a 3D canvas and order instantly.
            </p>
            <Link href="/editor" className="block w-full">
              <Button
                className="w-full bg-white text-purple-950 hover:bg-purple-50 font-black shadow-lg"
                style={{
                  borderRadius: "12px",
                }}
              >
                Launch Editor
              </Button>
            </Link>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
