import React, { useState } from "react";
import MACard from "./MACard";
import ReconhecendoIMEA from "../../../assets/documents/reconhecendo.im.e.ea.pdf";
import AlertDialogSlide from "../../../components/AlertDialogSlide";
import SoundCloudPlayer from "../../../components/SoundCloudPlayer";
import YouTube from 'react-youtube';
import Ativo from "../../../assets/ATIVO.png";
import Reflexivo from "../../../assets/REFLEXIVO.png";
import Teorico from "../../../assets/TEORICO.png";
import Pragmatico from "../../../assets/PRAGMATICO.png";
import EbookRecomendado from "../../../assets/ebook.recomendado.png";
import LivrosRecomendados from "../../../assets/documents/livros.recomendados.pdf";
import ArtigosEstilosAprendizagem from "../../../assets/documents/artigos.sobre.estilos.de.aprendizagem.pdf";
import ArtigosInteligenciasMultiplas from "../../../assets/documents/artigos.sobre.inteligencias.multiplas.pdf";

const MA = () => {
    const [soundCloud, setSoundCloud] = useState(false);
    const [youtube, setYoutube] = useState(false);
    const [EA, setEA] = useState(false);
    const [ebook, setEbook] = useState(false);
    const [imgPath, setImgPath] = useState("");

    const opts = {
        playerVars: {
            autoplay: 0,
            origin: "https://react-sire-client.vercel.app"
        },
    };
    
    const handleEAOpen = (path) => {
        setImgPath(path);
        setEA(true);
    };

    const handleCloseEA = () => {
        setEA(false);
    };

    const handleOpenPDF = (path) => {
        window.open(path, '_blank');
    };

    const handleOpenSoundCloud = () => {
        setSoundCloud(true);
    }

    const handleCloseSoundCloud = () => {
        setSoundCloud(false);
    }

    const handleOpenYouTube = () => {
        setYoutube(true);
    }

    const handleCloseYouTube = () => {
        setYoutube(false);
    }

    const handleOpenEbook = () => {
        setEbook(true);
    }

    const handleCloseEbook = () => {
        setEbook(false);
    }

    const cards = [
        { 
            backgroundColor: '#FF4747',
            description: 'Inteligências e os Estilos de Aprendizagem',
            buttons: [
                { description: 'Abrir', action: handleOpenPDF, path: ReconhecendoIMEA },
            ]
        },
        { 
            backgroundColor: '#F9B13D',
            description: 'Inteligências Múltiplas e Estilos de Aprendizagem',
            buttons: [
                { description: 'Ouvir', action: handleOpenSoundCloud },
                { description: 'Assistir', action: handleOpenYouTube },
            ]
        },
        { 
            backgroundColor: '#2374D0',
            description: 'Recomendações práticas para sala de aula relativas aos Estilos de Aprendizagem',
            buttons: [
                { description: 'Ativo', action: handleEAOpen, path: Ativo },
                { description: 'Reflexivo', action: handleEAOpen, path: Reflexivo },
                { description: 'Teórico', action: handleEAOpen, path: Teorico },
                { description: 'Pragmático', action: handleEAOpen, path: Pragmatico },
            ]
        },
        { 
            backgroundColor: '#308f92',
            description: 'E-book recomendado',
            buttons: [
                { description: 'Abrir', action: handleOpenEbook },
            ]
        },
        {
            backgroundColor: '#990099',
            description: 'Indicações de livros',
            buttons: [
                { description: 'Abrir', action: handleOpenPDF, path: LivrosRecomendados },
            ]
        },
        {
            backgroundColor: '#66AA00',
            description: 'Artigos relacionados',
            buttons: [
                { description: 'Estilos de Aprendizagem', action: handleOpenPDF, path: ArtigosEstilosAprendizagem },
                { description: 'Inteligências Múltiplas', action: handleOpenPDF, path: ArtigosInteligenciasMultiplas },
            ]
        }
    ]

    return (
        <div className="recommendation-container">
            <AlertDialogSlide open={soundCloud} handleClose={handleCloseSoundCloud}>
                <SoundCloudPlayer />
            </AlertDialogSlide>
            <AlertDialogSlide open={youtube} handleClose={handleCloseYouTube}>
                <div className="recommendation-video">
                    <YouTube videoId="242iG_ilems" opts={opts} />
                </div>
            </AlertDialogSlide>
            <AlertDialogSlide open={EA} handleClose={handleCloseEA}>
                <div className="dialog-image-container">
                    <img src={imgPath} alt="Recomendação prática"/>
                </div>
            </AlertDialogSlide>
            <AlertDialogSlide open={ebook} handleClose={handleCloseEbook}>
                <img src={EbookRecomendado} usemap="#imgmap" alt="Ebook recomendado"/>
                <map name="imgmap">
                    <area shape="rect" coords="117,946,733,1047" href="https://www.researchgate.net/publication/311452891_Los_Estilos_de_Aprendizaje_Procedimientos_de_diagnostico_y_mejora" target="_blank"></area>
                </map>
            </AlertDialogSlide>
            <div className="recommendation-header">
                <p className="primary-heading">Recomendação de Materiais de Apoio</p>
            </div>
            <div className="recommendation-content">
                <div className="recommendation-content-description">
                    <div className="recommendation-text-section border-red-color">
                        <p className="secondary-text">
                            Olá professor! Aqui você pode encontrar um conjunto de materiais 
                            complementares para conhecer um pouco mais sobre o perfil cognigito 
                            da sua turma
                        </p>
                    </div>
                    <div className="recommendation-text-section border-orange-color">
                        <p className="secondary-text">
                            A Teoria das Inteligências Múltiplas de Gardner oferece uma base sólida para 
                            a escolha de materiais opcionais, e é importante lembrar que entre 15 e 25 anos, 
                            as inteligências são desenvolvidas a serviço do produtivo, e algum campo cognitivo se solidifica. 
                            Para Travassos (2001) este é o momento da verdade no desenvolvimento da matriz de talento.
                        </p>
                    </div>
                    <div className="recommendation-text-section border-green-color">
                        <p className="secondary-text">
                            Dá para perder esta oportunidade?
                        </p>
                    </div>
                    <div className="recommendation-text-section border-blue-color">
                        <p className="secondary-text">
                            Você encontrará abaixo material sobre os estilos de aprendizagem e as inteligências múltiplas, e artigos e 
                            ferramentas recomendados para facilitar a sua escolha metodológica e personalizar o processo ensino-aprendizagem:
                        </p>
                    </div>
                </div>
                <div className="selected-recommendation">
                    <div className="recommendation-card-content">
                        {cards.map((card, index) => (
                            <MACard
                                key={index}
                                backgroundColor={card.backgroundColor}
                                description={card.description}
                                buttons={card.buttons}
                            />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MA;