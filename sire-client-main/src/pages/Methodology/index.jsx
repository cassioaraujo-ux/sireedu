import React from "react";
import "./styles.css";
import { useParams } from "react-router-dom";
import Description from "./Description";
import data from "./methodology.json";

const Methodology = () => {
    const { methodologyCode } = useParams();

    return (
        <div className="methodology">
            <div className="methodology-container">
                <div>
                    <p className="primary-heading">{ data[methodologyCode].name }</p>
                </div>
                <div className="educational-product-description">
                    <Description methodology={data[methodologyCode]}/>
                </div>
            </div>
        </div>
    );
}

export default Methodology;