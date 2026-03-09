"use client";

import { useEffect } from "react";
import { useAuthStore } from "@/lib/stores/auth";
import { getUserByEmail } from "@/app/actions";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const setUser = useAuthStore((s) => s.setUser);

  useEffect(() => {
    const savedEmail = localStorage.getItem("auth_email");
    if (savedEmail) {
      getUserByEmail(savedEmail).then((user) => {
        if (user) setUser(user);
      });
    }
  }, [setUser]);

  return <>{children}</>;
}
