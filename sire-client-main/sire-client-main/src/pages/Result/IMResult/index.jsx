import React, { useEffect, useState } from "react";
import "./styles.css";
import ResultBox from "../ResultBox";

// Array de ordenação baseada no código, para garantir que os índices
// de 0 a 7 no array de scores correspondam à ordem de exibição no JSX.
const CODE_ORDER = [
    "VERBAL_LINGUISTICA",
    "LOGICA_MATEMATICA",
    "VISUAL_ESPACIAL",
    "INTERPESSOAL",
    "CINESTESICA_CORPORAL",
    "RITMICA_MUSICAL",
    "INTRAPESSOAL",
    "NATURALISTA",
];

const typeTextColor = {
    1: "primary-color",
    2: "red-color",
    3: "orange-color",
    4: "ligth-blue-color",
    5: "purple-color",
    6: "blue-color",
    7: "pink-color",
    8: "leaf-green-color",
}

const IMResult = ({ scores: originalScores }) => {
    // 1. GARANTINDO ORDEM: Copie e ordene os scores imediatamente para que scores[i]
    // corresponda ao tipo de inteligência esperado na renderização (0=Verbal, 1=Lógica, etc.).
    const orderedScores = originalScores ? originalScores.slice().sort((a, b) => {
        return CODE_ORDER.indexOf(a.code) - CODE_ORDER.indexOf(b.code);
    }) : [];
    
    const numberOfMainStudyOptionsToShow = 1;
    const [mainStudyOption, setMainStudyOption] = useState(null);
    const [activeIndex, setActiveIndex] = useState(1);
    const [mainIndex, setMainIndex] = useState(null);

    const handleMouseClick = (index) => {
        setActiveIndex(index);
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
        const getMainStudyOption = () => {
            if (orderedScores.length > 0 && !mainIndex) {
                // 1. Classifique pela pontuação (do maior para o menor) para encontrar o MÁXIMO
                const sortedByValue = orderedScores.slice().sort((a, b) => b.value - a.value);
                setMainStudyOption(getStudyOptionsByMaxScoreAsString(sortedByValue));
                
                // 2. Encontre a posição do item com maior valor no array JÁ ORDENADO pela CODE_ORDER
                const maxScoreItem = sortedByValue[0];
                
                // Encontra o índice de exibição (1 a 8) no array orderedScores
                const index = orderedScores.findIndex(score => score.code === maxScoreItem.code) + 1;
                
                setActiveIndex(index);
                setMainIndex(index);
            }
        };
        getMainStudyOption();
        // Dependências atualizadas: use orderedScores (a cópia)
    }, [orderedScores, mainIndex]);


    return (
        <div className="ea-result-container">
            <div className="about-section-text-container">
                <p className="secondary-text">
                    Gardner (1986) desenvolveu a teoria das Inteligências Múltiplas e sugere que somos excelentes com diferentes 
                    tipos de inteligência, que usadas simultaneamente se complementam e permitem o desenvolvimento de habilidades para resolver problemas.
                </p>
                <p className="secondary-text">
                    Os resultados não "medem inteligências", mas refletem o que você pensa sobre si mesmo, e poderão ajudar os docentes nas estratégias pedagógicas 
                    mais apropriadas à melhoria do processo de ensino e aprendizagem.
                </p>
                <p className="secondary-text">
                    Como cada pessoa apresenta um conjunto único de características, conhecer as suas preferências pode favorecer seu autoconhecimento e 
                    criar um ambiente mais propício à aprendizagem. Seus resultados seguem abaixo.
                </p>
            </div>

            <div className="result-type-area">
                Sua principal Inteligência Múltipla é: <span 
                    className={`type-text ${mainIndex && mainStudyOption ? typeTextColor[mainIndex] : "primary-color"}`}>
                        {mainStudyOption ? mainStudyOption : ""}
                </span>
            </div>

            {/*
                USANDO O ARRAY 'orderedScores' QUE AGORA GARANTE QUE:
                orderedScores[0] é Verbo-Linguística
                orderedScores[1] é Lógico-Matemática
                ...
                orderedScores[7] é Naturalista
            */}
            <div className="result-box-container">
                <ResultBox 
                    index={1}
                    type={"Verbo-Linguística"}
                    activeIndex={activeIndex}
                    handleMouseClick={handleMouseClick}
                    percent={orderedScores && orderedScores[0] ? orderedScores[0].value * 100 : 0}
                    backgroundColor={"bg-primary-color"}
                />

                <ResultBox 
                    index={2}
                    type={"Lógico-Matemática"}
                    activeIndex={activeIndex}
                    handleMouseClick={handleMouseClick}
                    percent={orderedScores && orderedScores[1] ? orderedScores[1].value * 100 : 0}
                    backgroundColor={"bg-red"}
                />

                <ResultBox 
                    index={3}
                    type={"Visual-Espacial"}
                    activeIndex={activeIndex}
                    handleMouseClick={handleMouseClick}
                    percent={orderedScores && orderedScores[2] ? orderedScores[2].value * 100 : 0}
                    backgroundColor={"bg-orange"}
                />

                <ResultBox
                    index={4}
                    type={"Interpessoal"}
                    activeIndex={activeIndex}
                    handleMouseClick={handleMouseClick}
                    percent={orderedScores && orderedScores[3] ? orderedScores[3].value * 100 : 0}
                    backgroundColor={"bg-ligth-blue"}
                />

                <ResultBox
                    index={5}
                    type={"Cinestésica-Corporal"}
                    activeIndex={activeIndex}
                    handleMouseClick={handleMouseClick}
                    percent={orderedScores && orderedScores[4] ? orderedScores[4].value * 100 : 0}
                    backgroundColor={"bg-purple"}
                />

                <ResultBox
                    index={6}
                    type={"Rítmica-Musical"}
                    activeIndex={activeIndex}
                    handleMouseClick={handleMouseClick}
                    percent={orderedScores && orderedScores[5] ? orderedScores[5].value * 100 : 0}
                    backgroundColor={"bg-blue"}
                />

                <ResultBox
                    index={7}
                    type={"Intrapessoal"}
                    activeIndex={activeIndex}
                    handleMouseClick={handleMouseClick}
                    percent={orderedScores && orderedScores[6] ? orderedScores[6].value * 100 : 0}
                    backgroundColor={"bg-pink"}
                />

                <ResultBox
                    index={8}
                    type={"Naturalista"}
                    activeIndex={activeIndex}
                    handleMouseClick={handleMouseClick}
                    percent={orderedScores && orderedScores[7] ? orderedScores[7].value * 100 : 0}
                    backgroundColor={"bg-leaf-green"}
                />
            </div>
            
            {/* Seções de descrição (mantidas iguais, pois dependem apenas do activeIndex) */}
            <div className={`IM-result-description ${activeIndex === 1 ? 'active' : ''}`}>
                <div className="IM-result-description-text-section">
                    <h2>Verbo-Linguística</h2>
                    <p className="secondary-text">
                        Pessoas com inteligência linguística amam palavras, gostam de ler e escrever. 
                        Apreciam as complexidades da estrutura da frase, estrutura da palavra, significado e som. 
                        São hábeis em se comunicar através da palavra escrita e procuram aprimorar suas habilidades.
                    </p>
                </div>
                <div className="IM-result-description-topics-section">
                    <h2>Características</h2>
                    <ul>
                        <li><span style={{ 'fontWeight': 'bold' }}>Descrição:</span> Capacidade de processar rapidamente mensagens linguísticas, de ordenar palavras e de dar sentido lúcido às mensagens.</li>
                        <li><span style={{ 'fontWeight': 'bold' }}>Relação com demais inteligências:</span> Relaciona-se com todas as demais e, particularmente, com a lógico-matemática e a cinestésica-corporal.</li>
                        <li><span style={{ 'fontWeight': 'bold' }}>Habilidades:</span> Descrever, narrar, observar, comparar, relatar, avaliar, concluir, sintetizar, compreender, explicar, memorizar.</li>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Estímulos no Ensino Superior:</span> Análises de casos específicos da área de ensino. Uso da interdisciplinaridade na interpretação de fatos. 
                            Jogos operatórios e diferentes modalidades de Brainstorming.
                        </li>
                    </ul>
                </div>
            </div>

            <div className={`IM-result-description ${activeIndex === 2 ? 'active' : ''}`}>
                <div className="IM-result-description-text-section">
                    <h2>Lógico-Matemática</h2>
                    <p className="secondary-text">
                        Pessoas com inteligência lógica processam informações através da lógica e da razão. Buscam exatidão e precisão em seu aprendizado 
                        e trabalho, e apreciam modelos matemáticos, medições, abstrações e cálculos complexos. Têm facilidade para investigação científico 
                        e métodos quantitativos que dependem da capacidade do pesquisador de observar chegar a uma conclusão.
                    </p>
                </div>
                <div className="IM-result-description-topics-section">
                    <h2>Características</h2>
                    <ul>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Descrição:</span> Facilidade para o cálculo e percepção da geometria espacial. 
                            Prazer específico em resolver problemas com palavras cruzadas, charadas ou lógica, como tangram, jogos de gamão e xadrez.
                        </li>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Relação com demais inteligências:</span> Relaciona-se com a inteligência verbo-linguística, 
                            visual-espacial, cinestésico-corporal e principalmente a rítmico-musical
                        </li>
                        <li><span style={{ 'fontWeight': 'bold' }}>Habilidades:</span> Enumerar, seriar, deduzir, medir, comparar, concluir, provar.</li>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Estímulos no Ensino Superior:</span> Raciocinar logicamente e empregar esse raciocínio 
                            em relações espaciais e operações numéricas. Estímulo a interpretação e a criatividade (interpretação gráfica e numérica). Estudo da lógica.
                        </li>
                    </ul>
                </div>
            </div>

            <div className={`IM-result-description ${activeIndex === 3 ? 'active' : ''}`}>
                <div className="IM-result-description-text-section">
                    <h2>Visual-Espacial</h2>
                    <p className="secondary-text">
                        Pessoas com inteligência visual / espacial têm senso de direção, distância e medição. Aprendem bem através de recursos visuais, 
                        como gráficos, diagramas, imagens telas coloridas. Apreciam artes visuais, como desenho, pintura e fotografia.
                    </p>
                </div>
                <div className="IM-result-description-topics-section">
                    <h2>Características</h2>
                    <ul>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Descrição:</span> Capacidade de perceber formas e objetos mesmo quando apresentados em ângulos não 
                            usuais com precisão, de efetuar transformações sobre as percepções, de imaginar movimento ou deslocamento interno entre as partes de uma configuração, 
                            de recriar aspectos da experiência visual e de perceber as direções no espaço concreto e abstrato.
                        </li>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Relação com demais inteligências:</span> Com todas as demais, principalmente com as inteligências verbo-linguística, 
                            a rítmico-musical e a cinestésico-corporal.
                        </li>
                        <li><span style={{ 'fontWeight': 'bold' }}>Habilidades:</span> Localizar no espaço, localizar no tempo, comparar, observar, deduzir, relatar, combinar, transferir.</li>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Estímulos no Ensino Superior:</span> Uso da espacialidade como instrumento para explorar a criatividade e a flexibilidade. 
                            Atividades do tipo brainstorming. Jogos operatórios (cochicho, painel integrado, jogos de palavras). Estudos de caso como meio de exploração da espacialidade. 
                            Exploração de habilidades operatórias em atividades.
                        </li>
                    </ul>
                </div>
            </div>

            <div className={`IM-result-description ${activeIndex === 4 ? 'active' : ''}`}>
                <div className="IM-result-description-text-section">
                    <h2>Interpessoal</h2>
                    <p className="secondary-text">
                        Pessoas com inteligência interpessoal prosperam com interação social. São adeptos da leitura, e trabalham bem com os outros e têm muitos amigos. 
                        Eles são inclusivos, colaborativos e aprendem através de interação, diálogo e discussões. São entusiasmados e animados e procurados para conselhos, ajuda e conforto.
                    </p>
                </div>
                <div className="IM-result-description-topics-section">
                    <h2>Características</h2>
                    <ul>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Descrição:</span> Capacidade de perceber e compreender outras pessoas, descobrir as forças que as motivam e sentir grande empatia pelo outro indistinto. 
                            Intrapessoal – capacidade de autoestima, automotivação, de formação de um modelo coerente e verídico de si mesmo e do uso desse modelo para operacionalizar a construção da felicidade pessoal e social.
                        </li>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Relação com demais inteligências:</span> Interagem e relacionam-se com todas as demais, particularmente com a verbo-linguística, a naturalista e a cinestésico-corporal.
                        </li>
                        <li><span style={{ 'fontWeight': 'bold' }}>Habilidades:</span> Interagir, perceber, relacionar-se com empatia, apresentar autoestima e autoconhecimento, ser ético.</li>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Estímulos no Ensino Superior:</span> Definição de "missões" para diferentes cursos, que enfatizem a tolerância, o posicionamento critico, responsável e construtivo do homem. 
                            Estudos de ética aplicados as disciplinas acadêmicas. Enfoque da importância da pluralidade e sua aceitação como meio da paz social.
                        </li>
                    </ul>
                </div>
            </div>

            <div className={`IM-result-description ${activeIndex === 5 ? 'active' : ''}`}>
                <div className="IM-result-description-text-section">
                    <h2>Cinestésica-Corporal</h2>
                    <p className="secondary-text">
                        Pessoas com inteligência corporal-cinestésica aprendem através do movimento e da experimentação. Gostam de esportes, dança e atividades 
                        que exigem esforço físico ou criatividade. Apreciam construir coisas e descobrir como funcionam. Eles gostam de usar as mãos, são muito 
                        ativos e apresentam excelentes habilidades motoras e coordenação.
                    </p>
                </div>
                <div className="IM-result-description-topics-section">
                    <h2>Características</h2>
                    <ul>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Descrição:</span> Capacidade de trabalhar habilmente com objetos, tanto os que envolvem a 
                            motricidade dos dedos quanto os que exploram o uso integral do corpo.
                        </li>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Relação com demais inteligências:</span> Principalmente com as inteligências verbo-linguística e visual-espacial.
                        </li>
                        <li><span style={{ 'fontWeight': 'bold' }}>Habilidades:</span> Comparar, medir, relatar, transferir, demostrar, interagir, sintetizar, interpretar, classificar.</li>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Estímulos no Ensino Superior:</span> Desmitificação do uso da expressão corporal e incorporação da linguagem cinestésica 
                            como ferramenta para o desenvolvimento de diferentes habilidades. Atividades culturais do tipo Brainstorming e estudos de caso. 
                            A linguagem gestual como recurso de ampliação de vocabulário globalizado.
                        </li>
                    </ul>
                </div>
            </div>

            <div className={`IM-result-description ${activeIndex === 6 ? 'active' : ''}`}>
                <div className="IM-result-description-text-section">
                    <h2>Rítmica-Musical</h2>
                    <p className="secondary-text">
                        Pessoas com inteligência musical reconhecem sons e tons com facilidade, apreciam música e ritmo. Podem facilmente aprender músicas e melodias e são especialmente dotadas para compor, 
                        cantar ou tocar um instrumento. Podem memorizar conceitos com acilidade e aprendem bem através de palestras, por serem altamente auditivos.
                    </p>
                </div>
                <div className="IM-result-description-topics-section">
                    <h2>Características</h2>
                    <ul>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Descrição:</span> Facilidade para identificar sons diferentes, perceber nuanças em sua intensidade e direção. Reconhece sons naturais e, 
                            na música percebe a distinção entre tom, melodia, ritmo, timbre e frequência. Isola sons em agrupamentos musicais.
                        </li>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Relação com demais inteligências:</span> Principalmente com a inteligência lógico-matemática e cinestésico-corporal.
                        </li>
                        <li><span style={{ 'fontWeight': 'bold' }}>Habilidades:</span> Observar, identificar, relatar, reproduzir, conceituar, combinar.</li>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Estímulos no Ensino Superior:</span> Utilização da linguagem musical como instrumento de comunicação interpessoal e capacidade de expressão. 
                            Estimulação da análise e da capacidade de crítica para textos e para temas musicais. Estimulação da capacidade de classificação e seleção usando referências musicais.
                        </li>
                    </ul>
                </div>
            </div>

            <div className={`IM-result-description ${activeIndex === 7 ? 'active' : ''}`}>
                <div className="IM-result-description-text-section">
                    <h2>Intrapessoal</h2>
                    <p className="secondary-text">
                        Pessoas com inteligência intrapessoal são introspectivas e hábeis em olhar para dentro e descobrir seus próprios sentimentos, motivações e objetivos. 
                        São pessoas intuitivas e geralmente introvertidas. Aprendem de forma independente e através da reflexão.
                    </p>
                </div>
                <div className="IM-result-description-topics-section">
                    <h2>Características</h2>
                    <ul>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Descrição:</span> Capacidade de perceber e compreender outras pessoas, descobrir as forças que as motivam e sentir grande empatia pelo outro indistinto. 
                            Intrapessoal – capacidade de autoestima, automotivação, de formação de um modelo coerente e verídico de si mesmo e do uso desse modelo para operacionalizar a construção da felicidade pessoal e social.
                        </li>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Relação com demais inteligências:</span> Interagem e relacionam-se com todas as demais, particularmente com a verbo-linguística, a naturalista e a cinestésico-corporal.
                        </li>
                        <li><span style={{ 'fontWeight': 'bold' }}>Habilidades:</span> Interagir, perceber, relacionar-se com empatia, apresentar autoestima e autoconhecimento, ser ético.</li>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Estímulos no Ensino Superior:</span> Definição de "missões" para diferentes cursos, que enfatizem a tolerância, o posicionamento critico, responsável e construtivo do homem. 
                            Estudos de ética aplicados as disciplinas acadêmicas. Enfoque da importância da pluralidade e sua aceitação como meio da paz social.
                        </li>
                    </ul>
                </div>
            </div>

            <div className={`IM-result-description ${activeIndex === 8 ? 'active' : ''}`}>
                <div className="IM-result-description-text-section">
                    <h2>Naturalista</h2>
                    <p className="secondary-text">
                        Pessoas com inteligência naturalista têm sensibilidade pela natureza e habilidade para cultivar plantas, vegetais e frutas. 
                        Eles têm uma afinidade com os animais e são bons em treiná-los e entendê-los. Naturalistas podem facilmente distinguir padrões na natureza. 
                        Eles estão cientes e intrigados pelos fenômenos climáticos. Eles são bons em descobrir as maravilhas da natureza. 
                        Os naturalistas adoram andar, escalar, acampar e caminhar. Eles gostam do ar livre. Pessoas com inteligência naturalista são inspiradas e rejuvenescidas pela natureza.
                    </p>
                </div>
                <div className="IM-result-description-topics-section">
                    <h2>Características</h2>
                    <ul>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Descrição:</span> Atração pelo mundo natural e sensibilidade em relação a ele, capacidade de identificação da linguagem natural 
                            a capacidade de êxtase diante da paisagem humanizada, ou não.
                        </li>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Relação com demais inteligências:</span> Interagem e relacionam-se com todas as demais, 
                            especificamente com as inteligências verbo-linguística, rítmico-musical e visual-espacial.
                        </li>
                        <li><span style={{ 'fontWeight': 'bold' }}>Habilidades:</span> Relatar, demonstrar, selecionar, levantar hipótese, classificar, revisar.</li>
                        <li>
                            <span style={{ 'fontWeight': 'bold' }}>Estímulos no Ensino Superior:</span> Estabelecimento de vínculos entre diferentes linguagens e entre as carreiras 
                            administrativas matemáticas jurídicas sociais e naturalistas. Grupos (voluntários) de defesa ambiental e restauração do património natural. Clubes de excursões e caminhadas.
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    );
};

export default IMResult;