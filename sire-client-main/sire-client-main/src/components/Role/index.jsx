import * as React from 'react';
import PropTypes from 'prop-types';
import Avatar from '@mui/material/Avatar';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { blue } from '@mui/material/colors';
import FaceIcon from '@mui/icons-material/Face';
import SchoolIcon from '@mui/icons-material/School';
import RateReviewIcon from '@mui/icons-material/RateReview';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';

const Role = (props) => {
    const { onClose, availableRoles, open } = props;
    const [roles, setRoles] = React.useState([]);

    React.useEffect(() => {
        if(!availableRoles) return;
        
        const newRoles = availableRoles.map((role) => {
            // Mapeamento exato com os nomes que vêm do Django
            switch(role) {
                case 'Student':
                    return { name: 'Entrar como Estudante', value: role, icon: <FaceIcon /> };
                case 'Professor':
                    return { name: 'Entrar como Professor', value: role, icon: <SchoolIcon /> };
                case 'Revisor':
                    return { name: 'Entrar como Revisor', value: role, icon: <RateReviewIcon /> };
                case 'Admin': 
                    return { name: 'Entrar como Admin', value: role, icon: <AdminPanelSettingsIcon /> };
                default:
                    return { name: `Entrar como ${role}`, value: role, icon: <FaceIcon /> };
            }
        });
    
        setRoles(newRoles);
    }, [availableRoles]);

    const handleListItemClick = (value) => {
        onClose(value);
    };

    // Impede fechar clicando fora se for a seleção inicial obrigatória
    const handleClose = (event, reason) => {
        if (reason && reason === "backdropClick") return;
        onClose(null);
    };

    return (
        <Dialog onClose={handleClose} open={open}>
            <DialogTitle sx={{ textAlign: 'center' }}>Escolha seu perfil de acesso</DialogTitle>
            <List sx={{ pt: 0, px: 2, pb: 2 }}>
                {roles.map((role) => (
                    <ListItem disableGutters key={role.value}>
                        <ListItemButton 
                            onClick={() => handleListItemClick(role.value)}
                            sx={{ 
                                borderRadius: 2, 
                                mb: 1, 
                                border: '1px solid #eee',
                                '&:hover': { backgroundColor: '#f5f5f5' } 
                            }}
                        >
                            <ListItemAvatar>
                                <Avatar sx={{ bgcolor: blue[100], color: blue[600] }}>
                                    { role.icon }
                                </Avatar>
                            </ListItemAvatar>
                            <ListItemText 
                                primary={role.name} 
                                primaryTypographyProps={{ fontWeight: 'medium' }}
                            />
                        </ListItemButton>
                    </ListItem>
                ))}
            </List>
        </Dialog>
    );
}

Role.propTypes = {
    onClose: PropTypes.func.isRequired,
    open: PropTypes.bool.isRequired,
    availableRoles: PropTypes.array.isRequired,
};

export default Role;