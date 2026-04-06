import React from 'react';

const STUDENT_NAME = 'Carter Wright';

/**
 * Debug home (Part 1 / Next.js exercise style).
 * Shows your name and raw API JSON so it’s obvious you’re on the debug screen.
 */
function DebugHome({ albumList }) {
  return (
    <main className="container py-4">
      <h1 className="mb-3">Sparks Album List (Debug View)</h1>

      <div
        className="alert alert-primary py-3 mb-3"
        role="status"
        style={{ fontSize: '1.25rem' }}
      >
        <strong>Student:</strong> {STUDENT_NAME}
      </div>

      <p>This JSON data is rendered from the API response (or local fallback).</p>

      <pre
        style={{
          backgroundColor: '#f4f4f4',
          padding: '1rem',
          borderRadius: '8px',
          overflow: 'auto',
          color: '#111',
          fontSize: '0.9rem',
          lineHeight: '1.4',
        }}
      >
        {albumList.length > 0 && JSON.stringify(albumList, null, 2)}
      </pre>

      {albumList.length === 0 && <p>Loading albums...</p>}
    </main>
  );
}

export default DebugHome;
