"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, Package } from "lucide-react";
import { getOrderById } from "@/app/actions";
import { Button } from "@/lib/components/ui/button";
import { Badge } from "@/lib/components/ui/badge";
import { formatCurrency } from "@/lib/utils/format-currency";
import type { Order } from "@/db/schema";

export default function ConfirmationPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="h-64 bg-neutral-100 rounded-xl animate-pulse" />
        </div>
      }
    >
      <ConfirmationContent />
    </Suspense>
  );
}

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      getOrderById(Number(orderId))
        .then(setOrder)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16">
        <div className="h-64 bg-neutral-100 rounded-xl animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Order not found</h1>
        <Link href="/products">
          <Button variant="outline">Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  const address = order.shippingAddress as {
    fullName: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    zip: string;
  };

  const items = order.items as Array<{
    productId: number;
    title: string;
    priceCents: number;
    quantity: number;
    imageUrl: string;
  }>;

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="text-center mb-8">
        <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-neutral-900 mb-2">
          Order Confirmed!
        </h1>
        <p className="text-neutral-600">
          Order #{order.id} has been placed successfully.
        </p>
      </div>

      <div className="bg-neutral-50 rounded-xl p-6 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold">Items</h2>
            <Badge variant="success">{order.status}</Badge>
          </div>
          <div className="space-y-3">
            {items.map((item, i) => (
              <div key={i} className="flex gap-3">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="h-12 w-12 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium">{item.title}</p>
                  <p className="text-xs text-neutral-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency(item.priceCents * item.quantity)}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-4 space-y-1 text-sm">
          <div className="flex justify-between">
            <span className="text-neutral-600">Subtotal</span>
            <span>{formatCurrency(order.subTotalCents)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Shipping</span>
            <span>{formatCurrency(order.shippingCents)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-neutral-600">Tax</span>
            <span>{formatCurrency(order.taxCents)}</span>
          </div>
          <div className="flex justify-between font-semibold text-base pt-2 border-t border-neutral-200">
            <span>Total</span>
            <span>{formatCurrency(order.totalCents)}</span>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-4">
          <h3 className="text-sm font-semibold mb-1">Shipping to</h3>
          <p className="text-sm text-neutral-600">
            {address.fullName}
            <br />
            {address.line1}
            {address.line2 && (
              <>
                <br />
                {address.line2}
              </>
            )}
            <br />
            {address.city}, {address.state} {address.zip}
          </p>
        </div>
      </div>

      <div className="flex gap-4 mt-8 justify-center">
        <Link href="/account">
          <Button variant="outline">
            <Package className="h-4 w-4" />
            View Orders
          </Button>
        </Link>
        <Link href="/products">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
