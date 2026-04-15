"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

export default function NavBar() {
  const { data: session, status } = useSession();
  const isAdmin = session?.user?.role === "admin";

  useEffect(() => {
    // @ts-expect-error: Bootstrap's JavaScript bundle lacks TypeScript definitions.
    // This dynamic import loads Bootstrap's collapse, dropdown, and modal functionality on the client.
    // Safe to ignore the type error because it runs only in the browser and does not affect SSR.
    import("bootstrap/dist/js/bootstrap.bundle.min.js");
  }, []);

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <Link href="/" className="navbar-brand mb-0">
        Music App
      </Link>
      <button
        className="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNavAltMarkup"
        aria-controls="navbarNavAltMarkup"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span className="navbar-toggler-icon"></span>
      </button>
      <div className="collapse navbar-collapse" id="navbarNavAltMarkup">
        <div className="navbar-nav">
          {isAdmin ? (
            <Link href="/new" className="nav-item nav-link">
              New Album
            </Link>
          ) : null}
          <Link href="/about" className="nav-item nav-link">
            About
          </Link>
          {status === "unauthenticated" ? (
            <Link href="/api/auth/signin" className="nav-item nav-link">
              Sign In
            </Link>
          ) : null}
          {status === "authenticated" ? (
            <Link href="/api/auth/signout" className="nav-item nav-link">
              Sign Out
            </Link>
          ) : null}
        </div>
      </div>
    </nav>
  );
}
