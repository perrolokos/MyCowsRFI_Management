import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    CircularProgress,
    TextField as MuiTextField,
    Typography,
    Container,
    Paper,
    Alert
} from '@mui/material';
import { loginUser } from '../redux/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../redux/notification/notificationSlice';

const LoginSchema = Yup.object().shape({
    username: Yup.string().required('El usuario es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria'),
});

export const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading, error } = useSelector((state) => state.auth);

    const handleSubmit = async (values, { setSubmitting }) => {
        try {
            await dispatch(loginUser(values)).unwrap();
            dispatch(showNotification({ message: 'Inicio de sesión exitoso', severity: 'success' }));
            navigate('/dashboard');
        } catch (err) {
            dispatch(showNotification({ message: 'Error al iniciar sesión', severity: 'error' }));
        } finally {
            setSubmitting(false);
        }
    };

    const FormikTextField = ({ field, form: { touched, errors }, ...props }) => (
        <MuiTextField
            {...field}
            {...props}
            error={touched[field.name] && Boolean(errors[field.name])}
            helperText={touched[field.name] && errors[field.name]}
            fullWidth
            margin="normal"
        />
    );

    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 8 }}>
            <Paper elevation={3} sx={{ p: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Iniciar Sesión
                </Typography>
                <Formik
                    initialValues={{ username: '', password: '' }}
                    validationSchema={LoginSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form style={{ width: '100%', marginTop: '1rem' }}>
                            <Field
                                name="username"
                                component={FormikTextField}
                                label="Usuario"
                                autoFocus
                            />
                            <Field
                                name="password"
                                component={FormikTextField}
                                label="Contraseña"
                                type="password"
                            />
                            {error && typeof error === 'string' && (
                                <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                                    {error}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isSubmitting || isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Iniciar Sesión'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
};