import React, { useEffect, useState } from "react";
import "./styles.css";
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import useForm from "../../hooks/useForm";
import { useLocation, useNavigate } from "react-router-dom";
import MessageHandler from "../../components/MessageHandler";
import PageTitleUpdater from "../../components/PageTitleUpdater";
import CircularProgress from "@mui/material/CircularProgress";

const PasswordResetConfirmation = () => {
    const location = useLocation();
    const [token, setToken] = useState("");
    const [passwordReset, setPasswordReset] = useState("");     
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
    const [passwordError, setPasswordError] = useState(false);
    const [message, setMessage] = useState("");      
    const [messageType, setMessageType] = useState("success"); // 'success', 'error', 'info', 'warning'
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const { resetPassword } = useForm();

    const navigate = useNavigate();

    const handleClose = () => {
        setOpen(false);
    };

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const URLtoken = searchParams.get('token');
        setToken(URLtoken);
    }, [location]);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowPasswordConfirmation = () => setShowPasswordConfirmation((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseDownPasswordConfirmation = (event) => {
        event.preventDefault();
    };

    const validatePassword = () => {
        if ( !(passwordReset === passwordConfirmation) ) {
            setPasswordError(true);
            setTimeout(() => {
                setPasswordError(false);
            }, 5000);
            return false;
        } else {
            setPasswordError(false);
            return true;
        }
    }

    const onSubmit = async (event) => {
        event.preventDefault();

        if (!(validatePassword())) return;

        setLoading(true);
        const { success, message } = await resetPassword(token, passwordReset);
        if (!success) {
            setMessageType("error");
            setMessage(message || "Ocorreu uma falha durante a solicitação de alteração da sua senha.");
            setOpen(true);
        } else {
            setMessageType("success");
            setMessage("Senha alterada com sucesso. Redirecionando para a página de login.")
            setOpen(true);
            setTimeout(() => {
                navigate("/login/");
            }, 3000);
        }
        setLoading(false);
    };

    return (
        <div className="password-reset-confirmation-container">
            <PageTitleUpdater title={"Criar nova senha"} />
            <div className="password-reset-confirmation-content">
                <form onSubmit={onSubmit}>
                    <p className="password-reset-title">Criar nova senha</p>
                    <p className="password-reset-text">
                        Utilize o formulário a seguir para recuperar sua senha.
                    </p>
                    <FormControl sx={{ width: '100%', marginBottom: '10px' }}>
                        <OutlinedInput
                            id="password"
                            placeholder="Nova senha"
                            type={showPassword ? 'text' : 'password'}
                            onChange={(e) => setPasswordReset(e.target.value)}
                            required
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleMouseDownPassword}
                                    edge="end"
                                >
                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
                    {passwordError && <span className="error-message">As senhas devem ser iguais</span>}
                    <FormControl sx={{ width: '100%', marginBottom: '15px' }}>
                        <OutlinedInput
                            id="password-confirmation"
                            placeholder="Confirmar nova senha"
                            type={showPasswordConfirmation ? 'text' : 'password'}
                            onChange={(e) => setPasswordConfirmation(e.target.value)}
                            error={passwordError}
                            required
                            endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPasswordConfirmation}
                                    onMouseDown={handleMouseDownPasswordConfirmation}
                                    edge="end"
                                >
                                {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                            }
                        />
                    </FormControl>
                    {open && <MessageHandler message={message} type={messageType} open={open} onClose={handleClose} />}
                    <button className="password-reset-button bg-primary-color">
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Enviar"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PasswordResetConfirmation;