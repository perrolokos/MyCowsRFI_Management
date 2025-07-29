from django.core.management.base import BaseCommand
from api.models import Ejemplar, SensorData
from datetime import datetime, timedelta
import random

class Command(BaseCommand):
    help = 'Seeds sensor data for two existing cows.'

    def handle(self, *args, **options):
        self.stdout.write(self.style.WARNING('Attempting to seed sensor data for two cows...'))

        # --- IMPORTANTE: Reemplaza estos IDs con IDs de ejemplares reales de tu base de datos ---
        # Puedes encontrar los IDs en el panel de administración de Django en la sección Ejemplares.
        ejemplar_ids = [1, 2] # Ejemplo: IDs de dos vacas existentes
        # ---------------------------------------------------------------------------------------

        for ej_id in ejemplar_ids:
            try:
                ejemplar = Ejemplar.objects.get(id=ej_id)
                self.stdout.write(self.style.SUCCESS(f'Found Ejemplar: {ejemplar.nombre} (ID: {ejemplar.id})'))

                # Generar datos de sensor para las últimas 24 horas
                now = datetime.now()
                for i in range(24):
                    timestamp = now - timedelta(hours=i)
                    temperatura = round(random.uniform(38.0, 39.5), 1) # Temperatura entre 38.0 y 39.5
                    actividad = random.randint(100, 1000) # Actividad entre 100 y 1000

                    SensorData.objects.create(
                        ejemplar=ejemplar,
                        timestamp=timestamp,
                        temperatura=temperatura,
                        actividad=actividad
                    )
                    self.stdout.write(self.style.SUCCESS(f'  - Added sensor data for {ejemplar.nombre} at {timestamp.strftime('%Y-%m-%d %H:%M')}'))

            except Ejemplar.DoesNotExist:
                self.stdout.write(self.style.ERROR(f'Ejemplar with ID {ej_id} not found. Skipping.'))
            except Exception as e:
                self.stdout.write(self.style.ERROR(f'An error occurred for Ejemplar ID {ej_id}: {e}'))

        self.stdout.write(self.style.SUCCESS('Sensor data seeding process completed.'))
