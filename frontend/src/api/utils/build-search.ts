export type Search = Record<string, string | number | boolean | undefined>;

export const buildQueryString = (
  search: Record<string, string | number | boolean | undefined>,
) => {
  const queryString = new URLSearchParams();
  for (const key in search) {
    if (search[key] !== undefined) {
      queryString.append(key, String(search[key]));
    }
  }

  const query = queryString.toString();
  return query ? `?${query}` : "";
};
