import api from "../services/api";
import config from "../services/config";
import { useCallback } from 'react';

const useRecommendation = () => {

    const fetchAllProductsforStudents = async (signal) => {
        try {
            const url = `/survey/products/all`;
            const { data: allProducts } = await api.get(url, { signal : signal });
            return allProducts;
            
        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }

    const fetchAllProductsforProfessor = async (classId, signal) => {
        try {
            // For professor we need to pass the classId
            const url = `/survey/products/all/${classId}`;
            const { data: allProducts } = await api.get(url, { signal : signal });
            return allProducts;

        } catch (error) {
            console.error("Error fetching products:", error);
            throw error;
        }
    }

    const fetchSpecificProducts = useCallback(async (productName, params, signal) => {
        try {
            // Use URLSearchParams to easily build the query string
            const queryParams = new URLSearchParams({
                limit: params.limit,
                offset: params.offset
            });

            // Add search and sort params if they exist
            if (params.searchTerm) {
                queryParams.append('search', params.searchTerm);
            }
            if (params.sort) {
                queryParams.append('sort', params.sort);
            }
            if (params.favorites_only) {
                queryParams.append('favorites_only', 'true');
            }
            // Add Class ID to query params
            if (params.class_id) {
                queryParams.append('class_id', params.class_id);
            }

            const url = `survey/products/${productName}?${queryParams.toString()}`;

            // The API now returns an object like { count, specificProducts, ... }
            // We return the whole object to get the total count for pagination.
            const { data } = await api.get(url, { signal: signal });
            return data;

        } catch (error) {
            console.error("Error fetching specific products:", error);
            throw error;
        }
    }, []);

    const fetchStudentProducts = async (signal) => {
        try {
            const { data: selectedProducts } = await api.get(config.products.student, { signal: signal });
            return selectedProducts;
        } catch (error) {
            console.error("Error fetching student products:", error);
            throw error;
        }
    }

    const fetchProfessorProducts = async (classId, signal) => {
        try {
            const url = `survey/products/professor/${classId}`;
            const { data: selectedProducts } = await api.get(url, { signal: signal });
            return selectedProducts;
        } catch (error) {
            console.error("Error fetching professor products:", error);
            throw error;
        }
    }

    const fetchMethodologies = async (signal) => {
        try {
            const { data: allMethodology } = await api.get(config.methodologies.all, { signal: signal });
            return allMethodology;
        } catch (error) {
            console.error("Error fetching methodologies:", error);
            throw error;
        }
    }

    const fetchProfessorMethodologies = async (signal) => {
        try {
            const { data: selectedMethodology } = await api.get(config.methodologies.professor, { signal: signal });
            return selectedMethodology;
        } catch (error) {
            console.error("Error fetching professor methodologies:", error);
            throw error;
        }
    }

    return {
        fetchAllProductsforProfessor,
        fetchAllProductsforStudents,
        fetchSpecificProducts,
        fetchStudentProducts,
        fetchProfessorProducts,
        fetchMethodologies,
        fetchProfessorMethodologies,
    }

};

export default useRecommendation;