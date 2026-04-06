import fallbackRaw from "@/lib/albums-fallback.json";
import type { Album, Track } from "@/lib/types";

/**
 * When `POSTGRES_URL` / `DATABASE_URL` is unset (e.g. Vercel without Postgres),
 * album APIs use this module: data is seeded from `albums-fallback.json` and
 * new/edited albums are kept in server memory for the lifetime of the Node process.
 * (Cold starts reset to seed data — fine for demos without a database.)
 */

function normalizeAlbum(raw: unknown): Album {
  const a = raw as Record<string, unknown>;
  const tracksRaw = Array.isArray(a.tracks) ? a.tracks : [];
  const tracks: Track[] = tracksRaw.map((t, i) => {
    const tr = t as Record<string, unknown>;
    return {
      id: typeof tr.id === "number" ? tr.id : undefined,
      number: typeof tr.number === "number" ? tr.number : i + 1,
      title: String(tr.title ?? ""),
      lyrics: tr.lyrics == null ? null : String(tr.lyrics),
      video: tr.video == null ? null : String(tr.video),
    };
  });
  return {
    id: typeof a.id === "number" ? a.id : 0,
    title: String(a.title ?? ""),
    artist: String(a.artist ?? ""),
    year: typeof a.year === "number" ? a.year : 0,
    image: a.image == null || a.image === "" ? null : String(a.image),
    description: a.description == null ? null : String(a.description),
    tracks,
  };
}

let store: Album[] | null = null;
let nextId = 1;

function ensureStore(): Album[] {
  if (store) return store;
  const seed = (fallbackRaw as unknown[]).map(normalizeAlbum);
  store = seed;
  const maxId = seed.reduce((m, a) => Math.max(m, a.id ?? 0), 0);
  nextId = maxId + 1;
  return store;
}

function cloneAlbum(a: Album): Album {
  return {
    ...a,
    tracks: a.tracks?.map((t) => ({ ...t })) ?? [],
  };
}

/** Same track shaping as SQL inserts in `app/api/albums/route.ts`. */
export function normalizeTracksInput(tracks: unknown): Track[] {
  if (!Array.isArray(tracks)) return [];
  const out: Track[] = [];
  let seq = 0;
  for (const t of tracks as Track[]) {
    if (t.title == null) continue;
    const titleTrim = String(t.title).trim();
    if (!titleTrim) continue;
    const rawNum = (t as { number?: unknown }).number;
    let num: number | null =
      rawNum === "" || rawNum == null ? null : Number(rawNum);
    if (num != null && Number.isNaN(num)) continue;
    if (num == null) num = 0;
    seq += 1;
    out.push({
      id: seq,
      number: num,
      title: titleTrim,
      lyrics: t.lyrics ?? null,
      video: t.video ?? null,
    });
  }
  return out;
}

export function memoryGetAllAlbums(): Album[] {
  return ensureStore().map(cloneAlbum);
}

export function memoryGetAlbumById(id: number): Album | undefined {
  const a = ensureStore().find((x) => x.id === id);
  return a ? cloneAlbum(a) : undefined;
}

export function memoryCreateAlbum(input: {
  title: string;
  artist: string;
  year: number;
  description: string | null;
  image: string | null;
  tracks: Track[];
}): { id: number } {
  const albums = ensureStore();
  const id = nextId++;
  const album: Album = {
    id,
    title: input.title,
    artist: input.artist,
    year: input.year,
    description: input.description,
    image: input.image,
    tracks: input.tracks.map((t, i) => ({
      ...t,
      id: t.id ?? i + 1,
    })),
  };
  albums.push(album);
  return { id };
}

export function memoryUpdateAlbum(
  albumId: number,
  input: {
    title: string;
    artist: string;
    year: number;
    description: string | null;
    image: string | null;
    tracks: Track[];
  }
): { ok: true } | { ok: false; status: 404 } {
  const albums = ensureStore();
  const idx = albums.findIndex((a) => a.id === albumId);
  if (idx === -1) return { ok: false, status: 404 };
  albums[idx] = {
    id: albumId,
    title: input.title,
    artist: input.artist,
    year: input.year,
    description: input.description,
    image: input.image,
    tracks: input.tracks.map((t, i) => ({
      ...t,
      id: t.id ?? i + 1,
    })),
  };
  return { ok: true };
}
