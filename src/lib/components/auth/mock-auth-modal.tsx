"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/lib/stores/auth";
import { getUsers } from "@/app/actions";
import { Badge } from "@/lib/components/ui/badge";
import { X } from "lucide-react";
import type { User } from "@/db/schema";

export function MockAuthModal() {
  const { isAuthModalOpen, closeAuthModal, setUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    if (isAuthModalOpen) {
      getUsers().then(setUsers);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  function handleSelect(user: User) {
    localStorage.setItem("auth_email", user.email);
    setUser(user);
    closeAuthModal();
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/50"
        onClick={closeAuthModal}
      />
      <div className="relative bg-white rounded-xl shadow-xl max-w-md w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Sign in as demo user</h2>
          <button
            onClick={closeAuthModal}
            className="text-neutral-400 hover:text-neutral-600"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="space-y-2">
          {users.map((user) => (
            <button
              key={user.id}
              onClick={() => handleSelect(user)}
              className="w-full flex items-center gap-3 p-3 rounded-lg border border-neutral-200 hover:border-primary-300 hover:bg-primary-50 transition-colors text-left"
            >
              {user.avatarUrl && (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-10 w-10 rounded-full bg-neutral-100"
                />
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-neutral-900">
                    {user.name}
                  </span>
                  <Badge
                    variant={user.role === "admin" ? "warning" : "default"}
                  >
                    {user.role}
                  </Badge>
                </div>
                <span className="text-sm text-neutral-500">{user.email}</span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
