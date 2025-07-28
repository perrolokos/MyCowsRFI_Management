
import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/auth/authSlice';

export const Navbar = () => {
    const dispatch = useDispatch();
    const { token } = useSelector((state) => state.auth);

    const handleLogout = () => {
        dispatch(logout());
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    MyCows RFI
                </Typography>
                <Box>
                    <Button color="inherit" component={RouterLink} to="/">
                        Inicio
                    </Button>
                    {token ? (
                        <>
                            <Button color="inherit" component={RouterLink} to="/dashboard">
                                Dashboard
                            </Button>
                            <Button color="inherit" component={RouterLink} to="/animals">
                                Ejemplares
                            </Button>
                            <Button color="inherit" onClick={handleLogout}>
                                Cerrar Sesión
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={RouterLink} to="/login">
                                Iniciar Sesión
                            </Button>
                            <Button color="inherit" component={RouterLink} to="/register">
                                Registrarse
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
};
