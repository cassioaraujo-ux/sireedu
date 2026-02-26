import React from "react";
import "./styles.css";
import MailSent from "../../../assets/mail-sent.png";
import { Link } from "react-router-dom";

const EmailVerification = ({email}) => {
    return (
        <div className="email-verification-content">
            <p className="password-reset-title">Confirme seu e-mail!</p>
            <p className="instruction-message">
                Para finalizar o cadastro, um e-mail foi enviado para <span className="email">{email}</span> com as instruções e um link para confirmar o seu e-mail. 
                Caso você não receba o e-mail em alguns minutos, verifique a sua caixa de spam.
            </p>
            <div className="email-verification-image-section">
                <img src={MailSent} alt="SendInvite"/>
            </div>
            <div>
                <Link className="login-link" to="../login">Voltar para tela de login</Link>
            </div>
        </div>
    );
}

export default EmailVerification;