// src/components/CustomModal.js

import React from 'react';
import '../css/CustomModal.css';


const CustomModal = ({ isOpen, onClose, message }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>{message}</h2>
        <button onClick={onClose} className="btn">OK</button>
      </div>
    </div>
  );
};

export default CustomModal;
