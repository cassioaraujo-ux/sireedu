import React, { useEffect, useState } from "react";
import "./styles.css";
import { useLocation } from "react-router-dom";
import useFetch from "../../hooks/useFetch";
import Success from "./Success";
import Error from "./Error";
import PageTitleUpdater from "../../components/PageTitleUpdater";
import SimpleBackdrop from "../../components/SimpleBackdrop";

const Welcome = () => {
    const location = useLocation();
    const { fetchEmailVerification } = useFetch();
    const [isVerify, setIsVerify] = useState(false);
    const [loading, setLoading] = useState(false);

    const isValidUUID = (token) => {
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
        return uuidRegex.test(token);
    };

    useEffect(() => {
        const controller = new AbortController();
        const verifyEmail = async (token) => {
            setLoading(true);
            try {
                const { status } = await fetchEmailVerification(token, controller);
                setIsVerify(true);
            } catch (error) {
                if (error.name !== 'AbortError') {
                    console.error("Error during fetching:", error);
                }
            } finally {
                setLoading(false);
            }
        }
        const searchParams = new URLSearchParams(location.search);
        const URLtoken = searchParams.get("token");
        
        if (URLtoken) {
            if (isValidUUID(URLtoken)) {
                verifyEmail(URLtoken);
            } else {
                console.error("Token inválido no formato UUID");
            }
        }

        return () => controller.abort();
    }, []);

    return (
        <div className="welcome">
            <SimpleBackdrop open={loading} />
            <div className="welcome-container">
                <PageTitleUpdater title={"Bem-vindo"} />
                {isVerify ? (
                    <Success />
                ) : (
                    <Error />
                )}
            </div>
        </div>
    );
};

export default Welcome;
