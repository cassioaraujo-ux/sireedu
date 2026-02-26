import React from "react";
import "./styles.css";
import WelcomeImage from "../../../assets/welcome.png";
import { Link } from "react-router-dom";


const Success = () => {

    return (
        <div className="success-content">
            <div>
                <p className="success-title">E-mail verificado!</p>
            </div>
            <div>
                <p className="instruction-message">Seja bem vindo(a) ao SIREEDU.</p>
            </div>
            <div className="success-image-section">
                <img src={WelcomeImage} alt="SendInvite"/>
            </div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <Link className="login-link" to="../login">Ir para tela de login</Link>
            </div>
        </div>
    );

};

export default Success;