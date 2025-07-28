from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import RazaViewSet, CategoriaPuntuacionViewSet, CaracteristicaViewSet, EjemplarViewSet, CalificacionViewSet, SensorDataViewSet, AlertViewSet, RegisterView

router = DefaultRouter()
router.register(r'breeds', RazaViewSet)
router.register(r'categorias_puntuacion', CategoriaPuntuacionViewSet)
router.register(r'caracteristicas', CaracteristicaViewSet)
router.register(r'animals', EjemplarViewSet) # Changed from ejemplares to animals
router.register(r'calificaciones', CalificacionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('register/', RegisterView.as_view(), name='register'),
    path('animals/<int:animal_pk>/sensor-data/', SensorDataViewSet.as_view({'get': 'list', 'post': 'create'}), name='animal-sensor-data-list'),
    path('animals/<int:animal_pk>/alerts/', AlertViewSet.as_view({'get': 'list', 'post': 'create'}), name='animal-alerts-list'),
]