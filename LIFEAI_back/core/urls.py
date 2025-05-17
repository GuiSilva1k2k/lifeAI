from django.urls import path
from .viewsets import RegisterView, LoginView

urlpatterns = [
    path('registro/', RegisterView.as_view(), name='RegisterView'),
    path('login/', LoginView.as_view(), name='LoginView'),
]