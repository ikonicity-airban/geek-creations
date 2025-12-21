import { getOrders, getOrderStats } from "./actions";
import OrdersTableClient from "@/components/admin/OrdersTableClient";

export default async function AdminOrdersPage() {
  // Fetch initial data server-side
  const [orders, stats] = await Promise.all([getOrders(), getOrderStats()]);

  return (
    <div className="flex flex-1 flex-col overflow-y-auto bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto w-full p-4 md:p-6">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h4 className="text-3xl md:text-4xl font-black text-gray-900 dark:text-white mb-2">
            Orders Dashboard
          </h4>
          <p className="text-gray-600 dark:text-gray-400">
            Geek Creations POD Store — Admin Panel
          </p>
        </div>

        {/* Client component handles all interactive features */}
        <OrdersTableClient initialOrders={orders} initialStats={stats} />
      </div>
    </div>
  );
}
