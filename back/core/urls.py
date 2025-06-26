from django.urls import path
from .viewsets import (
    RegisterView,
    LoginView,
    LogoutView,
    ImcCreateAPIView,
    ImcBaseAPIView,
    ImcBaseDashAPIView,
    ImcBaseRecAPIView,
    DesempenhoImc,
    RegistrosImc,
    ImcDeleteAPIView,
    ChecklistCreateAPIView,
    AtividadesPorDataAPIView
)
from core.services.api_ia import chat_ia_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    path('registro/', RegisterView.as_view(), name='RegisterView'),
    path('login/', LoginView.as_view(), name='LoginView'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('imc/', ImcCreateAPIView.as_view(), name='criar_imc'),
    path('imc/historico/', DesempenhoImc.as_view(), name='desempenho-imc'),
    path('imc/registrosConsultas/', RegistrosImc.as_view(), name='registros_imc'),
    path('imc/<int:pk>/', ImcDeleteAPIView.as_view(), name='deletar_imc'),
    path('chat-ia/', chat_ia_view, name="chat-ia"),
    path('api/token', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('imc_base_perfil/', ImcBaseAPIView.as_view(), name='imc_base_perfil'),
    path('imc_base_dashboard/', ImcBaseDashAPIView.as_view(), name='imc_base_dashboard'),
    path('imc_rec/', ImcBaseRecAPIView.as_view(), name='imc_rec'),
    path('checklist/create/', ChecklistCreateAPIView.as_view(), name='checklist'),
    path('checklists/atividades-por-data/', AtividadesPorDataAPIView.as_view(), name='atividades-por-data'),
]
