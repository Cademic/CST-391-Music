"use client";
 
import AlbumCard from "@/app/components/AlbumCard";
import { get } from "@/lib/apiClient";
import type { Album } from "@/lib/types";
import { useEffect, useState } from "react";

const STUDENT_NAME = "Carter Wright";

export default function Page() {
  const [albumList, setAlbumList] = useState<Album[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  useEffect(() => {
    void (async () => {
      try {
        const albums = await get<Album[]>("/albums");
        setAlbumList(albums);
        setApiError(null);
      } catch (e) {
        const message =
          e instanceof Error
            ? e.message
            : "Unexpected error while fetching albums";
        console.error("Failed to load albums:", e);
        setAlbumList([]);
        setApiError(message);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);
  const firstAlbum = albumList[0] ?? null;

  return (
    <main className="container py-4">
      <h1 className="mb-2">Sparks Album List</h1>
      <p className="mb-3">
        <strong>Student:</strong> {STUDENT_NAME}
      </p>

      {apiError ? (
        <div className="alert alert-danger" role="alert">
          <strong>Client API error:</strong> {apiError}
        </div>
      ) : null}

      {isLoaded && firstAlbum ? (
        <section aria-label="First fetched album">
          <h2 className="h5 mb-3">First Album Fetched</h2>
          <AlbumCard album={firstAlbum} />
        </section>
      ) : null}

      {isLoaded && !apiError && !firstAlbum ? (
        <p>No albums returned by the API.</p>
      ) : null}

      {!isLoaded ? (
        <p>Loading albums...</p>
      ) : null}
    </main>
  );
}
