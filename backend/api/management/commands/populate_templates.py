import re
from django.core.management.base import BaseCommand
from api.models import Raza, CategoriaPuntuacion, Caracteristica

class Command(BaseCommand):
    help = 'Populates the database with predefined scoring templates for different breeds.'

    def handle(self, *args, **options):
        # WARNING: This command will DELETE all existing CategoriaPuntuacion and Caracteristica objects.
        # This is done to ensure a clean population and avoid duplicate key errors.
        self.stdout.write(self.style.WARNING('Deleting existing CategoriaPuntuacion and Caracteristica objects...'))
        Caracteristica.objects.all().delete()
        CategoriaPuntuacion.objects.all().delete()
        self.stdout.write(self.style.SUCCESS('Existing objects deleted.'))

        templates_data = {
            "BROWN SWISS": {
                "Sistema Mamario": {
                    "ponderacion": 40,
                    "caracteristicas": [
                        {"nombre": "Inserción anterior de la ubre", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Colocación de pezon anterior", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Longitud de pezón", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Profundidad de la ubre", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Altura de la ubre posterior", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Ligamentos suspensor medio", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Colocación de pezon posterior", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Anchura de la ubre trasera", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Inclinación de la ubre", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                    ]
                },
                "Fuerza Lechera": {
                    "ponderacion": 20,
                    "caracteristicas": [
                        {"nombre": "Angularidad", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Fortaleza", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                    ]
                },
                "Patas y Pezuñas": {
                    "ponderacion": 20,
                    "caracteristicas": [
                        {"nombre": "Ángulo de pezuñas", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Patas vista lateral", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Locomoción", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Patas vista posterior", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Coxo femoral", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                    ]
                },
                "Tren Anterior y Capacidad": {
                    "ponderacion": 15,
                    "caracteristicas": [
                        {"nombre": "Estatura", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Profundidad", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Condición corporal", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                    ]
                },
                "Grupa": {
                    "ponderacion": 5,
                    "caracteristicas": [
                        {"nombre": "Ángulo de la grupa", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Ancho de la grupa", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                    ]
                },
            },
            "HOLSTEIN": {
                "Sistema Mamario": {
                    "ponderacion": 40,
                    "caracteristicas": [
                        {"nombre": "Inserción anterior de la ubre", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Colocación de pezon anterior", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Longitud de pezón", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Profundidad de la ubre", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Altura de la ubre posterior", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Ligamentos suspensor medio", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Colocación de pezon posterior", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Anchura de la ubre trasera", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Inclinación de la ubre", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                    ]
                },
                "Fuerza Lechera": {
                    "ponderacion": 20,
                    "caracteristicas": [
                        {"nombre": "Angularidad", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Fortaleza", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                    ]
                },
                "Patas y Pezuñas": {
                    "ponderacion": 20,
                    "caracteristicas": [
                        {"nombre": "Ángulo de pezuñas", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Patas vista lateral", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Locomoción", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Patas vista posterior", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Coxo femoral", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                    ]
                },
                "Tren Anterior y Capacidad": {
                    "ponderacion": 15,
                    "caracteristicas": [
                        {"nombre": "Estatura", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Profundidad", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Condición corporal", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                    ]
                },
                "Grupa": {
                    "ponderacion": 5,
                    "caracteristicas": [
                        {"nombre": "Ángulo de la grupa", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Ancho de la grupa", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                    ]
                },
            },
            "JERSEY": {
                "Sistema Mamario": {
                    "ponderacion": 40,
                    "caracteristicas": [
                        {"nombre": "Inserción anterior de la ubre", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Colocación de pezon anterior", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Longitud de pezón", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Profundidad de la ubre", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Altura de la ubre posterior", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Ligamentos suspensor medio", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Colocación de pezon posterior", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Anchura de la ubre trasera", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Inclinación de la ubre", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                    ]
                },
                "Fuerza Lechera": {
                    "ponderacion": 20,
                    "caracteristicas": [
                        {"nombre": "Angularidad", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Fortaleza", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                    ]
                },
                "Patas y Pezuñas": {
                    "ponderacion": 20,
                    "caracteristicas": [
                        {"nombre": "Ángulo de pezuñas", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Patas vista lateral", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Locomoción", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Patas vista posterior", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Coxo femoral", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                    ]
                },
                "Tren Anterior y Capacidad": {
                    "ponderacion": 15,
                    "caracteristicas": [
                        {"nombre": "Estatura", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Profundidad", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                        {"nombre": "Condición corporal", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                    ]
                },
                "Grupa": {
                    "ponderacion": 5,
                    "caracteristicas": [
                        {"nombre": "Ángulo de la grupa", "puntaje_ideal": 5, "rango_aceptado_min": 4, "rango_aceptado_max": 6},
                        {"nombre": "Ancho de la grupa", "puntaje_ideal": 9, "rango_aceptado_min": 7, "rango_aceptado_max": 9},
                    ]
                },
            },
        }

        for breed_name, categories_data in templates_data.items():
            breed, created = Raza.objects.get_or_create(nombre=breed_name)
            if created:
                self.stdout.write(self.style.SUCCESS(f'Created Breed: {breed_name}'))
            else:
                self.stdout.write(self.style.WARNING(f'Breed already exists: {breed_name}'))

            for category_name, category_data in categories_data.items():
                category, created = CategoriaPuntuacion.objects.get_or_create(
                    raza=breed,
                    nombre=category_name,
                    ponderacion=category_data["ponderacion"]
                )
                if created:
                    self.stdout.write(self.style.SUCCESS(f'Created Category: {category_name} for {breed_name}'))
                else:
                    self.stdout.write(self.style.WARNING(f'Category already exists: {category_name} for {breed_name}'))

                for char_data in category_data["caracteristicas"]:
                    # Extraer rango aceptado y convertirlo a float
                    rango_str = f"{char_data['rango_aceptado_min']} a {char_data['rango_aceptado_max']}"
                    
                    caracteristica, created = Caracteristica.objects.get_or_create(
                        categoria=category,
                        nombre=char_data["nombre"],
                        puntaje_ideal=char_data["puntaje_ideal"],
                        rango_aceptado_min=char_data["rango_aceptado_min"],
                        rango_aceptado_max=char_data["rango_aceptado_max"]
                    )
                    if created:
                        self.stdout.write(self.style.SUCCESS(f'Created Characteristic: {char_data["nombre"]} for {category_name}'))
                    else:
                        self.stdout.write(self.style.WARNING(f'Characteristic already exists: {char_data["nombre"]} for {category_name}'))

        self.stdout.write(self.style.SUCCESS('Successfully populated scoring templates.'))
