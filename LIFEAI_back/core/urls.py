from django.urls import path
from .viewsets import register_view

urlpatterns = [
    path('registro/', register_view.as_view(), name='register_view'),
]