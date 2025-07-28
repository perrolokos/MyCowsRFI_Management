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
import { useNavigate } from 'react-router-dom';
import { showNotification } from '../redux/notification/notificationSlice';
import api from '../api/api'; // Usamos la instancia de axios configurada

const RegisterSchema = Yup.object().shape({
    username: Yup.string()
        .min(3, 'El usuario debe tener al menos 3 caracteres')
        .required('El usuario es obligatorio'),
    email: Yup.string()
        .email('Email inválido')
        .required('El email es obligatorio'),
    password: Yup.string()
        .min(6, 'La contraseña debe tener al menos 6 caracteres')
        .required('La contraseña es obligatoria'),
    password2: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
        .required('Confirma tu contraseña'),
});

export const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [registerError, setRegisterError] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);

    const handleSubmit = async (values, { setSubmitting }) => {
        setIsLoading(true);
        setRegisterError(null);
        try {
            // La URL para el registro en Django REST Framework suele ser /api/register/
            await api.post('/register/', {
                username: values.username,
                email: values.email,
                password: values.password,
                password2: values.password2, // Django DRF puede requerir password2
            });
            dispatch(showNotification({ message: 'Registro exitoso. Por favor, inicia sesión.', severity: 'success' }));
            navigate('/login');
        } catch (err) {
            const errorMessage = err.response?.data?.detail || err.message || 'Error en el registro';
            setRegisterError(errorMessage);
            dispatch(showNotification({ message: errorMessage, severity: 'error' }));
        } finally {
            setSubmitting(false);
            setIsLoading(false);
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
                    Registrarse
                </Typography>
                <Formik
                    initialValues={{ username: '', email: '', password: '', password2: '' }}
                    validationSchema={RegisterSchema}
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
                                name="email"
                                component={FormikTextField}
                                label="Email"
                            />
                            <Field
                                name="password"
                                component={FormikTextField}
                                label="Contraseña"
                                type="password"
                            />
                            <Field
                                name="password2"
                                component={FormikTextField}
                                label="Confirmar Contraseña"
                                type="password"
                            />
                            {registerError && (
                                <Alert severity="error" sx={{ mt: 2, width: '100%' }}>
                                    {registerError}
                                </Alert>
                            )}
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                                disabled={isSubmitting || isLoading}
                            >
                                {isLoading ? <CircularProgress size={24} /> : 'Registrarse'}
                            </Button>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
};