from rest_framework import serializers
from .models import imc, imc_user_base

class ImcSerializer(serializers.ModelSerializer):
    class Meta:
        model = imc
        fields = ['data_consulta', 'idade', 'sexo', 'peso', 'altura', 'imc_res', 'classificacao']

    def validate_data_consulta(self, value):
        user = self.context['request'].user

        # Se for atualização, ignorar o próprio registro
        if self.instance and self.instance.data_consulta == value:
            return value

        # Verifica se já existe um IMC com a mesma data para o mesmo usuário
        if imc.objects.filter(id_usuario=user, data_consulta=value).exists():
            raise serializers.ValidationError("Você já possui um registro com essa data.")
        return value

    def create(self, validated_data):
        validated_data['id_usuario'] = self.context['request'].user
        return super().create(validated_data)

class ImcBaseSerializer(serializers.ModelSerializer):
    class Meta:
        model = imc_user_base
        exclude = ['id_usuario']

class ImcBaseRecSerializer(serializers.ModelSerializer):
    class Meta:
        model = imc_user_base
        fields = ['imc_res', 'objetivo']