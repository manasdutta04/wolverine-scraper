import type { ScarPayload } from "./types";

export async function fetchScar(): Promise<ScarPayload> {
  const res = await fetch("/data/scar.json", {
    cache: "no-store",
    headers: { Accept: "application/json" },
  });
  if (!res.ok) {
    throw new Error(`scar.json ${res.status}`);
  }
  return (await res.json()) as ScarPayload;
}
