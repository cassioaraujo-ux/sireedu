import React, { useEffect, useState } from "react";
import "./styles.css";


const ResultBox = ({ index, type, activeIndex, handleMouseClick, percent, backgroundColor }) => {

    const [width, setWidth] = useState(0);

    useEffect(() => {
        setTimeout(() => setWidth(percent), 100);
    }, [percent]);

    return (
        <div className="result-box-area" onClick={() => handleMouseClick(index)}>
            <div
                className={`result-box ${activeIndex === index ? `active-box ${backgroundColor}` : 'result-box-bg'}`}
            >
                { type }
            </div>

            <div className="result-bar-container">
                <div 
                    className={`result-bar ${backgroundColor}`} 
                    style={{ 
                        transition: 'width 1s ease',
                        width: `${width}%`,
                    }}>
                    <p className="result-text-percent">{Math.round(percent)}%</p>
                </div>
            </div>
        </div>
    );
};

export default ResultBox;