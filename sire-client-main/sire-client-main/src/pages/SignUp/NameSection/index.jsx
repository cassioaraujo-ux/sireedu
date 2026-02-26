import React from "react";
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';

const NameSection = ({
    name,
    nameError,
    lastName,
    lastNameError,
    handleFieldChange,
    handleNext
}) => {
    return (
        <div>
            {nameError && <span className="error-message">Nome é um campo obrigatório</span>}
            <FormControl fullWidth sx={{ width: { xs: '350px', sm: '500px' }, marginBottom: '10px' }}>
                <OutlinedInput
                    id="name"
                    placeholder="Primeiro nome"
                    value={name}
                    error={nameError}
                    onChange={(e) => handleFieldChange('name', e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleNext();
                        }
                    }}
                    required
                />
            </FormControl>

            {lastNameError && <span className="error-message">Sobrenome é um campo obrigatório</span>}
            <FormControl fullWidth sx={{ width: { xs: '350px', sm: '500px' } }}>
                <OutlinedInput
                    id="last-name"
                    placeholder="Último nome"
                    value={lastName}
                    error={lastNameError}
                    onChange={(e) => handleFieldChange('lastName', e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleNext();
                        }
                    }}
                    required
                />
            </FormControl>
        </div>
    );
};

export default NameSection;