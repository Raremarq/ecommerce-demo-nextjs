"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth";
import { useToastStore } from "@/lib/stores/toast";
import { getCartItems, createOrder } from "@/app/actions";
import { Button } from "@/lib/components/ui/button";
import { EmptyState } from "@/lib/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils/format-currency";
import Link from "next/link";

type CartItemWithProduct = Awaited<ReturnType<typeof getCartItems>>[number];

export default function CheckoutPage() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const openAuthModal = useAuthStore((s) => s.openAuthModal);
  const toast = useToastStore();
  const [items, setItems] = useState<CartItemWithProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    fullName: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    zip: "",
  });

  useEffect(() => {
    if (currentUser) {
      getCartItems(currentUser.id)
        .then(setItems)
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const subtotal = items.reduce(
    (sum, item) => sum + item.product.priceCents * item.quantity,
    0
  );
  const shipping = 599;
  const tax = Math.round(subtotal * 0.08);
  const total = subtotal + shipping + tax;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser) return;

    setSubmitting(true);
    try {
      const order = await createOrder(currentUser.id, {
        ...form,
        country: "US",
      });
      toast.success("Order placed successfully!");
      router.push(`/checkout/confirmation?orderId=${order.id}`);
    } catch (err) {
      toast.error("Failed to place order");
      setSubmitting(false);
    }
  }

  if (!currentUser) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Sign in to checkout"
          description="You need to be signed in to place an order"
          action={<Button onClick={openAuthModal}>Sign In</Button>}
        />
      </div>
    );
  }

  if (!loading && items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <EmptyState
          icon={ShoppingBag}
          title="Your cart is empty"
          description="Add some products before checking out"
          action={
            <Link href="/products">
              <Button>Browse Products</Button>
            </Link>
          }
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-neutral-900 mb-8">Checkout</h1>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <h2 className="text-lg font-semibold mb-2">Shipping Address</h2>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Full Name
            </label>
            <input
              required
              value={form.fullName}
              onChange={(e) =>
                setForm((f) => ({ ...f, fullName: e.target.value }))
              }
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Address Line 1
            </label>
            <input
              required
              value={form.line1}
              onChange={(e) =>
                setForm((f) => ({ ...f, line1: e.target.value }))
              }
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Address Line 2
            </label>
            <input
              value={form.line2}
              onChange={(e) =>
                setForm((f) => ({ ...f, line2: e.target.value }))
              }
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                City
              </label>
              <input
                required
                value={form.city}
                onChange={(e) =>
                  setForm((f) => ({ ...f, city: e.target.value }))
                }
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-1">
                State
              </label>
              <input
                required
                value={form.state}
                onChange={(e) =>
                  setForm((f) => ({ ...f, state: e.target.value }))
                }
                className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <div className="w-1/2">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              ZIP Code
            </label>
            <input
              required
              value={form.zip}
              onChange={(e) =>
                setForm((f) => ({ ...f, zip: e.target.value }))
              }
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full mt-6"
            loading={submitting}
          >
            Place Order
          </Button>
        </form>

        {/* Summary */}
        <div className="bg-neutral-50 rounded-xl p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex gap-3">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="h-12 w-12 object-cover rounded-md"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">
                    {item.product.title}
                  </p>
                  <p className="text-xs text-neutral-500">
                    Qty: {item.quantity}
                  </p>
                </div>
                <span className="text-sm font-medium">
                  {formatCurrency(item.product.priceCents * item.quantity)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-neutral-200 pt-3 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-neutral-600">Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Shipping</span>
              <span>{formatCurrency(shipping)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-neutral-600">Tax (8%)</span>
              <span>{formatCurrency(tax)}</span>
            </div>
            <div className="border-t border-neutral-200 pt-2">
              <div className="flex justify-between font-semibold text-base">
                <span>Total</span>
                <span>{formatCurrency(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
