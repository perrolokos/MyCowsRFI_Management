
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../redux/auth/authSlice';
import animalReducer from '../redux/animals/animalSlice';
import breedReducer from '../redux/breeds/breedSlice';
import notificationReducer from '../redux/notification/notificationSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        animals: animalReducer,
        breeds: breedReducer,
        notification: notificationReducer,
        // Añade aquí otros reducers si los tienes (ej. scoring, iot, reports)
    },
});
