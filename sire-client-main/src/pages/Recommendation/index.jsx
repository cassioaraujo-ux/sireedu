import React, { useEffect, useState } from "react";
import "./styles.css";
import { useParams } from "react-router-dom";
import config from "../../services/config";
import PE from "./PE";
import ME from "./ME";
import MA from "./MA";
import PageTitleUpdater from "../../components/PageTitleUpdater";
import TutorialGuide, { useIsMobile } from "../../components/TutorialGuide/TutorialGuide";
import HelpButton from "../../components/HelpButton/HelpButton";
import MobileHelpButton from "../../components/MobileHelpButton/MobileHelpButton";
import BackButton from "../../components/BackButton/BackButton";

const EDUCATIONAL_PRODUCTS = '1';
const METHODOLOGY = '2';
const SUPPORT_MATERIALS = '3';
const SESSION_STORAGE_KEY = config.tokenName;

const Recommendation = () => {
  const { recommendationId, classId } = useParams();

    // console.log('Recommendation ID:', recommendationId);
    // console.log('Class ID:', classId);

  const { role } = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY));
  const isMobile = useIsMobile();

  // Estados para o tutorial
  const [showTutorial, setShowTutorial] = useState(false);
  const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
  // Adicionar um estado para controlar se o componente está totalmente montado
  const [isComponentMounted, setIsComponentMounted] = useState(false);

  // Verifica se o tutorial já foi visto para o role específico
  useEffect(() => {
    const tutorialKey = `tutorial_recommendation_seen_${role}`;
    const hasSeen = localStorage.getItem(tutorialKey);
    
    // Marca o componente como montado
    setIsComponentMounted(true);
    
    // Não abre mais o tutorial automaticamente
  }, [role]);

  const handleTutorialClose = () => setShowTutorial(false);
  const handleTutorialComplete = () => {
    // Salva que o tutorial foi visto para o role específico
    const tutorialKey = `tutorial_recommendation_seen_${role}`;
    localStorage.setItem(tutorialKey, 'true');
    setShowTutorial(false);
  };
  const handleOpenTutorial = () => {
    // Reseta para o primeiro passo quando reabrir o tutorial
    setCurrentTutorialStep(0);
    setShowTutorial(true);
  };
  const handleResetTutorial = () => {
    // Remove a marca de tutorial visto
    const tutorialKey = `tutorial_recommendation_seen_${role}`;
    localStorage.removeItem(tutorialKey);
    setCurrentTutorialStep(0);
    setShowTutorial(true);
  };
  const handleStepChange = (step) => setCurrentTutorialStep(step);

  // Define os passos do tutorial de acordo com o role e o tipo de recomendação
  const getTutorialSteps = () => {
    if (recommendationId === EDUCATIONAL_PRODUCTS) {
      if (role === 'Professor') {
        return [
          {
            targetSelector: '.recommendation-content-description',
            title: 'Conteúdo para Professores',
            description: 'Os materiais didáticos estão listados em ordem de relevância para sua turma. Essa seção mostra os principais.',
          },
          {
            targetSelector: '.all-recommendations',
            title: 'Mais Produtos Educacionais',
            description: 'Além dos produtos educacionais mais relevantes, você pode explorar outros materiais.',
          },
          {
            targetSelector: '[data-tutorial="0"]',
            title: 'Clique em "Visualizar"',
            description: 'Clique em "Visualizar" para conhecer as funcionalidades do sistema e recomendar materiais para sua turma.',
          },
        ];
      } else if (role === 'Student') {
        return [
          {
            targetSelector: '.recommendation-content-description',
            title: 'Conteúdo para Alunos',
            description: 'Os materiais didáticos estão ordenados em relevância. Explore as recomendações mais importantes para você.',
          },
          {
            targetSelector: '.recommendation-subtitle',
            title: 'Mais Produtos Educacionais',
            description: 'Clique em "Mais Produtos Educacionais" para explorar livros e outros materiais.',
          },
          {
            targetSelector: '[data-tutorial="0"]',
            title: 'Visualizar Categorias',
            description: 'As categorias mais relevantes aparecem primeiro. Clique em "Visualizar" para saber mais.',
          },
        ];
      }
    }

    if (recommendationId === METHODOLOGY) {
      if (role === 'Professor') {
        return [
          {
            targetSelector: '.recommendation-content-description',
            title: 'Metodologias Recomendadas',
            description: 'As metodologias de ensino estão listadas em ordem de relevância para sua turma.',
          },
          {
            targetSelector: '.selected-recommendation',
            title: 'Metodologias em Destaque',
            description: 'Estas são as principais metodologias sugeridas para suas aulas.',
          },
          {
            targetSelector: '.all-recommendations',
            title: 'Mais Metodologias',
            description: 'Explore outras metodologias disponíveis para diversificar suas aulas.',
          },
        ];
      } else if (role === 'Student') {
        return [
          {
            targetSelector: '.recommendation-content-description',
            title: 'Metodologias Sugeridas',
            description: 'Veja as metodologias de ensino indicadas para auxiliar seus estudos.',
          },
          {
            targetSelector: '.selected-recommendation',
            title: 'Metodologias em Destaque',
            description: 'Estas são as metodologias mais recomendadas para você.',
          },
          {
            targetSelector: '.all-recommendations',
            title: 'Mais Metodologias',
            description: 'Explore a lista completa de metodologias disponíveis.',
          },
        ];
      }
    }

    if (recommendationId === SUPPORT_MATERIALS) {
      if (role === 'Professor') {
        return [
          {
            targetSelector: '.recommendation-content-description',
            title: 'Materiais de Apoio',
            description: 'Abaixo você encontra materiais complementares para suas aulas.',
          },
          {
            targetSelector: '.selected-recommendation',
            title: 'Conteúdo Disponível',
            description: 'Cada card oferece diferentes recursos. Utilize os botões para acessá-los.',
          },
        ];
      } else if (role === 'Student') {
        return [
          {
            targetSelector: '.recommendation-content-description',
            title: 'Materiais de Apoio',
            description: 'Consulte materiais que podem auxiliar nos seus estudos.',
          },
          {
            targetSelector: '.selected-recommendation',
            title: 'Conteúdo Disponível',
            description: 'Explore os cards e clique nos botões para acessar vídeos, e-books e outros materiais.',
          },
        ];
      }
    }

    return [];
  };

  const steps = getTutorialSteps();

  return (
    <div className="recommendation">
      <PageTitleUpdater title="Recomendações" />

      {/* Cabeçalho com Reset Tutorial */}

      {/* Conteúdo das Recomendações */}
      <div className="recommendation-content">
        {/* Corrigido o atributo data-tutorial para corresponder ao seletor no tutorial */}
        {recommendationId === EDUCATIONAL_PRODUCTS && <PE role={role} classId={classId} data-tutorial="recommendation-content"/>}
        {recommendationId === METHODOLOGY && <ME role={role} />}
        {recommendationId === SUPPORT_MATERIALS && <MA />}
      </div>

      {/* Componentes do Tutorial */}
      {isComponentMounted && (role === 'Professor' || role === 'Student') && (
        <TutorialGuide
          steps={steps}
          isOpen={showTutorial}
          onClose={handleTutorialClose}
          onComplete={handleTutorialComplete}
          currentStep={currentTutorialStep}
          onStepChange={handleStepChange}
        />
      )}

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
      {/* Back Button */}
      <div className="back-button-container">
        <BackButton />
      </div>
    </div>
  );
};

export default Recommendation;