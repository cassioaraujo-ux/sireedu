import React from "react";
import "./styles.css";
import YouTube from 'react-youtube';

const About = () => {
    const opts = {
        playerVars: {
            autoplay: 1,
            origin: "https://react-sire-client.vercel.app"
        },
    };

    return (
        <div className="about-section-container">
            <div className="about-section-text-container">
                <p className="primary-subheading">Sobre</p>
                <p className="secondary-text">
                    O SIREEDU é um sistema inovador que utiliza meio de tecnologias inteligentes para adaptar o ensino às necessidades individuais dos estudantes.
                    Ele complementa os processos de ensino-aprendizagem, ajudando professores e estudantes a atingirem todo o seu potencial.
                    Por meio de tecnologias inteligentes, o sistema identifica perfis de aprendizagem para personalizar metodologias de ensino e objetos educacionais.
                </p>
            </div>
            <div className="about-video">
                <YouTube videoId="LIw8s0uMSYY" opts={opts} />
            </div>
        </div>
    );
}

export default About;