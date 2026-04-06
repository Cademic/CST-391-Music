import React, { useState } from 'react';
import dataSource from './dataSource';
import { useNavigate } from 'react-router-dom';

const EditAlbum = (props) => {
  // Assume New Album by setting up an empty album and setting the flag newAlbumCreation
  let album = {
    albumId: '',
    title: '',
    artist: '',
    description: '',
    year: '',
    image: '',
    tracks: [],
  };
  let newAlbumCreation = true;

  // If an album is provided in 'props', then we are editing an album.
  // Set album to the provided album and set newAlbumCreation to false.
  if (props.album) {
    album = props.album;
    newAlbumCreation = false;
  }

  // album is now setup as a edited or new album
  const [albumTitle, setAlbumTitle] = useState(album.title);
  const [artist, setArtist] = useState(album.artist);
  const [description, setDescription] = useState(album.description);
  const [year, setYear] = useState(album.year);
  const [image, setImage] = useState(album.image);
  const [tracks, setTracks] = useState(Array.isArray(album.tracks) ? album.tracks : []);

  const [trackNumber, setTrackNumber] = useState('');
  const [trackTitle, setTrackTitle] = useState('');
  const [trackLyrics, setTrackLyrics] = useState('');
  const [trackVideo, setTrackVideo] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const navigate = useNavigate();

  const handleFormSubmit = (event) => {
    event.preventDefault();

    console.log('submit');
    const editedAlbum = {
      // albumId is important for updating an album it is ignored on a new album
      albumId: album.id ?? album.albumId,
      title: albumTitle,
      artist: artist,
      description: description,
      year: year,
      image: image,
      tracks: tracks,
    };
    console.log(editedAlbum);

    saveAlbum(editedAlbum);
  };

  const saveAlbum = async (editedAlbum) => {
    try {
      setIsSaving(true);
      let response;
      if (newAlbumCreation) response = await dataSource.post('/albums', editedAlbum);
      else response = await dataSource.put('/albums', editedAlbum);
      console.log(response);
      console.log(response.data);
      alert(newAlbumCreation ? 'Album created successfully.' : 'Album updated successfully.');
      if (props.onEditAlbum) props.onEditAlbum(navigate);
    } catch (err) {
      console.error('Failed to save album:', err?.message ?? err);
      alert(
        newAlbumCreation
          ? 'Album creation failed. Make sure the REST server and MySQL are running.'
          : 'Album update failed. Make sure the REST server and MySQL are running.'
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/');
  };

  const updateTitle = (event) => {
    setAlbumTitle(event.target.value);
  };
  const updateArtist = (event) => {
    setArtist(event.target.value);
  };
  const updateDescription = (event) => {
    setDescription(event.target.value);
  };
  const updateYear = (event) => {
    setYear(event.target.value);
  };
  const updateImage = (event) => {
    setImage(event.target.value);
  };

  const updateTrackNumber = (event) => {
    setTrackNumber(event.target.value);
  };
  const updateTrackTitle = (event) => {
    setTrackTitle(event.target.value);
  };
  const updateTrackLyrics = (event) => {
    setTrackLyrics(event.target.value);
  };
  const updateTrackVideo = (event) => {
    setTrackVideo(event.target.value);
  };

  const addTrack = () => {
    const trimmedTitle = (trackTitle ?? '').trim();
    if (!trimmedTitle) return;

    const nextTrack = {
      id: undefined,
      albumId: album.id ?? album.albumId,
      number: trackNumber === '' ? null : Number(trackNumber),
      title: trimmedTitle,
      lyrics: trackLyrics,
      video: trackVideo,
    };

    setTracks((current) => [...current, nextTrack]);
    setTrackNumber('');
    setTrackTitle('');
    setTrackLyrics('');
    setTrackVideo('');
  };

  const removeTrack = (indexToRemove) => {
    setTracks((current) => current.filter((_, index) => index !== indexToRemove));
  };

  const updateExistingTrack = (indexToUpdate, patch) => {
    setTracks((current) =>
      current.map((t, index) => {
        if (index !== indexToUpdate) return t;
        return { ...t, ...patch };
      })
    );
  };

  return (
    <div className="container">
      <form onSubmit={handleFormSubmit}>
        <h1>{newAlbumCreation ? 'Create New' : 'Edit'} Album</h1>
        <div className="form-group">
          <label htmlFor="albumTitle">Album Title</label>
          <input
            type="text"
            className="form-control"
            id="albumTitle"
            placeholder="Enter Album Title"
            value={albumTitle}
            onChange={updateTitle}
          />
          <label htmlFor="albumArtist">Artist</label>
          <input
            type="text"
            className="form-control"
            id="albumArtist"
            placeholder="Enter Album Artist"
            value={artist}
            onChange={updateArtist}
          />
          <label htmlFor="albumDescription">Description</label>
          <textarea
            type="text"
            className="form-control"
            id="albumDescription"
            placeholder="Enter Album Description"
            value={description}
            onChange={updateDescription}
          />
          <label htmlFor="albumYear">Year</label>
          <input
            type="text"
            className="form-control"
            id="albumYear"
            placeholder="Enter Album Year"
            value={year}
            onChange={updateYear}
          />
          <label htmlFor="albumImage">Image</label>
          <input
            type="text"
            className="form-control"
            id="albumImage"
            placeholder="Enter Album Image"
            value={image}
            onChange={updateImage}
          />
        </div>

        <hr />

        <h4>Tracks</h4>
        <div className="form-group">
          <label htmlFor="trackNumber">Track Number</label>
          <input
            type="text"
            className="form-control"
            id="trackNumber"
            placeholder="Enter Track Number"
            value={trackNumber}
            onChange={updateTrackNumber}
          />

          <label htmlFor="trackTitle">Track Title</label>
          <input
            type="text"
            className="form-control"
            id="trackTitle"
            placeholder="Enter Track Title"
            value={trackTitle}
            onChange={updateTrackTitle}
          />

          <label htmlFor="trackLyrics">Lyrics</label>
          <textarea
            type="text"
            className="form-control"
            id="trackLyrics"
            placeholder="Enter Track Lyrics"
            value={trackLyrics}
            onChange={updateTrackLyrics}
          />

          <label htmlFor="trackVideo">YouTube URL</label>
          <input
            type="text"
            className="form-control"
            id="trackVideo"
            placeholder="Enter Track YouTube URL"
            value={trackVideo}
            onChange={updateTrackVideo}
          />

          <button type="button" className="btn btn-secondary mt-2" onClick={addTrack}>
            Add Track
          </button>
        </div>

        {tracks.length > 0 ? (
          <div className="mt-3">
            <h5>Tracks</h5>
            <div className="list-group">
              {tracks.map((t, index) => (
                <div key={`${t.id ?? 'new'}-${index}`} className="list-group-item">
                  <div className="row g-2 align-items-end">
                    <div className="col-12 col-md-2">
                      <label className="form-label mb-0">#</label>
                      <input
                        type="text"
                        className="form-control"
                        value={t.number ?? ''}
                        onChange={(e) => updateExistingTrack(index, { number: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label mb-0">Title</label>
                      <input
                        type="text"
                        className="form-control"
                        value={t.title ?? ''}
                        onChange={(e) => updateExistingTrack(index, { title: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-4">
                      <label className="form-label mb-0">YouTube</label>
                      <input
                        type="text"
                        className="form-control"
                        value={t.video ?? ''}
                        onChange={(e) => updateExistingTrack(index, { video: e.target.value })}
                      />
                    </div>
                    <div className="col-12 col-md-2 d-flex justify-content-end">
                      <button
                        type="button"
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeTrack(index)}
                      >
                        Remove
                      </button>
                    </div>
                    <div className="col-12">
                      <label className="form-label mb-0">Lyrics</label>
                      <textarea
                        className="form-control"
                        value={t.lyrics ?? ''}
                        onChange={(e) => updateExistingTrack(index, { lyrics: e.target.value })}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        <div align="center">
          <button type="button" className="btn btn-light" onClick={handleCancel}>
            Cancel
          </button>
          <button type="submit" className="btn btn-primary" disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditAlbum;
