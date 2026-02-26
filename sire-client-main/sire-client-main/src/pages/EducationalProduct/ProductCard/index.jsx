import * as React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red, orange, green, blue, grey } from '@mui/material/colors';
import CollectionsBookmarkIcon from '@mui/icons-material/CollectionsBookmark';
import StarIcon from '@mui/icons-material/Star';
import Button from '@mui/material/Button';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ThumbDownIcon from '@mui/icons-material/ThumbDown';
import Tooltip from '@mui/material/Tooltip';
import "./styles.css";

const ProductCard = ({
    id,
    name,
    info,
    favorite,
    professorRecommendation,
    posRating,
    negRating,
    userVote,
    link,
    relevance,
    handleFavoriteClick,
    handleProfessorRecommendationClick,
    handleRatingClick,
    datatutorial
    }) => {

    return (
        <Card data-tutorial={datatutorial}
            className='recommendation-card-container' 
            sx={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '300px',
                margin: '0.5rem',
                cursor: 'default',
            }}>
            <CardContent>
                <Typography component="div">
                    {relevance &&
                        <div className="recommendation-card-score-container" data-tutorial={datatutorial + '-recomendation'}>
                            <Typography sx={{ display: 'flex', alignItems: 'center' }} component="span">
                                <span className="recommendation-card-relevance">{ relevance }°</span>
                                <span style={{ marginLeft: '0.4rem', fontSize: '1.2rem'}}>em relevância</span>
                            </Typography>

                            <Typography gutterBottom component="span">
                                { favorite !== undefined &&
                                <Typography component="span">
                                    { favorite ? (
                                        <IconButton
                                            onClick={() => handleFavoriteClick(id)}
                                            sx={{ color: orange[500] }}
                                            aria-label="recommendaded"
                                        >
                                            <Tooltip title="Favorito" placement="top">
                                                <StarIcon />
                                            </Tooltip>
                                        </IconButton>
                                    ) : (
                                        <IconButton
                                            onClick={() => handleFavoriteClick(id)}
                                            aria-label="recommendaded"
                                        >
                                            <Tooltip title="Favorito" placement="top">
                                                <StarIcon />
                                            </Tooltip>
                                        </IconButton>
                                    )}
                                </Typography>
                                }

                                <Typography component="span">
                                    {professorRecommendation ? (
                                        <Tooltip title="Recomendação do professor" placement="top">
                                            <IconButton
                                                onClick={() => handleProfessorRecommendationClick(id)} 
                                                sx={{ color: blue[600] }}
                                                aria-label="professor recommendation"
                                            >
                                                    <CollectionsBookmarkIcon />
                                            </IconButton>
                                        </Tooltip>
                                    ) : (
                                        <IconButton onClick={() => handleProfessorRecommendationClick(id)} aria-label="professor recommendation">
                                            <CollectionsBookmarkIcon />
                                        </IconButton>
                                    )}
                                </Typography>
                            </Typography>
                        </div>
                    }

                    <Typography gutterBottom variant="h5" component="div">
                        { name }
                    </Typography>

                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    { info }
                </Typography>
            </CardContent>

            <CardActions disableSpacing sx={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #ccc' }}>
                <Typography component="span" sx={{ display: 'flex' }}>
                    <Typography
                        sx={{ 
                            marginRight: 0.25,
                            '&:hover': {
                                backgroundColor: userVote === undefined ? 'transparent' : 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                        component="div"
                        className="product-rating"
                        onClick={() => handleRatingClick(id, 1, userVote, "Positive")}
                    >
                        <ThumbUpIcon sx={{ fontSize: 20, color: `${userVote === 'Positive' ? green[300] : grey[600]}` }} />
                        <Typography component="span">{ posRating }</Typography>
                    </Typography>

                    <Typography
                        sx={{ 
                            marginLeft: 0.25,
                            '&:hover': {
                                backgroundColor: userVote === undefined ? 'transparent' : 'rgba(0, 0, 0, 0.04)'
                            }
                        }}
                        component="div" className="product-rating"
                        onClick={() => handleRatingClick(id, 0, userVote, "Negative")}
                    >
                        <Typography component="span">{ negRating }</Typography>
                        <ThumbDownIcon sx={{ fontSize: 20, color: `${userVote === 'Negative' ? red[300] : grey[600]}` }} />
                    </Typography>
                </Typography>

                <Button href={link} target="_blank" size="small">Saiba mais</Button>
            </CardActions>
        </Card>
    );
}

export default ProductCard;