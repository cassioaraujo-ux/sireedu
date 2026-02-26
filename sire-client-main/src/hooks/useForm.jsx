import { useCallback } from "react";
import api from "../services/api";
import config from "../services/config";
import handleError from "./handleError";

const useForm = () => {

    const requestPasswordReset = useCallback(async (email) => {
        try {
            const clientViewUrl = "/password-request-confirmation";
            const response = await api.post(config.passwordResetRequestUrl, {
                email,
                clientViewUrl,
            });

            const { status } = response.data;
            if (status === "OK") {
                return { success: true };
            }

        } catch (error) {
            console.error("Error request password reset:", error);
            return { success: false, message: handleError(error) };
        }
    }, []);

    const resetPassword = useCallback(async (token, password) => {
        try {
            const response = await api.post(config.passwordResetConfirmUrl, {
                token,
                password,
            });
            
            const { status } = response.data;
            if (status === "OK") {
                return { success: true };
            }
        
        } catch (error) {
            console.error("Error reset password:", error);
            return { success: false, message: handleError(error) };
        }
    }, []);

    const signUp = useCallback(async (signUpObj) => {
        try {
            const response = await api.post(config.student.signupUrl, signUpObj);
            const { status } = response;
            
            if (status === 201) { //created
                return { success: true }
            }
        } catch (error) {
            console.error("Error signup:", error);
            return { success: false, message: handleError(error) };
        }
    }, []);

    const processAnswer = useCallback(async (studyId, answers) => {
        try {
            const payload = {'answers': answers};
            const url = `/survey/study/${studyId}/process`;
            const response = await api.post(url, payload, {'studyId': studyId});
            const { status } = response;
            if (status === 200) {
                return { success: true };
            }
        } catch (error) {
            console.error("Error process answer:", error);
            return { success: false, message: handleError(error) };
        }
    }, []);

    const registerRecommendation = useCallback(async (productId) => {
        try {
            const { data } = await api.post(config.products.recommendationToStudent, {
                'product_id': productId,
            });
            return { success: true, data: data };
        } catch (error) {
            console.error('Error posting register recommendation:', error);
            return { success: false, message: handleError(error) };
        }
    }, []);

    const registerRating = useCallback(async (productId, ratingValue) => {
        try {
            const { data } = await api.post(config.products.ratingRegister, {
                'product_id': productId,
                'rating': ratingValue,
            });
            console.log('Rating response:', data);
            return { success: true, data: data };
        } catch (error) {
            console.error('Error posting register rating:', error);
            return { success: false, message: handleError(error) };
        }
    }, []);

    const registerFavorite = useCallback(async (productId) => {
        try {
            const { data } = await api.post(config.products.favoriteRegister, {
                'product_id': productId,
            });
            return { success: true, data: data };
        } catch (error) {
            console.error('Error posting register favorite:', error);
            return { success: false, message: handleError(error) };
        }
    }, []);

    // --- New Functions (Suggestions & Revisor) ---

    const suggestProduct = useCallback(async (productData) => {
        try {
            const response = await api.post(config.products.suggest, productData);
            if (response.status === 201) {
                return { success: true };
            }
        } catch (error) {
            console.error("Error suggesting product:", error);
            return { success: false, message: handleError(error) };
        }
    }, []);

    // CORRECTED: Accepts a generic `data` object to support editing + action
    const reviewProduct = useCallback(async (productId, data) => {
        try {
            const url = config.admin.reviewProduct.replace("${productId}", productId);
            const response = await api.post(url, data); 
            if (response.status === 200) {
                return { success: true };
            }
        } catch (error) {
            console.error("Error reviewing product:", error);
            return { success: false, message: handleError(error) };
        }
    }, []);

    return {
        requestPasswordReset,
        resetPassword,
        signUp,
        processAnswer,
        registerRecommendation,
        registerRating,
        registerFavorite,
        suggestProduct,
        reviewProduct
    }

};

export default useForm;