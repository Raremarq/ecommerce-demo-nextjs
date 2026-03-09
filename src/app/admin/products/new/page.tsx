"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth";
import { useToastStore } from "@/lib/stores/toast";
import { createProduct } from "@/app/actions";
import { Button } from "@/lib/components/ui/button";
import { Shield } from "lucide-react";
import { EmptyState } from "@/lib/components/ui/empty-state";

function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export default function NewProductPage() {
  const router = useRouter();
  const currentUser = useAuthStore((s) => s.currentUser);
  const toast = useToastStore();
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priceCents: "",
    compareAtPriceCents: "",
    category: "",
    imageUrl: "",
    stock: "0",
    featured: false,
    status: "ACTIVE" as "ACTIVE" | "DRAFT" | "ARCHIVED",
  });

  if (!currentUser || currentUser.role !== "admin") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16">
        <EmptyState
          icon={Shield}
          title="Admin access required"
          description="Sign in as an admin user to create products"
        />
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createProduct({
        title: form.title,
        slug: slugify(form.title),
        description: form.description,
        priceCents: Math.round(Number(form.priceCents) * 100),
        compareAtPriceCents: form.compareAtPriceCents
          ? Math.round(Number(form.compareAtPriceCents) * 100)
          : undefined,
        category: form.category,
        imageUrl: form.imageUrl,
        stock: Number(form.stock),
        featured: form.featured,
        status: form.status,
      });
      toast.success("Product created");
      router.push("/admin");
    } catch {
      toast.error("Failed to create product");
      setSubmitting(false);
    }
  }

  const inputClass =
    "w-full rounded-lg border border-neutral-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500";

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold mb-8">New Product</h1>

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
              value={form.priceCents}
              onChange={(e) =>
                setForm((f) => ({ ...f, priceCents: e.target.value }))
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
              value={form.compareAtPriceCents}
              onChange={(e) =>
                setForm((f) => ({
                  ...f,
                  compareAtPriceCents: e.target.value,
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
            Create Product
          </Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/admin")}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  );
}
