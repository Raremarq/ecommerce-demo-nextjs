"use client";

import { Suspense, useState, useEffect } from "react";
import { getProducts, getCategories } from "@/app/actions";
import { ProductGrid } from "@/lib/components/products/product-grid";
import { CategoryFilter } from "@/lib/components/products/category-filter";
import { useSearchParams } from "next/navigation";
import type { Product } from "@/db/schema";

export default function ProductsPage() {
  return (
    <Suspense
      fallback={
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="h-8 bg-neutral-100 rounded w-48 mb-8 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="rounded-xl border border-neutral-200 overflow-hidden"
              >
                <div className="aspect-square bg-neutral-100 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                  <div className="h-6 bg-neutral-100 rounded w-1/3 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialCategory = searchParams.get("category");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(
    initialCategory
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    setLoading(true);
    getProducts(selectedCategory ?? undefined)
      .then(setProducts)
      .finally(() => setLoading(false));
  }, [selectedCategory]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-neutral-900 mb-4">Products</h1>
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="rounded-xl border border-neutral-200 overflow-hidden"
            >
              <div className="aspect-square bg-neutral-100 animate-pulse" />
              <div className="p-4 space-y-2">
                <div className="h-4 bg-neutral-100 rounded animate-pulse" />
                <div className="h-6 bg-neutral-100 rounded w-1/3 animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
