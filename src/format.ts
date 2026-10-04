const longDate = new Intl.DateTimeFormat(undefined, {
  weekday: "long",
  day: "numeric",
  month: "long",
});

const shortDate = new Intl.DateTimeFormat(undefined, {
  weekday: "short",
  day: "numeric",
  month: "short",
});

export const formatLongDate = (date: Date) => longDate.format(date);

export const formatShortDate = (date: Date) => shortDate.format(date);

export function formatClock(seconds: number) {
  if (!Number.isFinite(seconds)) return "-:--";
  const total = Math.floor(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = String(total % 60).padStart(2, "0");
  return h ? `${h}:${String(m).padStart(2, "0")}:${s}` : `${m}:${s}`;
}

export function formatSpokenDuration(seconds: number) {
  const total = Math.floor(seconds);
  const m = Math.floor(total / 60);
  const s = total % 60;
  const minutes = m ? `${m} minute${m === 1 ? "" : "s"} ` : "";
  return `${minutes}${s} second${s === 1 ? "" : "s"}`;
}
