"use client";

import NavBar from "@/components/NavBar";
import "@/components/music/music-app.css";

export default function MusicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <NavBar />
      {children}
    </>
  );
}
