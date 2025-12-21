"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Search,
  RefreshCw,
  Eye,
} from "lucide-react";
import { motion } from "framer-motion";
import type { ExtendedOrder, OrderStats, FulfillmentProvider } from "@/types/admin";
import { fulfillOrder, bulkFulfillOrders, getOrders, getOrderStats } from "@/app/admin/orders/actions";
import OrderDetailModal from "./OrderDetailModal";

interface OrdersTableClientProps {
  initialOrders: ExtendedOrder[];
  initialStats: OrderStats;
}

type ShippingFilter = "all" | "nigeria" | "international";

export default function OrdersTableClient({
  initialOrders,
  initialStats,
}: OrdersTableClientProps) {
  const [orders, setOrders] = useState<ExtendedOrder[]>(initialOrders);
  const [stats, setStats] = useState<OrderStats>(initialStats);
  const [filteredOrders, setFilteredOrders] = useState<ExtendedOrder[]>(initialOrders);
  const [selectedOrders, setSelectedOrders] = useState<Set<number>>(new Set());
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [shippingFilter, setShippingFilter] = useState<ShippingFilter>("all");
  const [selectedOrder, setSelectedOrder] = useState<ExtendedOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const supabase = createClient();

  // Real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("orders_changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "orders_log",
        },
        () => {
          refreshOrders();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [supabase]);

  const refreshOrders = useCallback(async () => {
    setLoading(true);
    try {
      const [newOrders, newStats] = await Promise.all([
        getOrders(),
        getOrderStats(),
      ]);
      setOrders(newOrders);
      setStats(newStats);
    } catch (error) {
      console.error("Error refreshing orders:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Filter orders
  useEffect(() => {
    let filtered = [...orders];

    // Search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (o) =>
          o.order_number?.toLowerCase().includes(term) ||
          o.customer_email?.toLowerCase().includes(term) ||
          o.shopify_order_id.toString().includes(term) ||
          o.id.toString().includes(term)
      );
    }

    // Shipping filter
    if (shippingFilter === "nigeria") {
      filtered = filtered.filter(
        (o) => o.shipping_country?.toUpperCase() === "NG"
      );
    } else if (shippingFilter === "international") {
      filtered = filtered.filter(
        (o) => o.shipping_country?.toUpperCase() !== "NG"
      );
    }

    setFilteredOrders(filtered);
  }, [orders, searchTerm, shippingFilter]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(new Set(filteredOrders.map((o) => o.id)));
    } else {
      setSelectedOrders(new Set());
    }
  };

  const handleSelectOrder = (orderId: number, checked: boolean) => {
    const newSelected = new Set(selectedOrders);
    if (checked) {
      newSelected.add(orderId);
    } else {
      newSelected.delete(orderId);
    }
    setSelectedOrders(newSelected);
  };

  const handleBulkFulfill = async (provider: FulfillmentProvider) => {
    if (selectedOrders.size === 0) return;

    setLoading(true);
    try {
      const orderIds = Array.from(selectedOrders);
      const results = await bulkFulfillOrders(orderIds, provider);
      
      // Show results
      const successCount = results.filter((r) => r.success).length;
      const failCount = results.filter((r) => !r.success).length;
      
      alert(
        `Fulfillment completed: ${successCount} succeeded, ${failCount} failed`
      );
      
      // Refresh orders
      await refreshOrders();
      setSelectedOrders(new Set());
    } catch (error) {
      console.error("Error bulk fulfilling orders:", error);
      alert("Error fulfilling orders. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleViewOrder = (order: ExtendedOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "success":
        return (
          <Badge className="bg-green-500 hover:bg-green-600">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-500 hover:bg-yellow-600">
            <Clock className="w-3 h-3 mr-1" />
            Pending
          </Badge>
        );
      case "shipped":
        return (
          <Badge className="bg-blue-500 hover:bg-blue-600">
            <Package className="w-3 h-3 mr-1" />
            Fulfilled
          </Badge>
        );
      case "failed":
      case "error":
        return (
          <Badge className="bg-red-500 hover:bg-red-600">
            <XCircle className="w-3 h-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const formatPrice = (price: number | string | null | undefined) => {
    const num = typeof price === "string" ? parseFloat(price) : price || 0;
    return `₦${num.toLocaleString("en-NG", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };

  return (
    <>
      {/* Stats Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 mb-6 md:mb-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Total Orders
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.totalOrders}
              </p>
            </div>
            <Package className="w-8 h-8 md:w-10 md:h-10 text-indigo-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Pending
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {stats.pendingOrders}
              </p>
            </div>
            <Clock className="w-8 h-8 md:w-10 md:h-10 text-yellow-600" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700"
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Revenue Today
              </p>
              <p className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">
                {formatPrice(stats.revenueToday)}
              </p>
            </div>
            <DollarSign className="w-8 h-8 md:w-10 md:h-10 text-green-600" />
          </div>
        </motion.div>
      </div>

      {/* Filters and Actions */}
      <div className="bg-white dark:bg-gray-800 p-4 md:p-6 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 mb-4 md:mb-6">
        <div className="flex flex-col gap-4">
          {/* Search and Filters Row */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by order ID, email, or Shopify order..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {(["all", "nigeria", "international"] as ShippingFilter[]).map(
                (filter) => (
                  <Button
                    key={filter}
                    variant={
                      shippingFilter === filter ? "default" : "outline"
                    }
                    onClick={() => setShippingFilter(filter)}
                    size="sm"
                    className="capitalize"
                  >
                    {filter === "all"
                      ? "All"
                      : filter === "nigeria"
                      ? "Nigeria"
                      : "International"}
                  </Button>
                )
              )}
            </div>

            <Button
              variant="outline"
              onClick={refreshOrders}
              size="sm"
              disabled={loading}
            >
              <RefreshCw
                className={`w-4 h-4 mr-2 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
          </div>

          {/* Bulk Actions */}
          {selectedOrders.size > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="flex flex-wrap gap-2 pt-4 border-t border-gray-200 dark:border-gray-700"
            >
              <span className="text-sm text-gray-600 dark:text-gray-400 self-center">
                {selectedOrders.size} selected:
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkFulfill("printify")}
                disabled={loading}
              >
                Fulfill with Printify
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkFulfill("printful")}
                disabled={loading}
              >
                Fulfill with Printful
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleBulkFulfill("local_print")}
                disabled={loading}
              >
                Mark Local Print
              </Button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">
                  <Checkbox
                    checked={
                      filteredOrders.length > 0 &&
                      selectedOrders.size === filteredOrders.length
                    }
                    onCheckedChange={handleSelectAll}
                  />
                </TableHead>
                <TableHead>Order ID</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Shipping</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="w-20">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredOrders.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-12">
                    <Package className="w-16 h-16 mx-auto text-gray-400 mb-4" />
                    <p className="text-gray-500 dark:text-gray-400">
                      No orders found
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                filteredOrders.map((order) => (
                  <TableRow
                    key={order.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                  >
                    <TableCell>
                      <Checkbox
                        checked={selectedOrders.has(order.id)}
                        onCheckedChange={(checked) =>
                          handleSelectOrder(order.id, checked === true)
                        }
                        onClick={(e) => e.stopPropagation()}
                      />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        #{order.shopify_order_id}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {order.id}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600 dark:text-gray-400">
                      {new Date(order.created_at).toLocaleDateString("en-NG", {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-900 dark:text-white">
                        {order.customer_email || "N/A"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {order.items && order.items.length > 0 ? (
                          <>
                            <span className="text-sm text-gray-900 dark:text-white">
                              {order.items.length} item
                              {order.items.length !== 1 ? "s" : ""}
                            </span>
                            {order.items[0]?.design_preview_url && (
                              <img
                                src={order.items[0].design_preview_url}
                                alt="Design preview"
                                className="w-10 h-10 rounded object-cover"
                              />
                            )}
                          </>
                        ) : (
                          <span className="text-sm text-gray-400">N/A</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm font-semibold text-gray-900 dark:text-white">
                      {formatPrice(order.retail_price)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {order.shipping_city || "N/A"}
                        {order.shipping_city && order.shipping_country && ", "}
                        {order.shipping_country || ""}
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleViewOrder(order)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <OrderDetailModal
          order={selectedOrder}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
          onFulfillComplete={refreshOrders}
        />
      )}
    </>
  );
}

