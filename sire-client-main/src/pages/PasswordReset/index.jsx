import React, { useState } from "react";
import "./styles.css";
import SendInvite from "../../assets/send-invite.png";
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import useForm from "../../hooks/useForm";
import MessageHandler from "../../components/MessageHandler";
import { Link } from "react-router-dom";
import PageTitleUpdater from "../../components/PageTitleUpdater";
import CircularProgress from "@mui/material/CircularProgress";

const PasswordReset = () => {
    const [email, setEmail] = useState("");
    const [emailError, setEmailError] = useState(false);
    const [error, setError] = useState("");      
    const [showMessage, setShowMessage] = useState(false);
    const { requestPasswordReset } = useForm();
    const [messageType, setMessageType] = useState("success"); // 'success', 'error', 'info', 'warning'
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const validateEmail = () => {
        const emailDomain = email.split("@")[1];
        const allowedDomains = ["unifesp.br", "ifsp.edu.br", "aluno.ifsp.edu.br", "edu.azores.gov.pt", "ime.unicamp.br"];
    
        if (!emailDomain || !allowedDomains.includes(emailDomain)) {
            setEmailError(true);
            setTimeout(() => {
                setEmailError(false);
            }, 5000);
            return false
        } else {
            setEmailError(false);
            return true;
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        setEmailError(false);
        
        if (!validateEmail()) return;
        
        setLoading(true);
        const { success, message } = await requestPasswordReset(email);
        if (!success) {
            setMessageType('error');
            setError(message || "Ocorreu uma falha durante a solicitação de alteração da sua senha.");
            setOpen(true);
        } else {
            setShowMessage(true);
        }
        setLoading(false);
    }; 

    return (
        <div className="password-reset-container">
            <PageTitleUpdater title={"Redefinir senha"} />
            <div className="password-reset-content">
                {!showMessage &&
                <div>
                    <p className="password-reset-title">Redefinir senha</p>
                    <form onSubmit={onSubmit}>
                        <p className="password-reset-text">Preencha o campo abaixo para solicitar a recuperação de senha.</p>
                        {emailError && <span className="error-message">Utilize um e-mail institucional</span>}
                        <FormControl fullWidth sx={{ width: '100%', marginBottom: '15px' }}>
                            <OutlinedInput
                                id="email"
                                placeholder="E-mail de acesso"
                                onChange={(e) => setEmail(e.target.value)}
                                error={emailError}
                                required
                            />
                        </FormControl>
                        {open && <MessageHandler message={error} type={messageType} open={open} onClose={handleClose} />}
                        <button className="password-reset-button bg-primary-color" type="submit">
                            {loading ? <CircularProgress size={24} color="inherit" /> : "Enviar"}
                        </button>
                        <p className="instruction-message">
                            Você irá receber um e-mail no endereço informado acima contendo o procedimento
                            para criar uma nova senha para esse usuário.
                        </p>
                        <div style={{'margin-top': '10px'}}>
                            <Link className="login-link" to="../login">Voltar para tela de login</Link>
                        </div>
                    </form>
                </div>
                }
                {showMessage &&
                <div>
                    <p className="password-reset-title">E-mail enviado!</p>
                    <p className="instruction-message">
                        Um e-mail foi enviado para <span className="email">{email}</span> com as instruções e um link para alteração da senha. 
                        Caso você não receba o e-mail em alguns minutos, verifique a sua caixa de spam ou repita o processo.
                    </p>
                    <div className="reset-image-section">
                        <img src={SendInvite} alt="SendInvite"/>
                    </div>
                    <div>
                        <Link className="login-link" to="../login">Voltar para tela de login</Link>
                    </div>
                </div>
                }
            </div>
        </div>
    );
};

export default PasswordReset;
