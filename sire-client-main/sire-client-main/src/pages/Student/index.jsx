import React, { useEffect, useState } from "react";
import "./styles.css";
import StudyBox from "./StudyBox";
import { useNavigate } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import config from "../../services/config";
import PageTitleUpdater from "../../components/PageTitleUpdater";
import RecommendationGroup from "../../components/RecommendationGroup";
import ImportantDevicesIcon from '@mui/icons-material/ImportantDevices';
import CardSkeleton from "../../components/CardSkeleton";
import TutorialGuide, { useIsMobile } from "../../components/TutorialGuide/TutorialGuide";
import HelpButton from "../../components/HelpButton/HelpButton";
import MobileHelpButton from "../../components/MobileHelpButton/MobileHelpButton";
import MenuBookIcon from '@mui/icons-material/MenuBook';

const SESSION_STORAGE_KEY = config.tokenName;
const EA_ID = 1;
const IM_ID = 2;

const Student = () => {
    const [firstName, setFirstName] = useState("");
    const [studiesAnswered, setStudiesAnswered] = useState(null);
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showMascot, setShowMascot] = useState(true); // State to control mascot visibility
    const numberOfMainStudyOptionsToShow = 1;

    // Estados para o tutorial
    const [showTutorial, setShowTutorial] = useState(false);
    const [currentTutorialStep, setCurrentTutorialStep] = useState(0);

    const navigate = useNavigate();
    const { fetchEntryPoint, fetchResult } = useFetch();
    const isMobile = useIsMobile();

    const getSessionData = () => {
        try {
            return JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY)) || {};
        } catch {
            console.warn("Failed to parse session data from localStorage");
            return {};
        }
    }

    const handleLocalStore = () => {
        const sessionData = getSessionData();
        const firstName = sessionData ? sessionData.user.first_name : "";
        setFirstName(firstName);
    };

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

    useEffect(() => {
        const controller = new AbortController();
        const handleFetch = async () => {
            setLoading(true);
            try {
                const sessionData = JSON.parse(localStorage.getItem(config.tokenName));
                if (!sessionData) return;

                const { role } = sessionData;
                const studies = await fetchEntryPoint(role, controller);
                setStudiesAnswered([studies[0].study.answered, studies[1].study.answered]);

                const newResults = await Promise.all(
                    studies.slice(0, 2).map(async (study, idx) => {
                        if (!study.study.answered) return {};
                        const { data } = await fetchResult(idx + 1, controller);
                        const sortedScores = data.study_option_scores.sort((a, b) => b.value - a.value);
                        return {
                            description: getStudyOptionsByMaxScoreAsString(sortedScores, numberOfMainStudyOptionsToShow),
                            score: sortedScores[0].value * 100
                        }
                    })
                );

                setResults(newResults);

            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Error during fetch:", error);
                }
            } finally {
                setLoading(false);
                
                // Tutoriais não são mais abertos automaticamente
            }   
        };
        
        handleFetch();
        handleLocalStore();
        
        return () => controller.abort();
    
    }, []);
    

    const handleClick = (studyId) => {
        if (studiesAnswered) {
            if (studiesAnswered[studyId - 1]) {
                navigate(`/result/${studyId}`);
            } else {
                navigate(`/questions/${studyId}`);
            }
        }
    };
    
    // Define os passos do tutorial
    const getTutorialSteps = () => {
        const steps = [
            {
            targetSelector: '.student-header',
            title: 'Bem-vindo ao SIREEDU',
            description: 'Confira sua saudação e inicie a navegação pelos testes.'
            },
            {
            targetSelector: '.student-message-container',
            title: 'Sobre o Sistema',
            description: 'Leia estas informações para entender como o SIREEDU orienta seus estudos.'
            },
            {
            targetSelector: '.student-study-container',
            title: 'Avaliações Disponíveis',
            description: 'Escolha um dos testes para gerar recomendações personalizadas.'
            }
        ];
        
        // Adiciona um passo para as recomendações se ambos os testes foram respondidos
        if (studiesAnswered && studiesAnswered[0] && studiesAnswered[1]) {
            steps.push({
                targetSelector: '.recommendation-group-area',
                title: 'Recomendações Personalizadas',
                description: 'Após concluir os testes, acesse aqui os produtos sugeridos para você.'
            });
        }
        
        return steps;
    };
    
    // Manipuladores para o tutorial
    const handleTutorialClose = () => {
        setShowTutorial(false);
    };
    
    const handleTutorialComplete = () => {
        localStorage.setItem('tutorial_student_seen', 'true');
    };
    
    const handleOpenTutorial = () => {
        setShowTutorial(true);
    };
    
    const handleStepChange = (stepIndex) => {
        setCurrentTutorialStep(stepIndex);
    };

    return (
        <div className="student">
            <PageTitleUpdater title={"Início"} />
            <div className="student-container">
                <div className="student-header">
                    <p className="primary-heading">Olá, <span>{ firstName }</span></p>
                </div>

                <div className="student-message-container">
                    <div className="student-text-section fade-in">
                        <p className="secondary-text">
                            Seja bem-vindo(a) ao Sistema de Recomendação de Produtos Educacionais e Metodologias de 
                            Ensino baseado na terorias das inteligências Múltiplas (SIREEDU).
                        </p>
                    </div>

                    <div className="student-text-section fade-in">
                        <p className="secondary-text">
                            Ao responder o questionário de estilos de aprendizagem de Honey-Alonso e o inventário das 
                            inteligências múltiplas de Armstrong, os resultados refletirão o que você pensa sobre si mesmo(a), 
                            e auxiliarão os docentes na escolha das ferramentas educacionais mais eficientes para o ensino dessa disciplina.
                        </p>
                    </div>

                    <div className="student-text-section fade-in">
                        <p className="secondary-text" data-tutorial="student-message">
                            Aproveite as recomendações e o material de apoio (infográficos, vídeos, aúdios) para turbinar seu aprendizado. <br />
                            Foram organizados para você.
                        </p>
                    </div>
                </div>
                
                <div className="student-study-container">
                    {loading ? (
                        <div className="student-box-container">
                            <CardSkeleton />
                            <CardSkeleton />
                        </div>
                    ) : (    
                    <div className="student-box-container">
                        <StudyBox data-tutorial="estilos-aprendizagem"
                            title="Estilos de Aprendizagem"
                            backgroundColor="bg-ligth-blue"
                            answered={studiesAnswered && studiesAnswered[0] ? studiesAnswered[0] : false}
                            onClick={() => handleClick(EA_ID)}
                            result={results[0]}
                        />
                        <StudyBox
                            title="Inteligências Múltiplas"
                            backgroundColor="bg-red"
                            answered={studiesAnswered && studiesAnswered[1] ? studiesAnswered[1] : false}
                            onClick={() => handleClick(IM_ID)}
                            result={results[1]}
                            />
                    </div>
                    )}
                </div>
                {studiesAnswered && studiesAnswered[0] && studiesAnswered[1] &&
                <div>
                    <div className="student-text-section fade-in">
                        <p className="secondary-text">
                            Veja as recomendações listadas para o seu perfil.
                        </p>
                    </div>
                    <div className="recommendation-group-area">
                        <div>
                            <RecommendationGroup
                                recommendations={
                                    [{  
                                        id: 1,
                                        title: 'Produtos Educacionais',
                                        color: 'ligth-blue-color',
                                        background: 'bg-ligth-blue',
                                        icon: <ImportantDevicesIcon />,
                                    }]
                                }
                                navigate={navigate}
                            />
                        </div>
                        <div data-tutorial="materiais-de-apoio">
                            <RecommendationGroup data-tutorial="materiais-de-apoio"
                                recommendations={
                                    [
                                        {
                                            id: 3,
                                            title: 'Materiais de Apoio',
                                            color: 'red-color',
                                            background: 'bg-red',
                                            icon: <MenuBookIcon />,
                                        }
                                    ]
                                }
                                navigate={navigate}
                            />   
                        </div>
                    </div>
                </div>
                }
            </div>
            
            {/* Componente de Tutorial */}
            <TutorialGuide 
                steps={getTutorialSteps()}
                isOpen={showTutorial}
                onClose={handleTutorialClose}
                onComplete={handleTutorialComplete}
                currentStep={currentTutorialStep}
                onStepChange={handleStepChange}
            />
            
            {/* Botão de Ajuda */}
            {!isMobile ? (
            <div className="help-button-wrapper">
                <HelpButton
                    onClick={handleOpenTutorial}
                    className="visible-help-button"
                />
            </div>
            ) : (
            <MobileHelpButton onClick={handleOpenTutorial} />
            )}
        </div>
    );
}

export default Student;