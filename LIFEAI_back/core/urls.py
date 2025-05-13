from rest_framework.routers import DefaultRouter

from core import viewsets

router = DefaultRouter()

router.register('pessoas', viewsets.PessoasViewSet);

urlpatterns = router.urls