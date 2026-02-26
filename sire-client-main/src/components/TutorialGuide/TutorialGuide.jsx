import React, { useState, useEffect, useRef, useLayoutEffect, useCallback } from 'react';
import './TutorialGuide.css'; // Importing your provided CSS

export const useIsMobile = (breakpoint = 768) => {
  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== 'undefined' ? window.innerWidth <= breakpoint : false
  );

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= breakpoint);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
};

const TutorialGuide = ({
  steps,
  isOpen,
  onClose,
  onComplete,
  currentStep: externalCurrentStep = 0,
  onStepChange
}) => {
  const [currentStep, setCurrentStep] = useState(externalCurrentStep);
  const [targetElement, setTargetElement] = useState(null);
  const [tooltipPosition, setTooltipPosition] = useState({ top: '0px', left: '0px', positionClass: 'bottom' });
  const tooltipRef = useRef(null);
  const initialFocusRef = useRef(null);
  const previousActiveElement = useRef(null); // To restore focus after tutorial closes

  // Synchronize current step with external prop
  useEffect(() => {
    setCurrentStep(externalCurrentStep);
  }, [externalCurrentStep]);

  // --- FOCUS TRAPPING AND A11Y LOGIC ---
  useEffect(() => {
    if (!isOpen) {
      // Restore focus to the element that had focus before the tutorial opened
      if (previousActiveElement.current && typeof previousActiveElement.current.focus === 'function') {
        try {
          previousActiveElement.current.focus();
        } catch (e) {
          console.error("Could not restore focus to previous element:", e);
        }
        previousActiveElement.current = null; // Clear the ref
      }
      return;
    }

    // Store the currently active element when the tutorial opens
    if (document.activeElement) {
        previousActiveElement.current = document.activeElement;
    }

    // Set initial focus
    const setInitialFocus = () => {
        if (targetElement) {
            // Make target element programmatically focusable if it's not
            if (targetElement.tabIndex === undefined || targetElement.tabIndex === null || targetElement.tabIndex < 0) {
              targetElement.setAttribute('tabindex', '-1');
            }
            targetElement.focus({ preventScroll: true }); // Focus without scrolling
        } else if (initialFocusRef.current) { // Fallback to first button in tooltip
            initialFocusRef.current.focus({ preventScroll: true });
        }
    };

    // Use a small timeout to ensure elements are rendered before attempting focus
    const focusTimeout = setTimeout(setInitialFocus, 100);

    const handleKeyDown = (event) => {
      if (event.key === 'Tab' && tooltipRef.current) {
        const focusableElements = Array.from(tooltipRef.current.querySelectorAll(
          'button:not([disabled]), [href]:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]):not([disabled])'
        ));

        if (focusableElements.length === 0) return;

        const firstFocusableEl = initialFocusRef.current || focusableElements[0]; // Use ref if available, else first found
        const lastFocusableEl = focusableElements[focusableElements.length - 1];

        if (!event.shiftKey) { // Forward Tab
          if (document.activeElement === lastFocusableEl || !tooltipRef.current.contains(document.activeElement)) {
            event.preventDefault();
            firstFocusableEl.focus();
          }
        } else { // Backward Tab (Shift + Tab)
          if (document.activeElement === firstFocusableEl || !tooltipRef.current.contains(document.activeElement)) {
            event.preventDefault();
            lastFocusableEl.focus();
          }
        }
      } else if (event.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      clearTimeout(focusTimeout);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, targetElement, onClose]); // Added onClose to dependencies

  // --- POSITIONING LOGIC ---
  const calculatePositions = useCallback(() => {
    if (!isOpen || !steps || steps.length === 0 || !tooltipRef.current) {
      setTargetElement(null); // Ensure targetElement is reset if conditions aren't met
      return;
    }

    const current = steps[currentStep];
    if (!current || !current.targetSelector) {
      console.warn(`No targetSelector for step ${currentStep}. Displaying tooltip in center.`);
      setTargetElement(null);
      setTooltipPosition({ top: '50%', left: '50%', positionClass: 'center' });
      return;
    }

    try {
      const element = document.querySelector(current.targetSelector);
      if (!element) {
        console.warn(`Element with selector "${current.targetSelector}" not found for step ${currentStep}. Displaying tooltip in center.`);
        setTargetElement(null);
        setTooltipPosition({ top: '50%', left: '50%', positionClass: 'center' });
        return;
      }

      setTargetElement(element); // Only set if element is found

      const windowHeight = window.innerHeight;
      const windowWidth = window.innerWidth;
      const rect = element.getBoundingClientRect(); // Target element's position
      const tooltipWidth = tooltipRef.current.offsetWidth;
      const tooltipHeight = tooltipRef.current.offsetHeight;
      const padding = 20; // Minimum padding from viewport edges
      const arrowHeight = 15; // Height of the SVG arrow from CSS
      const arrowMargin = 10; // Space between target/tooltip and arrow from CSS
      const arrowSpace = arrowHeight + arrowMargin;

      let top, left, positionClass;

      const spaceBelow = windowHeight - rect.bottom;
      const spaceAbove = rect.top;

      const neededHeightForBottom = tooltipHeight + arrowSpace + padding;
      const neededHeightForTop = tooltipHeight + arrowSpace + padding;

      // Prioritize positioning below, then above, then clamp
      if (spaceBelow >= neededHeightForBottom) {
        top = rect.bottom + arrowSpace;
        positionClass = 'bottom';
      } else if (spaceAbove >= neededHeightForTop) {
        top = rect.top - tooltipHeight - arrowSpace;
        positionClass = 'top';
      } else {
        // If neither ideal space, pick the side with more space and clamp aggressively
        positionClass = (spaceBelow >= spaceAbove) ? 'bottom' : 'top';
        if (positionClass === 'bottom') {
          top = rect.bottom + arrowSpace;
          top = Math.min(top, windowHeight - tooltipHeight - padding); // Clamp from bottom
          top = Math.max(top, padding); // Clamp from top
        } else { // positionClass === 'top'
          top = rect.top - tooltipHeight - arrowSpace;
          top = Math.max(top, padding); // Clamp from top
          top = Math.min(top, windowHeight - tooltipHeight - padding); // Clamp from bottom
        }
      }

      let idealLeft = rect.left + rect.width / 2 - tooltipWidth / 2;
      left = idealLeft;

      left = Math.max(left, padding); // Clamp from left
      left = Math.min(left, windowWidth - tooltipWidth - padding); // Clamp from right

      setTooltipPosition({
        top: `${top}px`,
        left: `${left}px`,
        positionClass,
      });

      // Scroll the target element into view first, block: 'nearest' is more flexible
      element.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

      // After target scrolls, check if tooltip is fully visible and adjust window scroll if needed
      setTimeout(() => {
        if (tooltipRef.current) {
          const tooltipRect = tooltipRef.current.getBoundingClientRect();
          // Check if tooltip is out of bounds in any direction
          let scrollY = 0; // Changed from const to let
          let scrollX = 0; // Changed from const to let

          if (tooltipRect.top < padding) {
            scrollY = tooltipRect.top - padding;
          } else if (tooltipRect.bottom > windowHeight - padding) {
            scrollY = tooltipRect.bottom - (windowHeight - padding);
          }

          if (tooltipRect.left < padding) {
            scrollX = tooltipRect.left - padding;
          } else if (tooltipRect.right > windowWidth - padding) {
            scrollX = tooltipRect.right - (windowWidth - padding);
          }

          if (scrollY !== 0 || scrollX !== 0) {
            window.scrollBy({ top: scrollY, left: scrollX, behavior: 'smooth' });
          }
        }
      }, 350); // Increased timeout to allow for smooth scroll completion
    } catch (error) {
      console.error(`Error in calculatePositions for selector "${current?.targetSelector}":`, error);
      setTargetElement(null); // Ensure no old target is stuck
      setTooltipPosition({ top: '50%', left: '50%', positionClass: 'center' });
    }
  }, [isOpen, currentStep, steps]); // Re-run when these change

  // Use useLayoutEffect for synchronous DOM readings
  useLayoutEffect(() => {
    if (isOpen) {
      calculatePositions();
    }
  }, [currentStep, isOpen, steps, calculatePositions]);

  // Event listeners for resize and scroll (still use useEffect as they trigger state updates)
  useEffect(() => {
    const handleResizeOrScroll = () => {
      if (isOpen) { // Only update if tutorial is open
        calculatePositions();
      }
    };
    window.addEventListener('resize', handleResizeOrScroll);
    window.addEventListener('scroll', handleResizeOrScroll);
    return () => {
      window.removeEventListener('resize', handleResizeOrScroll);
      window.removeEventListener('scroll', handleResizeOrScroll);
    };
  }, [isOpen, calculatePositions]);

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      const newStep = currentStep + 1;
      setCurrentStep(newStep);
      if (onStepChange) {
        onStepChange(newStep);
      }
    } else {
      completeGuide();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      const newStep = currentStep - 1;
      setCurrentStep(newStep);
      if (onStepChange) {
        onStepChange(newStep);
      }
    }
  };

  const completeGuide = () => {
    onComplete && onComplete();
    onClose();
  };

  // Add the style tag to the document head when the component mounts
  // This ensures critical styles are present, especially if CSS file loading is delayed.
  useEffect(() => {
    const styleElement = document.createElement('style');
    styleElement.innerHTML = `
      /* TutorialGuide.css */
      .tutorial-overlay {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 9999;
        pointer-events: none; /* Will be overridden by inline style */
      }

      /* The highlight creates a "window" through the dark overlay */
      .tutorial-highlight {
        position: fixed; /* Ensure fixed position */
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.6);
        border-radius: 4px;
        z-index: 1;
        pointer-events: none;
        background-color: transparent;
        outline: 2px solid rgba(74, 125, 252, 0.5);
        transition: width 0.3s ease, height 0.3s ease, top 0.3s ease, left 0.3s ease; /* Smooth transitions */
      }

      /* Make tutorial tooltip stand out from the darkened background */
      .tutorial-tooltip {
        position: fixed; /* Ensure fixed position */
        width: 300px;
        background-color: white;
        border-radius: 8px;
        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        z-index: 2;
        pointer-events: auto;
        border: 1px solid rgba(74, 125, 252, 0.3);
        transition: top 0.3s ease, left 0.3s ease, transform 0.3s ease; /* Smooth transitions */
      }

      .tooltip-content {
        padding: 16px;
      }

      .tooltip-content h3 {
        margin-top: 0;
        margin-bottom: 8px;
        color: #333;
        font-size: 18px;
      }

      .tooltip-content p {
        margin-bottom: 16px;
        color: #555;
        font-size: 14px;
        line-height: 1.5;
      }

      .tooltip-buttons {
        display: flex;
        justify-content: space-between;
        margin-top: 20px;
      }

      .tooltip-buttons button {
        padding: 8px 16px;
        border-radius: 4px;
        border: none;
        font-size: 14px;
        cursor: pointer;
        transition: background-color 0.2s;
      }

      .btn-prev, .btn-skip {
        background-color: #f5f5f5;
        color: #333;
      }

      .btn-next {
        background-color: #4a7dfc;
        color: white;
      }

      .btn-prev:hover, .btn-skip:hover {
        background-color: #e5e5e5;
      }

      .btn-next:hover {
        background-color: #3a6eec;
      }

      .tooltip-progress {
        display: flex;
        justify-content: center;
        margin-top: 12px;
        margin-bottom: 8px;
      }

      .progress-dot {
        width: 8px;
        height: 8px;
        border-radius: 50%;
        background-color: #ddd;
        margin: 0 4px;
      }

      .progress-dot.active {
        background-color: #4a7dfc;
      }

      .tutorial-arrow {
        position: fixed; /* Ensure fixed position */
        z-index: 2;
        pointer-events: none;
        animation: pulse 1.5s infinite;
        transition: top 0.3s ease, left 0.3s ease, transform 0.3s ease; /* Smooth transitions */
      }

      @keyframes pulse {
        0% {
          transform: translateY(0) rotate(0deg);
          opacity: 0.8;
        }
        50% {
          transform: translateY(-5px) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: translateY(0) rotate(0deg);
          opacity: 0.8;
        }
      }
    `;
    document.head.appendChild(styleElement);

    return () => {
      document.head.removeChild(styleElement);
    };
  }, []); // Empty dependency array means this runs once on mount

  if (!isOpen || !steps || steps.length === 0) return null;

  const currentStepData = steps[currentStep];
  const isLastStep = currentStep === steps.length - 1;

  const arrowHeight = 15;
  const arrowMargin = 10;

  let arrowTop = 0;
  let arrowLeft = 0;
  let arrowTransform = 'translateX(-50%)';

  if (targetElement) {
    arrowTop = tooltipPosition.positionClass === 'top'
      ? targetElement.getBoundingClientRect().top - arrowMargin - arrowHeight
      : targetElement.getBoundingClientRect().bottom + arrowMargin;

    arrowLeft = targetElement.getBoundingClientRect().left +
                targetElement.getBoundingClientRect().width / 2;

    arrowTransform = tooltipPosition.positionClass === 'top' ? 'rotate(180deg) translateX(-50%)' : 'translateX(-50%)';
  }

  return (
    <div className="tutorial-overlay" role="dialog" aria-modal="true" aria-labelledby="tutorial-title" style={{ pointerEvents: isOpen ? 'auto' : 'none' }}>
      {/* Target highlight - position it over the actual target */}
      {targetElement && (
        <div
          className="tutorial-highlight"
          style={{
            width: `${targetElement.getBoundingClientRect().width}px`,
            height: `${targetElement.getBoundingClientRect().height}px`,
            top: `${targetElement.getBoundingClientRect().top}px`,
            left: `${targetElement.getBoundingClientRect().left}px`,
            position: 'fixed', // Explicitly fixed
          }}
        />
      )}

      {/* Animated arrow */}
      {targetElement && (
        <div
          className="tutorial-arrow"
          style={{
            top: `${arrowTop}px`,
            left: `${arrowLeft}px`,
            transform: arrowTransform,
            display: 'block',
            position: 'fixed', // Explicitly fixed
          }}
          aria-hidden="true"
        >
          <svg width="30" height="15" viewBox="0 0 30 15">
            <path d="M15 0L30 15H0L15 0Z" fill="#4a7dfc" />
          </svg>
        </div>
      )}

      {/* Instruction box */}
      <div
        className={`tutorial-tooltip ${tooltipPosition.positionClass}`}
        style={{
          top: tooltipPosition.top,
          left: tooltipPosition.left,
          position: 'fixed', // Explicitly fixed
        }}
        ref={tooltipRef}
      >
        <div className="tooltip-content">
          <h3 id="tutorial-title">{currentStepData.title}</h3>
          <p>{currentStepData.description}</p>

          <div className="tooltip-progress" role="progressbar" aria-valuemin="0" aria-valuemax={steps.length} aria-valuenow={currentStep + 1}>
            {steps.map((_, index) => (
              <div
                key={index}
                className={`progress-dot ${index === currentStep ? 'active' : ''}`}
                aria-hidden="true"
              ></div>
            ))}
            <span className="sr-only">Passo {currentStep + 1} de {steps.length}</span>
          </div>

          <div className="tooltip-buttons">
            {currentStep > 0 && (
              <button
                className="btn-prev"
                onClick={prevStep}
                aria-label="Previous step"
                // Assign initialFocusRef if this is the actual first focusable button
                ref={initialFocusRef}
              >
                Anterior
              </button>
            )}

            <button
              className="btn-skip"
              onClick={completeGuide}
              aria-label="Skip tutorial"
              // If currentStep is 0, 'Skip' might be the first focusable
              ref={currentStep === 0 ? initialFocusRef : null}
            >
              Pular Tutorial
            </button>

            <button
              className="btn-next"
              onClick={nextStep}
              aria-label={isLastStep ? "Complete tutorial" : "Next step"}
            >
              {isLastStep ? 'Completar' : 'Próximo'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TutorialGuide;