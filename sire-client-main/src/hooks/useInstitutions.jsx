import api from "../services/api";
import config from "../services/config";

const useInstitutions = () => {

    const fetchInstitutions = async () => {
        try {
            const { data } = await api.get(config.getInstitutionsUrl);
            return data;
        } catch (error) {
            console.error('Error fetching institutions:', error);
            throw error;
        }
    };

    const fetchProgramsByInstitution = async (ids) => {
        try {
            const { data } = await api.get(`survey/institution/${ids.institutionId}/program`);
            return data;
        } catch (error) {
            console.error('Error fetching programs:', error)
            throw error;
        }
    };

    const fetchClassesByInstitutionAndProgram = async (ids) => {
        try {
            const { data } = await api.get(`/survey/institution/${ids.institutionId}/program/${ids.programId}/class`);
            return data;
        } catch (error) {
            console.error('Error fetching classes:', error)
            throw error;
        }
    };

    return { fetchInstitutions, fetchProgramsByInstitution, fetchClassesByInstitutionAndProgram }

};

export default useInstitutions;