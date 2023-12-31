# Generated by Django 4.2.7 on 2023-12-14 11:27

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Candidate',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('candidateName', models.CharField(blank=True, null=True)),
                ('candidateRollNo', models.CharField(blank=True, null=True)),
                ('venueName', models.CharField(blank=True, null=True)),
                ('examDate', models.DateField(blank=True, null=True)),
                ('startTime', models.TimeField(blank=True, null=True)),
                ('endTime', models.TimeField(blank=True, null=True)),
                ('examBatch', models.BigIntegerField(blank=True, null=True)),
                ('examLabNo', models.CharField(blank=True, null=True)),
                ('fatherName', models.CharField(blank=True, null=True)),
                ('address', models.CharField(blank=True, null=True)),
                ('contactNo', models.BigIntegerField(blank=True, null=True)),
                ('examId', models.CharField(blank=True, null=True)),
                ('invigilatorId', models.CharField(blank=True, null=True)),
                ('takeCount', models.BigIntegerField(blank=True, null=True)),
                ('benchNo', models.BigIntegerField(blank=True, null=True)),
                ('registrationNo', models.BigIntegerField(blank=True, null=True)),
                ('floorNumber', models.BigIntegerField(blank=True, null=True)),
                ('candidatePhoto', models.CharField(blank=True, null=True)),
                ('registerPhoto', models.CharField(blank=True, null=True)),
                ('cpId', models.CharField(blank=True, null=True)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('updated_at', models.DateTimeField(auto_now=True)),
            ],
            options={
                'db_table': 'candidate_details',
                'ordering': ['-created_at'],
            },
        ),
    ]
