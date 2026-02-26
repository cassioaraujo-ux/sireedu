import React from "react";
import "./styles.css";
import FAQ from "../../../assets/FAQ.png";
import { Link } from "react-router-dom";


const Error = () => {

    return (
        <div className="error-content">
            <div className="error-image-section">
                <img src={FAQ} alt="SendInvite"/>
            </div>
            <div className="error-instruction-message-section">
                <p className="instruction-message">
                    Requisição inválida ou expirada.
                </p>
            </div>
            <div>
                <Link className="login-link" to="../login">Ir para tela de login</Link>
            </div>
        </div>
    );

};

export default Error;