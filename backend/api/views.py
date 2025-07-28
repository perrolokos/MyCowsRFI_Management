from django.contrib.auth.models import User
from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny
from .models import Raza, CategoriaPuntuacion, Caracteristica, Ejemplar, Calificacion, SensorData, Alert
from .serializers import RazaSerializer, CategoriaPuntuacionSerializer, CaracteristicaSerializer, EjemplarSerializer, CalificacionSerializer, SensorDataSerializer, AlertSerializer, UserSerializer

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = UserSerializer

class RazaViewSet(viewsets.ModelViewSet):
    queryset = Raza.objects.all()
    serializer_class = RazaSerializer

class CategoriaPuntuacionViewSet(viewsets.ModelViewSet):
    queryset = CategoriaPuntuacion.objects.all()
    serializer_class = CategoriaPuntuacionSerializer

class CaracteristicaViewSet(viewsets.ModelViewSet):
    queryset = Caracteristica.objects.all()
    serializer_class = CaracteristicaSerializer

class EjemplarViewSet(viewsets.ModelViewSet):
    queryset = Ejemplar.objects.all()
    serializer_class = EjemplarSerializer

class CalificacionViewSet(viewsets.ModelViewSet):
    queryset = Calificacion.objects.all()
    serializer_class = CalificacionSerializer

class SensorDataViewSet(viewsets.ModelViewSet):
    serializer_class = SensorDataSerializer

    def get_queryset(self):
        animal_pk = self.kwargs['animal_pk']
        return SensorData.objects.filter(ejemplar=animal_pk)

class AlertViewSet(viewsets.ModelViewSet):
    serializer_class = AlertSerializer

    def get_queryset(self):
        animal_pk = self.kwargs['animal_pk']
        return Alert.objects.filter(ejemplar=animal_pk)