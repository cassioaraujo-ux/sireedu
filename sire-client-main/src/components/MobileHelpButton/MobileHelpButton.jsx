import React from 'react';
import './MobileHelpButton.css';

const MobileHelpButton = ({ onClick }) => {
  return (
    <button
      className="mobile-help-button"
      onClick={onClick}
      aria-label="Abrir tutorial"
    >
      ?
    </button>
  );
};

export default MobileHelpButton;
