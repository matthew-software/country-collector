# Generated by Django 5.1 on 2024-09-12 19:32

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
            name='Country',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('country_name', models.CharField(max_length=100)),
                ('capital', models.CharField(max_length=100)),
                ('flag_url', models.URLField()),
            ],
        ),
        migrations.CreateModel(
            name='UserCountry',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('collected', models.BooleanField(default=False)),
                ('collected_date', models.DateTimeField(blank=True, null=True)),
                ('country', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='api.country')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
            options={
                'unique_together': {('user', 'country')},
            },
        ),
    ]
