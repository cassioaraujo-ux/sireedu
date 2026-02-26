import { useCallback, useState } from "react"
import useInstitutions from "../../../hooks/useInstitutions";

const useInstitutionsHandler = () => {
    const {
        fetchInstitutions,
        fetchProgramsByInstitution,
        fetchClassesByInstitutionAndProgram
    } = useInstitutions()

    const [institution, setInstitution] = useState("");
    const [institutions, setInstitutions] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [programClasses, setProgramClasses] = useState([]);
    
    const selectedProgramChanged = useCallback(async (institutionId, programId) => {
        try {
            const classes = programId ? await fetchClassesByInstitutionAndProgram({ institutionId, programId }) : [];
            setProgramClasses(classes);
        } catch (error) {
            console.error("Error fetching classes:", error);
        }
    }, [fetchClassesByInstitutionAndProgram])
    
    const selectedInstitutionChanged = useCallback(async (institutionId) => {
        try {
            const programs = institutionId ? await fetchProgramsByInstitution({ institutionId }) : [];
            setPrograms(programs);
            setProgramClasses([]);
            if (programs.length === 1) selectedProgramChanged(programs[0].id);
        } catch (error) {
            console.error("Error fetching programs:", error);
        }
    }, [fetchProgramsByInstitution, selectedProgramChanged])
    
    const loadInstitutions = useCallback(async (controller) => {
        try {
            const result = await fetchInstitutions({ signal: controller.signal });
            setInstitutions(result);
            if (result.length === 1) {
                setInstitution(result[0].id);
                selectedInstitutionChanged(result[0].id);
            }
        } catch (error) {
            if (error.name === "AbortError") {
                console.log("Ferch canceled")
            } else {
                console.error("Error during fetch", error);
            }
        }
    }, [fetchInstitutions, selectedInstitutionChanged]);

    return {
        institution,
        institutions,
        programs,
        programClasses,
        loadInstitutions,
        selectedInstitutionChanged,
        selectedProgramChanged
    };
};

export default useInstitutionsHandler;