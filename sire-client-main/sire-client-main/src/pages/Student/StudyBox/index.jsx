import "./styles.css";
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import FeedOutlinedIcon from '@mui/icons-material/FeedOutlined';

const StudyBox = ({title, backgroundColor, answered, onClick, result}) => {
    return (
        <div className="study-box-container" onClick={onClick}>
            <div className={`study-box-header ${backgroundColor}`}>
                {title}
            </div>
            <div className="study-box-content">
                {answered && result &&
                    <div className="study-box-content-result">
                        <span className={`study-box-content-result-score ${backgroundColor}`}>
                            { Math.round(result.score) }%
                        </span>
                        <span className="study-box-content-result-description">
                            { result.description }
                        </span>
                    </div>
                }
                {answered ? (
                    <div className="study-box-text-area">
                        {/* Você já respondeu o questionário de <span>{title}</span> */}
                        {/* Você já respondeu este questionário <br/> */}
                        Clique para visualizar os resultados
                    </div>
                ) : (
                    <div className="study-box-text-area">
                        Responda o questionário de <span className={`${backgroundColor}`}>
                            {title}
                        </span>
                    </div>
                )}
            </div>
            <div className="study-box-footer">
                {answered ? (
                    <div className="study-box-footer-profile">
                        Visualizar
                    </div>
                ) : (
                    <div className="study-box-footer-profile">
                        Responder
                    </div>
                )}

                {answered ? (
                    <div className="study-box-footer-icon">
                        <AssessmentOutlinedIcon />
                    </div>
                ) : (
                    <div className="study-box-footer-icon">
                        <FeedOutlinedIcon />
                    </div>
                )}
                
            </div>
        </div>
    );
};

export default StudyBox;