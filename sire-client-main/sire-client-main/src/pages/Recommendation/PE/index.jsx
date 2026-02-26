import React, { useEffect, useState } from "react";
import RecommendationCard from "../RecommendationCard";
import useRecommendation from "../../../hooks/useRecommendation";
import CardSkeleton from "../../../components/CardSkeleton";
import { useNavigate } from "react-router-dom";

const PE = ({ role, classId }) => {
    const [selectedProducts, setSelectedProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const { fetchAllProductsforStudents, fetchStudentProducts, fetchAllProductsforProfessor, fetchProfessorProducts } = useRecommendation();

    const navigate = useNavigate();
    
    useEffect(() => {
        const controller = new AbortController();
        const handleFetch = async () => {
            setLoading(true);
            try {
                if (role === "Student") {
                    const { selectedProducts } = await fetchStudentProducts(controller.signal);
                    const { allProducts } = await fetchAllProductsforStudents(controller.signal);
                    
                    // Combine unique products
                    const allUniqueProducts = [...selectedProducts];
                    allProducts.forEach(item => {
                        if (!selectedProducts.some(product => item.id === product.id)) {
                            allUniqueProducts.push(item);
                        }
                    });
                    
                    // UPDATED: Show 3 in top section, 6 in bottom section
                    setSelectedProducts(allUniqueProducts.slice(0, 3));
                    setAllProducts(allUniqueProducts.slice(3, 9));

                } else if (role === "Professor") {
                    const { selectedProducts } = await fetchProfessorProducts(classId, controller.signal);
                    const { allProducts } = await fetchAllProductsforProfessor(classId, controller.signal);
                    
                    const combinedProducts = [...selectedProducts];
                    allProducts.forEach(item => {
                        if (!selectedProducts.some(product => item.id === product.id)) {
                            combinedProducts.push(item);
                        }
                    });
                    
                    // Sort by score
                    const sortedProducts = combinedProducts.sort((a, b) => b.score - a.score);
                    
                    // UPDATED: Show 3 in top section, 6 in bottom section
                    setSelectedProducts(sortedProducts.slice(0, 3));
                    setAllProducts(sortedProducts.slice(3, 9));
                }
            } catch (error) {
                if (error.name !== 'AbortError') {
                    if (error.name === 'AxiosError') {
                        if (error.response.status === 409) {
                            console.log("Há questionários não respondidos."); 
                        } else {
                            console.log("Error during fetching:", error); 
                            navigate("/home"); 
                        }
                    }
                }
            } finally {
                setLoading(false);
            }
        }

        handleFetch();

        return () => controller.abort(); 

    }, []);

    const handleClick = (code) => { 
        if (role === "Professor" && classId) {
            navigate(`/educational-product/${code}/class/${classId}`);
        } else {
            navigate(`/educational-product/${code}`);
        }
    }

    return (
        <div className="recommendation-container"> 
            <div className="recommendation-header">
                <p className="primary-heading">Recomendação de Produtos Educacionais</p>
            </div>
            <div className="recommendation-content">
                <div className="recommendation-content-description">
                    <div className="recommendation-text-section border-green-color">
                        {role === "Student" && 
                            <p className="secondary-text">Com base no seu perfil, foram listadas as seguintes recomendações</p>
                        }

                        {role === "Professor" && 
                            <p className="secondary-text">
                                Olá professor. Aqui encontram-se os resultados obtidos para as recomendações de Produtos Educacionais
                                para a sua turma.
                            </p>
                        }
                    </div>
                </div>
                
                {/* --- TOP SECTION (3 ITEMS) --- */}
                <div className="recommendation-subtitle">
                    <h2>Produtos recomendados</h2>
                </div>
                <div className="selected-recommendation">
                    {loading ? ( 
                        <div className="recommendation-card-content">
                            {/* Loading 3 skeletons */}
                            {[...Array(3)].map((_, index) => ( 
                                <CardSkeleton key={index} /> 
                            ))}
                        </div>    
                    ) : (
                        <div className="recommendation-card-content">
                            {selectedProducts.map((product, index) => (
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

                <hr style={{ margin: '1.5rem 0' }}/> 

                {/* --- BOTTOM SECTION (6 ITEMS) --- */}
                <div className="all-recommendations" data-tutorial="recommendation-subtitle-tutorial">
                    <div className="recommendation-subtitle">
                        <h2>Mais produtos educacionais</h2>
                    </div>
                    {loading ? (
                        <div className="recommendation-card-content">
                            {/* Loading 6 skeletons */}
                            {[...Array(6)].map((_, index) => ( 
                                <CardSkeleton key={index} /> 
                            ))}
                        </div>
                    ) : (
                        <div className="recommendation-card-content">
                            {allProducts.map((product, index) => (
                                <RecommendationCard key={product.id}
                                    role={role}
                                    code={product.code}
                                    name={product.name}
                                    description={product.description}
                                    relevance={3 + index + 1} // Starts counting after the top 3
                                    score={product.score}
                                    handleClick={handleClick}
                                    data-tutorial={index}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default PE;