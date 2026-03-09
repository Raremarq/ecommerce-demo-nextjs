"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Plus, Pencil, Shield } from "lucide-react";
import { useAuthStore } from "@/lib/stores/auth";
import { getAllProducts } from "@/app/actions";
import { Button } from "@/lib/components/ui/button";
import { Badge } from "@/lib/components/ui/badge";
import { EmptyState } from "@/lib/components/ui/empty-state";
import { formatCurrency } from "@/lib/utils/format-currency";
import type { Product } from "@/db/schema";

const statusVariants: Record<string, "success" | "warning" | "default"> = {
  ACTIVE: "success",
  DRAFT: "warning",
  ARCHIVED: "default",
};

export default function AdminPage() {
  const currentUser = useAuthStore((s) => s.currentUser);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllProducts()
      .then(setProducts)
      .finally(() => setLoading(false));
  }, []);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon={Shield}
          title="Admin access required"
          description="Sign in as an admin user to manage products"
        />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Link href="/admin/products/new">
          <Button>
            <Plus className="h-4 w-4" />
            New Product
          </Button>
        </Link>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-16 bg-neutral-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 text-left text-sm text-neutral-500">
                <th className="pb-3 font-medium">Product</th>
                <th className="pb-3 font-medium">Category</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Stock</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="border-b border-neutral-100 hover:bg-neutral-50"
                >
                  <td className="py-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={product.imageUrl}
                        alt={product.title}
                        className="h-10 w-10 object-cover rounded"
                      />
                      <span className="font-medium text-sm">
                        {product.title}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 text-sm text-neutral-600">
                    {product.category}
                  </td>
                  <td className="py-3 text-sm">
                    {formatCurrency(product.priceCents)}
                  </td>
                  <td className="py-3 text-sm">{product.stock}</td>
                  <td className="py-3">
                    <Badge variant={statusVariants[product.status] ?? "default"}>
                      {product.status}
                    </Badge>
                  </td>
                  <td className="py-3">
                    <Link href={`/admin/products/${product.id}`}>
                      <Button variant="ghost" size="sm">
                        <Pencil className="h-4 w-4" />
                        Edit
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
