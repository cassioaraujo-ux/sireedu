import React, { useState } from "react";
import { Link } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import { blue } from '@mui/material/colors';
import AlertDialogSlide from "../../../components/AlertDialogSlide";
import Characteristics from "../../../assets/im-characteristics.png";

const IMSynthetic = () => {
    const [open, setOpen] = useState(false);

    const handleClickOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <AlertDialogSlide open={open} handleClose={handleClose}>
                <div className="dialog-image-container">
                    <img src={Characteristics} alt="Opções didáticas" />
                </div>
            </AlertDialogSlide>
            <div className="about-section-text-container">
                <p className="secondary-text">
                    Os resultados não “medem inteligências”, mas refletem o que os estudantes pensam sobre si mesmo, 
                    e que poderão ser confirmados por você a partir da observação das atitudes e comportamentos que eles apresentam em sala de aula.
                </p>
                <p className="secondary-text">
                    Quadro resumo das múltiplas inteligências.
                    <IconButton sx={{ color: blue[500] }} onClick={handleClickOpen}>
                        <PermMediaIcon />
                    </IconButton>
                </p>
                <p className="secondary-text">
                Mais informações estão disponíveis no botão 
                    <Link className="primary-color" style={{ textDecoration: 'none' }} to="/home"> "Materiais de Apoio" </Link> 
                    da sua página principal.
                </p>
            </div>
        </div>
    )
}

export default IMSynthetic;