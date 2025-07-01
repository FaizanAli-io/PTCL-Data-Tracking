"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    document.cookie = "permission=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    router.replace("/");
  }, [router]);

  return null;
}
