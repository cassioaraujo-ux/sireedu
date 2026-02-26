import React from "react";
import "./styles.css";
import UnifespLogo from "../../assets/unifesp-logo.png";
import IFSPLogo from "../../assets/ifsp-logo.png";

const Footer = () => {

    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-image">
                    <img src={IFSPLogo} alt="Logotipo IFSP" />
                </div>
                <div className="footer-text">
                    <p>Copyright &copy; {new Date().getFullYear()} SIREEDU. Todos os direitos reservados.</p>
                    <p>Utilizando software livre</p>
                </div>
                <div className="footer-image">
                    <img src={UnifespLogo} alt="Logotipo Unifesp" />
                </div>
            </div>
        </footer>
    );
}

export default Footer;