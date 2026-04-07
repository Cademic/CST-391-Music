"use client";

import type { Album } from "@/lib/types";
import { useMemo, useState } from "react";
import AlbumList from "@/app/components/AlbumList";

interface SearchAlbumProps {
  albums: Album[];
}

// SearchAlbum is the "heart" of the UI: search input + rendered album list.
export default function SearchAlbum({ albums }: SearchAlbumProps) {
  const [searchPhrase, setSearchPhrase] = useState("");

  const filteredAlbums = useMemo(() => {
    const needle = searchPhrase.trim().toLowerCase();
    if (!needle) return albums;
    return albums.filter((album) => {
      const haystack = [
        album.title,
        album.artist,
        album.description ?? "",
      ]
        .join(" ")
        .toLowerCase();
      return haystack.includes(needle);
    });
  }, [albums, searchPhrase]);

  return (
    <section aria-label="Search albums">
      <div className="mb-3">
        <label htmlFor="search-term" className="form-label">
          Search for
        </label>
        <input
          id="search-term"
          type="text"
          className="form-control"
          placeholder="Enter search term here"
          value={searchPhrase}
          onChange={(e) => setSearchPhrase(e.target.value)}
        />
      </div>

      <AlbumList albums={filteredAlbums} />
    </section>
  );
}
