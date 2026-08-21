export function formatWhen(iso: string | null | undefined) {
  if (!iso) return "never";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return String(iso);
  return new Intl.DateTimeFormat("en-GB", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(d);
}

/** Relative age like "12m ago" / "3h ago". */
export function formatAge(iso: string | null | undefined, now = Date.now()) {
  if (!iso) return "unknown";
  const t = new Date(iso).getTime();
  if (Number.isNaN(t)) return "unknown";
  const sec = Math.max(0, Math.floor((now - t) / 1000));
  if (sec < 60) return `${sec}s ago`;
  const min = Math.floor(sec / 60);
  if (min < 60) return `${min}m ago`;
  const hr = Math.floor(min / 60);
  if (hr < 48) return `${hr}h ago`;
  const day = Math.floor(hr / 24);
  return `${day}d ago`;
}

export function formatPrice(price: number | null, currency: string) {
  if (price == null || !Number.isFinite(price)) return "n/a";
  try {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: currency || "USD",
    }).format(price);
  } catch {
    return `${price} ${currency || ""}`.trim();
  }
}
