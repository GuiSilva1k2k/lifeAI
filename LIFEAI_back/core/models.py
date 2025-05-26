from django.db import models
from django.contrib.auth.models import User

class imc(models.Model):
    data_consulta = models.DateField(db_column='data_consulta', auto_now_add=True)
    idade = models.IntegerField(db_column='idade', null=False)
    sexo = models.CharField(db_column='sexo', max_length=10, null=False)
    peso = models.FloatField(db_column='peso', null=False)
    altura = models.FloatField(db_column='altura', null=False)
    imc_res = models.FloatField(db_column='imc_res', null=True, blank=True)
    classificacao = models.CharField(db_column='classificacao', max_length=30, null=True, blank=True)
    id_usuario = models.ForeignKey(User, db_column='id_usuario', on_delete=models.CASCADE)

    class Meta:
        db_table = 'imc'
        ordering = ['id']

class dica(models.Model):
    classificacao = models.CharField(db_column='classificacao', null=False)
    dica_imc = models.TextField(db_column='dica', null=False)

    class Meta:
        db_table = 'dica'
        ordering = ['id']

class imc_user_base(models.Model):
    nome = models.CharField(db_column='nome', max_length=10, null=False)
    idade = models.IntegerField(db_column='idade', null=False)
    peso = models.FloatField(db_column='peso', null=False)
    altura = models.FloatField(db_column='altura', null=False)
    sexo = models.CharField(db_column='sexo', max_length=10, null=False)
    imc_res = models.FloatField(db_column='imc_res', null=True, blank=True)
    classificacao = models.CharField(db_column='classificacao', max_length=30, null=True, blank=True)
    objetivo = models.CharField(db_column='objetivo', max_length=200, null=False)
    id_usuario = models.ForeignKey(User, db_column='id_usuario', on_delete=models.CASCADE)

    class Meta:
        db_table = 'imc_user_base'
        ordering = ['id']