import React from "react";
import "./styles.css";
import AssignmentIndOutlinedIcon from '@mui/icons-material/AssignmentIndOutlined';
import FolderSharedOutlinedIcon from '@mui/icons-material/FolderSharedOutlined';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';

const Differences = () => {

    const items = [
        {
            title: "Perfil do estudante",
            icon: <AssignmentIndOutlinedIcon />,
            text: "Proporciona autoconhecimento e autonomia, potencializando suas habilidades e competências",
        },
        {
            title: "Recomendação personalizada",
            icon: <FolderSharedOutlinedIcon />,
            text: "O SIREEDU mapeia os estilos de aprendizagem dos estudantes e oferece metodologias e materiais de estudo alinhados às suas necessidades",
        },
        {
            title: "Professor",
            icon: <SchoolOutlinedIcon />,
            text: "Auxilia os docentes no planejamento pedagógico com estratégias personalizadas para o perfil da turma",
        },
    ]

    return (
        <div className="differences-section-container">
            <div className="differences-text-container">
                <p className="primary-subheading">Nossos diferenciais</p>
                <p className="secondary-text">
                    O SIREEDU busca contribuir para a construção de processos de ensino-aprendizagem mais personalizados.
                    É um sistema adaptativo capaz de identificar as inteligências múltiplas e os estilos de aprendizagem buscando desenvolver um autoconhecimento cognitivo para os estudantes.
                </p>
                <p className="secondary-text">
                    Além disso, o sistema faz recomendações personalizadas de metodologias de ensino-aprendizagem para os professores e de objetos educacionais para os estudantes.
                    Dentro de Nossos diferenciais temos: Recomendação personalizada, Professor, e Perfil do estudante.
                </p>
            </div>
            <div className="differences-item-container">
                {items.map((item) => (
                    <div className="differences-item" key={item.title}>
                        <div className="differences-icon-container">
                            {item.icon}
                        </div>
                        <div className="differences-item-text">
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

export default Differences;