import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    IconButton,
    Toolbar,
    Typography,
} from '@mui/material';
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logo1 from '../logo1.png';

const Navbar: React.FC = () => {
    const { user, isLoading, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (location.pathname === "/") {
        return <Box className={"home-action-box"}>
            <Box sx={{ display: 'flex' }}>
                <Button color="inherit" className='home-action-button p-2' component={Link} to="/login" onMouseMove={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                }}>
                    Anmelden
                </Button>
                <Button color="inherit" className='home-action-button register p-2' component={Link} to="/register" onMouseMove={e => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    e.currentTarget.style.setProperty('--mouse-x', `${e.clientX - rect.left}px`);
                    e.currentTarget.style.setProperty('--mouse-y', `${e.clientY - rect.top}px`);
                }}>
                    Registrieren
                </Button>
            </Box>
        </Box>;
    }

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (isLoading) {
        return (
            <AppBar position="static" className={"spattle-navbar"}>
                <Toolbar>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Spattle
                    </Typography>
                    <CircularProgress color="inherit" size={24} />
                </Toolbar>
            </AppBar>
        );
    }

    return (
        <AppBar position="static" className={"spattle-navbar"}>
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                        <img className="pt-2" src={logo1} alt="Spattle Logo" style={{ maxWidth: '150px', width: '100%' }} />
                    </Link>
                </Typography>
                <IconButton
                    color="inherit"
                    onClick={() => navigate('/contact')}
                    sx={{ mr: 2 }}
                    aria-label="Kontakt"
                >
                    <HelpOutlineIcon />
                </IconButton>
                <Box sx={{ display: 'flex', gap: 2 }}>
                    {isAuthenticated ? (
                        <>
                            <Button color="inherit" component={Link} to="/battles">
                                Battles
                            </Button>
                            <Typography
                                variant="body1"
                                sx={{ alignSelf: 'center', mr: 2 }}
                            >
                                Welcome, {user?.username}!
                            </Typography>
                            <Button color="inherit" onClick={handleLogout}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={Link} to="/login">
                                Login
                            </Button>
                            <Button color="inherit" component={Link} to="/register">
                                Register
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
