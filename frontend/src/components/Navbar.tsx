import {
    AppBar,
    Box,
    Button,
    CircularProgress,
    Toolbar,
    Typography,
    IconButton,
} from '@mui/material';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

const Navbar: React.FC = () => {
    const { user, isLoading, logout, isAuthenticated } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/');
    };

    if (isLoading) {
        return (
            <AppBar position="static">
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
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>
                        Spattle
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
                    <Button color="inherit" component={Link} to="/battles">
                        Battles
                    </Button>
                    {isAuthenticated ? (
                        <>
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
