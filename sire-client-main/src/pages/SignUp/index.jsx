import React, { useEffect, useState } from "react";
import "./styles.css";
import Marker from "./Marker";
import useInstitutionsHandler from "./hooks/useInstitutionHandler";
import MessageHandler from "../../components/MessageHandler";
import { Link } from "react-router-dom";
import useForm from "../../hooks/useForm";
import EmailVerification from "./EmailVerification";
import NameSection from "./NameSection";
import EmailAndPasswordSection from "./EmailAndPasswordSection";
import InstitutionSection from "./InstitutionSection";
import PageTitleUpdater from "../../components/PageTitleUpdater";
import SimpleBackdrop from "../../components/SimpleBackdrop";

const SignUp = () => {
    const {
        institution,
        institutions,
        programs,
        programClasses,
        loadInstitutions,
        selectedInstitutionChanged,
        selectedProgramChanged,
    } = useInstitutionsHandler();

    const { signUp } = useForm();

    const [message, setMessage] = useState("");      
    const [messageType, setMessageType] = useState("success"); // 'success', 'error', 'info', 'warning'
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleClose = () => {
        setOpen(false);
    };

    const [formData, setFormData] = useState({
       name: "",
       lastName: "",
       email: "",
       password: "",
       passwordConfirmation: "",
       institution: "",
       program: "",
       programClass: "",
    });

    const [fieldError, setFieldError] = useState({
        name: false,
        lastName: false,
        email: false,
        password: false,
        passwordConfirmation: false,
        institution: false,
        program: false,
        programClass: false,
    });

    const handleFieldChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    }

    const handleFieldErrorChange = (field, isError) => {
        setFieldError((prev) => ({ ...prev, [field]: isError }));
    }

    const [showEmailVerification, setShowEmailEverification] = useState(false);

    const [marker, setMarker] = useState([
        {section: 1, status: true, activeStep: true},
        {section: 2, status: false, activeStep: false},
        {section: 3, status: false, activeStep: false},
    ]);

    useEffect(() => {
        const controller = new AbortController();
        loadInstitutions(controller).then(() => {
            handleFieldChange('institution', institution);
        });

        return () => {
            controller.abort();
        };

    }, []);

    const resetErrors = () => {
        handleFieldErrorChange('name', false);
        handleFieldErrorChange('lastName', false);
        handleFieldErrorChange('email', false);
        handleFieldErrorChange('password', false);
        handleFieldErrorChange('passwordConfirmation', false);
        handleFieldErrorChange('institution', false);
        handleFieldErrorChange('program', false);
        handleFieldErrorChange('programClass', false);
    };

    const validateField = (isValid, field) => {
        if (!isValid) {
            handleFieldErrorChange(field, true);
            setTimeout(() => {
                handleFieldErrorChange(field, false);
            }, 5000);
            return false;
        }
        return true;
    };

    const validations = {
        name: () => validateField(formData.name.trim() !== '', 'name'),
        lastName: () => validateField(formData.lastName.trim() !== '', 'lastName'),
        email: () => {
            const emailDomain = formData.email.split("@")[1];
            const allowedDomains = ["unifesp.br", "ifsp.edu.br", "aluno.ifsp.edu.br", "edu.azores.gov.pt", "ime.unicamp.br"];
            return validateField(emailDomain && allowedDomains.includes(emailDomain), 'email');
        },
        password: () => validateField(formData.password, 'password'),
        passwordConfirmation: () => validateField(formData.password === formData.passwordConfirmation, 'passwordConfirmation'),
        institution: () => validateField(formData.institution, 'institution'),
        program: () => validateField(formData.program, 'program'),
        programClass: () => validateField(formData.programClass, 'programClass'),
    };

    const validateSection = (currentSectionIndex) => {
        if (currentSectionIndex === 0) return (validations.name() && validations.lastName());
        if (currentSectionIndex === 1) return (validations.email() && validations.password() && validations.passwordConfirmation());
        if (currentSectionIndex === 2) return (validations.institution() && validations.program() && validations.programClass());
    }

    const updateMarker = (direction) => {
        const currentSectionIndex = marker.findIndex(item => item.activeStep);
        const newIndex = currentSectionIndex + direction;

        if (newIndex < 0 || newIndex >= marker.length) return;

        setMarker(marker.map((item, index) => ({
            ...item,
            status: index <= newIndex,
            activeStep: index === newIndex,
        })));
    }

    const handleNext = () => {
        resetErrors();
        if (!validateSection(marker.findIndex((item) => item.activeStep))) return;
        updateMarker(1);
    }

    const handleBack = () => {
        updateMarker(-1);
    }

    const onSubmit = async (event) => {
        event.preventDefault();
        resetErrors();
        setLoading(true);

        if (!validateSection(marker.findIndex((item) => item.activeStep))) {
            setLoading(false);
            return;
        }
        
        const newSignUpObj = {
            "class": formData.programClass,
            "first_name": formData.name,
            "last_name": formData.lastName,
            "email": formData.email,
            "password": formData.password,
        };

        const { success, message } = await signUp(newSignUpObj);
        if (!success) {
            setMessageType("error");
            setMessage(message || "Ocorreu uma falha durante o registro de estudante.");
        } else {
            setMessageType("success");
            setMessage("Registro efetuado com sucesso.");
            setTimeout(() => {
                setShowEmailEverification(true);
            }, 2000);
        }

        setOpen(true);
        setLoading(false);
    }

    return (
        <div className="signup-container">
            <PageTitleUpdater title={"Registrar-se"}/>
            <SimpleBackdrop open={loading} />
            {!showEmailVerification &&
            <div>
                <div className="signup-content">
                    <div className="marker-container">
                        {marker.map((item) => (
                            <Marker
                                key={item.section} 
                                section={item.section} 
                                status={item.status} 
                            />
                        ))}
                    </div>
                    <form className="signup-form" onSubmit={onSubmit} id="signupForm">
                        {/* name and last name */}
                        <div className={`step ${marker[0].activeStep ? "active" : "hidden"}`}>

                            <div>
                                <p className="signup-heading">Registre-se</p>
                            </div>

                            <NameSection
                                name={formData.name}
                                nameError={fieldError.name}
                                lastName={formData.lastName}
                                lastNameError={fieldError.lastName}
                                handleFieldChange={handleFieldChange}
                                handleNext={handleNext}
                            />
                        </div>
                        
                        {/* email and password */}
                        <div className={`step ${marker[1].activeStep ? "active" : "hidden"}`}>
                            <EmailAndPasswordSection 
                                email={formData.email}
                                emailError={fieldError.email}
                                passwordError={fieldError.password}
                                passwordConfirmationError={fieldError.passwordConfirmation}
                                handleFieldChange={handleFieldChange}
                                handleNext={handleNext}
                            />
                        </div>

                        {/* institution and course */}
                        <div className={`step ${marker[2].activeStep ? "active" : "hidden"}`}>
                            <InstitutionSection
                                institution={formData.institution}
                                institutionError={fieldError.institution}
                                institutions={institutions}
                                selectedInstitutionChanged={selectedInstitutionChanged}
                                program={formData.program}
                                programError={fieldError.program}
                                programs={programs}
                                selectedProgramChanged={selectedProgramChanged}
                                programClass={formData.programClass}
                                programClassError={fieldError.programClass}
                                handleFieldChange={handleFieldChange}
                                programClasses={programClasses}
                            />
                        </div>

                        {open && <MessageHandler message={message} type={messageType} open={open} onClose={handleClose} />}

                        <div className="step-buttons-container">
                            {
                            <div className="step-buttons">
                            {marker[2].activeStep &&
                                <button type="submit"> 
                                    Enviar
                                </button>
                            }

                            {!marker[2].activeStep &&
                                <button type="button" onClick={handleNext}>
                                    Próximo
                                </button>
                            }

                            {!marker[0].activeStep &&
                                <button type="button" onClick={handleBack}>
                                    Voltar
                                </button>
                            }
                            </div>
                            }
                        </div>
                    </form>
                </div>
                <div style={{ margin: "1rem 0" }}>
                    <p className="create-account-text">
                        Já possui uma conta? <Link className="primary-color create-account-link" to="/login/">Faça login</Link>
                    </p>
                </div>
            </div>
            }

            {showEmailVerification &&
                <EmailVerification email={formData.email}/>
            }
            
        </div>
    );
}

export default SignUp;
