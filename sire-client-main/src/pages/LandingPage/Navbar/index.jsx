import React, { useState } from "react";
import "./styles.css";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../../../assets/logotipo.PNG";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import WidgetsIcon from '@mui/icons-material/Widgets';
import GroupIcon from '@mui/icons-material/Group';
import PlayLessonIcon from '@mui/icons-material/PlayLesson';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { HiOutlineBars3 } from "react-icons/hi2";
import { Link as LinkScroll } from "react-scroll";


const Navbar = () => {
    const[openMenu, setOpenMenu] = useState(false);
    const navigate = useNavigate();

    const toSignUp = async (event) => {
        event.preventDefault();
        navigate("/signup/");
    };

    const menuOptions = [
        {
            text: "Home",
            icon: <HomeIcon />,
            link: "home"
        },
        {
            text: "Sobre",
            icon: <InfoIcon />,
            link: "about"
        },
		{
            text: "Diferenciais",
            icon: <WidgetsIcon />,
            link: "differences"
        },
		{
            text: "Público",
            icon: <GroupIcon />,
            link: "intended"
        },
		{
            text: "O que oferecemos?",
            icon: <PlayLessonIcon />,
            link: "our-offer"
        },
    ]

    return (
        <nav>
            <div className="navbar-logo-container">
                <img src={Logo} alt="Logo" />
            </div>
            <div className="navbar-items-container">
                <div className="navbar-links-container">
                    {menuOptions.map((item) => (
                        <LinkScroll
                            className="link"
                            key={item.text}
                            to={item.link}
                            smooth={true}
                            duration={500}
                            offset={-50}
                        >
                            {item.text}
                        </LinkScroll>
                    ))}
                </div>
                <div className="navbar-access-container">
                    <Link to="login">Login</Link>
                    <button className="primary-button" onClick={toSignUp}>Sign Up</button>
                </div>
            </div>
            <div className="navbar-menu-container">
                <HiOutlineBars3 onClick={ () => setOpenMenu(true) }/>
            </div>
            <Drawer open={openMenu} onClose={ () => setOpenMenu(false) } anchor="right">
                <Box
                    sx={{ width: 250 }}
                    role="presentation"
                    onClick={ () => setOpenMenu(false) }
                    onKeyDown={ () => setOpenMenu(false) }
                >
                    <List>
                        {menuOptions.map((item) => (
                        <ListItem key={item.text} disablePadding>
                            <ListItemButton>
                                <ListItemIcon>{item.icon}</ListItemIcon>
                                <LinkScroll
                                    to={item.link}
                                    smooth={true}
                                    duration={500}
                                    offset={-50}
                                >
                                    <ListItemText primary={item.text} />
                                </LinkScroll>
                            </ListItemButton>
                        </ListItem>
                        ))}
                        
                        <Divider />

                        <ListItem key={"login"} disablePadding>
                            <ListItemButton>
                                <ListItemIcon><AccountBoxIcon /></ListItemIcon>
                                    <Link className="navbar-access-link" to="login">
                                        <ListItemText primary="Login" />
                                    </Link>
                            </ListItemButton>
                        </ListItem>
                        
                        <ListItem key={"sign-up"} disablePadding>
                            <ListItemButton>
                                <ListItemIcon><AppRegistrationIcon /></ListItemIcon>
                                <Link className="navbar-access-link" to="signup">
                                    <ListItemText primary="Registrar" />
                                </Link>
                            </ListItemButton>
                        </ListItem>
                
                    </List>
                    <Divider />
                </Box>
            </Drawer>
        </nav>
    );

}

export default Navbar;