import React from 'react';

const TrackLyrics = ({ track }) => {
  if (!track) {
    return <p className="card-text mb-0">Show the lyrics of a selected track here.</p>;
  }

  const lyrics = track.lyrics?.trim();

  return (
    <div>
      <h5 className="card-title mb-2">{track.title}</h5>
      {lyrics ? (
        <p className="card-text mb-0" style={{ whiteSpace: 'pre-wrap' }}>
          {lyrics}
        </p>
      ) : (
        <p className="card-text mb-0">No lyrics available for this track.</p>
      )}
    </div>
  );
};

export default TrackLyrics;
