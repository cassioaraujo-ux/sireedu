import { useEffect, useState } from 'react';

const usePagination = () => {

    const [currentPage, setCurrentPage] = useState(1);
    const [dynamicProductsPerPage, setDynamicProductsPerPage] = useState(20);
    const [filteredProducts, setFilteredProducts] = useState([]);

    useEffect(() => {
        const calculateProductsPerPage = () => {
            const screenWidth = window.innerWidth;
            if (screenWidth >= 1024) { // Corresponds to 3+ columns
                return 18;
            } else if (screenWidth >= 768) { // Corresponds to 2 columns
                return 20;
            } else { // Corresponds to 1 column
                return 10;
            }
        };

        const handleResize = () => {
            setDynamicProductsPerPage(calculateProductsPerPage());
        };

        handleResize(); // Set initial value
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const totalPages = Math.ceil(filteredProducts.length / dynamicProductsPerPage);
    const indexOfLastProduct = currentPage * dynamicProductsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - dynamicProductsPerPage;
    const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);

    // Effect to adjust currentPage if it's out of bounds
    useEffect(() => {
        const newTotalPages = Math.ceil(filteredProducts.length / dynamicProductsPerPage);
        if (filteredProducts.length === 0) {
            if (currentPage !== 1) setCurrentPage(1);
        } else {
            const maxPage = Math.max(1, newTotalPages); 
            if (currentPage > maxPage) {
                setCurrentPage(maxPage);
            } else if (currentPage < 1) { 
                setCurrentPage(1);
            }
        }
    }, [filteredProducts.length, dynamicProductsPerPage, currentPage]);


    const handleNextPage = () => {
        setCurrentPage(prevPage => Math.min(prevPage + 1, totalPages || 1));
    };

    const handlePreviousPage = () => {
        setCurrentPage(prevPage => Math.max(prevPage - 1, 1));
    };

    return { currentPage, setCurrentPage, currentProducts, handleNextPage, handlePreviousPage, filteredProducts, setFilteredProducts, indexOfFirstProduct, totalPages }
};

export default usePagination;