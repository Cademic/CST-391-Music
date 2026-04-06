/**
 * Thin client for browser-side fetches to Next.js Route Handlers under `/api`.
 * Paths are relative to `/api` (e.g. `get<Album>("/albums/3")` → GET `/api/albums/3`).
 */

export async function get<T>(path: string): Promise<T> {
  const res = await fetch(`/api${path}`);
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `${res.status} ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}
