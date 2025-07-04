# Generated by Django 5.2.1 on 2025-06-26 20:53

import django.db.models.deletion
from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='dica',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('classificacao', models.CharField(db_column='classificacao')),
                ('dica_imc', models.TextField(db_column='dica')),
            ],
            options={
                'db_table': 'dica',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='checklist',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data', models.DateField(db_column='data')),
                ('created_at', models.DateTimeField(auto_now_add=True, db_column='created_at')),
                ('id_usuario', models.ForeignKey(db_column='id_usuario', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'checklist',
                'ordering': ['-data'],
                'unique_together': {('id_usuario', 'data')},
            },
        ),
        migrations.CreateModel(
            name='atividade',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('descricao', models.TextField(db_column='descricao')),
                ('done', models.BooleanField(db_column='done', default=False)),
                ('checklist', models.ForeignKey(db_column='id_checklist', on_delete=django.db.models.deletion.CASCADE, to='core.checklist')),
            ],
            options={
                'db_table': 'atividade',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='imc',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('data_consulta', models.DateField(db_column='data_consulta')),
                ('idade', models.IntegerField(db_column='idade')),
                ('sexo', models.CharField(db_column='sexo', max_length=10)),
                ('peso', models.FloatField(db_column='peso')),
                ('altura', models.FloatField(db_column='altura')),
                ('imc_res', models.FloatField(blank=True, db_column='imc_res', null=True)),
                ('classificacao', models.CharField(blank=True, db_column='classificacao', max_length=30, null=True)),
                ('id_usuario', models.ForeignKey(db_column='id_usuario', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'imc',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='imc_user_base',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nome', models.CharField(db_column='nome', max_length=10)),
                ('idade', models.IntegerField(db_column='idade')),
                ('peso', models.FloatField(db_column='peso')),
                ('altura', models.FloatField(db_column='altura')),
                ('sexo', models.CharField(db_column='sexo', max_length=10)),
                ('imc_res', models.FloatField(blank=True, db_column='imc_res', null=True)),
                ('classificacao', models.CharField(blank=True, db_column='classificacao', max_length=30, null=True)),
                ('objetivo', models.CharField(db_column='objetivo', max_length=200)),
                ('id_usuario', models.ForeignKey(db_column='id_usuario', on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'db_table': 'imc_user_base',
                'ordering': ['id'],
            },
        ),
        migrations.CreateModel(
            name='pontuacao_check',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('qtd_total_atv', models.PositiveIntegerField(db_column='qtd_total_atv', default=False)),
                ('qtd_atv_done', models.PositiveIntegerField(db_column='qtd_atv_done', default=False)),
                ('porcentagem', models.FloatField(db_column='porcentagem', default=False)),
                ('criado_em', models.DateTimeField(auto_now_add=True)),
                ('checklist', models.OneToOneField(on_delete=django.db.models.deletion.CASCADE, related_name='pontuacao', to='core.checklist')),
            ],
            options={
                'db_table': 'pontuacao_check',
                'ordering': ['id'],
            },
        ),
    ]
