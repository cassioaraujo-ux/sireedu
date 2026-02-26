import React, { useContext, useState } from "react";
import "./styles.css";
import { Context } from "../../Context/AuthContext";
import { Navigate, Link } from "react-router-dom";
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import LockIcon from '@mui/icons-material/Lock';
import CircularProgress from "@mui/material/CircularProgress";
import MessageHandler from "../../components/MessageHandler";
import Role from "../../components/Role";
import PageTitleUpdater from "../../components/PageTitleUpdater";

const Login = () => {
    const { authenticated, handleLogin, confirmRoleSelection } = useContext(Context);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    
    // Estados de UI
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");      
    const [emailError, setEmailError] = useState(false);    
    const [openSnack, setOpenSnack] = useState(false);
    
    // Estados para Seleção de Papel
    const [openRoleDialog, setOpenRoleDialog] = useState(false);
    const [availableRoles, setAvailableRoles] = useState([]);
    const [tempSessionData, setTempSessionData] = useState(null); // Guarda sessão aguardando escolha

    const validateEmail = () => {
        // Validação simples de presença de @, ajuste conforme necessidade
        if (!username.includes("@")) {
            setEmailError(true);
            setTimeout(() => setEmailError(false), 5000);
            return false;
        }
        return true;
    };

    const onSubmit = async(event) => {
        event.preventDefault();
        if(!validateEmail()) return;

        setLoading(true);
        try {
            // Tenta logar
            const result = await handleLogin(username, password);
            
            if (result.multiRole) {
                // Se tiver múltiplos papéis, guarda dados e abre modal
                setAvailableRoles(result.roles);
                setTempSessionData(result.sessionData);
                setOpenRoleDialog(true);
            } 
            // Se não for multiRole, o useAuth já autenticou direto
        } catch (error) {
            setError("Erro ao fazer login. Verifique suas credenciais.");
            setOpenSnack(true);
        } finally {
            setLoading(false);
        }
    };

    const handleRoleSelection = (role) => {
        // Usuário escolheu um papel no modal
        setOpenRoleDialog(false);
        if (role && tempSessionData) {
            confirmRoleSelection(role, tempSessionData);
            // O redirecionamento acontecerá automaticamente pois 'authenticated' mudará para true
        } else {
            // Se fechou sem escolher (ex: clicou fora), limpamos os dados temporários
            setTempSessionData(null);
        }
    };

    if (authenticated) {
        return <Navigate to="/home"/>;
    }

    return (
        <div className="login-container">
            <PageTitleUpdater title={"Login"} />
            
            <form className="form-container" onSubmit={onSubmit}>
                <p className="login-heading">Faça seu login</p>
                {emailError && <span className="error-message">E-mail inválido</span>}
                
                <FormControl fullWidth sx={{ width: '100%', marginBottom: '10px' }}>
                    <OutlinedInput
                        id="email"
                        placeholder="Email"
                        startAdornment={<InputAdornment position="start"><MailOutlineIcon /></InputAdornment>}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        error={emailError}
                    />
                </FormControl>

                <FormControl sx={{ width: '100%', marginBottom: '10px' }}>
                    <OutlinedInput
                        id="password"
                        placeholder="Senha"
                        type={showPassword ? 'text' : 'password'}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        startAdornment={<InputAdornment position="start"><LockIcon /></InputAdornment>}
                        endAdornment={
                            <InputAdornment position="end">
                                <IconButton
                                    onClick={() => setShowPassword(!showPassword)}
                                    edge="end"
                                >
                                    {showPassword ? <VisibilityOff /> : <Visibility />}
                                </IconButton>
                            </InputAdornment>
                        }
                    />
                </FormControl>

                <div className="forgot-password">
                    <Link className="forgot-password-link" to="../password-reset">Esqueceu a senha?</Link>
                </div>
                
                <button className="bg-primary-color login-button" type="submit" disabled={loading}>
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Entrar"}
                </button>

                <p className="create-account-text">
                    Não tem uma conta? <Link className="primary-color create-account-link" to="/signup/">Crie agora</Link>
                </p>
            </form>

            <MessageHandler 
                message={error} 
                type="error" 
                open={openSnack} 
                onClose={() => setOpenSnack(false)} 
            />

            {/* Modal de Seleção de Papel */}
            <Role 
                open={openRoleDialog} 
                onClose={handleRoleSelection} 
                availableRoles={availableRoles} 
            />
        </div>
    );
}

export default Login;