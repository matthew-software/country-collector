# Generated by Django 5.1 on 2024-09-13 17:29

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='country',
            name='capital',
            field=models.CharField(blank=True, max_length=100, null=True),
        ),
        migrations.AlterField(
            model_name='country',
            name='flag_url',
            field=models.URLField(blank=True, null=True),
        ),
    ]