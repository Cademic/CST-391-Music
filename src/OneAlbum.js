import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TracksList from './TracksList';
import TrackLyrics from './TrackLyrics';
import TrackVideo from './TrackVideo';

const OneAlbum = (props) => {
  const album = props.album ?? null;
  const albumIndex = props.albumIndex;
  const navigate = useNavigate();
  const tracks = useMemo(() => (Array.isArray(album?.tracks) ? album.tracks : []), [album]);
  const [selectedTrackId, setSelectedTrackId] = useState(null);

  useEffect(() => {
    if (!album) return;
    setSelectedTrackId((prevSelectedTrackId) => {
      if (!tracks.length) return null;
      if (prevSelectedTrackId != null && tracks.some((t) => t.id === prevSelectedTrackId)) {
        return prevSelectedTrackId;
      }
      return tracks[0]?.id ?? null;
    });
  }, [album, tracks]);

  const selectedTrack = useMemo(() => {
    if (!tracks.length) return null;
    return tracks.find((t) => t.id === selectedTrackId) ?? tracks[0] ?? null;
  }, [tracks, selectedTrackId]);

  if (!album) {
    return (
      <div className="container">
        <p>Album not found.</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h2>Album Details for {album.title}</h2>
      <div className="row">
        <div className="col col-sm-3">
          <div className="card">
            <img src={album.image} className="card-img-top" alt={album.title} />
            <div className="card-body">
              <h5 className="card-title">{album.title}</h5>
              <p className="card-text">{album.description}</p>
              <TracksList
                tracks={tracks}
                selectedTrackId={selectedTrackId}
                onSelectTrack={(track) => setSelectedTrackId(track?.id ?? null)}
              />
              <button
                type="button"
                className="btn btn-primary"
                onClick={() => navigate(`/edit/${albumIndex}`)}
              >
                Edit
              </button>
            </div>
          </div>
        </div>
        <div className="col col-sm-9">
          <div className="card mb-3">
            <div className="card-body">
              <TrackLyrics track={selectedTrack} />
            </div>
          </div>
          <div className="card">
            <div className="card-body">
              <TrackVideo track={selectedTrack} albumArtist={album.artist} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OneAlbum;
