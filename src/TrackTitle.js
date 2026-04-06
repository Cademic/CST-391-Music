import React from 'react';

const TrackTitle = ({ track, isSelected, onSelect }) => {
  const handleClick = () => {
    if (onSelect) onSelect(track);
  };

  return (
    <button
      type="button"
      className={`list-group-item list-group-item-action ${isSelected ? 'active' : ''}`}
      onClick={handleClick}
    >
      {track?.number != null ? `${track.number}. ` : ''}
      {track?.title ?? 'Untitled track'}
    </button>
  );
};

export default TrackTitle;
