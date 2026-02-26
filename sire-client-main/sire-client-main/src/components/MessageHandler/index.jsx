import React from 'react';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

const MessageHandler = ({ message, type, open, onClose }) => {
    return (
        <Snackbar 
            anchorOrigin={{ vertical: "top", horizontal: "right" }}
            open={open} 
            autoHideDuration={6000} 
            onClose={onClose}>
            <Alert onClose={onClose} severity={type} sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

export default MessageHandler;