# Generated by Django 3.0.5 on 2020-06-05 17:48

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('projsite', '0010_auto_20200528_2311'),
    ]

    operations = [
        migrations.AlterField(
            model_name='users',
            name='password',
            field=models.CharField(max_length=300),
        ),
    ]
