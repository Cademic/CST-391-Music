import type {
  Album,
  AlbumCreatePayload,
  AlbumUpdatePayload,
} from "@/lib/types";

export async function fetchAlbums(): Promise<Album[]> {
  const res = await fetch("/api/albums", { cache: "no-store" });
  if (!res.ok) {
    throw new Error(`Failed to load albums: ${res.status}`);
  }
  return res.json() as Promise<Album[]>;
}

export async function postAlbum(
  body: AlbumCreatePayload
): Promise<{ id: number }> {
  const res = await fetch("/api/albums", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err === "object" && err && "error" in err
        ? String((err as { error: string }).error)
        : res.statusText
    );
  }
  return res.json() as Promise<{ id: number }>;
}

export async function putAlbum(
  body: AlbumUpdatePayload
): Promise<{ id: number }> {
  const res = await fetch("/api/albums", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(
      typeof err === "object" && err && "error" in err
        ? String((err as { error: string }).error)
        : res.statusText
    );
  }
  return res.json() as Promise<{ id: number }>;
}
