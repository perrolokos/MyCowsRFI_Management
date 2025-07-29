import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import animalReducer from '../features/animals/animalSlice';
import breedReducer from '../features/breeds/breedSlice';
import notificationReducer from '../features/notification/notificationSlice';
import scoringReducer from '../features/scoring/scoringSlice';
import dashboardReducer from '../features/dashboard/dashboardSlice';
import alertReducer from '../features/alerts/alertSlice';

// La única responsabilidad de este archivo es importar los 'reducers' desde la
// carpeta 'features' y combinarlos en la tienda principal de Redux.
// No debe importar ningún otro archivo como 'mockAlertData'.

export const store = configureStore({
    reducer: {
        auth: authReducer,
        animals: animalReducer,
        breeds: breedReducer,
        notification: notificationReducer,
        scoring: scoringReducer,
        dashboard: dashboardReducer,
        alerts: alertReducer,
    },
});