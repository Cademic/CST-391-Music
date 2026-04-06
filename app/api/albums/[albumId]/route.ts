import { NextRequest, NextResponse } from "next/server";
import {
  memoryGetAlbumById,
  memoryUpdateAlbum,
  normalizeTracksInput,
} from "@/lib/albums-memory-store";
import { getPool, hasDatabaseUrl } from "@/lib/db";
import type { Album, Track } from "@/lib/types";

export const runtime = "nodejs";

/** Mirrors column layout from `app/api/albums/route.ts`. */
interface AlbumRow {
  id: number;
  title: string;
  artist: string;
  year: number;
  image: string | null;
  description: string | null;
}

interface TrackRow {
  id: number;
  album_id: number;
  title: string;
  number: number;
  lyrics: string | null;
  video_url: string | null;
}

function parseYear(
  year: unknown
): { ok: true; value: number | null } | { ok: false; error: string } {
  if (year === "" || year == null) return { ok: true, value: null };
  const n = typeof year === "string" ? Number(year) : Number(year);
  if (Number.isNaN(n)) return { ok: false, error: "year must be a number" };
  return { ok: true, value: n };
}

/**
 * GET /api/albums/:albumId — single album + tracks (supports tutorial `get("/albums/:id")`).
 */
export async function GET(
  _request: NextRequest,
  context: { params: Promise<{ albumId: string }> }
) {
  try {
    const { albumId: idParam } = await context.params;
    const idNum = parseInt(idParam, 10);
    if (Number.isNaN(idNum)) {
      return NextResponse.json({ error: "Invalid album id" }, { status: 400 });
    }

    if (!hasDatabaseUrl()) {
      const album = memoryGetAlbumById(idNum);
      if (!album) {
        return NextResponse.json({ error: "Album not found" }, { status: 404 });
      }
      return NextResponse.json(album);
    }

    const res = await getPool().query<AlbumRow>(
      "SELECT * FROM albums WHERE id = $1",
      [idNum]
    );
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    const album = res.rows[0];
    const tracksRes = await getPool().query<TrackRow>(
      "SELECT * FROM tracks WHERE album_id = $1 ORDER BY number",
      [idNum]
    );
    const tracks: Track[] = tracksRes.rows.map((track) => ({
      id: track.id,
      number: track.number,
      title: track.title,
      lyrics: track.lyrics,
      video: track.video_url,
    }));

    const payload: Album = {
      id: album.id,
      title: album.title,
      artist: album.artist,
      year: album.year,
      image: album.image,
      description: album.description,
      tracks,
    };

    return NextResponse.json(payload);
  } catch (error) {
    console.error("GET /api/albums/[albumId] error:", error);
    return NextResponse.json(
      { error: "Failed to fetch album" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/albums/:albumId — same semantics as PUT /api/albums with `id` in body (tutorial uses path param).
 */
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ albumId: string }> }
) {
  const { albumId: idParam } = await context.params;
  const albumId =
    idParam === "" || idParam == null ? NaN : Number(idParam);
  if (Number.isNaN(albumId)) {
    return NextResponse.json({ error: "Invalid album id" }, { status: 400 });
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const { title, artist, year, description, image, tracks } = body as Record<
    string,
    unknown
  >;
  const titleStr = typeof title === "string" ? title.trim() : "";
  const artistStr = typeof artist === "string" ? artist.trim() : "";
  if (!titleStr || !artistStr) {
    return NextResponse.json(
      { error: "title and artist are required" },
      { status: 400 }
    );
  }

  const yearParsed = parseYear(year);
  if (!yearParsed.ok) {
    return NextResponse.json({ error: yearParsed.error }, { status: 400 });
  }
  if (yearParsed.value == null) {
    return NextResponse.json(
      { error: "year is required for update" },
      { status: 400 }
    );
  }

  if (!hasDatabaseUrl()) {
    const trackList = normalizeTracksInput(tracks);
    const result = memoryUpdateAlbum(albumId, {
      title: titleStr,
      artist: artistStr,
      year: yearParsed.value,
      description: description == null ? null : String(description),
      image: image == null || image === "" ? null : String(image),
      tracks: trackList,
    });
    if (!result.ok) {
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }
    return NextResponse.json({ id: albumId }, { status: 200 });
  }

  let client;
  try {
    client = await getPool().connect();
  } catch (err) {
    console.error("PUT /api/albums/[albumId] database connection error:", err);
    const message =
      err instanceof Error ? err.message : "Database connection failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }

  try {
    await client.query("BEGIN");
    const updateRes = await client.query(
      `UPDATE albums
       SET title = $1, artist = $2, description = $3, year = $4, image = $5
       WHERE id = $6`,
      [
        titleStr,
        artistStr,
        description ?? null,
        yearParsed.value,
        image ?? null,
        albumId,
      ]
    );
    if (updateRes.rowCount === 0) {
      await client.query("ROLLBACK");
      return NextResponse.json({ error: "Album not found" }, { status: 404 });
    }

    await client.query("DELETE FROM tracks WHERE album_id = $1", [albumId]);

    if (Array.isArray(tracks)) {
      for (const t of tracks as Track[]) {
        if (t.title == null) continue;
        const titleTrim = String(t.title).trim();
        if (!titleTrim) continue;
        const rawNum = (t as { number?: unknown }).number;
        let num: number | null =
          rawNum === "" || rawNum == null ? null : Number(rawNum);
        if (num != null && Number.isNaN(num)) {
          await client.query("ROLLBACK");
          return NextResponse.json(
            { error: "track.number must be a number" },
            { status: 400 }
          );
        }
        if (num == null) num = 0;
        await client.query(
          `INSERT INTO tracks (album_id, title, number, lyrics, video_url)
           VALUES ($1, $2, $3, $4, $5)`,
          [albumId, titleTrim, num, t.lyrics ?? null, t.video ?? null]
        );
      }
    }

    await client.query("COMMIT");
    return NextResponse.json({ id: albumId }, { status: 200 });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("PUT /api/albums/[albumId] transaction error:", err);
    return NextResponse.json(
      { error: "Error updating album" },
      { status: 500 }
    );
  } finally {
    client.release();
  }
}
