const UTC_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "short",
  day: "numeric",
});

const UTC_LONG_DATE_FORMAT = new Intl.DateTimeFormat("en-US", {
  timeZone: "UTC",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export function formatBlogDate(iso: string) {
  return UTC_DATE_FORMAT.format(new Date(iso));
}

export function formatLongDate(iso: string) {
  return UTC_LONG_DATE_FORMAT.format(new Date(iso));
}

export function getCurrentUTCYear() {
  return new Date().getUTCFullYear();
}
