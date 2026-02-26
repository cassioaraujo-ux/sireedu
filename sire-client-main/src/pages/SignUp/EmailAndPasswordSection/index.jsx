import React, { useState } from "react";
import FormControl from '@mui/material/FormControl';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

const EmailAndPasswordSection = ({
    email,
    emailError,
    passwordError,
    passwordConfirmationError,
    handleFieldChange,
    handleNext
}) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);
    const handleClickShowPasswordConfirmation = () => setShowPasswordConfirmation((show) => !show);

    const handleMouseDownPassword = (event) => {
        event.preventDefault();
    };

    const handleMouseDownPasswordConfirmation = (event) => {
        event.preventDefault();
    };

    return (
        <div>
            {emailError && <span className="error-message">Utilize um e-mail institucional</span>}
            <FormControl fullWidth sx={{ width: { xs: '350px', sm: '500px' }, marginBottom: '10px' }}>
                <OutlinedInput
                    id="email"
                    placeholder="E-mail de acesso"
                    value={email}
                    onChange={(e) => handleFieldChange('email', e.target.value)}
                    error={emailError}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleNext();
                        }
                    }}
                    required
                />
            </FormControl>
            
            {passwordError && <span className="error-message">Senha é um campo obrigatório</span>}
            <FormControl sx={{ width: { xs: '350px', sm: '500px' }, marginBottom: '10px' }}>
            <OutlinedInput
                id="password"
                placeholder="Senha"
                type={showPassword ? 'text' : 'password'}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                error={passwordError}
                onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        handleNext();
                    }
                }}
                required
                endAdornment={
                <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                    >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
                }
            />
            </FormControl>

            {passwordConfirmationError && <span className="error-message">As senhas devem ser iguais</span>}
            <FormControl sx={{ width: { xs: '350px', sm: '500px' } }}>
                <OutlinedInput
                    id="password-confirmation"
                    placeholder="Confirmar senha"
                    type={showPasswordConfirmation ? 'text' : 'password'}
                    onChange={(e) => handleFieldChange('passwordConfirmation', e.target.value)}
                    error={passwordConfirmationError}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            handleNext();
                        }
                    }}
                    required
                    endAdornment={
                    <InputAdornment position="end">
                        <IconButton
                            aria-label="toggle password visibility"
                            onClick={handleClickShowPasswordConfirmation}
                            onMouseDown={handleMouseDownPasswordConfirmation}
                            edge="end"
                        >
                        {showPasswordConfirmation ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                    </InputAdornment>
                    }
                />
            </FormControl>
        </div>
    );
};

export default EmailAndPasswordSection;