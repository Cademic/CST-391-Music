import React from 'react';
import SearchForm from './SearchForm';
import AlbumList from './AlbumList';

const SearchAlbum = (props) => {
  console.log('props with update single album ', props);

  return (
    <div className="container">
      <SearchForm onSubmit={props.updateSearchResults} />
      <AlbumList albumList={props.albumList} onClick={props.updateSingleAlbum} />
    </div>
  );
};

export default SearchAlbum;
