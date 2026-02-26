import React from "react";
import "./styles.css";
import Navbar from "../Navbar";
import HomeBanner from "../../../assets/avatar-sire.PNG";
import { FiArrowRight } from "react-icons/fi";
import { useNavigate } from "react-router-dom";


const Home = () => {
    
    const navigate = useNavigate();

    const toLogin = async (event) => {
        event.preventDefault();
        navigate("/login/");
    };

    return (
        <div className="home-container">
            <Navbar />
            <div className="home-banner-container">
                <div className="home-text-section">
                    <h1 className="primary-heading">
                        <span className="primary-color">Si</span>stema de<br />
                        <span className="primary-color">Re</span>comendação de Produtos<br />
                        <span className="primary-color">Edu</span>cacionais e de Metodologias de Ensino<br />
                    </h1>
                    <p className="primary-text">
                        Um "TIC" na Educação - Como eu aprendo? Como eu ensino? Como melhorar os
                        processos de ensino-aprendizagem?
                    </p>
                    <button type="button" className="secondary-button" onClick={toLogin}>
                        Conecte-se <FiArrowRight />{" "}
                    </button>
                </div>
                <div className="home-image-section">
                    <img src={HomeBanner} alt="HomeBanner"/>
                </div>
            </div>
        </div>
    );

}

export default Home;    