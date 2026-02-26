import "./styles.css";
import NoMatchFound from "../../assets/page-not-found.png";

const NotFound = () => {
    return (
        <div className="not-found">
            <div className="not-found-container">
                <div className="not-found-description-section">
                    <span className="not-found-error">404</span>
                    <span className="not-found-description">
                        PÁGINA NÃO ENCONTRADA
                    </span>
                </div>
                <div className="not-found-image-section">
                    <img src={NoMatchFound} alt="NoMatchFound"/>
                </div>
            </div>
        </div>
    );
}

export default NotFound;