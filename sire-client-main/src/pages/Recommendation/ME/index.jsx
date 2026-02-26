import React, { useEffect, useState } from "react";
import RecommendationCard from "../RecommendationCard";
import useRecommendation from "../../../hooks/useRecommendation";
import CardSkeleton from "../../../components/CardSkeleton";
import { useNavigate } from "react-router-dom";

const ME = ({role}) => {
    const [selectedMethodologies, setSelectedMethodologies] = useState([]);
    const [allMethodologies, setAllMethodologies] = useState([]);
    const [loading, setLoading] = useState(false);
    const { fetchMethodologies, fetchProfessorMethodologies } = useRecommendation();

    const navigate = useNavigate();

    useEffect(() => {
        const controller = new AbortController();
        const handleFetch = async () => {
            setLoading(true);
            if (role === "Professor") {
                try {
                    const { selectedMethodology } = await fetchProfessorMethodologies(controller.signal);
                    setSelectedMethodologies(selectedMethodology);
                    
                    const { allMethodology } = await fetchMethodologies(controller.signal);
                    const sortedAllMethodoloy = allMethodology.sort((a, b) => b.score - a.score);
                    setAllMethodologies(sortedAllMethodoloy.filter(item =>
                        !selectedMethodology.some(product => item.id === product.id)
                    ));
                } catch (error) {
                    if (error.name !== 'AbortError') {
                        console.error("Error during fetch:", error);
                    }
                } finally {
                    setLoading(false);
                }
            }
        }

        handleFetch();

        return () => controller.abort();
    }, []);

    const handleClick = (code) => {
        navigate(`/methodology/${code}`);
    }

    return (
        <div className="recommendation-container">
            <div className="recommendation-header">
                <p className="primary-heading">Recomendação de Metodologias de Ensino</p>
            </div>
            <div className="recommendation-content">
                <div className="recommendation-content-description">
                    <div className="recommendation-text-section border-green-color">
                        <p className="secondary-text">
                            Olá professor. Aqui encontram-se os resultados obtidos para as recomendações
                            de Metodologias de Ensino para a sua turma.
                        </p>
                    </div>
                </div>
                <div className="recommendation-subtitle">
                    <h2>Metodologias Recomendadas</h2>
                </div>
                <div className="selected-recommendation">
                    {loading ? (   
                        <div className="recommendation-card-content">
                            {[...Array(3)].map((_, index) => (
                                <CardSkeleton key={index} />
                            ))}
                        </div>     
                    ) : (
                        <div className="recommendation-card-content">
                            {selectedMethodologies?.map((product, index) => (
                                <RecommendationCard key={product.id}
                                    role={role}
                                    code={product.code}
                                    name={product.name}
                                    description={product.description}
                                    relevance={index + 1}
                                    score={product.score}
                                    handleClick={handleClick}
                                />
                            ))}
                        </div>
                    )}    
                </div>

                <hr style={{ 'margin': '1.5rem 0' }}/>

                <div className="all-recommendations">
                    <div className="recommendation-subtitle">
                        <h2>Mais metodologias</h2>
                    </div>
                    {loading ? (
                        <div className="recommendation-card-content">
                            {[...Array(6)].map((_, index) => (
                                <CardSkeleton key={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="recommendation-card-content">
                            {allMethodologies?.map((product, index) => (
                                <RecommendationCard key={product.id}
                                    role={role}
                                    code={product.code}
                                    name={product.name}
                                    description={product.description}
                                    relevance={(selectedMethodologies.length) + index + 1}
                                    score={product.score}
                                    handleClick={handleClick}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

}

export default ME;