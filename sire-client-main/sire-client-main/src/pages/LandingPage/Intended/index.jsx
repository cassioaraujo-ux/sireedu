import React from "react";
import "./styles.css";
import TeacherImage from "../../../assets/Professor.jpg"; 
import StudentImage from "../../../assets/Estudante.jpg";
import ManagerImage from "../../../assets/Gestores.jpg";

const Intended = () => {

    const items = [
        {
            title: "Professores",
            text: "Oferece estratégias pedagógicas adaptadas ao perfil da turma, promovendo aulas mais impactantes e transformadoras, alinhadas às necessidades individuais e coletivas dos estudantes.",
            imageOrder: "order-1",
            descriptionOrder: "order-2",
            backgroundColor: "bg-primary-color",
            image: <img src={TeacherImage} alt="Professor"/>
        },
        {
            title: "Estudantes",
            text: "Fornece recursos personalizados para desenvolver habilidades, autonomia e autoconhecimento.",
            imageOrder: "order-2",
            descriptionOrder: "order-1",
            backgroundColor: "bg-ligth-blue",
            image: <img src={StudentImage} alt="Aluno"/>
        },
        {
            title: "Gestores",
            text: "Gera relatórios e dashboards detalhados, permitindo análises de desempenho e suporte na tomada de decisões estratégicas.",
            imageOrder: "order-1",
            descriptionOrder: "order-2",
            backgroundColor: "bg-red",
            image: <img src={ManagerImage} alt="Gestor"/>
        },
    ]

    return (
        <div className="intended-section-container">
            <div className="intended-text-container">
                <p className="primary-subheading">Para quem se destina?</p>
            </div>
            <div className="intended-item-container">
                {items.map((item) => (
                    <div className="intended-item" key={item.title}>
                        <div className={`intended-image-section ${item.imageOrder}`}>
                            {item.image}
                        </div>
                        <div className={`intended-description-section ${item.descriptionOrder} ${item.backgroundColor}`}>
                            <div className="intended-description-text-section">
                                <p className="intended-description-text-primary-text">{item.title}</p>
                                <p className="intended-description-text-secondary-text">{item.text}</p>
                            </div>
                        </div>
                    </div>
                ))}
                
            </div>
        </div>
    );
}

export default Intended;