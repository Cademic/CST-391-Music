import React from 'react';

const Card = ({ albumId, albumTitle, albumDescription, imgURL, buttonText, onClick }) => {
  const handleButtonClick = (uri) => {
    if (onClick && albumId != null) onClick(albumId, uri);
  };

  return (
    <div className="card" style={{ width: '18rem' }}>
      <img src={imgURL} className="card-img-top" alt={albumTitle} />
      <div className="card-body">
        <h5 className="card-title">{albumTitle}</h5>
        <p className="card-text">{albumDescription}</p>
        <button type="button" className="btn btn-primary me-2" onClick={() => handleButtonClick('/show/')}>
          {buttonText ?? 'View'}
        </button>
        <button type="button" className="btn btn-secondary" onClick={() => handleButtonClick('/edit/')}>
          Edit
        </button>
      </div>
    </div>
  );
};

export default Card;
