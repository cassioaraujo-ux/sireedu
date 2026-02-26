import React from "react";
import "./styles.css";

const RecommendationGroup = ({ recommendations, navigate, onCardClick }) => {
    
    const handleInternalClick = (recommendationId) => {
        // If a custom click handler is provided (for Professor), use it
        if (onCardClick) {
            onCardClick(recommendationId);
        } else {
            // Default behavior (for Student)
            navigate(`/recommendation/${recommendationId}`);
        }
    }

    return (
        <div className="recommendation-group-container">
            {recommendations?.map((recommendation) => (
                <div key={recommendation.id} className="recommendation-group-area">
                    <div 
                        className={`recommendation-group-area-content ${recommendation.background}`} 
                        onClick={() => handleInternalClick(recommendation.id)}
                    >
                        <div className={`recommendation-group-icon ${recommendation.color}`}>
                            { recommendation.icon }
                        </div>
                        <div className={`recommendation-group-description ${recommendation.background}`}>
                            <span>{ recommendation.title }</span>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}

export default RecommendationGroup;