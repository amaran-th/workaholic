// src/utils/queryString.ts
export const toQueryString = (params?: Record<string, any>): string => {
  if (!params) return "";
  const query = Object.entries(params)
    .filter(([_, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(value)}`
    )
    .join("&");
  return query ? `?${query}` : "";
};
