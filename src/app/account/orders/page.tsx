"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Loader2,
  Calendar,
  CheckCircle,
  Clock,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  CreditCard,
  Truck,
  Download,
  ExternalLink,
} from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface Order {
  id: number;
  orderNumber: string;
  totalPrice: string;
  subtotal: string;
  shippingCost: string;
  status: string;
  createdAt: string;
  paymentStatus: string;
  paymentMethod: string;
  paymentReference: string;
  trackingNumber: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  shippingAddress: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  lineItems: any;
}

export default function AccountOrdersPage() {
  const supabase = createClient();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await fetch("/api/account/orders");
        if (res.ok) {
          const data = await res.json();
          setOrders(data.orders || []);
        }
      } catch (err) {
        console.error("Failed to load orders:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const toggleOrder = (orderId: number) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  const formatPrice = (amount: string | number) => {
    const num = parseFloat(amount.toString());
    return `₦${num.toLocaleString()}`;
  };

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

  if (loading) {
    return (
      <div className="py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mb-3" />
        <p className="text-muted-foreground text-sm">Loading order log...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-foreground">Order History</h2>
          <p className="text-muted-foreground text-sm">
            Track fulfillment status, review past designs, and fetch receipts.
          </p>
        </div>
        <div className="px-4 py-2 bg-card border border-border rounded-xl text-xs text-muted-foreground font-semibold flex items-center gap-1.5 w-fit">
          <ShoppingBag className="w-4 h-4 text-primary" />
          <span>{orders.length} orders placed</span>
        </div>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-card/45 backdrop-blur-md border border-border rounded-3xl p-8 max-w-xl mx-auto shadow-sm">
          <ShoppingBag className="w-16 h-16 text-muted-foreground opacity-30 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-foreground mb-2">
            No Orders Yet
          </h3>
          <p className="text-muted-foreground text-sm mb-6 max-w-sm mx-auto">
            Once you custom-design shirts, hoodies, mugs, or accessories, they
            will appear in this dashboard list.
          </p>
          <a href="/editor">
            <Button className="font-bold">Start Customizing</Button>
          </a>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedOrderId === order.id;
            const StatusStyle = getStatusStyle(order.status);
            const StatusIcon = StatusStyle.icon;
            
            // Format shipping address
            const addr = order.shippingAddress;
            const addressString = addr
              ? `${addr.address1 || ""}, ${addr.city || ""}, ${addr.province || ""} ${addr.zip || ""}, ${addr.country || ""}`
              : "No shipping address listed";

            const items = Array.isArray(order.lineItems) ? order.lineItems : [];

            return (
              <div
                key={order.id}
                className="bg-card/45 backdrop-blur-md border border-border rounded-2xl overflow-hidden shadow-xs hover:border-border/80 transition-colors"
              >
                {/* Accordion Trigger Header */}
                <div
                  onClick={() => toggleOrder(order.id)}
                  className="p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 cursor-pointer select-none bg-card/25"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                    <div>
                      <h4 className="font-bold text-foreground">
                        Order #{order.orderNumber || order.id}
                      </h4>
                      <span className="text-xs text-muted-foreground flex items-center gap-1.5 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(order.createdAt).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${StatusStyle.bg}`}
                      >
                        <StatusIcon className="w-3.5 h-3.5" />
                        {order.status.replace("_", " ")}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full md:w-auto justify-between md:justify-end">
                    <div className="text-left md:text-right">
                      <p className="text-lg font-black text-foreground">
                        {formatPrice(order.totalPrice)}
                      </p>
                      <span className="text-xs text-muted-foreground uppercase tracking-wide">
                        {items.length} {items.length === 1 ? "item" : "items"}
                      </span>
                    </div>
                    <div>
                      {isExpanded ? (
                        <ChevronUp className="w-5 h-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="w-5 h-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanding Details Section */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0 }}
                      animate={{ height: "auto" }}
                      exit={{ height: 0 }}
                      className="overflow-hidden border-t border-border/50"
                    >
                      <div className="p-6 space-y-6">
                        {/* Summary Details Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm">
                          {/* Shipping Address */}
                          <div className="space-y-2">
                            <h5 className="font-bold text-foreground flex items-center gap-2">
                              <MapPin className="w-4 h-4 text-primary" />
                              Shipping Address
                            </h5>
                            <p className="text-muted-foreground text-xs leading-relaxed">
                              {addressString}
                            </p>
                          </div>

                          {/* Payment logs */}
                          <div className="space-y-2">
                            <h5 className="font-bold text-foreground flex items-center gap-2">
                              <CreditCard className="w-4 h-4 text-primary" />
                              Payment details
                            </h5>
                            <div className="text-xs space-y-1 text-muted-foreground">
                              <p>
                                <span className="font-semibold text-foreground">
                                  Method:
                                </span>{" "}
                                {order.paymentMethod || "Crypto"}
                              </p>
                              <p className="truncate">
                                <span className="font-semibold text-foreground">
                                  Ref:
                                </span>{" "}
                                {order.paymentReference || "N/A"}
                              </p>
                              <p>
                                <span className="font-semibold text-foreground">
                                  Status:
                                </span>{" "}
                                <span className="font-bold text-primary">
                                  {order.paymentStatus}
                                </span>
                              </p>
                            </div>
                          </div>

                          {/* Tracking */}
                          <div className="space-y-2">
                            <h5 className="font-bold text-foreground flex items-center gap-2">
                              <Truck className="w-4 h-4 text-primary" />
                              Fulfillment & Tracking
                            </h5>
                            <div className="text-xs space-y-1 text-muted-foreground">
                              <p>
                                <span className="font-semibold text-foreground">
                                  Tracking ID:
                                </span>{" "}
                                {order.trackingNumber || "Not shipped yet"}
                              </p>
                              {order.trackingNumber && (
                                <a
                                  href={`https://track.ikonshop.com/${order.trackingNumber}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 mt-1 text-primary hover:underline font-bold"
                                >
                                  Live Tracking
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Order Line Items */}
                        <div className="space-y-3">
                          <h5 className="font-bold text-foreground text-sm uppercase tracking-wider mb-2">
                            Items Ordered
                          </h5>
                          {items.map((item: any, index: number) => {
                            const customDesign = item.uploaded_design_url;
                            const customMockup = item.mockup_url;

                            return (
                              <div
                                key={index}
                                className="p-4 rounded-xl border border-border/50 bg-card/20 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                              >
                                <div className="flex items-center gap-4">
                                  {/* Item Image (Mockup or Default) */}
                                  <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-muted border border-border shrink-0">
                                    <Image
                                      src={
                                        customMockup ||
                                        item.image ||
                                        "/placeholder-product.jpg"
                                      }
                                      alt={item.product_title || "Item Image"}
                                      width={64}
                                      height={64}
                                      className="w-full h-full object-cover"
                                    />
                                  </div>
                                  <div>
                                    <h6 className="font-bold text-foreground text-sm leading-snug">
                                      {item.product_title}
                                    </h6>
                                    <p className="text-xs text-muted-foreground mt-0.5">
                                      {item.variant_title}
                                    </p>
                                    <p className="text-xs text-muted-foreground mt-1">
                                      Quantity:{" "}
                                      <span className="font-bold text-foreground">
                                        {item.quantity || 1}
                                      </span>
                                    </p>
                                  </div>
                                </div>

                                <div className="flex flex-col items-start sm:items-end justify-between sm:justify-center gap-2">
                                  <p className="font-black text-foreground">
                                    {formatPrice(item.price)}
                                  </p>
                                  
                                  {/* Custom Print Download Badge */}
                                  {customDesign && (
                                    <a
                                      href={customDesign}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-[10px] font-bold bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 transition-all cursor-pointer mt-1"
                                    >
                                      <Download className="w-3.5 h-3.5" />
                                      Print Template
                                    </a>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
