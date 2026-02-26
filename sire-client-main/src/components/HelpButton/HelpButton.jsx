// HelpButton.jsx
import React, { useState, useEffect } from 'react';
import './HelpButton.css';
import robotTutor from '../../assets/avatar-sire.PNG';


const HelpButton = ({ onClick, className = "" }) => {
  const [showAnimation, setShowAnimation] = useState(true);
 
  // Auto-hide animation after 7 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowAnimation(false);
    }, 6000);
   
    return () => {
      clearTimeout(timer);
    };
  }, []);
 
  return (
    /* 💡 FIX: The 'className' prop is now on the CONTAINER, not the image */
    <div className={`help-button-container ${className}`}>
      {showAnimation && (
        <>
          {/* Expansion rings animation */}
          <div className="help-expansion-rings">
            <div className="help-ring help-ring-1"></div>
            <div className="help-ring help-ring-2"></div>
            <div className="help-ring help-ring-3"></div>
          </div>
         
          {/* Pointer animation */}
          <div className="help-pointer-animation">
            <div className="help-pointer-text">Precisa de ajuda? Clique aqui!</div>
            <div className="help-pointer-arrow"></div>
          </div>
         
          {/* Circular arrows */}
          <div className="help-circular-arrows">
            <svg width="70" height="70" viewBox="0 0 70 70" className="help-circular-arrow">
              <path
                d="M35,10 A25,25 0 1,1 10,35"
                fill="none"
                stroke="rgba(52, 152, 219, 0.6)"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path
                d="M15,30 L10,35 L5,30"
                fill="none"
                stroke="rgba(52, 152, 219, 0.6)"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </>
      )}
     
      <img
        src={robotTutor}
        alt="Robot Tutor"
       
        /* 💡 The 'className' prop is GONE. The mascot is now isolated. */
        className="help-mascot"
       
        onClick={() => {
          setShowAnimation(false);
          onClick();
        }}
       
        /* No width or height here */
       
        style={{ cursor: 'pointer' }}
        role="button"
        aria-label="Abrir tutorial"
      />
    </div>
  );
};


export default HelpButton;
