import React, { useEffect, useState } from "react";
import "./styles.css";
import { useParams } from "react-router-dom";
import useRecommendation from "../../hooks/useRecommendation";
import Description from "./Description";
import data from "./educational-products.json";
import ProductCard from "./ProductCard";
import useForm from "../../hooks/useForm";
import PageTitleUpdater from "../../../src/components/PageTitleUpdater";
import CardSkeleton from "../../components/CardSkeleton";
import TutorialGuide, { useIsMobile } from "../../components/TutorialGuide/TutorialGuide";
import HelpButton from "../../components/HelpButton/HelpButton";
import MobileHelpButton from "../../components/MobileHelpButton/MobileHelpButton";
import BackButton from "../../components/BackButton";
import config from "../../services/config";
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import Button from '@mui/material/Button';
import SortIcon from '@mui/icons-material/Sort';
import ThumbUpAltIcon from '@mui/icons-material/ThumbUpAlt';
import StarIcon from '@mui/icons-material/Star';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import FontDownloadIcon from '@mui/icons-material/FontDownload';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import Tooltip from '@mui/material/Tooltip';
import InfoIcon from '@mui/icons-material/Info';

// Define how many items to fetch per page. This should match your backend's default or be sent as the 'limit'.
const PRODUCTS_PER_PAGE = 12;

