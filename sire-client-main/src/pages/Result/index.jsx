// Result.jsx
import React, { useEffect, useState } from "react";
import "./styles.css";
import EAResult from "./EAResult";
import IMResult from "./IMResult";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import PageTitleUpdater from "../../components/PageTitleUpdater";
import TutorialGuide, { useIsMobile } from "../../components/TutorialGuide/TutorialGuide";
import HelpButton from "../../components/HelpButton/HelpButton";
import MobileHelpButton from "../../components/MobileHelpButton/MobileHelpButton";
import BackButton from "../../components/BackButton";

const Result = () => {
    const { studyId } = useParams();

    const [scores, setScores] = useState(null);
    const [studyDescription, setStudyDescription] = useState(null);
    const { fetchResult } = useFetch();
    const isMobile = useIsMobile();
    
    // Estado para controlar o tutorial
    const [showTutorial, setShowTutorial] = useState(false);
    // Estado para controlar qual passo está ativo
    const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
    
    // Define os passos do tutorial baseado no studyId
    const getTutorialSteps = () => {
        // Passos comuns para ambos os tipos de resultado
        const commonSteps = [
            {
                targetSelector: '.about-section-text-container',
                title: 'Resultados do seu teste',
                description: 'Nesta página você encontrará os resultados detalhados da sua avaliação.'
            }
        ];
        
        // Passos específicos para Estilos de Aprendizagem
        if (studyId === "1") {
            return [
                ...commonSteps,
                {
                    targetSelector: '.result-box-container',
                    title: 'Gráfico de Estilos de Aprendizagem',
                    description: 'Este gráfico mostra a distribuição dos seus estilos de aprendizagem. Quanto maior a barra, mais predominante é aquele estilo.'
                },
                {
                    targetSelector: '.result-type-area',
                    title: 'Seu estilo predominante',
                    description: 'Aqui você encontra detalhes sobre seu estilo de aprendizagem predominante e sugestões de estudo adequadas.'
                },
                {
                    targetSelector: '.result-box-container',
                    title: 'Outros estilos',
                    description: 'Ao clicar em qualquer um dos outros estilos, você encontrará a descrição deles e dicas complementares.'
                }
            ];
        }
        
        // Passos específicos para Inteligências Múltiplas
        if (studyId === "2") {
            return [
                ...commonSteps,
                {
                    targetSelector: '.result-box-container',
                    title: 'Gráfico de Inteligências Múltiplas',
                    description: 'Este gráfico exibe a distribuição das suas inteligências múltiplas. Observe quais se destacam mais.'
                },
                {
                    targetSelector: '.result-type-area',
                    title: 'Sua inteligência predominante',
                    description: 'Aqui você encontra detalhes sobre sua inteligência principal e como potencializá-la.'
                },
                {
                    targetSelector: '.result-box-container',
                    title: 'Todas as suas inteligências',
                    description: 'Esta seção mostra todas as suas inteligências e como você pode desenvolvê-las no seu processo de aprendizagem.'
                }
            ];
        }
        
        return commonSteps;
    };

    useEffect(() => {
        const controller = new AbortController();
        const loadResult = async () => {
            try {
                const { data } = await fetchResult(studyId, controller);
                setScores(data.study_option_scores);
                setStudyDescription(data.study.description);
                
                // Verificar se é a primeira vez que o usuário vê os resultados
                // O tutorial não é mais aberto automaticamente
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Error during fetch:", error);
                }
            }
        }

        loadResult();

        return () => controller.abort();
    }, [studyId, fetchResult]);
    
    // Manipulador para fechar o tutorial
    const handleTutorialClose = () => {
        setShowTutorial(false);
    };
    
    // Manipulador para quando o tutorial for concluído
    const handleTutorialComplete = () => {
        // Marca que o usuário já viu o tutorial para este tipo de resultado
        localStorage.setItem(`tutorial_result_${studyId}_seen`, 'true');
    };
    
    // Manipulador para reabrir o tutorial
    const handleOpenTutorial = () => {
        setShowTutorial(true);
    };
    
    // Manipulador para reiniciar o tutorial
    const handleResetTutorial = () => {
        // Reinicia o passo atual para o primeiro
        setCurrentTutorialStep(0);
        // Exibe o tutorial
        setShowTutorial(true);
    };
    
    // Manipulador para atualizar o passo atual
    const handleStepChange = (stepIndex) => {
        setCurrentTutorialStep(stepIndex);
    };

    return (
        <div className="result">
            <PageTitleUpdater title={"Resultado"} />
            
            <div className="result-container">
                <div className="result-header">
                    <p className="primary-heading">Resultado</p>
                    <h2>{studyDescription ? studyDescription : ""}</h2>
                </div>
                <div className="result-content-container">
                    {studyId === "1" &&
                        <EAResult scores={scores}/>
                    }

                    {studyId === "2" &&
                        <IMResult scores={scores} />
                    }
                </div>
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
            
            {/* Botão de Ajuda com classe para maior visibilidade */}
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

            {/* Back Button */}
            <div className="back-button-container">
                <BackButton />
            </div>
        </div>
    );
};

export default Result;