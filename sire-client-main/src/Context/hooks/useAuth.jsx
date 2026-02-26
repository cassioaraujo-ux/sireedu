import { useState, useEffect, useRef, useCallback } from "react";
import api from "../../services/api";
import config from "../../services/config";
import { Navigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const SESSION_STORAGE_KEY = config.tokenName;

const useAuth = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const isAuthenticatedRef = useRef(false);
    const REFRESH_THRESHOLD = 60 * 1000; // 1 minuto
    let intervalId = useRef(null);

    const storeSession = (sessionData) => {
        localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(sessionData));
    };

    const clearSession = () => {
        localStorage.removeItem(SESSION_STORAGE_KEY);
    };

    // Função auxiliar para configurar o papel na sessão
    const setRoleInSession = (sessionData, role) => {
        sessionData['role'] = role;
        storeSession(sessionData);
        // Atualiza o header padrão para requisições futuras
        api.defaults.headers.common["Authorization"] = `Bearer ${sessionData.token}`;
        setAuthenticated(true);
        isAuthenticatedRef.current = true;
        setupTokenRefresh(sessionData.token);
    };

    const setupTokenRefresh = useCallback((token) => {
        if (!token) return;
        
        try {
            const tokenData = jwtDecode(token);
            const expirationTime = tokenData.exp * 1000;
        
            const checkTokenValidity = async () => {
                if (!isAuthenticatedRef.current) {
                    clearInterval(intervalId.current);
                    return;
                }
    
                const now = new Date().getTime();
                // Payload ajustado conforme necessidade do backend
                const requestPayload = { "token": token };
                
                if (now >= expirationTime) {
                    clearInterval(intervalId.current);
                    handleLogout();
                } else if (expirationTime - now <= REFRESH_THRESHOLD) {
                    try {
                        const response = await api.post(config.authTokenRefreshUrl, requestPayload);
                        const newToken = response.data.token;
                        
                        // Atualiza apenas o token, mantendo o usuário e role
                        let sessionData = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY));
                        if (sessionData) {
                            sessionData['token'] = newToken;
                            storeSession(sessionData);
                            api.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                            console.log("Token renovado em " + new Date());
                            
                            clearInterval(intervalId.current);
                            setupTokenRefresh(newToken);
                        }
                    } catch (error) {
                        console.error("Erro ao renovar token:", error);
                        // Opcional: não deslogar imediatamente em caso de falha de rede temporária
                        // handleLogout(); 
                    }
                }
            };
        
            clearInterval(intervalId.current);
            intervalId.current = setInterval(checkTokenValidity, 5000); // Verifica a cada 5s
        } catch (e) {
            console.error("Erro ao decodificar token", e);
        }
    }, []);

    useEffect(() => {
        const loadingStoreData = async () => {
            try {
                const storedSession = localStorage.getItem(SESSION_STORAGE_KEY);
                if (storedSession) {
                    const parsedSession = JSON.parse(storedSession);
                    const { token, role } = parsedSession;
                    
                    // Só considera autenticado se tiver token E um papel definido
                    if (token && role) {
                        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
                        setAuthenticated(true);
                        isAuthenticatedRef.current = true;
                        setupTokenRefresh(token);
                    }
                }
            } catch (error) {
                console.error("Erro ao carregar dados do localStorage:", error);
            } finally {
                setLoading(false);
            }
        };
        loadingStoreData();
        
        return () => clearInterval(intervalId.current);
    }, [setupTokenRefresh]);

    const handleLogin = async (username, password) => {
        try {
            // 1. Faz o login para obter token e grupos
            const response = await api.post(config.authTokenUrl, { username, password });
            const sessionData = response.data;
            const availableGroups = sessionData.user.groups;

            // 2. Analisa os grupos
            if (!availableGroups || availableGroups.length === 0) {
                throw new Error("Usuário não possui permissões de acesso.");
            }

            // Cenário A: Apenas um grupo - Login direto
            if (availableGroups.length === 1) {
                const role = availableGroups[0];
                setRoleInSession(sessionData, role);
                return { multiRole: false };
            }

            // Cenário B: Múltiplos grupos - Retorna dados para o componente decidir
            return { 
                multiRole: true, 
                roles: availableGroups, 
                sessionData: sessionData // Passamos os dados para não precisar relogar
            };

        } catch (error) {
            console.error("Erro ao fazer login:", error);
            throw error;
        }
    };

    // Função chamada pelo componente Login após o usuário escolher o papel no Modal
    const confirmRoleSelection = (role, sessionData) => {
        if (sessionData && role) {
            setRoleInSession(sessionData, role);
        }
    };
    
    // Função para trocar de perfil sem precisar de senha novamente (estando logado)
    const switchRole = (newRole) => {
        const sessionData = JSON.parse(localStorage.getItem(SESSION_STORAGE_KEY));
        if (sessionData && sessionData.user.groups.includes(newRole)) {
            setRoleInSession(sessionData, newRole);
            window.location.href = "/home"; // Força recarregamento limpo na home
        }
    };

    const handleLogout = async () => {
        setAuthenticated(false);
        isAuthenticatedRef.current = false;
        clearSession();
        delete api.defaults.headers.common["Authorization"];
        clearInterval(intervalId.current);
    };

    return { 
        authenticated, 
        handleLogin, 
        handleLogout, 
        loading, 
        confirmRoleSelection, // Nova função exportada
        switchRole // Nova função exportada
    };
}

export default useAuth;