import React from "react";
import "./styles.css";
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem';
import InputLabel from '@mui/material/InputLabel';

const InstitutionSection = ({
    institution,
    institutionError,
    institutions,
    selectedInstitutionChanged,
    program,
    programError,
    programs,
    selectedProgramChanged,
    programClass,
    programClassError,
    handleFieldChange,
    programClasses,
}) => {
    return (
        <div>
            {institutionError && <span className="error-message">Selecione uma institutição</span>}
            <FormControl sx={{ width: { xs: '350px', sm: '500px' }, marginBottom: '15px' }}>
                <InputLabel id="institutions-label">Instituição</InputLabel>
                    <Select
                        labelId="institutions-label"
                        id="institutions"
                        value={institution}
                        error={institutionError}
                        label="Instituição"
                        onChange={(e) => {
                            const newInstitution = e.target.value;
                            handleFieldChange('program', "");
                            handleFieldChange('programClass', "");
                            handleFieldChange('institution', newInstitution);
                            selectedInstitutionChanged(newInstitution);
                        }}
                        sx={{ fontSize: { xs: '12px', sm: '16px'} }}
                    >
                        <MenuItem value="">
                            <em>Instituição</em>
                        </MenuItem>
                        {institutions.map((inst) => (
                            <MenuItem 
                                key={inst.id}
                                value={inst.id}
                                sx={{ fontSize: { xs: '10px', sm: '14px'} }}
                            >
                                {inst.name}
                            </MenuItem>
                        ))}
                    </Select>
            </FormControl>

            {programError && <span className="error-message">Selecione um curso</span>}
            <FormControl sx={{ width: { xs: '350px', sm: '500px' }, marginBottom: '15px' }}>
                <InputLabel id="program-label">Curso</InputLabel>
                    <Select
                        labelId="program-label"
                        id="program"
                        value={program}
                        label="Curso"
                        onChange={(e) => {
                            const newProgram = e.target.value;
                            handleFieldChange('programClass', "");
                            handleFieldChange('program', newProgram);
                            selectedProgramChanged(institution, newProgram);
                        }}
                        sx={{ fontSize: { xs: '12px', sm: '16px'} }}
                    >
                        <MenuItem value="">
                            <em>Curso</em>
                        </MenuItem>
                        {programs.map((program) => (
                            <MenuItem
                                key={program.id}
                                value={program.id}
                                sx={{ fontSize: { xs: '10px', sm: '14px'} }}
                            >
                                {program.name}
                            </MenuItem>
                        ))}
                    </Select>
            </FormControl>

            {programClassError && <span className="error-message">Selecione uma turma</span>}
            <FormControl sx={{ width: { xs: '350px', sm: '500px' } }}>
                <InputLabel id="program-class-label">Turma</InputLabel>
                    <Select
                        labelId="program-class-label"
                        id="program-class"
                        value={programClass}
                        label="Turma"
                        onChange={(e) => handleFieldChange('programClass', e.target.value)}
                        sx={{ fontSize: { xs: '12px', sm: '16px'} }}
                    >
                        <MenuItem value="">
                            <em>Turma</em>
                        </MenuItem>
                        {programClasses.map((pClass) => (
                            <MenuItem
                                key={pClass.id}
                                value={pClass.id}
                                sx={{ fontSize: { xs: '10px', sm: '14px'} }}
                            >
                                {pClass.description}
                            </MenuItem>
                        ))}            
                    </Select>
            </FormControl>
        </div>
    );
}

export default InstitutionSection;