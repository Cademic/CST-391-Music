import React, { useState, useEffect } from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';
import DebugHome from './DebugHome';
// import SearchAlbum from './SearchAlbum';
import NavBar from './NavBar';
import EditAlbum from './EditAlbum';
import OneAlbum from './OneAlbum';
import './App.css';
import albums from './albums.json';
import dataSource from './dataSource';

const App = () => {
  const [searchPhrase, setSearchPhrase] = useState('');
  const [albumList, setAlbumList] = useState([]);
  const [currentlySelectedAlbumId, setCurrentlySelectedAlbumId] = useState(0);
  let refresh = false;

  const loadAlbums = async () => {
    try {
      const response = await dataSource.get('/albums');
      setAlbumList(response.data);
    } catch (err) {
      console.error('Failed to load albums from REST service, using local data:', err.message);
      setAlbumList(albums);
    }
  };

  useEffect(() => {
    loadAlbums();
  }, [refresh]);

  const updateSearchResults = async (phrase) => {
    console.log('phrase = ' + phrase);
    setSearchPhrase(phrase);
    // const response = await dataSource.get('/albums/search/description/' + phrase);
    // setAlbumList(response.data);
  };

  const updateSingleAlbum = (id, navigate, uri) => {
    console.log('Update Single Album = ', id);
    console.log('Update Single Album = ', navigate);
    var indexNumber = 0;
    for (var i = 0; i < albumList.length; ++i) {
      if (albumList[i].id === id) indexNumber = i;
    }
    setCurrentlySelectedAlbumId(indexNumber);
    let path = (uri ?? '/show/') + indexNumber;
    console.log('path', path);
    navigate(path);
  };

  const onEditAlbum = async (navigate) => {
    await loadAlbums();
    navigate('/');
  };

  console.log('albumList', albumList);
  const renderedList = albumList.filter((album) => {
    if (
      (album.description && album.description.toLowerCase().includes(searchPhrase.toLowerCase())) ||
      searchPhrase === ''
    ) {
      return true;
    }
    return false;
  });
  console.log('renderedList', renderedList);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        {/* Debug home — swap to SearchAlbum when you finish the debug step */}
        <Route path="/" element={<DebugHome albumList={albumList} />} />
        <Route path="/new" element={<EditAlbum onEditAlbum={onEditAlbum} />} />
        <Route
          path="/edit/:albumId"
          element={<EditAlbum onEditAlbum={onEditAlbum} album={albumList[currentlySelectedAlbumId]} />}
        />
        <Route
          path="/show/:albumId"
          element={<OneAlbum album={albumList[currentlySelectedAlbumId]} albumIndex={currentlySelectedAlbumId} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
