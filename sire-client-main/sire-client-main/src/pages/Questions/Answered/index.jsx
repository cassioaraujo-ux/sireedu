import React from "react";
import "./styles.css";
import AnsweredImage from "../../../assets/answered.png"

const Answered = () => {

    return (
        <div className="answered-container">
            <div className="answered-descripton-header">
                <p className="primary-heading">Questionário Respondido</p>
            </div>
            <div className="answered-image-section">
                <img src={AnsweredImage} alt="Respondido"/>
            </div>
            <div className="answered-description-section">
                <p className="secondary-text">Você já respondeu a este formulário. Caso tenha dúvidas, entre em contato com a nossa equipe.</p>
            </div>
        </div>
    );
}

export default Answered;