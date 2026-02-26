import { useCallback } from "react";
import api from "../services/api";
import config from "../services/config";

const useFetch = () => {

    const fetchEmailVerification = useCallback(async (token, controller) => {
        try {
            const url = `survey/student-view/email-verification/verify/${token}`;
            const response = await api.get(url, { signal: controller.signal });
            return { status: response.status }
        } catch (error) {
            console.log('Error fetching email verification:', error);
            throw error;
        }
    }, []);

    const fetchAnswers = useCallback(async (studyId, controller) => {
        try {
            const url = `/survey/study/${studyId}/answer`;
            const response = await api.get(url, { signal: controller.signal });
            return { data: response.data };
        } catch (error) {
            console.error("Error fetching answers:", error);
            throw error;
        }   
    }, []); 

    const fetchResult = useCallback(async (studyId, controller) => {
        try {
            const url = `/survey/study/${studyId}/report`;
            const response = await api.get(url, { signal: controller.signal });
            return { data: response.data, error: null };
        } catch (error) {
            console.error("Error fetching result:", error);
            throw error;
        }
    }, []);

    const fetchEntryPoint = useCallback(async (role, controller) => {
        try {
            const { data: switcherUrl } = await api.get(`/survey/switcher/role/${role}`);
            const { data: availableStudies } = await api.get(switcherUrl, { signal: controller.signal });
            return availableStudies;
        } catch (error) {
            console.error("Error fetching entry point or studies:", error);
            throw error;
        }
    }, []);

    const fetchSyntheticReport = useCallback(async (classId, studyId, controller) => {
        try {
            const { data } = await api.get(
                `/survey/class/${classId}/study/${studyId}/synthetic-report`,
                { signal: controller.signal }
            );
            return data;
        } catch (error) {
            console.error("Error fetching synthetic report:", error);
            throw error;
        }
    }, []);

    const fetchAnalyticalReport = useCallback(async (classId, studyId, controller) => {
        try {
            const { data } = await api.get(
                `/survey/class/${classId}/study/${studyId}/analytical-report`,
                { signal: controller.signal }
            );
            return data;
        } catch(error) {
            console.error("Error fetching synthetic report:", error);
            throw error;
        }
    }, []);

    // --- New Functions (Updated with useCallback) ---
    const fetchEducationalTypes = useCallback(async (controller) => {
        try {
            const { data } = await api.get(config.products.educationalTypes, { signal: controller.signal });
            return data;
        } catch (error) {
            console.error("Error fetching educational types:", error);
            throw error;
        }
    }, []);

    const fetchPendingProducts = useCallback(async (controller) => {
        try {
            const { data } = await api.get(config.admin.pendingProducts, { signal: controller.signal });
            return data;
        } catch (error) {
            console.error("Error fetching pending products:", error);
            throw error;
        }
    }, []);

    return {
        fetchEmailVerification,
        fetchAnswers,
        fetchResult,
        fetchEntryPoint,
        fetchSyntheticReport,
        fetchAnalyticalReport,
        fetchEducationalTypes,
        fetchPendingProducts
    };

};

export default useFetch;