# Generated by Django 4.2.7 on 2023-11-26 01:13

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Order',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('stock_name', models.CharField(max_length=4)),
                ('price', models.DecimalField(decimal_places=2, max_digits=16)),
                ('order_type', models.CharField(choices=[('SELL', 'SELL'), ('BUY', 'BUY')], max_length=5)),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('quantity_total', models.IntegerField()),
                ('quantity_remaining', models.IntegerField()),
                ('status', models.CharField(choices=[('CANCELED', 'CANCELED'), ('COMPLETED', 'COMPLETED'), ('PROCESSING', 'PROCESSING')], default='PROCESSING', max_length=10)),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.RESTRICT, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='OrderTransaction',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('quantity', models.IntegerField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('buy_order', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='source_transactions', to='orders.order')),
                ('sell_order', models.ForeignKey(null=True, on_delete=django.db.models.deletion.RESTRICT, related_name='target_transactions', to='orders.order')),
            ],
        ),
    ]
