import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import "./styles.css";

const RecommendationCard = ({role, code, name, description, relevance, score, handleClick, datatutorial}) => {
    return (
        <Card className="recommendation-card-container" data-tutorial={datatutorial}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '300px',
                margin: '0.5rem',
                cursor: 'default',
            }}>
            
            {/* <CardMedia
                sx={{ height: 140 }}
                image="/static/images/cards/contemplative-reptile.jpg"
                title="green iguana"
            /> */}

            <CardContent>
                {relevance &&
                    <div className="recommendation-card-score-container">
                        <Typography sx={{ display: 'flex', alignItems: 'center' }} component="span">
                            <span className="recommendation-card-relevance">{ relevance }°</span>
                            {role === "Professor" &&
                                <span className="recommendation-card-score">{ Math.ceil(score * 100) }%</span>
                            }
                            <span style={{ marginLeft: '0.4rem', fontSize: '1.2rem'}}>em relevância</span>
                        </Typography>
                    </div>
                }
                <Typography gutterBottom variant="h5" component="div">
                    { name ? name : ""}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    { description ? description : "" }
                </Typography>
            </CardContent>
            <CardActions sx={{ borderTop: '1px solid #ccc' }}>
                <Button onClick={() => handleClick(code)} size="small">Visualizar</Button>
            </CardActions>
        </Card>
    );
}

export default RecommendationCard;