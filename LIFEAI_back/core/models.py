from django.db import models
from django.contrib.auth.models import User

class imc(models.Model):
    id_usuario = models.ForeignKey(User, db_column='id_usuario', on_delete=models.CASCADE)
    data_consulta = models.DateField(db_column='data_consulta', auto_now_add=True)
    idade = models.IntegerField(db_column='idade', null=False)
    genero = models.CharField(db_column='genero', max_length=10, null=False)
    peso = models.FloatField(db_column='peso', null=False)
    altura = models.FloatField(db_column='altura', null=False)
    imc_res = models.FloatField(db_column='imc_res', null=True, blank=True)
    classificacao = models.CharField(max_length=30, null=True, blank=True)

    class Meta:
        db_table = 'imc'
        ordering = ['id']

class dica(models.Model):
    classificacao = models.CharField(db_column='classificacao', null=False)
    dica_imc = models.TextField(db_column='dica', null=False)

    class Meta:
        db_table = 'dica'
        ordering = ['id']
