import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import {
    Box,
    Button,
    CircularProgress,
    MenuItem,
    TextField as MuiTextField,
    InputLabel,
    Input,
    Typography
} from '@mui/material';
import { addAnimal, updateAnimal } from '../redux/animals/animalSlice';
import { fetchBreeds } from '../redux/breeds/breedSlice';
import { showNotification } from '../redux/notification/notificationSlice';

// Esquema de validación con Yup
const AnimalSchema = Yup.object().shape({
    identificador: Yup.string()
        .required('El identificador es obligatorio'),
    nombre: Yup.string()
        .required('El nombre es obligatorio'),
    raza: Yup.string()
        .required('La raza es obligatoria'),
    fecha_nacimiento: Yup.date()
        .required('La fecha de nacimiento es obligatoria')
        .max(new Date(), 'La fecha no puede ser futura'),
    peso_actual: Yup.number()
        .positive('El peso debe ser un número positivo')
        .nullable(),
    talla_actual: Yup.number()
        .positive('La talla debe ser un número positivo')
        .nullable(),
    foto: Yup.mixed() // Para el campo de archivo
        .nullable()
        .test('fileSize', 'La foto es demasiado grande (máx. 2MB)', (value) => {
            if (!value) return true; // Campo opcional
            return value.size <= 2000000; // 2MB
        })
        .test('fileType', 'Formato de foto no soportado', (value) => {
            if (!value) return true; // Campo opcional
            return ['image/jpeg', 'image/png', 'image/gif'].includes(value.type);
        }),
});

export const AnimalForm = ({ animal, onClose }) => {
    const dispatch = useDispatch();
    const { items: breeds, isLoading: breedsLoading } = useSelector((state) => state.breeds);
    const { isLoading: animalsLoading } = useSelector((state) => state.animals);

    useEffect(() => {
        // Carga las razas si no están en el store
        if (breeds.length === 0) {
            console.log("AnimalForm: Fetching breeds...");
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
        foto: null, // Inicialmente null para la subida de archivos
    };

    useEffect(() => {
        console.log("AnimalForm: Initializing form with animal data:", animal);
        console.log("AnimalForm: Current breeds in store:", breeds);
        if (animal && animal.raza) {
            console.log("AnimalForm: Animal raza ID:", animal.raza);
            const selectedBreed = breeds.find(b => b.id === animal.raza);
            console.log("AnimalForm: Found breed for animal:", selectedBreed);
        }
    }, [animal, breeds]);

    const handleSubmit = async (values, { setSubmitting, resetForm }) => {
        const formData = new FormData();
        for (const key in values) {
            // Excluir el campo 'foto' si no es un archivo o si es null/undefined
            if (key === 'foto') {
                if (values[key] instanceof File) {
                    formData.append(key, values[key]);
                } else if (animal && animal.foto && !values[key]) {
                    // Si es una edición y no se seleccionó nueva foto, pero ya tenía una,
                    // no enviar el campo 'foto' para que Django no lo borre.
                    // Si se quiere borrar la foto, se necesitaría un checkbox específico.
                } else if (values[key] === null && animal && animal.foto) {
                    // Si el usuario explícitamente borra la foto (ej. con un botón de borrar foto)
                    // Esto requeriría lógica adicional en el backend para manejar el borrado.
                    // Por ahora, si es null y ya había foto, no se envía el campo.
                } else if (values[key] === null && !animal?.foto) {
                    // Si es null y no había foto, no se envía.
                }
            } else if (values[key] !== null && values[key] !== '') {
                formData.append(key, values[key]);
            } else if (values[key] === '') {
                // Para campos vacíos que no son archivos, enviar cadena vacía si es necesario
                formData.append(key, '');
            }
        }

        // Debugging FormData content
        console.log("AnimalForm: Submitting FormData:");
        for (let pair of formData.entries()) {
            console.log(pair[0]+ ', ' + pair[1]); 
        }

        try {
            if (animal) {
                await dispatch(updateAnimal({ id: animal.id, animalData: formData })).unwrap();
                dispatch(showNotification({ message: 'Ejemplar actualizado con éxito', severity: 'success' }));
            } else {
                await dispatch(addAnimal(formData)).unwrap();
                dispatch(showNotification({ message: 'Ejemplar añadido con éxito', severity: 'success' }));
                resetForm();
            }
            onClose();
        } catch (error) {
            const errorMessage = error.response?.data?.detail || error.message || 'Ocurrió un error';
            dispatch(showNotification({ message: errorMessage, severity: 'error' }));
        } finally {
            setSubmitting(false);
        }
    };

    // Componente wrapper para integrar TextField de MUI con Formik
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
        <Formik
            initialValues={initialValues}
            validationSchema={AnimalSchema}
            onSubmit={handleSubmit}
            enableReinitialize // Permite que el formulario se reinicie si `animal` cambia
        >
            {({ isSubmitting, setFieldValue }) => (
                <Form>
                    <Field
                        name="identificador"
                        component={FormikTextField}
                        label="Identificador (RFID)"
                        required
                    />
                    <Field
                        name="nombre"
                        component={FormikTextField}
                        label="Nombre"
                        required
                    />
                    <Field
                        name="raza"
                        component={FormikTextField}
                        label="Raza"
                        select
                        required
                        disabled={breedsLoading}
                    >
                        {breedsLoading ? (
                            <MenuItem disabled><CircularProgress size={20} /></MenuItem>
                        ) : (
                            breeds.map((option) => (
                                <MenuItem key={option.id} value={option.id}>
                                    {option.nombre}
                                </MenuItem>
                            ))
                        )}
                    </Field>
                    <Field
                        name="fecha_nacimiento"
                        component={FormikTextField}
                        label="Fecha de Nacimiento"
                        type="date"
                        required
                        InputLabelProps={{ shrink: true }}
                    />
                    <Field
                        name="peso_actual"
                        component={FormikTextField}
                        label="Peso Actual (kg)"
                        type="number"
                    />
                    <Field
                        name="talla_actual"
                        component={FormikTextField}
                        label="Talla Actual (cm)"
                        type="number"
                    />
                    <Box sx={{ mt: 2, mb: 2 }}>
                        <InputLabel htmlFor="foto-upload">Foto del Ejemplar</InputLabel>
                        <Input
                            id="foto-upload"
                            name="foto"
                            type="file"
                            onChange={(event) => {
                                setFieldValue("foto", event.currentTarget.files[0]);
                            }}
                            fullWidth
                        />
                        {animal?.foto && (
                            <Box sx={{ mt: 2 }}>
                                <Typography variant="subtitle2">Foto actual:</Typography>
                                <img src={animal.foto} alt="Foto del ejemplar" style={{ maxWidth: '100px', maxHeight: '100px', objectFit: 'cover' }} />
                            </Box>
                        )}
                    </Box>
                    <Box sx={{ mt: 3, position: 'relative' }}>
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={isSubmitting || animalsLoading}
                        >
                            {animal ? 'Guardar Cambios' : 'Añadir Ejemplar'}
                        </Button>
                        {(isSubmitting || animalsLoading) && (
                            <CircularProgress
                                size={24}
                                sx={{
                                    position: 'absolute',
                                    top: '50%',
                                    left: '50%',
                                    marginTop: '-12px',
                                    marginLeft: '-12px',
                                }}
                            />
                        )}
                    </Box>
                    <Button
                        fullWidth
                        variant="outlined"
                        onClick={onClose}
                        sx={{ mt: 1 }}
                    >
                        Cancelar
                    </Button>
                </Form>
            )}
        </Formik>
    );
};