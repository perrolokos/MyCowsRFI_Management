import React, { useState, useEffect } from 'react';
import {
    AppBar, Toolbar, Typography, Button, Box, IconButton, Badge,
    Menu, MenuItem, ListItemIcon, ListItemText, Divider, Tooltip
} from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';
import { fetchAlerts, markAsRead } from '../features/alerts/alertSlice';
import PetsIcon from '@mui/icons-material/Pets';
import NotificationsIcon from '@mui/icons-material/Notifications';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import WarningIcon from '@mui/icons-material/Warning';

// Diccionario de iconos para alertas
const alertIcons = {
    'FIEBRE': <WarningIcon fontSize="small" color="error" />,
    'CELO': <CheckCircleIcon fontSize="small" color="info" />,
    'INACTIVIDAD': <WarningIcon fontSize="small" color="warning" />,
};

export const Navbar = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { token } = useSelector((state) => state.auth);
    const { items: alerts, unreadCount } = useSelector((state) => state.alerts);
    const [anchorEl, setAnchorEl] = useState(null);

    useEffect(() => {
        if (token) {
            dispatch(fetchAlerts());
        }
    }, [token, dispatch]);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };
    
    const handleMarkAsRead = (id) => {
        dispatch(markAsRead(id));
    };

    return (
        <AppBar position="static">
            <Toolbar>
                <PetsIcon sx={{ mr: 1 }} />
                <Typography variant="h6" component={RouterLink} to="/" sx={{ flexGrow: 1, color: 'inherit', textDecoration: 'none' }}>
                    MyCows RFI
                </Typography>
                <Box>
                    {token ? (
                        <>
                            <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
                            <Button color="inherit" component={RouterLink} to="/animals">Ejemplares</Button>
                            
                            <Tooltip title="Alertas">
                                <IconButton color="inherit" onClick={handleMenuOpen}>
                                    <Badge badgeContent={unreadCount} color="error">
                                        <NotificationsIcon />
                                    </Badge>
                                </IconButton>
                            </Tooltip>

                            <Button color="inherit" onClick={() => { dispatch(logout()); navigate('/login'); }}>Cerrar Sesión</Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" component={RouterLink} to="/login">Iniciar Sesión</Button>
                            <Button color="inherit" component={RouterLink} to="/register">Registrarse</Button>
                        </>
                    )}
                </Box>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    sx={{ mt: 1 }}
                >
                    <MenuItem disabled><Typography variant="subtitle1">Centro de Alertas</Typography></MenuItem>
                    <Divider />
                    {alerts.length > 0 ? alerts.map(alert => (
                        <MenuItem key={alert.id} onClick={() => handleMarkAsRead(alert.id)} disabled={alert.is_read}>
                            <ListItemIcon>{alertIcons[alert.alert_type] || <WarningIcon fontSize="small" />}</ListItemIcon>
                            <ListItemText 
                                primary={`${alert.ejemplar.nombre} (${alert.alert_type})`} 
                                secondary={alert.message}
                                sx={{ opacity: alert.is_read ? 0.5 : 1 }}
                            />
                        </MenuItem>
                    )) : <MenuItem>No hay alertas</MenuItem>}
                </Menu>
            </Toolbar>
        </AppBar>
    );
};