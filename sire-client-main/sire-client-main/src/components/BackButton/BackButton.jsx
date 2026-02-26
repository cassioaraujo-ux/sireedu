import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './BackButton.css';

const BackButton = ({ className = "", customPath = null }) => {
    const navigate = useNavigate();

    const handleBack = () => {
        if (customPath) {
            navigate(customPath);
        } else {
            navigate(-1); // Go back to previous page
        }
    };

    return (
        <Button
            variant="outlined"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            className={`back-button ${className}`}
            size="small"
            sx={{
                borderColor: '#308f92',
                color: '#308f92',
                '&:hover': {
                    backgroundColor: '#308f92',
                    color: 'white',
                    borderColor: '#308f92',
                },
            }}
        >
            Voltar
        </Button>
    );
};

export default BackButton;