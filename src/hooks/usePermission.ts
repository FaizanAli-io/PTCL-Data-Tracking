"use client";

import { useEffect, useState } from "react";

interface Permission {
  epi?: string;
  email?: string;
  level?: number;
  employee?: { name: string };
}

export function usePermission() {
  const [permission, setPermission] = useState<Permission | null>(null);

  useEffect(() => {
    const cookieMatch = document.cookie.match(/permission=([^;]+)/);
    if (cookieMatch) {
      try {
        const decoded = decodeURIComponent(cookieMatch[1]);
        const parsed = JSON.parse(decoded);
        setPermission(parsed);
        console.log(parsed);
      } catch {
        setPermission(null);
      }
    }
  }, []);

  return {
    permission,
    isLoggedIn: !!permission,
    level: permission?.level || 0,
    name: permission?.employee?.name || ""
  };
}
