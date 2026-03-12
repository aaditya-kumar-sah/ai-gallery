import React, { useState } from 'react';
import { FiX, FiCopy, FiZap, FiCheck, FiTrash2 } from 'react-icons/fi';
import axios from 'axios';

const ImageModal = ({ image, onClose, onDescriptionUpdated, onImageDeleted }) => {
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState(null);

  if (!image) return null;

  const handleDescribe = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.post(`http://localhost:5000/api/images/describe/${image._id}`);
      
      // Update image object in parent component to cache the AI description
      onDescriptionUpdated(res.data.image);
    } catch (err) {
      console.error("AI Gen Error:", err);
      setError(err.response?.data?.error || 'Failed to generate description. Ensure Gemini API key is configured.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (image.aiDescription) {
      navigator.clipboard.writeText(image.aiDescription);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this image?")) return;
    
    try {
      setDeleting(true);
      await axios.delete(`http://localhost:5000/api/images/${image._id}`);
      onImageDeleted(image._id);
      onClose(); // Close modal after successful delete
    } catch (err) {
      console.error("Delete Error:", err);
      setError('Failed to delete image.');
      setDeleting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          <FiX size={24} />
        </button>
        
        <div className="modal-image-container">
          <img 
            src={`http://localhost:5000${image.path}`} 
            alt={image.filename} 
            className="modal-image" 
          />
        </div>

        <div className="modal-sidebar">
          <h2>Image Details</h2>
          <p style={{color: 'var(--text-secondary)'}}>
            Uploaded on {new Date(image.uploadDate).toLocaleDateString()}
          </p>
          
          <hr style={{borderColor: 'var(--surface-border)', opacity: 0.5}} />
          
          <p>
            You can use the AI to generate a highly detailed prompt of this image.
            The prompt generated is optimized to recreate this image using AI art generators like Midjourney or DALL-E.
          </p>

          {!image.aiDescription && !loading && (
            <button className="describe-btn" onClick={handleDescribe}>
              <FiZap /> Generate AI Prompt
            </button>
          )}

          {loading && (
            <div className="loader-container">
              <div className="spinner"></div>
              <p>Analyzing image with AI...</p>
            </div>
          )}

          {!loading && !deleting && (
             <button 
                onClick={handleDelete} 
                className="delete-btn"
                style={{ 
                  marginTop: 'auto',  
                  background: 'rgba(239, 68, 68, 0.1)', 
                  color: 'var(--danger-color)', 
                  border: '1px solid var(--danger-color)' 
                }}
             >
               <FiTrash2 /> Delete Image
             </button>
          )}

          {deleting && (
            <div className="loader-container" style={{ marginTop: 'auto' }}>
              <div className="spinner" style={{ borderTopColor: 'var(--danger-color)' }}></div>
              <p style={{ color: 'var(--danger-color)' }}>Deleting...</p>
            </div>
          )}

          {error && (
            <div style={{ color: 'var(--danger-color)', padding: '1rem', background: 'rgba(239, 68, 68, 0.1)', borderRadius: '8px' }}>
              {error}
            </div>
          )}

          {image.aiDescription && !loading && (
            <div className="ai-result">
              <div className="ai-title">
                <FiZap /> AI Generation Prompt
              </div>
              <button className="copy-btn" onClick={handleCopy} title="Copy Prompt">
                {copied ? <FiCheck size={18} color="#4ade80" /> : <FiCopy size={18} />}
              </button>
              <div className="ai-prompt-text">
                {image.aiDescription}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
