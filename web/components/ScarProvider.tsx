"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { fetchScar } from "@/lib/scar-client";
import type { ScarPayload } from "@/lib/types";

const POLL_MS = 15_000;

type ScarContextValue = {
  data: ScarPayload;
  refreshing: boolean;
  autoRefresh: boolean;
  setAutoRefresh: (v: boolean) => void;
  lastOkAt: number | null;
  error: string | null;
  bump: number;
  refresh: () => Promise<void>;
};

const ScarContext = createContext<ScarContextValue | null>(null);

export function ScarProvider({
  initialData,
  children,
}: {
  initialData: ScarPayload;
  children: React.ReactNode;
}) {
  const [data, setData] = useState(initialData);
  const [refreshing, setRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastOkAt, setLastOkAt] = useState<number | null>(Date.now());
  const [error, setError] = useState<string | null>(null);
  const [bump, setBump] = useState(0);

  const refresh = useCallback(async () => {
    setRefreshing(true);
    try {
      const next = await fetchScar();
      setData((prev) => {
        if (prev.generatedAt !== next.generatedAt) {
          queueMicrotask(() => setBump((b) => b + 1));
        }
        return next;
      });
      setLastOkAt(Date.now());
      setError(null);
    } catch (e) {
      setError(e instanceof Error ? e.message : "poll failed");
    } finally {
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;
    const tick = () => {
      if (document.visibilityState === "hidden") return;
      void refresh();
    };
    const id = window.setInterval(tick, POLL_MS);
    const onVis = () => {
      if (document.visibilityState === "visible") void refresh();
    };
    document.addEventListener("visibilitychange", onVis);
    return () => {
      window.clearInterval(id);
      document.removeEventListener("visibilitychange", onVis);
    };
  }, [autoRefresh, refresh]);

  const value = useMemo(
    () => ({
      data,
      refreshing,
      autoRefresh,
      setAutoRefresh,
      lastOkAt,
      error,
      bump,
      refresh,
    }),
    [data, refreshing, autoRefresh, lastOkAt, error, bump, refresh],
  );

  return (
    <ScarContext.Provider value={value}>{children}</ScarContext.Provider>
  );
}

export function useScar() {
  const ctx = useContext(ScarContext);
  if (!ctx) {
    throw new Error("useScar must be used within ScarProvider");
  }
  return ctx;
}
