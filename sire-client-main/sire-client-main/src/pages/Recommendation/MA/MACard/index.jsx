import * as React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const MACard = ({ backgroundColor, description, buttons }) => {
    return (
        <Card
            className="recommendation-card-container"
            sx={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '315px',
                margin: '0.5rem',
                cursor: 'default',
            }}
        >
            <CardHeader
                sx={{ backgroundColor: `${backgroundColor}` }}
            >
            </CardHeader>
            <CardContent>
                {/* <Typography gutterBottom variant="h6" component="div" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    Inteligências e os Estilos de Aprendizagem
                </Typography> */}
                <Typography variant="body2" sx={{ color: 'text.secondary', fontSize: '1.1rem', textAlign: 'center' }}>
                    { description }
                </Typography>
            </CardContent>
            <CardActions sx={{ borderTop: '1px solid #ccc', display: 'flex', justifyContent: 'center' }}>
                {/* <Button size="small">Estilos de Aprendizagem</Button>
                <Button size="small">Inteligências Múltiplas</Button> */}
                {buttons?.map((button, index) => (
                    <Button
                        key={index}
                        size="small"
                        onClick={() => button.path ? button.action(button.path) : button.action()}
                        sx={{ fontSize: '.7rem', textAlign: 'center' }}
                    >
                        {button.description}
                    </Button>
                ))}
            </CardActions>
        </Card>
    );
}

export default MACard;
