export const humanReadableDate = (date: string): string => {
  const dateObj = new Date(date);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric", // e.g., '2025'
    month: "long", // e.g., 'March'
    day: "numeric", // e.g., '19'
    // hour: "2-digit", // e.g., '08'
    // minute: "2-digit", // e.g., '00',
    hour12: false,
  }).format(dateObj);
};
