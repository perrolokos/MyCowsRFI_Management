// Este archivo simula la respuesta del backend para el endpoint del dashboard.
export const getMockDashboardData = () => {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve({
                // Datos para el gráfico de promedios por raza
                averageScoresByBreed: [
                    { breedName: 'Holstein', averageScore: 85.4 },
                    { breedName: 'Brown Swiss', averageScore: 82.1 },
                    { breedName: 'Jersey', averageScore: 88.9 },
                    { breedName: 'No Calificada', averageScore: 0 },
                ],
                // Datos para la tabla de calificaciones recientes
                recentScores: [
                    { id: 1, animalName: 'Bessy', animalIdentifier: 'HOL-001', score: 92.5, date: '2023-10-27' },
                    { id: 2, animalName: 'Daisy', animalIdentifier: 'JER-003', score: 89.0, date: '2023-10-27' },
                    { id: 3, animalName: 'Bruna', animalIdentifier: 'BWS-002', score: 85.7, date: '2023-10-26' },
                    { id: 4, animalName: 'Manchitas', animalIdentifier: 'HOL-005', score: 81.2, date: '2023-10-25' },
                    { id: 5, animalName: 'Lola', animalIdentifier: 'JER-001', score: 91.3, date: '2023-10-24' },
                ]
            });
        }, 500); // Simulamos una pequeña demora de red
    });
};