// Este archivo simula la respuesta que el backend debería enviar.
// Lo hemos creado a partir de los datos de las plantillas que proporcionaste.
const mockData = {
    // Para la demo, usamos el ID de la raza como clave (ej. 1: Holstein, 2: Brown Swiss)
    // El backend debería tener una relación similar.
    "1": { // Holstein
        categories: [
            { id: 1, nombre: "Sistema Mamario", ponderacion: 40 },
            { id: 2, nombre: "Fuerza Lechera", ponderacion: 20 },
            { id: 3, nombre: "Patas y Pezuñas", ponderacion: 20 },
            { id: 4, nombre: "Tren Anterior y Capacidad", ponderacion: 15 },
            { id: 5, nombre: "Grupa", ponderacion: 5 },
        ],
        characteristics: [
            { id: 1, categoria: 1, nombre: "Inserción anterior de la ubre", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 2, categoria: 1, nombre: "Colocación de pezón anterior", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 3, categoria: 1, nombre: "Longitud de pezón", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 4, categoria: 1, nombre: "Profundidad de la ubre", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 5, categoria: 1, nombre: "Altura de la ubre posterior", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 6, categoria: 1, nombre: "Ligamento suspensor medio", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 7, categoria: 1, nombre: "Colocación de pezón posterior", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 8, categoria: 1, nombre: "Anchura de la ubre trasera", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 9, categoria: 1, nombre: "Inclinación de la ubre", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 10, categoria: 2, nombre: "Angularidad", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 11, categoria: 2, nombre: "Fortaleza", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 12, categoria: 3, nombre: "Ángulo de pezuñas", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 13, categoria: 3, nombre: "Patas vista lateral", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 14, categoria: 3, nombre: "Locomoción", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 15, categoria: 3, nombre: "Patas vista posterior", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 16, categoria: 3, nombre: "Coxo femoral", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 17, categoria: 4, nombre: "Estatura", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 18, categoria: 4, nombre: "Profundidad", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 19, categoria: 4, nombre: "Condición corporal", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 20, categoria: 5, nombre: "Ángulo de la grupa", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 21, categoria: 5, nombre: "Ancho de la grupa", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
        ]
    },
    "2": { // Brown Swiss
        // La estructura es idéntica a Holstein, solo cambian los valores si es necesario.
        // Para esta demo, asumimos la misma estructura de calificación.
        categories: [
            { id: 1, nombre: "Sistema Mamario", ponderacion: 40 },
            { id: 2, nombre: "Fuerza Lechera", ponderacion: 20 },
            { id: 3, nombre: "Patas y Pezuñas", ponderacion: 20 },
            { id: 4, nombre: "Tren Anterior y Capacidad", ponderacion: 15 },
            { id: 5, nombre: "Grupa", ponderacion: 5 },
        ],
        characteristics: [
            // Las características son las mismas que Holstein según las plantillas
            { id: 1, categoria: 1, nombre: "Inserción anterior de la ubre", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 2, categoria: 1, nombre: "Colocación de pezón anterior", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 3, categoria: 1, nombre: "Longitud de pezón", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 4, categoria: 1, nombre: "Profundidad de la ubre", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 5, categoria: 1, nombre: "Altura de la ubre posterior", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 6, categoria: 1, nombre: "Ligamento suspensor medio", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 7, categoria: 1, nombre: "Colocación de pezón posterior", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 8, categoria: 1, nombre: "Anchura de la ubre trasera", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 9, categoria: 1, nombre: "Inclinación de la ubre", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 10, categoria: 2, nombre: "Angularidad", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 11, categoria: 2, nombre: "Fortaleza", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 12, categoria: 3, nombre: "Ángulo de pezuñas", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 13, categoria: 3, nombre: "Patas vista lateral", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 14, categoria: 3, nombre: "Locomoción", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 15, categoria: 3, nombre: "Patas vista posterior", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 16, categoria: 3, nombre: "Coxo femoral", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 17, categoria: 4, nombre: "Estatura", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 18, categoria: 4, nombre: "Profundidad", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 19, categoria: 4, nombre: "Condición corporal", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 20, categoria: 5, nombre: "Ángulo de la grupa", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 21, categoria: 5, nombre: "Ancho de la grupa", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
        ]
    },
    "3": { // Jersey
        // Ídem.
        categories: [
            { id: 1, nombre: "Sistema Mamario", ponderacion: 40 },
            { id: 2, nombre: "Fuerza Lechera", ponderacion: 20 },
            { id: 3, nombre: "Patas y Pezuñas", ponderacion: 20 },
            { id: 4, nombre: "Tren Anterior y Capacidad", ponderacion: 15 },
            { id: 5, nombre: "Grupa", ponderacion: 5 },
        ],
        characteristics: [
            { id: 1, categoria: 1, nombre: "Inserción anterior de la ubre", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 2, categoria: 1, nombre: "Colocación de pezón anterior", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 3, categoria: 1, nombre: "Longitud de pezón", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 4, categoria: 1, nombre: "Profundidad de la ubre", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 5, categoria: 1, nombre: "Altura de la ubre posterior", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 6, categoria: 1, nombre: "Ligamento suspensor medio", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 7, categoria: 1, nombre: "Colocación de pezón posterior", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 8, categoria: 1, nombre: "Anchura de la ubre trasera", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 9, categoria: 1, nombre: "Inclinación de la ubre", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 10, categoria: 2, nombre: "Angularidad", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 11, categoria: 2, nombre: "Fortaleza", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 12, categoria: 3, nombre: "Ángulo de pezuñas", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 13, categoria: 3, nombre: "Patas vista lateral", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 14, categoria: 3, nombre: "Locomoción", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 15, categoria: 3, nombre: "Patas vista posterior", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 16, categoria: 3, nombre: "Coxo femoral", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 17, categoria: 4, nombre: "Estatura", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 18, categoria: 4, nombre: "Profundidad", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
            { id: 19, categoria: 4, nombre: "Condición corporal", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 20, categoria: 5, nombre: "Ángulo de la grupa", puntaje_ideal: 5, rango_aceptado_min: 4, rango_aceptado_max: 6 },
            { id: 21, categoria: 5, nombre: "Ancho de la grupa", puntaje_ideal: 9, rango_aceptado_min: 7, rango_aceptado_max: 9 },
        ]
    },
};

export const getMockTemplateByBreedId = (breedId) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const template = mockData[breedId];
            if (template) {
                resolve(template);
            } else {
                reject("No se encontró una plantilla simulada para esta raza.");
            }
        }, 500); // Simulamos una pequeña demora de red
    });
};