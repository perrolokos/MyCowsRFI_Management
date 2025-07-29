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
import { loginUser } from '../features/auth/authSlice';

// Esquema de validación
const LoginSchema = Yup.object().shape({
    username: Yup.string().required('El nombre de usuario es obligatorio'),
    password: Yup.string().required('La contraseña es obligatoria'),
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

export const LoginPage = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isLoading } = useSelector((state) => state.auth);

    const handleSubmit = async (values) => {
        await dispatch(loginUser(values)).unwrap();
        navigate('/dashboard');
    };

    return (
        <Container component="main" maxWidth="xs">
            <Paper elevation={6} sx={{ p: 4, mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
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
                                label="Nombre de Usuario"
                                autoFocus
                            />
                            <Field
                                name="password"
                                component={FormikTextField}
                                label="Contraseña"
                                type="password"
                            />
                            <Box sx={{ mt: 3, position: 'relative' }}>
                                <Button
                                    type="submit"
                                    fullWidth
                                    variant="contained"
                                    disabled={isSubmitting || isLoading}
                                >
                                    {isLoading ? <CircularProgress size={24} color="inherit" /> : 'Acceder'}
                                </Button>
                            </Box>
                            <Grid container justifyContent="flex-end" sx={{ mt: 2 }}>
                                <Grid item>
                                    <Link component={RouterLink} to="/register" variant="body2">
                                        ¿No tienes una cuenta? Regístrate
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