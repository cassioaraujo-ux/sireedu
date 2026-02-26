import React, { createContext} from "react";
import useAuth from "./hooks/useAuth";

const Context = createContext();

const AuthProvider = ({children}) => {
    // Destructure the new functions from useAuth
    const { 
        authenticated, 
        handleLogin, 
        handleLogout, 
        loading, 
        confirmRoleSelection, // <--- Add this
        switchRole            // <--- Add this
    } = useAuth();

    return (
        <Context.Provider 
            value={{ 
                authenticated, 
                handleLogin, 
                handleLogout,
                loading,
                confirmRoleSelection, // <--- Add this to the value object
                switchRole            // <--- Add this to the value object
            }}
        >
            {children}
        </Context.Provider>
    );
}

export { Context, AuthProvider };