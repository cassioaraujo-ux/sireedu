import React from 'react';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import SchoolIcon from '@mui/icons-material/School';
import "./styles.css";

const ClassCard = ({ description, code, year, semester, onClick }) => {
    return (
        <Card 
            className="class-card-container"
            sx={{ 
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                width: '300px',
                margin: '0.5rem',
                cursor: 'default', // Matches RecommendationCard behavior
                boxShadow: '0px 2px 1px -1px rgba(0,0,0,0.2), 0px 1px 1px 0px rgba(0,0,0,0.14), 0px 1px 3px 0px rgba(0,0,0,0.12)'
            }}
        >
            <CardContent>
                {/* Header Section (Replaces Score Container) */}
                <div className="class-card-header-container">
                    <Typography sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%' }} component="span">
                        <SchoolIcon sx={{ fontSize: 50, color: '#40A3A6' }} />
                    </Typography>
                </div>

                {/* Main Content */}
                <Typography gutterBottom variant="h5" component="div" sx={{ textAlign: 'center', fontWeight: 500 }}>
                    {description}
                </Typography>
                
                <Typography variant="body2" sx={{ color: 'text.secondary', textAlign: 'center' }}>
                    {code}
                </Typography>
                
                {/* Badge Section */}
                <div style={{ textAlign: 'center', marginTop: '1rem' }}>
                    <span className="class-card-badge">
                        {year} • {semester}º Semestre
                    </span>
                </div>
            </CardContent>

            {/* Footer Action (Exactly like RecommendationCard) */}
            <CardActions sx={{ borderTop: '1px solid #ccc' }}>
                <Button size="small" onClick={onClick}>Visualizar</Button>
            </CardActions>
        </Card>
    );
}

export default ClassCard;