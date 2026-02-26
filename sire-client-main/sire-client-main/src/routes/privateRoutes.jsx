import { Navigate } from "react-router-dom";
import { Context } from "../Context/AuthContext";
import { useContext } from "react";
import config from "../services/config";

const PrivateRoute = ({ children, roles = [], redirectTo = "/" }) => {
    const { authenticated } = useContext(Context);
    const { role } = JSON.parse(localStorage.getItem(config.tokenName)) || "unauthorized";

    if (!authenticated) {
        return <Navigate to={redirectTo} />;
    }

    const hasPermission = roles.length === 0 || roles.includes(role);
    if (!hasPermission) {
        return <Navigate to="/unauthorized" />;
    }

    return children;
};

export default PrivateRoute;
