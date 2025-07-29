import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
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
    Link,
    Grid
} from '@mui/material';
import { registerUser } from '../features/auth/authSlice';

// Esquema de validación
const RegisterSchema = Yup.object().shape({
    username: Yup.string()
        .min(3, 'Debe tener al menos 3 caracteres')
        .required('El usuario es obligatorio'),
    email: Yup.string()
        .email('Email inválido')
        .required('El email es obligatorio'),
    password: Yup.string()
        .min(6, 'Debe tener al menos 6 caracteres')
        .required('La contraseña es obligatoria'),
    password2: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Las contraseñas deben coincidir')
        .required('Debes confirmar tu contraseña'),
});

// Componente de campo de texto para Formik
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


export const RegisterPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.auth);

    const handleSubmit = async (values) => {
        await dispatch(registerUser(values)).unwrap();
        navigate('/login');
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={6} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <Typography component="h1" variant="h5">
                    Crear Cuenta
                </Typography>
                <Formik
                    initialValues={{ username: '', email: '', password: '', password2: '' }}
                    validationSchema={RegisterSchema}
                    onSubmit={handleSubmit}
                >
                    {({ isSubmitting }) => (
                        <Form style={{ width: '100%', marginTop: '1rem' }}>
                            <Field name="username" component={FormikTextField} label="Nombre de Usuario" autoFocus />
                            <Field name="email" component={FormikTextField} label="Email" type="email" />
                            <Field name="password" component={FormikTextField} label="Contraseña" type="password" />
                            <Field name="password2" component={FormikTextField} label="Confirmar Contraseña" type="password" />
                            
                            <Box sx={{ mt: 3, position: 'relative' }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={isSubmitting || isLoading}
                                >
                                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Registrarse'}
                                </Button>
                            </Box>
                            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                                <Grid item>
                                    <Link component={RouterLink} to="/login" variant="body2">
                                        ¿Ya tienes una cuenta? Inicia sesión
                                    </Link>
                                </Grid>
                            </Grid>
                        </Form>
                    )}
                </Formik>
            </Paper>
        </Container>
    );
};