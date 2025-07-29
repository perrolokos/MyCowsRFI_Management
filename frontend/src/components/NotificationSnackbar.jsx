import React from 'react';
import { Snackbar, Alert } from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { hideNotification } from '../features/notification/notificationSlice';

const NotificationSnackbar = () => {
    const dispatch = useDispatch();
    const { open, message, severity } = useSelector((state) => state.notification);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        dispatch(hideNotification());
    };

    return (
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Alert onClose={handleClose} severity={severity} sx={{ width: '100%' }} variant="filled">
                {message}
            </Alert>
        </Snackbar>
    );
};

export default NotificationSnackbar;