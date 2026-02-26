// Analytical.jsx

import React, { useEffect, useState } from "react";
import "./styles.css";
import useFetch from "../../hooks/useFetch";
import { useParams } from "react-router-dom";
import DataTable from "./DataTable";
import PageTitleUpdater from "../../../src/components/PageTitleUpdater";
import ExportCSV from "../../components/ExportCSV";
import Skeleton from '@mui/material/Skeleton';
import TutorialGuide, { useIsMobile } from "../../components/TutorialGuide/TutorialGuide";
import HelpButton from "../../components/HelpButton/HelpButton";
import MobileHelpButton from "../../components/MobileHelpButton/MobileHelpButton";
import BackButton from "../../components/BackButton/BackButton";

const Analytical = () => {
    const { classId, studyId } = useParams();
    const { fetchAnalyticalReport } = useFetch();
    const [dataTableData, setDataTableData] = useState([]);
    const [studyTitle, setStudyTitle] = useState("");
    const [classTitle, setClassTitle] = useState("");
    const [csvData, setCsvData] = useState([]);
    const [loading, setLoading] = useState(true);
    const isMobile = useIsMobile();
    
    // Estados para controlar a exibição e navegação do tutorial
    const [showTutorial, setShowTutorial] = useState(false);
    const [currentTutorialStep, setCurrentTutorialStep] = useState(0);

    const colors = [
        '#10A37F',
        '#FF4747',
        '#F9B13D',
        '#2374D0',
        '#990099',
        '#002254',
        '#DD4477',
        '#66AA00'
    ]

    useEffect(() => {
        const controller = new AbortController();
        const handleFetch = async () => {
            setLoading(true);
            try {
                const data = await fetchAnalyticalReport(classId, studyId, controller);
                setStudyTitle(data.study.description);
                setClassTitle(`${data.sclass.description} (${data.sclass.semester}/${data.sclass.year})`);
                const newData = data.study.options.map((option, index) => 
                    { return { 
                        students: option.students.map((student) => student.first_name + " " + student.last_name),
                        description: option.description,
                        headerColor: colors[index] }
                    }
                );
                setDataTableData(newData);

                const newCsvData = [];
                newData.map((data) => (
                   newCsvData.push(
                        {
                            habilidade: data.description,
                            alunos: data.students.join(",")
                        }
                   ) 
                ));
                setCsvData(newCsvData);

            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Error during fetch:", error);
                }
            } finally {
                setLoading(false);
                
                // Tutoriais não são mais abertos automaticamente
            }
        }

        handleFetch();

        return () => controller.abort();
    }, []);
    
    // Não exibe mais o tutorial automaticamente
    
    /**
     * Define os passos do tutorial com base no estado atual do componente
     * Cada passo contém um seletor CSS para o elemento alvo, um título e uma descrição
     */
    const getTutorialSteps = () => {
        const steps = [
            {
                targetSelector: '.professor-header',
                title: 'Relatório Analítico',
                description: 'Esta página mostra o relatório analítico detalhado do estudo selecionado, com informações sobre as habilidades e perfis dos alunos.'
            },
            {
                targetSelector: '.data-table-content',
                title: 'Distribuição de Alunos',
                description: 'Aqui você pode visualizar a distribuição dos alunos de acordo com as diferentes habilidades ou perfis identificados no estudo.'
            },
            {
                targetSelector: '.data-table-content',
                title: 'Perfis de Aprendizagem',
                description: 'Cada tabela representa um perfil ou habilidade identificada no estudo. Os alunos são agrupados de acordo com suas características predominantes.'
            },
            {
                targetSelector: '[data-tutorial="header"]',
                title: 'Clique INÍCIO',
                description: 'Clique no botão INÍCIO e volte para a página de Estudos Disponíveis e Clique no ícone de "Estudos Educacionais" para acessar as recomendações.'
            }
        ];
        
        return steps;
    };
    
    /**
     * Manipulador para fechar o tutorial
     */
    const handleTutorialClose = () => {
        setShowTutorial(false);
    };
    
    /**
     * Manipulador para quando o tutorial é concluído
     * Marca no localStorage que o tutorial já foi visto
     */
    const handleTutorialComplete = () => {
        localStorage.setItem('tutorial_analytical_seen', 'true');
        setShowTutorial(false);
    };
    
    /**
     * Manipulador para abrir o tutorial manualmente através do botão de ajuda
     */
    const handleOpenTutorial = () => {
        setCurrentTutorialStep(0); // Reinicia o tutorial do primeiro passo
        setShowTutorial(true);
    };
    
    /**
     * Manipulador para mudança de passo no tutorial
     */
    const handleStepChange = (stepIndex) => {
        setCurrentTutorialStep(stepIndex);
    };
    
    return (
        <div className="analytical">
            <div className="analytical-container">
                <PageTitleUpdater title={"Relatório analítico"} />
                <div className="professor-header" style={{ marginBottom: '1rem' }}>
                    <div className="professor-title-header">
                        <p className="primary-heading">Relatório Analítico</p>
                        <h2>{studyTitle}</h2>
                    </div>
                        <h4 style={{ textAlign: 'center' }}>{classTitle}</h4>
                </div>
                <div className="data-table-area">
                    {loading ? (
                    <div>
                        {[...Array(4)].map((_, index) => (
                            <Skeleton
                                key={index}
                                variant="rectangular"
                                height={100}
                                style={{ borderRadius: 5, marginBottom: index < 3 ? 10 : 0 }}
                            />
                        ))}
                    </div>
                    ) : (
                    <div>
                        <ExportCSV data={csvData} filename="analitico.csv" />
                        { dataTableData?.map((data) => (
                        <div key={data.description} className="data-table-content">
                            <DataTable
                                description={data.description}
                                rows={data.students.map((student, index) => { return {id: index, name: student} })}
                                headerColor={data.headerColor}
                            />
                        </div>
                        ))}
                    </div>
                    )}
                </div>
            </div>
            
            {/* Componente de Tutorial - Exibido apenas quando showTutorial for true */}
            <TutorialGuide 
                steps={getTutorialSteps()}
                isOpen={showTutorial}
                onClose={handleTutorialClose}
                onComplete={handleTutorialComplete}
                currentStep={currentTutorialStep}
                onStepChange={handleStepChange}
            />
            
            {/* Botão de Ajuda - Sempre visível no canto da tela */}
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
            <div className="back-button-container"><BackButton /></div>
        </div>
    );
}

export default Analytical;