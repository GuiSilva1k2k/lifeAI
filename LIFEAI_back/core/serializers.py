from rest_framework import serializers
from .models import imc, imc_user_base

class ImcSerializer(serializers.ModelSerializer):
    class Meta:
        model = imc
        fields = ['idade', 'genero', 'peso', 'altura', 'imc_res', 'classificacao']

class ImcBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = imc_user_base
        exclude = ['id_usuario']