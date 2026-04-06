import React from 'react';
import Card from './Card';
import { useNavigate } from 'react-router-dom';

const AlbumList = (props) => {
  const navigator = useNavigate();

  const handleSelectionOne = (albumId, uri) => {
    console.log('Selected ID is ' + albumId);
    props.onClick(albumId, navigator, uri);
  };

  console.log('props albumList', props);

  const albums = props.albumList.map((album) => (
    <Card
      key={album.id}
      albumId={album.id}
      albumTitle={album.title}
      albumDescription={album.description}
      buttonText="View"
      imgURL={album.image}
      onClick={handleSelectionOne}
    />
  ));

  return <div className="container album-list-container">{albums}</div>;
};

export default AlbumList;
