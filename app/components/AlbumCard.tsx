"use client";

import type { Album } from "@/lib/types";
import { useRouter } from "next/navigation";

// A component to display individual album info, not included in Next.js routing.
// app/components/AlbumCard.tsx
export default function AlbumCard({ album }: { album: Album }) {
  const router = useRouter();
  const coverSrc = album.image?.trim() || null;

  return (
    <div className="card" style={{ maxWidth: "26rem" }}>
      {coverSrc ? (
        // eslint-disable-next-line @next/next/no-img-element -- remote album art URLs
        <img src={coverSrc} className="card-img-top" alt={album.title} />
      ) : (
        <div
          className="card-img-top bg-body-secondary d-flex align-items-center justify-content-center text-muted small"
          style={{ minHeight: "10rem" }}
          role="presentation"
        >
          No cover
        </div>
      )}
      <div className="card-body">
        <h5 className="card-title mb-1">{album.title}</h5>
        <p className="text-muted mb-2">
          {album.artist} ({album.year})
        </p>
        <p className="card-text">{album.description ?? "No description."}</p>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (album.id != null) router.push(`/show/${album.id}`);
            }}
          >
            View
          </button>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              if (album.id != null) router.push(`/edit/${album.id}`);
            }}
          >
            Edit
          </button>
        </div>
      </div>
    </div>
  );
}
