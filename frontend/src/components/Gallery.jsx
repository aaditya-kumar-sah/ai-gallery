import React from 'react';
import { FiMaximize2 } from 'react-icons/fi';

const Gallery = ({ images, onImageClick }) => {
  if (!images || images.length === 0) {
    return null; // Handled by App.jsx empty state
  }

  return (
    <div className="gallery-grid">
      {images.map((img) => (
        <div 
          key={img._id} 
          className="gallery-item" 
          onClick={() => onImageClick(img)}
        >
          <img 
            src={`http://localhost:5000${img.path}`} 
            alt={img.filename} 
            className="gallery-image"
            loading="lazy"
          />
          <div className="gallery-item-overlay">
            <FiMaximize2 className="expand-icon" />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Gallery;
