import React, { useEffect, useState } from "react";
import "./styles.css";
import ColumnChart from "../../components/ColumnChart";
import DataTable from "./DataTable";
import useFetch from "../../hooks/useFetch";
import EASynthetic from "./EASynthetic";
import IMSynthetic from "./IMSynthetic";
import { useParams } from "react-router-dom";
import PageTitleUpdater from "../../../src/components/PageTitleUpdater";
import ExportCSV from "../../components/ExportCSV";
import Skeleton from '@mui/material/Skeleton';
import TutorialGuide, { useIsMobile } from "../../components/TutorialGuide/TutorialGuide";
import HelpButton from "../../components/HelpButton/HelpButton";
import MobileHelpButton from "../../components/MobileHelpButton/MobileHelpButton";
import BackButton from "../../components/BackButton/BackButton";

const Synthetic = () => {
    const { classId, studyId } = useParams();
    const { fetchSyntheticReport } = useFetch();
    const [studyTitle, setStudyTitle] = useState("");
    const [classTitle, setClassTitle] = useState("");
    const colors = ['#10A37F', '#FF4747', '#F9B13D', '#2374D0', '#10A37F', '#FF4747', '#F9B13D', '#2374D0'];
    const [chartData, setChartData] = useState(null)
    const [dataTableData, setDataTableData] = useState(null);
    const [csvData, setCsvData] = useState([]);
    const [loading, setLoading] = useState(true);
    
    // Estados para controlar a exibição e navegação do tutorial
    const [showTutorial, setShowTutorial] = useState(false);
    const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
    const isMobile = useIsMobile();

    // ➡️ NOVO: Objeto de Opções do Google Chart com título do eixo Y vertical
    const chartOptions = {
        legend: { position: "none" },
        // Configuração do Eixo Vertical (vAxis)
        vAxis: {
            title: 'Quantide de alunos por habilidade', // Título do Eixo Y
            titleTextStyle: {
                rotation: -90, // **ROTAÇÃO CHAVE:** -90 graus para texto vertical
                textAlign: 'center',
                fontSize: 14,
            },
            viewWindow: {
                min: 0, // Garante que o gráfico comece em zero
            }
        },
        // Opcional: Configuração do Eixo Horizontal (hAxis)
        // hAxis: { title: 'Habilidade' }
    };

    const createData = (id, description, value) => {
        return { id, description, value };
    }

    useEffect(() => {
        const controller = new AbortController();
        const handleFetch = async () => {
            setLoading(true);
            try {
                const data = await fetchSyntheticReport(classId, studyId, controller);
                setStudyTitle(data.study.description);
                setClassTitle(`${data.sclass.description} (${data.sclass.semester}/${data.sclass.year})`);

                const newChartData = [["Element", "", { role: "style" }]];
                data.study.options.map((option, index) => newChartData.push([option.description, option.count, colors[index]]));
                setChartData(newChartData);

                const newRows = data.study.options.map((option, index) => 
                    createData(
                        index,
                        option.description,
                        option.value
                    )
                );
                
                let newCsvData = [];
                newRows.map((row) => (
                    newCsvData.push(
                        {
                            habilidade: row.description,
                            media: row.value.toFixed(4),
                        }
                    )
                ));
                setCsvData(newCsvData);
                
                setDataTableData(newRows);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.log("Error during fetch:", error);
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
        const studyName = studyId === '1' ? 'Estilos de Aprendizagem' : 'Inteligências Múltiplas';
        const steps = [
            {
                targetSelector: '.professor-header',
                title: `Relatório Sintético - ${studyName}`,
                description: 'Observe o cabeçalho para identificar o estudo e a turma analisada.'
            }
        ];
        
        // Adiciona um passo específico para a descrição do estudo
        if (studyId === '1') {
            steps.push({
                targetSelector: '.about-section-text-container',
                title: 'Descrição dos Estilos de Aprendizagem',
                description: 'Consulte o significado de cada estilo para interpretar os resultados.'
            });
        } else if (studyId === '2') {
            steps.push({
                targetSelector: '[data-tutorial="secondary-text"]',
                title: 'Descrição das Inteligências Múltiplas',
                description: 'Conheça cada inteligência para entender o desempenho da turma.'
            });
        }
        
        steps.push({
            targetSelector: '.data-table-section',
            title: 'Tabela de Dados',
            description: 'Confira as médias por habilidade e exporte em CSV se precisar.'
        });

        steps.push({
            targetSelector: '[data-tutorial="header"]',
            title: 'Volte ao início',
            description: 'Use o botão INÍCIO para retornar aos estudos e acessar as recomendações.'
        });
        
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
        const tutorialKey = `tutorial_synthetic_${studyId}_seen`;
        localStorage.setItem(tutorialKey, 'true');
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
        <div className="synthetic">
            <PageTitleUpdater title={"Relatório sintético"} />
            <div className="synthetic-container">
                <div className="professor-header">
                    <div className="professor-title-header">
                        <p className="primary-heading">Relatório Sintético</p>
                        <h2>{studyTitle}</h2>
                    </div>
                        <h4 style={{ textAlign: 'center' }}>{classTitle}</h4>
                </div>
                {studyId && studyId === '1' &&
                    <EASynthetic />
                }
                {studyId && studyId === '2' &&
                    <IMSynthetic />
                }
                <div className="data-table-section" data-tutorial="data-table">
                {dataTableData && !loading ? (
                    <div>
                        <ExportCSV data={csvData} filename="sintetico.csv"  data-tutorial="csv-button"/>
                        <DataTable rows={dataTableData}/>
                    </div>
                ) : (
                    <Skeleton
                        variant="rectangular"
                        height={230}
                        style={{ borderRadius: 5 }}
                    />
                )}
                </div>
                <div className="chart-section">
                {chartData && !loading ? (
                    // 🔑 PASSA AS OPÇÕES PARA O COLUMNCHART
                    <ColumnChart data={chartData} options={chartOptions} /> 
                ) : (
                    <Skeleton
                        variant="rectangular"
                        width={700}
                        height={230}
                        style={{ borderRadius: 5 }}
                    />
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

export default Synthetic;