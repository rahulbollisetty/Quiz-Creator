# Generated by Django 3.2 on 2021-05-01 13:52

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('forms', '0007_rename_is_score_exam_is_publish'),
    ]

    operations = [
        migrations.CreateModel(
            name='Responses',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('response_code', models.CharField(max_length=20)),
                ('responder_ip', models.CharField(max_length=30)),
                ('responder_email', models.EmailField(blank=True, max_length=254)),
                ('responder', models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, related_name='responder', to=settings.AUTH_USER_MODEL)),
                ('response', models.ManyToManyField(related_name='response', to='forms.Ans')),
                ('response_to', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='response_to', to='forms.exam')),
            ],
        ),
    ]
