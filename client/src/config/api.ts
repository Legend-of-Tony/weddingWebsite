const rawApiUrl = import.meta.env.VITE_API_URL as string | undefined;

export const API_URL = rawApiUrl?.startsWith("http")
  ? rawApiUrl.replace(/\/$/, "")
  : `https://${rawApiUrl?.replace(/\/$/, "")}`;
