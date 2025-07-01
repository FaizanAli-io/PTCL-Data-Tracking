"use client";

import { useEffect, useState } from "react";

interface Permission {
  epi?: string;
  name?: string;
  level?: number;
}

export function usePermission() {
  const [permission, setPermission] = useState<Permission | null>(null);

  useEffect(() => {
    const getPermissionFromCookie = () => {
      const match = document.cookie.match(/(?:^|;\s*)permission=([^;]+)/);
      if (match) {
        try {
          const decoded = decodeURIComponent(match[1]);
          const parsed: Permission = JSON.parse(decoded);
          return parsed;
        } catch {
          return null;
        }
      }
      return null;
    };

    const parsed = getPermissionFromCookie();
    setPermission(parsed);
  }, []);

  return {
    permission,
    isLoggedIn: !!permission,
    epi: permission?.epi || "",
    name: permission?.name || "",
    level: permission?.level ?? 0
  };
}
