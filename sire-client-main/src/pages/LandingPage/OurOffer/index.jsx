import React from "react";
import "./styles.css";
import DvrIcon from '@mui/icons-material/Dvr';
import ClassIcon from '@mui/icons-material/Class';
import LeaderboardIcon from '@mui/icons-material/Leaderboard';
import PublicIcon from '@mui/icons-material/Public';

const OurOffer = () => {
    const items = [
        {
            title: "Objetos educacionais",
            icon: <DvrIcon />,
            text: "São recursos digitais ou físicos, como vídeos, simuladores, textos ou exercícios, que enriquecem o aprendizado dos estudantes. Eles são selecionados e classificados com base nos estilos de aprendizagem, garantindo maior eficácia",
            background: "bg-primary-color"
        },
        {
            title: "Metodologias de ensino",
            icon: <ClassIcon />,
            text: "O SIREEDU utiliza metodologias ativas adaptadas, como gamificação, aprendizagem baseada em projetos, para atender às necessidades específicas de professores e estudantes, promovendo um ensino mais inclusivo e eficiente",
            background: "bg-red"
        },
        {
            title: "Materiais gratuitos",
            icon: <PublicIcon />,
            text: "O SIREEDU disponibiliza uma biblioteca diversificada de recursos educacionais, como vídeos, artigos e exercícios, adaptados a diferentes estilos de aprendizagem. Esses materiais são completamente gratuitos, garantindo acesso inclusivo e democratizando a educação para estudantes e professores",
            background: "bg-orange"
        },
        {
            title: "Relatórios",
            icon: <LeaderboardIcon />,
            text: "O sistema SIREEDU gera relatórios detalhados e personalizados para professores e gestores acadêmicos. Esses relatórios apresentam análises claras sobre o desempenho dos alunos, identificando padrões e sugerindo intervenções pedagógicas mais assertivas",
            background: "bg-ligth-blue"
        }
    ]

    return (
        <div className="our-offer-section-container">
            <div className="our-offer-text-container">
                <p className="primary-subheading">O que oferecemos?</p>
                <p className="secondary-text">
                    O SIREEDU disponibiliza objetos educacionais e metodologias de ensino gratuitos e compatíveis com a ementa das disciplinas. 
                    Todo o conteúdo é avaliado por especialistas, garantindo qualidade e alinhamento aos estilos de aprendizagem.
                </p>
            </div>
            <div className="our-offer-item-container">
                {items.map((item) => (
                    <div className="our-offer-item" key={item.title}>
                        <div className={`our-offer-icon-container ${item.background}`}>
                            {item.icon}
                        </div>
                        <div className="our-offer-item-text">
                            <p className="secondary-text">
                                {item.title}
                            </p>
                            <p className="third-text">
                                {item.text}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default OurOffer;