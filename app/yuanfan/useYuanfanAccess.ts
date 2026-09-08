"use client";

import { useEffect, useState } from "react";
import { readYuanfanAccess } from "./access";

export function useYuanfanAccess() {
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  useEffect(() => {
    const sync = () => setHasAccess(readYuanfanAccess(window.localStorage));
    const visible = () => { if (document.visibilityState === "visible") sync(); };
    sync();
    window.addEventListener("storage", sync);
    window.addEventListener("jia-progress", sync);
    window.addEventListener("focus", sync);
    window.addEventListener("pageshow", sync);
    document.addEventListener("visibilitychange", visible);
    return () => {
      window.removeEventListener("storage", sync);
      window.removeEventListener("jia-progress", sync);
      window.removeEventListener("focus", sync);
      window.removeEventListener("pageshow", sync);
      document.removeEventListener("visibilitychange", visible);
    };
  }, []);
  return hasAccess;
}
