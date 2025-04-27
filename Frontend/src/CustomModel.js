// CustomModal.js
import React from 'react';
import './CustomModal.css'; // Ensure you have the CSS styles

const CustomModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <p>{message}</p>
        <div className="modal-actions">
          <button className="btn" onClick={onConfirm}>OK</button>
          <button className="btn" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
};

export default CustomModal;
