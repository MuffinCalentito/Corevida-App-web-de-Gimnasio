import React, { useEffect } from 'react';
import './Alert.css';

const Alert = ({ message, type = 'error', onClose }) => {
  // Temporizador para que la alerta desaparezca sola
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 4000);

    // Limpiar el temporizador si el componente se desmonta
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className={`alert-container ${type}`}>
      <p className="alert-message">{message}</p>
      <button className="alert-close-btn" onClick={onClose}>
        &times; 
      </button>
    </div>
  );
};

export default Alert;