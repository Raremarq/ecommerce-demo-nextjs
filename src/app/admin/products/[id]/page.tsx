"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth";
import { useToastStore } from "@/lib/stores/toast";
import { getProductById, updateProduct, createAuction } from "@/app/actions";
import { Button } from "@/lib/components/ui/button";
import { Shield, Gavel } from "lucide-react";
import { EmptyState } from "@/lib/components/ui/empty-state";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const toast = useToastStore();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [creatingAuction, setCreatingAuction] = useState(false);
  const [auctionUrl, setAuctionUrl] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    slug: "",
    description: "",
    priceDollars: "",
    compareAtPriceDollars: "",
    category: "",
    imageUrl: "",
    stock: "0",
    featured: false,
    status: "ACTIVE" as "ACTIVE" | "DRAFT" | "ARCHIVED",
  });

  useEffect(() => {
    getProductById(Number(id)).then((product) => {
      if (product) {
        setForm({
          title: product.title,
          slug: product.slug,
          description: product.description,
          priceDollars: (product.priceCents / 100).toFixed(2),
          compareAtPriceDollars: product.compareAtPriceCents
            ? (product.compareAtPriceCents / 100).toFixed(2)
            : "",
          category: product.category,
          imageUrl: product.imageUrl,
          stock: String(product.stock),
          featured: product.featured ?? false,
          status: product.status,
        });
      }
      setAuctionUrl(product?.auctionUrl ?? null);
      setLoading(false);
    });
  }, [id]);

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon={Shield}
          title="Admin access required"
          description="Sign in as an admin user to edit products"
        />
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await updateProduct(Number(id), {
        title: form.title,
        slug: form.slug,
        description: form.description,
        priceCents: Math.round(Number(form.priceDollars) * 100),
        compareAtPriceCents: form.compareAtPriceDollars
          ? Math.round(Number(form.compareAtPriceDollars) * 100)
          : null,
        category: form.category,
        imageUrl: form.imageUrl,
        stock: Number(form.stock),
        featured: form.featured,
        status: form.status,
      });
      toast.success("Product updated");
      router.push("/admin");
    } catch {
      toast.error("Failed to update product");
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-10 bg-neutral-100 rounded-lg animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Title
          </label>
          <input
            required
            value={form.title}
            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Slug
          </label>
          <input
            required
            value={form.slug}
            onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
            className={inputClass}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Description
          </label>
          <textarea
            required
            rows={4}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Price ($)
            </label>
            <input
              required
              type="number"
              step="0.01"
              min="0"
              value={form.priceDollars}
              onChange={(e) =>
                setForm((f) => ({ ...f, priceDollars: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Compare at Price ($)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.compareAtPriceDollars}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  compareAtPriceDollars: e.target.value,
                }))
              }
              className={inputClass}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Category
            </label>
            <input
              required
              value={form.category}
              onChange={(e) =>
                setForm((f) => ({ ...f, category: e.target.value }))
              }
              className={inputClass}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Stock
            </label>
            <input
              required
              type="number"
              min="0"
              value={form.stock}
              onChange={(e) =>
                setForm((f) => ({ ...f, stock: e.target.value }))
              }
              className={inputClass}
            />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-neutral-700 mb-1">
            Image URL
          </label>
          <input
            required
            value={form.imageUrl}
            onChange={(e) =>
              setForm((f) => ({ ...f, imageUrl: e.target.value }))
            }
            className={inputClass}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Status
            </label>
            <select
              value={form.status}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  status: e.target.value as typeof form.status,
                }))
              }
              className={inputClass}
            >
              <option value="ACTIVE">Active</option>
              <option value="DRAFT">Draft</option>
              <option value="ARCHIVED">Archived</option>
            </select>
          </div>
          <div className="flex items-end pb-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  setForm((f) => ({ ...f, featured: e.target.checked }))
                }
                className="rounded border-neutral-300"
              />
              Featured product
            </label>
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="submit" loading={submitting}>
            Save Changes
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin")}
          >
            Cancel
          </Button>
          {!auctionUrl && (
            <Button
              type="button"
              variant="outline"
              loading={creatingAuction}
              onClick={async () => {
                setCreatingAuction(true);
                try {
                  await createAuction({
                    productId: Number(id),
                    title: form.title,
                    description: form.description,
                    priceCents: Math.round(Number(form.priceDollars) * 100),
                    imageUrl: form.imageUrl,
                  });
                  const updated = await getProductById(Number(id));
                  if (updated) setAuctionUrl(updated.auctionUrl);
                  toast.success("Auction created");
                } catch {
                  toast.error("Failed to create auction");
                } finally {
                  setCreatingAuction(false);
                }
              }}
            >
              <Gavel className="h-4 w-4" />
              Create Auction
            </Button>
          )}
        </div>
      </form>
    </div>
  );
}
