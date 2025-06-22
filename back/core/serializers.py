from rest_framework import serializers
from .models import imc, imc_user_base
from datetime import date

class ImcSerializer(serializers.ModelSerializer):
    class Meta:
        model = imc
        fields = ['id', 'data_consulta', 'idade', 'sexo', 'peso', 'altura', 'imc_res', 'classificacao']

    def validate_data_consulta(self, value):
        user = self.context['request'].user
        if value > date.today():
            raise serializers.ValidationError("Data não pode ser no futuro.")
        if self.instance and self.instance.data_consulta == value:
            return value
        if imc.objects.filter(id_usuario=user, data_consulta=value).exists():
            raise serializers.ValidationError("Você já possui um registro com essa data.")
        return value

    def create(self, validated_data):
        validated_data['id_usuario'] = self.context['request'].user
        return super().create(validated_data)

class DesempenhoImcGrafico(serializers.ModelSerializer):
    class Meta:
        model = imc
        fields = ['data_consulta', 'imc_res']

class ImcBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = imc_user_base
        exclude = ['id_usuario']

class ImcBaseRecSerializer(serializers.ModelSerializer):
    class Meta:
        model = imc_user_base
        fields = ['imc_res', 'objetivo']
