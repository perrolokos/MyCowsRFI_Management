// Simula la respuesta del backend para el endpoint de alertas.
export const getMockAlerts = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve([
                { id: 1, ejemplar: { identificador: 'HOL-001', nombre: 'Bessy' }, alert_type: 'FIEBRE', message: 'Temperatura alta detectada: 40.5°C', timestamp: new Date().toISOString(), is_read: false },
                { id: 2, ejemplar: { identificador: 'JER-003', nombre: 'Daisy' }, alert_type: 'CELO', message: 'Aumento significativo de actividad. Posible celo.', timestamp: new Date(Date.now() - 3600 * 1000 * 2).toISOString(), is_read: false },
                { id: 3, ejemplar: { identificador: 'BWS-002', nombre: 'Bruna' }, alert_type: 'INACTIVIDAD', message: 'Periodo de inactividad inusualmente largo.', timestamp: new Date(Date.now() - 3600 * 1000 * 5).toISOString(), is_read: true },
            ]);
        }, 300);
    });
};