import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiUploadCloud, FiImage, FiCamera } from 'react-icons/fi';
import Gallery from './components/Gallery';
import ImageModal from './components/ImageModal';
import './App.css';

function App() {
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true);
  const fileInputRef = React.useRef(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/images');
      setImages(res.data);
    } catch (err) {
      console.error('Error fetching images:', err);
    } finally {
      setLoadingInitial(false);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('image', file);

    setIsUploading(true);
    try {
      const res = await axios.post('http://localhost:5000/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      // Prepend newest image
      setImages([res.data, ...images]);
    } catch (err) {
      console.error('Error uploading image:', err);
      // Optional: Show toast error here
    } finally {
      setIsUploading(false);
    }
  };

  const handleDescriptionUpdated = (updatedImage) => {
    // Update local state with the AI description
    setSelectedImage(updatedImage);
    setImages(images.map((img) => img._id === updatedImage._id ? updatedImage : img));
  };

  const handleImageDeleted = (deletedId) => {
    setImages(images.filter((img) => img._id !== deletedId));
  };

  return (
    <div className="app-container">
      <header>
        <div className="logo">
          <FiCamera className="logo-icon" />
          <span className="logo-text">AI Gallery</span>
        </div>
        
        <div className="upload-btn-container">
          <button 
            disabled={isUploading} 
            onClick={() => {
              if (fileInputRef.current) {
                fileInputRef.current.click();
              }
            }}
          >
            {isUploading ? <div className="spinner" style={{width: 20, height: 20, borderWidth: 2}}></div> : <FiUploadCloud size={20} />}
            {isUploading ? 'Uploading...' : 'Upload Image'}
          </button>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileUpload}
            disabled={isUploading}
            ref={fileInputRef}
            style={{ display: 'none' }}
          />
        </div>
      </header>

      {loadingInitial ? (
        <div className="empty-state" style={{border: 'none', background: 'transparent'}}>
          <div className="loader-container">
            <div className="spinner"></div>
            <p>Loading your masterpiece gallery...</p>
          </div>
        </div>
      ) : images.length > 0 ? (
        <Gallery images={images} onImageClick={setSelectedImage} />
      ) : (
        <div className="empty-state">
          <FiImage className="empty-state-icon" />
          <h2>Your Gallery Filter is Empty</h2>
          <p>Upload a stunning image to begin creating an epic AI generative prompt gallery.</p>
        </div>
      )}

      {selectedImage && (
        <ImageModal 
          image={selectedImage} 
          onClose={() => setSelectedImage(null)} 
          onDescriptionUpdated={handleDescriptionUpdated}
          onImageDeleted={handleImageDeleted}
        />
      )}
    </div>
  );
}

export default App;
