import React from "react";
import "./styles.css";

const Marker = ({status, section}) => {

    if (status === true) {
        return (
            <div className="marker bg-primary-color">
                {section}
            </div>
        );
    }

    return (
        <div className="marker border color-green bg-white">
            {section}
        </div>
    );
};

export default Marker;
