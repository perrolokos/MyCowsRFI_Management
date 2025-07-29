import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Box, Button, CircularProgress, MenuItem, TextField as MuiTextField,
    InputLabel, Input, Typography, Grid
} from '@mui/material';
import { addAnimal, updateAnimal } from '../features/animals/animalSlice';
import { fetchBreeds } from '../features/breeds/breedSlice';

// Esquema de validación
const AnimalSchema = Yup.object().shape({
    identificador: Yup.string().required('El identificador es obligatorio'),
    nombre: Yup.string().required('El nombre es obligatorio'),
    raza: Yup.string().required('La raza es obligatoria'),
    fecha_nacimiento: Yup.date()
        .required('La fecha de nacimiento es obligatoria')
        .max(new Date(), 'La fecha no puede ser en el futuro'),
    peso_actual: Yup.number().positive('El peso debe ser positivo').nullable(),
    talla_actual: Yup.number().positive('La talla debe ser positiva').nullable(),
    foto: Yup.mixed().nullable()
        .test('fileSize', 'La foto es muy grande (máx. 2MB)', value => !value || value.size <= 2000000)
        .test('fileType', 'Formato no soportado', value => !value || ['image/jpeg', 'image/png', 'image/gif'].includes(value.type)),
});

// Componente TextField para Formik
const FormikTextField = ({ field, form: { touched, errors }, ...props }) => (
    <MuiTextField
        {...field}
        {...props}
        error={touched[field.name] && Boolean(errors[field.name])}
        helperText={touched[field.name] && errors[field.name]}
        fullWidth
    />
);

export const AnimalForm = ({ animal, onClose }) => {
    const dispatch = useDispatch();
    const { items: breeds, isLoading: breedsLoading } = useSelector((state) => state.breeds);
    const { isLoading: animalsLoading } = useSelector((state) => state.animals);

    useEffect(() => {
        if (breeds.length === 0) {
            dispatch(fetchBreeds());
        }
    }, [dispatch, breeds.length]);

    const initialValues = {
        identificador: animal?.identificador || '',
        nombre: animal?.nombre || '',
        raza: animal?.raza || '',
        fecha_nacimiento: animal?.fecha_nacimiento ? new Date(animal.fecha_nacimiento).toISOString().split('T')[0] : '',
        peso_actual: animal?.peso_actual || '',
        talla_actual: animal?.talla_actual || '',
        foto: null,
    };

    const handleSubmit = async (values, { setSubmitting }) => {
        const formData = new FormData();
        Object.keys(values).forEach(key => {
            if (key === 'foto' && values[key]) {
                formData.append(key, values[key]);
            } else if (values[key] !== null && values[key] !== '') {
                formData.append(key, values[key]);
            }
        });
        
        if (animal) {
            await dispatch(updateAnimal({ id: animal.id, animalData: formData }));
        } else {
            await dispatch(addAnimal(formData));
        }
        
        setSubmitting(false);
        onClose();
    };

    return (
        <Formik
            initialValues={initialValues}
            validationSchema={AnimalSchema}
            onSubmit={handleSubmit}
            enableReinitialize
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form>
                    <Grid container spacing={2} sx={{ pt: 1 }}>
                        <Grid item xs={12} sm={6}><Field name="identificador" component={FormikTextField} label="Identificador (RFID)" required /></Grid>
                        <Grid item xs={12} sm={6}><Field name="nombre" component={FormikTextField} label="Nombre" required /></Grid>
                        <Grid item xs={12} sm={6}>
                            <Field name="raza" component={FormikTextField} label="Raza" select required disabled={breedsLoading}>
                                {breedsLoading ? <MenuItem disabled><CircularProgress size={20} /></MenuItem> :
                                    breeds.map((option) => (
                                        <MenuItem key={option.id} value={option.id}>{option.nombre}</MenuItem>
                                    ))
                                }
                            </Field>
                        </Grid>
                        <Grid item xs={12} sm={6}><Field name="fecha_nacimiento" component={FormikTextField} label="Fecha de Nacimiento" type="date" required InputLabelProps={{ shrink: true }} /></Grid>
                        <Grid item xs={12} sm={6}><Field name="peso_actual" component={FormikTextField} label="Peso Actual (kg)" type="number" /></Grid>
                        <Grid item xs={12} sm={6}><Field name="talla_actual" component={FormikTextField} label="Talla Actual (cm)" type="number" /></Grid>
                        <Grid item xs={12}>
                            <InputLabel htmlFor="foto-upload">Foto del Ejemplar</InputLabel>
                            <Input id="foto-upload" name="foto" type="file" fullWidth onChange={(event) => setFieldValue("foto", event.currentTarget.files[0])} />
                            {animal?.foto && !initialValues.foto && (
                                <Box sx={{ mt: 1 }}>
                                    <Typography variant="caption">Foto actual:</Typography>
                                    <img src={animal.foto} alt="Foto actual" style={{ width: '80px', height: '80px', objectFit: 'cover', display: 'block', marginTop: '4px' }} />
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                    <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                        <Button onClick={onClose} variant="outlined">Cancelar</Button>
                        <Button type="submit" variant="contained" disabled={isSubmitting || animalsLoading}>
                            {isSubmitting || animalsLoading ? <CircularProgress size={24} /> : (animal ? 'Guardar Cambios' : 'Añadir Ejemplar')}
                        </Button>
                    </Box>
                </Form>
            )}
        </Formik>
    );
};