// app/edit/[albumId]/page.tsx
// (File lives under `app/(music)/edit/...`; the `(music)` group does not affect the URL — routes are still `/edit/:albumId` and `/new`.)
"use client";

import { get, post, put } from "@/lib/apiClient";
import type { Album, Track } from "@/lib/types";
import { useParams, useRouter } from "next/navigation";
import type { ChangeEvent, FormEvent } from "react";
import { useEffect, useState } from "react";

/**
 * Shared create/edit form for:
 * - `/edit/[albumId]` — load album with GET, submit with PUT `/api/albums/:albumId`
 * - `/new` — re-exported from `app/(music)/new/page.tsx`; no `albumId` → POST `/api/albums`
 */
export default function EditAlbumPage() {
  const router = useRouter();
  // Next.js `useParams` replaces `useParams` from react-router; keys match dynamic segment names.
  const params = useParams();
  const rawAlbumId = params?.albumId;
  const albumId =
    typeof rawAlbumId === "string"
      ? rawAlbumId
      : Array.isArray(rawAlbumId)
        ? rawAlbumId[0]
        : undefined;

  // `albumId` is undefined when this component is mounted as `/new` (no `[albumId]` in the URL).
  const defaultAlbum: Album = {
    id: 0,
    title: "",
    artist: "",
    description: "",
    year: 0,
    image: "",
    tracks: [] as Track[],
  };

  // Type-safe default for `useState` — matches `Album` instead of an ad hoc object.
  const [album, setAlbum] = useState<Album>(defaultAlbum);

  // Load album only when editing (dynamic segment present).
  useEffect(() => {
    if (!albumId) return; // creation mode — skip GET
    void (async () => {
      try {
        const res = await get<Album>(`/albums/${albumId}`);
        setAlbum(res);
      } catch (e) {
        console.error("Failed to load album:", e);
      }
    })();
  }, [albumId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (albumId) {
        await put<{ id: number }, Album>(`/albums/${albumId}`, album);
      } else {
        await post<{ id: number }, Album>("/albums", album);
      }
      router.push("/");
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Failed to save album";
      console.error("Save failed:", error);
      alert(message);
    }
  };

  const onChange =
    (key: "title" | "artist" | "description" | "image") =>
    (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      setAlbum((prev) => ({ ...prev, [key]: e.target.value }));
    };

  return (
    <main className="container py-4" style={{ maxWidth: "36rem" }}>
      <h1 className="mb-4">{albumId ? "Edit Album" : "Create Album"}</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="album-title" className="form-label">
            Title
          </label>
          <input
            id="album-title"
            className="form-control"
            placeholder="Title"
            value={album.title}
            onChange={onChange("title")}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="album-artist" className="form-label">
            Artist
          </label>
          <input
            id="album-artist"
            className="form-control"
            placeholder="Artist"
            value={album.artist}
            onChange={onChange("artist")}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="album-year" className="form-label">
            Year
          </label>
          <input
            id="album-year"
            className="form-control"
            placeholder="Year"
            type="number"
            value={album.year === 0 ? "" : album.year}
            onChange={(e) => {
              const v = e.target.value;
              setAlbum((prev) => ({
                ...prev,
                year: v === "" ? 0 : Number(v),
              }));
            }}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="album-description" className="form-label">
            Description
          </label>
          <textarea
            id="album-description"
            className="form-control"
            placeholder="Description"
            rows={4}
            value={album.description ?? ""}
            onChange={onChange("description")}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="album-image" className="form-label">
            Image URL
          </label>
          <input
            id="album-image"
            className="form-control"
            placeholder="Image URL"
            value={album.image ?? ""}
            onChange={onChange("image")}
          />
        </div>
        <button type="submit" className="btn btn-primary">
          {albumId ? "Update" : "Save"}
        </button>
      </form>
    </main>
  );
}
