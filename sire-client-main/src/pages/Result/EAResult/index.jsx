import React, { useEffect, useState } from "react";
import "./styles.css";
import ResultBox from "../ResultBox";
import EAAtivo from "../../../assets/ea-ativo.png";
import EAReflexivo from "../../../assets/ea-reflexivo.png";
import EATeorico from "../../../assets/ea-teorico.png";
import EAPragmatico from "../../../assets/ea-pragmatico.png";


const EAResult = ({ scores }) => {
    const numberOfMainStudyOptionsToShow = 1;
    const [mainStudyOption, setMainStudyOption] = useState(null);
    const [activeIndex, setActiveIndex] = useState(1);
    const [mainIndex, setMainIndex] = useState(null);

    const typeTextColor = {
        1: "primary-color",
        2: "red-color",
        3: "orange-color",
        4: "ligth-blue-color"
    }

    const handleMouseClick = (index) => {
        setActiveIndex(index);
    };

    useEffect(() => {
        const getMainStudyOption = () => {
            if (scores && !mainIndex) {
                const sortedScores = scores.slice().sort((a, b) => b.value - a.value);
                setMainStudyOption(getStudyOptionsByMaxScoreAsString(sortedScores));
                let index = scores.findIndex(score => score.description === sortedScores[0].description) + 1;
                setActiveIndex(index);
                setMainIndex(index);
            }
        };
        getMainStudyOption();
    }, [scores, mainIndex]);

    const getStudyOptionsByMaxScoreAsString = (sortedScores) => {
        const reduceOptionsToString = (acc, el, idx, arr) => {
          const marker = (idx === arr.length - 1) ? ' e ' : ', ';
          return (idx !== 0)
            ? (acc.description || acc) + marker + el.description
            : (el.description || el)
        };
        const count = (numberOfMainStudyOptionsToShow <= sortedScores.length)
            ? numberOfMainStudyOptionsToShow
            : sortedScores.length;
        return sortedScores.slice(0, count).reduce(reduceOptionsToString, '');
    }

    return (
        <div className="ea-result-container">
            <div className="about-section-text-container">
                <p className="secondary-text">
                    Os modelos de estilos de aprendizagem identificam de que forma as informações são percebidas e processadas, 
                    ou seja, as preferências pedagógicas de cada estudante. Quando as metodologias adotadas em sala de aula não 
                    estão em concordância com essas preferências, podem ocorrer dificuldades ou falhas na aprendizagem. Seus resultados seguem abaixo.  
                </p>
                <p className="secondary-text">
                    Alonso e Gallego (2002) constataram no campo educacional há predominância de quatro estilos de aprendizagem 
                    nos estudantes: ativo, reflexivo, teórico e pragmático, e elaboraram uma relação de características que 
                    determinam o campo de habilidade de cada um desses estilos.
                </p>
                <p className="secondary-text">
                    Estes resultados identificam as suas preferências, indicando como você percebe, interage e responde ao ambiente de aprendizagem.
                </p>
            </div>

            <div className="result-type-area">
                Seu principal Estilo de Aprendizado é: <span 
                    className={`type-text ${mainIndex && mainStudyOption ? typeTextColor[mainIndex] : "primary-color"}`}>
                        {mainStudyOption ? mainStudyOption : ""}
                </span>
            </div>

            <div className="result-box-container">
                <ResultBox 
                    index={1}
                    type={"Ativo"}
                    activeIndex={activeIndex}
                    handleMouseClick={handleMouseClick}
                    percent={scores && scores[0] ? scores[0].value * 100 : 0}
                    backgroundColor={"bg-primary-color"}
                />

                <ResultBox 
                    index={2}
                    type={"Reflexivo"}
                    activeIndex={activeIndex}
                    handleMouseClick={handleMouseClick}
                    percent={scores && scores[1] ? scores[1].value * 100 : 0}
                    backgroundColor={"bg-red"}
                />

                <ResultBox 
                    index={3}
                    type={"Teórico"}
                    activeIndex={activeIndex}
                    handleMouseClick={handleMouseClick}
                    percent={scores && scores[2] ? scores[2].value * 100 : 0}
                    backgroundColor={"bg-orange"}
                />

                <ResultBox index={4}
                    type={"Pragmático"}
                    activeIndex={activeIndex}
                    handleMouseClick={handleMouseClick}
                    percent={scores && scores[3] ? scores[3].value * 100 : 0}
                    backgroundColor={"bg-ligth-blue"}
                />
            </div>

            <div className={`result-description ${activeIndex === 1 ? 'active' : ''}`}>
                <div className="result-description-image-section">
                    <img src={EAAtivo} alt="Pessoa pulando" />
                </div>
                <div className="result-description-text-section">
                    <h2>Ativo</h2>
                    <p className="secondary-text">
                        {/* Mente aberta para tarefas novas. Vida em grupo e dias repletos de atividades. 
                        Gostam de desafios e possibilitam novas experiências em prazos curtos. */}
                        Totalmente envolvidos e sem preconceitos em novas experiências, têm a mente aberta, 
                        realizam novas tarefas com entusiasmo. Crescem enfrentando os desafios de novas experiências e 
                        ficam entediados com prazos longos. Se envolvem nos assuntos dos outros e centralizam todas as atividades ao seu redor.
                    </p>
                    <p className="secondary-text">
                        <span style={{ fontWeight: 700 }}>Características:</span> animador, improvisador, descobridor, arrojado e espontâneo.
                    </p>
                </div>
            </div>

            <div className={`result-description ${activeIndex === 2 ? 'active' : ''}`}>
                <div className="result-description-image-section">
                    <img src={EAReflexivo} alt="Pessoa pulando" />
                </div>
                <div className="result-description-text-section">
                    <h2>Reflexivo</h2>
                    <p className="secondary-text">
                        {/* Consideram uma experiência de diferentes perspectivas e analisam dados detalhadamente
                        antes de formular uma conclusão, tomar uma decisão ou agir. Preferem observar em vez
                        de serem observados. */}
                        Pessoas que gostam de considerar experiências e observá-las de diferentes perspectivas; analisam os dados cuidadosamente e 
                        pensam antes de agir. Consideram todas as alternativas possíveis antes de fazer um movimento; observam o desempenho dos 
                        outros e não intervêm até que tenham assumido a situação. Criam um ar levemente distante e condescendente ao redor deles.
                    </p>
                    <p className="secondary-text">
                        <span style={{ fontWeight: 700 }}>Características:</span> ponderador, consciente, receptivo, analíticos e compreenivo.
                    </p>
                </div>
            </div>

            <div className={`result-description ${activeIndex === 3 ? 'active' : ''}`}>
                <div className="result-description-image-section">
                    <img src={EATeorico} alt="Pessoa pulando" />
                </div>
                <div className="result-description-text-section">
                    <h2>Teórico</h2>
                    <p className="secondary-text">
                        {/* Encaram os problemas de forma lógica e integram o que fazem em teorias complexas e coerentes.
                        Gostam de analisar e sintetizar e são profundas ao pensar sobre princípios, teorias e modelos.
                        Relacionalidade e a objetividade, tendendo ao perfeccionismo. */}
                        Adaptam e integram observações em teorias lógicas e complexas; focam em etapas lógicas. Gostam de analisar e sintetizar. 
                        Tendem a ser perfeccionistas; Integram os fatos em teorias coerentes e são profundos em seu sistema de pensamento ao 
                        estabelecer princípios, teorias e modelos. Buscam racionalidade e objetividade, fugindo do subjetivo e do ambíguo.
                    </p>
                    <p className="secondary-text">
                        <span style={{ fontWeight: 700 }}>Características:</span> metódico, lógico, objetivo, crítico e estruturado.
                    </p>
                </div>
            </div>

            <div className={`result-description ${activeIndex === 4 ? 'active' : ''}`}>
                <div className="result-description-image-section">
                    <img src={EAPragmatico} alt="Pessoa pulando" />
                </div>
                <div className="result-description-text-section">
                    <h2>Pragmático</h2>
                    <p className="secondary-text">
                        {/* Colocam as ideias em prática. Tendem a se distanciar da teoria e são impacientes com discussões e pessoas abstratas.
                        Realista quando precisam tomar decisões e entendem que sempre é possível fazer algo melhor. */}
                        Descobrem o aspecto positivo de novas ideias e aproveitam a primeira oportunidade para experimentá-las. 
                        Agem com rapidez e segurança com as ideias e projetos que os atraem. São impacientes quando há pessoas que teorizam. 
                        Concisos quando há uma decisão a ser tomada ou um problema a ser resolvido. Acreditam que sempre podem fazer melhor.
                    </p>
                    <p className="secondary-text">
                        <span style={{ fontWeight: 700 }}>Características:</span> experimentador, prático, direto, eficaz e realista.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default EAResult;