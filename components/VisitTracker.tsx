"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

export function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    const body = JSON.stringify({ page: pathname });
    try {
      if (navigator.sendBeacon) {
        navigator.sendBeacon("/api/visits", new Blob([body], { type: "application/json" }));
      } else {
        fetch("/api/visits", {
          method: "POST",
          body,
          keepalive: true,
          headers: { "Content-Type": "application/json" },
        }).catch(() => {});
      }
    } catch {}
  }, [pathname]);

  return null;
}
