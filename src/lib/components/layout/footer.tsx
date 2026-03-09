import { Store } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t border-neutral-200 bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-neutral-500">
            <Store className="h-5 w-5" />
            <span className="text-sm font-medium">Store Demo</span>
          </div>
          <p className="text-sm text-neutral-400">
            Demo ecommerce app built with Next.js & SQLite
          </p>
        </div>
      </div>
    </footer>
  );
}
