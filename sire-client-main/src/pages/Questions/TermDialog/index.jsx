import * as React from 'react';
import Dialog from '@mui/material/Dialog';
import Slide from '@mui/material/Slide';
import Header from '../../../components/Header';
import "./styles.css";

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const TermDialog = ({ children }) => {
    const [open, setOpen] = React.useState(true);

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <React.Fragment>
            <Dialog
                fullScreen
                open={open}
                onClose={handleClose}
                TransitionComponent={Transition}
            >
                <Header />
                    
                <div className="dialog-content">
                    { children }
                    <div style={{ display: 'flex', justifyContent: 'center' }}>
                        <button style={{ margin: '1rem 0' }} type="button" className="primary-button" onClick={handleClose}>
                            Ocultar e responde ao questionário
                        </button>
                    </div>
                </div>
                
            </Dialog>
        </React.Fragment>
    );
}

export default TermDialog;