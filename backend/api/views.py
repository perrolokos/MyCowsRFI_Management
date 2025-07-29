from django.contrib.auth.models import User
from rest_framework import viewsets, generics
from django.http import Http404
from rest_framework.permissions import AllowAny
from .models import Raza, CategoriaPuntuacion, Caracteristica, Ejemplar, Calificacion, SensorData, Alert
from .serializers import RazaSerializer, CategoriaPuntuacionSerializer, CaracteristicaSerializer, EjemplarSerializer, CalificacionSerializer, SensorDataSerializer, AlertSerializer, UserSerializer, ScoreSubmissionSerializer, ScoreTemplateSerializer, RecentScoreAnimalSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
from datetime import date, datetime, timedelta
from django.db.models import Avg

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

    @action(detail=False, methods=['post'], url_path='animal/(?P<animal_pk>[^/.]+)/scores')
    def submit_animal_scores(self, request, animal_pk=None):
        serializer = ScoreSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        scores_data = serializer.validated_data['scores']
        ejemplar_id = animal_pk

        try:
            ejemplar = Ejemplar.objects.get(pk=ejemplar_id)
        except Ejemplar.DoesNotExist:
            return Response({'detail': 'Ejemplar no encontrado.'}, status=status.HTTP_404_NOT_FOUND)

        total_score = 0
        total_possible_score = 0
        today = date.today()

        with transaction.atomic():
            for score_data in scores_data:
                caracteristica_id = score_data['caracteristica_id']
                puntuacion_obtenida = score_data['puntuacion_obtenida']

                try:
                    caracteristica = Caracteristica.objects.get(pk=caracteristica_id)
                except Caracteristica.DoesNotExist:
                    return Response({'detail': f'Característica con ID {caracteristica_id} no encontrada.'}, status=status.HTTP_400_BAD_REQUEST)

                # Guardar la calificación individual
                Calificacion.objects.update_or_create(
                    ejemplar=ejemplar,
                    caracteristica=caracteristica,
                    fecha_calificacion=today,
                    defaults={
                        'puntuacion_obtenida': puntuacion_obtenida,
                        'evaluador': request.user if request.user.is_authenticated else None,
                    }
                )

                # Calcular la contribución al score total
                # Asumiendo que la ponderación de la categoría se aplica al puntaje ideal de la característica
                # y luego se escala por el puntaje obtenido.
                categoria = caracteristica.categoria
                
                # Para calcular el score total, necesitamos la suma de los puntajes ideales de las características
                # dentro de cada categoría, y luego aplicar la ponderación de la categoría.
                # Esto requiere que CategoriaPuntuacion tenga un campo para el puntaje ideal total de sus características.
                # Por ahora, haremos una simplificación: sumaremos los puntajes obtenidos y los compararemos con los ideales.
                
                # Una forma más precisa sería:
                # (puntuacion_obtenida / caracteristica.puntaje_ideal) * (categoria.ponderacion / 100) * (puntaje_ideal_total_de_la_categoria)
                # Pero para simplificar y dado que el frontend envía solo la puntuación obtenida, 
                # calcularemos un score ponderado simple basado en la proporción del puntaje ideal.

                # Suma de los puntajes obtenidos ponderados
                total_score += (puntuacion_obtenida / caracteristica.puntaje_ideal) * categoria.ponderacion
                total_possible_score += categoria.ponderacion

            # Normalizar el score total a una escala de 0-100 si total_possible_score es > 0
            final_score = (total_score / total_possible_score) * 100 if total_possible_score > 0 else 0

            # Actualizar el ejemplar
            ejemplar.score_total = final_score
            ejemplar.last_score_date = today
            ejemplar.save()

        return Response({'message': 'Calificaciones guardadas y score actualizado con éxito.', 'score_total': final_score}, status=status.HTTP_201_CREATED)


class SensorDataViewSet(viewsets.ModelViewSet):
    serializer_class = SensorDataSerializer

    def get_queryset(self):
        animal_pk = self.kwargs['animal_pk']
        return SensorData.objects.filter(ejemplar=animal_pk).order_by('-timestamp')

class AnimalSensorDataView(generics.ListAPIView):
    serializer_class = SensorDataSerializer

    def get_queryset(self):
        animal_id = self.kwargs['animal_id']
        # Obtener los datos de las últimas 24 horas para el animal específico
        time_threshold = datetime.now() - timedelta(days=1)
        return SensorData.objects.filter(ejemplar_id=animal_id, timestamp__gte=time_threshold).order_by('timestamp')

class AlertViewSet(viewsets.ModelViewSet):
    serializer_class = AlertSerializer

    def get_queryset(self):
        animal_pk = self.kwargs['animal_pk']
        return Alert.objects.filter(ejemplar=animal_pk)

class ScoreTemplateView(generics.RetrieveAPIView):
    serializer_class = ScoreTemplateSerializer

    def get_object(self):
        breed_id = self.kwargs['breed_id']
        try:
            raza = Raza.objects.get(pk=breed_id)
        except Raza.DoesNotExist:
            raise Http404

        # Fetch categories related to the breed
        categories = CategoriaPuntuacion.objects.filter(raza=raza)
        # Fetch all characteristics related to these categories
        characteristics = Caracteristica.objects.filter(categoria__in=categories)

        # Return a dictionary that matches the ScoreTemplateSerializer structure
        return {
            'categories': categories,
            'characteristics': characteristics
        }

class DashboardScoresView(generics.RetrieveAPIView):
    def get(self, request, *args, **kwargs):
        # Calcular puntuaciones promedio por raza
        average_scores_by_breed_raw = Ejemplar.objects.filter(score_total__isnull=False).values('raza__nombre').annotate(
            average_score=Avg('score_total')
        ).order_by('raza__nombre')

        average_scores_by_breed = [{'breedName': item['raza__nombre'], 'averageScore': item['average_score']} for item in average_scores_by_breed_raw]

        # Obtener los 10 ejemplares con calificaciones más recientes
        recent_scores = Ejemplar.objects.filter(last_score_date__isnull=False).order_by('-last_score_date')[:10]
        recent_scores_data = RecentScoreAnimalSerializer(recent_scores, many=True, context={'request': request}).data

        return Response({
            'averageScoresByBreed': average_scores_by_breed,
            'recentScores': recent_scores_data
        })