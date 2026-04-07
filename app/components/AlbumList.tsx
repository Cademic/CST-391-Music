"use client";

import type { Album } from "@/lib/types";
import AlbumCard from "@/app/components/AlbumCard";

interface AlbumListProps {
  albums: Album[];
}

// A reusable list component for album cards in Next.js App Router pages.
export default function AlbumList({ albums }: AlbumListProps) {
  return (
    <section aria-label="Album list">
      <div className="d-flex flex-wrap gap-3">
        {albums.map((album) => (
          <AlbumCard key={album.id ?? album.title} album={album} />
        ))}
      </div>
    </section>
  );
}
