import React, { useState } from "react";
import { Link } from "react-router-dom";
import IconButton from '@mui/material/IconButton';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import { blue } from '@mui/material/colors';
import AlertDialogSlide from "../../../components/AlertDialogSlide";
import Characteristics from "../../../assets/ea-characteristics.png";

const EASynthetic = () => {
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
                <p className="secondary-text" data-tutorial="secondary-text">
                    Os estilos de aprendizagem identificam de que forma as informações são percebidas e processadas, 
                    ou seja, as preferências pedagógicas de cada estudante. Nos cursos de exatas verifica-se um predomínio 
                    mundial do estilo reflexivo, porém ao diversificar as estratégias é possível minimizar as dificuldades 
                    e as falhas na aprendizagem dos estudantes de todos os estilos.
                </p>
                <p className="secondary-text">
                    Algumas alternativas que mais se identificam com os estilos de aprendizagem, e que podem contribuir para a docência.
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

export default EASynthetic;