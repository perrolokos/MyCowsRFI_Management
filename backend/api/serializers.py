from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Raza, CategoriaPuntuacion, Caracteristica, Ejemplar, Calificacion, SensorData, Alert

class UserSerializer(serializers.ModelSerializer):
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ('username', 'email', 'password', 'password2')
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password': 'Las contraseñas no coinciden.'})
        return data

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password']
        )
        return user

class RazaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Raza
        fields = '__all__'

class CaracteristicaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Caracteristica
        fields = '__all__'

class CategoriaPuntuacionSerializer(serializers.ModelSerializer):
    caracteristicas = CaracteristicaSerializer(many=True, read_only=True)

    class Meta:
        model = CategoriaPuntuacion
        fields = '__all__'

class ScoreTemplateSerializer(serializers.Serializer):
    categories = CategoriaPuntuacionSerializer(many=True)
    characteristics = CaracteristicaSerializer(many=True)

class EjemplarSerializer(serializers.ModelSerializer):
    foto_url = serializers.SerializerMethodField()

    class Meta:
        model = Ejemplar
        fields = '__all__'

    def get_foto_url(self, obj):
        if obj.foto:
            return self.context['request'].build_absolute_uri(obj.foto.url)
        return None

class CalificacionSerializer(serializers.ModelSerializer):
    score = serializers.FloatField(source='puntuacion_obtenida')
    animalName = serializers.CharField(source='ejemplar.nombre', read_only=True)
    animalIdentifier = serializers.CharField(source='ejemplar.identificador', read_only=True)
    animalPhotoUrl = serializers.SerializerMethodField()

    class Meta:
        model = Calificacion
        fields = ('id', 'ejemplar', 'caracteristica', 'score', 'fecha_calificacion', 'evaluador', 'animalName', 'animalIdentifier', 'animalPhotoUrl')

    def get_animalPhotoUrl(self, obj):
        if obj.ejemplar and obj.ejemplar.foto:
            return self.context['request'].build_absolute_uri(obj.ejemplar.foto.url)
        return None

class SensorDataSerializer(serializers.ModelSerializer):
    class Meta:
        model = SensorData
        fields = '__all__'

class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '__all__'

class IndividualScoreSerializer(serializers.Serializer):
    caracteristica_id = serializers.IntegerField()
    puntuacion_obtenida = serializers.FloatField()

class ScoreSubmissionSerializer(serializers.Serializer):
    scores = serializers.ListField(child=IndividualScoreSerializer())

class RecentScoreAnimalSerializer(serializers.ModelSerializer):
    animalName = serializers.CharField(source='nombre', read_only=True)
    animalIdentifier = serializers.CharField(source='identificador', read_only=True)
    score = serializers.FloatField(source='score_total', read_only=True)
    date = serializers.DateField(source='last_score_date', read_only=True)
    animalPhotoUrl = serializers.SerializerMethodField()

    class Meta:
        model = Ejemplar
        fields = ('id', 'animalName', 'animalIdentifier', 'score', 'date', 'animalPhotoUrl')

    def get_animalPhotoUrl(self, obj):
        if obj.foto:
            request = self.context.get('request')
            if request is not None:
                return request.build_absolute_uri(obj.foto.url)
        return None