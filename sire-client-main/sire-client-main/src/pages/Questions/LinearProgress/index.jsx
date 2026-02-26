import React from "react";
import "./styles.css";


const LinearProgress = ({ percent }) => {
    return (
        <div className="progress-container">
            <div className="progress-bar" style={{ width: `${percent}%` }}>
                <p className="text-percent">{Math.ceil(percent)}%</p>
            </div>
        </div>
    );
};

export default LinearProgress;