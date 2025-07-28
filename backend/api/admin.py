from django.contrib import admin
from .models import Raza, CategoriaPuntuacion, Caracteristica, Ejemplar, Calificacion, SensorData, Alert

admin.site.register(Raza)
admin.site.register(CategoriaPuntuacion)
admin.site.register(Caracteristica)
admin.site.register(Ejemplar)
admin.site.register(Calificacion)
admin.site.register(SensorData)
admin.site.register(Alert)
