import React from 'react';
import TrackTitle from './TrackTitle';

const TracksList = ({ tracks, selectedTrackId, onSelectTrack }) => {
  const safeTracks = Array.isArray(tracks) ? tracks : [];

  if (safeTracks.length === 0) {
    return (
      <div className="list-group">
        <div className="list-group-item">No tracks available.</div>
      </div>
    );
  }

  const rendered = safeTracks.map((track) => (
    <TrackTitle
      key={track.id ?? `${track.albumId ?? 'a'}-${track.number ?? track.title ?? 't'}`}
      track={track}
      isSelected={track.id === selectedTrackId}
      onSelect={onSelectTrack}
    />
  ));

  return <div className="list-group">{rendered}</div>;
};

export default TracksList;
