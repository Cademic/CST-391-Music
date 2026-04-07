"use client";

import EditAlbumPage from "@/app/(music)/edit/[albumId]/page";
import { useParams } from "next/navigation";

export default function ShowAlbumPage() {
  const params = useParams();
  const raw = params.id;
  const albumId =
    typeof raw === "string" ? raw : Array.isArray(raw) ? raw[0] : undefined;

  if (!albumId) {
    return (
      <div className="container p-4">
        <p>Album not found.</p>
      </div>
    );
  }

  // Suggested improvement: reuse edit page as read-only detailed view.
  return <EditAlbumPage forcedReadOnly forcedAlbumId={albumId} />;
}
