from rest_framework import serializers
from .models import imc, imc_user_base

class ImcSerializer(serializers.ModelSerializer):
    class Meta:
        model = imc
        fields = ['idade', 'sexo', 'peso', 'altura', 'imc_res', 'classificacao']

class ImcBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = imc_user_base
        exclude = ['id_usuario']

class ImcBaseRecSerializer(serializers.ModelSerializer):
    class Meta:
        model = imc_user_base
        fields = ['imc_res', 'objetivo']