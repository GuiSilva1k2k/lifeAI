from rest_framework import serializers
from .models import imc

class ImcSerializer(serializers.ModelSerializer):
    class Meta:
        model = imc
        fields = ['idade', 'genero', 'peso', 'altura', 'imc_res', 'classificacao']

