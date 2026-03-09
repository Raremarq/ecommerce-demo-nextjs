"use client";

import { useEffect, useState } from "react";
import { Package, User } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth";
import { getOrdersByUserId } from "@/app/actions";
import { Button } from "@/lib/components/ui/button";
import { Badge } from "@/lib/components/ui/badge";
import { EmptyState } from "@/lib/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils/format-currency";
import Link from "next/link";
import type { Order } from "@/db/schema";

const statusVariants: Record<string, "default" | "success" | "warning"> = {
  PENDING: "warning",
  CONFIRMED: "default",
  SHIPPED: "default",
  DELIVERED: "success",
};

export default function AccountPage() {
  const { currentUser, openAuthModal } = useAuthStore();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (currentUser) {
      getOrdersByUserId(currentUser.id)
        .then(setOrders)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={User}
          title="Sign in to view your account"
          description="You need to be signed in to see your order history"
          action={<Button onClick={openAuthModal}>Sign In</Button>}
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <div className="flex items-center gap-4">
          {currentUser.avatarUrl && (
            <img
              src={currentUser.avatarUrl}
              alt={currentUser.name}
              className="h-16 w-16 rounded-full"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold">{currentUser.name}</h1>
            <p className="text-neutral-500">{currentUser.email}</p>
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-4">Order History</h2>

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 bg-neutral-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <EmptyState
          icon={Package}
          title="No orders yet"
          description="Your order history will appear here"
          action={
            <Link href="/products">
              <Button>Start Shopping</Button>
            </Link>
          }
        />
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const items = order.items as Array<{
              title: string;
              quantity: number;
              priceCents: number;
              imageUrl: string;
            }>;
            return (
              <div
                key={order.id}
                className="border border-neutral-200 rounded-xl p-4"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-semibold">Order #{order.id}</span>
                    <Badge variant={statusVariants[order.status] ?? "default"}>
                      {order.status}
                    </Badge>
                  </div>
                  <span className="font-semibold">
                    {formatCurrency(order.totalCents)}
                  </span>
                </div>
                <div className="flex gap-2 overflow-x-auto">
                  {items.map((item, i) => (
                    <img
                      key={i}
                      src={item.imageUrl}
                      alt={item.title}
                      title={`${item.title} x${item.quantity}`}
                      className="h-12 w-12 object-cover rounded-md shrink-0"
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
