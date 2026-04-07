import Link from "next/link";

// Source inspiration (Bootstrap profile/about card pattern):
// https://getbootstrap.com/docs/5.3/examples/
// Converted/adapted to JSX for this project and styled with existing Bootstrap classes.
export default function AboutPage() {
  return (
    <main className="container py-4">
      <h1 className="mb-3">About This Music App</h1>
      <p className="text-muted">
        This page is rendered on the server as a Next.js Server Component (no
        <code>use client</code> directive), which means HTML is generated on the
        server before it reaches the browser.
      </p>

      <div className="card shadow-sm" style={{ maxWidth: "42rem" }}>
        <div className="card-body">
          <h2 className="card-title h4">Team Profile</h2>
          <p className="card-text mb-2">
            <strong>Project:</strong> CST-391 Music App Port to Next.js
          </p>
          <p className="card-text mb-2">
            <strong>Stack:</strong> Next.js App Router, TypeScript, Bootstrap,
            API Route Handlers
          </p>
          <p className="card-text mb-4">
            <strong>Boss:</strong> Carter Wright
          </p>

          <Link href="/" className="btn btn-primary">
            Home
          </Link>
        </div>
      </div>
    </main>
  );
}
