import * as React from 'react';
import "./styles.css";
import { Context } from "../../Context/AuthContext" 
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from './Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import config from '../../services/config';
import Logo from "../../assets/logotipo.PNG";
import { useNavigate } from 'react-router-dom';
import Role from '../Role';

const SESSION_STORAGE_KEY = config.tokenName;

const Header = () => {
    const pages = ['Início'];
    const [settings, setSettings] = React.useState(['Sair']);
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = React.useState(null);
    const [anchorElUser, setAnchorElUser] = React.useState(null);

    const { handleLogout, switchRole } = React.useContext(Context);
    
    // Estados para troca de perfil
    const [openRoleDialog, setOpenRoleDialog] = React.useState(false);
    const [availableRoles, setAvailableRoles] = React.useState([]);
    const [userFirstName, setUserFirstName] = React.useState("");
    const [currentRole, setCurrentRole] = React.useState("");

    React.useEffect(() => {
        // Carrega dados da sessão atual
        const sessionData = localStorage.getItem(SESSION_STORAGE_KEY);
        if (sessionData) {
            const { user, role } = JSON.parse(sessionData);
            setUserFirstName(user ? user.first_name : "User");
            setCurrentRole(role);
            setAvailableRoles(user.groups || []);

            // Se tiver mais de um grupo, adiciona opção de troca
            if (user.groups && user.groups.length > 1) {
                setSettings(["Trocar de perfil", "Sair"]);
            } else {
                setSettings(["Sair"]);
            }
        }
    }, []);

    const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
    const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
    const handleCloseNavMenu = () => setAnchorElNav(null);
    const handleCloseUserMenu = () => setAnchorElUser(null);

    const handleUserMenuClick = (setting) => {
        handleCloseUserMenu();
        if (setting === 'Sair') {
            handleLogout();
        } else if (setting === 'Trocar de perfil') {
            setOpenRoleDialog(true);
        }
    };

    const handlePageClick = (page) => {
        handleCloseNavMenu();
        if (page === "Início") {
            navigate("/home");
        }
    }

    const handleRoleSwitch = (newRole) => {
        setOpenRoleDialog(false);
        if (newRole && newRole !== currentRole) {
            switchRole(newRole);
        }
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "#40A3A6", boxShadow: 'rgba(0, 0, 0, 0.16) 0px 1px 4px' }} data-tutorial="header">
            <Container maxWidth="lg">
                <Toolbar disableGutters>
                    {/* Logo Desktop */}
                    <Typography 
                        variant="h6"
                        noWrap
                        component="a"
                        href="/home"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: '#fff',
                            textDecoration: 'none',
                        }}
                    >
                        <img className="header-logo" src={Logo} alt="Logo" />
                    </Typography>

                    {/* Menu Mobile */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            onClick={handleOpenNavMenu}
                            color="inherit"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'left' }}
                            open={Boolean(anchorElNav)}
                            onClose={handleCloseNavMenu}
                            sx={{ display: { xs: 'block', md: 'none' } }}
                        >
                            {pages.map((page) => (
                                <MenuItem key={page} onClick={() => handlePageClick(page)}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>

                    {/* Logo Mobile */}
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href="/home"
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: '#fff',
                            textDecoration: 'none',
                        }}
                    >
                        <img className="header-logo" src={Logo} alt="Logo" />
                    </Typography>

                    {/* Menu Desktop */}
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {pages.map((page) => (
                            <Button
                                key={page}
                                onClick={() => handlePageClick(page)}
                                sx={{ my: 2, color: '#fff', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>

                    {/* Avatar e Configurações */}
                    <Box sx={{ flexGrow: 0, display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="body2" sx={{ display: { xs: 'none', sm: 'block' }, mr: 1 }}>
                            {/* Mostra o papel atual */}
                            {currentRole === 'Student' ? 'Aluno' : currentRole}
                        </Typography>
                        <Tooltip title="Configurações">
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar name={userFirstName} />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                            keepMounted
                            transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {settings.map((setting) => (
                                <MenuItem key={setting} onClick={() => handleUserMenuClick(setting)}>
                                    <Typography textAlign="center">{setting}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>

            {/* Modal de Troca de Perfil */}
            {openRoleDialog && (
                <Role 
                    open={openRoleDialog} 
                    onClose={handleRoleSwitch} 
                    availableRoles={availableRoles} 
                />
            )}
        </AppBar>
    );
}

export default Header;