const EducationalProduct = () => {
    const { productCode, classId } = useParams();
    const { fetchSpecificProducts } = useRecommendation();

    // --- REVISED STATE MANAGEMENT FOR PAGINATION ---
    const [products, setProducts] = useState([]); // Holds ONLY the products for the current page
    const [loading, setLoading] = useState(false);
    const [totalCount, setTotalCount] = useState(0); // Total number of products from the API
    const [currentPage, setCurrentPage] = useState(1);

    // State for server-side searching and sorting
    const [searchTerm, setSearchTerm] = useState('');
    const [sortOption, setSortOption] = useState('relevance'); // 'alphabetical', 'relevance' or 'rating'
    const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
    
    // State for sort menu
    const [sortMenuAnchorEl, setSortMenuAnchorEl] = useState(null);
    const isSortMenuOpen = Boolean(sortMenuAnchorEl);

    // Your existing state variables
    const [showTutorial, setShowTutorial] = useState(false);
    const [currentTutorialStep, setCurrentTutorialStep] = useState(0);
    const [isComponentMounted, setIsComponentMounted] = useState(false);
    const isMobile = useIsMobile();
    const { registerRecommendation, registerRating, registerFavorite } = useForm();
    const SESSION_STORAGE_KEY = config.tokenName;
    const userInfo = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY) || '{}');
    const role = userInfo.role || '';

    // --- CENTRALIZED DATA FETCHING EFFECT ---
    // Handle favorites filter toggle
    const handleFavoritesToggle = () => {
        if (role === 'Professor') {
            // Show alert for professors
            alert('Funcionalidade de favoritos não está disponível para professores. Esta função é exclusiva para estudantes.');
            return;
        }
        setShowFavoritesOnly(!showFavoritesOnly);
        setCurrentPage(1); // Reset to first page when filter changes
    };

    useEffect(() => {
        const controller = new AbortController();

        const handleFetch = async () => {
            setLoading(true);
            try {
                // Prepare parameters for the API call
                const params = {
                    limit: PRODUCTS_PER_PAGE,
                    offset: (currentPage - 1) * PRODUCTS_PER_PAGE,
                    searchTerm: searchTerm,
                    sort: sortOption,
                    favorites_only: showFavoritesOnly,
                    class_id: classId
                };
                
                // Fetch data using the new parameters
                const data = await fetchSpecificProducts(productCode, params, controller.signal);
                
                setProducts(data.specificProducts || []);
                setTotalCount(data.count || 0);

            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Error during fetch:", error);
                }
            } finally {
                setLoading(false);
            }
        };

        handleFetch();

        return () => controller.abort();

    }, [productCode, currentPage, searchTerm, sortOption, showFavoritesOnly, fetchSpecificProducts, classId]);

    // Calculate total pages based on the count from the API
    const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);

    // --- HANDLERS TO UPDATE STATE AND TRIGGER RE-FETCH ---
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value);
        setCurrentPage(1); // Reset to first page on a new search
    };

    const handleSortChange = (option) => {
        setSortOption(option);
        setCurrentPage(1); // Reset to first page when sorting changes
        setSortMenuAnchorEl(null); // Close the menu
    };
    
    const handleSortMenuClick = (event) => {
        setSortMenuAnchorEl(event.currentTarget);
    };
    
    const handleSortMenuClose = () => {
        setSortMenuAnchorEl(null);
    };
    
    // Get the display text for the current sort option
    const getSortDisplayText = () => {
        switch (sortOption) {
            case 'alphabetical':
                return 'Nome';
            case 'rating':
                return 'Mais votados';
            case 'relevance':
            default:
                return 'Relevância';
        }
    };
    
    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    // --- Handlers for user interactions (Tutorials, etc.) ---
    useEffect(() => {
        const tutorialKey = `tutorial_educational_product_seen_${role}_${productCode}`;
        const hasSeen = localStorage.getItem(tutorialKey);
        
        setIsComponentMounted(true);
    }, [role, productCode]);

    const handleTutorialClose = () => setShowTutorial(false);
    const handleTutorialComplete = () => {
        const tutorialKey = `tutorial_educational_product_seen_${role}_${productCode}`;
        localStorage.setItem(tutorialKey, 'true');
        setShowTutorial(false);
    };
    const handleOpenTutorial = () => {
        setCurrentTutorialStep(0);
        setShowTutorial(true);
    };
    const handleStepChange = (step) => setCurrentTutorialStep(step);

    // --- Tutorial steps logic ---
    const getTutorialSteps = () => {
        const commonSteps = [
            {
                targetSelector: '.educational-product-description',
                title: 'Descrição dos Produtos Educacionais',
                description: 'Aqui você encontra uma descrição detalhada sobre os tipos de produtos educacionais disponíveis para esta recomendação.'
            },
            {
                targetSelector: '.search-bar',
                title: 'Buscar Produtos',
                description: 'Use esta barra de pesquisa para encontrar produtos específicos digitando palavras-chave.'
            },
            {
                targetSelector: '.action-buttons-container',
                title: 'Filtros e Ordenação',
                description: 'Use estes botões para filtrar por favoritos e ordenar os produtos por relevância, nome ou avaliação.'
            },
            {
                targetSelector: '.recommendation-card-content',
                title: 'Lista de Produtos',
                description: 'Aqui estão listados todos os produtos educacionais recomendados. Cada produto possui informações detalhadas e ações específicas.'
            }
        ];

        const roleSpecificSteps = [];
        
        if (role === 'Professor') {
            roleSpecificSteps.push({
                targetSelector: '[datatutorial="0"]',
                title: 'Ações do Professor',
                description: 'Como professor, você pode recomendar produtos para seus alunos clicando no ícone de recomendação e avaliar produtos com os botões de like/dislike.'
            });
        } else if (role === 'Student') {
            roleSpecificSteps.push({
                targetSelector: '[datatutorial="0"]',
                title: 'Ações do Estudante',
                description: 'Como estudante, você pode favoritar produtos, visualizar recomendações dos professores e avaliar produtos com os botões de like/dislike.'
            });
        }

        // Add pagination step only if there are multiple pages
        const totalPages = Math.ceil(totalCount / PRODUCTS_PER_PAGE);
        if (totalPages > 1) {
            roleSpecificSteps.push({
                targetSelector: '.pagination-controls',
                title: 'Navegação entre Páginas',
                description: 'Use estes controles para navegar entre as diferentes páginas de produtos quando houver muitos resultados.'
            });
        }

        return [...commonSteps, ...roleSpecificSteps];
    };
    const steps = getTutorialSteps();

    // --- UPDATE LOCAL STATE FOR USER ACTIONS ---
    const handleProfessorRecommendationClick = async (productId) => {
        const result = await registerRecommendation(productId);
        if (result.success) {
            setProducts(prevState =>
                prevState.map(product =>
                    product.id === productId ? { ...product, professor_recommendation: !product.professor_recommendation } : product
                )
            );
        } else {
            console.error("Failed to register recommendation:", result.message);
        }
    }

    const handleFavoriteClick = async (productId) => {
        const result = await registerFavorite(productId);
        if (result.success) {
            setProducts(prevState =>
                prevState.map(product =>
                    product.id === productId ? { ...product, favorite: !product.favorite } : product
                )
            );
        } else {
            console.error("Failed to register favorite:", result.message);
        }
    }

    const handleRatingClick = async (productId, ratingValue, oldUserVote, newUserVote) => {
        const result = await registerRating(productId, ratingValue);
        if (result.success) {
            const updateProductRating = (product) => {
                if (product.id === productId) {
                    let updatedPosRating = product.pos_rating;
                    let updatedNegRating = product.neg_rating;
                    if (ratingValue === 1) {
                        if (oldUserVote === "Positive") updatedPosRating--;
                        if (oldUserVote === "Negative") { updatedNegRating--; updatedPosRating++; }
                        if (oldUserVote === null) updatedPosRating++;
                    } else {
                        if (oldUserVote === "Negative") updatedNegRating--;
                        if (oldUserVote === "Positive") { updatedPosRating--; updatedNegRating++; }
                        if (oldUserVote === null) updatedNegRating++;
                    }
                    return { ...product, pos_rating: updatedPosRating, neg_rating: updatedNegRating, user_vote: newUserVote };
                }
                return product;
            };
            setProducts(prevState => prevState.map(updateProductRating));
        } else {
            console.error("Failed to register rating:", result.message);
        }
    }
    
    return (
        <div className="educational-product">
            <PageTitleUpdater title={"Produtos educacionais"} />
            
            <div className="educational-product-container">
                <div>
                    <p className="primary-heading">{ data[productCode] ? data[productCode].name : productCode }</p>
                </div>
                <div className="educational-product-description">
                    {data[productCode] && <Description product={data[productCode]}/>}
                </div>
                <div className="search-and-sort-container">
                    <div className="search-bar-container">
                        <TextField
                            className="search-bar"
                            label="Buscar produtos educacionais"
                            variant="outlined"
                            value={searchTerm}
                            onChange={handleSearchChange}
                            InputProps={{
                                startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>),
                            }}
                        />
                    </div>
                    <div className="action-buttons-container">
                        <Tooltip 
                            title={role === 'Professor' ? 'Funcionalidade de favoritos não está disponível para professores. Esta função é exclusiva para estudantes.' : ''}
                            arrow
                            placement="top"
                        >
                            <span>
                                <Button
                                    variant={showFavoritesOnly ? "contained" : "outlined"}
                                    onClick={handleFavoritesToggle}
                                    startIcon={role === 'Professor' ? <InfoIcon /> : <StarIcon />}
                                    size="medium"
                                    disabled={role === 'Professor'}
                                    sx={{ 
                                        color: role === 'Professor' 
                                            ? 'rgba(0, 0, 0, 0.26)' 
                                            : showFavoritesOnly ? 'white' : '#FF9800',
                                        borderColor: role === 'Professor' 
                                            ? 'rgba(0, 0, 0, 0.12)' 
                                            : '#FF9800',
                                        backgroundColor: role === 'Professor' 
                                            ? 'transparent' 
                                            : showFavoritesOnly ? '#FF9800' : 'transparent',
                                        '&:hover': role === 'Professor' ? {} : {
                                            backgroundColor: showFavoritesOnly ? '#F57C00' : 'rgba(255, 152, 0, 0.04)'
                                        },
                                        '&.Mui-disabled': {
                                            color: 'rgba(0, 0, 0, 0.26)',
                                            borderColor: 'rgba(0, 0, 0, 0.12)'
                                        }
                                    }}
                                >
                                    {role === 'Professor' 
                                        ? 'Favoritos (Não disponível)' 
                                        : showFavoritesOnly ? 'Mostrar todos' : 'Somente favoritos'
                                    }
                                </Button>
                            </span>
                        </Tooltip>
                        
                        <Button
                            variant="outlined"
                            onClick={handleSortMenuClick}
                            endIcon={<ExpandMoreIcon />}
                            startIcon={<SortIcon />}
                            size="medium"
                        >
                            Ordenar por: {getSortDisplayText()}
                        </Button>
                        
                        <Menu
                            anchorEl={sortMenuAnchorEl}
                            open={isSortMenuOpen}
                            onClose={handleSortMenuClose}
                            MenuListProps={{
                                'aria-labelledby': 'sort-button',
                            }}
                        >
                            <MenuItem 
                                onClick={() => handleSortChange('relevance')}
                                selected={sortOption === 'relevance'}
                            >
                                <EmojiEventsIcon sx={{ mr: 1 }} />
                                Relevância
                            </MenuItem>
                            <MenuItem 
                                onClick={() => handleSortChange('alphabetical')}
                                selected={sortOption === 'alphabetical'}
                            >
                                <FontDownloadIcon sx={{ mr: 1 }} />
                                Nome
                            </MenuItem>
                            <MenuItem 
                                onClick={() => handleSortChange('rating')}
                                selected={sortOption === 'rating'}
                            >
                                <ThumbUpAltIcon sx={{ mr: 1 }} />
                                Mais votados
                            </MenuItem>
                        </Menu>
                    </div>
                </div>
                <div className="selected-recommendation">
                    {loading ? (
                        <div className="recommendation-card-content">
                            {[...Array(PRODUCTS_PER_PAGE)].map((_, index) => <CardSkeleton key={index} />)}
                        </div>
                    ) : (
                    <div className="recommendation-card-content">
                        {products?.length > 0 ? (
                            products.map((product, index) => (
                                <ProductCard 
                                    key={product.id}
                                    id={product.id}
                                    name={product.name}
                                    info={product.info}
                                    favorite={product.favorite}
                                    professorRecommendation={product.professor_recommendation}
                                    posRating={product.pos_rating}
                                    negRating={product.neg_rating}
                                    userVote={product.user_vote}
                                    link={product.link}
                                    relevance={product.relevance}
                                    handleFavoriteClick={handleFavoriteClick}
                                    handleProfessorRecommendationClick={handleProfessorRecommendationClick}
                                    handleRatingClick={handleRatingClick}
                                    datatutorial={index}
                                />
                            ))
                        ) : (
                            <div className="no-results">
                                <p>
                                    {showFavoritesOnly 
                                        ? 'Nenhum produto favoritado encontrado' + (searchTerm ? ` para "${searchTerm}"` : '')
                                        : 'Nenhum produto encontrado' + (searchTerm ? ` para "${searchTerm}"` : '')
                                    }
                                </p>
                            </div>
                        )}
                    </div>
                    )}
                </div>
                {/* --- RENDER PAGINATION CONTROLS --- */}
                {totalPages > 1 && (
                    <div className="pagination-controls">
                        <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                            Anterior
                        </button>
                        <span>Página {currentPage} de {totalPages}</span>
                        <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                            Próxima
                        </button>
                    </div>
                )}
            </div>
            
            {/* Tutorial Components */}
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
            {!isMobile ? (
                <div className="help-button-wrapper"><HelpButton onClick={handleOpenTutorial} className="visible-help-button" /></div>
            ) : (
                <MobileHelpButton onClick={handleOpenTutorial} />
            )}
            <div className="back-button-container"><BackButton /></div>
        </div>
    );
}

export default EducationalProduct;