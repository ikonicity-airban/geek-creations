"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Package,
  Mail,
  MapPin,
  Phone,
  CheckCircle,
  Clock,
  XCircle,
  Truck,
} from "lucide-react";
import type { ExtendedOrder, FulfillmentProvider } from "@/types/admin";
import { fulfillOrder } from "@/app/admin/orders/actions";
import Image from "next/image";

interface OrderDetailModalProps {
  order: ExtendedOrder;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onFulfillComplete: () => void;
}

export default function OrderDetailModal({
  order,
  open,
  onOpenChange,
  onFulfillComplete,
}: OrderDetailModalProps) {
  const [fulfilling, setFulfilling] = useState(false);
  const [fulfillError, setFulfillError] = useState<string | null>(null);

  const handleFulfill = async (provider: FulfillmentProvider) => {
    setFulfilling(true);
    setFulfillError(null);

    try {
      const result = await fulfillOrder(order.id, provider);
      if (result.success) {
        onFulfillComplete();
        onOpenChange(false);
      } else {
        setFulfillError(result.error || "Fulfillment failed");
      }
    } catch (error) {
      console.log("🚀 ~ handleFulfill ~ error:", error);
      setFulfillError((error as Error)?.message || "An error occurred");
    } finally {
      setFulfilling(false);
    }
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
    return `₦${num.toLocaleString("en-NG", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.shopify_order_id}</span>
            {getStatusBadge(order.status)}
          </DialogTitle>
          <DialogDescription>
            Order ID: {order.id} | Created:{" "}
            {new Date(order.created_at).toLocaleString("en-NG")}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 mt-4">
          {/* Customer Information */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3 flex items-center">
              <Mail className="w-5 h-5 mr-2" />
              Customer Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Email
                </p>
                <p className="font-medium">{order.customer_email || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Order Number
                </p>
                <p className="font-medium">{order.order_number || "N/A"}</p>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          {order.shipping_address && (
            <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <MapPin className="w-5 h-5 mr-2" />
                Shipping Address
              </h3>
              <div className="space-y-2">
                <p className="font-medium">
                  {order.shipping_address.first_name || ""}{" "}
                  {order.shipping_address.last_name || ""}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.shipping_address.address1}
                  {order.shipping_address.address2 &&
                    `, ${order.shipping_address.address2}`}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.shipping_address.city}
                  {order.shipping_address.province &&
                    `, ${order.shipping_address.province}`}
                  {order.shipping_address.zip &&
                    ` ${order.shipping_address.zip}`}
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {order.shipping_address.country}
                </p>
                {order.shipping_address.phone && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center mt-2">
                    <Phone className="w-4 h-4 mr-1" />
                    {order.shipping_address.phone}
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Order Items */}
          {order.items && order.items.length > 0 && (
            <div>
              <h3 className="font-semibold text-lg mb-3 flex items-center">
                <Package className="w-5 h-5 mr-2" />
                Order Items
              </h3>
              <div className="space-y-4">
                {order.items.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-4 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                  >
                    {item.design_preview_url && (
                      <Image
                        fill
                        src={item.design_preview_url}
                        alt={item.title}
                        className="w-20 h-20 rounded object-cover"
                      />
                    )}
                    <div className="flex-1">
                      <h4 className="font-medium">{item.title}</h4>
                      <div className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        <p>Quantity: {item.quantity}</p>
                        <p>Price: {formatPrice(item.price)}</p>
                        {item.sku && <p>SKU: {item.sku}</p>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-lg">
            <h3 className="font-semibold text-lg mb-3">Order Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Total
                </p>
                <p className="font-semibold text-lg">
                  {formatPrice(order.retail_price)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  POD Cost
                </p>
                <p className="font-semibold">{formatPrice(order.pod_cost)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Profit Margin
                </p>
                <p className="font-semibold text-green-600">
                  {formatPrice(order.profit_margin)}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Provider
                </p>
                <Badge variant="outline" className="capitalize">
                  {order.fulfillment_provider || "N/A"}
                </Badge>
              </div>
            </div>
            {order.tracking_number && (
              <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center">
                  <Truck className="w-4 h-4 mr-2" />
                  Tracking Number: {order.tracking_number}
                </p>
              </div>
            )}
          </div>

          {/* Fulfillment Actions */}
          {order.status === "pending" || order.status === "success" ? (
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
              <h3 className="font-semibold text-lg mb-3">Fulfill Order</h3>
              {fulfillError && (
                <div className="mb-3 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-sm text-red-600 dark:text-red-400">
                  {fulfillError}
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                <Button
                  variant="outline"
                  onClick={() => handleFulfill("printify")}
                  disabled={fulfilling}
                >
                  {fulfilling ? "Processing..." : "Fulfill with Printify"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleFulfill("printful")}
                  disabled={fulfilling}
                >
                  {fulfilling ? "Processing..." : "Fulfill with Printful"}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => handleFulfill("local_print")}
                  disabled={fulfilling}
                >
                  {fulfilling ? "Processing..." : "Mark Local Print"}
                </Button>
              </div>
            </div>
          ) : null}
        </div>
      </DialogContent>
    </Dialog>
  );
}
