import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Context } from "../Context/AuthContext";
import LandingPage from "./../pages/LandingPage";
import Login from "./../pages/Login";
import PrivateRoute from "./privateRoutes";
import { useContext } from "react";
import PasswordReset from "../pages/PasswordReset";
import PasswordResetConfirmation from "../pages/PasswordResetConfirmation";
import SignUp from "../pages/SignUp";
import Welcome from "../pages/Welcome";
import Questions from "../pages/Questions";
import Result from "../pages/Result";
import Layout from "../components/Layout";
import RoleBasedComponent from "./RoleBasedComponent";
import Synthetic from "../pages/Synthetic";
import Analytical from "../pages/Analytical";
import NotFound from "../pages/NotFound";
import Recommendation from "../pages/Recommendation";
import EducationalProduct from "../pages/EducationalProduct";
import Methodology from "../pages/Methodology";

const AppRouter = () => {
    const { loading } = useContext(Context)
    const publicRoutes = [
        { path: "/", element: <LandingPage />, index: true },
        { path: "login", element: <Login /> },
        { path: "password-reset", element: <PasswordReset /> },
        { path: "password-reset-confirmation", element: <PasswordResetConfirmation /> },
        { path: "signup", element: <SignUp /> },
        { path: "welcome", element: <Welcome /> },
    ];

    if (loading) {
        return <h3 style={{'margin': '0.5rem'}}>Redirecionando...</h3>
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* Rotas públicas */}
                <Route path="/" element={<Layout authenticated={false} />}>
                    {publicRoutes.map((route) => (
                        <Route key={route.path} {...route} />
                    ))}
                </Route>

                {/* Rotas privadas */}
                <Route path="/" element={<Layout authenticated={true} />}>
                    <Route
                        path="/home"
                        element={
                            // ATENÇÃO: AQUI ESTÁ A CORREÇÃO
                            <PrivateRoute roles={["Professor", "Student", "Admin", "Revisor"]}>
                                <RoleBasedComponent />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/questions/:studyId"
                        element={
                            <PrivateRoute roles={["Student"]}>
                                <Questions />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/result/:studyId"
                        element={
                            <PrivateRoute roles={["Student"]}>
                                <Result />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/report/class/:classId/study/:studyId/synthetic"
                        element={
                            <PrivateRoute roles={["Professor"]}>
                                <Synthetic />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/report/class/:classId/study/:studyId/analytical"
                        element={
                            <PrivateRoute roles={["Professor"]}>
                                <Analytical />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/recommendation/:recommendationId"
                        element={
                            <PrivateRoute roles={["Student", "Professor"]}>
                                <Recommendation />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/recommendation/:recommendationId/class/:classId"
                        element={
                            <PrivateRoute roles={["Professor"]}>
                                <Recommendation />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/educational-product/:productCode"
                        element={
                            <PrivateRoute roles={["Professor", "Student"]}>
                                <EducationalProduct />
                            </PrivateRoute>
                        }
                    />
                    <Route
                        path="/methodology/:methodologyCode"
                        element={
                            <PrivateRoute roles={["Professor"]}>
                                <Methodology />
                            </PrivateRoute>
                        }
                    />
                </Route>       
                
                {/* Página 404 */}
                <Route path="*" element={<NotFound />} />       
            </Routes>
        </BrowserRouter>
    );
}

export default AppRouter;