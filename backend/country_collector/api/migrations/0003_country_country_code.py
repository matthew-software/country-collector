# Generated by Django 5.1 on 2024-09-17 20:45

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_country_capital_alter_country_flag_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='country',
            name='country_code',
            field=models.CharField(default='', max_length=2, unique=True),
            preserve_default=False,
        ),
    ]
