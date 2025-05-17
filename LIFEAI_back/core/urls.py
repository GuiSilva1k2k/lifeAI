from django.urls import path
from .viewsets import RegisterView, LoginView, LogoutView

urlpatterns = [
    path('registro/', RegisterView.as_view(), name='RegisterView'),
    path('login/', LoginView.as_view(), name='LoginView'),
    path('logout/', LogoutView.as_view(), name='logout'),
]
